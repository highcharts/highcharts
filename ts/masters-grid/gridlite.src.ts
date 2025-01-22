/**
 * @license Highcharts Grid v@product.version@ (@product.date@)
 * @module grid/gridlite
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


import AST from '../Core/Renderer/HTML/AST.js';
import DataConnector from '../Data/Connectors/DataConnector.js';
import DataConverter from '../Data/Converters/DataConverter.js';
import DataCursor from '../Data/DataCursor.js';
import GridLite from '../Grid/Lite/GridLite.js';
import DataModifier from '../Data/Modifiers/DataModifier.js';
import DataPool from '../Data/DataPool.js';
import DataTable from '../Data/DataTable.js';
import Defaults from '../Grid/Core/Defaults.js';
import GridLiteGlobals from '../Grid/Lite/GridLiteGlobals.js';
import whcm from '../Accessibility/HighContrastMode.js';

// Fill registries
import '../Data/Connectors/CSVConnector.js';
import '../Data/Connectors/GoogleSheetsConnector.js';
import '../Data/Connectors/HTMLTableConnector.js';
import '../Data/Connectors/JSONConnector.js';
import '../Data/Modifiers/ChainModifier.js';
import '../Data/Modifiers/InvertModifier.js';
import '../Data/Modifiers/RangeModifier.js';
import '../Data/Modifiers/SortModifier.js';

/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface GridNamespace {
        win: typeof GridLiteGlobals.win;
        AST: typeof AST;
        Grid: typeof GridLite;
        grid: typeof GridLite.grid;
        grids: Array<(GridLite|undefined)>;
        DataConverter: typeof DataConverter;
        DataCursor: typeof DataCursor;
        DataModifier: typeof DataModifier;
        DataConnector: typeof DataConnector;
        DataPool: typeof DataPool;
        DataTable: typeof DataTable;
        isHighContrastModeActive: typeof whcm.isHighContrastModeActive;
        defaultOptions: typeof Defaults.defaultOptions;
        setOptions: typeof Defaults.setOptions;
    }
    interface Window {
        Grid: GridNamespace;
    }
    let Grid: GridNamespace;
}


/* *
 *
 *  Namespace
 *
 * */


const G = GridLiteGlobals as unknown as GridNamespace;

G.AST = AST;
G.DataConnector = DataConnector;
G.DataCursor = DataCursor;
G.DataConverter = DataConverter;
G.Grid = GridLite;
G.grid = GridLite.grid;
G.grids = GridLite.grids;
G.DataModifier = DataModifier;
G.DataPool = DataPool;
G.DataTable = DataTable;
G.defaultOptions = Defaults.defaultOptions;
G.setOptions = Defaults.setOptions;
G.isHighContrastModeActive = whcm.isHighContrastModeActive;


/* *
 *
 *  Classic Export
 *
 * */


if (!G.win.Grid) {
    G.win.Grid = G;
}


/* *
 *
 *  Default Export
 *
 * */


export default G;
