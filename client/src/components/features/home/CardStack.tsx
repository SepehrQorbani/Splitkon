import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Card = {
    id: number;
    content: React.ReactNode;
};

export const CardStack = ({
    items,
    offset = 8,
    scaleFactor = 0.12,
    duration = 4000,
    direction = "bottom",
    className,
}: {
    items: Card[];
    offset?: number;
    scaleFactor?: number;
    duration?: number;
    className?: string;
    direction?: "top" | "bottom";
}) => {
    const { direction: langDir } = useTranslations();
    const [cards, setCards] = useState<Card[]>(items);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCards((prev) => {
                    const updated = [...prev];
                    const last = updated.pop();
                    if (last) updated.unshift(last);
                    return updated;
                });
                setIsAnimating(false);
            }, 300); // duration of "down" animation
        }, duration);

        return () => clearInterval(interval);
    }, [duration]);

    return (
        <div
            className={cn(
                "relative w-[176px] h-[168px]",
                direction === "bottom" ? "mb-4" : "mt-4",
                className
            )}
            dir={langDir}
        >
            {cards.map((card, index) => {
                const isTopCard = index === 0;
                return (
                    <motion.div
                        key={card.id}
                        className="absolute w-full h-full bg-surface/50 p-1 border-2 border-surface rounded-xl shadow-center flex items-center justify-center"
                        style={{
                            transformOrigin: `${direction} center`,
                        }}
                        animate={{
                            top:
                                (direction === "bottom" ? 1 : -1) *
                                (isTopCard && isAnimating
                                    ? -offset * 2
                                    : index * offset),
                            rotate:
                                isTopCard && isAnimating
                                    ? [-6, -2, 2, 6][
                                          Math.floor(Math.random() * 4)
                                      ]
                                    : 0,
                            scale: 1 - index * scaleFactor,
                            zIndex: cards.length - index,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                    >
                        {card.content}
                    </motion.div>
                );
            })}
        </div>
    );
};
