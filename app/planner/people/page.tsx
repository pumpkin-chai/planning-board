import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GroupManager } from "./group-manager";
import { GroupManagementButtons } from "@/components/group-management-buttons";
import { toast } from "sonner";

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
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <GroupManagementButtons className="mb-8" />
        <GroupList groups={data} />
      </section>
    </div>
  );
}

function GroupList({ groups }: { groups: GroupResult[] }) {
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.id} className="mb-4 last:mb-0">
          <GroupCard group={group} />
        </li>
      ))}
    </ul>
  );
}

function GroupCard({ group }: { group: GroupResult }) {
  return (
    <div className="border border-border p-6 rounded-lg cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-xl font-semibold">{group.name}</h3>
        <span className="text-sm text-muted-foreground">
          {group.memberCount} {group.memberCount === 1 ? "Member" : "Members"}
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-4"></div>
      </div>
    </div>
  );
}
