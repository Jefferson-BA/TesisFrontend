import { useTheme } from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

/**
 * Botón flotante para alternar entre tema claro y oscuro.
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="
        group relative h-10 w-10 shrink-0 rounded-full
        border border-border dark:border-[#3d2c1f]/60
        bg-background dark:bg-[#14100d]
        flex items-center justify-center overflow-hidden
        transition-all duration-300
        hover:border-amber-500/70 hover:shadow-[0_0_16px_rgba(234,179,8,0.25)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
        active:scale-90
      "
    >
      <Sun
        className={`absolute h-4 w-4 text-amber-500 transition-all duration-500 ease-out ${
          isDark ? "translate-y-6 opacity-0 rotate-90" : "translate-y-0 opacity-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 text-yellow-400 transition-all duration-500 ease-out ${
          isDark ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-6 opacity-0 -rotate-90"
        }`}
      />
    </button>
  );
}