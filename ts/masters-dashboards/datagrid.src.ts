/**
 * @license Highcharts Dashboards v0.0.2 (@product.date@)
 * @module dashboards/datagrid
 * @requires dashboards
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
