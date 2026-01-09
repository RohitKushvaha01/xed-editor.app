"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" disabled />;
  }

  // Function to cycle through the three states
  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      title={`Current theme: ${theme} (Click to change)`}
      className="relative"
    >
      {/* Show Sun if light */}
      {theme === "light" && <Sun className="h-5 w-5" />}

      {/* Show Moon if dark */}
      {theme === "dark" && <Moon className="h-5 w-5" />}

      {/* Show Monitor if system */}
      {theme === "system" && <Monitor className="h-5 w-5" />}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
