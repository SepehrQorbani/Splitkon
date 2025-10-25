import { Button } from "@/components/common/Button";
import { RecentGroupsList } from "@/components/common/RecentGroupsList";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { IconHistory } from "@tabler/icons-react";
import { useState } from "react";
import { MenuTrigger, Popover } from "react-aria-components";

function RecentGroupMenu({}) {
    const { t, direction } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <MenuTrigger>
            <Button
                variant="input"
                intent="neutral"
                size="icon"
                aria-label="Menu"
                className={cn(
                    "transition-all",
                    isOpen && "bg-action text-action-fg"
                )}
                onPress={() => {
                    setIsOpen((prevVal) => !prevVal);
                }}
            >
                <IconHistory className="size-4" />
            </Button>
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement={direction === "ltr" ? "bottom end" : "bottom start"}
                className="p-2 border border-border overflow-auto select-none outline-none rounded bg-surface text-sm shadow-lg ring-0 data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out    "
            >
                <div
                    dir={direction}
                    className="flex flex-col max-h-64 max-w-64 w-64"
                >
                    <RecentGroupsList />
                </div>
            </Popover>
        </MenuTrigger>
    );
}

export default RecentGroupMenu;
