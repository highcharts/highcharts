/**
 * @license Highcharts Dashboards v0.0.1 (@product.date@)
 * @module highsoft/dashboard
 * @requires window
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import CSVStore from '../Data/Stores/CSVStore.js';
import Dashboard from '../Dashboard/Dashboard.js';
import DataOnDemand from '../Data/DataOnDemand.js';
import DataTable from '../Data/DataTable.js';
import Globals from '../Dashboard/Globals.js';
import GoogleSheetsStore from '../Data/Stores/GoogleSheetsStore.js';
import GroupModifier from '../Data/Modifiers/GroupModifier.js';
import HTMLTableStore from '../Data/Stores/HTMLTableStore.js';
import PluginHandler from '../Dashboard/PluginHandler.js';
import RangeModifier from '../Data/Modifiers/RangeModifier.js';
import Sync from '../Dashboard/Component/Sync/Sync.js';
import Utilities from '../Dashboard/Utilities.js';
import DataGrid from '../DataGrid/DataGrid.js';

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
    ...Globals,
    ...Utilities,
    _modules: (typeof _modules === 'undefined' ? {} : _modules),
    CSVStore,
    Dashboard,
    DataGrid,
    DataOnDemand,
    DataTable,
    GoogleSheetsStore,
    GroupModifier,
    HTMLTableStore,
    PluginHandler,
    RangeModifier,
    Sync
};

/* *
 *
 *  Classic Exports
 *
 * */

if (!D.win.Dashboard) {
    D.win.Dashboard = D;
}

export default D;
