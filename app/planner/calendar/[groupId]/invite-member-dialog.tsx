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
import { inviteUser } from "@/lib/actions/user-actions";
import { PostgrestError } from "@supabase/supabase-js";

import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InviteMemberDialog({ groupId }: { groupId: number }) {
  const [username, setUsername] = useState<string>("");

  const handleInvite = async () => {
    try {
      await inviteUser(username, groupId);
      toast.success(`Invite sent to ${username}!`);
    } catch (e) {
      if (e instanceof PostgrestError && e.code === "23505") {
        toast.error("Invite failed", {
          description: `User ${username} has already been invited`,
        });
      } else {
        toast.error("Invite failed", {
          description: `Failed to send invite. Please try again later.`,
        });
      }
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
              <Label htmlFor="invitee">Invitee</Label>
              <Input
                id="invitee"
                name="invitee"
                placeholder="Username"
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
