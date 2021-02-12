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
            if (cells.id === 'NULL') {
                return DataTableRow.NULL;
            }
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
        var row = this;
        row.emit({
            type: 'clearRow',
            detail: eventDetail
        });
        row.cells = {};
        row.emit({
            type: 'afterClearRow',
            detail: eventDetail
        });
        row.emit({
            type: 'afterChangeRow',
            detail: eventDetail
        });
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
     * @emits DataTableRow#afterChangeRow
     */
    DataTableRow.prototype.deleteCell = function (cellName, eventDetail) {
        var row = this, cells = row.cells, cellValue = cells[cellName];
        if (cellName === 'id' ||
            row.id === 'NULL') {
            return false;
        }
        row.emit({
            type: 'deleteCell',
            cellName: cellName,
            cellValue: cellValue,
            detail: eventDetail
        });
        delete cells[cellName];
        row.emit({
            type: 'afterDeleteCell',
            cellName: cellName,
            cellValue: cellValue,
            detail: eventDetail
        });
        row.emit({
            type: 'afterChangeRow',
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
     * Returns the value of the given cell name.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTableRow.CellType}
     * Cell value in this row.
     */
    DataTableRow.prototype.getCell = function (cellName) {
        var row = this;
        if (row.id === 'NULL') {
            return null;
        }
        return row.cells[cellName];
    };
    /**
     * Converts the value of the given cell name to a boolean and returns it.
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
     * Converts the value of the given cell name to a Date and returns it.
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
     * Converts the value of the given cell name to a number and returns it.
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
     * Converts the value of the given cell name to a string and returns it.
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
     * Tests if the value of the given cell name is a DataTable and returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTable|undefined}
     * Cell value of the cell in this row, if it is a DataTable.
     */
    DataTableRow.prototype.getCellAsTable = function (cellName) {
        var value = this.getCell(cellName);
        if (!value ||
            typeof value !== 'object' ||
            value instanceof Date) {
            return;
        }
        return value;
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
     * Checks whether a cell with the given name exists in this row.
     *
     * @param {string} cellName
     * Cell name to check.
     *
     * @return {boolean}
     * True, if a cell with the name exists.
     */
    DataTableRow.prototype.hasCell = function (cellName) {
        return (this.getCellNames().indexOf(cellName) >= 0);
    };
    /**
     * Checks if this row is null; therefor an instance of `DataTableRow.NULL`.
     *
     * @return {boolean}
     * True, if row is null.
     */
    DataTableRow.prototype.isNull = function () {
        return (this === DataTableRow.NULL);
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
     * Deletes a cell and returns the content of the cell.
     *
     * @param {string} cellName
     * The name of the cell to remove.
     * Cells with the name `id` cannot be removed, and will return `undefined`.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTableRow.CellType}
     * Returns the value of the removed cell.
     *
     * @emits DataTableRow#deleteCell
     * @emits DataTableRow#afterDeleteCell
     * @emits DataTableRow#afterChangeRow
     */
    DataTableRow.prototype.removeCell = function (cellName, eventDetail) {
        var row = this, cells = row.cells, cellValue = cells[cellName];
        if (cellName === 'id' ||
            row.id === 'NULL') {
            return void 0;
        }
        row.deleteCell(cellName, eventDetail); // delete row.cells[cellName];
        return cellValue;
    };
    /**
     * Sets a cell in this row.
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
     * Returns true, if the cell was set in this row. Returns false, if `id`
     * was used as cell name, or row is null.
     *
     * @emits DataTableRow#setCell
     * @emits DataTableRow#afterSetCell
     * @emits DataTableRow#afterChangeRow
     */
    DataTableRow.prototype.setCell = function (cellName, cellValue, eventDetail) {
        var _a;
        return this.setCells((_a = {}, _a[cellName] = cellValue, _a), eventDetail);
    };
    /**
     * Updates and inserts cells in this row.
     *
     * @param {Record<string,DataTableRow.CellType>} cells
     * Cells as a dictionary of names and values.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * True, if all cells were set, otherwise false.
     *
     * @emits DataTableRow#setCell
     * @emits DataTableRow#afterSetCell
     * @emits DataTableRow#afterChangeRow
     */
    DataTableRow.prototype.setCells = function (cells, eventDetail) {
        var row = this, rowCells = this.cells, cellNames = Object.keys(cells);
        if (cellNames.indexOf('id') >= 0 ||
            row.id === 'NULL') {
            return false;
        }
        for (var i = 0, iEnd = cellNames.length, cellName = void 0, cellValue = void 0; i < iEnd; ++i) {
            cellName = cellNames[i];
            cellValue = cells[cellName];
            row.emit({
                type: 'setCell',
                cellName: cellName,
                cellValue: cellValue,
                detail: eventDetail
            });
            rowCells[cellName] = cellValue;
            row.emit({
                type: 'afterSetCell',
                cellName: cellName,
                cellValue: cellValue,
                detail: eventDetail
            });
        }
        row.emit({
            type: 'afterChangeRow',
            detail: eventDetail
        });
        return true;
    };
    /**
     * Converts the row to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this row.
     */
    DataTableRow.prototype.toJSON = function () {
        var row = this, cells = row.getAllCells(), cellNames = row.getCellNames(), json = {
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
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Shared table row representing `null` with id `"NULL"`.
     */
    DataTableRow.NULL = new DataTableRow({ id: 'NULL' });
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
