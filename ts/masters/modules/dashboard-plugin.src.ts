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
import ChartComponent from '../../Extensions/DashboardPlugin/ChartComponent.js';
import ChartSyncHandlers from '../../Extensions/DashboardPlugin/ChartSyncHandlers.js';

const G: AnyRecord = Highcharts;
G.DashboardComponent = ChartComponent;

function plugin(dashboard: AnyRecord): void {
    dashboard.Sync.defaultHandlers = {
        ...dashboard.Sync.defaultHandlers,
        ...ChartSyncHandlers
    };
}

export default plugin;
