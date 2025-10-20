import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCalendar, Event } from "./event-calendar";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ groupId: string[] }>;
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

  const { data: groupData } = await supabase
    .from("Groups")
    .select("name")
    .eq("id", groupId)
    .single();
  console.log("Group Data:", groupData);

  const { data: eventData } = await supabase
    .from("Events")
    .select("id, title, starts_at, status, created_by")
    .eq("group_id", groupId);
  console.log("Event Data:", eventData);
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
      <h1 className="self-start text-5xl font-bold mb-8">
        {groupData ? groupData.name : "Calendar"}
      </h1>

      <section className="mb-32">
        <h2 className="text-2xl mb-4">Calendar</h2>
        <div className="p-8 bg-secondary">
          <EventCalendar groupId={Number(groupId)} events={events} />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl mb-4">Upcoming Events</h2>
        <div className="p-8 bg-secondary">
          <ul className="overflow-y-auto">
            {events.map((event) => (
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
