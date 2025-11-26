"use client";

import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export type EventProposal = {
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date | null;
};

export function EventProposalDialog({ group }: { group: number }) {
  const router = useRouter();
  const supabase = createClient();

  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  const handlePropose = (proposal: EventProposal) => {
    startTransition(async () => {
      const { error } = await supabase.from("Events").insert({
        group_id: group,
        title: proposal.title,
        description: proposal.description,
        starts_at: proposal.startsAt,
        ends_at: proposal.endsAt,
        status: "proposed",
      });

      if (error) {
        toast.error("Event proposal failed", {
          description: `Failed to propose "${proposal.title}." Please try again later.`,
        });
      } else {
        toast.success("Event proposed", {
          description: `"${proposal.title}" proposed for ${proposal.startsAt.toLocaleString()}.`,
        });
        setTitle("");
        setDesc("");
        startDateRef.current!.value = "";
        endDateRef.current!.value = "";
        router.refresh();
      }

      setFailed(false);
    });
  };

  const handleEventNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleEventDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value);
  };

  const handleSubmit = () => {
    if (!endDateRef.current || !startDateRef.current) {
      return;
    }

    if (!title || !startDateRef.current.value) {
      setFailed(true);
      return;
    }

    handlePropose({
      title: title,
      description: desc,
      startsAt: new Date(startDateRef.current.value),
      endsAt: endDateRef.current.value
        ? new Date(endDateRef.current.value)
        : null,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (open === false) {
      setFailed(false);
    }
    setOpen(open);
  };

  const handleClearStartDate = () => {
    if (startDateRef.current) {
      startDateRef.current.value = "";
    }
  };

  const handleClearEndDate = () => {
    if (endDateRef.current) {
      endDateRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">Propose Event</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Propose Event</DialogTitle>
            <DialogDescription>
              Propose a new event to the group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Event Name"
                value={title}
                onChange={handleEventNameChange}
                className={
                  failed ? "border-red-500 focus-visible:ring-red-300" : ""
                }
                required
              />

              <Label htmlFor="desc">
                Description{" "}
                <span className="text-xs text-muted-foreground">*Optional</span>
              </Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={desc}
                onChange={handleEventDescChange}
              />

              <Label htmlFor="start-date">Start Date</Label>
              <div className="flex items-center gap-1 sm:gap-2">
                <Input
                  id="start-date"
                  type="datetime-local"
                  name="start-date"
                  className={
                    failed ? "border-red-500 focus-visible:ring-red-300" : ""
                  }
                  ref={startDateRef}
                  required
                />
                <Button
                  variant="ghost"
                  className="px-2 py-1"
                  onClick={handleClearStartDate}
                >
                  <X />
                </Button>
              </div>

              <Label htmlFor="end-date">
                End Date{" "}
                <span className="text-xs text-muted-foreground">*Optional</span>
              </Label>
              <div className="flex items-center gap-1 sm:gap-2">
                <Input
                  id="end-date"
                  type="datetime-local"
                  name="end-date"
                  className="grow"
                  ref={endDateRef}
                />
                <Button
                  variant="ghost"
                  className="px-2 py-1"
                  onClick={() => handleClearEndDate()}
                >
                  <X />
                </Button>
              </div>
            </div>
            {failed && (
              <p className="text-sm text-red-500">
                Please fill in all required fields.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={pending}>
              Create Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
