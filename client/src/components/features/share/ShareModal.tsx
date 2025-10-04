import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { useTranslations } from "@/hooks/useTranslations";
import { IconShare, IconX } from "@tabler/icons-react";
import ShareForm from "./ShareForm";

function ShareModal() {
    const { t } = useTranslations();

    return (
        <Drawer modalKey="share">
            {({ data, close }) => {
                return {
                    isLoading: false,
                    title: (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1 items-center">
                                <IconShare className="size-4" />
                                <span>{t("ui.share")}</span>
                            </div>
                            <Button
                                variant="ghost"
                                className="size-8 p-1 text-muted"
                                onPress={close}
                            >
                                <IconX className="size-4" />
                            </Button>
                        </div>
                    ),

                    body: (
                        <div className="px-2">
                            <ShareForm />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default ShareModal;
