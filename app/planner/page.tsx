import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { CalendarIcon, BellRing, Calendar1 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  type Calendar = { id: number; groupId: number; name: string };
  const calendars: Calendar[] = [];

  type Notification = { id: number; message: string; read: boolean };
  const notifications: Notification[] = [
    { id: 1, message: "Notification 1", read: false },
    { id: 2, message: "Notification 2", read: true },
    { id: 3, message: "Notification 3", read: false },
  ];

  type Event = { id: number; groupId: number; title: string; date: string };
  const events: Event[] = [];

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Dashboard</h1>
      <section className="mb-12">
        <h2 className="text-2xl mb-4">Your Calendars</h2>
        <div className="p-4 bg-secondary">
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
                <div className="flex gap-2">
                  <Button>Create calendar</Button>
                  <Button variant="outline">Join group calendar</Button>
                </div>
              </EmptyContent>
            </Empty>
          ) : (
            <ul>
              {calendars.map((calendar) => (
                <li key={calendar.id}>{calendar.name}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-4">Notifications</h2>
        <div className="p-4 bg-secondary h-64">
          {notifications.length === 0 ? (
            <Empty className="size-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BellRing />
                </EmptyMedia>
                <EmptyTitle>No notifications</EmptyTitle>
                <EmptyDescription>
                  You have no new notifications at this time.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={notification.read ? "text-gray-500" : "font-bold"}
                >
                  {notification.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl mb-4">Upcoming Events</h2>
        <div className="p-4 bg-secondary min-h-64">
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
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <EventItem event={event} />
                </li>
              ))}
            </ul>
          )}
        </div>
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
