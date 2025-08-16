import { cn } from "@/utils/cn";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useSearchParams } from "react-router";

type ExpandableCardProps = {
    id: string | number;
    children: (props: { isOpen: boolean }) => ReactNode;
    className?: string;
    maxWidth?: string;
    isOpen?: boolean;
    onOpenChange?: (v: boolean) => void;
    useSearchParam?: boolean;
};

function ExpandableCard({
    id,
    children,
    className,
    maxWidth = "w-full",
    isOpen: controlledIsOpen,
    onOpenChange,
    useSearchParam = true,
}: ExpandableCardProps) {
    const [uncontrolled, setUncontrolled] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : uncontrolled;

    const setIsOpen = (v: boolean) => {
        if (isControlled) {
            onOpenChange?.(v);
        } else {
            setUncontrolled(v);
        }

        if (useSearchParam) {
            setSearchParams(
                (prevParams) => {
                    const newParams = new URLSearchParams(
                        prevParams.toString()
                    );

                    if (v) {
                        newParams.set("view", `${id}`);
                    } else {
                        newParams.delete("view");
                    }

                    return newParams;
                },
                { replace: false }
            );
        }
    };

    useEffect(() => {
        if (!useSearchParam) return;

        const param = searchParams.get("view");
        if (param === `${id}`) {
            setUncontrolled(true);
        } else {
            setUncontrolled(false);
        }
    }, [searchParams, id, useSearchParam]);

    const cardVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };
    const transition = {
        duration: 0.3,
        ease: "easeInOut" as const,
    };

    const [ref, { height }] = useMeasure();
    return (
        <>
            <motion.div
                ref={ref}
                layout
                layoutId={`card-${id}`}
                className={cn(
                    "w-full h-full p-0 outline-none rounded cursor-pointer",
                    maxWidth,
                    className
                )}
                initial={{ opacity: 1 }}
                animate={{
                    opacity: isOpen ? 0 : 1,
                }}
                onClick={() => setIsOpen(true)}
                transition={transition}
                style={{
                    height: !isOpen ? "100%" : height ?? "100%",
                }}
            >
                <AnimatePresence>
                    {!isOpen && children({ isOpen: false })}
                </AnimatePresence>
            </motion.div>

            <ModalOverlay
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                isDismissable
                className="fixed inset-0 pt-16 md:pt-32 pb-16 md:pb-4 z-10 flex w-full items-center justify-center bg-background/50 backdrop-blur-xs 
                data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting"
            >
                <Modal className="w-full max-w-md h-fit max-h-full relative flex flex-col">
                    <Dialog
                        className="outline-hidden relative w-full max-w-md h-full overflow-hidden flex"
                        aria-label="ExpandableCard"
                    >
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    layout
                                    layoutId={`card-${id}`}
                                    variants={cardVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{
                                        default: transition,
                                        layout: transition,
                                    }}
                                    className="p-4 relative z-[60] pointer-events-auto max-h-full w-full flex-1 overflow-auto"
                                >
                                    {children({ isOpen: true })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </>
    );
}

export default ExpandableCard;
