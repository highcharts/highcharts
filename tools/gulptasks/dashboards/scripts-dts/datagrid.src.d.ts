/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import Globals from "./es-modules/DataGrid/Globals";

export { default as DataGrid } from "./es-modules/DataGrid/DataGrid";
export { default as DataGridColumn } from './es-modules/DataGrid/Column';
export { default as DataGridRow } from './es-modules/DataGrid/Row';
export { default as DataGridCell } from './es-modules/DataGrid/Cell';
export { default as DataGridOptions } from './es-modules/DataGrid/Options';

export const win: typeof Globals.win;

export as namespace DataGrid;
