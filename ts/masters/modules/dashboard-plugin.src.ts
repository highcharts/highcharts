/* eslint-disable require-jsdoc */
/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module highcharts/modules/dashboard-component
 * @requires highcharts
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 * */

'use strict';

import Highcharts from '../../Core/Globals.js';
import DataGrid from '../../DataGrid/DataGrid.js';
import HighchartsPlugin from '../../Extensions/DashboardPlugins/HighchartsPlugin.js';
import DataGridPlugin from '../../Extensions/DashboardPlugins/DataGridPlugin.js';

const G: AnyRecord = Highcharts;
G.DashboardPlugin = HighchartsPlugin;

if (G.win.Dashboard) {
    HighchartsPlugin.custom.connectHighcharts(Highcharts);
    G.win.Dashboard.PluginHandler.addPlugin(HighchartsPlugin);

    DataGridPlugin.custom.connectDataGrid(DataGrid);
    G.win.Dashboard.PluginHandler.addPlugin(DataGridPlugin);
}
