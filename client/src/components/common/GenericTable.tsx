import { Card } from "@/components/common/Card";
import {
    Cell,
    Column,
    Row,
    Table,
    TableBody,
    TableHeader,
} from "react-aria-components";
import { useFilters } from "@/utils/filters/useFilters";
import {
    IconArrowsSort,
    IconSortAscending2,
    IconSortDescending2,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type GenericTableProps<T> = {
    items: T[];
    filterConfig: any;
    FilterComponent: React.ComponentType<any>;
    columns: {
        key: string;
        label: string | ReactNode;
        sortable?: boolean;
        thClassName?: string;
        className?: string;
        render: (item: T) => ReactNode;
    }[];
};

export function GenericTable<T>({
    items,
    filterConfig,
    FilterComponent,
    columns,
}: GenericTableProps<T>) {
    const { result, ...filterProps } = useFilters(items ?? [], filterConfig);
    const toggleSort = (field: string) => {
        const sortBy = filterProps.filters.sortBy;
        const sortDir = filterProps.filters.sortDir;

        if (field === sortBy) {
            const newDir =
                sortDir === "asc"
                    ? "desc"
                    : sortDir === "desc"
                    ? undefined
                    : "asc";
            newDir ? filterProps.setSort(field, newDir) : filterProps.setSort();
        } else {
            filterProps.setSort(field, "asc");
        }
    };

    return (
        <Card className="p-0 gap-0 overflow-clip">
            <div className="border-b border-border py-4 px-2 md:px-4">
                <FilterComponent {...filterProps} result={result} />
            </div>
            <div>
                <div className="max-h-[200px]- w-full overflow-auto text-nowrap scroll-pt-[2.321rem] relative text-action">
                    <Table className="border-spacing-0 w-full">
                        {/* <div className="max-h-[200px]- w-full overflow-auto text-nowrap scroll-pt-[2.321rem] relative text-action">
                        <Table
                            selectionMode="multiple"
                            className="border- border-spacing-0 w-full"
                        >
                            <TableHeader className="border-b border-border bg-background text-action">
                                <Column
                                    onClick={() => {
                                        toggleSort("name");
                                    }}
                                    isRowHeader
                                    className="sticky top-0 right-0 bg-background z-10 ps-12 py-2 font-light text-start whitespace-nowrap outline-hidden"
                                ></Column> */}
                        <TableHeader className="bg-background text-action">
                            {columns.map((col) => (
                                <Column
                                    key={col.key}
                                    onClick={() =>
                                        col.sortable && toggleSort(col.key)
                                    }
                                    isRowHeader
                                    className={cn(
                                        "sticky border-b border-border top-0 px-2 py-2 font-medium text-start text-xs whitespace-nowrap z-1 bg-background outline-hidden",
                                        col.thClassName
                                    )}
                                >
                                    <div className="inline-flex gap-2">
                                        {col.label}
                                        {col.sortable &&
                                            filterProps.filters.sortBy ===
                                                col.key &&
                                            (filterProps.filters.sortDir ===
                                            "asc" ? (
                                                <IconSortAscending2 className="size-4" />
                                            ) : (
                                                <IconSortDescending2 className="size-4" />
                                            ))}
                                        {col.sortable &&
                                            filterProps.filters.sortBy !==
                                                col.key && (
                                                <IconArrowsSort className="size-4 p-0.5" />
                                            )}
                                    </div>
                                </Column>
                            ))}
                        </TableHeader>

                        <TableBody className="space-y-3 text-xs">
                            {result.rows.map((item, idx) => (
                                <Row
                                    key={idx}
                                    className="bg-surface border-b last:border-b-0 border-border selected:bg-slate-600 selected:text-white cursor-default group outline-hidden"
                                >
                                    {columns.map((col) => (
                                        <Cell
                                            key={col.key}
                                            className={cn(
                                                "py-4 px-2 whitespace-nowrap",
                                                col.className
                                            )}
                                        >
                                            {col.render(item)}
                                        </Cell>
                                    ))}
                                </Row>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Card>
    );
}
