import React from "react";
import { cn } from "@/utils/cn";

interface LoadingWrapperProps {
    isLoading: boolean;
    children: React.ReactNode;
    t: (key: string) => string;
    className?: string;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
    isLoading,
    children,
    className,
}) => {
    const [content, loadingIndicator] = React.Children.toArray(children);

    if (isLoading) {
        return (
            <div className={cn("p-4 bg-background", className)}>
                {loadingIndicator || (
                    <div className="space-y-4">
                        <div className="h-9 w-1/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                    </div>
                )}
            </div>
        );
    }

    return <>{content}</>;
};
