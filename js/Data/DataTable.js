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
        this.aliasMap = {};
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
     * Converts a simple two dimensional array to a DataTable instance. The
     * array needs to be structured like a DataFrame, so that the first
     * dimension becomes the columns and the second dimension the rows.
     *
     * @param {Array<Array<DataFrame.ValueType>>} [columns]
     * Array to convert.
     *
     * @param {Array<string>} [headers]
     * Column names to use.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
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
                    row.insertCell((headers.length ? headers[j] : uniqueKey()), columns[j][i]);
                }
                table.insertRow(row);
                ++i;
            }
        }
        return table;
    };
    /**
     * Converts a DataTable to a record of columns
     * @param {DataTable} dataTable
     * The datatable to convert
     *
     * @return {DataTable.ColumnCollection}
     * An object with column names as keys,
     * and value an array of cell values
     */
    DataTable.toColumns = function (dataTable) {
        var columnsObject = {
            id: []
        };
        for (var i = 0, rowCount = dataTable.getRowCount(); i < rowCount; i++) {
            var row = dataTable.rows[i], cellNames = row.getCellNames(), cellCount = cellNames.length;
            columnsObject.id.push(row.id); // Push the ID column
            for (var j = 0; j < cellCount; j++) {
                var cellName = cellNames[j], cell = row.getCell(cellName);
                if (!columnsObject[cellName]) {
                    columnsObject[cellName] = [];
                }
                var cellValue = void 0;
                if (cell instanceof DataTable) {
                    cellValue = JSON.stringify(cell.toJSON());
                }
                else if (cell instanceof Date) {
                    cellValue = cell.toJSON();
                }
                else {
                    cellValue = cell;
                }
                columnsObject[cellName][i] = cellValue;
            }
        }
        return columnsObject;
    };
    /**
     * Converts a supported class JSON to a DataTable instance.
     *
     * @param {DataTable.ClassJSON} json
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
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Removes all rows from this table.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataTable#clearTable
     * @emits DataTable#afterClearTable
     */
    DataTable.prototype.clear = function (eventDetail) {
        this.emit({ type: 'clearTable', detail: eventDetail });
        var rowIds = this.getAllRowIds();
        for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.unwatchRow(rowIds[i], true);
        }
        this.rows.length = 0;
        this.rowsIdMap = {};
        this.watchsIdMap = {};
        this.emit({ type: 'afterClearTable', detail: eventDetail });
    };
    /**
     * Deletes a row in this table.
     *
     * @param {string} rowId
     * Name of the row to delete.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the delete was successful, otherwise false.
     *
     * @emits DataTable#deleteRow
     * @emits DataTable#afterDeleteRow
     */
    DataTable.prototype.deleteRow = function (rowId, eventDetail) {
        var row = this.rowsIdMap[rowId], index = this.rows.indexOf(row);
        this.emit({ type: 'deleteRow', detail: eventDetail, index: index, row: row });
        this.rows[index] = row;
        delete this.rowsIdMap[rowId];
        this.unwatchRow(rowId);
        this.emit({ type: 'afterDeleteRow', detail: eventDetail, index: index, row: row });
        return row;
    };
    /**
     * Emits an event on this table to all registered callbacks of the given
     * event.
     *
     * @param {DataTable.EventObject} e
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
     * @return {DataTableRow.CellType}
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
     * Converts the datatable instance to a record of columns
     * @return {DataTable.ColumnCollection}
     * A record of columns
     */
    DataTable.prototype.toColumns = function () {
        return DataTable.toColumns(this);
    };
    /**
     * Retrieves the given columns, either by the canonical column ID,
     * or by an alias
     *
     * @param {...string} columnIDOrAlias
     * IDs or aliases for the columns to get, aliases taking precedence.
     *
     * @return {Array<Array<DataTableRow.CellType>>}
     * A two-dimensional array of the specified columns
     */
    DataTable.prototype.getColumns = function () {
        var columnIDOrAlias = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnIDOrAlias[_i] = arguments[_i];
        }
        var columns = this.toColumns(), aliasMap = this.aliasMap;
        var columnIDs = Object.keys(columns), columnArray = [];
        for (var i = 0, idCount = columnIDOrAlias.length; i < idCount; i++) {
            var id = columnIDOrAlias[i], foundID = columnIDs[columnIDs.indexOf(aliasMap[id] || id)];
            if (foundID) {
                columnArray.push(columns[foundID]);
            }
        }
        return columnArray;
    };
    /**
     * Create an alias for a column
     * @param {string} columnName
     * The name/id for the column to create an alias for
     * @param {string} alias
     * The alias for the column. Cannot be `id`, or an alias already in use
     *
     * @return {boolean}
     * True if successfully added, false if already in used or reserved.
     */
    DataTable.prototype.createColumnAlias = function (columnName, alias) {
        if (alias === 'id' || this.aliasMap[alias]) {
            return false;
        }
        this.aliasMap[alias] = columnName;
        return true;
    };
    /**
     * Removes a column alias from the table
     *
     * @param {string} alias
     * The alias to remove
     *
     * @return {boolean}
     * True if successfully removed, false if the alias was not found
     */
    DataTable.prototype.removeColumnAlias = function (alias) {
        if (this.aliasMap[alias]) {
            delete this.aliasMap[alias];
            return true;
        }
        return false;
    };
    DataTable.prototype.insertColumn = function (column, cells, eventDetail) {
        var _a;
        var table = this, rowsIdMap = table.rowsIdMap, uniqueColumn = uniqueKey();
        if (cells instanceof Array) {
            var record = {};
            for (var i = 0, iEnd = cells.length; i < iEnd; ++i) {
                record["" + i] = cells[i];
            }
            cells = record;
        }
        var rowIds = Object.keys(cells);
        var row, rowId, success = false;
        for (var i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            rowId = rowIds[i];
            row = rowsIdMap[rowId];
            if (!row) {
                row = new DataTableRow((_a = {},
                    _a[rowId] = cells[rowId],
                    _a));
                success = success && table.insertRow(row);
            }
            else {
                if (typeof column === 'number') {
                    column = (row.getCellNames()[column] || uniqueColumn);
                }
                success = success && row.insertCell(column, cells[rowId]);
            }
        }
        return success;
    };
    /**
     * Adds a row to this table.
     *
     * @param {DataTableRow} row
     * Row to add to this table.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the row has been added to the table. Returns false, if
     * a row with the same row ID already exists in the table.
     *
     * @emits DataTable#insertRow
     * @emits DataTable#afterInsertRow
     */
    DataTable.prototype.insertRow = function (row, eventDetail) {
        var rowId = row.id;
        var index = this.rows.length;
        if (typeof this.rowsIdMap[rowId] !== 'undefined') {
            return false;
        }
        this.emit({ type: 'insertRow', detail: eventDetail, index: index, row: row });
        this.rows.push(row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);
        this.emit({ type: 'afterInsertRow', detail: eventDetail, index: index, row: row });
        return true;
    };
    /**
     * Registers a callback for a specific event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
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
     *
     * @emits DataTable#afterUpdateRow
     */
    DataTable.prototype.watchRow = function (row) {
        var table = this, index = table.rows.indexOf(row), watchsIdMap = table.watchsIdMap, watchs = [];
        /**
         * @private
         * @param {DataTableRow.EventObject} e
         * Received event.
         */
        function callback(e) {
            table.versionTag = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { detail: e.detail, index: index, row: row });
        }
        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteCell', callback));
        watchs.push(row.on('afterInsertCell', callback));
        watchs.push(row.on('afterUpdateCell', callback));
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
