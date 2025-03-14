import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={cn(
                "bg-gray-200 dark:bg-gray-700 animate-pulse rounded",
                className
            )}
        />
    );
};
