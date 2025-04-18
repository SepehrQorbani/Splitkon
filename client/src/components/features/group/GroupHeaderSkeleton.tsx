import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const GroupHeaderSkeleton: React.FC<
    React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
    return (
        <div
            className={cn("flex items-start justify-between h-12", className)}
            {...props}
        >
            <div className="flex gap-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-md" />
                ))}
            </div>
        </div>
    );
};
