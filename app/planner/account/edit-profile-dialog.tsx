"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export function EditProfileDialogue({
    uid,
    user_name,
    firstname,
    lastname,
}:{
    uid : string;
    user_name : string;
    firstname : string;
    lastname : string;
}){
    const router = useRouter();
    const supabase = createClient();

    const [firstName, setFirstName] = useState<string>(firstname);
    const [lastName, setLastName] = useState<string>(lastname);
    const [userName, setUserName] = useState<string>(user_name);

    const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    };

    const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const handleSubmit = () => {
        const submit = async () => {
            const { data } = await supabase
                .from("profiles")
                .update({
                    username: userName, 
                    first_name: firstName, 
                    last_name: lastName,
                })
                .eq("id", uid)
                .select("id")
            if (data) {
                console.log(data)
                router.refresh();
            } else {
                console.log("error");
            }
        };

        submit();
    };

    

    return(
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                            Make changes to your profile here. Click save when you're
                            done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">First Name</Label>
                            <Input id="name-1" name="firstName" defaultValue={firstname} onChange={handleFirstNameChange}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="name-2">Last Name</Label>
                            <Input id="name-2" name="lastName" defaultValue={lastname} onChange={handleLastNameChange}/>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Username</Label>
                            <Input id="username-1" name="username" defaultValue={user_name} onChange={handleUserNameChange}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}