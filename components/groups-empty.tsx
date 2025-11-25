import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GroupManagementButtons } from "@/components/group-management-buttons";
import { CalendarIcon } from "lucide-react";

export function GroupsEmpty() {
  return (
    <Empty className="size-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarIcon />
        </EmptyMedia>
        <EmptyTitle>No calendars yet!</EmptyTitle>
        <EmptyDescription>
          You currently have no calendars. Get started by creating one below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <GroupManagementButtons />
      </EmptyContent>
    </Empty>
  );
}
