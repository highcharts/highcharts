/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import Grid from './es-modules/Grid/Core/Grid';
import Globals from './es-modules/Grid/Core/Globals';
import Defaults from './es-modules/Grid/Core/Defaults';

import './es-modules/Grid/Pro/GridEvents';
import './es-modules/Grid/Pro/CellEditing/CellEditingComposition';
import './es-modules/Grid/Pro/Dash3Compatibility';
import './es-modules/Grid/Pro/Credits/CreditsProComposition';
import './es-modules/Grid/Pro/ColumnTypes/ValidatorComposition';
import './es-modules/Grid/Pro/CellRendering/CellRenderersComposition';
import './es-modules/Grid/Pro/CellRendering/Renderers/TextRenderer';
import './es-modules/Grid/Pro/CellRendering/Renderers/CheckboxRenderer';
import './es-modules/Grid/Pro/CellRendering/Renderers/SelectRenderer';
import './es-modules/Grid/Pro/CellRendering/Renderers/TextInputRenderer';
import './es-modules/Grid/Pro/CellRendering/Renderers/DateInputRenderer';
import './es-modules/Grid/Pro/CellRendering/Renderers/SparklineRenderer';

export { /** @deprecated Use `Grid` instead. */ default as DataGrid } from './es-modules/Grid/Core/Grid.js';
export { default as Grid } from './es-modules/Grid/Core/Grid.js';
export { default as Column } from './es-modules/Grid/Core/Table/Column.js';
export { default as TableRow } from './es-modules/Grid/Core/Table/Body/TableRow.js';
export { default as TableCell } from './es-modules/Grid/Core/Table/Body/TableCell.js';
export { default as Options } from './es-modules/Grid/Core/Options.js';

export { default as DataConnector } from './es-modules/Data/Connectors/DataConnector';
export { default as DataConverter } from './es-modules/Data/Converters/DataConverter';
export { default as DataCursor } from './es-modules/Data/DataCursor';
export { default as DataEvent } from './es-modules/Data/DataEvent';
export { default as DataModifier } from './es-modules/Data/Modifiers/DataModifier';
export { default as DataPool } from './es-modules/Data/DataPool';
export { default as DataTable } from './es-modules/Data/DataTable';

/** @deprecated Use `grid` instead. */
export const dataGrid: typeof Grid.grid;
/** @deprecated Use `grids` instead. */
export const dataGrids: typeof Grid.grids;
export const grid: typeof Grid.grid;
export const grids: typeof Grid.grids;
export const product: 'Grid Pro';
export const defaultOptions: typeof Defaults.defaultOptions;
export const setOptions: typeof Defaults.setOptions;
export const win: typeof Globals.win;

/** @deprecated Use `Grid` instead. */
export as namespace DataGrid;
export as namespace Grid;
