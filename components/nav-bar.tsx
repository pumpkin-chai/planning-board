"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AuthButton } from "@/components/auth-button";
import { Mail, House, Calendar, CircleUser } from "lucide-react";
import Link from "next/link";

export function NavBar({ className }: { className?: string }) {
  return (
    <NavigationMenu className={`min-w-full ${className}`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/planner">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/planner/people">People</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/planner/account">Account</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/planner/notifications">
              <Mail />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {/* <NavigationMenuItem> */}
        {/*   <AuthButton /> */}
        {/* </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function NavBarMobile({ className }: { className?: string }) {
  return (
    <NavigationMenu
      className={`block max-w-screen fixed left-0 bottom-0 py-2 px-3 bg-background w-screen justify-center border-t border-border ${className}`}
    >
      <NavigationMenuList className="gap-3">
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild>
            <Link href="/planner">
              <House className="size-[20px] mx-auto" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild>
            <Link href="/planner/people">
              <Calendar className="size-[20px] mx-auto" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild>
            <Link href="/planner/notifications">
              <Mail className="size-[20px] mx-auto" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex-1">
          <NavigationMenuLink asChild>
            <Link href="/planner/account">
              <CircleUser className="size-[20px] mx-auto" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
