import { cn } from "@/utils/cn";
import { CSSProperties } from "react";

type Props = {
    src?: string | null;
    fallback?: string | false;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
    style?: CSSProperties;
    alt?: string;
};
function getFallbackLetters(text: string): string {
    const words = text.trim().split(" ");
    if (words.length < 1 || !words[0]) return "";
    if (words.length === 1) {
        return words[0].length === 1
            ? words[0].toUpperCase()
            : words[0].charAt(0).toUpperCase() + words[0].charAt(1);
    }
    return (
        words[0].charAt(0).toUpperCase() +
        "." +
        words[1].charAt(0).toUpperCase()
    );
}
function Avatar({
    src,
    fallback,
    alt = "user avatar",
    className,
    size = "md",
    style,
}: Props) {
    const sizeClass = {
        xs: "size-4 text-[6px]",
        sm: "size-6 text-[8px]",
        md: "size-8 text-[10px]",
        lg: "size-10 text-[12px]",
    };
    const letters =
        fallback === false
            ? false
            : fallback && fallback !== ""
            ? getFallbackLetters(fallback)
            : !src && alt !== "user avatar"
            ? getFallbackLetters(alt)
            : false;

    return (
        <div
            className={cn(
                sizeClass[size],
                "rounded overflow-hidden bg-action-subtle shrink-0",
                className
            )}
            style={style}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : letters ? (
                <span
                    aria-label={alt}
                    className="w-full h-full flex items-center justify-center text-action-fg bg-action"
                >
                    {letters}
                </span>
            ) : null}
        </div>
    );
}

export default Avatar;
