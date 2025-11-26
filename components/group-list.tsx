import { UserGroupResult } from "@/lib/types";
import { GroupItem } from "./group-item";
import { GroupsEmpty } from "./groups-empty";
import { Skeleton } from "./ui/skeleton";

export async function GroupList({
  groups,
  children,
}: {
  groups: UserGroupResult[];
  children?: React.ReactNode;
}) {
  return groups.length === 0 ? (
    <GroupsEmpty />
  ) : (
    <div className="overflow-y-auto max-h-full">
      <ul className="mb-3 last:mb-0">
        {groups.map((group) => (
          <li key={group.id} className="mb-2 sm:mb-4 last:mb-0">
            <GroupItem group={group} />
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

export function GroupListSkeleton() {
  return (
    <ul className="overflow-y-auto h-full">
      <li className="mb-2 sm:mb-3">
        <Skeleton className="h-20 sm:h-24" />
      </li>
      <li className="mb-2 sm:mb-3">
        <Skeleton className="h-20 sm:h-24" />
      </li>
      <li className="mb-0">
        <Skeleton className="h-20 sm:h-24" />
      </li>
    </ul>
  );
}
