/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../../Data/DataTable';

/* *
 *
 *  Declarations
 *
 * */

export interface DataTableProvider {
    getDataTable(presentation?: boolean): DataTable | undefined;
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Returns whether the provider exposes `getDataTable`.
 *
 * @param provider
 * Data provider instance to test.
 *
 * @returns
 * `true` when provider exposes `getDataTable`.
 */
export function hasDataTableProvider(
    provider: unknown
): provider is DataTableProvider {
    return !!(
        provider &&
        typeof (
            provider as {
                getDataTable?: unknown;
            }
        ).getDataTable === 'function'
    );
}
