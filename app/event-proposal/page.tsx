import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { CalendarIcon, CalendarX2, CalendarPlus, BellRing, Calendar1 } from "lucide-react";

import { Button } from "@/components/ui/button";

import CreateEvent from "./createEvent";

import { Input } from "@/components/ui/input"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function EventProposal(){
    // const supabase = await createClient();

    // const { data, error } = await supabase.auth.getClaims();
    // if (error || !data?.claims) {
    //     redirect("/auth/login");
    // }

    // const testClick = () => {
    //     alert("Button Clicked");
    // }

    return(
        <main>
            <div className="px-8 py-3 w-full">
                <h1 className="self-start text-5xl font-bold mb-8">Events</h1>
                <section className="mb-12">
                    <h2 className="text-2xl mb-4">Your Events</h2>
                    <div className="p-4 bg-secondary">
                        <Empty className="size-full">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <CalendarX2 />
                                </EmptyMedia>
                                <EmptyTitle>No Events!</EmptyTitle>
                                <EmptyDescription>
                                Click 'Propose Event' to create an event!
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button><CalendarPlus />Propose Event</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                            <DialogTitle>Create an event!</DialogTitle>
                                                <FieldSet>
                                                    {/* <FieldLegend>Profile</FieldLegend>
                                                    <FieldDescription>This appears on invoices and emails.</FieldDescription> */}
                                                    <FieldGroup>
                                                        <Field>
                                                            <FieldLabel htmlFor="name" className="mt-4">Event Name</FieldLabel>
                                                            <Input id="name" autoComplete="off" placeholder="Event Name" />
                                                            {/* <FieldDescription>This appears on invoices and emails.</FieldDescription> */}
                                                        </Field>
                                                        <Field>
                                                            <FieldLabel htmlFor="description">Event Description</FieldLabel>
                                                            <Input id="description" autoComplete="off" aria-invalid />
                                                            {/* <FieldError>Choose another username.</FieldError> */}
                                                        </Field>
                                                        <Field orientation="horizontal">
                                                            <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>
                                                        </Field>
                                                    </FieldGroup>
                                                </FieldSet>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </EmptyContent>
                        </Empty>


                    </div>
                </section>    
            </div>
        </main>
    );
}