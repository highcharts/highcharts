/**
 * @license Highcharts Dashboards v0.0.2 (@product.date@)
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
import Board from '../Dashboards/Board.js';
import DataOnDemand from '../Data/DataOnDemand.js';
import DataTable from '../Data/DataTable.js';
import Globals from '../Dashboards/Globals.js';
import GoogleSheetsStore from '../Data/Stores/GoogleSheetsStore.js';
import GroupModifier from '../Data/Modifiers/GroupModifier.js';
import HTMLTableStore from '../Data/Stores/HTMLTableStore.js';
import PluginHandler from '../Dashboards/PluginHandler.js';
import RangeModifier from '../Data/Modifiers/RangeModifier.js';
import Sync from '../Dashboards/Component/Sync/Sync.js';
import Utilities from '../Dashboards/Utilities.js';
import DataGrid from '../DataGrid/DataGrid.js';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    interface Window {
        Dashboards: typeof D;
        Highcharts: typeof Highcharts & { Dashboard: typeof D };
    }
    let Dashboards: typeof D;
}

/* *
 *
 *  Namespace
 *
 * */

const D = {
    ...Globals,
    ...Utilities,
    Board,
    board: Board.board,
    CSVStore,
    DataGrid,
    DataOnDemand,
    DataTable,
    GoogleSheetsStore,
    GroupModifier,
    HTMLTableStore,
    PluginHandler,
    RangeModifier,
    Sync,
    _modules: (typeof _modules === 'undefined' ? {} : _modules)
};

/* *
 *
 *  Classic Exports
 *
 * */

if (!D.win.Dashboards) {
    D.win.Dashboards = D;
}

export default D;
