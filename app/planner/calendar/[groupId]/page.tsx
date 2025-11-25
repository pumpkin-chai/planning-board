import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCalendar, Event, EventResult } from "./event-calendar";
import { InviteMemberDialog } from "./invite-member-dialog";
import { MembersDialog } from "./members-dialog";
import { EventList } from "./event-list";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: groupInfo, error: groupInfoError } = await supabase
    .from("group_info_view")
    .select("name, memberCount:member_count")
    .eq("id", groupId)
    .maybeSingle()
    .overrideTypes<{ name: string; memberCount: number }>();
  if (groupInfoError || !groupInfo) {
    redirect("/planner/people");
  }

  const { data: membershipData, error: membershipInfoError } = await supabase
    .from("Memberships")
    .select("user:profiles(username), role")
    .eq("user_id", user.id)
    .eq("group_id", groupId)
    .maybeSingle()
    .overrideTypes<{ user: { username: string }; role: string }>();
  if (membershipInfoError || !membershipData) {
    redirect("/planner/people");
  }

  const { data: eventData } = await supabase
    .from("user_events")
    .select(
      "id, title, startsAt:starts_at, endsAt:ends_at, status, creator:profiles!events_created_by_fkey(username), description, isAttending:is_attending, attendeeCount:attendee_count",
    )
    .eq("group_id", groupId)
    .overrideTypes<EventResult[]>();

  const events: Event[] = eventData
    ? eventData.map((event) => ({
        ...event,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        creator: {
          username: event.creator.username,
          currentUser: event.creator.username === membershipData.user.username,
        },
      }))
    : [];

  return (
    <div className="px-4 sm:px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-2">{groupInfo.name}</h1>

      <MembersDialog
        className="mb-8 hover:underline"
        groupId={Number(groupId)}
        label={`${groupInfo.memberCount} ${groupInfo.memberCount === 1 ? "Member" : "Members"}`}
      />

      {membershipData?.role === "admin" && (
        <section className="mb-4">
          <InviteMemberDialog groupId={Number(groupId)} inviterId={user.id} />
        </section>
      )}

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Calendar</h2>
        <div className="sm:p-8 sm:bg-muted">
          <EventCalendar groupId={Number(groupId)} events={events} />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Planned Events</h2>
        <div className="p-3 sm:p-6 bg-secondary mb-16">
          <EventList
            events={events.filter((event) => event.status === "planned")}
          />
        </div>

        <h2 className="text-2xl mb-4">Proposed Events</h2>
        <div className="p-3 sm:p-6 bg-secondary mb-16">
          <EventList
            events={events.filter((event) => event.status === "proposed")}
          />
        </div>

        <h2 className="text-2xl mb-4">Canceled Events</h2>
        <div className="p-3 sm:p-6 bg-secondary">
          <EventList
            events={events.filter((event) => event.status === "canceled")}
          />
        </div>
      </section>
    </div>
  );
}
