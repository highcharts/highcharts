/* eslint-disable require-jsdoc */
/**
 * @license Highcharts Dashboards v0.0.2 (@product.date@)
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
import HighchartsComponent from '../../Extensions/DashboardPlugins/HighchartsComponent.js';
import DataGridComponent from '../../Extensions/DashboardPlugins/DataGridComponent.js';

const G: AnyRecord = Highcharts;
G.DashboardPlugin = HighchartsPlugin;

if (G.win.Dashboards) {
    G.win.HighchartsComponent = HighchartsComponent;
    G.win.DataGridComponent = DataGridComponent;

    HighchartsPlugin.custom.connectHighcharts(Highcharts);
    G.win.Dashboards.PluginHandler.addPlugin(HighchartsPlugin);

    DataGridPlugin.custom.connectDataGrid(DataGrid);
    G.win.Dashboards.PluginHandler.addPlugin(DataGridPlugin);
}
