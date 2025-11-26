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
import { Group } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";
import { toast } from "sonner";

export function NewGroupDialog({
  onCreate,
}: {
  onCreate?: (group: Group) => void;
}) {
  const supabase = createClient();

  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [groupName, setGroupName] = useState<string>("New Group");
  const handleGroupNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  const [isPrivate, togglePrivate] = useState<boolean>(false);
  const handleCheckbox = () => {
    togglePrivate(!isPrivate);
  }

  const handleNewGroup = () => {
    startTransition(async () => {
      const { data, error } = await supabase
        .from("Groups")
        .insert({ name: groupName, is_private: isPrivate})
        .select("id, name")
        .single();
      if (!data || error) {
        toast.error("Group creation failed", {
          description: `Failed to create group "${groupName}". Please try again later.`,
        });
      } else {
        toast.success("Group created", {
          description: `Successfully created group "${data.name}"`,
        });
        onCreate?.(data);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus />
            Create Group
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>Make a new calendar group.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Group Name</Label>
              <Input
                id="name-1"
                name="name"
                onChange={handleGroupNameChange}
                value={groupName}
              />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="isPrivate" onClick={handleCheckbox}/>
              <Label htmlFor="isPrivate">Mark group as private</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending} onClick={handleNewGroup}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
