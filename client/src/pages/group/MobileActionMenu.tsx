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
import { ReactNode } from "react";

interface MobileActionDrawerProps {
    icon: ReactNode;
    title: string;
    children: (props: { close: () => void }) => ReactNode;
}

const MobileActionDrawer: React.FC<MobileActionDrawerProps> = ({
    icon,
    title,
    children,
}) => {
    const { t } = useTranslations();

    return (
        <Drawer
            triggerLabel={
                <div className="flex flex-col items-center gap-1">
                    <div className="size-7 flex items-center justify-center transition-all rounded group-data-[is-open=true]:bg-action group-data-[is-open=true]:text-action-fg">
                        {icon}
                    </div>
                    <span className="text-xs font-light group-data-[is-open=true]:font-medium">
                        {t(title)}
                    </span>
                </div>
            }
            title={
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm">{t(title)}</span>
                </div>
            }
            children={children}
            buttonProps={{
                intent: "neutral",
                variant: "ghost",
                className: "focus:ring-0 focus:ring-offset-0",
            }}
        />
    );
};

export const MobileActionMenu: React.FC = () => {
    const { canEdit } = usePermissions();
    const { t } = useTranslations();

    const actionButtons = [
        // {
        //     id: "addMember",
        //     icon: <IconUsersPlus className="size-4" />,
        //     title: "ui.addMember",
        //     component: MemberForm,
        //     show: canEdit,
        // },
        {
            id: "addPayment",
            icon: <IconTransform className="size-4" />,
            title: "ui.addPayment",
            component: RepaysForm,
            show: canEdit,
        },
        {
            id: "newExpense",
            icon: <IconCashPlus className="size-4" />,
            title: "ui.newExpense",
            component: ExpenseForm,
            show: canEdit,
        },
        {
            id: "share",
            icon: <IconShare className="size-4" />,
            title: "ui.share",
            component: ShareForm,
            show: true,
        },
    ];

    return (
        <div className="flex fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-2 justify-around md:hidden z-99999">
            {actionButtons.map(
                ({ id, icon, title, component: Component, show }) =>
                    show && (
                        <MobileActionDrawer
                            key={id}
                            icon={icon}
                            title={title}
                            children={({ close }) => (
                                <Component onSubmitSuccess={close} />
                            )}
                        />
                    )
            )}
        </div>
    );
};
