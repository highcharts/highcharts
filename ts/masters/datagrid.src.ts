/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/datagrid
 *
 * (c) 2009-2020 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import DataGrid from '../DataGrid/DataGrid.js';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        DataGrid: typeof DG;
    }
    let DataGrid: typeof DG;
}

/* *
 *
 *  Namespace
 *
 * */

const DG = {
    // ...Globals,
    _modules: (typeof _modules === 'undefined' ? {} : _modules),
    DataGrid
};

/* *
 *
 *  Classic Exports
 *
 * */

if (!window.DataGrid) {
    window.DataGrid = DG;
}

export default DG;
