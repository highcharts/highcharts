/* *
 *
 *  Data Grid options
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Øystein Moseng
 *
 * */

import type DataTable from '../Data/DataTable';

/* *
 *
 *  Declarations
 *
 * */

export interface DataGridOptions {
    cellHeight: number;
    columnHeaders: ColumnHeaderOptions;
    columns: Record<string, ColumnOptions>;
    dataTable?: DataTable;
    editable: boolean;
    /**
     * A string used to format the header row's cells. The context is the
     * column's name and can be accessed only by using `{text}`.
     *
     * @example
     * ```js
     * headerFormat: '{text} (custom format)'
     * ```
     */
    headerFormat?: string;
    resizableColumns: boolean;
}

export interface ColumnHeaderOptions {
    enabled: boolean;
}

export interface ColumnOptions {
    editable?: boolean;
}

export default DataGridOptions;
