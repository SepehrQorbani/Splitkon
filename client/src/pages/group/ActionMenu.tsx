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
import { ReactNode } from "react";

interface ActionDrawerProps {
    icon: ReactNode;
    title: string;
    children: (props: { close: () => void }) => ReactNode;
    showLabel?: boolean;
}

const ActionDrawer: React.FC<ActionDrawerProps> = ({
    icon,
    title,
    children,
    showLabel = false,
}) => {
    const { t } = useTranslations();

    return (
        <Drawer
            triggerLabel={
                <>
                    {icon}
                    {showLabel && (
                        <span className="hidden md:inline text-sm ms-1">
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
            children={children}
            buttonProps={{ intent: "neutral", className: "p-2" }}
        />
    );
};

const ActionMenu: React.FC = () => {
    const { t } = useTranslations();
    const { canEdit } = usePermissions();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const actionButtons = [
        {
            id: "share",
            icon: <IconShare className="size-4 mx-0.5" />,
            title: "ui.share",
            component: ShareForm,
            show: true,
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
            icon: <IconTransform className="size-4 mx-0.5" />,
            title: "ui.addPayment",
            component: RepaysForm,
            show: canEdit,
            showLabel: true,
        },
        {
            id: "newExpense",
            icon: <IconCashPlus className="size-4 mx-0.5" />,
            title: "ui.newExpense",
            component: ExpenseForm,
            show: canEdit,
            showLabel: true,
        },
    ];

    if (!isDesktop) {
        return <MobileActionMenu />;
    }

    return (
        <div className="gap-2 flex shrink-0">
            {actionButtons.map(
                ({ id, icon, title, component: Component, show, showLabel }) =>
                    show && (
                        <ActionDrawer
                            key={id}
                            icon={icon}
                            title={title}
                            showLabel={showLabel}
                            children={({ close }) => (
                                <Component onSubmitSuccess={close} />
                            )}
                        />
                    )
            )}
        </div>
    );
};

export default ActionMenu;
