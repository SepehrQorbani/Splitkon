export type BalanceTransaction = {
    // from?: number;
    to: number;
    amount: number;
};

export type Balance = {
    [memberId: number]: BalanceTransaction[];
};
