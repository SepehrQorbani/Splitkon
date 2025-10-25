import { Button } from "@/components/common/Button";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import RecentGroupsDisclosure from "@/components/common/RecentGroupsDisclosure";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/utils/cn";
import {
    IconLanguage,
    IconMenu2,
    IconSunMoon,
    IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    Heading,
    Label,
    Modal,
    ModalOverlay,
} from "react-aria-components";
import { useLocation } from "react-router";
import { NavItems } from "./NavItems";

function MobileMenu() {
    const { t, direction } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (isOpen) setIsOpen(false);
    }, [location]);

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
            <Button variant="ghost" size="icon" aria-label="Menu">
                <IconMenu2 className="size-4" />
            </Button>
            <ModalOverlay
                isDismissable
                className="fixed inset-0 bg-action/90 dark:bg-background/75 backdrop-blur-[2px] data-[entering]:animate-modal-blur-entering data-[exiting]:animate-modal-blur-exiting z-99999"
            >
                <Modal
                    className={cn(
                        "fixed top-0 bottom-0 end-0  w-full max-w-72 p-2",
                        direction === "rtl"
                            ? "data-[entering]:animate-slide-left-in data-[exiting]:animate-slide-left-out"
                            : "data-[entering]:animate-slide-right-in data-[exiting]:animate-slide-right-out"
                    )}
                >
                    <Dialog className="rounded-xl border border-border shadow-2xl p-2 bg-surface h-full flex flex-col text-sm">
                        <div className="flex justify-between items-center py-2 border-b- border-border">
                            <Button slot="close" variant="ghost" size="icon">
                                <IconX className="size-5" />
                            </Button>
                            <Heading slot="title"></Heading>
                        </div>

                        <div className="flex flex-col justify-between gap-2 h-full overflow-y-auto relative">
                            <div className="space-y-2">
                                <NavItems />
                                <div className="px-1">
                                    <RecentGroupsDisclosure />
                                </div>
                            </div>
                            <div className="sticky bottom-0 bg-surface pt-2">
                                <div className="flex flex-col gap-4 p-4 rounded border border-border">
                                    <div className="flex items-center justify-between gap-2">
                                        <Label>
                                            <IconSunMoon className="size-4 inline me-1" />
                                            {t("ui.theme")}
                                        </Label>
                                        <ThemeToggle />
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <Label>
                                            <IconLanguage className="size-4 inline me-1" />
                                            {t("ui.language")}
                                        </Label>
                                        <LanguageToggle />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
}

export default MobileMenu;
