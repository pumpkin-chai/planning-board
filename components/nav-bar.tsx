import {
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { AuthButton } from "@/components/auth-button";
import { NavBarBase } from "./nav-bar-base";

export function NavBar({ className }: { className?: string }) {
  return (
    <NavBarBase className={className}>
      <NavigationMenuItem>
        <AuthButton />
      </NavigationMenuItem>
    </NavBarBase>
  );
}

