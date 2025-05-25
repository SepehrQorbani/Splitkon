import { motion, Transition } from "motion/react";

interface AnimatedLineProps {
    path?: string;
    direction?: "horizontal" | "vertical";
    width?: number;
    height?: number;
    className?: string;
    animationDir?: "toEnd" | "toStart";
    transition?: Transition;
}

const DEFAULT_TRANSITION = {
    duration: 2,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop" as const,
    repeatDelay: 8,
};

export const AnimatedLine = ({
    direction = "horizontal",
    path,
    width = 48,
    height = 2,
    className,
    animationDir = "toEnd",
    transition,
}: AnimatedLineProps) => {
    const d = path
        ? path
        : direction === "horizontal"
        ? `M0 1H${width}`
        : `M1 0V${height}`;
    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={2}
            className={className}
        >
            <g>
                <path
                    d={d}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    className={className}
                />

                <motion.path
                    d={d}
                    stroke="var(--color-brand)"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    animate={
                        animationDir === "toEnd"
                            ? {
                                  pathLength: [0, 0.1, 0.3],
                                  pathOffset: [0, 0, 1],
                              }
                            : {
                                  pathLength: [0, 0.1, 0.2, 0],
                                  pathOffset: [1, 1, 0, 0],
                              }
                    }
                    transition={{ ...DEFAULT_TRANSITION, ...transition }}
                    className={className}
                />
            </g>
        </svg>
    );
};
