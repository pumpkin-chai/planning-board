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
import { NoCalendarsButtons } from "./no-calendars-buttons";

type Calendar = { id: number; name: string; memberCount: number };

type GroupEvents = {
  id: number;
  name: string;
  events: { id: number; title: string; startsAt: string; status: string }[];
};

type Event = {
  id: number;
  groupId: number;
  groupName: string;
  title: string;
  startsAt: Date;
  status: string;
};

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  let events: Event[] = [];

  const currentTimestamp = new Date().toISOString();
  const { data: eventData } = await supabase
    .from("Memberships")
    .select(
      "group:Groups (id, name, events:Events (id, title, startsAt:starts_at, status))",
    )
    .eq("user_id", data.claims.sub)
    .gt("Groups.Events.starts_at", currentTimestamp)
    .eq("Groups.Events.status", "planned")
    .overrideTypes<{ group: GroupEvents }[]>();

  if (eventData) {
    const groups = eventData.map((res) => res.group);
    events = groups
      .map((group) =>
        group.events.map((event) => ({
          ...event,
          startsAt: new Date(event.startsAt),
          groupName: group.name,
          groupId: group.id,
        })),
      )
      .flat()
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }

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
        <div className="p-4 bg-secondary h-96">
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
        <div className="p-4 bg-secondary h-96">
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
                <NoCalendarsButtons />
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

function EventList({ events }: { events: Event[] }) {
  return (
    <ul className="overflow-y-auto h-full">
      {events.map((event) => (
        <li key={event.id} className="mb-4 last:mb-0">
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  );
}

type EventItemProps = {
  event: Event;
};
function EventItem({ event }: EventItemProps) {
  return (
    <Link href={`/planner/calendar/${event.groupId}`}>
      <div className="p-6 bg-card hover:bg-accent hover:text-accent-foreground transition-colors rounded-lg flex justify-between items-center">
        <span>
          <strong>{event.title}</strong> - {event.startsAt.toLocaleDateString()}{" "}
          {" at "} {event.startsAt.toLocaleTimeString()}
        </span>
        <span className="text-muted-foreground text-sm">
          {event.groupName.toUpperCase()}
        </span>
      </div>
    </Link>
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
