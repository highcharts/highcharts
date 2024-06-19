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
    settings: {
        columnDistribution: 'full',
        rowBufferSize: 10,
        strictRowHeights: false
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default DataGridDefaultOptions;
