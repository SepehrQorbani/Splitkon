import { useGetRepays } from "@/api/queries/repays";
import AsyncContent from "@/components/common/AsyncContent";
import { CardStack } from "@/components/common/CardStack";
import { Drawer } from "@/components/common/Drawer";
import RepayCardStackItem from "@/components/common/RepayCardStackItem";
import HeroRepayCardStack from "@/components/features/home/HeroRepayCardStack";
import RepayCard from "@/components/features/repays/RepayCard";
import { RepayCardSkeleton } from "@/components/features/repays/RepayCardSkeleton";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useRepayStore } from "@/store/repays";
import { cn } from "@/utils/cn";
import { IconTransfer } from "@tabler/icons-react";
import { LayoutGroup } from "motion/react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { EmptyState } from "@/components/common/EmptyState";

type Props = {};

function RepaysIndex({}: Props) {
    const { token } = useParams();
    const { repays, setRepays } = useRepayStore();
    const { t } = useTranslations();
    const { can } = usePermissions();

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
            {repays?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LayoutGroup>
                        {repays?.map((repay) => (
                            <RepayCard key={repay.id} repay={repay} />
                        ))}
                    </LayoutGroup>
                </div>
            ) : (
                <EmptyState
                    items={[
                        { id: 1, content: <RepayCardStackItem /> },
                        { id: 2, content: <RepayCardStackItem /> },
                        { id: 3, content: <RepayCardStackItem /> },
                    ]}
                    message="لیست بازپرداختها خالی است!"
                    action={
                        can("addRepays") && (
                            <Drawer
                                buttonProps={{ className: "h-10 gap-2" }}
                                triggerLabel={
                                    <>
                                        <IconTransfer className="size-4 mx-0.5" />
                                        <span className=" text-sm ms-1">
                                            {t("ui.addPayment")}
                                        </span>
                                    </>
                                }
                                title={
                                    <div className="flex items-center gap-2">
                                        <IconTransfer className="size-4 mx-0.5" />
                                        <span className="text-sm">
                                            {t("ui.addPayment")}
                                        </span>
                                    </div>
                                }
                                children={({ close }) => (
                                    <RepaysForm onSubmitSuccess={close} />
                                )}
                            />
                        )
                    }
                />
            )}
        </AsyncContent>
    );
}

export default RepaysIndex;
