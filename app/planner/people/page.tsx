import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, UserRoundSearch } from "lucide-react";

export default function People() {
  type Group = { id: number; name: string };
  const groups: Group[] = [
    { id: 1, name: "Family" },
    { id: 2, name: "Friends" },
    { id: 3, name: "Work" },
    { id: 4, name: "Gym Buddies" },
    { id: 5, name: "Book Club" },
  ];

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <div className="mb-6 flex items-stretch gap-4">
          <Button variant="default">
            <Plus />
            Create Group
          </Button>
          <Button variant="outline">
            <UserRoundSearch />
            Join Group
          </Button>
        </div>
        <GroupList groups={groups} />
      </section>
    </div>
  );
}

function GroupList({ groups }: { groups: Group[] }) {
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.id} className="mb-4 last:mb-0">
          <GroupCard group={group} />
        </li>
      ))}
    </ul>
  );
}

function GroupCard({ group }: { group: Group }) {
  return (
    <div className="border border-border p-6 rounded-lg cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-xl font-semibold">{group.name}</h3>
        <span className="text-sm text-muted-foreground">5 members</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline">Invite Members</Button>
          <Button variant="default">Leave</Button>
        </div>
        <ChevronRight className="ml-4" />
      </div>
    </div>
  );
}
