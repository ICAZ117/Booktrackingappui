type ThemeRecord = {
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
};

const state = {
  themes: [] as ThemeRecord[],
  currentTheme: null as ThemeRecord | null,
  badges: [] as string[],
};

export const api = {
  themes: {
    async getAll() {
      return { themes: state.themes, currentTheme: state.currentTheme };
    },
    async setCurrent(theme: ThemeRecord) {
      state.currentTheme = theme;
      return theme;
    },
    async save(theme: ThemeRecord) {
      const existing = state.themes.findIndex((entry) => entry.id === theme.id);
      if (existing >= 0) {
        state.themes[existing] = theme;
      } else {
        state.themes.push(theme);
      }
      return theme;
    },
    async delete(themeId: string) {
      state.themes = state.themes.filter((theme) => theme.id !== themeId);
      if (state.currentTheme?.id === themeId) {
        state.currentTheme = null;
      }
    },
  },
  books: {
    async getAll() {
      return [];
    },
    async add(_book: any) {},
    async update(_id: string, _updates: any) {},
    async delete(_id: string) {},
  },
  readingSessions: {
    async getAll() {
      return [];
    },
    async log(_session: any) {},
  },
  bookshelves: {
    async getAll() {
      return [];
    },
    async save(_bookshelves: any[]) {},
  },
  badges: {
    async getEarned() {
      return state.badges;
    },
    async unlock(badgeId: string) {
      if (!state.badges.includes(badgeId)) {
        state.badges.push(badgeId);
      }
    },
  },
  async enrichBook(_params: { title?: string; author?: string; isbn?: string }) {
    return { found: false };
  },
};
