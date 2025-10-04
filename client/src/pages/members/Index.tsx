import { useGetBalance } from "@/api/queries/balance";
import { useGetMembers } from "@/api/queries/members";
import AsyncContent from "@/components/common/AsyncContent";
import { getButtonStyles } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import MemberCardStackItem from "@/components/common/MemberCardStackItem";
import TableSkeleton from "@/components/common/TableSkeleton";
import FiltersSkeleton from "@/components/common/filters/FiltersSkeleton";
import { MemberCardSkeleton } from "@/components/features/members/MemberCardSkeleton";
import MembersCard from "@/components/features/members/MembersCard";
import MembersTable from "@/components/features/members/MembersTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useUIStore } from "@/store";
import { useBalanceStore } from "@/store/balance";
import { useMemberStore } from "@/store/members";
import { useModalStore } from "@/store/modals";
import {
    IconHelpCircle,
    IconInfoCircle,
    IconSettings,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router";

type Props = {};

function MembersIndex({}: Props) {
    const { t } = useTranslations();
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);
    const setMembers = useMemberStore((state) => state.setMembers);
    const setBalance = useBalanceStore((state) => state.setBalance);
    const { token } = useParams();
    const view = useUIStore((state) => state.view);
    const openModal = useModalStore((state) => state.openModal);

    const {
        data: membersData,
        isLoading: isMembersLoading,
        error: membersError,
        refetch,
    } = useGetMembers(token as string);

    const {
        data: balanceData,
        isLoading: isBalanceLoading,
        error: balanceError,
    } = useGetBalance(token as string);

    useEffect(() => {
        if (membersData) {
            setMembers(membersData.data);
        }
    }, [membersData, setMembers]);

    useEffect(() => {
        if (balanceData) {
            setBalance(balanceData.data);
        }
    }, [balanceData, setBalance]);

    return (
        <AsyncContent
            isLoading={isMembersLoading}
            error={membersError || balanceError}
            refetch={refetch}
            skeleton={
                view === "grid" ? (
                    <div>
                        <FiltersSkeleton />
                        <div className="mt-4 w-full overflow-auto text-nowrap scroll-pt-[2.321rem] relative text-action"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <MemberCardSkeleton key={index} />
                                ))}
                        </div>
                    </div>
                ) : (
                    <TableSkeleton />
                )
            }
        >
            {members.length > 0 ? (
                <>
                    {view === "grid" ? (
                        <MembersCard members={members} />
                    ) : (
                        <div>
                            <MembersTable
                                members={members}
                                onSelectMember={(v) =>
                                    !!v && openModal("members", v)
                                }
                            />
                        </div>
                    )}
                    {/* <MemberDetailModal /> */}
                </>
            ) : (
                <EmptyState
                    items={[
                        { id: 1, content: <MemberCardStackItem /> },
                        { id: 2, content: <MemberCardStackItem /> },
                        { id: 3, content: <MemberCardStackItem /> },
                    ]}
                    message=<div className="space-y-4 mt-4">
                        <p>{t("ui.noMember")}</p>
                        {members.length < 2 && (
                            <div className="flex flex-col items-center gap-4 ">
                                <div className="text-xs flex items-center gap-1">
                                    <IconInfoCircle className="size-4" />
                                    {t("ui.minMemberIsTwo")}
                                </div>
                                <div className="text-xs flex items-center gap-1">
                                    <IconHelpCircle className="size-4" />
                                    {t("ui.addMembersFromSetting")}
                                </div>
                            </div>
                        )}
                    </div>
                    action={
                        members.length < 2 &&
                        can("addMembers") && (
                            <NavLink
                                to={`/${token}/setting`}
                                className={getButtonStyles({
                                    className: "mx-auto",
                                })}
                            >
                                <div className="flex gap-1 items-center text-xs">
                                    <IconSettings className="size-4" />
                                    <span>{t("ui.settings")}</span>
                                </div>
                            </NavLink>
                        )
                    }
                    // message={t("ui.noMember")}
                    // action={
                    //     can("addMembers") &&
                    //     members.length == 0 && (
                    //         <NavLink
                    //             to={`/${token}/setting`}
                    //             className={getButtonStyles({
                    //                 className: "mx-auto",
                    //             })}
                    //         >
                    //             <div className="flex gap-1 items-center text-sm">
                    //                 <IconSettings className="size-4" />
                    //                 <span>{t("ui.settings")}</span>
                    //             </div>
                    //         </NavLink>
                    //     )
                    // }
                />
            )}
        </AsyncContent>
    );
}

export default MembersIndex;
