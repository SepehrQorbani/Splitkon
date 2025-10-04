import { useUIStore } from "@/store";
import { Skeleton } from "../Skeleton";

function FiltersSkeleton() {
    return (
        <div className="flex flex-wrap items-center w-full gap-2 justify-between">
            <div className="flex-1 md:flex-none w-full md:w-1/2 md:pe-2 lg:w-1/3 lg:pe-2">
                <Skeleton className="w-full h-10 " />
            </div>
            <Skeleton className="h-10 w-10 sm:w-24 shrink-0" />
        </div>
    );
}

export default FiltersSkeleton;
