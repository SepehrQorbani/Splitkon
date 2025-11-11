import Avatar from "@/components/common/Avatar";
import Logo from "@/components/common/logo/Logo";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { Group } from "@/types/schemas/group";

type Props = { group: Group | null; member: Member };

function MemberHeader({ group, member }: Props) {
    const { t, formatDate } = useTranslations();
    return (
        <div>
            <div className="flex items-center py-1 px-1 mx-2 bg-background mt-4 rounded gap-1">
                <Logo className="size-4 text-action" />
                <div className="text-xs font-bold">{group?.title}</div>
                <div className="text-[10px] font-mono ms-auto">
                    {formatDate(new Date(group?.date || ""))}
                </div>
            </div>
            <div className="flex items-center p-4">
                <Avatar
                    src={member.avatar}
                    alt={member.name}
                    size="lg"
                    className="me-2"
                    imgStyle={{ filter: "grayscale(1)" }}
                />
                <div>
                    <span>{member.name}</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        {/* <IconUsers className="w-3 h-3" /> */}(
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
                    <div className="ms-auto mb-auto text-[10px] bg-action text-action-fg px-2 rounded py-0.5">
                        {t(member.status?.title)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberHeader;
