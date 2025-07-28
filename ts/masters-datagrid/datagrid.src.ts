/**
 * @license Highcharts Dashboards v@product.version@ (@product.date@)
 * @module datagrid/datagrid
 *
 * (c) 2009-2025 Highsoft AS
 *
 * License: www.highcharts.com/license
 */


'use strict';


/* *
 *
 *  Imports
 *
 * */

import type _Options from '../Grid/Core/Options';
import type * as H from '../Grid/Pro/highcharts';

import AST from '../Core/Renderer/HTML/AST.js';
import Templating from '../Core/Templating.js';
import ColumnDistribution from '../Grid/Core/Table/ColumnDistribution/ColumnDistribution.js';
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
import Utilities from '../Core/Utilities.js';

import Table from '../Grid/Core/Table/Table.js';
import Column from '../Grid/Core/Table/Column.js';
import HeaderCell from '../Grid/Core/Table/Header/HeaderCell.js';
import TableCell from '../Grid/Core/Table/Body/TableCell.js';

import GridEvents from '../Grid/Pro/GridEvents.js';
import CellEditingComposition from '../Grid/Pro/CellEditing/CellEditingComposition.js';
import Dash3Compatibility from '../Grid/Pro/Dash3Compatibility.js';
import CreditsProComposition from '../Grid/Pro/Credits/CreditsProComposition.js';
import ValidatorComposition from '../Grid/Pro/ColumnTypes/ValidatorComposition.js';
import CellRenderersComposition from '../Grid/Pro/CellRendering/CellRenderersComposition.js';
import CellRendererRegistry from '../Grid/Pro/CellRendering/CellRendererRegistry.js';


/* *
 *
 *  Registers Imports
 *
 * */

// Connectors
import '../Data/Connectors/CSVConnector.js';
import '../Data/Connectors/GoogleSheetsConnector.js';
import '../Data/Connectors/HTMLTableConnector.js';
import '../Data/Connectors/JSONConnector.js';
import '../Data/Modifiers/ChainModifier.js';
import '../Data/Modifiers/InvertModifier.js';
import '../Data/Modifiers/RangeModifier.js';
import '../Data/Modifiers/SortModifier.js';
import '../Data/Modifiers/FilterModifier.js';

// Compositions
import '../Grid/Pro/GridEvents.js';
import '../Grid/Pro/CellEditing/CellEditingComposition.js';
import '../Grid/Pro/Dash3Compatibility.js';
import '../Grid/Pro/Credits/CreditsProComposition.js';

// Cell Renderers
import '../Grid/Pro/CellRendering/CellRenderersComposition.js';
import '../Grid/Pro/CellRendering/Renderers/TextRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/CheckboxRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/SelectRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/TextInputRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/DateInputRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/SparklineRenderer.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface DataGridNamespace {
        win: typeof Globals.win;
        product: 'Grid Pro';
        AST: typeof AST;
        classNamePrefix: typeof Globals.classNamePrefix;
        /**
         * @deprecated Use `Grid` instead.
         */
        DataGrid: typeof _Grid;
        /**
         * @deprecated Use `grid` instead.
         */
        dataGrid: typeof _Grid.grid;
        /**
         * @deprecated Use `grids` instead.
         */
        dataGrids: Array<(_Grid|undefined)>;
        Grid: typeof _Grid;
        grid: typeof _Grid.grid;
        grids: Array<(_Grid|undefined)>;
        ColumnDistribution: typeof ColumnDistribution;
        DataConverter: typeof DataConverter;
        DataCursor: typeof DataCursor;
        DataModifier: typeof DataModifier;
        DataConnector: typeof DataConnector;
        DataPool: typeof DataPool;
        DataTable: typeof DataTable;
        isHighContrastModeActive: typeof whcm.isHighContrastModeActive;
        defaultOptions: typeof Defaults.defaultOptions;
        setOptions: typeof Defaults.setOptions;
        Table: typeof Table;
        Column: typeof Column;
        HeaderCell: typeof HeaderCell;
        TableCell: typeof TableCell;
        Templating: typeof Templating;
        merge: typeof Utilities.merge;
        CellRendererRegistry: typeof CellRendererRegistry;
    }
    interface Window {
        /**
         * @deprecated Use `Grid` instead.
         */
        DataGrid: DataGridNamespace;
        Grid: DataGridNamespace;
        Highcharts?: typeof H;
    }
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
G.Grid = _Grid;
G.grid = _Grid.grid;
G.grids = _Grid.grids;
G.DataModifier = DataModifier;
G.DataPool = DataPool;
G.DataTable = DataTable;
G.ColumnDistribution = ColumnDistribution;
G.defaultOptions = Defaults.defaultOptions;
G.isHighContrastModeActive = whcm.isHighContrastModeActive;
G.setOptions = Defaults.setOptions;
G.Templating = Templating;
G.product = 'Grid Pro';
G.merge = Utilities.merge;

G.Table = G.Table || Table;
G.Column = G.Column || Column;
G.HeaderCell = G.HeaderCell || HeaderCell;
G.TableCell = G.TableCell || TableCell;

GridEvents.compose(G.Column, G.HeaderCell, G.TableCell);
CellEditingComposition.compose(G.Table, G.TableCell, G.Column);
CreditsProComposition.compose(G.Grid);
Dash3Compatibility.compose(G.Table);
ValidatorComposition.compose(G.Table);
CellRenderersComposition.compose(G.Column);

G.CellRendererRegistry = G.CellRendererRegistry || CellRendererRegistry;


/* *
 *
 *  Export types
 *
 * */

namespace G {
    export type Options = _Options;
}


/* *
 *
 *  Classic Export
 *
 * */


if (!G.win.DataGrid) {
    G.win.DataGrid = G;
}

if (!G.win.Grid) {
    G.win.Grid = G;
}

if (G.win.Highcharts) {
    G.CellRendererRegistry.types.sparkline.useHighcharts(G.win.Highcharts);
}


/* *
 *
 *  Default Export
 *
 * */


export default G;
