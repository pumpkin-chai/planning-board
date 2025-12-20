"use server";

import { Event, EventStatus } from "@/lib/types"
import { createClient, requireUser } from "../supabase/server";

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

    const { error: notificationError } = await supabase
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

    if (notificationError) {
        console.error("Error creating notification for event status change:", event, status, notificationError)
    }

    return { data, error: null };
}