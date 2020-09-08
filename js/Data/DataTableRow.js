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
        this.cells = {};
        this.emit({ type: 'afterClearRow', detail: eventDetail });
    };
    /**
     * Deletes a cell in this row.
     *
     * @param {string} cellName
     * Cell name.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns true, if the delete was successful, otherwise false.
     *
     * @emits DataTableRow#deleteCell
     * @emits DataTableRow#afterDeleteCell
     */
    DataTableRow.prototype.deleteCell = function (cellName, eventDetail) {
        var row = this, cellValue = row.cells[cellName];
        if (cellName === 'id' ||
            Object.keys(row.cells).indexOf(cellName) < 0) {
            return false;
        }
        this.emit({
            type: 'deleteCell',
            cellName: cellName,
            cellValue: cellValue,
            detail: eventDetail
        });
        delete row.cells[cellName];
        this.emit({
            type: 'afterDeleteCell',
            cellName: cellName,
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
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTableRow.CellType}
     * Cell value in this row.
     */
    DataTableRow.prototype.getCell = function (cellName) {
        return this.cells[cellName];
    };
    /**
     * Converts the value of the given cell name or cell index to a boolean and
     * returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {boolean}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsBoolean = function (cellName) {
        return this.converter.asBoolean(this.getCell(cellName));
    };
    /**
     * Converts the value of the given cell name or cell index to a DataTable
     * and returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTable}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsDataTable = function (cellName) {
        return this.converter.asDataTable(this.getCell(cellName));
    };
    /**
     * Converts the value of the given cell name or cell index to a Date and
     * returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {Date}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsDate = function (cellName) {
        return this.converter.asDate(this.getCell(cellName));
    };
    /**
     * Converts the value of the given cell name or cell index to a number and
     * returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {number}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsNumber = function (cellName) {
        return this.converter.asNumber(this.getCell(cellName));
    };
    /**
     * Converts the value of the given cell name or cell index to a string and
     * returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {string}
     * Converted cell value of the cell in this row.
     */
    DataTableRow.prototype.getCellAsString = function (cellName) {
        return this.converter.asString(this.getCell(cellName));
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
        return Object.keys(this.cells);
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
        var row = this, cells = row.cells;
        if (cellName === 'id' ||
            Object.keys(cells).indexOf(cellName) !== -1) {
            return false;
        }
        row.emit({
            type: 'insertCell',
            cellName: cellName,
            cellValue: cellValue,
            detail: eventDetail
        });
        row.cells[cellName] = cellValue;
        row.emit({
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
        var row = this, cells = row.getAllCells(), cellNames = Object.keys(cells), json = {
            $class: 'DataTableRow'
        };
        var name, value;
        if (!this.autoId) {
            json.id = this.id;
        }
        for (var i = 0, iEnd = cellNames.length; i < iEnd; ++i) {
            name = cellNames[i];
            value = cells[name];
            /* eslint-disable @typescript-eslint/indent */
            switch (typeof value) {
                default:
                    if (value === null) {
                        json[name] = value;
                    }
                    else if (value instanceof Date) {
                        json[name] = value.getTime();
                    }
                    else { // DataTable
                        json[name] = value.toJSON();
                    }
                    continue;
                case 'undefined':
                    continue;
                case 'boolean':
                case 'number':
                case 'string':
                    json[name] = value;
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
