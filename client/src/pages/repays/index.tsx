import { useGetRepays } from "@/api/queries/repays";
import AsyncContent from "@/components/common/AsyncContent";
import RepayCard from "@/components/features/repays/RepayCard";
import { RepayCardSkeleton } from "@/components/features/repays/RepayCardSkeleton";
import { useRepayStore } from "@/store/repays";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { useParams } from "react-router";

type Props = {};

function RepaysIndex({}: Props) {
    const { token } = useParams();
    const { repays, setRepays } = useRepayStore();

    const { data, isLoading, error, refetch } = useGetRepays(token as string);

    useEffect(() => {
        if (data) {
            setRepays(data.data);
        }
    }, [data, setRepays]);

    return (
        <AsyncContent
            isLoading={isLoading}
            error={error}
            refetch={refetch}
            skeleton={
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6)
                            .fill(0)
                            .map((_, index) => (
                                <RepayCardSkeleton key={index} />
                            ))}
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repays && repays.length > 0 && (
                    <LayoutGroup>
                        {repays?.map((repay) => (
                            <RepayCard key={repay.id} repay={repay} />
                        ))}
                    </LayoutGroup>
                )}
            </div>
        </AsyncContent>
    );
}

export default RepaysIndex;
