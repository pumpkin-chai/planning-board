import { Event } from "@/lib/types";
import { EventItem } from "./event-item";
import { Skeleton } from "./ui/skeleton";

export function EventList({ events }: { events: Event[] }) {
  return (
    <ul className="overflow-y-auto h-full">
      {events.map((event) => (
        <li key={event.id} className="mb-2 sm:mb-3 last:mb-0">
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  );
}

export function EventListSkeleton() {
  return (
    <ul className="overflow-y-auto h-full">
      <li className="mb-2 sm:mb-3">
        <Skeleton className="h-20 sm:h-24" />
      </li>
      <li className="mb-2 sm:mb-3">
        <Skeleton className="h-20 sm:h-24" />
      </li>
      <li className="mb-0">
        <Skeleton className="h-20 sm:h-24" />
      </li>
    </ul>
  );
}
