import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const MemberCardSkeleton: React.FC<
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
            <div className="flex items-center gap-2 py-3 w-full">
                <Skeleton className="w-8 h-8 rounded" />
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 ms-auto items-end">
                    <Skeleton className="h-4 w-20" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
            </div>

            <div className="border border-border-subtle rounded-md py-2 px-2 flex items-center gap-2 justify-between">
                <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-32" />
            </div>

            <div className="mt-6 space-y-1">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
            </div>
        </div>
    );
};
