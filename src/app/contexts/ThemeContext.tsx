import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface ThemePalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  textColor: "light" | "dark";
  isGradient: boolean;
  backgroundColor: string;
  cardColor: string;
  borderColor: string;
  successColor: string;
  accentColor: string;
}

export function getTextColorForBackground(hexColor: string): "light" | "dark" {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "dark" : "light";
}

const themePresets: ThemePalette[] = [
  {
    id: "ocean-sunset",
    name: "Ocean Sunset",
    primary: "#3298ff",
    secondary: "#f83aef",
    textColor: "light",
    isGradient: true,
    backgroundColor: "#0a0a0a",
    cardColor: "#1a1a1a",
    borderColor: "#2a2a2a",
    successColor: "#3298ff",
    accentColor: "#3298ff",
  },
  {
    id: "neutral",
    name: "Neutral",
    primary: "#a07856",
    secondary: "#c8b799",
    textColor: "dark",
    isGradient: true,
    backgroundColor: "#faf8f5",
    cardColor: "#ffffff",
    borderColor: "#e8e3dc",
    successColor: "#a07856",
    accentColor: "#a07856",
  },
  {
    id: "monochrome",
    name: "Monochrome",
    primary: "#000000",
    secondary: "#4b5563",
    textColor: "light",
    isGradient: true,
    backgroundColor: "#000000",
    cardColor: "#1a1a1a",
    borderColor: "#333333",
    successColor: "#9ca3af",
    accentColor: "#ffffff",
  },
  {
    id: "burgundy",
    name: "Burgundy",
    primary: "#7c2d3a",
    secondary: "#4a1520",
    textColor: "light",
    isGradient: true,
    backgroundColor: "#1a0a0d",
    cardColor: "#2d1418",
    borderColor: "#4a1f27",
    successColor: "#b8485d",
    accentColor: "#b8485d",
  },
  {
    id: "periwinkle",
    name: "Periwinkle",
    primary: "#9fa8da",
    secondary: "#c5cae9",
    textColor: "dark",
    isGradient: false,
    backgroundColor: "#f5f6fa",
    cardColor: "#ffffff",
    borderColor: "#e8eaf6",
    successColor: "#5c6bc0",
    accentColor: "#5c6bc0",
  },
  {
    id: "electric-spectrum",
    name: "Electric Spectrum",
    primary: "#FF0000",
    secondary: "#1031C6",
    tertiary: "#86109D",
    textColor: "light",
    isGradient: true,
    backgroundColor: "#0a0514",
    cardColor: "#1a0a28",
    borderColor: "#2d1142",
    successColor: "#FF0000",
    accentColor: "#FF0000",
  },
];

interface ThemeContextType {
  currentTheme: ThemePalette;
  setTheme: (themeId: string) => void;
  allThemes: ThemePalette[];
  addCustomTheme: (theme: ThemePalette) => void;
  updateCustomTheme: (theme: ThemePalette) => void;
  deleteCustomTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [customThemes, setCustomThemes] = useState<ThemePalette[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemePalette>(themePresets[0]);

  const allThemes = useMemo(() => [...themePresets, ...customThemes], [customThemes]);

  const setTheme = (themeId: string) => {
    const nextTheme = allThemes.find((theme) => theme.id === themeId);
    if (nextTheme) {
      setCurrentTheme(nextTheme);
    }
  };

  const addCustomTheme = (theme: ThemePalette) => {
    setCustomThemes((prev) => [...prev, theme]);
    setCurrentTheme(theme);
  };

  const updateCustomTheme = (theme: ThemePalette) => {
    setCustomThemes((prev) => prev.map((existing) => (existing.id === theme.id ? theme : existing)));
    setCurrentTheme((prev) => (prev.id === theme.id ? theme : prev));
  };

  const deleteCustomTheme = (themeId: string) => {
    setCustomThemes((prev) => prev.filter((theme) => theme.id !== themeId));
    setCurrentTheme((prev) => (prev.id === themeId ? themePresets[0] : prev));
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        allThemes,
        addCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
      }}
    >
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
