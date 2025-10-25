import { useUIStore } from "@/store";
import { cn } from "@/utils/cn";
import {
    IconChevronLeft,
    IconChevronRight,
    IconHistory,
} from "@tabler/icons-react";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Disclosure, DisclosurePanel } from "react-aria-components";
import { Button } from "./Button";
import { RecentGroupsList } from "./RecentGroupsList";
import { useTranslations } from "@/hooks/useTranslations";
type Props = {};

function RecentGroupsDisclosure({}: Props) {
    const [ref, { height }] = useMeasure();
    const { t } = useTranslations();

    return (
        <Disclosure>
            {({ isExpanded }) => (
                <>
                    <Button
                        slot="trigger"
                        variant="ghost"
                        className={cn(
                            "flex gap-1 justify-between w-full p-3 hover:cursor-pointer text-sm text-action/75 font-normal transition-all",
                            isExpanded &&
                                "text-action font-semibold  focus:outline-0 focus:ring-0"
                        )}
                    >
                        <div className="flex gap-1 items-center">
                            <IconHistory className="size-4" />
                            <h3>{t("ui.recentGroup")}</h3>
                        </div>
                        <ExpandableIcon isExpanded={isExpanded} />
                    </Button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                    opacity: 1,
                                    height: height || 100,
                                }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                    height: { duration: 0.3 },
                                    opacity: { duration: 0.2 },
                                }}
                                style={{ overflow: "hidden" }}
                                className="text-start"
                            >
                                <div ref={ref} className=" py-4">
                                    <DisclosurePanel>
                                        <RecentGroupsList />
                                    </DisclosurePanel>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Disclosure>
    );
}

export default RecentGroupsDisclosure;

function ExpandableIcon({ isExpanded = false }: { isExpanded: boolean }) {
    const { direction } = useUIStore();

    return direction === "rtl" ? (
        <IconChevronLeft
            className={`size-4 transition-transform duration-300 ${
                isExpanded ? "-rotate-90" : "rotate-0"
            }`}
        />
    ) : (
        <IconChevronRight
            className={`size-4 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : "rotate-0"
            }`}
        />
    );
}
