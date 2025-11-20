"use server";

import { createClient } from "@/lib/supabase/server";

export type InviteStatus = "pending" | "accepted" | "declined";

export async function updateInviteStatus(
  inviterUsername: string,
  groupId: number,
  newStatus: InviteStatus,
) {
  const supabase = await createClient();

  const { data: inviter } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", inviterUsername)
    .single();

  const inviterId = inviter?.id;

  if (!inviterId) {
    console.error("Failed to get id from username");
    return { data: null };
  }

  const { data, error } = await supabase
    .from("invitations")
    .update({ status: newStatus })
    .eq("group_id", groupId)
    .eq("inviter_id", inviterId)
    .select()
    .single();

  if (error) {
    console.error("Update failed:", error.message);
    return { data: null };
  }

  return { data: data };
}
