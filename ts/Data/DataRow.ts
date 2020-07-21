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

import type DataTable from './DataTable';
import DataConverter from './DataConverter.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;

/** eslint-disable valid-jsdoc */

class DataRow {

    /* *
     *
     *  Constructors
     *
     * */

    constructor(
        columns: DataRow.Columns = {},
        converter: DataConverter = new DataConverter()
    ) {
        this.columns = columns;
        this.converter = converter;
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataRow.Columns;

    private converter: DataConverter;

    /* *
     *
     *  Functions
     *
     * */

    public addColumn(key: string, value: DataRow.ColumnTypes): boolean {
        const row = this;
        if (row.getColumnKeys().indexOf(key) !== -1) {
            return false;
        }
        fireEvent(
            row,
            'newColumn',
            { key, value },
            function (e: DataRow.ColumnEventObject): void {
                row.columns[e.key] = e.value;
            }
        );
        return true;
    }

    public getColumn(key: string): DataRow.ColumnTypes {
        return this.columns[key];
    }

    public getColumnAsBoolean(key: string): boolean {
        return this.converter.toBoolean(this.getColumn(key));
    }

    public getColumnAsDataTable(key: string): DataTable {
        return this.converter.toDataTable(this.getColumn(key));
    }

    public getColumnAsDate(key: string): Date {
        return this.converter.toDate(this.getColumn(key));
    }

    public getColumnAsNumber(key: string): number {
        return this.converter.toNumber(this.getColumn(key));
    }

    public getColumnAsString(key: string): string {
        return this.converter.toString(this.getColumn(key));
    }

    public getColumnKeys(unfiltered: boolean = false): Array<string> {
        return Object.keys(this.columns).reverse();
    }

    public on(event: DataRow.ColumnEvents, listener: DataRow.ColumnEventListener): Function {
        return addEvent(this, event, listener);
    }

    public removeColumn(key: string): void {
        delete this.columns[key];
    }

    public setColumn(key: string, value: DataRow.ColumnTypes): void {
        const row = this;
        fireEvent(
            row,
            'changeColumn',
            { key, value },
            function (e: DataRow.ColumnEventObject): void {
                row.columns[e.key] = e.value;
            }
        );
    }

}

namespace DataRow {
    export type Columns = Record<string, ColumnTypes>;
    export type ColumnTypes = (boolean|null|number|string|Date|DataTable|undefined);
    export type ColumnEvents = ('changeColumn'|'deleteColumn'|'addColumn');
    export interface ColumnEventListener {
        (this: DataRow, e: ColumnEventObject): void;
    }
    export interface ColumnEventObject {
        key: string;
        value: ColumnTypes;
    }
}

export default DataRow;
