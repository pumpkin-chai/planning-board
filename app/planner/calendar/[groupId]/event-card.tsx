import { Event } from "./event-calendar";

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="p-4 border rounded-md flex items-center gap-4">
      <div className="flex-1">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-muted-foreground">
          {event.startsAt.toLocaleString()}
        </p>
      </div>
      <div className="text-muted-foreground text-sm">
        {event.status.toUpperCase()}
      </div>
    </div>
  );
}
