import { useGetBalance } from "@/api/queries/balance";
import { useGetMembers } from "@/api/queries/members";
import AsyncContent from "@/components/common/AsyncContent";
import { getButtonStyles } from "@/components/common/Button";
import { CardStack } from "@/components/common/CardStack";
import MemberCardStackItem from "@/components/common/MemberCardStackItem";
import MemberCard from "@/components/features/members/MemberCard";
import { MemberCardSkeleton } from "@/components/features/members/MemberCardSkeleton";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useBalanceStore } from "@/store/balance";
import { useMemberStore } from "@/store/members";
import { IconSettings } from "@tabler/icons-react";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { EmptyState } from "@/components/common/EmptyState";

type Props = {};

function MembersIndex({}: Props) {
    const { t } = useTranslations();
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);
    const setMembers = useMemberStore((state) => state.setMembers);
    const setBalance = useBalanceStore((state) => state.setBalance);
    const { token } = useParams();

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
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <MemberCardSkeleton key={index} />
                            ))}
                    </div>
                </div>
            }
        >
            {members?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LayoutGroup>
                        {members?.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                // isLoading={isBalanceLoading}
                            />
                        ))}
                    </LayoutGroup>
                </div>
            ) : (
                <EmptyState
                    items={[
                        { id: 1, content: <MemberCardStackItem /> },
                        { id: 2, content: <MemberCardStackItem /> },
                        { id: 3, content: <MemberCardStackItem /> },
                    ]}
                    message={t("ui.noMember")}
                    action={
                        can("addMembers") && (
                            <NavLink
                                to={`/${token}/setting`}
                                className={getButtonStyles({
                                    className: "mx-auto",
                                })}
                            >
                                <div className="flex gap-1 items-center text-sm">
                                    <IconSettings className="size-4" />
                                    <span>{t("ui.settings")}</span>
                                </div>
                            </NavLink>
                        )
                    }
                />
            )}
        </AsyncContent>
    );
}

export default MembersIndex;
