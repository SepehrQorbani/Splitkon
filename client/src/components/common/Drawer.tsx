import { useModalState } from "@/hooks/useModalState";
import { cn } from "@/utils/cn";
import {
    AnimatePresence,
    motion,
    PanInfo,
    useDragControls,
} from "motion/react";
import { ReactNode, useRef } from "react";
import {
    Dialog,
    Heading,
    Modal,
    ModalOverlay,
    ModalOverlayProps,
    Pressable,
} from "react-aria-components";
import { Button } from "./Button";

type DrawerProps = {
    id?: string | number;
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
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    syncWithUrl?: boolean;
    onClose?: () => void;
    urlParamName?: string;
};

export const Drawer = ({
    id,
    isOpen,
    onClose,
    onOpenChange,
    modalProps,
    triggerLabel,
    title,
    children,
    className,
    isDisabled = false,
    buttonProps = {
        intent: "primary",
        variant: "solid",
        className: "w-full h-10 gap-2",
    },
    syncWithUrl = true,
    urlParamName = "modal",
}: DrawerProps) => {
    const modal = useModalState({
        id,
        isOpen,
        onOpenChange,
        onClose,
        syncWithUrl,
        urlParamName,
    });

    const dragControls = useDragControls();
    const contentRef = useRef(null);

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const velocity = info.velocity.y;
        const offset = info.offset.y;

        if (velocity > 300) {
            modal.close();
        } else if (velocity < -300) {
            // swipe up for Expand
        } else {
            if (offset > 150) {
                modal.close();
            }
        }
    };

    return (
        <>
            {triggerLabel && (
                <Button
                    intent={buttonProps.intent}
                    variant={buttonProps.variant}
                    className={cn(buttonProps.className, isOpen && "group")}
                    onPress={modal.open}
                    data-is-open={isOpen}
                    isDisabled={isDisabled}
                >
                    {triggerLabel}
                </Button>
            )}
            <ModalOverlay
                isOpen={modal.isOpen}
                onOpenChange={modal.setIsOpen}
                className="fixed inset-0  z-10 flex w-full justify-center bg-background/50 backdrop-blur-xs select-none
                 data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting"
                {...modalProps}
                isDismissable
            >
                <Modal className="absolute top-18 bottom-14 md:top-32 md:bottom-0 w-full md:max-w-md flex flex-col overflow-hidden">
                    <Dialog
                        className="absolute bottom-0 outline-hidden w-full h-full overflow-hidden flex flex-col md:px-2 md:pt-2 justify-end"
                        aria-label="modal"
                    >
                        <Pressable onPress={modal.close}>
                            <div
                                className="fixed inset-0"
                                style={{
                                    scrollbarGutter: "stable",
                                }}
                                role="button"
                            />
                        </Pressable>
                        <AnimatePresence>
                            {modal.isOpen && (
                                <>
                                    <motion.div
                                        initial={{ y: "100%" }}
                                        animate={{ y: 0 }}
                                        exit={{ y: "100%" }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut",
                                        }}
                                        className={cn(
                                            "relative max-h-full h-fit w-full overflow-auto pb-2 bg-surface border border-border shadow-center rounded-t",
                                            className
                                        )}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        drag="y"
                                        dragControls={dragControls}
                                        dragListener={false}
                                        dragDirectionLock
                                        dragElastic={{ top: 0.01, bottom: 0.5 }}
                                        dragConstraints={{ top: 0, bottom: 0 }}
                                        onDragEnd={handleDragEnd}
                                        ref={contentRef}
                                    >
                                        <Heading
                                            slot="title"
                                            className="sticky top-0 z-10 bg-surface p-2"
                                            onPointerDown={(e) =>
                                                dragControls.start(e)
                                            }
                                            style={{ touchAction: "none" }}
                                        >
                                            <div className="w-12 h-1 bg-muted-subtle rounded-full mx-auto mb-1 -mt-1 cursor-grab active:cursor-grabbing" />
                                            {title}
                                        </Heading>
                                        <div className="p-2">
                                            {children({ close: modal.close })}
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
