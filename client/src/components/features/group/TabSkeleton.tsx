import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const TabSkeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => {
    return (
        <div
            className={cn("flex gap-2 border-b border-border py-1", className)}
            {...props}
        >
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-t-md" />
            ))}
        </div>
    );
};
