import LogoType from "@/components/common/logo/LogoType";
import { useQRCode } from "@/hooks/useQRCode";
import { useTranslations } from "@/hooks/useTranslations";
import { Group } from "@/types/schemas/group";

export const SectionFooterCard = ({ group }: { group: Group | null }) => {
    const { formatDate } = useTranslations();
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
    const viewUrl = `${baseUrl}/${group?.view_token}`;
    const actionColor = getComputedStyle(
        document.documentElement
    ).getPropertyValue("--color-action");
    const { ref: qrCode } = useQRCode(viewUrl, {
        width: 250,
        height: 250,
        color: actionColor,
        backgroundColor: "transparent",
        imageOptions: { margin: 4 },
    });

    return (
        <div className="flex justify-between items-end">
            <div ref={qrCode} className="w-16 h-16 *:w-16 *:h-16" />

            <div className="flex flex-col justify-end gap-2 items-end">
                <div className="text-[10px] text-muted">
                    <span>{formatDate(new Date())}</span>
                </div>
                <LogoType className="text-brand h-3" />
            </div>
        </div>
    );
};
