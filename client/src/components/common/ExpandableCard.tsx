import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";

type ExpandableCardProps = {
    id: string | number;
    children: (props: { isOpen: boolean }) => ReactNode;
    className?: string;
    maxWidth?: string;
};

function ExpandableCard({
    id,
    children,
    className,
    maxWidth = "w-full",
}: ExpandableCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.div
                onClick={() => setIsOpen(true)}
                layoutId={`card-${id}`}
                className={cn(
                    "w-full h-full p-0 outline-none rounded",
                    maxWidth,
                    className
                )}
            >
                {children({ isOpen: false })}
            </motion.div>
            <ModalOverlay
                className="fixed inset-0 h-full px-4 pt-32 pb-16 md:pb-4 z-10 overflow-y-auto flex min-h-full w-full items-center justify-center bg-background/50 backdrop-blur-xs data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting"
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            >
                <Modal
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-full max-h-full h-full overflow-hidden flex items-center justify-center"
                >
                    <Dialog
                        className="outline-hidden relative w-full h-full max-w-md"
                        aria-label="Expandable Card"
                    >
                        <>
                            <div
                                className="fixed inset-0 bg-transparent"
                                onClick={() => setIsOpen(false)}
                            />
                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        layoutId={`card-${id}`}
                                        className="p-4 h-full flex items-center justify-center"
                                    >
                                        {children({ isOpen: true })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </>
    );
}

export default ExpandableCard;
