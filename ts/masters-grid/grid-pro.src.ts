// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Grid Pro v@product.version@ (@product.date@)
 * @module grid/grid-pro
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */


/* *
 *
 *  Imports
 *
 * */

import type _Options from '../Grid/Core/Options';

import AST from '../Core/Renderer/HTML/AST.js';
import Templating from '../Core/Templating.js';
import ColumnResizing from '../Grid/Core/Table/ColumnResizing/ColumnResizing.js';
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
import SvgIcons from '../Grid/Core/UI/SvgIcons.js';

import GridEvents from '../Grid/Pro/GridEvents.js';
import CellEditingComposition from '../Grid/Pro/CellEditing/CellEditingComposition.js';
import CreditsProComposition from '../Grid/Pro/Credits/CreditsProComposition.js';
import ExportingComposition from '../Grid/Pro/Export/ExportingComposition.js';
import ValidatorComposition from '../Grid/Pro/ColumnTypes/ValidatorComposition.js';
import CellRenderersComposition from '../Grid/Pro/CellRendering/CellRenderersComposition.js';
import CellRendererRegistry from '../Grid/Pro/CellRendering/CellRendererRegistry.js';
import PaginationComposition from '../Grid/Pro/Pagination/PaginationComposition.js';
import Pagination from '../Grid/Core/Pagination/Pagination.js';
import CellContentPro from '../Grid/Pro/CellRendering/CellContentPro.js';
import CellRenderer from '../Grid/Pro/CellRendering/CellRenderer.js';

import Popup from '../Grid/Core/UI/Popup.js';


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
import '../Grid/Pro/Credits/CreditsProComposition.js';
import '../Grid/Pro/Export/ExportingComposition.js';

// Cell Renderers
import '../Grid/Pro/CellRendering/CellRenderer.js';
import '../Grid/Pro/CellRendering/CellContentPro.js';
import '../Grid/Pro/CellRendering/CellRenderersComposition.js';
import '../Grid/Pro/CellRendering/Renderers/TextRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/CheckboxRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/SelectRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/TextInputRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/DateInputRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/DateTimeInputRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/TimeInputRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/SparklineRenderer.js';
import '../Grid/Pro/CellRendering/Renderers/NumberInputRenderer.js';


/* *
 *
 *  Namespace
 *
 * */

const G = {
    AST,
    CellContentPro,
    CellRenderer,
    CellRendererRegistry,
    classNamePrefix: Globals.classNamePrefix,
    Column,
    ColumnResizing,
    DataConnector,
    DataConverter,
    DataCursor,
    DataModifier,
    DataPool,
    DataTable,
    defaultOptions: Defaults.defaultOptions,
    Grid: _Grid,
    grid: _Grid.grid,
    grids: _Grid.grids,
    HeaderCell,
    isHighContrastModeActive: whcm.isHighContrastModeActive,
    merge: Utilities.merge,
    Pagination,
    Popup,
    product: 'Grid Pro',
    setOptions: Defaults.setOptions,
    SvgIcons,
    Table,
    TableCell,
    Templating,
    version: Globals.version,
    win: Globals.win
} as const;

GridEvents.compose(G.Grid, G.Column, G.HeaderCell, G.TableCell);
CellEditingComposition.compose(G.Table, G.TableCell, G.Column);
CreditsProComposition.compose(G.Grid);
ExportingComposition.compose(G.Grid);
ValidatorComposition.compose(G.Table);
CellRenderersComposition.compose(G.Column);
PaginationComposition.compose(G.Pagination);


/* *
 *
 * Named Exports
 *
 * */

export {
    AST,
    CellContentPro,
    CellRenderer,
    CellRendererRegistry,
    Column,
    ColumnResizing,
    DataConnector,
    DataConverter,
    DataCursor,
    DataModifier,
    DataPool,
    DataTable,
    _Grid as Grid,
    HeaderCell,
    _Options as Options,
    Pagination,
    Popup,
    SvgIcons,
    Table,
    TableCell,
    Templating
};

export const {
    classNamePrefix,
    defaultOptions,
    grid,
    grids,
    isHighContrastModeActive,
    merge,
    product,
    setOptions,
    version,
    win
} = G;


/* *
 *
 *  Classic Extensions
 *
 * */

const wnd = G.win as { Highcharts?: unknown };
if (wnd.Highcharts) {
    G.CellRendererRegistry.types.sparkline.useHighcharts(wnd.Highcharts);
}


/* *
 *
 *  Default Export
 *
 * */

namespace G {
    export type Options = _Options;
}

export default G;
