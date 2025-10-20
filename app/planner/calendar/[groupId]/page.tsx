import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCalendar } from "./event-calendar";

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

  type Event = { id: number; name: string; datetime: Date };
  const { data: eventData } = await supabase
    .from("Events")
    .select("id, name, datetime")
    .eq("group_id", groupId);
  console.log("Event Data:", eventData);
  const events: Event[] = eventData
    ? eventData.map((event) => {
        return {
          id: event.id,
          name: event.name,
          datetime: new Date(event.datetime),
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
                <strong>{event.datetime.toLocaleDateString()} </strong>
                <em>{event.datetime.toLocaleTimeString()}</em> - {event.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
