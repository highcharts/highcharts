/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import DataTable from '../DataTable.js';
import DataRow from '../DataRow.js';
import U from '../../Core/Utilities.js';
const {
    uniqueKey
} = U;

import type DataValueType from '../DataValueType.js';

class DataParser {

    /**
     * Functions
     */

    public columnArrayToDataTable(columns: Array<Array<DataValueType>>, headers: string[] = []): DataTable {
        const table = new DataTable();
        const columnsLength = columns.length;
        if (columnsLength) {
            const rowsLength = columns[0].length;
            for (let i = 0; i < rowsLength; ++i) {
                const row = new DataRow();
                for (let j = 0; j < columnsLength; ++j) {
                    row.insertColumn((headers.length ? headers[j] : uniqueKey()), columns[j][i]);
                }
                table.insertRow(row);
            }
        }
        return table;
    }
}

export default DataParser;
