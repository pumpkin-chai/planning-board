import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { AuthButton } from "@/components/auth-button";
import { Mail } from "lucide-react";

export default function NavBar() {
  return (
    <NavigationMenu className="min-w-full">
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
