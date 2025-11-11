import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { useQRCode } from "@/hooks/useQRCode";
import { useTranslations } from "@/hooks/useTranslations";
import { IconQrcode, IconX } from "@tabler/icons-react";

function QrModal() {
    const { t } = useTranslations();

    const actionColor = getComputedStyle(
        document.documentElement
    ).getPropertyValue("--color-action");

    return (
        <Drawer modalKey="qr-code">
            {({ data, close }) => {
                const { ref } = useQRCode(data as string, {
                    width: 250,
                    height: 250,
                    color: actionColor,
                    backgroundColor: "transparent",
                });

                return {
                    isLoading: false,
                    title: (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1 items-center">
                                <IconQrcode className="size-4 shrink-0" />
                                <span>{t("ui.shareQrCode")}</span>
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
                        <div className="pb-8 flex justify-center items-center">
                            <div ref={ref} className="*:w-full *:p-2" />
                        </div>
                    ),
                };
            }}
        </Drawer>
    );
}

export default QrModal;
