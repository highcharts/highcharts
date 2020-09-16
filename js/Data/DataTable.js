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
        // Assign an unique id for every column
        // without a provided name
        while (headers.length < columnsLength) {
            headers.push(uniqueKey());
        }
        if (columnsLength) {
            var rowsLength = columns[0].length;
            var i = 0;
            while (i < rowsLength) {
                var row = new DataTableRow();
                for (var j = 0; j < columnsLength; ++j) {
                    row.insertCell(headers[j], columns[j][i]);
                }
                table.insertRow(row);
                ++i;
            }
        }
        return table;
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
        var rows = this.rows, rowsIdMap = this.rowsIdMap, row = rowsIdMap[rowId], index = rows.indexOf(row);
        this.emit({ type: 'deleteRow', detail: eventDetail, index: index, row: row });
        this.unwatchRow(rowId);
        rows.splice(index, 1);
        delete rowsIdMap[rowId];
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
     * Converts the DataTable instance to a record of columns
     *
     * @return {DataTable.ColumnCollection}
     * A record of columns, where the key is the name of the column,
     * and the values are the content of the column.
     */
    DataTable.prototype.toColumns = function () {
        var columnsObject = {
            id: []
        }, dataTable = this;
        for (var rowIndex = 0, rowCount = dataTable.getRowCount(); rowIndex < rowCount; rowIndex++) {
            var row = dataTable.rows[rowIndex], cellNames = row.getCellNames(), cellCount = cellNames.length;
            columnsObject.id.push(row.id); // Push the ID column
            for (var j = 0; j < cellCount; j++) {
                var cellName = cellNames[j], cell = row.getCell(cellName);
                if (!columnsObject[cellName]) {
                    columnsObject[cellName] = [];
                    // If row number is greater than 0
                    // add the previous rows as undefined
                    if (rowIndex > 0) {
                        for (var rowNumber = 0; rowNumber < rowIndex; rowNumber++) {
                            columnsObject[cellName][rowNumber] = void 0;
                        }
                    }
                }
                columnsObject[cellName][rowIndex] = cell;
            }
            // If the object has columns that were not in the row
            // add them as undefined
            var columnsInObject = Object.keys(columnsObject);
            for (var columnIndex = 0; columnIndex < columnsInObject.length; columnIndex++) {
                var columnName = columnsInObject[columnIndex];
                while (columnsObject[columnName].length - 1 < rowIndex) {
                    columnsObject[columnName].push(void 0);
                }
            }
        }
        return columnsObject;
    };
    /**
     * Retrieves the given columns, either by the canonical column name,
     * or by an alias
     *
     * @param {...string} columnNamesOrAlias
     * Names or aliases for the columns to get, aliases taking precedence.
     *
     * @return {Array<Array<DataTableRow.CellType>|undefined>}
     * A two-dimensional array of the specified columns,
     * if the column does not exist it will be `undefined`
     */
    DataTable.prototype.getColumns = function () {
        var columnNamesOrAlias = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columnNamesOrAlias[_i] = arguments[_i];
        }
        var columns = this.toColumns(), aliasMap = this.aliasMap;
        var columnNames = Object.keys(columns), columnArray = [];
        for (var i = 0, parameterCount = columnNamesOrAlias.length; i < parameterCount; i++) {
            var parameter = columnNamesOrAlias[i], foundName = columnNames[columnNames.indexOf(aliasMap[parameter] || parameter)];
            columnArray.push(columns[foundName] || void 0);
        }
        return columnArray;
    };
    /**
     * Create an alias for a column
     * @param {string} columnName
     * The name for the column to create an alias for
     *
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
    /**
     * Sets a cell value based on the rowID/index and column name/alias.
     * Will insert a new row if the specified row does not exist.
     *
     * @param {string | number | undefined} rowID
     * The ID or index of the row.
     *
     * @param {string} columnNameOrAlias
     * The column name of the cell to set.
     *
     * @param {DataTableRow.CellType} value
     * The value to set the cell to.
     *
     * @param {boolean} [allowUndefined]
     * Whether to allow for an `undefined` rowID.
     * If `true` the method will insert a new row with a generated ID.
     * Defaults to `false`.
     *
     * @return {boolean}
     * `true` if successful, `false` if not
     */
    DataTable.prototype.setRowCell = function (rowID, columnNameOrAlias, value, allowUndefined) {
        if (allowUndefined === void 0) { allowUndefined = false; }
        var cellName = this.aliasMap[columnNameOrAlias] || columnNameOrAlias;
        if (!allowUndefined && !rowID) {
            return false;
        }
        // Insert a row with the specified ID if not found
        if (!rowID || !this.getRow(rowID)) {
            var rowToInsert = DataTableRow.fromJSON({
                $class: 'DataTableRow',
                id: rowID
            });
            this.insertRow(rowToInsert);
            rowID = rowToInsert.id;
        }
        var row = this.getRow(rowID);
        if (row) {
            return (row.updateCell(cellName, value) ||
                row.insertCell(cellName, value));
        }
        return false;
    };
    /**
     * Retrieves a cell value based on row index/ID
     * and column name/alias.
     *
     * @param {string | number} rowID
     * The row to select.
     *
     * @param {string} columnNameOrAlias
     * The column to get the value from.
     *
     * @return {DataTableRow.CellType}
     * The value of the cell.
     */
    DataTable.prototype.getRowCell = function (rowID, columnNameOrAlias) {
        var _a;
        var cellName = this.aliasMap[columnNameOrAlias] || columnNameOrAlias;
        return (_a = this.getRow(rowID)) === null || _a === void 0 ? void 0 : _a.getCell(cellName);
    };
    /**
     * Sets a column of cells from an array of cell values
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to set.
     *
     * @param {Array<DataTableRow.CellType>} cells
     * Ann array of cell values to set.
     *
     * @return {boolean}
     * `true` if successful, `false` if unable to insert all values.
     *
     */
    DataTable.prototype.setColumn = function (columnNameOrAlias, cells) {
        var rowIDs = this.getAllRowIds();
        var success = false;
        for (var i = 0, iEnd = Math.max(cells.length, rowIDs.length); i < iEnd; i++) {
            success = this.setRowCell(rowIDs[i], columnNameOrAlias, cells[i], true);
        }
        return success;
    };
    /**
     * Deletes a column of cells from the table.
     * @param {string} columnName
     * The name of the column to be deleted (not an alias).
     *
     * @return {boolean}
     * `true` if the at least one cell is deleted.
     */
    DataTable.prototype.deleteColumn = function (columnName) {
        var rows = this.getAllRows();
        var success = false;
        for (var i = 0, rowCount = rows.length; i < rowCount; i++) {
            if (rows[i].deleteCell(columnName)) {
                success = true;
            }
        }
        return success;
    };
    /**
     * Removes a column of cells from the table and returns the values.
     * @param {string} columnName
     * The name of the column to be deleted (not an alias).
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Array<DataTableRow.CellType>}
     * An array of the values of the column.
     */
    DataTable.prototype.removeColumn = function (columnName, eventDetail) {
        var rows = this.getAllRows(), cellValueArray = [];
        this.emit({ type: 'removeColumn', detail: eventDetail, columnName: columnName });
        for (var i = 0, rowCount = rows.length; i < rowCount; i++) {
            cellValueArray.push(rows[i].removeCell(columnName));
        }
        this.emit({ type: 'afterRemoveColumn', detail: eventDetail, columnName: columnName, values: cellValueArray });
        return cellValueArray;
    };
    /**
     * Renames a column of cells.
     * @param {string} fromColumnName
     * The name of the column to be renamed.
     *
     * @param {string} toColumnName
     * The new name of the column.
     * Cannot be `id` or an existing column name or alias.
     *
     * @param {string} [force]
     * If `true` the method will allow the `newColumnName`
     * to be an existing column name
     *
     * @param {boolean} [followAlias]
     * If `true` the method will allow the `newColumnName` parameter
     * to be an alias.
     *
     * @return {boolean}
     * `true` if the operation succeeds,
     * `false` if either column name is `id`, or if unable to set
     * or delete the columns.
     *
     */
    DataTable.prototype.renameColumn = function (fromColumnName, toColumnName, force, followAlias) {
        if (force === void 0) { force = false; }
        if (followAlias === void 0) { followAlias = false; }
        var success = false;
        if (fromColumnName !== 'id' && toColumnName !== 'id') {
            // setColumn will overwrite an alias, so check that it
            // does not exist
            if (!this.aliasMap[toColumnName] || followAlias) {
                var _a = this.getColumns(fromColumnName, toColumnName), fromColumnValues = _a[0], toColumnValues = _a[1];
                // Check that the fromColumn exists,
                // and that the toColumn does not
                if (!fromColumnValues || (toColumnValues && !force)) {
                    return false;
                }
                success = this.setColumn(toColumnName, fromColumnValues);
                if (success) {
                    // Roll back if unable to delete
                    if (!this.deleteColumn(fromColumnName)) {
                        this.deleteColumn(toColumnName);
                        success = false;
                    }
                }
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
