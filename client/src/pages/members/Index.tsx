import { useGetBalance } from "@/api/queries/balance";
import { useGetMembers } from "@/api/queries/members";
import AsyncContent from "@/components/common/AsyncContent";
import MemberCard from "@/components/features/members/MemberCard";
import { MemberCardSkeleton } from "@/components/features/members/MemberCardSkeleton";
import { useBalanceStore } from "@/store/balance";
import { useMemberStore } from "@/store/members";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { useParams } from "react-router";

type Props = {};

function MembersIndex({}: Props) {
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
            <div>
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
            </div>
        </AsyncContent>
    );
}

export default MembersIndex;
