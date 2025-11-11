import Amount from "@/components/common/Amount";
import { useTranslations } from "@/hooks/useTranslations";
import { Member } from "@/types";
import { IconChecks } from "@tabler/icons-react";

export const GroupMembers = ({ members }: { members: Member[] }) => {
    const { t } = useTranslations();
    return (
        <div className="px-2 text-xs pt-6 mx-2">
            <div className="font-bold ps-2">
                {t("ui.status")} {t("ui.members")}
            </div>
            {members.length > 0 ? (
                <table className="w-full border-collapse">
                    <tbody className="w-full border-collapse">
                        {members.map((member, i) => {
                            return (
                                <tr
                                    key={member.id}
                                    className="border-b border-dashed border-border last:border-none"
                                >
                                    <td className="ps-4 py-4 text-muted">
                                        {i + 1 + ".  "}
                                        {member.name}
                                    </td>

                                    <td className="text-end">
                                        <div className="flex items-center justify-end pe-4">
                                            {member.status?.net === 0 ? (
                                                <IconChecks className="size-3" />
                                            ) : (
                                                <>
                                                    {/* <IconCurrencyDollar className="size-3" /> */}
                                                    <Amount
                                                        // showUnit={false}
                                                        amount={
                                                            member.status
                                                                ?.net ?? 0
                                                        }
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <div className="flex items-center gap-1 text-[10px] text-muted pt-4 pb-8">
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                    <div className="shrink-0">{t("ui.noMember")}</div>
                    <div className="w-full min-w-4 border-b border-dashed border-border"></div>
                </div>
            )}
        </div>
    );
};
