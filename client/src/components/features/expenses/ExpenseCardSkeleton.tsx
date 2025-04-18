import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const ExpenseCardSkeleton: React.FC<
    React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
    return (
        <div
            className={cn(
                "relative bg-surface w-full pb-4 rounded ring-1 ring-border space-y-4 shadow-sm",
                className
            )}
            {...props}
        >
            <div className="w-full space-y-2 top-0 pt-4 px-3 pb-2">
                <div className="flex items-center justify-between border-b border-border py-2">
                    <div className="flex items-center gap-1 px-1">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-3 w-20 px-1" />
                </div>
                <div className="flex items-center justify-between px-1 pt-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            <div className="px-4 space-y-4">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};
