import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(true); // Arranca en true para conservar tu diseño oscuro premium

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
}