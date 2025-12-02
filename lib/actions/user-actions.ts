"use server";

import { requireUser } from "@/lib/supabase/server";

export async function inviteUser(username: string, groupId: number) {
  const { supabase, user } = await requireUser();

  const { data: userSearchData, error: userSearchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (userSearchError) {
    throw userSearchError;
  }
  if (!userSearchData) {
    throw new Error(`User ${username} not found`);
  }

  const { error: newInviteError } = await supabase.from("invitations").insert({
    inviter_id: user.id,
    invitee_id: userSearchData.id,
    group_id: groupId,
  });

  if (newInviteError) {
    throw newInviteError;
  }
}
