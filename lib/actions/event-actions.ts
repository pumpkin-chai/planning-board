"use server";

import { Event, EventStatus } from "@/lib/types"
import { requireUser } from "../supabase/server";

export async function setEventStatus(event: Event, status: EventStatus) {
    const { supabase, user } = await requireUser();
    const { data, error } = await supabase
        .from("events")
        .update({ status: status })
        .eq("id", event.id)
        .select("id")
        .maybeSingle();

    if (!data || error) {
        console.error("Error changing event status:", error);
        return { data: null, error: `Failed to change event "${event.title}" status to ${status.toLowerCase()}. Please try again later.` };
    }

    const { data: notificationData, error: notificationError } = await supabase
        .from("notifications")
        .insert({
            created_by: user.id,
            type: "event_status_changed",
            entity_type: "event",
            entity_id: data.id,
            data: {
                from: event.status,
                to: status
            }
        })
        .select("id")
        .maybeSingle();

    if (!notificationData || notificationError) {
        console.error("Error creating notification for event status change:", event, status, notificationError);
        return { data, error: null };
    }

    const { data: groupMembers, error: groupMemberError } = await supabase
        .from("memberships")
        .select("user_id")
        .eq("group_id", event.groupId);

    if (!groupMembers || groupMemberError) {
        console.error("Error querying group members:", groupMemberError);
        return { data, error: null };
    }

    const promises = groupMembers.map((groupMember) =>
        supabase
            .from("user_notifications")
            .insert({
                user_id: groupMember.user_id,
                notification_id: notificationData.id
            })
    )
    Promise.allSettled(promises).then(results => results.forEach((result) => console.log(result)));

    return { data, error: null };
}