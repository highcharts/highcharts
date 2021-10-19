/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
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

import type PluginHandler from '../../Dashboard/PluginHandler';
import type G from '../../Core/Globals';

import HighchartsComponent from './HighchartsComponent.js';
import HighchartsSyncHandlers from './HighchartsSyncHandlers.js';

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
    highcharts: typeof G
): void {
    HighchartsComponent.charter = highcharts;
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
    const {
        Component,
        Sync
    } = e;

    Component.addComponent(HighchartsComponent);

    Sync.defaultHandlers = {
        ...Sync.defaultHandlers,
        ...HighchartsSyncHandlers
    };
}


/**
 * Callback function of the Dashboard plugin.
 *
 * @param {Dashboard.PluginHandler.Event} e
 * Plugin context provided by the Dashboard.
 */
function onUnregister(
    e: PluginHandler.Event
): void {
    const {
        Sync
    } = e;

    Object
        .keys(HighchartsSyncHandlers)
        .forEach((handler): void => {
            if (Sync.defaultHandlers[handler] === HighchartsSyncHandlers[handler]) {
                delete Sync.defaultHandlers[handler];
            }
        });

}

/* *
 *
 *  Default Export
 *
 * */

const HighchartsCustom = {
    connectHighcharts
};

const HighchartsPlugin: PluginHandler.DashboardPlugin<typeof HighchartsCustom> = {
    custom: HighchartsCustom,
    name: 'Highcharts.DashboardPlugin',
    onRegister,
    onUnregister
};

export default HighchartsPlugin;
