import React from "react";
import { cn } from "@/utils/cn"; // Import cn

interface LoadingIndicatorProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    size = "md",
    className,
}) => {
    const sizeStyles = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-3",
        lg: "w-8 h-8 border-4",
    };

    return (
        <div
            className={cn(
                "inline-block animate-spin rounded-full border-t-action border-r-action border-b-border border-l-border",
                sizeStyles[size],
                className
            )}
            role="status"
            aria-label="Loading"
        />
    );
};
