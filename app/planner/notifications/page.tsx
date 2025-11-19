import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { createClient } from "@/lib/supabase/server";
import { Check, X } from "lucide-react";

type Status = "pending" | "accepted" | "declined";

export default async function Notifications() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_invitations")
    .select("inviter, group:group_name, status");

  console.log(data);

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Notifications</h1>

      <section className="p-4 bg-secondary min-h-96">
        <ul>
          {data?.map((invite) => (
            <li key={`${invite.group}-${invite.inviter}`}>
              <Invite
                inviter={invite.inviter}
                group={invite.group}
                status={invite.status}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

async function Invite({
  inviter,
  group,
  status,
}: {
  inviter: string;
  group: string;
  status: Status;
}) {
  return (
    <div className="flex items-center justify-between bg-background p-4 rounded-lg">
      <div>
        <span className="font-bold">{inviter}</span> invited you to{" "}
        <span className="underline">{group}</span>
      </div>
      {status === "pending" ? (
        <ButtonGroup>
          <Button variant="ghost">
            <Check />
          </Button>
          <Button variant="ghost">
            <X />
          </Button>
        </ButtonGroup>
      ) : (
        <span className="text-muted-foreground text-sm">
          {status.toUpperCase()}
        </span>
      )}
    </div>
  );
}
