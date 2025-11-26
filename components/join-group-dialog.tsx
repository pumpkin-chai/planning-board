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

import { UserRoundSearch } from "lucide-react";
import { ChangeEvent, useState, useTransition } from "react";
import { toast } from "sonner";

export function JoinGroupDialog({
  onJoinGroup,
}: {
  onJoinGroup?: (group: Group) => void;
}) {
  const supabase = createClient();

  const [pending, startTransition] = useTransition();

  const [open, setOpen] = useState<boolean>(false);

  const [groupId, setGroupID] = useState<string>("0");
  const handleGroupIDChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupID(event.target.value);
  };

  const handleJoinGroup = () => {
    if (!groupId || !Number.isInteger(Number(groupId))) {
      return;
    }

    startTransition(async () => {
      const{data :groupData, error: groupError} = await supabase
        .from("Groups")
        .select('id, name, is_private')
        .eq('id', groupId)
        .single();  

      console.log(groupData);

      if (!groupData || groupError) {
        toast.error("Failed to join group", {
          description: `Failed to join group with ID ${groupId}. Please try again later.`,
        });
      } else if(groupData?.is_private){
        toast.error("Failed to join group", {
          description: `Group is private! Ask the owner for an invite.`,
        });
      } else{
      
        const { data, error } = await supabase
          .from("Memberships")
          .insert({ group_id: Number(groupId) })
          .select("group:Groups(id, name, is_private)")
          .single()
          .overrideTypes<{ group: { id: number; name: string; is_private: boolean} }>();

        if (!data || error) {
          toast.error("Failed to join group", {
            description: `Failed to join group with ID ${groupId}. Please try again later.`,
          });
        }  else {
          toast.success("Group joined", {
            description: `Successfully joined group ${data.group.name}`,
          });
          onJoinGroup?.(data.group);
          setOpen(false);
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                value={groupId}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={pending} onClick={handleJoinGroup}>
              Join Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
