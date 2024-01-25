/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module dashboards/modules/dashboards-plugin
 * @requires dashboards
 *
 * (c) 2009-2024 Highsoft AS
 *
 * License: www.highcharts.com/license
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type { Highcharts as H } from '../../Dashboards/Plugins/HighchartsTypes';
import type { DataGrid as D } from '../../Dashboards/Plugins/DataGridTypes';

import DataGridPlugin from '../../Dashboards/Plugins/DataGridPlugin.js';
import Globals from '../../Dashboards/Globals.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface Dashboards {
        DataGridPlugin: typeof DataGridPlugin;
    }
    interface Window {
        Highcharts?: H;
        Datagrid?: D;
    }
}


/* *
 *
 *  Namespaces
 *
 * */


const G = Globals as unknown as Dashboards;

G.DataGridPlugin = DataGridPlugin;

if ((G.win as any).DataGrid) {
    DataGridPlugin.custom.connectDataGrid((G.win as any).DataGrid.DataGrid);
    G.PluginHandler.addPlugin(DataGridPlugin);
}


/* *
 *
 *  Default Export
 *
 * */


export default G;
