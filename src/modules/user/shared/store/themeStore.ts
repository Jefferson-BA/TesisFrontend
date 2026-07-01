import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
  _apply: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      isDark: true,

      _apply: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          document.documentElement.style.colorScheme = theme;
        }
      },

      toggle: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get()._apply(next);
        set({ theme: next, isDark: next === "dark" });
      },

      setTheme: (theme) => {
        get()._apply(theme);
        set({ theme, isDark: theme === "dark" });
      },
    }),
    {
      name: "deparraspitz-theme",
      onRehydrateStorage: () => (state) => {
        if (state) state._apply(state.theme);
      },
    }
  )
);