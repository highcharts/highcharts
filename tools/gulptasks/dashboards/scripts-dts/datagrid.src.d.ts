/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import DataGrid from "./es-modules/DataGrid/DataGrid";
import Globals from "./es-modules/DataGrid/Globals";

export { default as DataGrid } from "./es-modules/DataGrid/DataGrid";
export { default as Column } from './es-modules/DataGrid/Table/Column';
export { default as TableRow } from './es-modules/DataGrid/Table/Content/TableRow';
export { default as TableCell } from './es-modules/DataGrid/Table/Content/TableCell';
export { default as Options } from './es-modules/DataGrid/Options';

export { default as DataConnector } from "./es-modules/Data/Connectors/DataConnector";
export { default as DataConverter } from "./es-modules/Data/Converters/DataConverter";
export { default as DataCursor } from "./es-modules/Data/DataCursor";
export { default as DataEvent } from "./es-modules/Data/DataEvent";
export { default as DataModifier } from "./es-modules/Data/Modifiers/DataModifier";
export { default as DataPool } from "./es-modules/Data/DataPool";
export { default as DataTable } from "./es-modules/Data/DataTable";

export const dataGrid: typeof DataGrid.dataGrid;
export const dataGrids: typeof DataGrid.dataGrids;
export const win: typeof Globals.win;

export as namespace DataGrid;
