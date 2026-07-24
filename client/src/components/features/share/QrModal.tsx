import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import { useQRCode } from "@/hooks/useQRCode";
import { useQRCodeBlob } from "@/hooks/useQRCodeBlob";
import { useTranslations } from "@/hooks/useTranslations";
import { IconQrcode, IconX } from "@tabler/icons-react";

function QRContent({ data }: { data: string | null }) {
    const { t } = useTranslations();

    const actionColor = getComputedStyle(
        document.documentElement
    ).getPropertyValue("--color-action");

    // حالا می‌تونیم هُک‌ها رو اینجا استفاده کنیم
    const { ref } = useQRCode(data || "", {
        width: 250,
        height: 250,
        color: actionColor,
        backgroundColor: "transparent",
    });

    const { qrBlobUrl, isLoading } = useQRCodeBlob(data || "", {
        width: 250,
        height: 250,
        color: actionColor,
        backgroundColor: "transparent",
    });

    return (
        <div className="pb-8 flex justify-center items-center">
            {/* <div ref={ref} className="*:w-full *:p-2" /> */}
            <div className="*:w-full *:p-2">
                {isLoading ? (
                    <div className="flex items-center justify-center border rounded border-border">
                        <LoadingIndicator size="sm" />
                    </div>
                ) : qrBlobUrl ? (
                    <img
                        src={qrBlobUrl}
                        alt="QR Code"
                        className="border rounded border-border"
                    />
                ) : null}
            </div>
        </div>
    );
}

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
                const { qrBlobUrl, isLoading } = useQRCodeBlob(
                    (data as string) || "",
                    {
                        width: 250,
                        height: 250,
                        color: actionColor,
                        backgroundColor: "transparent",
                        // imageOptions: { margin: 4 },
                    }
                );

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

                    body: data ? <QRContent data={data as string} /> : null,
                };
            }}
        </Drawer>
    );
}

export default QrModal;
