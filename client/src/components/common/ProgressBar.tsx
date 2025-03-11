import React from "react";
import { useUIStore } from "@/store";
import { AnimatePresence, motion } from "motion/react";

const ProgressBar: React.FC = () => {
    const { isLoading } = useUIStore();

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed top-0 left-0 w-full h-0.5 bg-transparent z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                >
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProgressBar;
