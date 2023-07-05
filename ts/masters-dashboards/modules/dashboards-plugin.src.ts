/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module dashboards/modules/dashboards-plugin
 * @requires dashboards
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Globals from '../../Dashboards/Globals.js';
import HighchartsPlugin from '../../Dashboards/Plugins/HighchartsPlugin.js';
import DataGridPlugin from '../../Dashboards/Plugins/DataGridPlugin.js';

/* *
 *
 *  Namespaces
 *
 * */

const G: AnyRecord = Globals;

G.DataGridPlugin = DataGridPlugin;
G.HighchartsPlugin = HighchartsPlugin;

if (G.win.Highcharts) {
    HighchartsPlugin.custom.connectHighcharts(G.win.Highcharts);
    G.PluginHandler.addPlugin(HighchartsPlugin);
}

if (G.win.DataGrid) {
    DataGridPlugin.custom.connectDataGrid(G.win.DataGrid.DataGrid);
    G.PluginHandler.addPlugin(DataGridPlugin);
}

/* *
 *
 *  Default Export
 *
 * */

export default G;
