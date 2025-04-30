import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/cn";

export const DashboardSkeleton: React.FC<
    React.HTMLAttributes<HTMLDivElement>
> = ({ className, ...props }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 w-full h-full">
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-80 w-full rounded" />
                <Skeleton className="h-80 w-full rounded" />
                <Skeleton className="h-80 w-full rounded md:col-span-2" />
            </div>
            <Skeleton className="h-80 w-full rounded col-span-2 lg:col-span-1 lg:h-full mt-4 md:mt-0" />
        </div>
    );
};
