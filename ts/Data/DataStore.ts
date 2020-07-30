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

import DataTable from './DataTable.js';
import DataRow from './DataRow.js';
import U from '../Core/Utilities.js';
const {
    uniqueKey
} = U;

export type TableEvents = ('\\(._.)//');

abstract class DataStore {
    /* *
    *
    *  Constructors
    *
    * */

    public constructor(dataSet: DataTable) {
        this.rows = dataSet;
        this.metadata = [];
        this.length = this.rows.getRowCount();
    }

    /* *
    *
    *  Properties
    *
    * */

    public rows: DataTable;

    public length: number;

    public metadata: Array<DataStore.MetaColumn>;

    /* *
    *
    *  Functions
    *
    * */

    public describeColumn(
        name: string,
        metadata: any
    ): void {

        this.metadata.push({
            name: name,
            metadata: metadata
        });
    }

    public describe(metadata: Array<DataStore.MetaColumn>): void {
        this.metadata = metadata;
    }

    public whatIs(name: string): (DataStore.MetaColumn|void) {
        const metadata = this.metadata;
        let i;

        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    }

    public on(
        event: TableEvents,
        callback: Highcharts.EventCallbackFunction<DataStore>
    ): void {

    }

    colsToDataTable(cols: Array<Array<Highcharts.DataValueType>>, headers: string[] = []): DataTable {
        const table = new DataTable();
        const noOfCols = cols.length;
        if (noOfCols) {
            const noOfRows = cols[0].length;
            for (let i = 0; i < noOfRows; ++i) {
                const row = new DataRow();
                for (let j = 0; j < noOfCols; ++j) {
                    row.insertColumn((headers.length ? headers[j] : uniqueKey()), cols[j][i]);
                }
                table.insertRow(row);
            }
        }
        return table;
    }
}
namespace DataStore {
    export interface MetaColumn {
        name?: string;
        metadata?: any;
    }
}

export default DataStore;
