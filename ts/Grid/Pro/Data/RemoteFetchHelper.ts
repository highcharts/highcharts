/* *
 *
 *  Remote Fetch Helper
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type DT from '../../../Data/DataTable';
import type QueryingController from '../../Core/Querying/QueryingController';
import type { RemoteFetchCallbackResult } from './RemoteDataProvider';


/* *
 *
 *  Constants
 *
 * */

/**
 * Mapping from Grid filter operators to standard API filter conditions.
 */
const filterOperatorMap: Record<string, string> = {
    '==': 'equals',
    '===': 'equals',
    '!=': 'doesNotEqual',
    '!==': 'doesNotEqual',
    '>': 'greaterThan',
    '>=': 'greaterThanOrEqualTo',
    '<': 'lessThan',
    '<=': 'lessThanOrEqualTo',
    contains: 'contains',
    startsWith: 'beginsWith',
    endsWith: 'endsWith',
    empty: 'empty'
};


/* *
 *
 *  Interfaces
 *
 * */

/**
 * Options for building a remote fetch URL.
 */
export interface RemoteFetchOptions {
    /**
     * The base URL of the remote API endpoint.
     */
    baseUrl: string;

    /**
     * The querying controller containing sorting and filtering state.
     */
    query: QueryingController;

    /**
     * The offset (starting row index) for pagination.
     */
    offset: number;

    /**
     * The maximum number of rows to fetch.
     */
    limit: number;

    /**
     * Optional list of column IDs to include in the response.
     * If not provided, all columns will be fetched.
     */
    columns?: string[];

    /**
     * The response format. Defaults to 'js' (columnar format).
     */
    format?: 'js' | 'json';
}

/**
 * A single filter condition for the API.
 */
export interface ApiFilterCondition {
    id: string;
    condition: string;
    value: unknown;
}

/**
 * Expected structure of the API response.
 */
export interface ApiResponse {
    data: Record<string, DT.Column>;
    meta?: {
        currentPage?: number;
        pageSize?: number;
        totalRowCount?: number;
    };
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Recursively extracts filter conditions from the Grid's FilterCondition
 * structure into a flat array of API filter conditions.
 *
 * @param condition
 * The filter condition from the Grid's filtering modifier.
 *
 * @param filterColumns
 * The array to accumulate filter conditions into.
 *
 * @returns
 * The accumulated filter conditions array.
 */
export function extractFilterConditions(
    condition: FilterConditionLike | undefined,
    filterColumns: ApiFilterCondition[] = []
): ApiFilterCondition[] {
    if (!condition) {
        return filterColumns;
    }

    if (condition.operator === 'and' || condition.operator === 'or') {
        // Logical condition - extract from nested conditions
        if (condition.conditions) {
            for (const subCondition of condition.conditions) {
                extractFilterConditions(subCondition, filterColumns);
            }
        }
    } else if (condition.columnId) {
        // Single condition
        const mappedOperator =
            filterOperatorMap[condition.operator] || condition.operator;
        filterColumns.push({
            id: condition.columnId,
            condition: mappedOperator,
            value: condition.value
        });
    }

    return filterColumns;
}

/**
 * Internal interface for filter condition structure.
 */
export interface FilterConditionLike {
    operator: string;
    columnId?: string;
    value?: unknown;
    conditions?: FilterConditionLike[];
}

/**
 * Builds a URL with query parameters for fetching remote data.
 * This function creates a standardized URL format compatible with
 * the Highcharts dataset server API structure.
 *
 * @param options
 * The options for building the fetch URL.
 *
 * @returns
 * The complete URL string with all query parameters.
 *
 * @example
 * ```ts
 * const url = RemoteFetchHelper.buildUrl({
 *     baseUrl: 'https://api.example.com/data',
 *     query, offset: 0, limit: 50, columns: ['id', 'name', 'value']
 * });
 * ```
 */
export function buildUrl(options: RemoteFetchOptions): string {
    const { baseUrl, query, offset, limit, columns, format = 'js' } = options;
    const params = new URLSearchParams();

    // Pagination - convert offset/limit to page-based
    const page = Math.floor(offset / limit) + 1;
    params.set('page', page.toString());
    params.set('pageSize', limit.toString());

    // Response format
    params.set('format', format);

    // Columns to include
    if (columns && columns.length > 0) {
        params.set('columnsInclude', columns.join(','));
    }

    // Build filter from query.filtering.modifier
    const filterColumns: ApiFilterCondition[] = [];
    type ModifierWithCondition = {
        options?: { condition?: FilterConditionLike }
    };
    const filterCondition =
        (query.filtering.modifier as ModifierWithCondition)?.options?.condition;

    if (filterCondition) {
        extractFilterConditions(filterCondition, filterColumns);
    }

    if (filterColumns.length > 0) {
        const filterJson = JSON.stringify({ columns: filterColumns });
        params.set('filter', filterJson);
    }

    // Build sort from query.sorting state.
    // Supports multi-column sorting in the dataset server API format:
    // - sortBy=lastName,firstName&sortOrder=asc,desc
    // - sortBy=lastName,firstName&sortOrder=asc (when all orders are equal)
    const sortings = (
        query.sorting.currentSortings ||
        (query.sorting.currentSorting ? [query.sorting.currentSorting] : [])
    ).filter((s): boolean => !!(s?.columnId && s?.order));

    if (sortings.length > 0) {
        const sortBy = sortings.map((s): string => s.columnId as string);
        const sortOrders = sortings.map((s): string => s.order as string);

        params.set('sortBy', sortBy.join(','));

        const uniqueOrders = Array.from(new Set(sortOrders));
        params.set(
            'sortOrder',
            uniqueOrders.length === 1 ? uniqueOrders[0] : sortOrders.join(',')
        );
    }

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Fetches data from a remote API endpoint using the standardized URL format.
 * This is a convenience method that combines URL building and fetching.
 *
 * @param options
 * The options for the fetch request.
 *
 * @returns
 * A promise that resolves to the RemoteFetchCallbackResult.
 *
 * @example
 * ```ts
 * // In RemoteDataProvider fetchCallback:
 * fetchCallback: async (query, offset, limit) => {
 *     return RemoteFetchHelper.fetch({
 *         baseUrl: 'https://api.example.com/data',
 *         query,
 *         offset,
 *         limit,
 *         columns: ['id', 'name', 'value']
 *     });
 * }
 * ```
 */
export async function fetchData(
    options: RemoteFetchOptions
): Promise<RemoteFetchCallbackResult> {
    const url = buildUrl(options);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse: ApiResponse = await response.json();

        // Convert API response to RemoteFetchCallbackResult format
        const meta = apiResponse.meta || {};
        const currentPage =
            meta.currentPage || Math.floor(options.offset / options.limit) + 1;

        return {
            columns: apiResponse.data || {},
            currentPage,
            pageSize: meta.pageSize || options.limit,
            totalRowCount: meta.totalRowCount || 0
        };
    } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error fetching data from remote server.\n', err);

        return {
            columns: {},
            currentPage: 0,
            pageSize: 0,
            totalRowCount: 0
        };
    }
}


/* *
 *
 *  Default Export
 *
 * */

const RemoteFetchHelper = {
    buildUrl,
    fetch: fetchData,
    extractFilterConditions,
    filterOperatorMap
};

export default RemoteFetchHelper;
