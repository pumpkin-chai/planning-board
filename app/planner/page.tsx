import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const mockEvents = [
    { id: 1, title: "Event 1", date: "2024-07-01" },
    { id: 2, title: "Event 2", date: "2024-07-05" },
    { id: 3, title: "Event 3", date: "2024-07-10" },
  ];

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-2xl">Your Calendars</h2>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl">Notifications</h2>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl">Upcoming Events</h2>
        {mockEvents.length === 0 ? (
          <p>No upcoming events.</p>
        ) : (
          <ul>
            {mockEvents.map((event) => (
              <li key={event.id}>
                <EventItem event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type EventItemProps = { event: { id: number; title: string; date: string } };
function EventItem({ event }: EventItemProps) {
  return (
    <div>
      <strong>{event.title}</strong> -{" "}
      {new Date(event.date).toLocaleDateString()}
    </div>
  );
}
