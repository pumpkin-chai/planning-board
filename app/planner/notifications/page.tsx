import { createClient } from "@/lib/supabase/server";
import { InviteList, InviteListSkeleton } from "@/components/invite-list";
import { Suspense } from "react";

export default async function Notifications() {
  return (
    <section>
      <h1 className="self-start text-5xl font-bold mb-8">Notifications</h1>

      <div className="bg-muted p-3 sm:p-4 min-h-96">
        <Suspense fallback={<InviteListSkeleton />}>
          <UserInvites />
        </Suspense>
      </div>
    </section>
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
