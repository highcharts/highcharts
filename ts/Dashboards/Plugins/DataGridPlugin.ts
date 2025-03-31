/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataGridNamespace, GridNamespace } from './DataGridTypes';
import type PluginHandler from '../PluginHandler';

import GridComponent from '../Components/DataGridComponent/DataGridComponent.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Components/ComponentType' {
    interface ComponentTypeRegistry {
        /**
         * @deprecated
         * DataGrid will be removed in behalf of Grid in the next major version.
         */
        DataGrid: typeof GridComponent;
        Grid: typeof GridComponent;
    }
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Connects DataGrid with the Dashboard plugin.
 *
 * @param DataGridNS
 * DataGrid core to connect.
 *
 * @deprecated
 * DataGrid will be removed in behalf of Grid in the next major version.
 */
function connectDataGrid(DataGridNS: DataGridNamespace): void {
    connectGrid(DataGridNS);
}

/**
 * Connects DataGrid with the Dashboard plugin.
 *
 * @param GridNS
 * Grid core to connect.
 */
function connectGrid(GridNS: GridNamespace): void {
    GridComponent.GridNamespace = GridNS;
}

/**
 * Callback function of the Dashboard plugin.
 *
 * @param {Dashboards.PluginHandler.Event} e
 * Plugin context provided by the Dashboard.
 */
function onRegister(
    e: PluginHandler.Event
): void {
    const { ComponentRegistry } = e;
    ComponentRegistry.registerComponent('DataGrid', GridComponent);
    ComponentRegistry.registerComponent('Grid', GridComponent);
}


/**
 * Callback function of the Dashboard plugin.
 *
 * @param {Dashboard.PluginHandler.Event} e Plugin context provided by the Dashboard.
 */
function onUnregister(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    e: PluginHandler.Event
): void {}

/* *
 *
 *  Default Export
 *
 * */

const DataGridCustom = {
    connectDataGrid,
    connectGrid
};

const DataGridPlugin: PluginHandler.DashboardsPlugin<typeof DataGridCustom> = {
    custom: DataGridCustom,
    name: 'DataGrid.DashboardsPlugin',
    onRegister,
    onUnregister
};

export default DataGridPlugin;
