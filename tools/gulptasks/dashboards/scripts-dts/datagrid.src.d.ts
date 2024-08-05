/*!*
 *
 *  Copyright (c) Highsoft AS. All rights reserved.
 *
 *!*/

import Globals from "./es-modules/DataGrid/Globals";

export { default as DataGrid } from "./es-modules/DataGrid/DataGrid";
export { default as Column } from './es-modules/DataGrid/Column';
export { default as Row } from './es-modules/DataGrid/Row';
export { default as Cell } from './es-modules/DataGrid/Cell';
export { default as Options } from './es-modules/DataGrid/Options';

export const win: typeof Globals.win;

export as namespace DataGrid;
