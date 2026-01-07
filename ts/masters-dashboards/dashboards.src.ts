// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module dashboards/dashboards
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type { Highcharts as HighchartsNamespace } from '../Dashboards/Plugins/HighchartsTypes';
import type { GridNamespace } from '../Dashboards/Plugins/GridTypes';

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
import '../Data/Modifiers/FilterModifier.js';

// Import SerializeHelper modules to register them
import '../Dashboards/SerializeHelper/CSVConnectorHelper.js';
import '../Dashboards/SerializeHelper/DataConverterHelper.js';
import '../Dashboards/SerializeHelper/DataCursorHelper.js';
import '../Dashboards/SerializeHelper/DataTableHelper.js';
import '../Dashboards/SerializeHelper/GoogleSheetsConnectorHelper.js';
import '../Dashboards/SerializeHelper/HTMLTableConnectorHelper.js';
import '../Dashboards/SerializeHelper/JSONConnectorHelper.js';

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
import Defaults from '../Dashboards/Defaults.js';
import Globals from '../Dashboards/Globals.js';
import GridPlugin from '../Dashboards/Plugins/GridPlugin.js';
import HighchartsPlugin from '../Dashboards/Plugins/HighchartsPlugin.js';
import PluginHandler from '../Dashboards/PluginHandler.js';
import Sync from '../Dashboards/Components/Sync/Sync.js';
import Utilities from '../Dashboards/Utilities.js';
import CoreUtilities from '../Core/Utilities.js';


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
        setOptions: typeof Defaults.setOptions;
        uniqueKey: typeof Utilities.uniqueKey;
        version: typeof Globals.version;
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
        defaultOptions: typeof Defaults.defaultOptions;
        GridPlugin: typeof GridPlugin;
        HighchartsPlugin: typeof HighchartsPlugin;
        PluginHandler: typeof PluginHandler;
        Sync: typeof Sync;
    }
    interface Window {
        Dashboards: Dashboards;
        Highcharts?: HighchartsNamespace;
        Grid?: GridNamespace;
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
G.setOptions = Defaults.setOptions;
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
G.defaultOptions = Defaults.defaultOptions;
G.GridPlugin = GridPlugin;
G.HighchartsPlugin = HighchartsPlugin;
G.PluginHandler = PluginHandler;
G.Sync = Sync;

// Extend with Core utilities
CoreUtilities.extend(G, CoreUtilities);


/* *
 *
 *  Classic Export
 *
 * */


if (!G.win.Dashboards) {
    G.win.Dashboards = G;
}

if (G.win.Grid) {
    GridPlugin.custom.connectGrid(G.win.Grid);
    G.PluginHandler.addPlugin(GridPlugin);
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
