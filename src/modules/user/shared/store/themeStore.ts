import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
  _apply: (theme: Theme) => void;
}

export const applyThemeToDOM = (theme: Theme) => {
  if (typeof document === "undefined") return;
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = theme;

  try {
    localStorage.setItem("theme", theme);
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {}
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      isDark: true,

      _apply: (theme) => {
        applyThemeToDOM(theme);
      },

      toggle: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        get()._apply(next);
        set({ theme: next, isDark: next === "dark" });
      },

      setTheme: (theme: Theme) => {
        get()._apply(theme);
        set({ theme, isDark: theme === "dark" });
      },
    }),
    {
      name: "deparraspitz-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.theme);
        }
      },
    }
  )
);

// Escuchar cambios de tema entre pestañas (cross-tab synchronization) y transiciones de Astro
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "deparraspitz-theme" || e.key === "theme") {
      try {
        let newTheme: Theme | null = null;
        if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
          newTheme = e.newValue as Theme;
        } else if (e.key === "deparraspitz-theme" && e.newValue) {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.state?.theme === "light" || parsed?.state?.theme === "dark") {
            newTheme = parsed.state.theme as Theme;
          }
        }

        if (newTheme && newTheme !== useThemeStore.getState().theme) {
          useThemeStore.getState().setTheme(newTheme);
        }
      } catch {}
    }
  });

  // Re-aplicar tema tras navegación de páginas en Astro (View Transitions)
  document.addEventListener("astro:after-swap", () => {
    applyThemeToDOM(useThemeStore.getState().theme);
  });
}