import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { UserGroupResult } from "@/lib/types";
import Link from "next/link";
import { LeaveGroupButton } from "./group-item-buttons";

export function GroupItem({ group }: { group: UserGroupResult }) {
  return (
    <Item className="bg-card sm:p-6">
      <ItemContent>
        <ItemTitle className="items-baseline">
          <Link href={`/planner/calendar/${group.id}`}>
            <span className="sm:text-2xl font-bold hover:underline">
              {group.name}
            </span>
          </Link>
        </ItemTitle>
        <ItemDescription>
          {group.memberCount} {group.memberCount === 1 ? "Member" : "Members"}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {group.role === "member" && <LeaveGroupButton group={group} refresh />}
      </ItemActions>
    </Item>
  );
}
