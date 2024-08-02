/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module dashboards/dashboards
 *
 * (c) 2009-2024 Highsoft AS
 *
 * License: www.highcharts.com/license
 */


'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { Highcharts as H } from '../Dashboards/Plugins/HighchartsTypes';
import type { DataGridNamespace as D } from '../Dashboards/Plugins/DataGridTypes';

// Fill registries
import '../Dashboards/Components/HTMLComponent/HTMLComponent.js';
import '../Data/Connectors/CSVConnector.js';
import '../Data/Connectors/GoogleSheetsConnector.js';
import '../Data/Connectors/HTMLTableConnector.js';
import '../Data/Connectors/JSONConnector.js';
import '../Data/Modifiers/ChainModifier.js';
import '../Data/Modifiers/InvertModifier.js';
import '../Data/Modifiers/RangeModifier.js';
import '../Data/Modifiers/SortModifier.js';

import AST from '../Core/Renderer/HTML/AST.js';
import DataConnector from '../Data/Connectors/DataConnector.js';
import Board from '../Dashboards/Board.js';
import Component from '../Dashboards/Components/Component.js';
import ComponentRegistry from '../Dashboards/Components/ComponentRegistry.js';
import DataPool from '../Data/DataPool.js';
import DataCursor from '../Data/DataCursor.js';
import DataConverter from '../Data/Converters/DataConverter.js';
import DataModifier from '../Data/Modifiers/DataModifier.js';
import DataTable from '../Data/DataTable.js';
import Globals from '../Dashboards/Globals.js';
import DataGridPlugin from '../Dashboards/Plugins/DataGridPlugin.js';
import HighchartsPlugin from '../Dashboards/Plugins/HighchartsPlugin.js';
import PluginHandler from '../Dashboards/PluginHandler.js';
import Sync from '../Dashboards/Components/Sync/Sync.js';
import Utilities from '../Dashboards/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface Dashboards {
        addEvent: typeof Utilities.addEvent;
        board: typeof Board.board;
        boards: typeof Globals.boards;
        error: typeof Utilities.error;
        merge: typeof Utilities.merge;
        removeEvent: typeof Utilities.removeEvent;
        uniqueKey: typeof Utilities.uniqueKey;
        win: typeof Globals.win;
        AST: typeof AST;
        Board: typeof Board;
        Component: typeof Component;
        ComponentRegistry: typeof ComponentRegistry;
        DataConnector: typeof DataConnector;
        DataConverter: typeof DataConverter;
        DataCursor: typeof DataCursor;
        DataModifier: typeof DataModifier;
        DataPool: typeof DataPool;
        DataTable: typeof DataTable;
        DataGridPlugin: typeof DataGridPlugin;
        HighchartsPlugin: typeof HighchartsPlugin;
        PluginHandler: typeof PluginHandler;
        Sync: typeof Sync;
    }
    interface Window {
        Dashboards: Dashboards;
        Highcharts?: H;
        DataGrid?: D;
    }
    let Dashboards: Dashboards;
}


/* *
 *
 *  Namespace
 *
 * */


const G = Globals as unknown as Dashboards;

G.board = Board.board;
G.addEvent = Utilities.addEvent;
G.error = Utilities.error;
G.merge = Utilities.merge;
G.removeEvent = Utilities.removeEvent;
G.uniqueKey = Utilities.uniqueKey;
G.AST = AST;
G.Board = Board;
G.Component = Component;
G.ComponentRegistry = ComponentRegistry;
G.DataConnector = DataConnector;
G.DataConverter = DataConverter;
G.DataCursor = DataCursor;
G.DataModifier = DataModifier;
G.DataPool = DataPool;
G.DataTable = DataTable;
G.DataGridPlugin = DataGridPlugin;
G.HighchartsPlugin = HighchartsPlugin;
G.PluginHandler = PluginHandler;
G.Sync = Sync;


/* *
 *
 *  Classic Export
 *
 * */


if (!G.win.Dashboards) {
    G.win.Dashboards = G;
}

if (G.win.DataGrid) {
    DataGridPlugin.custom.connectDataGrid(G.win.DataGrid);
    G.PluginHandler.addPlugin(DataGridPlugin);
}

if (G.win.Highcharts) {
    HighchartsPlugin.custom.connectHighcharts(G.win.Highcharts);
    G.PluginHandler.addPlugin(HighchartsPlugin);
}


/* *
 *
 *  Default Export
 *
 * */


export default G;
