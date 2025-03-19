import React from "react";
import { cn } from "@/utils/cn"; // Assuming you have this utility for className merging
import { Button } from "./Button"; // Import your Button component

interface CardProps {
    title?: string;
    subtitle?: string;
    description?: string;
    imageSrc?: string; // For cards with images
    imagePosition?: "top" | "side" | "bottom"; // Image placement
    ribbon?: string; // For cards with a ribbon (e.g., "new")
    ribbonIntent?: "primary" | "danger" | "neutral"; // Ribbon color
    progress?: number; // For cards with a progress bar (0-100)
    footer?: React.ReactNode; // For cards with a footer
    variant?: "default" | "active" | "stacked"; // Card styles
    intent?: "primary" | "neutral" | "danger"; // Card intent for borders or highlights
    className?: string;
    children?: React.ReactNode; // For custom content
}

const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={cn(
                "relative bg-surface border border-border rounded-sm shadow-xs p-4 transition-all duration-200",
                className
            )}
        >
            {children}
        </div>
    );
};

const CardTitle = ({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "text-xl font-semibold leading-none tracking-tight mb-4",
            className
        )}
        {...props}
    >
        {children}
    </div>
);
CardTitle.displayName = "CardTitle";

const CardFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex items-center", className)} {...props} />
);
CardFooter.displayName = "CardFooter";

export { Card, CardTitle, CardFooter };
