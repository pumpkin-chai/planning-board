import { InviteItem } from "@/components/invite-item";
import { Invite } from "@/lib/types";

export async function InviteList({ invites }: { invites: Invite[] }) {
  return (
    <ul>
      {invites.map((invite) => (
        <li
          key={`${invite.group}-${invite.inviter}`}
          className="mb-4 last:mb-0"
        >
          <InviteItem invite={invite} />
        </li>
      ))}
    </ul>
  );
}
