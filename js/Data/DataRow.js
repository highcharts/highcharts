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
var DataRow = /** @class */ (function () {
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
    function DataRow(columns, converter) {
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
     * Converts a supported class JSON to a DataRow instance.
     *
     * @param {DataRow.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataRow}
     * DataRow instance from the class JSON.
     */
    DataRow.fromJSON = function (json) {
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
        return new DataRow(columns);
    };
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
    DataRow.prototype.clear = function () {
        this.emit('clearRow', {});
        this.columnNames.length = 0;
        this.columns.length = 0;
        this.emit('afterClearRow', {});
    };
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
    DataRow.prototype.deleteColumn = function (columnName) {
        var row = this, columnValue = row.columns[columnName];
        if (columnName === 'id') {
            return false;
        }
        this.emit('deleteColumn', { columnKey: columnName, columnValue: columnValue });
        row.columnNames.splice(row.columnNames.indexOf(columnName), 1);
        delete row.columns[columnName];
        this.emit('afterDeleteColumn', { columnKey: columnName, columnValue: columnValue });
        return true;
    };
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
    DataRow.prototype.emit = function (type, e) {
        fireEvent(this, type, e);
    };
    /**
     * Returns a copy of the record object of all columnNames with their values.
     *
     * @return {DataRow.Columns}
     * Copy of the record object of all columnNames with their values.
     */
    DataRow.prototype.getAllColumns = function () {
        return merge(this.columns);
    };
    /**
     * Returns the value of the given column name or column index.
     *
     * @param {number|string} column
     * Column name or column index.
     *
     * @return {DataRow.ColumnTypes}
     * Column value of the column in this row.
     */
    DataRow.prototype.getColumn = function (column) {
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
    DataRow.prototype.getColumnAsBoolean = function (column) {
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
    DataRow.prototype.getColumnAsDataTable = function (column) {
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
    DataRow.prototype.getColumnAsDate = function (column) {
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
    DataRow.prototype.getColumnAsNumber = function (column) {
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
    DataRow.prototype.getColumnAsString = function (column) {
        return this.converter.asString(this.getColumn(column));
    };
    /**
     * Returns the number of columns in this row.
     *
     * @return {number}
     * Number of columns in this row.
     */
    DataRow.prototype.getColumnCount = function () {
        return this.getColumnNames().length;
    };
    /**
     * Returns the column names in this row.
     *
     * @return {Array<string>}
     * Column names in this row.
     */
    DataRow.prototype.getColumnNames = function () {
        return this.columnNames.slice();
    };
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
    DataRow.prototype.insertColumn = function (columnName, columnValue) {
        if (columnName === 'id' ||
            this.columnNames.indexOf(columnName) !== -1) {
            return false;
        }
        this.emit('insertColumn', { columnKey: columnName, columnValue: columnValue });
        this.columnNames.push(columnName);
        this.columns[columnName] = columnValue;
        this.emit('afterInsertColumn', { columnKey: columnName, columnValue: columnValue });
        return true;
    };
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
    DataRow.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /**
     * Converts the row to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this row.
     */
    DataRow.prototype.toJSON = function () {
        var columns = this.getAllColumns(), columnKeys = Object.keys(columns), json = {
            $class: 'DataRow'
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
     * @param {string} columnKey
     * Column name in this row to update.
     *
     * @param {DataRow.ColumnTypes} columnValue
     * Column value to update to.
     *
     * @return {boolean}
     * True, if the column was found and updated, otherwise false.
     */
    DataRow.prototype.updateColumn = function (columnKey, columnValue) {
        var row = this;
        if (columnKey === 'id') {
            return false;
        }
        fireEvent(row, 'updateColumn', { columnKey: columnKey, columnValue: columnValue });
        row.columns[columnKey] = columnValue;
        fireEvent(row, 'afterUpdateColumn', { columnKey: columnKey, columnValue: columnValue });
        return true;
    };
    return DataRow;
}());
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
