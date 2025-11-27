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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SetGroupVisibilityButton({
  groupId,
  isPrivate,
}: {
  groupId: string;
  isPrivate: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleSetVisibility = () => {
    const changeVisibility = async () => {
      const { error, count } = await supabase
        .from("Groups")
        .update(
          {
            is_private: !isPrivate,
          },
          { count: "exact" },
        )
        .eq("id", groupId);

      if (error || count === 0) {
        toast.error("Failed to change visibility", {
          description: `Failed to change this group's visibility to ${isPrivate ? "public" : "private"}. Please try again later.`,
        });
      } else {
        router.refresh();
        toast.success("Visibility changed", {
          description: `Successfully set group visibility to ${isPrivate ? "public" : "private"}.`,
        });
      }
    };
    changeVisibility();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          Make Group {isPrivate ? "Public" : "Private"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will change the group&apos;s visibility to{" "}
            <strong>{isPrivate ? "public" : "private"}</strong>.{" "}
            {isPrivate
              ? "Anyone with the group ID will be able to find and join this group."
              : "Only invited members will be able to find and join this group."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSetVisibility}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
