import Avatar from "@/components/common/Avatar";
import Logo from "@/components/common/logo/Logo";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { Group } from "@/types/schemas/group";

type Props = { group: Group | null; member: Member };

function MemberHeaderCard({ group, member }: Props) {
    const { t, formatDate } = useTranslations();
    return (
        <div>
            <div className="flex items-center py-1 px-1 bg-background rounded gap-1">
                <Logo className="size-4 text-brand" />
                <div className="text-xs font-bold">{group?.title}</div>
                <div className="text-[10px] font-mono ms-auto">
                    {formatDate(new Date(group?.date || ""))}
                </div>
            </div>
            <div className="flex items-center py-4 px-2">
                <Avatar
                    src={member.avatar}
                    alt={member.name}
                    size="lg"
                    className="me-2"
                />
                <div>
                    <span>{member.name}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        (
                        <span className="text-xs text-gray-500">
                            {member.ratio}
                        </span>
                        <span className="text-[10px]">
                            {t("attributes.ratio_unit")}
                        </span>
                        )
                    </div>
                </div>
                {member.status && (
                    <div
                        className={`ms-auto mb-auto flex items-center justify-end gap-1 text-xs text-${member.status.title} font-bold`}
                    >
                        <span
                            className={`size-2 rounded-full bg-${member.status?.title}-subtle border border-${member.status?.title}`}
                        />
                        <span>{t(member.status?.title)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberHeaderCard;
