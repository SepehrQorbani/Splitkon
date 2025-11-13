import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import LogoType from "@/components/common/logo/LogoType";
import { useQRCode } from "@/hooks/useQRCode";
import { useQRCodeBlob } from "@/hooks/useQRCodeBlob";
import { useTranslations } from "@/hooks/useTranslations";
import { Group } from "@/types/schemas/group";

export const SectionFooterCard = ({ url }: { url: string }) => {
    const { formatDate } = useTranslations();
    const actionColor = getComputedStyle(
        document.documentElement
    ).getPropertyValue("--color-action");
    const { qrBlobUrl, isLoading } = useQRCodeBlob(url, {
        width: 250,
        height: 250,
        color: actionColor,
        backgroundColor: "transparent",
        imageOptions: { margin: 4 },
    });

    return (
        <div className="flex justify-between items-end">
            {isLoading ? (
                <div className="flex items-center justify-center size-16 border rounded border-border">
                    <LoadingIndicator size="sm" />
                </div>
            ) : qrBlobUrl ? (
                <img
                    src={qrBlobUrl}
                    alt="QR Code"
                    className="size-16 border rounded border-border"
                />
            ) : null}

            <div className="flex flex-col justify-end gap-2 items-end">
                <div className="text-[10px] text-muted">
                    <span>{formatDate(new Date())}</span>
                </div>
                <LogoType className="text-brand h-3" />
            </div>
        </div>
    );
};
