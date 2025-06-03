import { Drawer } from "@/components/common/Drawer";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
import { useMemberStore } from "@/store";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface MobileActionDrawerProps {
    icon: ReactNode;
    title: string;
    children: (props: { close: () => void }) => ReactNode;
    isDisabled?: boolean;
}

const MobileActionDrawer: React.FC<MobileActionDrawerProps> = ({
    icon,
    title,
    children,
    isDisabled = false,
}) => {
    const { t } = useTranslations();

    return (
        <Drawer
            triggerLabel={
                <div
                    className={cn(
                        "flex flex-col items-center gap-1",
                        isDisabled && "text-muted-soft"
                    )}
                >
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
            isDisabled={isDisabled}
            buttonProps={{
                intent: "neutral",
                variant: "ghost",
                className: "focus:ring-0 focus:ring-offset-0",
            }}
        />
    );
};

type MobileActionMenuProps = {
    actionButtons: {
        id: string;
        icon: ReactNode;
        title: string;
        component: React.ComponentType<{
            onSubmitSuccess?: () => void;
        }>;
        showLabel: boolean;
        permission?: string;
        canDisabled?: boolean;
    }[];
};
export const MobileActionMenu = ({ actionButtons }: MobileActionMenuProps) => {
    const { can } = usePermissions();
    const members = useMemberStore((state) => state.members);

    return (
        <div className="flex fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-2 justify-around md:hidden z-99999">
            {actionButtons.map(
                ({
                    id,
                    component: Component,
                    canDisabled,
                    permission,
                    ...props
                }) =>
                    (can(permission) || permission === undefined) && (
                        <MobileActionDrawer
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
