import { Expense } from "@/types/schemas/expenses";
import { create } from "zustand";

export interface ModalDefinitions {
    expense: Expense;
    memberForm: { id: string };
    repay: { amount: number; to: string };
    confirm: { message: string };
    success: { title: string };
}

export type ModalData<K extends string> = K extends keyof ModalDefinitions
    ? ModalDefinitions[K]
    : Record<string, any> | null;

export type ModalState = {
    [key: string]: true | string | number | Record<string, any> | null;
};

export type ModalSelector<K extends string> = K extends keyof ModalDefinitions
    ? ModalDefinitions[K] | boolean | undefined
    : ModalData<string> | boolean | undefined;

interface ModalStore {
    modals: ModalState;
    isLoading: { [key: string]: boolean };
    openModal: <K extends string>(
        key: K,
        data?: string | number | true | Record<string, any> | null
    ) => void;
    closeModal: (key: string) => void;
    closeAllModals: () => void;
    setIsLoading: <K extends string>(key: K, v: boolean) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
    modals: {},
    openModal: (key, data = true) => {
        set((state) => ({
            modals: {
                ...state.modals,
                [key]: data === undefined ? true : data,
            },
        }));
    },

    closeModal: (key) => {
        set((state) => {
            const newModals = { ...state.modals };
            delete newModals[key];
            return { modals: newModals };
        });
    },

    closeAllModals: () => {
        set({ modals: {} });
    },
    isLoading: {},
    setIsLoading: (key, v) => {
        set((state) => ({
            isLoading: {
                ...state.isLoading,
                [key]: v,
            },
        }));
    },
}));
