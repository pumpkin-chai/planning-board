import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditProfileDialog } from "./edit-profile-dialog";

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileFetchError } = await supabase
    .from("profiles")
    .select("username, firstName:first_name, lastName:last_name")
    .eq("id", user.id)
    .single();

  if (profileFetchError) {
    console.error(profileFetchError);
    return <p>Error loading profile</p>;
  }

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">Profile</h1>

      <section>
        <EditProfileDialog
          username={profile.username}
          firstName={profile.firstName}
          lastName={profile.lastName}
        />
      </section>
    </div>
  );
}
