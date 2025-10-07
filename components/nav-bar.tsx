import { hasEnvVars } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";

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
          <NavigationMenuLink href="/planner/account">Account</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
    </NavigationMenu>
  );
}
