import { Drawer } from "@/components/common/Drawer";
import { useTranslations } from "@/hooks/useTranslations";
import { IconDownload, IconPhotoDown } from "@tabler/icons-react";
import Export from "./Export";
import ExportMember from "./ExportMember";
import { useState } from "react";
// import { Button } from "@/components/common/Button";
import { Button } from "react-aria-components";
import { motion, AnimatePresence } from "motion/react";
import ReportLinks from "./ReportLinks";
import { cn } from "@/utils/cn";

function ExportModal() {
    const { t } = useTranslations();
    const [tab, setTab] = useState("image");
    return (
        <Drawer modalKey="export">
            {({ data, close }) => {
                let isLoading = false;

                if (data && typeof data === "object" && "member" in data) {
                    return {
                        isLoading: isLoading,
                        title: (
                            <div className="flex items-center gap-2">
                                <IconDownload className="size-4" />
                                {t("ui.export")}
                            </div>
                        ),
                        body: <ExportMember member={data.member} />,
                    };
                }

                return {
                    isLoading: isLoading,
                    title: (
                        <div className="flex items-center justify-between gap-2">
                            <Button
                                onPress={() => {
                                    setTab("image");
                                }}
                                className={cn(
                                    "flex flex-1 items-center justify-between px-4 gap-2 w-full rounded py-1.5 text-xs",
                                    tab === "image"
                                        ? "bg-action text-action-fg"
                                        : "bg-background cursor-pointer"
                                )}
                                isDisabled={tab === "image"}
                                // variant="ghost"
                            >
                                <span>{t("ui.imageExport")}</span>
                                <IconPhotoDown className="size-4" />
                            </Button>

                            <Button
                                className={cn(
                                    "flex flex-1 items-center justify-between px-4 gap-2 w-full rounded py-1.5 text-xs",
                                    tab === "file"
                                        ? "bg-action text-action-fg"
                                        : "bg-background cursor-pointer"
                                )}
                                isDisabled={tab === "file"}
                                // variant="ghost"
                                onPress={() => {
                                    setTab("file");
                                }}
                            >
                                <span>{t("ui.fileExport")}</span>
                                <IconDownload className="size-4" />
                            </Button>
                        </div>
                    ),
                    body: (
                        <motion.div layout>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={tab}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="-mt-5"
                                >
                                    {tab === "file" ? (
                                        <ReportLinks />
                                    ) : (
                                        <Export />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default ExportModal;
