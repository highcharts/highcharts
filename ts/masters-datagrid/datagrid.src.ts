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


import AST from '../Core/Renderer/HTML/AST.js';
import DataConnector from '../Data/Connectors/DataConnector.js';
import DataConverter from '../Data/Converters/DataConverter.js';
import DataCursor from '../Data/DataCursor.js';
import _Grid from '../Grid/Core/Grid.js';
import DataModifier from '../Data/Modifiers/DataModifier.js';
import DataPool from '../Data/DataPool.js';
import DataTable from '../Data/DataTable.js';
import Defaults from '../Grid/Core/Defaults.js';
import Globals from '../Grid/Core/Globals.js';
import whcm from '../Accessibility/HighContrastMode.js';
import TableCell from '../Grid/Core/Table/Content/TableCell.js';
import CellEditing from '../Grid/Core/Table/Actions/CellEditing.js';
import ColumnSorting from '../Grid/Core/Table/Actions/ColumnSorting.js';
import ColumnsResizer from '../Grid/Core/Table/Actions/ColumnsResizer.js';

import GridEvents from '../Grid/Pro/GridEvents.js';

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
    interface DataGridNamespace {
        win: typeof Globals.win;
        product: 'GridPro';
        AST: typeof AST;
        classNamePrefix: typeof Globals.classNamePrefix;
        DataGrid: typeof _Grid;
        dataGrid: typeof _Grid.grid;
        dataGrids: Array<(_Grid|undefined)>;
        DataConverter: typeof DataConverter;
        DataCursor: typeof DataCursor;
        DataModifier: typeof DataModifier;
        DataConnector: typeof DataConnector;
        DataPool: typeof DataPool;
        DataTable: typeof DataTable;
        isHighContrastModeActive: typeof whcm.isHighContrastModeActive;
        defaultOptions: typeof Defaults.defaultOptions;
        setOptions: typeof Defaults.setOptions;
        TableCell: typeof TableCell;
        CellEditing: typeof CellEditing;
        ColumnSorting: typeof ColumnSorting;
        ColumnsResizer: typeof ColumnsResizer;
    }
    interface Window {
        DataGrid: DataGridNamespace;
    }
    let DataGrid: DataGridNamespace;
}


/* *
 *
 *  Namespace
 *
 * */


const G = Globals as unknown as DataGridNamespace;

G.AST = AST;
G.classNamePrefix = 'highcharts-datagrid-';
G.DataConnector = DataConnector;
G.DataCursor = DataCursor;
G.DataConverter = DataConverter;
G.DataGrid = _Grid;
G.dataGrid = _Grid.grid;
G.dataGrids = _Grid.grids;
G.DataModifier = DataModifier;
G.DataPool = DataPool;
G.DataTable = DataTable;
G.defaultOptions = Defaults.defaultOptions;
G.isHighContrastModeActive = whcm.isHighContrastModeActive;
G.setOptions = Defaults.setOptions;
G.product = 'GridPro';

G.TableCell = TableCell;
G.CellEditing = CellEditing;
G.ColumnSorting = ColumnSorting;
G.ColumnsResizer = ColumnsResizer;

GridEvents.compose(
    G.TableCell,
    G.ColumnSorting,
    G.ColumnsResizer,
    G.CellEditing
);


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
