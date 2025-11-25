import { InviteItem } from "@/components/invite-item";
import { Invite } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

export function InviteList({ invites }: { invites: Invite[] }) {
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

export function InviteListSkeleton() {
  return (
    <ul className="overflow-y-auto h-full">
      <li className="mb-2 sm:mb-3">
        <Skeleton className="h-20 sm:h-16" />
      </li>
      <li className="mb-2 sm:mb-3">
        <Skeleton className="h-20 sm:h-16" />
      </li>
      <li className="mb-0">
        <Skeleton className="h-20 sm:h-16" />
      </li>
    </ul>
  );
}
