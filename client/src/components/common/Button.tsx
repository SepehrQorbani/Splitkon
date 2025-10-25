//TODO: change and refine styles
import React from "react";
import {
    Button as AriaButton,
    ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cn } from "@/utils/cn";
import { defaultInputClass } from "@/utils/style";

type ButtonVariant = "solid" | "outline" | "ghost" | "input";
type ButtonIntent = "primary" | "brand" | "danger" | "neutral";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends AriaButtonProps {
    variant?: ButtonVariant;
    intent?: ButtonIntent;
    className?: string;
    size?: ButtonSize;
    type?: "button" | "submit" | "reset";
}

interface GetButtonStylesProps {
    variant?: ButtonVariant;
    intent?: ButtonIntent;
    size?: ButtonSize;
    className?: string;
}

export function getButtonStyles({
    variant = "solid",
    intent = "primary",
    size = "md",
    className,
}: GetButtonStylesProps) {
    const baseStyles =
        "inline-flex items-center justify-center px-4 py-2 rounded-input font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-surface/100 disabled:opacity-75 cursor-pointer disabled:cursor-not-allowed";

    const variantStyles: Record<
        ButtonVariant,
        Partial<Record<ButtonIntent, string>>
    > = {
        solid: {
            primary:
                "bg-action text-action-fg hover:bg-action-strong focus:ring-action disabled:bg-action-soft",
            danger: "bg-error text-error-fg hover:bg-error-strong focus:ring-error disabled:bg-error-subtle",
            neutral:
                "bg-surface text-surface-fg hover:bg-surface-strong focus:ring-action disabled:text-surface-subtle border border-border shadow-sm disabled:text-muted",
        },
        outline: {
            primary:
                "border border-action text-action hover:bg-action hover:text-action-fg focus:ring-action disabled:border-action-subtle disabled:text-action-subtle",
            danger: "border border-error text-error hover:bg-error hover:text-error-fg focus:ring-error disabled:border-error-subtle disabled:text-error-subtle disabled:bg-transparent",
        },
        ghost: {
            primary:
                "text-action hover:bg-action-subtle hover:text-action-strong focus:ring-action focus:ring-inset focus:ring-offset-0",
            danger: "text-error hover:bg-error-subtle hover:text-error-strong focus:ring-error disabled:text-error-subtle disabled:bg-transparent",
            neutral:
                "text-surface-fg hover:bg-surface-subtle hover:text-surface-fg focus:ring-error disabled:text-error-subtle disabled:bg-transparent",
        },
        input: {
            primary: defaultInputClass + " focus:ring-3 focus:ring-offset-0",
        },
    };

    const sizeStyles: Record<ButtonSize, string> = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "p-2",
    };

    return cn(
        baseStyles,
        variantStyles[variant][intent] || "",
        sizeStyles[size],
        className
    );
}

export const Button: React.FC<ButtonProps> = ({
    variant = "solid",
    intent = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}) => {
    return (
        <AriaButton
            type={type}
            {...props}
            className={getButtonStyles({ variant, intent, size, className })}
        />
    );
};
