/* *
 *
 *  Data Grid class
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Øystein Moseng
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataGridOptions from './DataGridOptions';

/* *
 *
 *  API Options
 *
 * */

/** @internal */
const DataGridDefaults = {
    /** @internal */
    cellHeight: 49,
    /** @internal */
    columnHeaders: {
        /** @internal */
        enabled: true
    },
    /** @internal */
    columns: {},
    /** @internal */
    defaultHeight: 400,
    /** @internal */
    editable: true,
    /** @internal */
    resizableColumns: true
} as Required<DataGridOptions>;

/* *
 *
 *  Default Export
 *
 * */

export default DataGridDefaults;
