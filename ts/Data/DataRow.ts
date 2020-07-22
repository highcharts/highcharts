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
    fireEvent,
    merge,
    uniqueKey
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
        this.columns = columns = merge(columns);
        this.converter = converter;

        if (typeof columns.id === 'string') {
            this.id = columns.id;
        } else {
            this.id = uniqueKey();
        }

        delete columns.id;
    }

    /* *
     *
     *  Properties
     *
     * */

    private columns: DataRow.Columns;

    private converter: DataConverter;

    public readonly id: string;

    /* *
     *
     *  Functions
     *
     * */

    public clear(): void {
        const columnKeys = this.getColumnKeys();
    }

    public delete(columnKey: string): void {
        const row = this;
        const columnValue = row.columns[columnKey];
        if (columnKey === 'id') {
            return;
        }
        fireEvent(
            row,
            'deleteColumn',
            { columnKey, columnValue },
            function (e: DataRow.ColumnEventObject): void {
                delete row.columns[e.columnKey];
                fireEvent(row, 'afterDeleteColumn', { columnKey, columnValue });
            }
        );
    }

    public get(columnKey: string): DataRow.ColumnTypes {
        return this.columns[columnKey];
    }

    public getAllColumns(): DataRow.Columns {
        return merge(this.columns);
    }

    public getAsBoolean(columnKey: string): boolean {
        return this.converter.toBoolean(this.get(columnKey));
    }

    public getAsDataTable(columnKey: string): DataTable {
        return this.converter.toDataTable(this.get(columnKey));
    }

    public getAsDate(columnKey: string): Date {
        return this.converter.toDate(this.get(columnKey));
    }

    public getAsNumber(columnKey: string): number {
        return this.converter.toNumber(this.get(columnKey));
    }

    public getAsString(columnKey: string): string {
        return this.converter.toString(this.get(columnKey));
    }

    public getColumnKeys(unfiltered: boolean = false): Array<string> {
        return Object.keys(this.columns).reverse();
    }

    public insert(columnKey: string, columnValue: DataRow.ColumnTypes): boolean {
        const row = this;
        if (
            columnKey === 'id' ||
            row.getColumnKeys().indexOf(columnKey) !== -1
        ) {
            return false;
        }
        fireEvent(
            row,
            'insertColumn',
            { columnKey, columnValue },
            function (): void {
                row.columns[columnKey] = columnValue;
                fireEvent(row, 'afterInsertColumn', { columnKey, columnValue });
            }
        );
        return true;
    }

    public on(
        event: DataRow.ColumnEvents,
        callback: DataRow.ColumnEventListener
    ): Function {
        return addEvent(this, event, callback);
    }

    public update(columnKey: string, columnValue: DataRow.ColumnTypes): void {
        const row = this;
        if (columnKey === 'id') {
            return;
        }
        fireEvent(
            row,
            'updateColumn',
            { columnKey, columnValue },
            function (): void {
                row.columns[columnKey] = columnValue;
                fireEvent(row, 'afterUpdateColumn', { columnKey, columnValue });
            }
        );
    }

}

namespace DataRow {
    export type ColumnEvents = (
        'afterDeleteColumn'|'afterInsertColumn'|'afterUpdateColumn'|'deleteColumn'|'insertColumn'|'updateColumn'
    );
    export type Columns = Record<string, ColumnTypes>;
    export type ColumnTypes = (boolean|null|number|string|Date|DataTable|undefined);
    export interface ColumnEventListener {
        (this: DataRow, e: ColumnEventObject): void;
    }
    export interface ColumnEventObject {
        readonly columnKey: string;
        readonly columnValue: ColumnTypes;
    }
}

export default DataRow;
