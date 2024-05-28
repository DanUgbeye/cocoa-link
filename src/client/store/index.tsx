import { create } from "zustand";

export type AppState = {
  sidenavOpen: boolean;
};

export type AppActions = {
  toggleSidenav(state?: boolean): void;
};

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
  sidenavOpen: false,
  toggleSidenav(state) {
    if (state !== undefined) {
      set({ sidenavOpen: state });
    } else {
      const { sidenavOpen } = get();
      set({ sidenavOpen: !sidenavOpen });
    }
  },
}));
