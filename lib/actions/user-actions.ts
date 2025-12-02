"use server";

import { createClient } from "../supabase/server";

export async function inviteUser(username: string, groupId: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }
  if (!user) {
    throw new Error("Could not retrieve current user");
  }

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
