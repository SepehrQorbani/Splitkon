import { Drawer } from "@/components/common/Drawer";
import { ExpenseForm } from "@/components/features/expenses/ExpenseForm";
import MemberForm from "@/components/features/members/MemberForm";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import ShareForm from "@/components/features/share/ShareForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import {
    IconCashPlus,
    IconShare,
    IconTransform,
    IconUsersPlus,
} from "@tabler/icons-react";
import { MobileActionMenu } from "./MobileActionMenu";

type Props = {};

function ActionMenu({}: Props) {
    const { t } = useTranslations();
    const { canEdit } = usePermissions();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? (
        <div className="gap-2 flex">
            <Drawer
                triggerLabel={<IconShare className="w-4 h-4" />}
                title="اشتراک گذاری"
                children={({ close }) => <ShareForm />}
                buttonProps={{ intent: "neutral" }}
            />
            {canEdit && (
                <>
                    <Drawer
                        triggerLabel={<IconUsersPlus className="w-4 h-4" />}
                        title="افزودن اعضا"
                        children={({ close }) => (
                            <MemberForm onSubmitSuccess={close} />
                        )}
                        buttonProps={{ intent: "neutral" }}
                    />
                    <Drawer
                        triggerLabel={<IconTransform className="w-4 h-4" />}
                        title="بازپرداخت"
                        children={({ close }) => (
                            <RepaysForm onSubmitSuccess={close} />
                        )}
                        buttonProps={{ intent: "neutral" }}
                    />
                    <Drawer
                        triggerLabel={
                            <>
                                <IconCashPlus className="w-4 h-4" />
                                <span className="hidden md:inline">
                                    {t("ui.newExpense")}
                                </span>
                            </>
                        }
                        title="هزینه جدید"
                        children={({ close }) => (
                            <ExpenseForm onSubmitSuccess={close} />
                        )}
                    />
                </>
            )}
        </div>
    ) : (
        <MobileActionMenu />
    );
}

export default ActionMenu;
