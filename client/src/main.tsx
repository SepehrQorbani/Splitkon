import "@/assets/styles/app.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            // gcTime: 10 * 60 * 1000, // 10 minutes
            gcTime: 1000, // 10 minutes
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
