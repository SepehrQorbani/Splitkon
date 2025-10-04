// src/utils/filters/filterTypes.ts
export type FieldType = "string" | "number" | "date" | "boolean" | "enum";

// How to read a value (including computed) from a row
export type FieldDef<T> = {
    get: (row: T) => unknown; // can be computed
    type: FieldType;
    searchable?: boolean; // eligible for fuzzy search / contains
    facetable?: boolean; // eligible for facet counts and enum filter
    sortable?: boolean; // can sort by this field
    translate?: boolean;
    translationKeyPrefix?: string;
    rangeable?: boolean;
};

// Per-entity config: map field name → definition
export type EntityFilterConfig<T> = Record<string, FieldDef<T>>;

// URL / UI → generic filter state for the engine
export type FilterState = {
    q?: string; // fuzzy search text
    sortBy?: string; // field name
    sortDir?: "asc" | "desc"; // default asc
    enums?: Record<string, string[]>; // e.g. { role: ["1","2"], status:["debtor"] }
    ranges?: Record<string, { min?: number; max?: number }>;
    booleans?: Record<string, boolean>;
    dates?: Record<string, { from?: string; to?: string }>; // ISO strings
};

export type EngineResult<T> = {
    rows: T[];
    facets: Record<string, Record<string, number>>; // field → value → count
};

export type FuseOptionsLite = {
    threshold?: number; // 0 (strict) → 1 (loose)
    ignoreLocation?: boolean; // default true
};
