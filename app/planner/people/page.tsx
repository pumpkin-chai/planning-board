import { GroupManagementButtons } from "@/components/group-management-buttons";
import { Suspense } from "react";
import { GroupList, GroupListSkeleton } from "@/components/group-list";
import { createClient } from "@/lib/supabase/server";
import { UserGroupResult } from "@/lib/types";

export default async function People() {
  return (
    <>
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <GroupManagementButtons className="mb-8" />
        <div className="bg-muted p-3 sm:p-4">
          <Suspense fallback={<GroupListSkeleton />}>
            <AllGroups />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function AllGroups() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_groups")
    .select("id:group_id, name:group_name, memberCount:member_count, role")
    .order("role")
    .overrideTypes<UserGroupResult[]>();
  if (error || !data) {
    return <div>Error loading group list</div>;
  }

  return <GroupList groups={data} />;
}
