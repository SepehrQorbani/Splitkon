import { Button } from "@/components/common/Button";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { useModalStore } from "@/store/modals";
import { PermissionKey } from "@/types";
import { cn } from "@/utils/cn";
import { IconPlus } from "@tabler/icons-react";
import React, { ReactElement, useMemo, useState } from "react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";

export interface ActionButton {
    id: string;
    icon: ReactElement;
    title: string;
    showLabel: boolean;
    permission?: PermissionKey;
    canDisabled?: boolean;
}

interface ActionButtonsProps {
    actions: ActionButton[];
    onActionSelect: () => void;
}

const useAvailableActions = (actions: ActionButton[]) => {
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);

    return useMemo(
        () =>
            actions.filter(
                (a) =>
                    (a.permission ? can(a.permission) : true) &&
                    (!a.canDisabled || (members && members.length >= 2))
            ),
        [actions, can, members]
    );
};

const RenderActionButtons: React.FC<ActionButtonsProps> = ({
    actions,
    onActionSelect,
}) => {
    const { t } = useTranslations();
    const availableActions = useAvailableActions(actions);
    const openModal = useModalStore((state) => state.openModal);

    return (
        <div className="flex flex-col gap-2">
            {availableActions.map(({ id, icon, title }) => (
                <Button
                    key={id}
                    className="justify-between gap-3 text-xs font-light py-3"
                    intent="neutral"
                    onPress={() => {
                        openModal(id, true);
                        onActionSelect();
                    }}
                >
                    {icon}
                    {t(title)}
                </Button>
            ))}
        </div>
    );
};

interface ActionMenuButtonsProps {
    actions: ActionButton[];
}

const ActionMenuButtons: React.FC<ActionMenuButtonsProps> = ({ actions }) => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);

    return (
        <DialogTrigger>
            <Button
                onPress={() => setPopoverOpen((prev) => !prev)}
                size="icon"
                className="p-0 my-2 size-10 mx-2"
            >
                <IconPlus
                    className={cn(
                        "size-4 transition-all origin-center rotate-0",
                        isPopoverOpen && "rotate-45"
                    )}
                />
            </Button>

            <Popover
                isOpen={isPopoverOpen}
                onOpenChange={setPopoverOpen}
                className="data-[entering]:animate-slide-up-in data-[exiting]:animate-slide-down-out bg-surface shadow border border-border rounded p-2"
            >
                <Dialog>
                    <RenderActionButtons
                        actions={actions}
                        onActionSelect={() => {
                            setPopoverOpen(false);
                        }}
                    />
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
};

export default ActionMenuButtons;
