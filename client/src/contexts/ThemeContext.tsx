import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: undefined;
  switchable: false;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, switchable: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
