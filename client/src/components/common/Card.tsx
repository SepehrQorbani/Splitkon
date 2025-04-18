import React from "react";
import { cn } from "@/utils/cn";

interface CardProps {
    className?: string;
    children?: React.ReactNode;
}

function Card({ className, children }: CardProps) {
    return (
        <div
            className={cn(
                "relative bg-surface border border-border rounded-sm shadow-xs p-4 transition-all duration-200 flex flex-col gap-4",
                className
            )}
        >
            {children}
        </div>
    );
}

function CardTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "text-xl font-semibold leading-none tracking-tight",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

CardTitle.displayName = "CardTitle";

function CardFooter({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
}
CardFooter.displayName = "CardFooter";

export { Card, CardTitle, CardFooter };
