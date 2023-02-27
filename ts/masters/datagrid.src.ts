/**
 * @license Highcharts Dashboards v0.0.2 (@product.date@)
 * @module highcharts/datagrid
 * @requires window
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

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
    win: window,
    _modules: (typeof _modules === 'undefined' ? {} : _modules),
    DataGrid
};

/* *
 *
 *  Classic Exports
 *
 * */

if (!DG.win.DataGrid) {
    DG.win.DataGrid = DG;
}

export default DG;
