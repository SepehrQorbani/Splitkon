import { Button } from "@/components/common/Button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { useModalStore } from "@/store/modals";
import { IconCashPlus, IconShare, IconTransfer } from "@tabler/icons-react";
import React from "react";
import { ActionButton } from "./ActionMenuButtons";
import { GroupBottomNavbar } from "./GroupBottomNavbar";

const actionButtons: ActionButton[] = [
    {
        id: "share",
        icon: <IconShare className="size-4 shrink-0" />,
        title: "ui.share",
        showLabel: false,
    },
    {
        id: "repay-form",
        icon: <IconTransfer className="size-4 shrink-0" />,
        title: "ui.addPayment",
        permission: "addRepays",
        showLabel: true,
        canDisabled: true,
    },
    {
        id: "expense-form",
        icon: <IconCashPlus className="size-4 shrink-0" />,
        title: "ui.newExpense",
        permission: "addExpenses",
        showLabel: true,
        canDisabled: true,
    },
];

const ActionMenu: React.FC = () => {
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { t } = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    if (!isDesktop) {
        return <GroupBottomNavbar actionButtons={actionButtons} />;
    }

    return (
        <div className="gap-2 flex shrink-0">
            {actionButtons.map(
                ({ id, permission, canDisabled, icon, showLabel, title }) =>
                    (can(permission) || permission === undefined) && (
                        <Button
                            key={id}
                            className={
                                showLabel
                                    ? "px-3 py-2 h-8 min-w-8 gap-1"
                                    : "p-2 size-8"
                            }
                            onPress={() => {
                                openModal(id, true);
                            }}
                            isDisabled={canDisabled && members?.length < 2}
                        >
                            {icon}
                            {showLabel && (
                                <span className="hidden md:inline text-xs">
                                    {t(title)}
                                </span>
                            )}
                        </Button>
                    )
            )}
        </div>
    );
};

export default ActionMenu;
