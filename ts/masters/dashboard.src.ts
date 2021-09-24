/**
 * @license "Highsoft Dashboard" v@product.version@ (@product.date@)
 * @module @highsoft/dashboard
 * @requires dashboard
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

const D = {
    Dashboard,
    ...DashboardGlobals
};

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
