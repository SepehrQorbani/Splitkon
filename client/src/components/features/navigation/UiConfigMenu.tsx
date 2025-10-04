import { Button } from "@/components/common/Button";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import { IconLanguage, IconPalette, IconSunMoon } from "@tabler/icons-react";
import { useState } from "react";
import { Label, MenuTrigger, Popover } from "react-aria-components";

function UiConfigMenu({}) {
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
                            <IconSunMoon className="size-4 inline me-1" />
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
            </Popover>
        </MenuTrigger>
    );
}

export default UiConfigMenu;
