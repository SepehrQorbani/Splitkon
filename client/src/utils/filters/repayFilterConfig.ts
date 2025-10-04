import { EntityFilterConfig } from "./filterTypes";
import { Repay } from "@/types/schemas/repays";

export const repayFilterConfig: EntityFilterConfig<Repay> = {
    amount: {
        type: "number",
        searchable: true,
        sortable: true,
        facetable: false,
        rangeable: true,
        get: (e) => e.amount,
    },
    date: {
        type: "date",
        searchable: false,
        sortable: true,
        facetable: false,
        rangeable: false,
        get: (e) => e.date,
    },
    from: {
        type: "string",
        searchable: true,
        sortable: true,
        facetable: false,
        rangeable: false,
        get: (e) => e.from.name,
    },
    to: {
        type: "string",
        searchable: true,
        sortable: true,
        facetable: true,
        rangeable: false,
        translate: false,
        get: (e) => e.to.name,
    },
    description: {
        type: "string",
        searchable: true,
        sortable: false,
        facetable: false,
        rangeable: false,
        get: (e) => e.description ?? "",
    },
};
