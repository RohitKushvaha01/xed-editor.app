"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, UserCircle } from "lucide-react"; // Added UserCircle icon
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter, usePathname } from "next/navigation";
import { ModeToggle } from "../modtoggle";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  logoutAction?: () => Promise<void>;
}

export default function Header({ user, logoutAction }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const isDashboard = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 pt-8">
              <VisuallyHidden>
                <SheetTitle>Navigation Menu</SheetTitle>
              </VisuallyHidden>
              <div className="mt-6 flex flex-col gap-4">
                <Button variant="ghost" onClick={() => router.push("/")}>
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() =>
                    (window.location.href =
                      "https://xed-editor.github.io/Xed-Docs/")
                  }
                >
                  Docs
                </Button>
                <Button variant="ghost">FAQ</Button>
                <Button variant="ghost">Plugins</Button>
              </div>
            </SheetContent>
          </Sheet>

          <div
            className="cursor-pointer text-lg font-semibold"
            onClick={() => router.push("/")}
          >
            Xed-Editor
          </div>
        </div>

        {/* RIGHT SIDE: Conditional Logic */}
        <div className="flex items-center gap-4">
          {!user ? (
            // 1. Not logged in -> Show Login
            <Button onClick={() => router.push("/login")}>Login</Button>
          ) : isDashboard ? (
            // 2. Logged in AND on Dashboard -> Show Logout
            <form action={logoutAction}>
              <Button variant="outline" type="submit">
                Logout
              </Button>
            </form>
          ) : (
            // 3. Logged in AND NOT on Dashboard -> Show Profile/Dashboard link
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
