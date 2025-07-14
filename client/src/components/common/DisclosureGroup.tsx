import {
    Button,
    Disclosure,
    DisclosureGroup as AriaDisclosureGroup,
    DisclosurePanel,
    Heading,
} from "react-aria-components";
import { AnimatePresence, motion } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMeasure } from "@uidotdev/usehooks";
import { useUIStore } from "@/store";
import { cn } from "@/utils/cn";

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

export function DisclosureGroup({
    items,
    allowsMultiple = false,
    className,
}: {
    items: { id: string | number; title: string; content: string }[];
    allowsMultiple?: boolean;
    className?: string;
}) {
    return (
        <AriaDisclosureGroup
            allowsMultipleExpanded={allowsMultiple}
            className={cn("space-y-2 w-full relative", className)}
        >
            {items.map((item) => (
                <Disclosure key={item.id}>
                    {({ isExpanded }) => {
                        const [ref, { height }] = useMeasure();
                        return (
                            <>
                                <Heading>
                                    <Button
                                        slot="trigger"
                                        className="flex gap-2 w-full p-3 hover:cursor-pointer text-sm text-start"
                                    >
                                        <ExpandableIcon
                                            isExpanded={isExpanded}
                                        />
                                        {item.title}
                                    </Button>
                                </Heading>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            key={`disclosure-content-${item.id}`}
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
                                            className="ps-8 text-start"
                                        >
                                            <div
                                                ref={ref}
                                                className="p-4 text-gray-700 rounded bg-surface/40 border shadow-xs border-surface text-sm leading-8"
                                            >
                                                <DisclosurePanel>
                                                    {item.content}
                                                </DisclosurePanel>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        );
                    }}
                </Disclosure>
            ))}
        </AriaDisclosureGroup>
    );
}
