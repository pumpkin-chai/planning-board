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
import { ChangeEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export type EventProposal = {
  title: string;
  description: string;
  startsAt: Date;
  endsAt: Date | null;
};

export function EventProposalDialog({ group }: { group: number }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const handlePropose = (proposal: EventProposal) => {
    setLoading(true);

    const propose = async () => {
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
        router.refresh();
      }

      setLoading(false);
    };

    propose();
  };

  const handleEventNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleEventStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };

  const handleEventEndChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleEventDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDesc(event.target.value);
  };

  const handleSubmit = () => {
    if (!title || !startDate) {
      setFailed(true);
      return;
    }
    handlePropose({
      title: title,
      description: desc,
      startsAt: new Date(startDate),
      endsAt: endDate ? new Date(endDate) : null,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (open === false) {
      setFailed(false);
    }
    setOpen(open);
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
                  failed && !title
                    ? "border-red-500 focus-visible:ring-red-300"
                    : ""
                }
                required
              />
              <Label htmlFor="desc">Description</Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={desc}
                onChange={handleEventDescChange}
              />
              <Label htmlFor="date">Start Date</Label>
              <Input
                id="date"
                type="datetime-local"
                name="date"
                value={startDate}
                onChange={handleEventStartChange}
                className={
                  failed && !startDate
                    ? "border-red-500 focus-visible:ring-red-300"
                    : ""
                }
                required
              />
              <Label htmlFor="date">End Date</Label>
              <Input
                id="date"
                type="datetime-local"
                name="date"
                value={endDate}
                defaultValue={undefined}
                onChange={handleEventEndChange}
              />
            </div>
            {failed && (!title || !startDate) && (
              <p className="text-sm text-red-500">
                Please fill in all required fields.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              Create Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
