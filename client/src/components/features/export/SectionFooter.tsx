import { LoadingIndicator } from "@/components/common/LoadingIndicator";
import LogoType from "@/components/common/logo/LogoType";
import { useQRCodeBlob } from "@/hooks/useQRCodeBlob";
import { useTranslations } from "@/hooks/useTranslations";
import { Group } from "@/types/schemas/group";

export const SectionFooter = ({ url }: { url: string }) => {
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
        <div className="px-4 text-xs pb-4 pt-6 flex justify-between relative">
            <span className="absolute -top-1.5 -left-1.5 size-3 rounded-r-full bg-surface border-r-2 border-border" />
            <span className="absolute -top-1.5 -right-1.5 size-3 rounded-l-full bg-surface border-l-2 border-border" />

            <div className="">
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
            </div>
            <div className="flex flex-col justify-end gap-2 items-end">
                <div className="text-[10px] text-muted">
                    <span>{formatDate(new Date())}</span>
                </div>
                <LogoType className="text-action h-3" />
            </div>
        </div>
    );
};
