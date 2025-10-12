#!/usr/bin/env bash
set -euo pipefail

# Simple VPS deployment helper for Amazon Linux EC2 environments
# Assumptions for this variant:
#  - `git`, `nvm`, `node` (installed via nvm), and `pnpm` are already available for the deploy user
#  - The VPS already has nginx/certbot configured externally
# Usage: sudo ./scripts/deploy_vps.sh [-r <git-repo-url>] [-d /var/www/planning-board] [-b main] [-u ec2-user] [-s planning-board]

REPO_URL=""
APP_DIR="/var/www/planning-board"
BRANCH="main"
APP_USER="ec2-user"
SERVICE_NAME="planning-board"

print_usage() {
  cat <<EOF
Usage: sudo $0 [-r <repo-url>] [-d <app-dir>] [-b <branch>] [-u <app-user>] [-s <service-name>]

This script will (Amazon Linux / EC2 variant):
  - clone the repo as the specified app user (if needed) or pull updates
  - run dependency install and build using the app user's nvm environment (so their node/pnpm are used)
  - restart the systemd service named by -s (default: planning-board)

Notes:
  - If the repo doesn't exist at the target dir, provide -r <repo-url> so the script can clone it as the app user.
  - The script assumes the deploy user has nvm/node/pnpm available and ssh keys (if cloning over SSH).
  - nginx/certbot are expected to be configured separately.
EOF
}

while getopts "r:d:b:u:s:h" opt; do
  case "$opt" in
    r) REPO_URL="$OPTARG" ;;
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

echo "Using: REPO_URL=${REPO_URL:-<not-set>}"
echo "Using: APP_DIR=$APP_DIR"
echo "Using: BRANCH=$BRANCH"
echo "Using: APP_USER=$APP_USER"
echo "Using: SERVICE_NAME=$SERVICE_NAME"

# Ensure app user exists
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  echo "Error: user '$APP_USER' does not exist on this machine."
  exit 1
fi

# If repo exists, update it as the app user (so SSH keys and nvm work correctly)
if [ -d "$APP_DIR/.git" ]; then
  echo "Updating existing repository in $APP_DIR as $APP_USER"
  sudo -u "$APP_USER" -H bash -lc "cd '$APP_DIR' && git fetch --all && git checkout '$BRANCH' && git pull origin '$BRANCH'"
else
  if [ -z "$REPO_URL" ]; then
    echo "Error: repository not found at $APP_DIR and no -r <repo-url> provided to clone."
    print_usage
    exit 1
  fi
  echo "Cloning repository into $APP_DIR as $APP_USER"
  mkdir -p "$APP_DIR"
  chown "$APP_USER":"$APP_USER" "$APP_DIR"
  sudo -u "$APP_USER" -H git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
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
