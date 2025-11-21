import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();
  let user = null;
  if (authData) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", authData.claims.sub)
      .single();
    user = data?.username;
  }

  return user ? (
    <div className="flex items-center gap-4 text-sm">
      {user}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
