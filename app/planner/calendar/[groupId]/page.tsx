import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCalendar } from "@/components/event-calendar";
import { EventList } from "@/components/event-list";
import { Event, EventStatus, UserEventsResult } from "@/lib/types";
import { InviteMemberDialog } from "./invite-member-dialog";
import { MembersDialog } from "@/components/members-dialog";
import { DeleteGroupButton } from "@/components/delete-group-button";
import { SetGroupVisibilityButton } from "@/components/set-group-visibility-button";

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
    .select("name, memberCount:member_count, isPrivate:is_private")
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
    .overrideTypes<UserEventsResult[]>();

  const events: Event[] = eventData
    ? eventData.map((event) => ({
        ...event,
        status: event.status as EventStatus,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        creator: {
          username: event.creator.username,
          currentUser: event.creator.username === membershipData.user.username,
        },
      }))
    : [];

  return (
    <>
      <h1 className="text-5xl font-bold">{groupInfo.name}</h1>
      <h2 className="mb-6">Group ID #{groupId}</h2>

      <div className="mb-4">
        <MembersDialog
          className="mb-1 hover:underline"
          groupId={Number(groupId)}
          label={`${groupInfo.memberCount} ${groupInfo.memberCount === 1 ? "Member" : "Members"}`}
        />

        {membershipData?.role === "admin" && (
          <InviteMemberDialog groupId={Number(groupId)} inviterId={user.id} />
        )}
      </div>

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Calendar</h2>
        <div className="sm:p-8 sm:bg-muted">
          <EventCalendar groupId={Number(groupId)} events={events} />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Planned Events</h2>
        <div className="p-3 sm:p-6 bg-muted mb-16">
          <EventList
            events={events.filter((event) => event.status === "planned")}
          />
        </div>

        <h2 className="text-2xl mb-4">Proposed Events</h2>
        <div className="p-3 sm:p-6 bg-muted mb-16">
          <EventList
            events={events.filter((event) => event.status === "proposed")}
          />
        </div>

        <h2 className="text-2xl mb-4">Canceled Events</h2>
        <div className="p-3 sm:p-6 bg-muted">
          <EventList
            events={events.filter((event) => event.status === "canceled")}
          />
        </div>
      </section>

      {membershipData.role === "admin" && (
        <section>
          <h2 className="text-2xl mb-1 sm:mb-2 text-red-500 font-bold">
            Danger Zone
          </h2>
          <div className="p-3 sm:p-6 border-2 border-red-500 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="grow">
                <h3 className="text-lg font-semibold">Delete Group</h3>
                <p>
                  Deleting this group will remove all events and membership data
                  associated with it. This action cannot be undone.
                </p>
              </div>
              <DeleteGroupButton groupId={groupId} />
            </div>

            <hr className="my-4" />

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="grow">
                <h3 className="text-lg font-semibold">
                  Change Group Visibility
                </h3>
                <p>
                  Changing the group visibility will affect who can find and
                  join this group. Make sure to review the settings before
                  proceeding.
                </p>
              </div>
              <SetGroupVisibilityButton
                groupId={groupId}
                isPrivate={groupInfo.isPrivate}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
