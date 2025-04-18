//TODO: change and refine styles
import React from "react";
import {
    Button as AriaButton,
    ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";

interface ButtonProps extends AriaButtonProps {
    variant?: "solid" | "outline" | "ghost" | "input";
    intent?: "primary" | "brand" | "danger" | "neutral";
    className?: string;
    size?: "sm" | "md" | "lg" | "icon";
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
        "inline-flex items-center justify-center px-4 py-2 rounded-input font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface/100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed";

    const variantStyles = {
        solid: {
            primary:
                "bg-action text-action-fg hover:bg-action-strong focus:ring-action disabled:bg-action-subtle",
            danger: "bg-error text-error-fg hover:bg-error-strong focus:ring-error disabled:bg-error-subtle",
            neutral:
                "bg-surface text-surface-fg hover:bg-surface-strong focus:ring-action disabled:text-surface-subtle border border-border shadow-sm",
        },
        outline: {
            primary:
                "border border-action text-action hover:bg-action hover:text-action-fg focus:ring-action disabled:border-action-subtle disabled:text-action-subtle",
            danger: "border border-error text-error hover:bg-error hover:text-error-fg focus:ring-error disabled:border-error-subtle disabled:text-error-subtle",
        },
        ghost: {
            primary:
                "text-action hover:bg-action-subtle hover:text-action-strong focus:ring-action disabled:text-action-subtle",
            danger: "text-error hover:bg-error-subtle hover:text-error-strong focus:ring-error disabled:text-error-subtle",
        },
        input: {
            primary: defaultInputClass + "focus:ring-3 focus:ring-offset-0",
        },
    };
    const sizeStyles = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "p-2",
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
