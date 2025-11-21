"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MembersDialog({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className={className}>{label}</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Members</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">fjdskfjkasdl</div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
