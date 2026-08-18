/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
