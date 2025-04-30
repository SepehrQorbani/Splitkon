import { Drawer } from "@/components/common/Drawer";
import { ExpenseForm } from "@/components/features/expenses/ExpenseForm";
import MemberForm from "@/components/features/members/MemberForm";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import ShareForm from "@/components/features/share/ShareForm";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconCashPlus,
    IconShare,
    IconTransform,
    IconUsersPlus,
} from "@tabler/icons-react";

export const MobileActionMenu: React.FC = () => {
    const { canEdit } = usePermissions();
    const { t } = useTranslations();

    return (
        <div className="flex fixed bottom-0 left-0 right-0 bg-surface border-t border-border py-0.5 px-2 justify-around md:hidden z-99999">
            <Drawer
                triggerLabel={
                    <div className="flex flex-col items-center">
                        <IconShare className="size-6 p-1 transition-all rounded-full group-data-[is-open=true]:bg-action group-data-[is-open=true]:text-action-fg" />
                        <span className="text-xs font-light group-data-[is-open=true]:font-medium">
                            {t("ui.share")}
                        </span>
                    </div>
                }
                title={t("ui.share")}
                children={({ close }) => <ShareForm />}
                buttonProps={{ intent: "neutral", variant: "ghost" }}
            />
            {canEdit && (
                <>
                    <Drawer
                        triggerLabel={
                            <div className="flex flex-col items-center">
                                <IconUsersPlus className="size-6 p-1 transition-all rounded-full group-data-[is-open=true]:bg-action group-data-[is-open=true]:text-action-fg" />
                                <span className="text-xs font-light group-data-[is-open=true]:font-medium">
                                    {t("ui.addMember")}
                                </span>
                            </div>
                        }
                        title={t("ui.addMember")}
                        children={({ close }) => (
                            <MemberForm onSubmitSuccess={close} />
                        )}
                        buttonProps={{
                            intent: "neutral",
                            variant: "ghost",
                        }}
                    />
                    <Drawer
                        triggerLabel={
                            <div className="flex flex-col items-center">
                                <IconTransform className="size-6 p-1 transition-all rounded-full group-data-[is-open=true]:bg-action group-data-[is-open=true]:text-action-fg" />
                                <span className="text-xs font-light group-data-[is-open=true]:font-medium">
                                    {t("ui.addPayment")}
                                </span>
                            </div>
                        }
                        title={
                            <div className="flex items-center gap-2">
                                <IconTransform className="size-4" />
                                <span className="text-sm">
                                    {t("ui.addPayment")}
                                </span>
                            </div>
                        }
                        children={({ close }) => (
                            <RepaysForm onSubmitSuccess={close} />
                        )}
                        buttonProps={{
                            intent: "neutral",
                            variant: "ghost",
                        }}
                    />
                    <Drawer
                        triggerLabel={
                            <div className="flex flex-col items-center">
                                <IconCashPlus className="size-6 p-1 transition-all rounded-full group-data-[is-open=true]:bg-action group-data-[is-open=true]:text-action-fg" />
                                <span className="text-xs font-light group-data-[is-open=true]:font-medium">
                                    {t("ui.newExpense")}
                                </span>
                            </div>
                        }
                        title={
                            <div className="flex items-center gap-2">
                                <IconCashPlus className="size-4" />
                                <span className="text-sm">
                                    {t("ui.newExpense")}
                                </span>
                            </div>
                        }
                        children={({ close }) => (
                            <ExpenseForm onSubmitSuccess={close} />
                        )}
                        buttonProps={{
                            intent: "neutral",
                            variant: "ghost",
                        }}
                    />
                </>
            )}
        </div>
    );
};
