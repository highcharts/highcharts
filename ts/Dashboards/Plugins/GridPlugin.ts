/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { GridNamespace } from './GridTypes';
import type PluginHandler from '../PluginHandler';
import GridComponent from '../Components/GridComponent/GridComponent.js';


/* *
 *
 *  Declarations
 *
 * */

declare module '../Components/ComponentType' {
    interface ComponentTypeRegistry {
        Grid: typeof GridComponent;
    }
}


/* *
 *
 *  Functions
 *
 * */

/**
 * Connects Grid with the Dashboard plugin.
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
): void { }

/* *
 *
 *  Default Export
 *
 * */

const GridCustom = {
    connectGrid
};

const GridPlugin: PluginHandler.DashboardsPlugin<typeof GridCustom> = {
    custom: GridCustom,
    name: 'Grid.DashboardsPlugin',
    onRegister,
    onUnregister
};

export default GridPlugin;
