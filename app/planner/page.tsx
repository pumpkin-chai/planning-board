import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Calendar1, CalendarIcon } from "lucide-react";

import Link from "next/link";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GroupManagementButtons } from "@/components/group-management-buttons";
import { Event, UserEventsResult } from "@/lib/types";
import { EventList } from "@/components/event-list";

type Calendar = { id: number; name: string; memberCount: number };

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

  console.log(eventData);

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

  const { data: calendarData } = await supabase
    .from("user_groups")
    .select("id:group_id, name:group_name, memberCount:member_count")
    .overrideTypes<Calendar[]>();
  const calendars = calendarData ?? [];

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
          {calendars.length === 0 ? (
            <Empty className="size-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CalendarIcon />
                </EmptyMedia>
                <EmptyTitle>No calendars yet!</EmptyTitle>
                <EmptyDescription>
                  You currently have no calendars. Get started by creating one
                  below.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <GroupManagementButtons />
              </EmptyContent>
            </Empty>
          ) : (
            <CalendarList calendars={calendars} />
          )}
        </div>
      </section>
    </div>
  );
}

function CalendarList({ calendars }: { calendars: Calendar[] }) {
  return (
    <ul className="overflow-y-auto h-full">
      {calendars.map((calendar) => (
        <li key={calendar.id} className="mb-4 last:mb-0">
          <CalendarItem calendar={calendar} />
        </li>
      ))}
    </ul>
  );
}

function CalendarItem({ calendar }: { calendar: Calendar }) {
  return (
    <Link href={`/planner/calendar/${calendar.id}`}>
      <div className="p-6 bg-card hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg flex justify-between items-center">
        <span>{calendar.name}</span>
        <span className="text-muted-foreground text-sm">
          {calendar.memberCount}{" "}
          {calendar.memberCount === 1 ? "Member" : "Members"}
        </span>
      </div>
    </Link>
  );
}
