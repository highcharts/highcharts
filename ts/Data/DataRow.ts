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

import type DataEventEmitter from './DataEventEmitter';
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

class DataRow implements DataEventEmitter<DataRow.EventTypes>, DataJSON.Class {

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

        this.emit('clearRow', {});

        this.columnKeys.length = 0;
        this.columns.length = 0;

        this.emit('afterClearRow', {});

        return true;
    }

    public deleteColumn(columnKey: string): boolean {
        const row = this,
            columnValue = row.columns[columnKey];

        if (columnKey === 'id') {
            return false;
        }

        this.emit('deleteColumn', { columnKey, columnValue });

        row.columnKeys.splice(row.columnKeys.indexOf(columnKey), 1);
        delete row.columns[columnKey];

        this.emit('afterDeleteColumn', { columnKey, columnValue });

        return true;
    }

    public emit(type: DataRow.EventTypes, e: DataRow.EventObjects): void {
        fireEvent(this, type, e);
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

        if (
            columnKey === 'id' ||
            this.columnKeys.indexOf(columnKey) !== -1
        ) {
            return false;
        }

        this.emit('insertColumn', { columnKey, columnValue });

        this.columnKeys.push(columnKey);
        this.columns[columnKey] = columnValue;

        this.emit('afterInsertColumn', { columnKey, columnValue });

        return true;
    }

    public on(
        event: DataRow.EventTypes,
        callback: DataRow.EventCallbacks<this>
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

        if (columnKey === 'id') {
            return false;
        }

        fireEvent(row, 'updateColumn', { columnKey, columnValue });

        row.columns[columnKey] = columnValue;

        fireEvent(row, 'afterUpdateColumn', { columnKey, columnValue });

        return true;
    }

}

namespace DataRow {

    export type ColumnEventTypes = (
        'deleteColumn'|'afterDeleteColumn'|
        'insertColumn'|'afterInsertColumn'|
        'updateColumn'|'afterUpdateColumn'
    );

    export type Columns = Record<string, ColumnTypes>;

    export type ColumnTypes = (boolean|null|number|string|Date|DataTable|undefined);

    export type EventCallbacks<TThis> = (ColumnEventCallback<TThis>|RowEventCallback<TThis>);

    export type EventObjects = (ColumnEventObject|RowEventObject);

    export type EventTypes = (ColumnEventTypes|RowEventTypes);

    export type RowEventTypes = (
        'clearRow'|'afterClearRow'
    );

    export interface ClassJSON extends DataJSON.ClassJSON {
        [key: string]: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataRow.ClassJSON>);
    }

    export interface ColumnEventCallback<TThis> extends DataEventEmitter.EventCallback<TThis, ColumnEventTypes> {
        (this: TThis, e: ColumnEventObject): void;
    }

    export interface ColumnEventObject extends DataEventEmitter.EventObject<ColumnEventTypes> {
        readonly columnKey: string;
        readonly columnValue: ColumnTypes;
    }

    export interface RowEventCallback<TThis> extends DataEventEmitter.EventCallback<TThis, RowEventTypes> {
        (this: TThis, e: RowEventObject): void;
    }

    export interface RowEventObject extends DataEventEmitter.EventObject<RowEventTypes> {
        // nothing here yet
    }

}

DataJSON.addClass(DataRow);

export default DataRow;
