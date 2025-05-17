export const queryKeys = {
    expenses: (token: string) => ["expenses", token] as const,
    members: (token: string) => ["members", token] as const,
    summary: (token: string) => ["summary", token] as const,
    dailyExpenses: (token: string) => ["dailyExpenses", token] as const,
    group: (token: string) => ["group", token] as const,
    repays: (token: string) => ["repays", token] as const,
    balance: (token: string) => ["balance", token] as const,
};
