/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PluginHandler from '../PluginHandler';
import type { Highcharts as H } from './HighchartsTypes';

import HighchartsComponent from '../Components/HighchartsComponent/HighchartsComponent.js';
import KPIComponent from '../Components/KPIComponent/KPIComponent.js';
import NavigatorComponent from '../Components/NavigatorComponent/NavigatorComponent.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Components/ComponentType' {
    interface ComponentTypeRegistry {
        Highcharts: typeof HighchartsComponent;
        KPI: typeof KPIComponent;
        Navigator: typeof NavigatorComponent;
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Connects Highcharts core with the Dashboard plugin.
 *
 * @param {Highcharts} highcharts
 * Highcharts core to connect.
 */
function connectHighcharts(
    highcharts: H
): void {
    HighchartsComponent.charter = highcharts;
    KPIComponent.charter = highcharts;
    NavigatorComponent.charter = highcharts;
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
    ComponentRegistry.registerComponent('Highcharts', HighchartsComponent);
    ComponentRegistry.registerComponent('KPI', KPIComponent);
    ComponentRegistry.registerComponent('Navigator', NavigatorComponent);
}


/**
 * Callback function of the Dashboard plugin.
 *
 * @param {Dashboard.PluginHandler.Event} e
 * Plugin context provided by the Dashboard.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onUnregister(e: PluginHandler.Event): void {

}

/* *
 *
 *  Default Export
 *
 * */

const HighchartsCustom = {
    connectHighcharts
};

const HighchartsPlugin: PluginHandler.DashboardsPlugin<typeof HighchartsCustom> = {
    custom: HighchartsCustom,
    name: 'Highcharts.DashboardsPlugin',
    onRegister,
    onUnregister
};

export default HighchartsPlugin;
