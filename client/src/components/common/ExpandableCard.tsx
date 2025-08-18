import { useModalState } from "@/hooks/useModalState";
import { cn } from "@/utils/cn";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";

type ExpandableCardProps = {
    id: string | number;
    children: (props: {
        isOpen: boolean;
        setIsOpen: (v: boolean) => void;
    }) => ReactNode;
    className?: string;
    maxWidth?: string;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    syncWithUrl?: boolean;
    urlParamName?: string;
};

function ExpandableCard({
    id,
    children,
    className,
    maxWidth = "w-full",
    isOpen,
    onOpenChange,
    syncWithUrl = true,
    urlParamName = "view",
}: ExpandableCardProps) {
    const modal = useModalState({
        id,
        isOpen,
        onOpenChange,
        syncWithUrl,
        urlParamName,
    });

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
                    opacity: modal.isOpen ? 0 : 1,
                }}
                onClick={modal.open}
                transition={transition}
                style={{
                    height: !modal.isOpen ? "100%" : height ?? "100%",
                }}
            >
                <AnimatePresence>
                    {!modal.isOpen &&
                        children({ isOpen: false, setIsOpen: modal.setIsOpen })}
                </AnimatePresence>
            </motion.div>

            <ModalOverlay
                isOpen={modal.isOpen}
                onOpenChange={modal.setIsOpen}
                isDismissable
                className="fixed inset-0 py-16 md:pt-32 md:pb-4 z-10 flex w-full items-center justify-center bg-background/50 backdrop-blur-xs 
                data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting"
            >
                <Modal className="w-full max-w-md h-fit max-h-full relative flex flex-col overflow-hidden">
                    <Dialog
                        className="outline-hidden relative w-full max-w-md h-full overflow-hidden flex"
                        aria-label="ExpandableCard"
                    >
                        <AnimatePresence>
                            {modal.isOpen && (
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
                                    className="p-4 relative z-[60] pointer-events-auto max-h-full w-full flex-1 overflow-hidden"
                                >
                                    {children({
                                        isOpen: true,
                                        setIsOpen: modal.setIsOpen,
                                    })}
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
