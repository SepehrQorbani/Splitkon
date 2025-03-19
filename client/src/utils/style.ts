import { cn } from "@/utils/cn";

export const defaultInputClass = cn(
    /* Base */
    "flex h-10 w-full rounded border border-border-input bg-input px-3 py-2 text-sm shadow-input",
    /* Reset */
    "outline-none",
    /* Disabled */
    "disabled:cursor-not-allowed disabled:opacity-50",
    /* Placeholder */
    "placeholder:font-light placeholder:opacity-50 placeholder:text-muted",
    /* Focus */
    "focus-visible:ring-3 focus-visible:ring-action/25 focus-visible:border-action",
    "focus-within:ring-3 focus-within:ring-action/25 focus-within:border-action",
    /* Invalid */
    "data-[invalid=true]:border-error data-[invalid=true]:ring-error/30",
    /* Animation */
    "transition-all duration-300"
);
