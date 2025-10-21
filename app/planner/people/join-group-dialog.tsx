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

import { UserRoundSearch } from "lucide-react";
import { useState } from "react";

export function JoinGroupDialog({
  joinGroupAction,
}: {
  joinGroupAction: (id: number) => void;
}) {
  const [groupID, setGroupID] = useState<number>(0);

  const handleGroupIDChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setGroupID(Number.isInteger(target.value) ? Number(target.value) : 0);
  };

  const handleJoinGroup = () => {
    if (!groupID || !Number.isInteger(Number(groupID))) {
      return;
    }
    joinGroupAction(groupID);
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <UserRoundSearch />
            Join Group
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Group</DialogTitle>
            <DialogDescription>
              Join an existing calendar group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="id-1">Group ID</Label>
              <Input
                id="id-1"
                type="number"
                name="id"
                onChange={handleGroupIDChange}
                value={groupID}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={handleJoinGroup}>
                Join Group
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
