import { createClient } from "@/lib/supabase/server";
import { Invite } from "./invite";

export default async function Notifications() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_invitations")
    .select("inviter, group:group_name, status, groupId:group_id");

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Notifications</h1>

      <section className="p-4 bg-secondary min-h-96">
        <ul>
          {data?.map((invite) => (
            <li key={`${invite.group}-${invite.inviter}`}>
              <Invite
                inviter={invite.inviter}
                group={invite.group}
                status={invite.status}
                groupId={invite.groupId}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

