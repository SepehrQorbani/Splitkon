import { useGetRepays } from "@/api/queries/repays";
import AsyncContent from "@/components/common/AsyncContent";
import { Button, getButtonStyles } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import FiltersSkeleton from "@/components/common/filters/FiltersSkeleton";
import RepayCardStackItem from "@/components/common/RepayCardStackItem";
import TableSkeleton from "@/components/common/TableSkeleton";
import { RepayCardSkeleton } from "@/components/features/repays/RepayCardSkeleton";
import RepaysCard from "@/components/features/repays/RepaysCard";
import RepaysTable from "@/components/features/repays/RepaysTable";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore, useUIStore } from "@/store";
import { useModalStore } from "@/store/modals";
import { useRepayStore } from "@/store/repays";
import {
    IconHelpCircle,
    IconInfoCircle,
    IconSettings,
    IconTransfer,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router";

type Props = {};

function RepaysIndex({}: Props) {
    const { token } = useParams();
    const { repays, setRepays } = useRepayStore();
    const members = useMemberStore((state) => state.members);
    const { t } = useTranslations();
    const { can } = usePermissions();
    const view = useUIStore((state) => state.view);
    const { data, isLoading, error, refetch } = useGetRepays(token as string);
    const openModal = useModalStore((state) => state.openModal);

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
                view === "grid" ? (
                    <div>
                        <FiltersSkeleton />

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                    <RepayCardSkeleton key={index} />
                                ))}
                        </div>
                    </div>
                ) : (
                    <TableSkeleton />
                )
            }
        >
            {repays.length > 0 ? (
                <>
                    {view === "grid" ? (
                        <RepaysCard repays={repays} />
                    ) : (
                        <div>
                            <RepaysTable repays={repays} />
                        </div>
                    )}
                    {/* <RepayDetailModal /> */}
                </>
            ) : (
                <EmptyState
                    items={[
                        { id: 1, content: <RepayCardStackItem /> },
                        { id: 2, content: <RepayCardStackItem /> },
                        { id: 3, content: <RepayCardStackItem /> },
                    ]}
                    message=<div className="space-y-4 mt-4">
                        <p>{t("ui.noRepays")}</p>
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
                        members.length < 2 ? (
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
                        ) : (
                            can("addRepays") && (
                                <Button
                                    className="px-3 py-2 h-8 min-w-8 gap-1"
                                    onPress={() => {
                                        openModal("repay-form", true);
                                    }}
                                    isDisabled={members.length < 2}
                                >
                                    <IconTransfer className="size-4 mx-0.5" />
                                    <span className="text-xs ms-1">
                                        {t("ui.addPayment")}
                                    </span>
                                </Button>
                            )
                        )
                    }
                />
            )}
        </AsyncContent>
    );
}

export default RepaysIndex;
