import { createClient } from "@/lib/supabase/server";
import { GroupManagementButtons } from "@/components/group-management-buttons";
import { UserGroupResult } from "@/lib/types";
import { GroupItem } from "@/components/group-item";
import { Suspense } from "react";

export default function People() {
  return (
    <div className="px-4 sm:px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <GroupManagementButtons className="mb-8" />
        <div className="bg-muted p-3 sm:p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <GroupList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function GroupList() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_groups")
    .select("id:group_id, name:group_name, memberCount:member_count, role")
    .order("role")
    .overrideTypes<UserGroupResult[]>();
  if (error || !data) {
    return <div>Error loading group list</div>;
  }

  return (
    <ul>
      {data.map((group) => (
        <li key={group.id} className="mb-2 sm:mb-4 last:mb-0">
          <GroupItem group={group} />
        </li>
      ))}
    </ul>
  );
}
