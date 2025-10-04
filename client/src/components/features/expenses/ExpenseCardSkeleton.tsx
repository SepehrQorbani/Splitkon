import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const ExpenseCardSkeleton: React.FC<
    React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
    return (
        <div
            className={cn(
                "relative bg-surface w-full p-4 rounded ring-1 ring-border space-y-4 shadow-sm",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2 py-3 w-full h-12">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 ms-auto items-end">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-8" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="size-6 rounded" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="w-24 h-6 rounded" />
                </div>
            </div>
            <div className="w-full flex items-center justify-between border-t border-border-subtle pt-4 mb-2 text-muted">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4" />
                    <Skeleton className="size-4" />
                </div>
                <Skeleton className="size-4" />
            </div>
        </div>
    );
};
