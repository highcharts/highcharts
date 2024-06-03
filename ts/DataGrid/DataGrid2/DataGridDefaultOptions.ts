/* *
 *
 *  Data Grid default options
 *
 *  (c) 2009-2024 Highsoft AS
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

import type DataGridOptions from './DataGridOptions';

/* *
 *
 *  API Options
 *
 * */

const DataGridDefaultOptions: DeepPartial<DataGridOptions> = {
    rows: {
        bufferSize: 5
    },
    columns: {
        distribution: 'fill',
        columnAssignment: 'all'
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default DataGridDefaultOptions;
