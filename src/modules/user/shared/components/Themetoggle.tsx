// src/modules/user/shared/components/Themetoggle.tsx

"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className={cn(
        "group relative h-10 w-10 shrink-0 rounded-full border flex items-center justify-center overflow-hidden transition-all duration-300 active:scale-90",
        "dark:bg-char dark:border-char dark:hover:border-ember/70 dark:hover:shadow-[0_0_16px_color-mix(in_oklch,var(--ember)_25%,transparent)]",
        "bg-stone-100 border-stone-200 hover:border-amber-300 hover:shadow-[0_0_16px_rgba(201,151,74,0.2)]",
      )}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 text-ember transition-all duration-500",
          isDark ? "translate-y-6 opacity-0 rotate-90" : "translate-y-0 opacity-100 rotate-0",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 text-ember transition-all duration-500",
          isDark ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-6 opacity-0 -rotate-90",
        )}
      />
    </button>
  );
}