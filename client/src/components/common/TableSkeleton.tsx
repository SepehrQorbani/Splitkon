import React from "react";
import { Card } from "./Card";
import FiltersSkeleton from "./filters/FiltersSkeleton";
import { Skeleton } from "./Skeleton";

function TableSkeleton() {
    return (
        <Card className="p-0 gap-0 overflow-clip relative">
            <div className="border-b border-border py-4 px-2 md:px-4">
                <FiltersSkeleton />
            </div>
            <div className="">
                <div className="bg-background w-full border-b border-border h-8"></div>
                <div className="w-full border-b border-border p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="w-full border-b border-border p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="w-full border-b border-border p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="w-full border-b border-border p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="w-full border-b border-border p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="w-full border-b border-border p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="w-full p-4">
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="h-2/3 w-full absolute bottom-0 bg-gradient-to-t from-background"></div>
            </div>
        </Card>
    );
}

export default TableSkeleton;
