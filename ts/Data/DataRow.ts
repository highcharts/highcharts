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

    public add(columnKey: string, columnValue: DataRow.ColumnTypes): boolean {
        const row = this;
        if (row.getColumnKeys().indexOf(columnKey) !== -1) {
            return false;
        }
        fireEvent(
            row,
            'newColumn',
            { columnKey, columnValue },
            function (e: DataRow.ColumnEventObject): void {
                row.columns[e.columnKey] = e.columnValue;
            }
        );
        return true;
    }

    public get(columnKey: string): DataRow.ColumnTypes {
        return this.columns[columnKey];
    }

    public getBoolean(columnKey: string): boolean {
        return this.converter.toBoolean(this.get(columnKey));
    }

    public getDataTable(columnKey: string): DataTable {
        return this.converter.toDataTable(this.get(columnKey));
    }

    public getDate(columnKey: string): Date {
        return this.converter.toDate(this.get(columnKey));
    }

    public getNumber(columnKey: string): number {
        return this.converter.toNumber(this.get(columnKey));
    }

    public getString(columnKey: string): string {
        return this.converter.toString(this.get(columnKey));
    }

    public getColumnKeys(unfiltered: boolean = false): Array<string> {
        return Object.keys(this.columns).reverse();
    }

    public on(
        event: DataRow.ColumnEvents,
        callback: DataRow.ColumnEventListener
    ): Function {
        return addEvent(this, event, callback);
    }

    public remove(columnKey: string): void {
        const row = this;
        fireEvent(
            row,
            'deleteColumn',
            { columnKey, columnValue: row.columns[columnKey] },
            function (e: DataRow.ColumnEventObject): void {
                delete row.columns[e.columnKey];
            }
        );
    }

    public set(columnKey: string, columnValue: DataRow.ColumnTypes): void {
        const row = this;
        fireEvent(
            row,
            'changeColumn',
            { columnKey, columnValue },
            function (e: DataRow.ColumnEventObject): void {
                row.columns[e.columnKey] = e.columnValue;
            }
        );
    }

}

namespace DataRow {
    export type Columns = Record<string, ColumnTypes>;
    export type ColumnTypes = (boolean|null|number|string|Date|DataTable|undefined);
    export type ColumnEvents = ('changeColumn'|'deleteColumn'|'newColumn');
    export interface ColumnEventListener {
        (this: DataRow, e: ColumnEventObject): void;
    }
    export interface ColumnEventObject {
        columnKey: string;
        columnValue: ColumnTypes;
    }
}

export default DataRow;
