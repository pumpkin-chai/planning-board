import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createClient } from "@/lib/supabase/server";
import { NavigationMenu } from "@/components/ui/navigation-menu";

export default async function Info() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const uid = data?.claims.sub;

  return (
    <>
      <NavigationMenu className="max-w-screen fixed w-screen top-0 left-0 bg-background">
        <Link href="/planner" className="text-xl font-bold">
          GroupPlan
        </Link>
        <AuthButton />
      </NavigationMenu>
      <main>
        <section className="flex flex-col justify-center items-center p-12 h-screen bg-linear-to-br from-secondary via-card to-secondary">
          <h1 className="text-center text-5xl sm:text-6xl font-bold mb-4 sm:mb-8">
            Make hangouts happen
          </h1>

          <h3 className="text-center justify-center text-xl">
            A shared calendar and event planning app for indecisive friend
            groups
          </h3>

          <div className="flex gap-2 mt-8">
            {uid ? (
              <Button asChild size="lg" variant="default">
                <Link href="/planner">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant={"outline"}>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild size="lg" variant={"default"}>
                  <Link href="/auth/sign-up">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        <div className="px-4 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Shared Calendar with Friends</CardTitle>
                <CardDescription>
                  Compare availabilities to find the right time to meet
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Organize Groups</CardTitle>
                <CardDescription>Manage Access to your Events</CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Vote on Event Details</CardTitle>
                <CardDescription>
                  Don&apos;t Agree? Hold a vote!
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Propose Dates</CardTitle>
                <CardDescription>
                  Date doesn&apos;t work? Propose a new one!
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <h2 className="text-xl font-bold mt-16">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="mt-6 mb-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is GroupPlan free?</AccordionTrigger>
              <AccordionContent>
                Yes! This was made as a group assignment for a university course
                and is completely free to use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Do you offer location suggestions?
              </AccordionTrigger>
              <AccordionContent>
                That is our goal for a future update, but currently we do not
                have that feature implemented.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Is there a limit to how many groups you can join?
              </AccordionTrigger>
              <AccordionContent>No! There is no limit!</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-2 py-16">
        <p>Made with ❤ and Pumpkin Chai ☕</p>
        <ThemeSwitcher />
      </footer>
    </>
  );
}
