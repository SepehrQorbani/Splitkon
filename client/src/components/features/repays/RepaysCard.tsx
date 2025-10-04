import RepaysFilter from "@/pages/repays/filters";
import { Repay } from "@/types/schemas/repays";
import { repayFilterConfig } from "@/utils/filters/repayFilterConfig";
import { useFilters } from "@/utils/filters/useFilters";
import { LayoutGroup } from "motion/react";
import RepayCard from "./RepayCard";

type Props = { repays: Repay[] };

function RepaysCard({ repays }: Props) {
    const { result, ...filterProps } = useFilters(
        repays ?? [],
        repayFilterConfig
    );
    return (
        <div className="space-y-4">
            <RepaysFilter {...filterProps} result={result} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LayoutGroup>
                    {result.rows?.map((repay) => (
                        <RepayCard key={repay.id} repay={repay} />
                    ))}
                </LayoutGroup>
            </div>
        </div>
    );
}

export default RepaysCard;
