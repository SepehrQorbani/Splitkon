import { ReactNode } from "react";
import { CardStack } from "./CardStack";

type EmptyStateProps = {
    items: { id: number; content: ReactNode }[];
    message: string | ReactNode;
    action?: ReactNode;
};

export function EmptyState({ items, message, action }: EmptyStateProps) {
    return (
        <div className="relative w-full min-h-[50vh] flex flex-col items-center justify-center">
            <CardStack
                items={items}
                duration={5000}
                offset={4}
                direction="top"
                className="h-[72px] -mt-6"
            />

            <div className="relative z-10 bottom-4 pt-4 bg-linear-0 from-background to-background/0 from-70% flex flex-col justify-end gap-4">
                <div className="text-center text-muted">{message}</div>
                {action}
            </div>
        </div>
    );
}
