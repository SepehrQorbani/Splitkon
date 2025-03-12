// client/src/components/common/LoadingIndicator.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { useIsFetching } from "@tanstack/react-query";

const LoadingIndicator: React.FC = () => {
    const isFetching = useIsFetching() > 0;

    console.log("LoadingIndicator render", { isFetching });

    //     const queryClient = useQueryClient();
    //     const [isFetching, setIsFetching] = useState(queryClient.isFetching() > 0);

    //     useEffect(() => {
    //         const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    //             const fetching = queryClient.isFetching() > 0;
    //             if (event.type === "updated" || event.type === "observerAdded") {
    //                 console.log("Query cache update", {
    //                     fetching,
    //                     eventType: event?.type,
    //                 });
    //                 setIsFetching(fetching);
    //             }
    //         });
    //         setIsFetching(queryClient.isFetching() > 0); // Catch initial fetch
    //         return () => unsubscribe();
    //     }, [queryClient]);
    // console.log("LoadingIndicator render", { isFetching });

    return (
        <AnimatePresence>
            {isFetching && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 bg-black/25 backdrop-blur-[2px]"
                    />
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="w-6 h-6 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
                    />
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoadingIndicator;
