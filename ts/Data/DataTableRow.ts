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
class DataTableRow
implements DataEventEmitter<DataTableRow.EventObject>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a supported class JSON to a DataTableRow instance.
     *
     * @param {DataTableRow.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataTableRow}
     * DataTableRow instance from the class JSON.
     */
    public static fromJSON(json: DataTableRow.ClassJSON): DataTableRow {
        const keys = Object.keys(json).reverse(),
            columns: DataTableRow.Columns = {};

        let columnName: (string|undefined),
            columnValue: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataTableRow.ClassJSON>),
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

        return new DataTableRow(columns);
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the DataTableRow class.
     *
     * @param {DataTableRow.Columns} [columns]
     * Column values in a record object.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions.
     */
    constructor(
        columns: DataTableRow.Columns = {},
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
    private columns: DataTableRow.Columns;

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
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataTableRow#clearRow
     * @emits DataTableRow#afterClearRow
     */
    public clear(eventDetail?: Record<string, string>): void {

        this.emit({ type: 'clearRow', detail: eventDetail });

        this.columnNames.length = 0;
        this.columns.length = 0;

        this.emit({ type: 'afterClearRow', detail: eventDetail });
    }

    /**
     * Deletes a column in this row.
     *
     * @param {string} columnName
     * Name of the column to delete.
     *
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the delete was successful, otherwise false.
     *
     * @emits DataTableRow#deleteColumn
     * @emits DataTableRow#afterDeleteColumn
     */
    public deleteColumn(
        columnName: string,
        eventDetail?: Record<string, string>
    ): boolean {
        const row = this,
            columnValue = row.columns[columnName];

        if (columnName === 'id') {
            return false;
        }

        this.emit({
            type: 'deleteColumn',
            columnName: columnName,
            columnValue,
            detail: eventDetail
        });

        row.columnNames.splice(row.columnNames.indexOf(columnName), 1);
        delete row.columns[columnName];

        this.emit({
            type: 'afterDeleteColumn',
            columnName: columnName,
            columnValue,
            detail: eventDetail
        });

        return true;
    }

    /**
     * Emits an event on this row to all registered callbacks of the given
     * event.
     *
     * @param {DataTableRow.EventObject} e
     * Event object with event information.
     */
    public emit(e: DataTableRow.EventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Returns a copy of the record object of all columnNames with their values.
     *
     * @return {DataTableRow.Columns}
     * Copy of the record object of all columnNames with their values.
     */
    public getAllColumns(): DataTableRow.Columns {
        return merge(this.columns);
    }

    /**
     * Returns the value of the given column name or column index.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {DataTableRow.ColumnValueType}
     * Column value of the column in this row.
     */
    public getColumn(column: (number|string)): DataTableRow.ColumnValueType {

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
     * @param {DataTableRow.ColumnValueType} columnValue
     * Value of the column in this row.
     *
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the column was added to the row. Returns false, if
     * `id` was used the column name, or if the column already exists.
     *
     * @emits DataTableRow#insertColumn
     * @emits DataTableRow#afterInsertColumn
     */
    public insertColumn(
        columnName: string,
        columnValue: DataTableRow.ColumnValueType,
        eventDetail?: Record<string, string>
    ): boolean {

        if (
            columnName === 'id' ||
            this.columnNames.indexOf(columnName) !== -1
        ) {
            return false;
        }

        this.emit({
            type: 'insertColumn',
            columnName,
            columnValue,
            detail: eventDetail
        });

        this.columnNames.push(columnName);
        this.columns[columnName] = columnValue;

        this.emit({
            type: 'afterInsertColumn',
            columnName,
            columnValue,
            detail: eventDetail
        });

        return true;
    }

    /**
     * Registers a callback for a specific event.
     *
     * @param {DataTableRow.EventTypes} type
     * Event type as a string.
     *
     * @param {DataTableRow.EventCallbacks} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    public on(
        type: DataTableRow.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataTableRow.EventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Converts the row to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this row.
     */
    public toJSON(): DataTableRow.ClassJSON {
        const columns = this.getAllColumns(),
            columnKeys = Object.keys(columns),
            json: DataTableRow.ClassJSON = {
                $class: 'DataTableRow'
            };

        let key: string,
            value: DataTableRow.ColumnValueType;

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
     * @param {string} columnName
     * Column name in this row to update.
     *
     * @param {DataTableRow.ColumnValueType} columnValue
     * Column value to update to.
     *
     * @param {Record<string, string>} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * True, if the column was found and updated, otherwise false.
     *
     * @emits DataTableRow#updateColumn
     * @emits DataTableRow#afterUpdateColumn
     */
    public updateColumn(
        columnName: string,
        columnValue: DataTableRow.ColumnValueType,
        eventDetail?: Record<string, string>
    ): boolean {
        const row = this;

        if (columnName === 'id') {
            return false;
        }

        row.emit({
            type: 'updateColumn',
            columnName,
            columnValue,
            detail: eventDetail
        });

        row.columns[columnName] = columnValue;

        row.emit({ type: 'afterUpdateColumn', columnName, columnValue });

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
namespace DataTableRow {

    /**
     * Event types related to a column of a row.
     */
    export type ColumnEventType = (
        'deleteColumn'|'afterDeleteColumn'|
        'insertColumn'|'afterInsertColumn'|
        'updateColumn'|'afterUpdateColumn'
    );

    /**
     * Record object with column names and their values in a row.
     */
    export type Columns = Record<string, ColumnValueType>;

    /**
     * Possible value types for a column in a row.
     *
     * *Please note:* `Date` and `DataTable` are not JSON-compatible and have
     * to be converted with the help of their `toJSON()` function.
     */
    export type ColumnValueType = (
        boolean|null|number|string|Date|DataTable|undefined
    );

    /**
     * All information objects of DataTableRow events.
     */
    export type EventObject = (ColumnEventObject|RowEventObject);

    /**
     * Event types related to the row itself.
     */
    export type RowEventType = (
        'clearRow'|'afterClearRow'
    );

    /**
     * Describes the class JSON of a DataTableRow.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        [key: string]: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataTableRow.ClassJSON>);
    }

    /**
     * Describes the information object for column-related events.
     */
    export interface ColumnEventObject extends DataEventEmitter.EventObject {
        readonly type: ColumnEventType;
        readonly columnName: string;
        readonly columnValue: ColumnValueType;
    }

    /**
     * Describes the information object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        readonly type: RowEventType;
    }

}

/* *
 *
 *  Register
 *
 * */

DataJSON.addClass(DataTableRow);

/* *
 *
 *  Export
 *
 * */

export default DataTableRow;
