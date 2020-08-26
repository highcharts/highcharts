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
import DataTableRow from './DataTableRow.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
/**
 * Class to manage rows in a table structure.
 */
var DataTable = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the DataTable class.
     *
     * @param {Array<DataTableRow>} [rows]
     * Array of table rows as DataTableRow instances.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
     */
    function DataTable(rows, converter) {
        if (rows === void 0) { rows = []; }
        if (converter === void 0) { converter = new DataConverter(); }
        var rowsIdMap = {};
        var row;
        rows = rows.slice();
        this.converter = converter;
        this.id = uniqueKey();
        this.rows = rows;
        this.rowsIdMap = rowsIdMap;
        this.watchsIdMap = {};
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            row.converter = converter;
            rowsIdMap[row.id] = row;
            this.watchRow(row);
        }
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Converts a supported class JSON to a DataTable instance.
     *
     * @param {DataTableRow.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataTable}
     * DataTable instance from the class JSON.
     */
    DataTable.fromJSON = function (json) {
        var rows = json.rows, dataRows = [];
        try {
            for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataTableRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows);
        }
        catch (error) {
            return new DataTable();
        }
    };
    /**
     * Converts a simple two dimensional array to a DataTable instance. The
     * array needs to be structured like a DataFrame, so that the first
     * dimension becomes the columns and the second dimension the rows.
     *
     * @param {Array<Array<DataValueType>>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @return {DataTable}
     * DataTable instance from the arrays.
     */
    DataTable.fromColumns = function (columns, headers) {
        if (columns === void 0) { columns = []; }
        if (headers === void 0) { headers = []; }
        var table = new DataTable();
        var columnsLength = columns.length;
        if (columnsLength) {
            var rowsLength = columns[0].length;
            var i = 0;
            while (i < rowsLength) {
                var row = new DataTableRow();
                for (var j = 0; j < columnsLength; ++j) {
                    row.insertColumn((headers.length ? headers[j] : uniqueKey()), columns[j][i]);
                }
                table.insertRow(row);
                ++i;
            }
        }
        return table;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Removes all rows from this table.
     *
     * @emits DataTable#clearTable
     * @emits DataTable#afterClearTable
     */
    DataTable.prototype.clear = function () {
        this.emit({ type: 'clearTable' });
        var rowIds = this.getAllRowIds();
        for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.unwatchRow(rowIds[i], true);
        }
        this.rows.length = 0;
        this.rowsIdMap = {};
        this.watchsIdMap = {};
        this.emit({ type: 'afterClearTable' });
    };
    /**
     * Deletes a row in this table.
     *
     * @param {string} rowId
     * Name of the row to delete.
     *
     * @return {boolean}
     * Returns true, if the delete was successful, otherwise false.
     *
     * @emits DataTable#deleteRow
     * @emits DataTable#afterDeleteRow
     */
    DataTable.prototype.deleteRow = function (rowId) {
        var row = this.rowsIdMap[rowId], index = this.rows.indexOf(row);
        this.emit({ type: 'deleteRow', index: index, row: row });
        this.rows[index] = row;
        delete this.rowsIdMap[rowId];
        this.unwatchRow(rowId);
        this.emit({ type: 'afterDeleteRow', index: index, row: row });
        return row;
    };
    /**
     * Emits an event on this row to all registered callbacks of the given
     * event.
     *
     * @param {DataTable.EventObjects} [e]
     * Event object with event information.
     */
    DataTable.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
    /**
     * Return the array of row IDs of this table.
     *
     * @return {Array<string>}
     * Array of row IDs in this table.
     */
    DataTable.prototype.getAllRowIds = function () {
        return Object.keys(this.rowsIdMap);
    };
    /**
     * Returns a copy of the internal array with rows.
     *
     * @return {Array<DataTableRow>}
     * Copy of the internal array with rows.
     */
    DataTable.prototype.getAllRows = function () {
        return this.rows.slice();
    };
    /**
     * Returns the row with the fiven index or row ID.
     *
     * @param {number|string} row
     * Row index or row ID.
     *
     * @return {DataTableRow.ColumnTypes}
     * Column value of the column in this row.
     */
    DataTable.prototype.getRow = function (row) {
        if (typeof row === 'string') {
            return this.rowsIdMap[row];
        }
        return this.rows[row];
    };
    /**
     * Returns the number of rows in this table.
     *
     * @return {number}
     * Number of rows in this table.
     *
     * @todo Consider implementation via property getter `.length` depending on
     *       browser support.
     */
    DataTable.prototype.getRowCount = function () {
        return this.rows.length;
    };
    /**
     * Returns the version tag that changes with each modification of the table
     * or a related row.
     *
     * @return {string}
     * Version tag of the current state.
     */
    DataTable.prototype.getVersionTag = function () {
        return this.versionTag || (this.versionTag = uniqueKey());
    };
    /**
     * Adds a row to this table.
     *
     * @param {DataTableRow} row
     * Row to add to this table.
     *
     * @return {boolean}
     * Returns true, if the row has been added to the table. Returns false, if
     * a row with the same row ID already exists in the table.
     */
    DataTable.prototype.insertRow = function (row) {
        var rowId = row.id;
        var index = this.rows.length;
        if (typeof this.rowsIdMap[rowId] !== 'undefined') {
            return false;
        }
        this.emit({ type: 'insertRow', index: index, row: row });
        this.rows.push(row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);
        this.emit({ type: 'afterInsertRow', index: index, row: row });
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
    DataTable.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /**
     * Watchs for events in a row to keep the version tag of the table updated.
     *
     * @param {DataTableRow} row
     * Row the watch for modifications.
     */
    DataTable.prototype.watchRow = function (row) {
        var table = this, index = table.rows.indexOf(row), watchsIdMap = table.watchsIdMap, watchs = [];
        /** @private */
        function callback() {
            table.versionTag = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index: index, row: row });
        }
        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteColumn', callback));
        watchs.push(row.on('afterInsertColumn', callback));
        watchs.push(row.on('afterUpdateColumn', callback));
        watchsIdMap[row.id] = watchs;
    };
    /**
     * Converts the table to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this table.
     */
    DataTable.prototype.toJSON = function () {
        var json = {
            $class: 'DataTable',
            rows: []
        };
        var rows = this.rows;
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            json.rows.push(rows[i].toJSON());
        }
        return json;
    };
    /**
     * Removes the watch callbacks from in a row, so that version tag of the
     * table get not updated anymore, if the row is modified.
     *
     * @param {string} rowId
     * ID of the row to unwatch.
     *
     * @param {boolean} [skipDelete]
     * True, to skip the deletion of the unregister functions. Usefull when
     * modifying multiple rows in a batch.
     */
    DataTable.prototype.unwatchRow = function (rowId, skipDelete) {
        var watchsIdMap = this.watchsIdMap;
        var watchs = watchsIdMap[rowId] || [];
        for (var i = 0, iEnd = watchs.length; i < iEnd; ++i) {
            watchs[i]();
        }
        if (!skipDelete) {
            delete watchsIdMap[rowId];
        }
    };
    return DataTable;
}());
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(DataTable);
/* *
 *
 *  Export
 *
 * */
export default DataTable;
