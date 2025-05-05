/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* eslint-disable max-len */


/* *
 *
 *  Imports
 *
 * */

import type * as D from '@highcharts/dashboards/datagrid';


/* *
 *
 *  Declarations
 *
 * */

/**
 * @deprecated
 * DataGrid will be removed in behalf of Grid in the next major version.
 */
export type DataGrid = D.DataGrid;

export type Grid = D.Grid;

/**
 * @deprecated
 * DataGrid will be removed in behalf of Grid in the next major version.
 */
export type DataGridNamespace = typeof D;

export type GridNamespace = typeof D;

export type Column = D.Column;

export type TableRow = D.TableRow;

export namespace TableCell {
    export type TableCellEvent = D.TableCell.TableCellEvent;
}

export type TableCell = D.TableCell;

export type GridOptions = D.Options;


/* *
 *
 *  Default Export
 *
 * */


export default D;
