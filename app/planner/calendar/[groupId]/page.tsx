import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EventCalendar } from "./event-calendar";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ groupId: string[] }>;
}) {
  const { groupId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data } = await supabase
    .from("Groups")
    .select("name")
    .eq("id", groupId)
    .single();
  console.log("Group Data:", data);

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">
        {data ? data.name : "Calendar"}
      </h1>
      <section>
        <h2 className="text-2xl mb-4">Calendar</h2>
        <div className="flex justify-center p-8 bg-secondary">
          <EventCalendar />
        </div>
      </section>
    </div>
  );
}
