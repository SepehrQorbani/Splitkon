import { getRepays } from "@/api/endpoints/repays";
import { AsyncContent } from "@/components/common/AsyncContent";
import RepayCard from "@/components/features/repays/RepayCard";
import { RepayCardSkeleton } from "@/components/features/repays/RepayCardSkeleton";
import { useRepayStore } from "@/store/repays";
import { useQuery } from "@tanstack/react-query";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { useParams } from "react-router";

type Props = {};

function RepaysIndex({}: Props) {
    const { token } = useParams();
    const { repays, setRepays } = useRepayStore();

    const { data, isLoading, error } = useQuery({
        queryKey: ["repays", token],
        queryFn: () => getRepays(token as string),
    });

    useEffect(() => {
        if (data) {
            setRepays(data.data);
        }
    }, [data, setRepays]);

    return (
        <AsyncContent
            isLoading={isLoading}
            error={error}
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
            loadingMessage="در حال بارگذاری بازپرداخت‌ها..."
            errorMessage="خطا در دریافت بازپرداخت‌ها"
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
