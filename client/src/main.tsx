import "@/assets/styles/app.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DISABLED_ERROR_CODES = [401, 402, 403, 404] as const;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            // gcTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 1000, // 10 minutes
            retry: (failureCount, error: any) => {
                const status = error?.status;
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
                const error = query.state.error as { status?: number };
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

const container = document.getElementById("app") as HTMLElement | null;
if (container) {
    const root = createRoot(container);
    root.render(
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
} else {
    console.error("Container #app not found");
}
