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
import DataConverter from './DataConverter.js';
import DataJSON from './DataJSON.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, merge = U.merge, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
/**
 * Class to manage a row with column values.
 */
var DataTableRow = /** @class */ (function () {
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
    function DataTableRow(columns, converter) {
        if (columns === void 0) { columns = {}; }
        if (converter === void 0) { converter = new DataConverter(); }
        columns = merge(columns);
        this.autoId = false;
        this.columnNames = Object.keys(columns);
        this.columns = columns;
        this.converter = converter;
        if (typeof columns.id === 'string') {
            this.id = columns.id;
        }
        else {
            this.autoId = true;
            this.id = uniqueKey();
        }
        delete columns.id;
    }
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
    DataTableRow.fromJSON = function (json) {
        var keys = Object.keys(json).reverse(), columns = {};
        var columnName, columnValue, table;
        while (typeof (columnName = keys.pop()) !== 'undefined') {
            if (columnName === '$class') {
                continue;
            }
            columnValue = json[columnName];
            if (typeof columnValue === 'object' &&
                columnValue !== null) {
                if (columnValue instanceof Array) {
                    columns[columnName] = DataJSON.fromJSON({
                        $class: 'DataTable',
                        rows: columnValue
                    });
                }
                else {
                    table = DataJSON.fromJSON(columnValue);
                    table.id = columnName;
                    columns[columnName] = table;
                }
            }
            else {
                columns[columnName] = columnValue;
            }
        }
        return new DataTableRow(columns);
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Removes all columns with the values from this row.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataTableRow#clearRow
     * @emits DataTableRow#afterClearRow
     */
    DataTableRow.prototype.clear = function (eventDetail) {
        this.emit({ type: 'clearRow', detail: eventDetail });
        this.columnNames.length = 0;
        this.columns.length = 0;
        this.emit({ type: 'afterClearRow', detail: eventDetail });
    };
    /**
     * Deletes a column in this row.
     *
     * @param {string} columnName
     * Name of the column to delete.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the delete was successful, otherwise false.
     *
     * @emits DataTableRow#deleteColumn
     * @emits DataTableRow#afterDeleteColumn
     */
    DataTableRow.prototype.deleteColumn = function (columnName, eventDetail) {
        var row = this, columnValue = row.columns[columnName];
        if (columnName === 'id') {
            return false;
        }
        this.emit({
            type: 'deleteColumn',
            columnName: columnName,
            columnValue: columnValue,
            detail: eventDetail
        });
        row.columnNames.splice(row.columnNames.indexOf(columnName), 1);
        delete row.columns[columnName];
        this.emit({
            type: 'afterDeleteColumn',
            columnName: columnName,
            columnValue: columnValue,
            detail: eventDetail
        });
        return true;
    };
    /**
     * Emits an event on this row to all registered callbacks of the given
     * event.
     *
     * @param {DataTableRow.EventObject} e
     * Event object with event information.
     */
    DataTableRow.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    /**
     * Returns a copy of the record object of all columnNames with their values.
     *
     * @return {DataTableRow.Columns}
     * Copy of the record object of all columnNames with their values.
     */
    DataTableRow.prototype.getAllColumns = function () {
        return merge(this.columns);
    };
    /**
     * Returns the value of the given column name or column index.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {DataTableRow.ColumnValueType}
     * Column value of the column in this row.
     */
    DataTableRow.prototype.getColumn = function (column) {
        if (typeof column === 'number') {
            return this.columns[this.columnNames[column]];
        }
        return this.columns[column];
    };
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
    DataTableRow.prototype.getColumnAsBoolean = function (column) {
        return this.converter.asBoolean(this.getColumn(column));
    };
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
    DataTableRow.prototype.getColumnAsDataTable = function (column) {
        return this.converter.asDataTable(this.getColumn(column));
    };
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
    DataTableRow.prototype.getColumnAsDate = function (column) {
        return this.converter.asDate(this.getColumn(column));
    };
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
    DataTableRow.prototype.getColumnAsNumber = function (column) {
        return this.converter.asNumber(this.getColumn(column));
    };
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
    DataTableRow.prototype.getColumnAsString = function (column) {
        return this.converter.asString(this.getColumn(column));
    };
    /**
     * Returns the number of columns in this row.
     *
     * @return {number}
     * Number of columns in this row.
     */
    DataTableRow.prototype.getColumnCount = function () {
        return this.getColumnNames().length;
    };
    /**
     * Returns the column names in this row.
     *
     * @return {Array<string>}
     * Column names in this row.
     */
    DataTableRow.prototype.getColumnNames = function () {
        return this.columnNames.slice();
    };
    /**
     * Adds a column to this row.
     *
     * @param {string} columnName
     * Name of the column.
     *
     * @param {DataTableRow.ColumnValueType} columnValue
     * Value of the column in this row.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the column was added to the row. Returns false, if
     * `id` was used the column name, or if the column already exists.
     *
     * @emits DataTableRow#insertColumn
     * @emits DataTableRow#afterInsertColumn
     */
    DataTableRow.prototype.insertColumn = function (columnName, columnValue, eventDetail) {
        if (columnName === 'id' ||
            this.columnNames.indexOf(columnName) !== -1) {
            return false;
        }
        this.emit({
            type: 'insertColumn',
            columnName: columnName,
            columnValue: columnValue,
            detail: eventDetail
        });
        this.columnNames.push(columnName);
        this.columns[columnName] = columnValue;
        this.emit({
            type: 'afterInsertColumn',
            columnName: columnName,
            columnValue: columnValue,
            detail: eventDetail
        });
        return true;
    };
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
    DataTableRow.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /**
     * Converts the row to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this row.
     */
    DataTableRow.prototype.toJSON = function () {
        var columns = this.getAllColumns(), columnKeys = Object.keys(columns), json = {
            $class: 'DataTableRow'
        };
        var key, value;
        if (!this.autoId) {
            json.id = this.id;
        }
        for (var i = 0, iEnd = columnKeys.length; i < iEnd; ++i) {
            key = columnKeys[i];
            value = columns[key];
            /* eslint-disable @typescript-eslint/indent */
            switch (typeof value) {
                default:
                    if (value === null) {
                        json[key] = value;
                    }
                    else if (value instanceof Date) {
                        json[key] = value.getTime();
                    }
                    else { // DataTable
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
    };
    /**
     * Updates the value of a column in this row.
     *
     * @param {string} columnName
     * Column name in this row to update.
     *
     * @param {DataTableRow.ColumnValueType} columnValue
     * Column value to update to.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * True, if the column was found and updated, otherwise false.
     *
     * @emits DataTableRow#updateColumn
     * @emits DataTableRow#afterUpdateColumn
     */
    DataTableRow.prototype.updateColumn = function (columnName, columnValue, eventDetail) {
        var row = this;
        if (columnName === 'id') {
            return false;
        }
        row.emit({
            type: 'updateColumn',
            columnName: columnName,
            columnValue: columnValue,
            detail: eventDetail
        });
        row.columns[columnName] = columnValue;
        row.emit({ type: 'afterUpdateColumn', columnName: columnName, columnValue: columnValue });
        return true;
    };
    return DataTableRow;
}());
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
