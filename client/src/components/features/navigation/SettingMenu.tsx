import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import {
    IconAdjustments,
    IconLanguage,
    IconPalette,
} from "@tabler/icons-react";
import { useState } from "react";
import { Label, MenuTrigger, Popover } from "react-aria-components";
import { Button } from "@/components/common/Button";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";

function SettingMenu({}) {
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
                <IconPalette className="size-4" />
            </Button>
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="bottom start"
                className="p-2 border border-border overflow-auto select-none outline-none rounded bg-surface text-sm shadow-lg ring-0 data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out    "
            >
                <div dir={direction} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-8">
                        <Label>
                            <IconPalette className="size-4 inline me-1" />
                            {t("ui.theme")}
                        </Label>
                        <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between gap-8">
                        <Label>
                            <IconLanguage className="size-4 inline me-1" />
                            {t("ui.language")}
                        </Label>
                        <LanguageToggle />
                    </div>
                </div>

                {/* <Menu className="outline-none space-y-2">
                    <MenuItem
                        className="outline-none rounded p-1 focus:ring-1 hover:bg-action hover:text-action-fg"
                        onAction={() => alert("open")}
                    >
                        Open
                    </MenuItem>
                    <MenuItem
                        className="outline-none focus:ring-1 rounded p-1 hover:bg-action hover:text-action-fg"
                        onAction={() => alert("rename")}
                    >
                        Rename…
                    </MenuItem>
                </Menu> */}
            </Popover>
        </MenuTrigger>
    );
}

export default SettingMenu;
