import {Button} from "@/components/ui/button";
import {ButtonGroup} from "@/components/ui/button-group";
import Link from "next/link";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Welcome(){
    return(
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="w-[80%] h-[90%] flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-500 via-white to-gray-500 rounded-2xl">
                <h1 className="text-center text-4xl font-bold">
                    Make hangouts happen with one simple planner!
                </h1>

                <h3 className="text-center justify-center py-1 text-2xl">Coordinate with any or all friends with ease</h3>
                <ButtonGroup className="flex justify-center items-center pt-5">
                    <Button asChild size="lg" variant="outline">
                        <Link href="../auth/sign-up">Sign Up</Link>
                    </Button>
                    <Button asChild size="lg" variant="default">
                        <Link href="../auth/login">Login</Link>
                    </Button>
                </ButtonGroup>
            </div>

            <div className="max-w-[80%] flex pt-5">
                <Card className="mr-5">
                    <CardHeader>
                        <CardTitle>Shared Calendar with Friends</CardTitle>
                        <CardDescription>Compare Calendars</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="mr-5">
                    <CardHeader>
                        <CardTitle>Organize Groups</CardTitle>
                        <CardDescription>Manage Access to your Events</CardDescription>
                    </CardHeader>
                </Card>
                <Card className="mr-5">
                    <CardHeader>
                        <CardTitle>Vote on Event Details</CardTitle>
                        <CardDescription>Don't Agree? Hold a vote!</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Propose Dates</CardTitle>
                        <CardDescription>Date doesn't work? Propose a new one!</CardDescription>
                    </CardHeader>
                </Card>
            </div>


            <h1 className="text-xl font-bold pt-10">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible className="w-[70%] px-8 pt-10 pb-10">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is GroupPlan free?</AccordionTrigger>
                    <AccordionContent>
                        Yes! This was made as a group assignment for a university course and is completely free to use.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Do you offer location suggestions?</AccordionTrigger>
                    <AccordionContent>
                        That is our goal for a future update, but currently we do not have that feature implemented.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Is there a limit to how many groups you can join?</AccordionTrigger>
                    <AccordionContent>
                        No! There is no limit!
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}