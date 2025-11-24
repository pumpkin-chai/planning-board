"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Mail } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function NavBarBase({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
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
        {children}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
