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
import DataGrid from '../DataGrid/DataGrid.js';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        DataGrid: typeof G;
    }
    let DataGrid: typeof G;
}

/* *
 *
 *  Namespace
 *
 * */

const G: AnyRecord = Globals;

G.win = window;
G.DataGrid = DataGrid;

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
