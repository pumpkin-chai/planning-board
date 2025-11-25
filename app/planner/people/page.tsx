import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GroupManagementButtons } from "@/components/group-management-buttons";
import { UserGroupResult } from "@/lib/types";
import { GroupItem } from "@/components/group-item";

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
    return <div>Error loading group list</div>;
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

function GroupList({ groups }: { groups: UserGroupResult[] }) {
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
