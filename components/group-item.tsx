import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { UserGroupResult } from "@/lib/types";
import Link from "next/link";

export function GroupItem({ group }: { group: UserGroupResult }) {
  return (
    <Item asChild className="bg-card hover:bg-accent sm:p-6">
      <Link href={`/planner/calendar/${group.id}`}>
        <ItemContent>
          <ItemTitle className="items-baseline">
            <span className="sm:text-2xl font-bold">{group.name}</span>
          </ItemTitle>
          <ItemDescription>
            {group.memberCount} {group.memberCount === 1 ? "Member" : "Members"}
          </ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  );
}
