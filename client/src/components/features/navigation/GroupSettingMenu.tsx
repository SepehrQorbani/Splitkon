import { Button } from "@/components/common/Button";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import ToggleButtonGroup from "@/components/common/ToggleButtonGroup";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useUIStore } from "@/store";
import { cn } from "@/utils/cn";
import {
    IconDotsVertical,
    IconEye,
    IconLanguage,
    IconLayoutGrid,
    IconLayoutList,
    IconPalette,
    IconSettings,
    IconSettingsFilled,
    IconSunMoon,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Label, MenuTrigger, Popover, Separator } from "react-aria-components";
import { NavLink, useLocation, useParams } from "react-router";

function GroupSettingMenu({}) {
    const { t, direction } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const { view, setView } = useUIStore();
    const { token } = useParams<{ token: string }>();
    const { can } = usePermissions();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (isOpen) setIsOpen(false);
    }, [location]);

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
                <IconDotsVertical className="size-4" />
            </Button>
            <Popover
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                placement="bottom start"
                className="p-2 border border-border overflow-auto select-none outline-none rounded bg-surface text-sm shadow-lg ring-0 data-[entering]:animate-slide-down-in data-[exiting]:animate-slide-up-out    "
            >
                <div dir={direction} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-8">
                        <Label className="text-xs">
                            {/* <IconEye className="size-4 inline me-1" /> */}
                            {t("ui.view")}
                        </Label>
                        <ToggleButtonGroup
                            buttons={[
                                {
                                    id: "grid",
                                    icon: <IconLayoutGrid className="size-4" />,
                                },
                                {
                                    id: "table",
                                    icon: <IconLayoutList className="size-4" />,
                                },
                            ]}
                            value={view}
                            onChange={(v) => {
                                setView(v as "grid" | "table");
                                setIsOpen(false);
                            }}
                            className="w-fit"
                        />
                    </div>
                    {can("edit") && (
                        <>
                            <Separator className="bg-border border-border h-[1px]" />
                            <div className="">
                                <NavLink
                                    to={`${token}/setting`}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex justify-between items-center gap-1 hover:bg-action hover:text-action-fg p-1 rounded",
                                            isActive &&
                                                "bg-action text-action-fg"
                                        )
                                    }
                                    end
                                >
                                    <span>{t("ui.settings")}</span>
                                    <IconSettings className="size-6 p-1" />
                                </NavLink>
                            </div>
                        </>
                    )}
                </div>
            </Popover>
        </MenuTrigger>
    );
}

export default GroupSettingMenu;
