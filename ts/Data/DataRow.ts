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
import DataJSON from './DataJSON.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge,
    uniqueKey
} = U;

/** eslint-disable valid-jsdoc */

class DataRow implements DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: DataRow.ClassJSON): DataRow {
        const keys = Object.keys(json).reverse(),
            columns: DataRow.Columns = {};

        let key: (string|undefined),
            value;

        while (typeof (key = keys.pop()) !== 'undefined') {

            if (key === '$class') {
                continue;
            }

            value = json[key];

            if (
                typeof value === 'object' &&
                value !== null
            ) {
                if (value instanceof Array) {
                    columns[key] = DataJSON.fromJSON({
                        $class: 'DataTable',
                        rows: value
                    }) as DataTable;
                } else {
                    columns[key] = DataJSON.fromJSON(value) as DataTable;
                }
            } else {
                columns[key] = value;
            }
        }

        return new DataRow(columns);
    }

    /* *
     *
     *  Constructors
     *
     * */

    constructor(
        columns: DataRow.Columns = {},
        converter: DataConverter = new DataConverter()
    ) {
        columns = merge(columns);

        this.autoId = false;
        this.columnKeys = Object.keys(columns);
        this.columns = columns;
        this.converter = converter;

        if (typeof columns.id === 'string') {
            this.id = columns.id;
        } else {
            this.autoId = true;
            this.id = uniqueKey();
        }

        delete columns.id;
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly autoId: boolean;

    private columnKeys: Array<string>;

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

        let succeeded = false;

        fireEvent(
            row,
            'clearRow',
            {},
            function (): void {
                row.columnKeys.length = 0;
                row.columns.length = 0;
                succeeded = true;
                fireEvent(row, 'afterClearRow', {});
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
                row.columnKeys.splice(row.columnKeys.indexOf(e.columnKey), 1);
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

    public getColumn(column: (number|string)): DataRow.ColumnTypes {

        if (typeof column === 'number') {
            return this.columns[this.columnKeys[column]];
        }

        return this.columns[column];
    }

    public getColumnAsBoolean(column: (number|string)): boolean {
        return this.converter.asBoolean(this.getColumn(column));
    }

    public getColumnAsDataTable(column: (number|string)): DataTable {
        return this.converter.asDataTable(this.getColumn(column));
    }

    public getColumnAsDate(column: (number|string)): Date {
        return this.converter.asDate(this.getColumn(column));
    }

    public getColumnAsNumber(column: (number|string)): number {
        return this.converter.asNumber(this.getColumn(column));
    }

    public getColumnAsString(column: (number|string)): string {
        return this.converter.asString(this.getColumn(column));
    }

    public getColumnCount(): number {
        return this.getColumnKeys().length;
    }

    public getColumnKeys(): Array<string> {
        return this.columnKeys.slice();
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
                row.columnKeys.push(columnKey);
                row.columns[columnKey] = columnValue;
                succeeded = true;
                fireEvent(row, 'afterInsertColumn', { columnKey, columnValue });
            }
        );

        return succeeded;
    }

    public on(
        event: (DataRow.ColumnEvents|DataRow.RowEvents),
        callback: (DataRow.ColumnEventCallback|DataRow.RowEventCallback)
    ): Function {
        return addEvent(this, event, callback);
    }

    public toJSON(): DataRow.ClassJSON {
        const columns = this.getAllColumns(),
            columnKeys = Object.keys(columns),
            json: DataRow.ClassJSON = {
                $class: 'DataRow'
            };

        let key: string,
            value: DataRow.ColumnTypes;

        if (!this.autoId) {
            json.id = this.id;
        }

        for (let i = 0, iEnd = columnKeys.length; i < iEnd; ++i) {
            key = columnKeys[i];
            value = columns[key];

            /* eslint-disable @typescript-eslint/indent */
            switch (typeof value) {
                default:
                    if (value === null) {
                        json[key] = value;
                    } else if (value instanceof Date) {
                        json[key] = value.getTime();
                    } else { // DataTable
                        json[key] = value.toJSON();
                    }
                    continue;
                case 'undefined':
                    continue;
                case 'boolean':
                case 'number':
                case 'string':
                    json[key] = value;
                    continue;
            }
        }

        return json;
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
        'deleteColumn'|'afterDeleteColumn'|
        'insertColumn'|'afterInsertColumn'|
        'updateColumn'|'afterUpdateColumn'
    );

    export type Columns = Record<string, ColumnTypes>;

    export type ColumnTypes = (boolean|null|number|string|Date|DataTable|undefined);

    export type RowEvents = (
        'clearRow'|'afterClearRow'
    );

    export interface ClassJSON extends DataJSON.ClassJSON {
        [key: string]: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataRow.ClassJSON>);
    }

    export interface ColumnEventCallback {
        (this: DataRow, e: ColumnEventObject): void;
    }

    export interface ColumnEventObject {
        readonly columnKey: string;
        readonly columnValue: ColumnTypes;
        readonly type: ColumnEvents;
    }

    export interface RowEventCallback {
        (this: DataRow, e: RowEventObject): void;
    }

    export interface RowEventObject {
        readonly type: RowEvents;
    }

}

DataJSON.addClass(DataRow);

export default DataRow;
