import React from "react";
import { cn } from "@/utils/cn";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => {
    return (
        <div
            className={cn("bg-muted/30 animate-pulse rounded", className)}
            {...props}
        />
    );
};
