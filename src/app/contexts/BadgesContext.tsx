import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: "milestone" | "streak" | "genre" | "speed" | "social" | "special";
  icon: string;
  requirement: number;
  color: string;
}

interface BadgesContextType {
  earnedBadges: string[];
  unlockBadge: (badgeId: string) => Promise<void>;
  isBadgeEarned: (badgeId: string) => boolean;
  isLoaded: boolean;
  allBadges: Badge[];
}

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

const allBadges: Badge[] = [
  { id: "first-book", name: "First Book", description: "Complete your first book", category: "milestone", icon: "book", requirement: 1, color: "from-blue-400 to-blue-600" },
  { id: "10-books", name: "10 Books", description: "Read 10 books", category: "milestone", icon: "books", requirement: 10, color: "from-blue-400 to-blue-600" },
  { id: "50-books", name: "50 Books", description: "Read 50 books", category: "milestone", icon: "medal", requirement: 50, color: "from-blue-400 to-purple-600" },
  { id: "7-day-streak", name: "7 Day Streak", description: "Read for 7 consecutive days", category: "streak", icon: "flame", requirement: 7, color: "from-orange-400 to-red-500" },
  { id: "genre-explorer", name: "Genre Explorer", description: "Read 5 different genres", category: "genre", icon: "compass", requirement: 5, color: "from-green-400 to-teal-600" },
  { id: "speed-reader", name: "Speed Reader", description: "Read 3 books in a week", category: "speed", icon: "zap", requirement: 3, color: "from-yellow-400 to-orange-500" },
  { id: "reviewer", name: "Reviewer", description: "Rate 10 books", category: "social", icon: "star", requirement: 10, color: "from-yellow-400 to-yellow-600" },
  { id: "page-turner", name: "Page Turner", description: "Read 10,000 pages", category: "special", icon: "file-text", requirement: 10000, color: "from-blue-400 to-cyan-600" },
];

export function BadgesProvider({ children }: { children: ReactNode }) {
  const [earnedBadges] = useState<string[]>(["first-book", "7-day-streak"]);

  const unlockBadge = async (_badgeId: string) => {
    console.info("UI-only mode: badge progression is disabled.");
  };

  const isBadgeEarned = (badgeId: string) => earnedBadges.includes(badgeId);

  const value = useMemo<BadgesContextType>(
    () => ({
      earnedBadges,
      unlockBadge,
      isBadgeEarned,
      isLoaded: true,
      allBadges,
    }),
    [earnedBadges],
  );

  return <BadgesContext.Provider value={value}>{children}</BadgesContext.Provider>;
}

export function useBadges() {
  const context = useContext(BadgesContext);
  if (!context) {
    throw new Error("useBadges must be used within BadgesProvider");
  }
  return context;
}
