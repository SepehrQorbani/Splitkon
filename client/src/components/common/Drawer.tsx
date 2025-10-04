// Modal.tsx
import { useModalStore } from "@/store/modals";
import { cn } from "@/utils/cn";
import {
    AnimatePresence,
    motion,
    PanInfo,
    useDragControls,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Dialog, Modal, ModalOverlay, Pressable } from "react-aria-components";
import { LoadingIndicator } from "./LoadingIndicator";

interface DrawerProps {
    modalKey: string;
    children: (props: {
        data: true | string | number | Record<string, any> | null;
        close: () => void;
    }) => {
        title?: React.ReactNode;
        body: React.ReactNode;
        isLoading?: boolean;
    };
}

export function Drawer({ modalKey, children }: DrawerProps) {
    const modals = useModalStore((state) => state.modals);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollableRef = useRef<HTMLDivElement>(null);
    const closeModal = useModalStore((state) => state.closeModal);
    const data = modals[modalKey];
    const dragControls = useDragControls();
    const contentRef = useRef(null);

    useEffect(() => {
        const scrollableDiv = scrollableRef.current;
        if (!scrollableDiv) return;

        const handleScroll = () => {
            setIsScrolled(scrollableDiv.scrollTop > 0);
        };

        scrollableDiv.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            scrollableDiv.removeEventListener("scroll", handleScroll);
        };
    }, [scrollableRef.current]);

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        const velocity = info.velocity.y;
        const offset = info.offset.y;
        console.log(velocity, offset);
        if (velocity > 300) {
            closeModal(modalKey);
        } else if (velocity < -300) {
            // swipe up for Expand
        } else {
            if (offset > 150) {
                closeModal(modalKey);
            }
        }
    };

    const renderParts = children({
        data,
        close: () => closeModal(modalKey),
    });

    return (
        <AnimatePresence mode="wait">
            {data && (
                <ModalOverlay
                    className="fixed inset-0 z-10 flex w-full justify-center bg-background/50 backdrop-blur-xs select-none
                    data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting"
                    isOpen={!!data}
                    isDismissable
                    onOpenChange={(v) => !v && closeModal(modalKey)}
                >
                    <Modal
                        aria-label={modalKey}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-18 bottom-14 md:top-32 md:bottom-0 w-full md:max-w-md flex flex-col overflow-hidden"
                    >
                        <Dialog className="absolute bottom-0 outline-hidden w-full h-full overflow-hidden flex flex-col md:px-2 md:pt-2 justify-end">
                            <Pressable onPress={() => closeModal(modalKey)}>
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
                                className="relative max-h-full h-fit w-full overflow-auto flex flex-col justify-end px-2 pt-2"
                                aria-label="modal"
                            >
                                <motion.div
                                    className={cn(
                                        "relative max-h-full h-fit w-full overflow-auto bg-surface border border-border shadow-center rounded-t-xl"
                                    )}
                                    ref={scrollableRef}
                                >
                                    {renderParts.isLoading ? (
                                        <div className="h-40 flex items-center justify-center">
                                            <LoadingIndicator size="sm" />
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                slot="title"
                                                className={cn(
                                                    "sticky top-0 z-10 bg-surface *:select-none text-sm font-semibold mb-4 p-2 border-border-subtle animate transition-all duration-150",
                                                    isScrolled &&
                                                        "shadow-sm border-b border-border-subtle"
                                                )}
                                                onPointerDown={(e) =>
                                                    dragControls.start(e)
                                                }
                                                style={{ touchAction: "none" }}
                                            >
                                                <div className="w-12 h-1 bg-muted-subtle rounded-full mx-auto mb-1 -mt-1 cursor-grab active:cursor-grabbing" />
                                                {renderParts?.title}
                                            </div>
                                            {renderParts.body}
                                        </>
                                    )}
                                </motion.div>
                            </motion.div>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
}
