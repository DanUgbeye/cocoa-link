import {
  DealWithUser,
  FullDeal,
  FullDealWithUser,
  Metric,
  Transaction,
  User,
} from "@/types";
import { create } from "zustand";

export type StoreInitialState = {
  transactions: Transaction[];
  user?: User;
  metrics?: Metric;
};

export type AppState = {
  initialized: boolean;
  sideNavOpen: boolean;
  transactions: Transaction[];
  user?: User;
  metrics?: Metric;

  depositModalOpen: boolean;
  withdrawModalOpen: boolean;
  createDealModalOpen: boolean;

  selectedDeal?: FullDealWithUser;
  dealToEdit?: FullDeal;
};

export type AppActions = {
  initializeStore(state: StoreInitialState): void;
  toggleSideNav(state?: boolean): void;
  setUser(user?: User): void;
  setTransactions(transactions: Transaction[]): void;
  setMetrics(metrics?: Metric): void;

  toggleDepositModal(state?: boolean): void;
  toggleWithdrawModal(state?: boolean): void;
  toggleCreateDealModal(state?: boolean): void;
  toggleEditDealModal(deal?: FullDeal): void;

  setSelectedDeal(deal?: FullDealWithUser): void;
};

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>((set, get) => ({
  initialized: false,
  initializeStore(state) {
    set({ ...state, initialized: true });
  },

  depositModalOpen: false,
  toggleDepositModal(state) {
    if (state !== undefined) {
      set({ depositModalOpen: state });
    } else {
      const { depositModalOpen } = get();
      set({ depositModalOpen: !depositModalOpen });
    }
  },

  withdrawModalOpen: false,
  toggleWithdrawModal(state) {
    if (state !== undefined) {
      set({ withdrawModalOpen: state });
    } else {
      const { withdrawModalOpen } = get();
      set({ withdrawModalOpen: !withdrawModalOpen });
    }
  },

  createDealModalOpen: false,
  toggleCreateDealModal(state) {
    if (state !== undefined) {
      set({ createDealModalOpen: state });
    } else {
      const { createDealModalOpen } = get();
      set({ createDealModalOpen: !createDealModalOpen });
    }
  },
  toggleEditDealModal(deal) {
    if (deal === undefined) {
      set({ createDealModalOpen: false, dealToEdit: undefined });
    } else {
      set({ createDealModalOpen: true, dealToEdit: deal });
    }
  },

  selectedDeal: undefined,
  setSelectedDeal(deal) {
    set({ selectedDeal: deal });
  },

  sideNavOpen: false,
  toggleSideNav(state) {
    if (state !== undefined) {
      set({ sideNavOpen: state });
    } else {
      const { sideNavOpen } = get();
      set({ sideNavOpen: !sideNavOpen });
    }
  },

  user: undefined,
  setUser(user) {
    set({ user });
  },

  metrics: undefined,
  setMetrics(metrics) {
    set({ metrics });
  },

  transactions: [],
  setTransactions(transactions) {
    set({ transactions });
  },
}));
