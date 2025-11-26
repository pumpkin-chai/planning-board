"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InviteMemberDialog({
  groupId,
  inviterId,
}: {
  groupId: number;
  inviterId: string;
}) {
  const supabase = createClient();

  const [username, setUsername] = useState<string>("");

  const handleInvite = async () => {
    const { data: inviteeData } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (!inviteeData) {
      toast.error("Invite failed", {
        description: `User ${username} not found`,
      });
      return;
    }

    const { error } = await supabase.from("invitations").insert({
      inviter_id: inviterId,
      invitee_id: inviteeData.id,
      group_id: groupId,
    });

    if (error) {
      if (error.code === "23505") {
        toast.error("Invite failed", {
          description: `User ${username} has already been invited`,
        });
      } else {
        toast.error("Failed to send invite. Please try again later.");
      }
    } else {
      toast.success(`Invite sent to ${username}!`);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">
            <UserRoundPlus />
            Invite Member
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Invite a user to join this calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Username</Label>
              <Input
                id="name-1"
                name="name"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleInvite}>
                Invite User
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
