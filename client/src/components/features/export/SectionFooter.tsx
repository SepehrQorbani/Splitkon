import LogoType from "@/components/common/logo/LogoType";
import { useQRCode } from "@/hooks/useQRCode";
import { useTranslations } from "@/hooks/useTranslations";
import { Group } from "@/types/schemas/group";

export const SectionFooter = ({ group }: { group: Group | null }) => {
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
        <div className="px-4 text-xs pb-4 pt-6 flex justify-between relative">
            <span className="absolute -top-1.5 -left-1.5 size-3 rounded-r-full bg-surface border-r-2 border-border" />
            <span className="absolute -top-1.5 -right-1.5 size-3 rounded-l-full bg-surface border-l-2 border-border" />

            <div ref={qrCode} className="w-16 h-16 *:w-16 *:h-16" />
            <div className="flex flex-col justify-end gap-2 items-end">
                <div className="text-[10px] text-muted">
                    <span>{formatDate(new Date())}</span>
                </div>
                <LogoType className="text-action h-3" />
            </div>
        </div>
    );
};
