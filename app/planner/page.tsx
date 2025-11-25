import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Calendar1 } from "lucide-react";

import { Event, UserEventsResult, UserGroupResult } from "@/lib/types";
import { EventList } from "@/components/event-list";
import { GroupList } from "@/components/group-list";
import { Suspense } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function Home() {
  const supabase = await createClient();

  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData) {
    redirect("/auth/login");
  }

  const currentTimestamp = new Date().toISOString();
  const { data: eventData } = await supabase
    .from("user_events")
    .select(
      "id, title, startsAt:starts_at, endsAt:ends_at, status, creator:profiles!events_created_by_fkey(username), description, isAttending:is_attending, attendeeCount:attendee_count",
    )
    .gt("starts_at", currentTimestamp)
    .eq("status", "planned")
    .overrideTypes<UserEventsResult[]>();

  const events: Event[] = eventData
    ? eventData.map((event) => ({
        ...event,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        creator: {
          username: event.creator.username,
          currentUser: event.creator.id === userData.user.id,
        },
      }))
    : [];

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Dashboard</h1>

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Upcoming Events</h2>
        <div className="p-4 bg-muted h-96">
          {events.length === 0 ? (
            <Empty className="size-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Calendar1 />
                </EmptyMedia>
                <EmptyTitle>No upcoming events</EmptyTitle>
                <EmptyDescription>
                  You have no upcoming events scheduled.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <EventList events={events} />
          )}
        </div>
      </section>

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Your Calendars</h2>
        <div className="p-4 bg-muted h-96">
          <GroupList />
        </div>
      </section>
    </div>
  );
}
