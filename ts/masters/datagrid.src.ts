/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/datagrid
 * @requires window
 *
 * Highsoft DataGrid
 *
 * (c) 2010-2022 Highsoft AS
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