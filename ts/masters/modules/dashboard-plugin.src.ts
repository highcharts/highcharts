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
import HighchartsPlugin from '../../Extensions/DashboardPlugin/HighchartsPlugin.js';

const G: AnyRecord = Highcharts;
G.DashboardPlugin = HighchartsPlugin;

if (G.win.Dashboard) {
    HighchartsPlugin.custom.connectHighcharts(Highcharts);
    G.win.Dashboard.addPlugin(HighchartsPlugin);
}
