/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PluginHandler from '../../Dashboard/PluginHandler';

import DataGridComponent from './DataGridComponent.js';
import DataGrid from '../../DataGrid/DataGrid';

/* *
 *
 *  Functions
 *
 * */

/**
 * Connects Highcharts core with the Dashboard plugin.
 *
 * @param {Highcharts} dataGrid DataGrid core to connect.
 */
function connectDataGrid(
    DataGridClass: typeof DataGrid
): void {
    DataGridComponent.DataGridConstructor = DataGridClass;
}

/**
 * Callback function of the Dashboard plugin.
 *
 * @param {Dashboard.DashboardPlugin.Event} e
 * Plugin context provided by the Dashboard.
 */
function onRegister(
    e: PluginHandler.Event
): void {
    const { Component } = e;

    Component.addComponent(DataGridComponent);
}


/**
 * Callback function of the Dashboard plugin.
 *
 * @param {Dashboard.PluginHandler.Event} e Plugin context provided by the Dashboard.
 */
function onUnregister(
    e: PluginHandler.Event
): void {
    const { Sync } = e;
}

/* *
 *
 *  Default Export
 *
 * */

const DataGridCustom = {
    connectDataGrid
};

const DataGridPlugin: PluginHandler.DashboardPlugin<typeof DataGridCustom> = {
    custom: DataGridCustom,
    name: 'DataGrid.DashboardPlugin',
    onRegister,
    onUnregister
};

export default DataGridPlugin;
