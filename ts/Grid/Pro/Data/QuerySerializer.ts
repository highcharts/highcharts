/* *
 *
 *  Grid Query Serializer
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Types
 *
 * */

export interface QueryFingerprintInput {
    sorting: {
        modifier?: {
            options?: unknown;
        };
    };
    filtering: {
        modifier?: {
            options?: unknown;
        };
    };
    pagination: {
        enabled: boolean;
        currentPage: number;
        currentPageSize: number;
    };
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Creates a deterministic fingerprint of the current query state.
 *
 * @param input
 * Minimal query-like object (duck-typed) containing sorting, filtering and
 * pagination state.
 */
export function createQueryFingerprint(input: QueryFingerprintInput): string {
    const sortingOptions = input.sorting.modifier?.options || null;
    const filteringOptions = input.filtering.modifier?.options || null;
    const paginationOptions = {
        enabled: input.pagination.enabled,
        currentPage: input.pagination.currentPage,
        currentPageSize: input.pagination.currentPageSize
    };

    const sortingPart = serializeValue(sortingOptions);
    const paginationPart = serializeValue(paginationOptions);
    const filteringPart = serializeValue(filteringOptions);

    const raw = `s=${sortingPart}|p=${paginationPart}|f=${filteringPart}`;

    return hashString(raw);
}

/**
 * Serializes function identity deterministically (name + hash of source).
 *
 * @param fn
 * Function to serialize.
 */
function serializeFunction(fn: unknown): string {
    if (typeof fn !== 'function') {
        return '';
    }
    let src = '';
    try {
        src = Function.prototype.toString.call(fn as Function);
    } catch {
        src = '';
    }
    return `fn:${(fn as Function).name || ''}:${hashString(src)}`;
}

/**
 * Serializes a filter condition into a deterministic string.
 *
 * @param condition
 * Filter condition (serializable object, callback, or primitive).
 */
export function serializeFilterCondition(condition: unknown): string {
    if (!condition) {
        return '';
    }

    if (typeof condition === 'function') {
        return serializeFunction(condition);
    }

    if (typeof condition !== 'object') {
        return serializeValue(condition);
    }

    const c = condition as Record<string, unknown>;
    const op = String(c.operator || '');

    if (op === 'and' || op === 'or') {
        const subs = Array.isArray(c.conditions) ? c.conditions : [];
        const parts = subs
            .map((sub): string => serializeFilterCondition(sub))
            .sort(); // Commutative -> stable
        return `${op}(${parts.join(',')})`;
    }

    if (op === 'not') {
        return `not(${serializeFilterCondition(c.condition)})`;
    }

    const col = serializeValue(c.columnId);
    const val = serializeValue(c.value);
    const ignoreCase = serializeValue(c.ignoreCase);

    // Comparison / string condition
    return `${op}:${col}:${val}:${ignoreCase}`;
}

/**
 * Serializes an arbitrary value into a deterministic string.
 *
 * @param value
 * Value to serialize.
 */
export function serializeValue(value: unknown): string {
    if (value === null) {
        return 'null';
    }
    if (typeof value === 'undefined') {
        return 'undef';
    }
    if (typeof value === 'string') {
        // Escape to keep delimiters stable
        return `str:${encodeURIComponent(value)}`;
    }
    if (typeof value === 'number') {
        if (Number.isNaN(value)) {
            return 'num:NaN';
        }
        if (value === Number.POSITIVE_INFINITY) {
            return 'num:Infinity';
        }
        if (value === Number.NEGATIVE_INFINITY) {
            return 'num:-Infinity';
        }
        return `num:${value}`;
    }
    if (typeof value === 'boolean') {
        return value ? 'bool:1' : 'bool:0';
    }
    if (typeof value === 'bigint') {
        return `big:${String(value)}`;
    }
    if (value instanceof Date) {
        return `date:${value.toISOString()}`;
    }
    if (Array.isArray(value)) {
        return `arr:[${value.map(serializeValue).join(',')}]`;
    }
    if (typeof value === 'function') {
        const fn = value as Function;
        let src = '';
        try {
            src = Function.prototype.toString.call(fn);
        } catch {
            src = '';
        }
        return `fn:${fn.name || ''}:${hashString(src)}`;
    }

    // Fallback: deterministic key order
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const parts: string[] = [];
    for (let i = 0, iEnd = keys.length; i < iEnd; ++i) {
        const k = keys[i];
        parts.push(`${encodeURIComponent(k)}=${serializeValue(obj[k])}`);
    }
    return `obj:{${parts.join(',')}}`;
}

/**
 * Small deterministic hash for strings (djb2-ish), returned as base36.
 *
 * @param str
 * String to hash.
 */
export function hashString(str: string): string {
    let hash = 5381;
    for (let i = 0, iEnd = str.length; i < iEnd; ++i) {
        hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    // Convert to unsigned 32-bit and base36 for compactness
    return (hash >>> 0).toString(36);
}
