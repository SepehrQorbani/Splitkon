import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const RepayCardSkeleton: React.FC<
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
            <div className="flex items-center justify-between py-2 w-full h-8">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
            </div>

            <div className="space-y-3">
                <div className="relative w-full flex justify-between items-center px-2 pt-2 my-2">
                    <div className="absolute left-3 right-3 top-0 bottom-0 border rounded border-b-0 border-dashed border-border h-5"></div>
                    <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative"></span>
                    <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative"></span>
                </div>
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded" />
                        <Skeleton className="h-3 w-20" />
                    </div>

                    <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="w-6 h-6 rounded" />
                    </div>
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
        // <div
        //     className={cn(
        //         "relative bg-surface w-full pb-4 rounded ring-1 ring-border space-y-4 shadow-sm",
        //         className
        //     )}
        //     {...props}
        // >
        //     <div className="w-full flex flex-col justify-between h-full pt-4 px-3">
        //         <div className="flex items-center justify-between border-border py-2 px-1">
        //             <div className="space-y-4">
        //                 <Skeleton className="h-4 w-32" />
        //                 <Skeleton className="h-3 w-16" />
        //             </div>
        //             <Skeleton className="size-6" />
        //         </div>
        //         <div className="relative w-full flex justify-between items-center px-2 pt-2 my-2">
        //             <div className="absolute left-3 right-3 top-0 bottom-0 border rounded border-b-0 border-dashed border-border h-5"></div>
        //             <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative"></span>
        //             <span className="rounded-xs size-2 border border-border shrink-0 bg-surface relative"></span>
        //         </div>
        //         <div className="flex items-center justify-between px-1">
        //             <div className="flex items-center gap-2">
        //                 <Skeleton className="w-6 h-6 rounded" />
        //                 <Skeleton className="h-3 w-20" />
        //             </div>

        //             <div className="flex items-center gap-2">
        //                 <Skeleton className="h-3 w-20" />
        //                 <Skeleton className="w-6 h-6 rounded" />
        //             </div>
        //         </div>
        //         <div className="flex items-center justify-center mt-2">
        //             <Skeleton className="h-2 w-8" />
        //         </div>
        //     </div>
        // </div>
    );
};
