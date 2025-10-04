import MembersFilter from "@/pages/members/filters";
import { Members } from "@/types";
import { memberFilterConfig } from "@/utils/filters/memberConfig";
import { useFilters } from "@/utils/filters/useFilters";
import MemberCard from "./MemberCard";

type Props = {
    members: Members;
};

function MembersCard({ members }: Props) {
    const { result, ...filterProps } = useFilters(
        members ?? [],
        memberFilterConfig
    );

    return (
        <div className="space-y-4">
            <MembersFilter {...filterProps} result={result} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.rows?.map((member) => (
                    <MemberCard key={member.id} member={member} />
                ))}
            </div>
        </div>
    );
}

export default MembersCard;
