import { getButtonStyles } from "@/components/common/Button";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconChevronLeft,
    IconChevronRight,
    IconDashboard,
    IconHome,
} from "@tabler/icons-react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import { useGroupStore } from "@/store";

export default function NotFound() {
    const { t, direction } = useTranslations();
    const group = useGroupStore((state) => state.group);
    const { token } = useParams();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center flex-1 p-8"
        >
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-muted"
            >
                {t("pages.notFound.lost")}
            </motion.p>
            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl font-bold text-action text-center"
            >
                {t("pages.notFound.title")}
            </motion.h1>
            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-muted mt-4"
            >
                {t("pages.notFound.description")}
            </motion.p>
            <div className="flex flex-col items-center relative mt-16">
                <div className="absolute -z-10 bottom-4 right-0 left-0 top-20 bg-gradient-to-r from-blue-500/50 to-brand/50 blur-3xl scale-90" />

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
                    alt="SplitKon Dashboard Preview"
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
                    src="/images/404.svg"
                    alt="SplitKon Dashboard Preview"
                    className="w-full h-40 object-contain relative"
                />
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="w-full relative"
                >
                    <Link
                        to={group ? `/${token}` : "/"}
                        prefetch="render"
                        className={getButtonStyles({
                            size: "lg",
                            intent: "neutral",
                            className:
                                "mt-8 rounded-xl py-6 bg-surface/40 hover:bg-surface/60 border-surface text-sm w-full",
                        })}
                    >
                        <span className="rounded-full p-2 bg-action text-action-fg me-2">
                            {group ? (
                                <IconDashboard className="size-4" />
                            ) : (
                                <IconHome className="size-4" />
                            )}
                        </span>
                        {group
                            ? t("pages.notFound.goToDashboard")
                            : t("pages.notFound.goToHome")}
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
