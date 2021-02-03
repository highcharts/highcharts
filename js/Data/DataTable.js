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
import DataPresentationState from './DataPresentationState.js';
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
     * @param {string} [id]
     * DataTable identifier.
     *
     * @param {DataPresentationState} [presentationState]
     * Presentation state for the DataTable.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
     */
    function DataTable(rows, id, presentationState, converter) {
        if (rows === void 0) { rows = []; }
        if (presentationState === void 0) { presentationState = new DataPresentationState(); }
        if (converter === void 0) { converter = new DataConverter(); }
        var rowsIdMap = {};
        var row;
        rows = rows.slice();
        this.converter = converter;
        this.id = id || uniqueKey();
        this.presentationState = presentationState;
        this.rows = rows;
        this.rowsIdMap = rowsIdMap;
        this.unwatchIdMap = {};
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
        var presentationState;
        if (json.presentationState) {
            presentationState = DataPresentationState.fromJSON(json.presentationState);
        }
        try {
            for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataTableRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows, void 0, presentationState);
        }
        catch (error) {
            return new DataTable(void 0, void 0, presentationState);
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
        this.unwatchIdMap = {};
        this.emit({ type: 'afterClearTable', detail: eventDetail });
    };
    /**
     * Create an empty copy of the table with all the informations
     * from the original table.
     *
     * @return {DataTable}
     * Returns new empty DataTable instance.
     */
    DataTable.prototype.clone = function () {
        var table = this, newTable = new DataTable([], table.id, table.presentationState, table.converter), aliasMapNames = Object.keys(table.aliasMap);
        var eventNames, eventName, eventArr, eventFunction, alias;
        if (table.hcEvents) {
            eventNames = Object.keys(table.hcEvents);
            for (var i = 0, iEnd = eventNames.length; i < iEnd; i++) {
                eventName = eventNames[i];
                eventArr = table.hcEvents[eventName];
                for (var j = 0, jEnd = eventArr.length; j < jEnd; j++) {
                    eventFunction = eventArr[j].fn;
                    newTable.on(eventName, eventFunction);
                }
            }
        }
        if (table.versionTag) {
            newTable.versionTag = table.versionTag;
        }
        if (table.aliasMap) {
            for (var k = 0, kEnd = aliasMapNames.length; k < kEnd; k++) {
                alias = aliasMapNames[k];
                newTable.createColumnAlias(table.aliasMap[alias], alias);
            }
        }
        return newTable;
    };
    /**
     * Create an alias for a column
     *
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
     * Deletes a row in this table.
     *
     * @param {string|DataTableRow} row
     * Row or row ID to delete.
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
    DataTable.prototype.deleteRow = function (row, eventDetail) {
        var table = this, rows = table.rows;
        if (typeof row === 'string') {
            row = table.rowsIdMap[row];
        }
        var index = rows.indexOf(row);
        this.emit({
            type: 'deleteRow',
            detail: eventDetail,
            index: index,
            row: row
        });
        this.unwatchRow(row.id);
        rows.splice(index, 1);
        delete table.rowsIdMap[row.id];
        this.emit({
            type: 'afterDeleteRow',
            detail: eventDetail,
            index: index,
            row: row
        });
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
     * Retrieves the given column, either by the canonical column name, or by an
     * alias.
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to get, alias takes precedence.
     *
     * @return {DataTable.Column|undefined}
     * An array with column values, or `undefined` if not found.
     */
    DataTable.prototype.getColumn = function (columnNameOrAlias) {
        return this.getColumns([columnNameOrAlias])[columnNameOrAlias];
    };
    /**
     * Retrieves the given columns, either by the canonical column name,
     * or by an alias. This function can also retrieve row IDs as column `id`.
     *
     * @param {Array<string>} [columnNamesOrAlias]
     * Names or aliases for the columns to get, aliases taking precedence.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {DataTable.ColumnCollection}
     * A two-dimensional array of the specified columns,
     * if the column does not exist it will be `undefined`
     */
    DataTable.prototype.getColumns = function (columnNamesOrAlias, usePresentationOrder) {
        if (columnNamesOrAlias === void 0) { columnNamesOrAlias = []; }
        var table = this, aliasMap = table.aliasMap, rows = table.rows, noColumnNames = !columnNamesOrAlias.length, columnSorter = (usePresentationOrder &&
            table.presentationState.getColumnSorter()), columns = {};
        var columnName, row, cell;
        if (columnSorter) {
            columnNamesOrAlias.sort(columnSorter);
        }
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            if (noColumnNames) {
                columnNamesOrAlias = row.getCellNames();
                if (columnSorter) {
                    columnNamesOrAlias.sort(columnSorter);
                }
                columnNamesOrAlias.unshift('id');
            }
            for (var j = 0, jEnd = columnNamesOrAlias.length; j < jEnd; ++j) {
                columnName = columnNamesOrAlias[j];
                cell = (columnName === 'id' ?
                    row.id :
                    row.getCell(aliasMap[columnName] || columnName));
                if (columns[columnName] ||
                    typeof cell !== 'undefined') {
                    if (!columns[columnName]) {
                        columns[columnName] = new Array(i + 1);
                    }
                    columns[columnName][i] = cell;
                }
            }
        }
        return columns;
    };
    /**
     * Returns the first row of the table that is not null.
     *
     * @return {DataTableRow|undefined}
     * The first non-null row, if found, otherwise `undefined`.
     */
    DataTable.prototype.getFirstNonNullRow = function () {
        var rows = this.getAllRows();
        var nonNullRow, row;
        for (var i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            if (!row.isNull()) {
                nonNullRow = row;
                break;
            }
        }
        return nonNullRow;
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
        var table = this;
        if (typeof row === 'string') {
            return table.rowsIdMap[row];
        }
        return table.rows[row];
    };
    /**
     * Retrieves a cell value based on row index/ID
     * and column name/alias.
     *
     * @param {string|number} row
     * The row to select.
     *
     * @param {string} columnNameOrAlias
     * The column to get the value from.
     *
     * @return {DataTableRow.CellType}
     * The value of the cell.
     */
    DataTable.prototype.getRowCell = function (row, columnNameOrAlias) {
        var cellName = this.aliasMap[columnNameOrAlias] || columnNameOrAlias, foundRow = this.getRow(row);
        return foundRow && foundRow.getCell(cellName);
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
     * Returns the index of a given row in this table.
     *
     * @param {string|DataTableRow} row
     * Row to determ index for.
     *
     * @return {number}
     * Index of the row in this table, -1 if not found.
     */
    DataTable.prototype.getRowIndex = function (row) {
        var table = this;
        if (typeof row === 'string') {
            row = table.rowsIdMap[row];
        }
        return table.rows.indexOf(row);
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
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @param {number} [index]
     * Index to place row.
     *
     * @return {boolean}
     * Returns true, if the row has been added to the table. Returns false, if
     * a row with the same row ID already exists in the table.
     *
     * @emits DataTable#insertRow
     * @emits DataTable#afterInsertRow
     */
    DataTable.prototype.insertRow = function (row, eventDetail, index) {
        if (index === void 0) { index = this.rows.length; }
        var table = this, rows = table.rows, rowsIdMap = table.rowsIdMap, rowId = row.id;
        if (rowsIdMap[rowId]) {
            return false;
        }
        table.emit({ type: 'insertRow', detail: eventDetail, index: index, row: row });
        rows.splice(index, 0, row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);
        table.emit({ type: 'afterInsertRow', detail: eventDetail, index: index, row: row });
        return true;
    };
    /**
     * Inserts an array of rows into the table
     * @param {Array<DataTableRow>} rows
     * Array of rows to insert
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Details for insertRow event
     *
     * @return {this}
     * The datatable with the inserted rows
     */
    DataTable.prototype.insertRows = function (rows, eventDetail) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            this.insertRow(row, eventDetail);
        }
        return this;
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
                var columns = this.getColumns([fromColumnName, toColumnName]), fromColumnValues = columns[fromColumnName], toColumnValues = columns[toColumnName];
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
     * Replaces a row in this table with a new row. The new row must not be part
     * found in this table.
     *
     * @param {number|string|DataTableRow} oldRow
     * Row index, row ID, or row to replace.
     *
     * @param {DataTableRow} newRow
     * Row as the replacement.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * True, if row was successfully replaced, otherwise false.
     *
     * @emits DataTable#deleteRow
     * @emits DataTable#afterDeleteRow
     * @emits DataTable#insertRow
     * @emits DataTable#afterInsertRow
     */
    DataTable.prototype.replaceRow = function (oldRow, newRow, eventDetail) {
        var table = this, rows = table.rows, rowsIdMap = table.rowsIdMap, index = (typeof oldRow === 'number' ?
            oldRow :
            table.getRowIndex(oldRow));
        oldRow = rows[index];
        if (!oldRow ||
            rowsIdMap[newRow.id]) {
            return false;
        }
        table.deleteRow(oldRow);
        table.insertRow(newRow, eventDetail, index);
        return true;
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
            return row.setCell(cellName, value);
        }
        return false;
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
        }, rows = this.rows;
        if (this.presentationState.isSet()) {
            json.presentationState = this.presentationState.toJSON();
        }
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
     * Row or row ID to unwatch.
     *
     * @param {boolean} [skipDelete]
     * True, to skip the deletion of the unregister functions. Usefull when
     * modifying multiple rows in a batch.
     */
    DataTable.prototype.unwatchRow = function (rowId, skipDelete) {
        var unwatchIdMap = this.unwatchIdMap, unwatch = unwatchIdMap[rowId];
        if (unwatch) {
            unwatch();
            if (!skipDelete) {
                delete unwatchIdMap[rowId];
            }
        }
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
        var table = this, index = table.rows.indexOf(row), unwatchIdMap = table.unwatchIdMap;
        unwatchIdMap[row.id] = row.on('afterChangeRow', function (e) {
            table.versionTag = uniqueKey();
            table.emit({
                type: 'afterUpdateRow',
                detail: e.detail,
                index: index,
                row: row
            });
        });
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
