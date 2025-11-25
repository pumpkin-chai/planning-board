import { createClient } from "@/lib/supabase/server";
import { UserGroupResult } from "@/lib/types";
import { GroupItem } from "./group-item";

export async function GroupList() {
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
