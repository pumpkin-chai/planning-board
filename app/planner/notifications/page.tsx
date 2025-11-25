import { createClient } from "@/lib/supabase/server";
import { InviteList } from "@/components/invite-list";
import { Suspense } from "react";

export default async function Notifications() {
  return (
    <>
      <h1 className="self-start text-5xl font-bold mb-8">Notifications</h1>

      <section className="bg-secondary min-h-96">
        <Suspense fallback={<div>Loading...</div>}>
          <UserInvites />
        </Suspense>
      </section>
    </>
  );
}

async function UserInvites() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_invitations")
    .select("inviter, group:group_name, status, groupId:group_id");

  if (error || !data) {
    return <div>Error</div>;
  }

  return <InviteList invites={data} />;
}
