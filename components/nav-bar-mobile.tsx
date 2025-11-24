import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Mail, House, Calendar, CircleUser } from "lucide-react";
import Link from "next/link";

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
