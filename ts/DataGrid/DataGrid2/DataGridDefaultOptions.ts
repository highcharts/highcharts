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

import Globals from '../Globals.js';

/* *
 *
 *  API Options
 *
 * */

const DataGridDefaultOptions: Globals.DeepPartial<DataGridOptions> = {
    settings: {
        columns: {
            distribution: 'full',
            resizing: true
        },
        rows: {
            bufferSize: 10,
            strictHeights: false
        }
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default DataGridDefaultOptions;
