import { create } from 'zustand';

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  notificationsOpen: boolean;
  activeModal: string | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  notificationsOpen: false,
  activeModal: null,

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
}));
