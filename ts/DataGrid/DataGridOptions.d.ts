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
    dataTable?: DataTable;
    editable?: boolean;
    resizableColumns?: boolean;
}

export default DataGridOptions;
