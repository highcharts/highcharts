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
 *  - Dawid Dragula
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

import T from '../../../Core/Templating.js';
const { format } = T;


/* *
 *
 *  Definitions
 *
 * */

const defaultTemplateVariables: Record<
    string, string | ((state: QueryState) => string)
> = {
    page: (state: QueryState): string => (
        Math.floor(state.offset / state.limit) + 1
    ).toFixed(),
    pageSize: (state: QueryState): string => state.limit.toFixed(),
    offset: (state: QueryState): string => state.offset.toFixed(),
    limit: (state: QueryState): string => state.limit.toFixed(),
    format: 'js'
};

const defaultParseReponse = async (
    res: Response
): Promise<RemoteFetchCallbackResult> => {
    const { data, meta } = await res.json();
    return {
        columns: data || {},
        totalRowCount: meta.totalRowCount || 0,
        rowIds: meta.rowIds || []
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
            get: (): string => (
                typeof value === 'function' ? value(state) : value
            )
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
    const { parseResponse = defaultParseReponse } = options;

    try {
        const url = buildUrl(options, state);
        const res = await fetch(url);
        return await parseResponse(res);
    } catch (err: unknown) {
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
     *
     * Example: `https://api.example.com/data?page={page}&pageSize={pageSize}`
     */
    urlTemplate: string;

    /**
     * Template variables to be replaced in the urlTemplate.
     */
    templateVariables?: Record<string, string|(() => string)>;

    /**
     * If `true`, empty query parameters will be omitted from the URL.
     */
    omitEmpty?: boolean;

    /**
     * Callback to parse the response from the remote server.
     */
    parseResponse?: (res: Response) => Promise<RemoteFetchCallbackResult>;
}

export interface QueryState {
    query: QueryingController;
    offset: number;
    limit: number;
}
