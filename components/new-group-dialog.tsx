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

import { Plus } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";
import { toast } from "sonner";

export function NewGroupDialog({
  onCreateAction,
}: {
  onCreateAction?: (group: Group) => void;
}) {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const handleNewGroup = (name: string) => {
    startTransition(async () => {
      const { data, error } = await supabase
        .from("Groups")
        .insert({ name })
        .select("id, name")
        .single();
      if (!data || error) {
        toast.error("Group creation failed", {
          description: `Failed to create group "${name}". Please try again later.`,
        });
      } else {
        toast.success("Group created", {
          description: `Successfully created group "${data.name}"`,
        });
        onCreateAction?.(data);
      }
    });
  };

  const [groupName, setGroupName] = useState<string>("New Group");

  const handleGroupNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupName(event.target.value);
  };

  return (
    <Dialog>
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                disabled={isPending}
                onClick={() => handleNewGroup(groupName)}
              >
                Create Group
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
