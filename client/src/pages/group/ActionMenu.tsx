import { Drawer } from "@/components/common/Drawer";
import { ExpenseForm } from "@/components/features/expenses/ExpenseForm";
import { RepaysForm } from "@/components/features/repays/RepayForm";
import ShareForm from "@/components/features/share/ShareForm";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { IconCashPlus, IconShare, IconTransfer } from "@tabler/icons-react";
import React, { ReactNode } from "react";
import { GroupBottomNavbar } from "./GroupBottomNavbar";

interface ActionDrawerProps {
    icon: ReactNode;
    title: string;
    children: (props: { close: () => void }) => ReactNode;
    showLabel?: boolean;
    isDisabled?: boolean;
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
    icon,
    title,
    children,
    isDisabled = false,
    showLabel = false,
}) => {
    const { t } = useTranslations();

    return (
        <Drawer
            triggerLabel={
                <>
                    {icon}
                    {showLabel && (
                        <span className="hidden md:inline text-xs">
                            {t(title)}
                        </span>
                    )}
                </>
            }
            title={
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="text-sm">{t(title)}</span>
                </div>
            }
            isDisabled={isDisabled}
            children={children}
            buttonProps={
                showLabel
                    ? {
                          className: "px-3 py-2 h-8 min-w-8 gap-1",
                      }
                    : { className: "p-2 size-8" }
            }
        />
    );
};

const actionButtons = [
    {
        id: "share",
        icon: <IconShare className="size-4 shrink-0" />,
        title: "ui.share",
        component: ShareForm,
        showLabel: false,
    },
    // {
    //     id: "addMember",
    //     icon: <IconUsersPlus className="size-4 mx-0.5" />,
    //     title: "ui.addMember",
    //     component: MemberForm,
    //     show: canEdit,
    //     showLabel: false,
    // },
    {
        id: "addPayment",
        icon: <IconTransfer className="size-4 shrink-0" />,
        title: "ui.addPayment",
        component: RepaysForm,
        permission: "addRepays",
        showLabel: true,
        canDisabled: true,
    },
    {
        id: "newExpense",
        icon: <IconCashPlus className="size-4 shrink-0" />,
        title: "ui.newExpense",
        component: ExpenseForm,
        permission: "addExpenses",
        showLabel: true,
        canDisabled: true,
    },
];

const ActionMenu: React.FC = () => {
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (!isDesktop) {
        return <GroupBottomNavbar actionButtons={actionButtons} />;
    }

    return (
        <div className="gap-2 flex shrink-0">
            {actionButtons.map(
                ({
                    id,
                    component: Component,
                    permission,
                    canDisabled,
                    ...props
                }) =>
                    (can(permission) || permission === undefined) && (
                        <ActionDrawer
                            key={id}
                            children={({ close }) => (
                                <Component onSubmitSuccess={close} />
                            )}
                            isDisabled={canDisabled && members?.length < 2}
                            {...props}
                        />
                    )
            )}
        </div>
    );
};

export default ActionMenu;
