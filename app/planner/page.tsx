import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Calendar1 } from "lucide-react";
import Link from "next/link";

import {
  Event,
  EventStatus,
  UserEventsResult,
  UserGroupResult,
} from "@/lib/types";
import { EventList, EventListSkeleton } from "@/components/event-list";
import { GroupList, GroupListSkeleton } from "@/components/group-list";
import { Suspense } from "react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <h1 className="self-start text-5xl font-bold mb-8">Dashboard</h1>

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Upcoming Events</h2>
        <div className="p-4 bg-muted h-96">
          <Suspense fallback={<EventListSkeleton />}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </section>

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Your Calendars</h2>
        <div className="p-4 bg-muted h-96">
          <Suspense fallback={<GroupListSkeleton />}>
            <GroupsPreview />
          </Suspense>
        </div>
      </section>
    </>
  );
}

async function GroupsPreview() {
  const supabase = await createClient();
  const limit = 10;

  const { count, data, error } = await supabase
    .from("user_groups")
    .select("id:group_id, name:group_name, memberCount:member_count, role", {
      count: "exact",
    })
    .order("role")
    .limit(limit)
    .overrideTypes<UserGroupResult[]>();
  if (error || !data) {
    return <div>Error loading group list</div>;
  }

  return (
    <GroupList groups={data}>
      {(!count || count > limit) && (
        <Button variant="ghost" className="block text-center" asChild>
          <Link href="/planner/people">View all</Link>
        </Button>
      )}
    </GroupList>
  );
}

async function UpcomingEvents() {
  const supabase = await createClient();
  const limit = 10;

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
    .limit(limit)
    .overrideTypes<UserEventsResult[]>();

  const events: Event[] = eventData
    ? eventData.map((event) => ({
        ...event,
        status: event.status as EventStatus,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        creator: {
          username: event.creator.username,
          currentUser: event.creator.id === userData.user.id,
        },
      }))
    : [];

  return events.length === 0 ? (
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
  );
}
