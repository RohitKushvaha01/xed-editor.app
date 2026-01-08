"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
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
                  onClick={() => {
                    window.location.href =
                      "https://xed-editor.github.io/Xed-Docs/";
                  }}
                >
                  Docs
                </Button>
                <Button variant="ghost">FAQ</Button>
                <Button variant="ghost">Plugins</Button>
              </div>
            </SheetContent>
          </Sheet>

          <div
            className="text-lg font-semibold"
            onClick={() => router.push("/")}
          >
            Xed-Editor
          </div>
        </div>

        {/* RIGHT SIDE (UNCHANGED) */}
        <Button onClick={() => router.push("/login")}>Login</Button>
      </div>
    </header>
  );
}
