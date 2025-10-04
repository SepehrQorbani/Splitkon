import { EntityFilterConfig } from "./filterTypes";
import { Member } from "@/types/schemas/members";

export const memberFilterConfig: EntityFilterConfig<Member> = {
    name: {
        get: (m) => m.name ?? "",
        type: "string",
        searchable: true,
        sortable: true,
    },
    bank_info: {
        get: (m) => m.bank_info ?? "",
        type: "string",
        searchable: true,
    },
    payment_balance: {
        get: (m) => Number(m.payment_balance ?? 0),
        type: "number",
        sortable: true,
        rangeable: true,
    },
    total_expenses: {
        get: (m) => Number(m.total_expenses ?? 0),
        type: "number",
        sortable: true,
        rangeable: true,
    },
    ratio: { get: (m) => Number(m.ratio ?? 0), type: "number", sortable: true },
    status: {
        get: (m) => m.status?.title,
        type: "string",
        sortable: true,
        facetable: true,
    },
};
