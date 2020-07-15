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

/** eslint-disable valid-jsdoc */

/**
 * @private
 */
class DataTable<T> {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(dataSet: DataTable.Set<T>) {
        this.dataSet = dataSet;
        this.absoluteLength = dataSet.length;
        this.relativeLength = dataSet.length;
        this.relativeStart = 0;
    }

    /* *
     *
     *  Properties
     *
     * */

    private dataSet: DataTable.Set<T>;

    public absoluteLength: number;

    public relativeLength: number;

    public relativeStart: number;

    /* *
     *
     *  Functions
     *
     * */

    private absolutePosition(relativeIndex: number): number {
        if (
            relativeIndex < 0 &&
            this.relativeStart < Math.abs(relativeIndex)
        ) {
            return this.absoluteLength + this.relativeStart + relativeIndex;
        }
        return this.relativeStart + relativeIndex;
    }

    public getAbsolute(index: number): DataTable.Row<T> {
        return this.dataSet[index];
    }

    public getRelative(index: number): DataTable.Row<T> {
        return this.dataSet[this.absolutePosition(index)];
    }

    public setAbsolute(
        dataRow: DataTable.Row<T>,
        index: number = this.absoluteLength
    ): DataTable<T> {
        this.dataSet[index] = dataRow;
        ++this.absoluteLength;
        return this;
    }

    public setRelative(
        dataRow: DataTable.Row<T>,
        index: number = this.relativeLength
    ): DataTable<T> {
        this.dataSet[this.absolutePosition(index)] = dataRow;
        ++this.absoluteLength;
        ++this.relativeLength;
        return this;
    }

}

namespace DataTable {
    export type Row<T> = Record<string, T>;
    export type Set<T> = Array<DataTable.Row<T>>;
}

export default DataTable;
