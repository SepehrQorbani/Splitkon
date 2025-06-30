import { Button, ButtonProps } from "./Button";
import { FC, ReactNode, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pressable } from "react-aria-components";

interface ConfirmableButtonProps extends Omit<ButtonProps, "onPress"> {
    onConfirm: () => void;
    confirm?: ReactNode;
    cancel?: ReactNode;
    children?: ReactNode;
}
export const ConfirmableButton: FC<ConfirmableButtonProps> = ({
    onConfirm,
    confirm = "Confirm",
    cancel = "Cancel",
    children = "Delete",
    intent,
    ...props
}) => {
    const [confirming, setConfirming] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {confirming && (
                <Pressable
                    onPress={() => {
                        setConfirming(false);
                    }}
                >
                    <div className="absolute bg-transparent inset-0 z-99999"></div>
                </Pressable>
            )}
            <div className="relative" ref={containerRef}>
                <Button
                    variant={props.variant || "solid"}
                    intent={intent}
                    size={props.size}
                    onPress={() => setConfirming(true)}
                    {...props}
                    className={confirming ? "opacity-0 transition-all" : ""}
                >
                    {children}
                </Button>
                <AnimatePresence>
                    {confirming && (
                        <motion.div
                            key="confirming"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            // transition={{ duration: 0.2 }}
                            className="absolute end-0 -top-1 z-100000 rounded p-1 bg-white shadow-lg flex gap-2"
                        >
                            <Button
                                variant={props.variant || "solid"}
                                intent={intent}
                                size={props.size}
                                onPress={() => {
                                    setConfirming(false);
                                    onConfirm();
                                }}
                                {...props}
                            >
                                {confirm}
                            </Button>
                            <Button
                                variant={props.variant || "outline"}
                                intent="neutral"
                                size={props.size}
                                onPress={() => setConfirming(false)}
                                {...props}
                            >
                                {cancel}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

ConfirmableButton.displayName = "ConfirmableButton";
