import { UserGroupResult } from "@/lib/types";
import { GroupItem } from "./group-item";
import { GroupsEmpty } from "./groups-empty";
import { Skeleton } from "./ui/skeleton";

export async function GroupList({ groups }: { groups: UserGroupResult[] }) {
  return groups.length === 0 ? (
    <GroupsEmpty />
  ) : (
    <ul className="overflow-y-auto h-full">
      {groups.map((group) => (
        <li key={group.id} className="mb-2 sm:mb-4 last:mb-0">
          <GroupItem group={group} />
        </li>
      ))}
    </ul>
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
