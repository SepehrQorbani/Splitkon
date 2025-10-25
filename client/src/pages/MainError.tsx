import { Button, getButtonStyles } from "@/components/common/Button";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconChevronLeft,
    IconChevronRight,
    IconHome,
    IconRefresh,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router";

export default function MainError({ message }: { message?: string }) {
    const { t, direction } = useTranslations();
    const { token } = useParams();
    console.log(token);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center flex-1 p-8 min-h-dvh"
        >
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-muted mb-4"
            >
                {t("pages.error.somethingWentWrong")}
            </motion.p>
            {message && (
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold text-action text-center"
                >
                    {message}
                </motion.h1>
            )}

            <div className="flex flex-col items-center relative mt-16">
                <div className="absolute -z-10 bottom-4 right-0 left-0 top-5 bg-gradient-to-r from-blue-500/50 to-brand/50 blur-3xl scale-90" />

                <motion.img
                    animate={{
                        scale: [0.98, 1, 0.98],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    src="/images/shadow.svg"
                    alt="Error Shadow Image"
                    className="absolute w-full h-44 object-contain top-4 left-2 bottom-0 origin-bottom opacity-25"
                />
                <motion.img
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    src="/images/error.svg"
                    alt="Error Image"
                    className="w-full h-40 object-contain relative"
                />
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="w-full relative flex flex-col gap-4 mt-8"
                >
                    <Button
                        onPress={() => {
                            window.location.reload();
                        }}
                        size="lg"
                        intent="neutral"
                        className="rounded-xl py-6 bg-surface/40 hover:bg-surface/60 border-surface text-sm w-full justify-start"
                    >
                        <span className="rounded-full p-2 bg-action text-action-fg me-2">
                            <IconRefresh className="size-4" />
                        </span>
                        <span>{t("pages.error.tryAgain")}</span>
                    </Button>
                    <Link
                        to={"/"}
                        reloadDocument={true}
                        className={getButtonStyles({
                            size: "lg",
                            intent: "neutral",
                            className:
                                "rounded-xl py-6 bg-surface/40 hover:bg-surface/60 border-surface text-sm w-full",
                        })}
                    >
                        <span className="rounded-full p-2 bg-action text-action-fg me-2">
                            <IconHome className="size-4" />
                        </span>
                        {t("pages.notFound.goToHome")}

                        {direction === "rtl" ? (
                            <IconChevronLeft className="size-4 shrink-0 ms-auto" />
                        ) : (
                            <IconChevronRight className="size-4 shrink-0 ms-auto" />
                        )}
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
