import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";

// Define image array for better maintainability
const IMAGES = ["01", "02", "03", "04"];

// Configuration for animation and slideshow
const SLIDESHOW_CONFIG = {
    interval: 8000,
    fadeDuration: 300,
    transition: { duration: 0.3, ease: "easeInOut" },
} as const;

// Type definitions
interface ImageSlideshowProps {
    className?: string;
    initialImageIndex?: number;
}

const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
    className,
    initialImageIndex = 0,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

    // Memoized function to get next image index
    const getNextIndex = useCallback(() => {
        return (currentIndex + 1) % IMAGES.length;
    }, [currentIndex]);

    // Handle image transition
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex(getNextIndex());
        }, SLIDESHOW_CONFIG.interval);

        return () => clearInterval(intervalId);
    }, [getNextIndex]);

    return (
        <div
            className={cn(
                "absolute -z-10 w-full h-full -top-1/3 overflow-hidden opacity-50",
                className
            )}
        >
            {/* Image Layer with Animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={IMAGES[currentIndex]}
                    className="w-full h-full bg-cover bg-no-repeat bg-top mix-blend-multiply dark:mix-blend-color-dodge"
                    style={{
                        backgroundImage: `url('/images/${IMAGES[currentIndex]}.jpg')`,
                    }}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={SLIDESHOW_CONFIG.transition}
                    aria-label={`Background image ${IMAGES[currentIndex]}`}
                />
            </AnimatePresence>

            {/* Gradient Overlays */}
            <div
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-t from-transparent via-background/50 to-background"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-background"
                aria-hidden="true"
            />
            <div
                className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-l from-transparent via-background/50 to-background"
                aria-hidden="true"
            />
            <div
                className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-r from-transparent via-background/50 to-background"
                aria-hidden="true"
            />
        </div>
    );
};

export default ImageSlideshow;
