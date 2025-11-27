"use client";

import { Event } from "@/lib/types";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NativeSelect, NativeSelectOption } from "./ui/native-select";
import { Label } from "./ui/label";
import Link from "next/link";

const datetimeOptions: Intl.DateTimeFormatOptions = {
  timeStyle: "short",
  dateStyle: "short",
};
const timeOptions: Intl.DateTimeFormatOptions = {
  timeStyle: "short",
};

function dateLaterThan(a: Date, b: Date) {
  return (
    a.getFullYear() > b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() &&
      (a.getMonth() > b.getMonth() ||
        (a.getMonth() === b.getMonth() && a.getDate() > b.getDate())))
  );
}

export function EventItem({ event }: { event: Event }) {
  const supabase = createClient();
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await supabase
        .from("Events")
        .delete()
        .eq("id", event.id);

      if (error) {
        toast.error("Event deletion failed", {
          description: `Failed to delete event "${event.title}." Please try again later.`,
        });
      } else {
        toast.success("Event successfully deleted", {
          description: `Successfully deleted event "${event.title}."`,
        });
        setOpen(false);
        router.refresh();
      }
    });
  };

  const handleAttending = () => {
    if (event.isAttending) {
      startTransition(async () => {
        const { data, error } = await supabase
          .from("attendees")
          .delete()
          .eq("event_id", event.id)
          .select()
          .single();

        if (!data || error) {
          toast.error("Failed to retract RSVP", {
            description: `Failed to mark event "${event.title}" as not attending. Please try again later.`,
          });
        } else {
          toast.success("No longer attending", {
            description: `Successfully marked "${event.title}" as not attending.`,
          });
          router.refresh();
        }
      });
    } else {
      startTransition(async () => {
        const { data, error } = await supabase
          .from("attendees")
          .insert({
            event_id: event.id,
          })
          .select()
          .single();

        if (!data || error) {
          toast.error("RSVP failed", {
            description: `Failed to mark event "${event.title}" as attending. Please try again later.`,
          });
        } else {
          toast.success("You are attending!", {
            description: `Successfully marked "${event.title}" as attending.`,
          });
          router.refresh();
        }
      });
    }
  };

  const handleStatusChange = (status: string) => {
    startTransition(async () => {
      const { error } = await supabase
        .from("Events")
        .update({ status: status })
        .eq("id", event.id);

      if (error) {
        toast.error("Status change failed", {
          description: `Failed to set event "${event.title}" status as ${status}. Please try again later.`,
        });
      } else {
        setOpen(false);
        toast.success("Status changed", {
          description: `Successfully set event "${event.title}" status to ${status}.`,
        });
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Item className="bg-card shadow-xs hover:bg-accent">
          <ItemContent>
            <ItemTitle className="text-lg">{event.title}</ItemTitle>
            <ItemDescription>
              {event.startsAt.toLocaleString(undefined, datetimeOptions)}
              {event.endsAt &&
                " to " +
                  (dateLaterThan(event.endsAt, event.startsAt)
                    ? event.endsAt.toLocaleString(undefined, datetimeOptions)
                    : event.endsAt.toLocaleTimeString(
                        undefined,
                        timeOptions,
                      ))}{" "}
            </ItemDescription>
            <ItemFooter>
              <p>
                by {event.creator.currentUser ? "you" : event.creator.username}
              </p>
            </ItemFooter>
          </ItemContent>
        </Item>
      </DialogTrigger>
      <DialogContent className="gap-0">
        <DialogHeader className="mb-4 gap-0">
          <DialogTitle className="font-bold text-lg">{event.title}</DialogTitle>
          <DialogDescription className="text-sm font-light">
            Created by {event.creator.username}
          </DialogDescription>
        </DialogHeader>

        {event.creator.currentUser ? (
          <div className="mb-4">
            <Label htmlFor="status" className="mb-4">
              Status
            </Label>
            <NativeSelect
              id="status"
              name="status"
              aria-label="Change event status"
              disabled={pending}
              defaultValue={event.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <NativeSelectOption value="proposed">Proposed</NativeSelectOption>
              <NativeSelectOption value="planned">Planned</NativeSelectOption>
              <NativeSelectOption value="canceled">Canceled</NativeSelectOption>
            </NativeSelect>
          </div>
        ) : (
          <>
            <span className="text-sm font-medium block">Status</span>
            <span className="mb-3">
              {event.status[0].toUpperCase() + event.status.slice(1)}
            </span>
          </>
        )}

        <span className="text-sm font-medium block">Start Time</span>
        <span className="mb-3">
          {event.startsAt.toLocaleString(undefined, datetimeOptions)}
        </span>

        {event.endsAt && (
          <>
            <span className="text-sm font-medium block">End Time</span>
            <span className="mb-3">
              {event.endsAt.toLocaleString(undefined, datetimeOptions)}
            </span>
          </>
        )}

        {event.description && (
          <>
            <span className="text-sm font-medium block">Description</span>
            <div className="wrap-break-word overflow-y-auto max-h-24 border px-1 sm:px-2 rounded-md mb-3">
              {event.description}
            </div>
          </>
        )}

        <div className="mb-8 sm:mb-4">{event.attendeeCount} attending</div>

        <DialogFooter>
          <Button variant="secondary" asChild>
            <Link
              href={{
                pathname: `/planner/calendar/${event.groupId}`,
                query: { date: event.startsAt.toLocaleDateString() },
              }}
            >
              View in calendar
            </Link>
          </Button>
          {event.creator.currentUser ? (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={pending}
            >
              Delete Event
            </Button>
          ) : (
            <Button disabled={pending} onClick={handleAttending}>
              Mark as {event.isAttending ? "not attending" : "attending"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
