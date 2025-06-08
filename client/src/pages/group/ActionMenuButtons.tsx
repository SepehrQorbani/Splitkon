import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { cn } from "@/utils/cn";
import { IconPlus } from "@tabler/icons-react";
import React, { ReactElement, useState } from "react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";

export interface ActionButton {
    id: string;
    icon: ReactElement;
    title: string;
    component: React.ComponentType<{
        onSubmitSuccess?: () => void;
    }>;
    showLabel: boolean;
    permission?: string;
    canDisabled?: boolean;
}

interface ActionButtonsProps {
    actions: ActionButton[];
    onActionSelect: (actionId: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    actions,
    onActionSelect,
}) => {
    const { t } = useTranslations();
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);

    return (
        <div className="flex flex-col gap-2">
            {actions.map(
                ({ id, icon, title, permission, canDisabled }) =>
                    (can(permission) || permission === undefined) && (
                        <Button
                            key={id}
                            className="justify-between gap-3 text-xs font-light py-3"
                            intent="neutral"
                            onPress={() => onActionSelect(id)}
                            isDisabled={canDisabled && members?.length < 2}
                        >
                            {icon}
                            {t(title)}
                        </Button>
                    )
            )}
        </div>
    );
};

interface ActionMenuButtonProps {
    actions: ActionButton[];
}

function ActionMenuButtons({ actions }: ActionMenuButtonProps) {
    const [isOpen, setOpen] = useState(false);
    const [selectedActionId, setSelectedActionId] = useState<string>("");
    const { t } = useTranslations();

    const selectedAction = selectedActionId
        ? actions.find((a) => a.id === selectedActionId)
        : null;
    const ActionComponent = selectedAction?.component;

    return (
        <DialogTrigger>
            <Button
                onPress={() => setOpen((v) => !v)}
                size="icon"
                className="p-0 my-2 size-10 mx-2"
            >
                <IconPlus
                    className={cn(
                        "size-4 transition-all origin-center rotate-0",
                        (selectedActionId !== "" || isOpen) && "rotate-45"
                    )}
                />
            </Button>
            <Drawer
                title={
                    selectedAction && (
                        <div className="flex items-center gap-2">
                            {selectedAction.icon}
                            <span className="text-sm">
                                {t(selectedAction.title)}
                            </span>
                        </div>
                    )
                }
                children={({ close }) =>
                    ActionComponent && (
                        <ActionComponent onSubmitSuccess={close} />
                    )
                }
                buttonProps={{
                    intent: "neutral",
                    variant: "ghost",
                    className: "focus:ring-0 focus:ring-offset-0",
                }}
                onOpenChange={(v) =>
                    v ? setOpen(false) : setSelectedActionId("")
                }
                open={selectedActionId !== ""}
            />

            <Popover
                isOpen={isOpen}
                onOpenChange={setOpen}
                className="data-[entering]:animate-slide-up-in data-[exiting]:animate-slide-down-out bg-surface shadow border border-border rounded p-2"
            >
                <Dialog>
                    <ActionButtons
                        actions={actions}
                        onActionSelect={setSelectedActionId}
                    />
                </Dialog>
            </Popover>
        </DialogTrigger>
    );
}

export default ActionMenuButtons;
