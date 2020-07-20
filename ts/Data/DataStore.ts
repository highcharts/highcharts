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
import DataSet from './DataTable';
import DataRow from './DataTable';
import U from '../Core/Utilities.js';
const {
    merge
} = U;

/** eslint-disable valid-jsdoc */

/**
 * @private
 */

namespace DataStore {
    interface MetaColumn {
        name?: string;
        metadata?: any;
    }

    class DataStore<T> {

        /* *
        *
        *  Constructors
        *
        * */

        public constructor(dataSet: DataSet<T>) {
            this.rows = dataSet;
            this.metadata = [];
            this.length = this.rows.length;
        }

        /* *
        *
        *  Properties
        *
        * */

        public rows: DataSet<T>;

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

        public insert(rowData: Record<string, T>): number {
            return this.rows.push(rowData);
        }

        public update(
            rowID: number,
            data: DataRow<T>
        ): void {
            // update options
            let row = this.getRowByID(rowID);

            row = merge(row, data);
            /* *
            *
            * redraw visible table or use events
            * ...
            *
            * */
        }

        public getRowByIndex(rowIndex: number): DataRow<T> {
            return this.rows[rowIndex];
        }

        public getRowByID(rowID: number): DataRow<T> {
            const rows = this.rows;
            let i;

            for (i = 0; i < rows.length; i++) {
                if (rows[i].id === rowID) {
                    return rows[i];
                }
            }
        }

        public removeRow(rowID: number): void {
            this.rows.splice(rowID, 1);
        }

        public clear(): void {
            this.rows.length = this.length = 0;
        }

        public modify(dataModifierChain: void): void {

        }

        public on(
            eventName: string,
            callback: Highcharts.EventCallbackFunction<T>
        ): void {
        }
    }
}

export default DataStore;
