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

    public metadata: Array<MetaColumn>;

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

    public describe(metadata: Array<MetaColumn>): void {
        this.metadata = metadata;
    }

    public whatIs(name: string): (MetaColumn|void) {
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

}

export interface MetaColumn {
    name?: string;
    metadata?: any;
}

export default DataStore;
