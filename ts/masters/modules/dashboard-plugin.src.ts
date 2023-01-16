/* eslint-disable require-jsdoc */
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/dashboard-component
 * @requires highcharts
 *
 * Highcharts Dashboard Component
 *
 * (c) 2012-2021 Highsoft AS
 *
 * License: www.highcharts.com/license
 *
 *  Authors:
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sebastian Bochan
 *  - Sophie Bremer
 *
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
G.win.HighchartsComponent = HighchartsComponent;
G.win.DataGridComponent = DataGridComponent;

if (G.win.Dashboard) {
    HighchartsPlugin.custom.connectHighcharts(Highcharts);
    G.win.Dashboard.PluginHandler.addPlugin(HighchartsPlugin);

    DataGridPlugin.custom.connectDataGrid(DataGrid);
    G.win.Dashboard.PluginHandler.addPlugin(DataGridPlugin);
}
