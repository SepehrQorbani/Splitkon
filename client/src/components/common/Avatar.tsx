import { cn } from "@/utils/cn";
import React, { CSSProperties } from "react";

type Props = {
    src?: string | null;
    alt: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    style?: CSSProperties;
};

function Avatar({ src, alt, className, size = "md", style }: Props) {
    const sizeClass = {
        xs: "w-4 h-4",
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };
    return (
        <div
            className={cn(
                sizeClass[size],
                "rounded overflow-hidden bg-muted",
                className
            )}
            style={style}
        >
            {src && (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
}

export default Avatar;
