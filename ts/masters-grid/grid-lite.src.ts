// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Grid v@product.version@ (@product.date@)
 * @module grid/grid-lite
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

import type _Options from '../Grid/Core/Options.ts';

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
import Table from '../Grid/Core/Table/Table.js';
import CreditsLiteComposition from '../Grid/Lite/Credits/CreditsLiteComposition.js';
import Utilities from '../Core/Utilities.js';
import SvgIcons from '../Grid/Core/UI/SvgIcons.js';
import Pagination from '../Grid/Core/Pagination/Pagination.js';

// Fill registries
import '../Data/Connectors/CSVConnector.js';
import '../Data/Connectors/GoogleSheetsConnector.js';
import '../Data/Connectors/HTMLTableConnector.js';
import '../Data/Connectors/JSONConnector.js';
import '../Data/Modifiers/ChainModifier.js';
import '../Data/Modifiers/InvertModifier.js';
import '../Data/Modifiers/RangeModifier.js';
import '../Data/Modifiers/SortModifier.js';
import '../Data/Modifiers/FilterModifier.js';


/* *
 *
 *  Namespace
 *
 * */

const G = {
    AST,
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
    isHighContrastModeActive: whcm.isHighContrastModeActive,
    merge: Utilities.merge,
    Pagination,
    product: 'Grid Lite',
    setOptions: Defaults.setOptions,
    SvgIcons,
    Table,
    Templating,
    version: Globals.version,
    win: Globals.win
};

CreditsLiteComposition.compose(G.Grid, G.Table);


/* *
 *
 * Named Exports
 *
 * */

export {
    AST,
    ColumnResizing,
    DataConnector,
    DataConverter,
    DataCursor,
    DataModifier,
    DataPool,
    DataTable,
    _Grid as Grid,
    _Options as Options,
    Pagination,
    SvgIcons,
    Table,
    Templating
};

export const {
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
 *  Default Export
 *
 * */

namespace G {
    export type Options = _Options;
}

export default G;
