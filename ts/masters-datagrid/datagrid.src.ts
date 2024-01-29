/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module datagrid/datagrid
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


import DataConnector from '../Data/Connectors/DataConnector.js';
import DataCursor from '../Data/DataCursor.js';
import _DataGrid from '../DataGrid/DataGrid.js';
import DataModifier from '../Data/Modifiers/DataModifier.js';
import DataPool from '../Data/DataPool.js';
import DataTable from '../Data/DataTable.js';
import Globals from '../DataGrid/Globals.js';

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
    interface DataGrid {
        win: typeof Globals.win;
        DataGrid: typeof _DataGrid;
        DataCursor: typeof DataCursor;
        DataModifier: typeof DataModifier;
        DataConnector: typeof DataConnector;
        DataPool: typeof DataPool;
        DataTable: typeof DataTable;
    }
    interface Window {
        // DataGrid: DataGrid;
    }
    let DataGrid: DataGrid;
}


/* *
 *
 *  Namespace
 *
 * */


const G = Globals as unknown as DataGrid;

G.DataConnector = DataConnector;
G.DataCursor = DataCursor;
G.DataGrid = _DataGrid;
G.DataModifier = DataModifier;
G.DataPool = DataPool;
G.DataTable = DataTable;


/* *
 *
 *  Classic Export
 *
 * */


if (!G.win.DataGrid) {
    G.win.DataGrid = G;
}


/* *
 *
 *  Default Export
 *
 * */


export default G;
