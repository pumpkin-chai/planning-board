import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCalendar, Event } from "./event-calendar";
import { InviteMemberDialog } from "./invite-member-dialog";
import { MembersDialog } from "./members-dialog";

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
    .single()
    .overrideTypes<{ name: string; memberCount: number }>();
  if (groupInfoError) {
    console.error(groupInfoError.message);
    redirect("/planner/people");
  }

  const { data: membershipData, error: membershipInfoError } = await supabase
    .from("Memberships")
    .select("role")
    .eq("user_id", user.id)
    .eq("group_id", groupId)
    .single()
    .overrideTypes<{ role: string }>();
  if (membershipInfoError) {
    console.error(membershipInfoError.message);
    redirect("/planner/people");
  }

  const { data: eventData } = await supabase
    .from("Events")
    .select("id, title, starts_at, status, created_by")
    .eq("group_id", groupId);

  const events: Event[] = eventData
    ? eventData.map((event) => {
        return {
          id: event.id,
          title: event.title,
          startsAt: new Date(event.starts_at),
          status: event.status,
          createdBy: event.created_by,
        };
      })
    : [];

  return (
    <div className="px-8 py-3 w-full">
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
        <div className="p-8 bg-secondary">
          <EventCalendar groupId={Number(groupId)} events={events} />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Planned Events</h2>
        <div className="p-8 bg-secondary mb-16">
          <ul className="overflow-y-auto">
            {events
              .filter((event) => event.status === "planned")
              .map((event) => (
                <li key={event.id}>
                  <strong>{event.startsAt.toLocaleDateString()} </strong>
                  <em>{event.startsAt.toLocaleTimeString()}</em> - {event.title}
                </li>
              ))}
          </ul>
        </div>

        <h2 className="text-2xl mb-4">Proposed Events</h2>
        <div className="p-8 bg-secondary mb-16">
          <ul className="overflow-y-auto">
            {events
              .filter((event) => event.status === "proposed")
              .map((event) => (
                <li key={event.id}>
                  <strong>{event.startsAt.toLocaleDateString()} </strong>
                  <em>{event.startsAt.toLocaleTimeString()}</em> - {event.title}
                </li>
              ))}
          </ul>
        </div>

        <h2 className="text-2xl mb-4">Canceled Events</h2>
        <div className="p-8 bg-secondary">
          <ul className="overflow-y-auto">
            {events
              .filter((event) => event.status === "canceled")
              .map((event) => (
                <li key={event.id}>
                  <strong>{event.startsAt.toLocaleDateString()} </strong>
                  <em>{event.startsAt.toLocaleTimeString()}</em> - {event.title}
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
