import { Button } from "@/components/common/Button";
import { Drawer } from "@/components/common/Drawer";
import { useModalState } from "@/hooks/useModalState";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { PermissionKey } from "@/types";
import { cn } from "@/utils/cn";
import { IconPlus } from "@tabler/icons-react";
import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { Dialog, DialogTrigger, Popover } from "react-aria-components";
import { useSearchParams } from "react-router";

export interface ActionButton {
    id: string;
    icon: ReactElement;
    title: string;
    component: React.ComponentType<{ onSubmitSuccess?: () => void }>;
    showLabel: boolean;
    permission?: PermissionKey;
    canDisabled?: boolean;
}

interface ActionButtonsProps {
    actions: ActionButton[];
    onActionSelect: (actionId: string) => void;
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

    return (
        <div className="flex flex-col gap-2">
            {availableActions.map(({ id, icon, title }) => (
                <Button
                    key={id}
                    className="justify-between gap-3 text-xs font-light py-3"
                    intent="neutral"
                    onPress={() => onActionSelect(id)}
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
    const { t } = useTranslations();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [activeAction, setActiveAction] = useState<ActionButton | null>(null);

    useEffect(() => {
        const openId = searchParams.get("modal");
        const action =
            (openId ? actions.find((a) => a.id === openId) : null) ?? null;
        setActiveAction(action);
    }, [searchParams, actions]);

    const openAction = (id: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("modal", id);
            return next;
        });
        setActiveAction(() => actions.find((a) => a.id === id) || null);
        setPopoverOpen(false);
    };

    const closeAction = () => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("modal");
            return next;
        });
        setActiveAction(null);
    };

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
                        (activeAction !== null || isPopoverOpen) && "rotate-45"
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
                        onActionSelect={openAction}
                    />
                </Dialog>
            </Popover>

            <Drawer
                id={activeAction?.id || ""}
                title={
                    activeAction && (
                        <div className="flex items-center gap-2">
                            {activeAction.icon}
                            <span className="text-sm">
                                {t(activeAction.title)}
                            </span>
                        </div>
                    )
                }
                children={({ close }) =>
                    activeAction && (
                        <activeAction.component onSubmitSuccess={close} />
                    )
                }
                buttonProps={{
                    intent: "neutral",
                    variant: "ghost",
                    className: "focus:ring-0 focus:ring-offset-0",
                }}
                // onOpenChange={(v) => !v && setActiveAction(null)}
                isOpen={!!activeAction}
                onClose={closeAction}
            />
        </DialogTrigger>
    );
};

export default ActionMenuButtons;
