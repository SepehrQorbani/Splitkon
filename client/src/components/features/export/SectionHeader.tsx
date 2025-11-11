import Logo from "@/components/common/logo/Logo";
import { useTranslations } from "@/hooks/useTranslations";
import { Group } from "@/types/schemas/group";

export const SectionHeader = ({ group }: { group: Group | null }) => {
    const { formatDate } = useTranslations();
    return (
        <div className="flex items-center p-4">
            <Logo className="size-12 me-2 text-action" />
            <div className="flex flex-col justify-between h-10">
                <div className="text-xs font-bold">{group?.title}</div>
                <div className="text-[10px] font-mono">
                    {formatDate(new Date(group?.date || ""))}
                </div>
            </div>
        </div>
    );
};
