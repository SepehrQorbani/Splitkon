import { Balance } from "@/types/schemas/balance";
import { create } from "zustand";

interface BalanceStore {
    balance: Balance | null;
    setBalance: (balance: Balance) => void;
    clearBalance: () => void;
}

export const useBalanceStore = create<BalanceStore>((set) => ({
    balance: null,
    setBalance: (balance: Balance) => set({ balance }),
    clearBalance: () => set({ balance: null }),
}));
