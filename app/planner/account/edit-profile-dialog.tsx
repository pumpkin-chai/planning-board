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
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export function EditProfileDialog({
  username,
  firstName,
  lastName,
}: {
  username: string;
  firstName: string;
  lastName: string;
}) {
  const supabase = createClient();

  const [pageData, setPageData] = useState({
    username: username,
    firstName: firstName,
    lastName: lastName,
  });

  const [firstNameInput, setFirstNameInput] = useState<string>(firstName);
  const [lastNameInput, setLastNameInput] = useState<string>(lastName);
  const [usernameInput, setUsernameInput] = useState<string>(username);

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstNameInput(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastNameInput(event.target.value);
  };

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(event.target.value);
  };

  const handleSubmit = () => {
    const submit = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: usernameInput,
          first_name: firstNameInput,
          last_name: lastNameInput,
        })
        .eq("username", username)
        .select("username, firstName:first_name, lastName:last_name")
        .single();

      if (error) {
        toast.error("Error updating profile. Please try again later.");
      } else {
        toast.success("Successfully updated profile.");
        setPageData(data);
      }
    };

    submit();
  };

  return (
    <div>
      <h2 className="mb-8">
        <span className="text-4xl font-bold block">
          {pageData.firstName} {pageData.lastName}
        </span>
        <span className="text-2xl">{pageData.username}</span>
      </h2>

      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">First Name</Label>
                <Input
                  id="name-1"
                  name="firstName"
                  value={firstNameInput}
                  onChange={handleFirstNameChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name-2">Last Name</Label>
                <Input
                  id="name-2"
                  name="lastName"
                  value={lastNameInput}
                  onChange={handleLastNameChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  value={usernameInput}
                  onChange={handleUserNameChange}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" onClick={handleSubmit}>
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
