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

    public clear(): boolean {
        const row = this;
        const columnKey = row.getColumnKeys()[0] || '';
        const columnValue = row.columns[columnKey];

        let succeeded = false;

        fireEvent(
            row,
            'clearRow',
            { columnKey, columnValue },
            function (): void {
                row.columns.length = 0;
                succeeded = true;
                fireEvent(row, 'afterClearRow', { columnKey, columnValue });
            }
        );

        return succeeded;
    }

    public deleteColumn(columnKey: string): boolean {
        const row = this;
        const columnValue = row.columns[columnKey];

        let succeeded = false;

        if (columnKey === 'id') {
            return succeeded;
        }

        fireEvent(
            row,
            'deleteColumn',
            { columnKey, columnValue },
            function (e: DataRow.ColumnEventObject): void {
                delete row.columns[e.columnKey];
                succeeded = true;
                fireEvent(row, 'afterDeleteColumn', { columnKey, columnValue });
            }
        );

        return succeeded;
    }

    public getAllColumns(): DataRow.Columns {
        return merge(this.columns);
    }

    public getColumn(columnKey: string): DataRow.ColumnTypes {
        return this.columns[columnKey];
    }

    public getColumnAsBoolean(columnKey: string): boolean {
        return this.converter.asBoolean(this.getColumn(columnKey));
    }

    public getColumnAsDataTable(columnKey: string): DataTable {
        return this.converter.asDataTable(this.getColumn(columnKey));
    }

    public getColumnAsDate(columnKey: string): Date {
        return this.converter.asDate(this.getColumn(columnKey));
    }

    public getColumnAsNumber(columnKey: string): number {
        return this.converter.asNumber(this.getColumn(columnKey));
    }

    public getColumnAsString(columnKey: string): string {
        return this.converter.asString(this.getColumn(columnKey));
    }

    public getColumnCount(): number {
        return this.getColumnKeys().length;
    }

    public getColumnKeys(): Array<string> {
        return Object.keys(this.columns);
    }

    public insertColumn(
        columnKey: string,
        columnValue: DataRow.ColumnTypes
    ): boolean {
        const row = this;

        let succeeded = false;

        if (
            columnKey === 'id' ||
            row.getColumnKeys().indexOf(columnKey) !== -1
        ) {
            return succeeded;
        }

        fireEvent(
            row,
            'insertColumn',
            { columnKey, columnValue },
            function (): void {
                row.columns[columnKey] = columnValue;
                succeeded = true;
                fireEvent(row, 'afterInsertColumn', { columnKey, columnValue });
            }
        );

        return succeeded;
    }

    public on(
        event: DataRow.ColumnEvents,
        callback: DataRow.ColumnEventListener
    ): Function {
        return addEvent(this, event, callback);
    }

    public updateColumn(
        columnKey: string,
        columnValue: DataRow.ColumnTypes
    ): boolean {
        const row = this;

        let succeeded = false;

        if (columnKey === 'id') {
            return succeeded;
        }

        fireEvent(
            row,
            'updateColumn',
            { columnKey, columnValue },
            function (): void {
                row.columns[columnKey] = columnValue;
                succeeded = true;
                fireEvent(row, 'afterUpdateColumn', { columnKey, columnValue });
            }
        );

        return succeeded;
    }

}

namespace DataRow {

    export type ColumnEvents = (
        'clearRow'|'afterClearRow'|
        'deleteColumn'|'afterDeleteColumn'|
        'insertColumn'|'afterInsertColumn'|
        'updateColumn'|'afterUpdateColumn'
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
