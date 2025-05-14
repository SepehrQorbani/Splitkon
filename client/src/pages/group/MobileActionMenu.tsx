import { Drawer } from "@/components/common/Drawer";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslations } from "@/hooks/useTranslations";
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
    }[];
};
export const MobileActionMenu = ({ actionButtons }: MobileActionMenuProps) => {
    const { can } = usePermissions();

    return (
        <div className="flex fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-2 justify-around md:hidden z-99999">
            {actionButtons.map(
                ({ id, icon, title, component: Component, permission }) =>
                    (can(permission) || permission === undefined) && (
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
