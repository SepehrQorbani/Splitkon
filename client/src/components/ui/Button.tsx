import React from "react";
import {
    Button as AriaButton,
    ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cn } from "@/utils/cn"; // Import cn

interface ButtonProps extends AriaButtonProps {
    variant?: "solid" | "outline" | "ghost";
    intent?: "primary" | "brand" | "danger" | "neutral";
    className?: string;
    size?: "sm" | "md" | "lg";
    type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
    variant = "solid",
    intent = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}) => {
    const baseStyles =
        "inline-flex items-center justify-center px-4 py-2 rounded-input font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

    const variantStyles = {
        solid: {
            primary:
                "bg-action text-action-fg hover:bg-action-strong focus:ring-action disabled:bg-action-light",
            danger: "bg-error text-error-fg hover:bg-error-strong focus:ring-error disabled:bg-error-light",
        },
        outline: {
            primary:
                "border border-action text-action hover:bg-action hover:text-action-fg focus:ring-action disabled:border-action-light disabled:text-action-light",
            danger: "border border-error text-error hover:bg-error hover:text-error-fg focus:ring-error disabled:border-error-light disabled:text-error-light",
        },
        ghost: {
            primary:
                "text-action hover:bg-action-light hover:text-action-dark focus:ring-action disabled:text-action-light",
            danger: "text-error hover:bg-error-light hover:text-error-dark focus:ring-error disabled:text-error-light",
        },
    };
    const sizeStyles = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <AriaButton
            type={type}
            {...props}
            className={cn(
                baseStyles,
                variantStyles[variant][
                    intent as keyof (typeof variantStyles)[typeof variant]
                ],
                sizeStyles[size],
                className
            )}
        />
    );
};
