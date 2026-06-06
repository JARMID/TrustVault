import { create } from 'zustand';

type Theme = 'light' | 'dark';

// Read persisted theme or default to 'light' (bank-app oriented)
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('tv-theme') as Theme | null;
  return saved === 'dark' ? 'dark' : 'light';
};

// Apply theme to DOM immediately
const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('tv-theme', theme);
};

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  activeModal: string | null;
  theme: Theme;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationsOpen: false,
  activeModal: null,
  theme: initialTheme,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    return { theme: next };
  }),
}));

