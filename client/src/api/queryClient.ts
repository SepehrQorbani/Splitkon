import { QueryClient } from "@tanstack/react-query";

const DISABLED_ERROR_CODES = [401, 402, 403, 404] as const;

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            // gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error: any) => {
                const status = error?.cause?.status;
                if (
                    status &&
                    DISABLED_ERROR_CODES.includes(
                        status as (typeof DISABLED_ERROR_CODES)[number]
                    )
                ) {
                    return false;
                }
                return failureCount < 1;
            },
            refetchOnWindowFocus: (query) => {
                const error = query.state.error?.cause as {
                    data: [];
                    status?: number;
                };
                const status = error?.status;

                return !(
                    status &&
                    DISABLED_ERROR_CODES.includes(
                        status as (typeof DISABLED_ERROR_CODES)[number]
                    )
                );
            },
        },
    },
});
