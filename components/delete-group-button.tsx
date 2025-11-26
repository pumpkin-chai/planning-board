"use client";

import { createClient } from "@/lib/supabase/client";
import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteGroupButton({ groupId }: { groupId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await supabase
        .from("Groups")
        .delete()
        .eq("id", groupId);

      if (error) {
        toast.error("Group deletion failed", {
          description: "Failed to delete group. Please try again later.",
        });
      } else {
        router.push("/planner/people");
        toast.success("Group deleted", {
          description: "Successfully deleted group.",
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Group</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the group
            and all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
