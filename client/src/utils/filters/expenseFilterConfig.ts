import { Expense } from "@/types/schemas/expenses";
import { EntityFilterConfig } from "./filterTypes";

export const expenseFilterConfig: EntityFilterConfig<Expense> = {
    title: {
        type: "string",
        searchable: true,
        sortable: true,
        facetable: false,
        rangeable: false,
        get: (e) => e.title,
    },
    amount: {
        type: "number",
        searchable: false,
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
    spender: {
        type: "string",
        searchable: true,
        sortable: true,
        facetable: true,
        rangeable: false,
        translate: false,
        get: (e) => e.spender.name,
    },
    split: {
        type: "number",
        searchable: false,
        sortable: true,
        facetable: false,
        rangeable: true,
        get: (e) => e.split,
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
