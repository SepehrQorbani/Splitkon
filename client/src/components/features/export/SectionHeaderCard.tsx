import Logo from "@/components/common/logo/Logo";
import { useTranslations } from "@/hooks/useTranslations";
import { Group } from "@/types/schemas/group";

export const SectionHeaderCard = ({ group }: { group: Group | null }) => {
    const { formatDate } = useTranslations();
    return (
        <div className="flex items-center gap-2">
            <Logo className="size-10 text-brand" />
            <div className="flex flex-col">
                <div className="text-sm font-bold">{group?.title}</div>
                <div className="text-[10px] font-mono text-muted">
                    {formatDate(new Date(group?.date || ""))}
                </div>
            </div>
        </div>
    );
};
