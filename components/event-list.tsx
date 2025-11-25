import { Event } from "@/lib/types";
import { EventItem } from "./event-item";

export function EventList({ events }: { events: Event[] }) {
  return (
    <ul className="overflow-y-auto">
      {events.map((event) => (
        <li key={event.id} className="mb-2 sm:mb-3 last:mb-0">
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  );
}
