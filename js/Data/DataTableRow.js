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
     * @param {DataTableRow.Cells} [cells]
     * Cell values in a record object.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions.
     */
    function DataTableRow(cells, converter) {
        if (cells === void 0) { cells = {}; }
        if (converter === void 0) { converter = new DataConverter(); }
        cells = merge(cells);
        this.autoId = false;
        this.cellNames = Object.keys(cells);
        this.cells = cells;
        this.converter = converter;
        if (typeof cells.id === 'string') {
            this.id = cells.id;
        }
        else {
            this.autoId = true;
            this.id = uniqueKey();
        }
        delete cells.id;
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
     * Removes all cells from this row.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataTableRow#clearRow
     * @emits DataTableRow#afterClearRow
     */
    DataTableRow.prototype.clear = function (eventDetail) {
        this.emit({ type: 'clearRow', detail: eventDetail });
        this.cellNames.length = 0;
        this.cells.length = 0;
        this.emit({ type: 'afterClearRow', detail: eventDetail });
    };
    /**
     * Deletes a cell in this row.
     *
     * @param {number|string} cell
     * Column name or column index.
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
    DataTableRow.prototype.deleteColumn = function (cell, eventDetail) {
        var row = this;
        if (typeof cell === 'number') {
            cell = (row.cellNames[cell] || '');
        }
        var cellValue = row.cells[cell];
        if (cell === 'id') {
            return false;
        }
        this.emit({
            type: 'deleteCell',
            cellName: cell,
            cellValue: cellValue,
            detail: eventDetail
        });
        row.cellNames.splice(row.cellNames.indexOf(cell), 1);
        delete row.cells[cell];
        this.emit({
            type: 'afterDeleteCell',
            cellName: cell,
            cellValue: cellValue,
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
     * Returns a copy of the record object of all cell names with their values.
     *
     * @return {DataTableRow.Cells}
     * Copy of the record object with all cell names and values.
     */
    DataTableRow.prototype.getAllCells = function () {
        return merge(this.cells);
    };
    /**
     * Returns the value of the given cell name or cell index.
     *
     * @param {number|string} cell
     * Cell name or cell index.
     *
     * @return {DataTableRow.CellType}
     * Cell value in this row.
     */
    DataTableRow.prototype.getCell = function (cell) {
        if (typeof cell === 'number') {
            return this.cells[this.cellNames[cell]];
        }
        return this.cells[cell];
    };
    /**
     * Converts the value of the given cell name or cell index to a boolean and
     * returns it.
     *
     * @param {number|string} cell
     * Cell name or cell index.
     *
     * @return {boolean}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsBoolean = function (cell) {
        return this.converter.asBoolean(this.getCell(cell));
    };
    /**
     * Converts the value of the given cell name or cell index to a DataTable
     * and returns it.
     *
     * @param {number|string} cell
     * Cell name or cell index.
     *
     * @return {DataTable}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsDataTable = function (cell) {
        return this.converter.asDataTable(this.getCell(cell));
    };
    /**
     * Converts the value of the given cell name or cell index to a Date and
     * returns it.
     *
     * @param {number|string} cell
     * Cell name or cell index.
     *
     * @return {Date}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsDate = function (cell) {
        return this.converter.asDate(this.getCell(cell));
    };
    /**
     * Converts the value of the given cell name or cell index to a number and
     * returns it.
     *
     * @param {number|string} cell
     * Cell name or cell index.
     *
     * @return {number}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsNumber = function (cell) {
        return this.converter.asNumber(this.getCell(cell));
    };
    /**
     * Converts the value of the given cell name or cell index to a string and
     * returns it.
     *
     * @param {number|string} cell
     * Cell name or cell index.
     *
     * @return {string}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsString = function (cell) {
        return this.converter.asString(this.getCell(cell));
    };
    /**
     * Returns the number of cell in this row.
     *
     * @return {number}
     * Number of cells in this row.
     */
    DataTableRow.prototype.getCellCount = function () {
        return this.getCellNames().length;
    };
    /**
     * Returns the cell names in this row.
     *
     * @return {Array<string>}
     * Cell names in this row.
     */
    DataTableRow.prototype.getCellNames = function () {
        return this.cellNames.slice();
    };
    /**
     * Adds a cell to this row.
     *
     * @param {string} cellName
     * Name of the cell.
     *
     * @param {DataTableRow.CellType} cellValue
     * Value of the cell.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the cell was added to the row. Returns false, if `id`
     * was used as cell name, or if the cell already exists.
     *
     * @emits DataTableRow#insertCell
     * @emits DataTableRow#afterInsertCell
     */
    DataTableRow.prototype.insertCell = function (cellName, cellValue, eventDetail) {
        if (cellName === 'id' ||
            this.cellNames.indexOf(cellName) !== -1) {
            return false;
        }
        this.emit({
            type: 'insertCell',
            cellName: cellName,
            cellValue: cellValue,
            detail: eventDetail
        });
        this.cellNames.push(cellName);
        this.cells[cellName] = cellValue;
        this.emit({
            type: 'afterInsertCell',
            cellName: cellName,
            cellValue: cellValue,
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
        var columns = this.getAllCells(), columnKeys = Object.keys(columns), json = {
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
     * Updates the value of a cell in this row.
     *
     * @param {string} cellName
     * Cell name in this row to update.
     *
     * @param {DataTableRow.CellType} cellValue
     * Cell value to update to.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * True, if the cell was found and updated, otherwise false.
     *
     * @emits DataTableRow#updateCell
     * @emits DataTableRow#afterUpdateCell
     */
    DataTableRow.prototype.updateCell = function (cellName, cellValue, eventDetail) {
        var row = this;
        if (cellName === 'id') {
            return false;
        }
        row.emit({
            type: 'updateCell',
            cellName: cellName,
            cellValue: cellValue,
            detail: eventDetail
        });
        row.cells[cellName] = cellValue;
        row.emit({
            type: 'afterUpdateCell',
            cellName: cellName,
            cellValue: cellValue
        });
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
