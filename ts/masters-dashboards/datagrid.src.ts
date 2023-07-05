/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
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


import Globals from '../DataGrid/Globals.js';
import _DataGrid from '../DataGrid/DataGrid.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface DataGrid {
        win: typeof Globals.win;
        DataGrid: typeof _DataGrid;
    }
    interface Window {
        DataGrid: DataGrid;
    }
    let DataGrid: DataGrid;
}


/* *
 *
 *  Namespace
 *
 * */


const G = Globals as unknown as DataGrid;

G.DataGrid = _DataGrid;


/* *
 *
 *  Classic Export
 *
 * */


if (!G.win.DataGrid) {
    G.win.DataGrid = G;
}


/* *
 *
 *  Default Export
 *
 * */


export default G;
