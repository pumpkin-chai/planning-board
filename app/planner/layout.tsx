import { ThemeSwitcher } from "@/components/theme-switcher";
import { NavBar, NavBarMobile } from "@/components/nav-bar";
import { Toaster } from "sonner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar className="hidden sm:flex" />
      <main className="min-h-screen flex flex-col items-center mb-32 sm:mb-0">
        {children}
        <Toaster />
      </main>
      <footer className="hidden sm:flex w-full items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        <ThemeSwitcher />
      </footer>
      <NavBarMobile className="sm:hidden" />
    </>
  );
}
