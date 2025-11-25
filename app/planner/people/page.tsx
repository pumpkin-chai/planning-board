import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GroupManagementButtons } from "@/components/group-management-buttons";
import { toast } from "sonner";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import Link from "next/link";

type GroupResult = {
  id: number;
  name: string;
  memberCount: number;
  role: Role;
};
type Role = "admin" | "member";

export default async function People() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("user_groups")
    .select("id:group_id, name:group_name, memberCount:member_count, role")
    .order("role");
  if (error || !data) {
    toast.error("Unable to load group list");
    return <div>Error</div>;
  }

  return (
    <div className="px-4 sm:px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <GroupManagementButtons className="mb-8" />
        <div className="bg-secondary p-3 sm:p-4">
          <GroupList groups={data} />
        </div>
      </section>
    </div>
  );
}

function GroupList({ groups }: { groups: GroupResult[] }) {
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.id} className="mb-2 sm:mb-4 last:mb-0">
          <GroupItem group={group} />
        </li>
      ))}
    </ul>
  );
}

function GroupItem({ group }: { group: GroupResult }) {
  return (
    <Item asChild className="bg-card">
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
