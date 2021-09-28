/**
 * @license "Highsoft Dashboard" v@product.version@ (@product.date@)
 * @modules highsoft/dashboard
 * @requires window
 *
 * Highsoft Dashboard
 *
 * License: www.highcharts.com/license
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Dashboard from '../Dashboard/Dashboard.js';
import DashboardGlobals from '../Dashboard/DashboardGlobals.js';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        Dashboard: typeof D;
        Highcharts: typeof Highcharts & { Dashboard: typeof D };
    }
    let Dashboard: typeof D;
}

/* *
 *
 *  Namespace
 *
 * */

const D: AnyRecord = DashboardGlobals;

D._modules = _modules;
D.Dashboard = Dashboard;

/* *
 *
 *  Classic Exports
 *
 * */

if (!D.win.Dashboard) {
    D.win.Dashboard = D;
}

// eslint-disable-next-line highcharts/no-highcharts-object
if (D.win.Highcharts) {
    D.win.Highcharts.Dashboard = D;
}

export default DashboardGlobals;
