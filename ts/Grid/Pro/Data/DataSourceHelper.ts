/* *
 *
 *  Remote Data Provider class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Draguła
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { RemoteFetchCallbackResult } from './RemoteDataProvider';
import type QueryingController from '../../Core/Querying/QueryingController';
import type { ColumnSortingOrder } from '../../Core/Options';

import { defined } from '../../../Shared/Utilities.js';
import T from '../../../Core/Templating.js';
const { format } = T;


/* *
 *
 *  Definitions
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
    notContains: 'doesNotContain',
    startsWith: 'beginsWith',
    endsWith: 'endsWith',
    empty: 'empty',
    notEmpty: 'notEmpty'
};

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
function extractFilterConditions(
    condition: FilterConditionLike | undefined,
    filterColumns: ApiFilterCondition[] = []
): ApiFilterCondition[] {
    if (!condition) {
        return filterColumns;
    }

    if (condition.operator === 'and' || condition.operator === 'or') {
        if (condition.conditions) {
            for (const subCondition of condition.conditions) {
                extractFilterConditions(subCondition, filterColumns);
            }
        }
    } else if (condition.columnId || condition.condition?.columnId) {
        const conditionToUse = condition.columnId ?
            condition : (condition.condition as FilterConditionLike);
        let key = conditionToUse.operator;

        if (condition.operator === 'not') {
            key = condition.operator +
                conditionToUse.operator.charAt(0).toUpperCase() +
                conditionToUse.operator.slice(1);
        }

        const mapped = filterOperatorMap[key] || conditionToUse.operator;

        if (conditionToUse.columnId) {
            filterColumns.push({
                id: conditionToUse.columnId,
                condition: mapped,
                value: conditionToUse.value
            });
        }
    }

    return filterColumns;
}

/**
 * Returns the active sortings from the query state.
 *
 * @param state
 * The query state.
 *
 * @returns
 * The active sortings.
 */
const getActiveSortings = (state: QueryState): ActiveSorting[] => {
    const { currentSortings, currentSorting } = state.query.sorting;
    return (currentSortings ?? (currentSorting ? [currentSorting] : [])).filter(
        (sorting): sorting is ActiveSorting =>
            defined(sorting?.columnId) && defined(sorting.order)
    );
};

const defaultTemplateVariables: Record<
    string, (state: QueryState) => string
> = {
    page: (state: QueryState): string => (
        Math.floor(state.offset / (state.limit || 1)) + 1
    ).toFixed(),
    pageSize: (state: QueryState): string => state.limit.toFixed(),
    offset: (state: QueryState): string => state.offset.toFixed(),
    limit: (state: QueryState): string => state.limit.toFixed(),
    format: (): string => 'js',
    filter: (state: QueryState): string => {
        const filterColumns: ApiFilterCondition[] = [];
        type ModifierWithCondition = {
            options?: { condition?: FilterConditionLike }
        };
        const filterCondition = (
            state.query.filtering.modifier as ModifierWithCondition
        )?.options?.condition;

        if (filterCondition) {
            extractFilterConditions(filterCondition, filterColumns);
        }

        if (!filterColumns.length) {
            return '';
        }

        return JSON.stringify({ columns: filterColumns });
    },
    sortBy: (state: QueryState): string => {
        const sortings = getActiveSortings(state);
        if (!sortings.length) {
            return '';
        }

        return sortings.map((sorting): string => sorting.columnId).join(',');
    },
    sortOrder: (state: QueryState): string => {
        const sortings = getActiveSortings(state);
        if (!sortings.length) {
            return '';
        }

        const sortOrders = sortings.map((sorting): string => sorting.order);
        const uniqueOrders = Array.from(new Set(sortOrders));

        return uniqueOrders.length === 1 ?
            uniqueOrders[0] :
            sortOrders.join(',');
    }
};

const defaultParseResponse = async (
    res: Response
): Promise<RemoteFetchCallbackResult> => {
    if (!res.ok) {
        let message = `DataSourceHelper: request failed with status ${
            res.status
        } ${res.statusText}`;
        try {
            const body = await res.text();
            if (body) {
                message += ` - ${body}`;
            }
        } catch {
            // Ignore response body parsing errors for error responses.
        }
        throw new Error(message);
    }
    const { data, meta } = await res.json();
    return {
        columns: data || {},
        totalRowCount: meta?.totalRowCount || 0,
        rowIds: meta?.rowIds,
        pageSize: meta?.pageSize
    };
};

/**
 * Builds a URL with query parameters for fetching data from the remote server.
 *
 * @param options
 * The options for building the URL.
 *
 * @param state
 * The query state containing the query, offset and limit.
 *
 * @returns
 * The complete URL string with all query parameters.
 */
export function buildUrl(
    options: DataSourceOptions,
    state: QueryState
): string {
    const { urlTemplate, templateVariables, omitEmpty } = options;

    const variables = {
        ...defaultTemplateVariables,
        ...templateVariables
    };

    const context: Record<string, string> = {};

    // Populate context with template variables in form of getter functions
    // so that only the variables that are actually used in the URL are
    // evaluated.
    Object.keys(variables).forEach((key): void => {
        const value = variables[key];

        Object.defineProperty(context, key, {
            enumerable: true,
            get: (): string => value(state)
        });
    });

    const res = format(urlTemplate, context);

    if (omitEmpty ?? true) {
        return res.replace(/&([^=&]+)=([^&]*)/g, (_, key, value): string => (
            value ? `&${key}=${value}` : ''
        ));
    }

    return res;
}

/**
 * Fetches data from the remote server using the data source options.
 *
 * @param options
 * The options for fetching data from the remote server.
 *
 * @param state
 * The query state containing the query, offset and limit.
 *
 * @returns
 * The fetched data.
 */
export async function dataSourceFetch(
    options: DataSourceOptions,
    state: QueryState
): Promise<RemoteFetchCallbackResult> {
    const {
        parseResponse = defaultParseResponse,
        fetchTimeout = 30000
    } = options;

    try {
        const url = buildUrl(options, state);
        const controller = fetchTimeout > 0 ? new AbortController() : null;
        const externalSignal = state.signal;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (controller && externalSignal) {
            if (externalSignal.aborted) {
                controller.abort();
            } else {
                externalSignal.addEventListener('abort', (): void => {
                    controller.abort();
                }, { once: true });
            }
        }

        if (controller) {
            timeoutId = setTimeout((): void => {
                controller.abort();
            }, fetchTimeout);
        }

        try {
            const signal = controller?.signal ?? externalSignal;
            const res = signal ?
                await fetch(url, { signal }) :
                await fetch(url);

            const data = await parseResponse(res);

            return data;
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return {
                columns: {},
                totalRowCount: 0,
                rowIds: []
            };
        }
        // eslint-disable-next-line no-console
        console.error('Error fetching data from remote server.\n', err);
        return {
            columns: {},
            totalRowCount: 0,
            rowIds: []
        };
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Serialized configuration alternatively to `fetchCallback`.
 */
export interface DataSourceOptions {
    /**
     * The URL template to be used to fetch data from the remote server.
     * Available template variables:
     * - `page` - The current page number.
     * - `pageSize` - The current page size.
     * - `offset` - The current offset ((page - 1) * pageSize).
     * - `limit` - Alias to `pageSize`.
     * - `filter` - The filter conditions.
     * - `sortBy` - The sort by conditions.
     * - `sortOrder` - The sort order.
     *
     * Example: `https://api.example.com/data?page={page}&pageSize={pageSize}`
     *
     * This list can be extended by adding custom template variables to the
     * `templateVariables` option.
     */
    urlTemplate: string;

    /**
     * Custom template variables to be replaced in the `urlTemplate`, extending
     * or overriding the built-in set (`page`, `pageSize`, `offset`, `limit`,
     * `filter`, `sortBy`, `sortOrder`). Each entry is a function that receives
     * the current `QueryState` and returns the string value to substitute.
     */
    templateVariables?: Record<string, (state: QueryState) => string>;

    /**
     * If `true`, empty query parameters are omitted from the URL.
     * @default true
     */
    omitEmpty?: boolean;

    /**
     * Callback to parse the response from the remote server into a
     * `RemoteFetchCallbackResult` object with the following fields:
     *
     * - `columns` *(required)* — column data keyed by column ID, where each
     *   value is an array of cell values for the fetched rows.
     *
     * - `totalRowCount` *(required)* — total number of rows available on the
     *   server for the current query (used to calculate page count and
     *   scrollbar size).
     *
     * - `rowIds` *(optional)* — stable identifiers for the fetched rows.
     *   When omitted, the Grid assigns sequential numeric IDs starting from
     *   `offset`.
     *
     * - `pageSize` *(optional)* — effective page size used by the backend for
     *   this response. Return this when the server can clamp or otherwise
     *   adjust the requested page size so the Grid can keep chunk indexing
     *   aligned with the actual response.
     */
    parseResponse?: (res: Response) => Promise<RemoteFetchCallbackResult>;

    /**
     * Timeout (ms) for the remote request. Set to 0 to disable.
     * @default 30000
     */
    fetchTimeout?: number;
}

export interface QueryState {
    query: QueryingController;
    offset: number;
    limit: number;
    signal?: AbortSignal;
}

/**
 * A single filter condition for the API.
 */
interface ApiFilterCondition {
    id: string;
    condition: string;
    value: unknown;
}

/**
 * Internal interface for filter condition structure.
 */
interface FilterConditionLike {
    operator: string;
    columnId?: string;
    value?: unknown;
    condition?: FilterConditionLike;
    conditions?: FilterConditionLike[];
}

/**
 * Internal interface for active sorting structure.
 */
type ActiveSorting = {
    columnId: string;
    order: Exclude<ColumnSortingOrder, null>;
};
