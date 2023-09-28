"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export type ThemeContextType = {
  themeMode?: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  loading: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setTheme] = useState<ThemeMode | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const initializeTheme = useCallback(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === ThemeMode.Dark || savedTheme === ThemeMode.Light) {
      document.documentElement.classList.add(savedTheme);
      setTheme(savedTheme as ThemeMode);
      setLoading(false);
    } else {
      const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? ThemeMode.Dark
        : ThemeMode.Light;
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
      setTheme(theme);
      setLoading(false);
    }
  }, []);

  useEffect(() => initializeTheme(), [initializeTheme]);

  const setThemeMode = useCallback((theme: ThemeMode) => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove(ThemeMode.Dark, ThemeMode.Light);
    document.documentElement.classList.add(theme);
    setTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setTheme: setThemeMode,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
