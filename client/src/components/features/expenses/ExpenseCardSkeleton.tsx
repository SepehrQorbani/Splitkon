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
            <div className="flex items-center justify-between border-border pt-6 px-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="size-6" />
            </div>
            <div className="flex items-center justify-between px-4 pb-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
            </div>

            <div className="flex items-center justify-between text-xs px-4">
                <div className="flex items-center gap-1">
                    <Skeleton className="size-6 border border-surface rounded-full" />
                    <Skeleton className="size-6 border border-surface rounded-full -ms-4" />
                    <Skeleton className="size-6 border border-surface rounded-full -ms-4" />
                    <Skeleton className="size-6 border border-surface rounded-full -ms-4" />
                </div>
                <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <div className="flex items-center justify-center mt-2">
                <Skeleton className="h-2 w-8" />
            </div>
        </div>
    );
};
