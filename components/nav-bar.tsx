import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AuthButton } from "@/components/auth-button";
import { Mail, House, Calendar, CircleUser } from "lucide-react";

export function NavBar({ className }: { className?: string }) {
  return (
    <NavigationMenu className={`min-w-full ${className}`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner">Home</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner/people">People</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner/account">
            Account
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="flex items-center gap-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/planner/notifications">
              <Mail />
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <AuthButton />
      </div>
    </NavigationMenu>
  );
}

export function NavBarMobile({ className }: { className?: string }) {
  return (
    <NavigationMenu
      className={`max-w-screen fixed left-0 bottom-0 p-4 bg-background w-screen flex justify-center border-t border-border ${className}`}
    >
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner">
            <House className="size-[20px]" />
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner/people">
            <Calendar className="size-[20px]" />
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner/notifications">
            <Mail className="size-[20px]" />
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/planner/account">
            <CircleUser className="size-[20px]" />
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
