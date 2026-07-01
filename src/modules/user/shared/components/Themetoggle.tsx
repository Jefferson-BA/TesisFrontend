"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

export default function ThemeToggle() {
  const { isDark, toggle } = useThemeStore();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      className="group relative h-10 w-10 shrink-0 rounded-full border border-char bg-char flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-ember/70 hover:shadow-[0_0_16px_color-mix(in_oklch,var(--ember)_25%,transparent)] active:scale-90"
    >
      <Sun
        className={`absolute h-4 w-4 text-ember transition-all duration-500 ${
          isDark ? "translate-y-6 opacity-0 rotate-90" : "translate-y-0 opacity-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 text-ember transition-all duration-500 ${
          isDark ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-6 opacity-0 -rotate-90"
        }`}
      />
    </button>
  );
}