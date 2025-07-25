import { AnimatePresence, motion } from "motion/react";
import {
    Dialog,
    Heading,
    Modal,
    ModalOverlay,
    ModalOverlayProps,
    Pressable,
} from "react-aria-components";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

type DrawerProps = {
    triggerLabel?: ReactNode;
    title: ReactNode;
    children: (props: { close: () => void }) => ReactNode;
    className?: string;
    modalProps?: Omit<ModalOverlayProps, "isOpen" | "onOpenChange">;
    isDisabled?: boolean;
    buttonProps?: {
        intent?: "primary" | "brand" | "danger" | "neutral";
        variant?: "solid" | "outline" | "ghost" | "input";
        className?: string;
    };
    open?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
};

export const Drawer = ({
    triggerLabel,
    title,
    children,
    className,
    modalProps,
    isDisabled = false,
    buttonProps = {
        intent: "primary",
        variant: "solid",
        className: "w-full h-10 gap-2",
    },
    open = false,
    onOpenChange,
}: DrawerProps) => {
    const [isOpen, setIsOpen] = useState(open);
    useEffect(() => {
        onOpenChange && onOpenChange(isOpen);
    }, [isOpen]);
    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const close = () => setIsOpen(false);

    return (
        <>
            {triggerLabel && (
                <Button
                    intent={buttonProps.intent}
                    variant={buttonProps.variant}
                    className={cn(buttonProps.className, isOpen && "group")}
                    onPress={() => setIsOpen(true)}
                    data-is-open={isOpen}
                    isDisabled={isDisabled}
                >
                    {triggerLabel}
                </Button>
            )}
            <ModalOverlay
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                className="fixed inset-0 h-full px-4 pt-32 pb-16 md:pb-4 z-10 flex min-h-full w-full items-center justify-center bg-background/50 backdrop-blur-[2px] data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting"
                {...modalProps}
                isDismissable
            >
                <Modal className="fixed z-50 bottom-0 left-0 right-0 h-full pt-40 pb-14 md:pb-0">
                    <Dialog className="w-full h-full flex justify-center items-end outline-none">
                        <AnimatePresence>
                            {isOpen && (
                                <>
                                    <Pressable
                                        onPress={() => {
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div
                                            className="fixed inset-0"
                                            style={{
                                                scrollbarGutter: "stable",
                                            }}
                                            role="button"
                                        />
                                    </Pressable>
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut",
                                        }}
                                        className={cn(
                                            "w-full relative max-w-md mx-auto max-h-min h-full overflow-y-auto px-2- pb-2 bg-surface border border-border shadow rounded-t",
                                            className
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <Heading
                                            slot="title"
                                            className="sticky top-0 z-10 bg-surface p-2"
                                        >
                                            {title}
                                        </Heading>
                                        <div className="p-2">
                                            {children({ close })}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </>
    );
};
