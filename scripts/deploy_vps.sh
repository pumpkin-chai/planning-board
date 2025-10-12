#!/usr/bin/env bash
set -euo pipefail

# Simple VPS deployment helper for Amazon Linux EC2 environments
# Assumptions for this variant:
#  - `git`, `nvm`, `node` (installed via nvm), and `pnpm` are already available for the deploy user
#  - The VPS already has nginx/certbot configured externally
# Usage: sudo ./scripts/deploy_vps.sh [-d <app-dir>] [-b <branch>] [-u <app-user>] [-s <service-name>]

# Default APP_DIR to the repository root (assumes script is at ./scripts/deploy_vps.sh)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BRANCH="main"
APP_USER="ec2-user"
SERVICE_NAME="planning-board"

print_usage() {
  cat <<EOF
Usage: sudo $0 [-d <app-dir>] [-b <branch>] [-u <app-user>] [-s <service-name>]

This script assumes you're running it from a cloned copy of the repository (or that the repo root is passed with -d).
It will:
  - pull updates as the specified app user
  - run dependency install and build using the app user's nvm environment
  - restart the systemd service named by -s (default: planning-board)

Notes:
  - Ensure the deploy user has nvm/node/pnpm available and ssh keys if you rely on private remotes.
  - nginx/certbot are expected to be configured separately.
EOF
}

while getopts "d:b:u:s:h" opt; do
  case "$opt" in
    d) APP_DIR="$OPTARG" ;;
    b) BRANCH="$OPTARG" ;;
    u) APP_USER="$OPTARG" ;;
    s) SERVICE_NAME="$OPTARG" ;;
    h) print_usage; exit 0 ;;
    *) print_usage; exit 1 ;;
  esac
done

if [ "$EUID" -ne 0 ]; then
  echo "Warning: it's recommended to run this script with sudo/root so it can restart the systemd service. Continuing anyway..."
fi

echo "Using: APP_DIR=$APP_DIR"
echo "Using: BRANCH=$BRANCH"
echo "Using: APP_USER=$APP_USER"
echo "Using: SERVICE_NAME=$SERVICE_NAME"

# Ensure app user exists
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  echo "Error: user '$APP_USER' does not exist on this machine."
  exit 1
fi

# Require the repo to already be present at APP_DIR. Pull updates as the app user so SSH keys and nvm work correctly.
if [ -d "$APP_DIR/.git" ]; then
  echo "Updating existing repository in $APP_DIR as $APP_USER"
  sudo -u "$APP_USER" -H bash -lc "cd '$APP_DIR' && git fetch --all && git checkout '$BRANCH' && git pull origin '$BRANCH'"
else
  echo "Error: repository not found at $APP_DIR. Please run this script from the cloned repository root or pass -d <path>."
  print_usage
  exit 1
fi

cd "$APP_DIR"

# Prepare to run pnpm/install/build as the app user using their nvm environment.
# Determine the app user's home and NVM_DIR
HOME_DIR=$(getent passwd "$APP_USER" | cut -d: -f6)
NVM_DIR="$HOME_DIR/.nvm"

USER_BUILD_CMD=
USER_BUILD_CMD+='export HOME="'$HOME_DIR'"; '
USER_BUILD_CMD+='export NVM_DIR="'$NVM_DIR'"; '
USER_BUILD_CMD+='[ -s "'$NVM_DIR'/nvm.sh" ] && . "'$NVM_DIR'/nvm.sh" || true; '
USER_BUILD_CMD+='command -v pnpm >/dev/null 2>&1 || { echo "pnpm not found for user $APP_USER (ensure pnpm is installed or in PATH)."; exit 2; }; '
USER_BUILD_CMD+='cd "'$APP_DIR'"; pnpm install --frozen-lockfile; pnpm build'

echo "Running dependency install and build as $APP_USER (using their nvm/node/pnpm)..."
sudo -u "$APP_USER" -H bash -lc "$USER_BUILD_CMD"

# Check for .env.production and warn if missing (don't create anything automatically)
if [ ! -f "$APP_DIR/.env.production" ]; then
  echo "Warning: $APP_DIR/.env.production not found. Ensure your production env vars are present before starting the service."
fi

# Restart systemd service
if systemctl list-units --full -all | grep -Fq "${SERVICE_NAME}.service"; then
  echo "Restarting systemd service: $SERVICE_NAME"
  if [ "$EUID" -eq 0 ]; then
    systemctl restart "$SERVICE_NAME"
    sleep 1
    systemctl --no-pager status "$SERVICE_NAME" | sed -n '1,10p'
  else
    echo "Attempting to restart via sudo..."
    sudo systemctl restart "$SERVICE_NAME"
    echo "Service status (short):"
    sudo systemctl --no-pager status "$SERVICE_NAME" | sed -n '1,10p'
  fi
else
  echo "Warning: systemd unit '$SERVICE_NAME' not found. The script updated the repo and built the app but did not restart any service."
  echo "If you use a different run method, restart it manually (e.g. systemctl start $SERVICE_NAME or your process manager)."
fi

echo "Done."

exit 0
