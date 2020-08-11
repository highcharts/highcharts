/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

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

/* *
 *
 *  Class
 *
 * */

/**
 * Class to manage a row with column values.
 */
class DataRow implements DataEventEmitter, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a supported class JSON to a DataRow instance.
     *
     * @param {DataRow.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataRow}
     * DataRow instance from the class JSON.
     */
    public static fromJSON(json: DataRow.ClassJSON): DataRow {
        const keys = Object.keys(json).reverse(),
            columns: DataRow.Columns = {};

        let columnName: (string|undefined),
            columnValue: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataRow.ClassJSON>),
            table: DataTable;

        while (typeof (columnName = keys.pop()) !== 'undefined') {

            if (columnName === '$class') {
                continue;
            }

            columnValue = json[columnName];

            if (
                typeof columnValue === 'object' &&
                columnValue !== null
            ) {
                if (columnValue instanceof Array) {
                    columns[columnName] = DataJSON.fromJSON({
                        $class: 'DataTable',
                        rows: columnValue
                    }) as DataTable;
                } else {
                    table = DataJSON.fromJSON(columnValue) as DataTable;
                    table.id = columnName;
                    columns[columnName] = table;
                }
            } else {
                columns[columnName] = columnValue;
            }
        }

        return new DataRow(columns);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the DataRow class.
     *
     * @param {DataRow.Columns} [columns]
     * Column values in a record object.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions.
     */
    constructor(
        columns: DataRow.Columns = {},
        converter: DataConverter = new DataConverter()
    ) {
        columns = merge(columns);

        this.autoId = false;
        this.columnNames = Object.keys(columns);
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

    /**
     * Indicates an automatically generated id, if no id column was provided.
     */
    public autoId: boolean;

    /**
     * Names of all containing columns.
     * @private
     */
    private columnNames: Array<string>;

    /**
     * Record object of all columnNames with their values in this rows.
     * @private
     */
    private columns: DataRow.Columns;

    /**
     * Converter for value conversions.
     */
    public converter: DataConverter;

    /**
     * ID to distinguish the row in a table from other rows.
     */
    public id: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Removes all columns with the values from this row.
     *
     * @emits DataRow#clearRow
     * @emits DataRow#afterClearRow
     */
    public clear(): void {

        this.emit('clearRow', {});

        this.columnNames.length = 0;
        this.columns.length = 0;

        this.emit('afterClearRow', {});
    }

    /**
     * Deletes a column in this row.
     *
     * @param {string} columnName
     * Name of the column to delete.
     *
     * @return {boolean}
     * Returns true, if the delete was successful, otherwise false.
     *
     * @emits DataRow#deleteColumn
     * @emits DataRow#afterDeleteColumn
     */
    public deleteColumn(columnName: string): boolean {
        const row = this,
            columnValue = row.columns[columnName];

        if (columnName === 'id') {
            return false;
        }

        this.emit('deleteColumn', { columnKey: columnName, columnValue });

        row.columnNames.splice(row.columnNames.indexOf(columnName), 1);
        delete row.columns[columnName];

        this.emit('afterDeleteColumn', { columnKey: columnName, columnValue });

        return true;
    }

    /**
     * Emits an event on this row to all registered callbacks of the given
     * event.
     *
     * @param {DataRow.EventTypes} type
     * Event type as a string.
     *
     * @param {DataRow.EventObjects} [e]
     * Event object with additional event information.
     */
    public emit(type: DataRow.EventTypes, e?: DataRow.EventObjects): void {
        fireEvent(this, type, e);
    }

    /**
     * Returns a copy of the record object of all columnNames with their values.
     *
     * @return {DataRow.Columns}
     * Copy of the record object of all columnNames with their values.
     */
    public getAllColumns(): DataRow.Columns {
        return merge(this.columns);
    }

    /**
     * Returns the value of the given column name or column index.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {DataRow.ColumnTypes}
     * Column value of the column in this row.
     */
    public getColumn(column: (number|string)): DataRow.ColumnTypes {

        if (typeof column === 'number') {
            return this.columns[this.columnNames[column]];
        }

        return this.columns[column];
    }

    /**
     * Converts the value of the given column name or column index to a boolean
     * and returns it.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {boolean}
     * Converted column value of the column in this row.
     */
    public getColumnAsBoolean(column: (number|string)): boolean {
        return this.converter.asBoolean(this.getColumn(column));
    }

    /**
     * Converts the value of the given column name or column index to a
     * DataTable and returns it.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {DataTable}
     * Converted column value of the column in this row.
     */
    public getColumnAsDataTable(column: (number|string)): DataTable {
        return this.converter.asDataTable(this.getColumn(column));
    }

    /**
     * Converts the value of the given column name or column index to a Date and
     * returns it.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {Date}
     * Converted column value of the column in this row.
     */
    public getColumnAsDate(column: (number|string)): Date {
        return this.converter.asDate(this.getColumn(column));
    }

    /**
     * Converts the value of the given column name or column index to a number
     * and returns it.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {number}
     * Converted column value of the column in this row.
     */
    public getColumnAsNumber(column: (number|string)): number {
        return this.converter.asNumber(this.getColumn(column));
    }

    /**
     * Converts the value of the given column name or column index to a string
     * and returns it.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {string}
     * Converted column value of the column in this row.
     */
    public getColumnAsString(column: (number|string)): string {
        return this.converter.asString(this.getColumn(column));
    }

    /**
     * Returns the number of columns in this row.
     *
     * @return {number}
     * Number of columns in this row.
     */
    public getColumnCount(): number {
        return this.getColumnNames().length;
    }

    /**
     * Returns the column names in this row.
     *
     * @return {Array<string>}
     * Column names in this row.
     */
    public getColumnNames(): Array<string> {
        return this.columnNames.slice();
    }

    /**
     * Adds a column to this row.
     *
     * @param {string} columnName
     * Name of the column.
     *
     * @param {DataRow.ColumnTypes} columnValue
     * Value of the column in this row.
     *
     * @return {boolean}
     * Returns true, if the column was added to the row. Returns false, if
     * `id` was used the column name, or if the column already exists.
     */
    public insertColumn(
        columnName: string,
        columnValue: DataRow.ColumnTypes
    ): boolean {

        if (
            columnName === 'id' ||
            this.columnNames.indexOf(columnName) !== -1
        ) {
            return false;
        }

        this.emit('insertColumn', { columnKey: columnName, columnValue });

        this.columnNames.push(columnName);
        this.columns[columnName] = columnValue;

        this.emit('afterInsertColumn', { columnKey: columnName, columnValue });

        return true;
    }

    /**
     * Registers a callback for a specific event.
     *
     * @param {DataRow.EventTypes} type
     * Event type as a string.
     *
     * @param {DataRow.EventCallbacks} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    public on(
        type: DataRow.EventTypes,
        callback: DataRow.EventCallbacks
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Converts the row to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this row.
     */
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

    /**
     * Updates the value of a column in this row.
     *
     * @param {string} columnKey
     * Column name in this row to update.
     *
     * @param {DataRow.ColumnTypes} columnValue
     * Column value to update to.
     *
     * @return {boolean}
     * True, if the column was found and updated, otherwise false.
     */
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

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for columns, events, and JSON conversion.
 */
namespace DataRow {

    /**
     * Event types related to a column of a row.
     */
    export type ColumnEventTypes = (
        'deleteColumn'|'afterDeleteColumn'|
        'insertColumn'|'afterInsertColumn'|
        'updateColumn'|'afterUpdateColumn'
    );

    /**
     * Record object with column names and their values in a row.
     */
    export type Columns = Record<string, ColumnTypes>;

    /**
     * Possible value types for a column in a row.
     *
     * *Please note:* `Date` and `DataTable` are not JSON-compatible and have
     * to be converted with the help of their `toJSON()` function.
     */
    export type ColumnTypes = (boolean|null|number|string|Date|DataTable|undefined);

    /**
     * All callback types of DataRow events.
     */
    export type EventCallbacks = (ColumnEventCallback|RowEventCallback);

    /**
     * All information objects of DataRow events.
     */
    export type EventObjects = (ColumnEventObject|RowEventObject);

    /**
     * All types of DataRow events.
     */
    export type EventTypes = (ColumnEventTypes|RowEventTypes);

    /**
     * Event types related to the row itself.
     */
    export type RowEventTypes = (
        'clearRow'|'afterClearRow'
    );

    /**
     * Describes the class JSON of a DataRow.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        [key: string]: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataRow.ClassJSON>);
    }

    /**
     * Describes the callback for column-related events.
     */
    export interface ColumnEventCallback extends DataEventEmitter.EventCallback {
        (this: DataRow, e: ColumnEventObject): void;
    }

    /**
     * Describes the information object for column-related events.
     */
    export interface ColumnEventObject extends DataEventEmitter.EventObject {
        readonly columnKey: string;
        readonly columnValue: ColumnTypes;
    }

    /**
     * Describes the callback for row-related events.
     */
    export interface RowEventCallback extends DataEventEmitter.EventCallback {
        (this: DataRow, e: RowEventObject): void;
    }

    /**
     * Describes the information object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        // nothing here yet
    }

}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(DataRow);

/* *
 *
 *  Export
 *
 * */

export default DataRow;
