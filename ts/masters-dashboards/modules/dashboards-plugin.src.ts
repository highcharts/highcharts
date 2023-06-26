/* eslint-disable require-jsdoc */
/**
 * @license Highcharts Dashboards v0.0.3 (@product.date@)
 * @module dashboards/modules/dashboards-plugin
 * @requires highcharts
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 * */

'use strict';

import Highcharts from '../../Core/Globals.js';
import DataGrid from '../../DataGrid/DataGrid.js';
import HighchartsPlugin from '../../Dashboards/Plugins/HighchartsPlugin.js';
import DataGridPlugin from '../../Dashboards/Plugins/DataGridPlugin.js';

const G: AnyRecord = Highcharts;
G.DashboardPlugin = HighchartsPlugin;

if (G.win.Dashboards) {

    HighchartsPlugin.custom.connectHighcharts(Highcharts);
    G.win.Dashboards.PluginHandler.addPlugin(HighchartsPlugin);

    DataGridPlugin.custom.connectDataGrid(DataGrid);
    G.win.Dashboards.PluginHandler.addPlugin(DataGridPlugin);
}
