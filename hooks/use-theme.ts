// hooks/use-theme.ts
"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to get the actual current theme (resolved from system if needed)
  const currentTheme = resolvedTheme || theme;

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme: currentTheme,
    mounted,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
  };
}