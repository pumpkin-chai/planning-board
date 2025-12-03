"use server";

import { createClient, requireUser } from "@/lib/supabase/server";
import { Notification } from "../types";

export async function createInvite(username: string, groupId: number) {
  const { supabase, user } = await requireUser();

  const { data: currentMemberData, error: currentMemberError } = await supabase
    .from("Memberships")
    .select("profiles(username)")
    .eq("group_id", groupId)
    .eq("profiles.username", username);
  if (currentMemberError || currentMemberData.some((m) => m.profiles)) {
    throw new Error(`User ${username} is already a member.`);
  }

  const { data: userSearchData, error: userSearchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (userSearchError || !userSearchData) {
    throw new Error(`User ${username} not found.`);
  }

  const { data, error: newInviteError } = await supabase
    .from("invitations")
    .insert({
      inviter_id: user.id,
      invitee_id: userSearchData.id,
      group_id: groupId,
    })
    .select("id")
    .single()
    .overrideTypes<{ id: number }>();
  if (newInviteError) {
    throw newInviteError;
  }

  return { data };
}

export async function createNotification(notification: Notification) {
  const supabase = await createClient();

  const {
    createdBy: created_by,
    entityId: entity_id,
    entityType: entity_type,
    ...rest
  } = notification;
  const { error, data } = await supabase
    .from("notifications")
    .insert({
      created_by,
      entity_id,
      entity_type,
      ...rest,
    })
    .select("id")
    .single()
    .overrideTypes<{ id: number }>();

  if (error) {
    return { error, data: null };
  }
  return { data, error: null };
}
