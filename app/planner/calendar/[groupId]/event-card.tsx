import { Event } from "./event-calendar";

export function EventCard({ event }: { event: Event }) {
  let statusStyle: string = "";
  if (event.status === "proposed") {
    statusStyle = "text-muted-foreground";
  } else if (event.status === "canceled") {
    statusStyle = "text-red-600";
  }

  return (
    <div
      className={"p-4 border rounded-md flex items-center gap-4 " + statusStyle}
    >
      <div className="flex-1">
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-muted-foreground">
          {event.startsAt.toLocaleTimeString()}
        </p>
      </div>
      <div className="text-muted-foreground text-sm">
        {event.status.toUpperCase()}
      </div>
    </div>
  );
}
