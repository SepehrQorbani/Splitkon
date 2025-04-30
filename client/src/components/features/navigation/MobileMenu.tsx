import { Button } from "@/components/common/Button";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconLanguage,
    IconMenu2,
    IconPalette,
    IconX,
} from "@tabler/icons-react";
import {
    Dialog,
    DialogTrigger,
    Heading,
    Label,
    Modal,
    ModalOverlay,
} from "react-aria-components";
import { NavItems } from "./NavItems";
import { cn } from "@/utils/cn";

function MobileMenu() {
    const { t, direction } = useTranslations();

    return (
        <DialogTrigger>
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

                        <div className="flex flex-col justify-between h-full">
                            <div className="space-y-2">
                                <NavItems />
                            </div>
                            <div className="flex flex-col gap-4 bg-background- p-4 rounded border border-border">
                                {/* <div className="flex gap-1 items-center">
                                    <IconAdjustments className="size-4" />
                                    <h4>تنظیمات</h4>
                                </div> */}
                                <div className="flex items-center justify-between gap-2">
                                    <Label>
                                        <IconPalette className="size-4 inline me-1" />
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
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    );
}

export default MobileMenu;
