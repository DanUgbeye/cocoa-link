import { CocoaStore, Transaction, User } from "@/types";
import { create } from "zustand";

export type AppState = {
  initialised: boolean;
  sidenavOpen: boolean;
  transactions: Transaction[];
  user?: User;
  cocoaStore?: CocoaStore;
};

export type StoreInitialState = {
  transactions: Transaction[];
  user?: User;
  cocoaStore?: CocoaStore;
};

export type AppActions = {
  initialiseStore(state: StoreInitialState): void;
  toggleSidenav(state?: boolean): void;
  setUser(user?: User): void;
  setTransactions(transactions: Transaction[]): void;
  setCocoaStore(cocoaStore?: CocoaStore): void;
};

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
  initialised: false,
  initialiseStore(state) {
    set({ ...state, initialised: true });
  },

  sidenavOpen: false,
  toggleSidenav(state) {
    if (state !== undefined) {
      set({ sidenavOpen: state });
    } else {
      const { sidenavOpen } = get();
      set({ sidenavOpen: !sidenavOpen });
    }
  },

  user: undefined,
  setUser(user) {
    set({ user });
  },

  cocoaStore: undefined,
  setCocoaStore(cocoaStore) {
    set({ cocoaStore });
  },

  transactions: [],
  setTransactions(transactions) {
    set({ transactions });
  },
}));
