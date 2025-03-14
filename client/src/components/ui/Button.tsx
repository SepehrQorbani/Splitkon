import React from "react";
import {
    Button as AriaButton,
    ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cn } from "@/utils/cn"; // Import cn

interface ButtonProps extends AriaButtonProps {
    variant?: "solid" | "outline" | "ghost";
    intent?: "primary" | "brand" | "danger";
    className?: string;
    size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
    variant = "solid",
    intent = "primary",
    size = "md",
    className,
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

    const variantStyles = {
        solid: {
            primary:
                "bg-action text-action-foreground hover:bg-action-strong focus:ring-action disabled:bg-action-subtle",
            brand: "bg-brand text-brand-foreground hover:bg-brand-strong focus:ring-brand disabled:bg-brand-subtle",
            danger: "bg-error text-error-foreground hover:bg-error-strong focus:ring-error disabled:bg-error-subtle",
        },
        outline: {
            primary:
                "border border-action text-action hover:bg-action-subtle focus:ring-action disabled:border-action-subtle disabled:text-action-subtle",
            brand: "border border-brand text-brand hover:bg-brand-subtle focus:ring-brand disabled:border-brand-subtle disabled:text-brand-subtle",
            danger: "border border-error text-error hover:bg-error-subtle focus:ring-error disabled:border-error-subtle disabled:text-error-subtle",
        },
        ghost: {
            primary:
                "text-action hover:bg-action-subtle focus:ring-action disabled:text-action-subtle",
            brand: "text-brand hover:bg-brand-subtle focus:ring-brand disabled:text-brand-subtle",
            danger: "text-error hover:bg-error-subtle focus:ring-error disabled:text-error-subtle",
        },
    };
    const sizeStyles = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <AriaButton
            {...props}
            className={cn(
                baseStyles,
                variantStyles[variant][intent],
                sizeStyles[size],
                className
            )}
        />
    );
};
