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
            columns: DataTableRow.Cells = {};

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
     * @param {DataTableRow.Cells} [cells]
     * Cell values in a record object.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions.
     */
    constructor(
        cells: DataTableRow.Cells = {},
        converter: DataConverter = new DataConverter()
    ) {
        cells = merge(cells);

        this.autoId = false;
        this.cells = cells;
        this.converter = converter;

        if (typeof cells.id === 'string') {
            this.id = cells.id;
        } else {
            this.autoId = true;
            this.id = uniqueKey();
        }

        delete cells.id;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Indicates an automatically generated id, if no ID-cell was provided.
     */
    public autoId: boolean;

    /**
     * Record object of all cell names with their values in this rows.
     * @private
     */
    private cells: DataTableRow.Cells;

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
     * Removes all cells from this row.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataTableRow#clearRow
     * @emits DataTableRow#afterClearRow
     */
    public clear(eventDetail?: DataEventEmitter.EventDetail): void {

        this.emit({ type: 'clearRow', detail: eventDetail });

        this.cells = {};

        this.emit({ type: 'afterClearRow', detail: eventDetail });
    }

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
    public deleteCell(
        cellName: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const row = this,
            cellValue = row.cells[cellName];

        if (
            cellName === 'id' ||
            Object.keys(row.cells).indexOf(cellName) < 0
        ) {
            return false;
        }

        this.emit({
            type: 'deleteCell',
            cellName,
            cellValue,
            detail: eventDetail
        });

        delete row.cells[cellName];

        this.emit({
            type: 'afterDeleteCell',
            cellName,
            cellValue,
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
     * Returns a copy of the record object of all cell names with their values.
     *
     * @return {DataTableRow.Cells}
     * Copy of the record object with all cell names and values.
     */
    public getAllCells(): DataTableRow.Cells {
        return merge(this.cells);
    }

    /**
     * Returns the value of the given cell name or cell index.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTableRow.CellType}
     * Cell value in this row.
     */
    public getCell(cellName: string): DataTableRow.CellType {
        return this.cells[cellName];
    }

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
    public getCellAsBoolean(cellName: string): boolean {
        return this.converter.asBoolean(this.getCell(cellName));
    }

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
    public getCellAsDataTable(cellName: string): DataTable {
        return this.converter.asDataTable(this.getCell(cellName));
    }

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
    public getCellAsDate(cellName: string): Date {
        return this.converter.asDate(this.getCell(cellName));
    }

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
    public getCellAsNumber(cellName: string): number {
        return this.converter.asNumber(this.getCell(cellName));
    }

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
    public getCellAsString(cellName: string): string {
        return this.converter.asString(this.getCell(cellName));
    }

    /**
     * Returns the number of cell in this row.
     *
     * @return {number}
     * Number of cells in this row.
     */
    public getCellCount(): number {
        return this.getCellNames().length;
    }

    /**
     * Returns the cell names in this row.
     *
     * @return {Array<string>}
     * Cell names in this row.
     */
    public getCellNames(): Array<string> {
        return Object.keys(this.cells);
    }

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
    public insertCell(
        cellName: string,
        cellValue: DataTableRow.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const row = this,
            cells = row.cells;

        if (
            cellName === 'id' ||
            Object.keys(cells).indexOf(cellName) !== -1
        ) {
            return false;
        }

        row.emit({
            type: 'insertCell',
            cellName,
            cellValue,
            detail: eventDetail
        });

        row.cells[cellName] = cellValue;

        row.emit({
            type: 'afterInsertCell',
            cellName,
            cellValue,
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
        const row = this,
            cells = row.getAllCells(),
            cellNames = Object.keys(cells),
            json: DataTableRow.ClassJSON = {
                $class: 'DataTableRow'
            };

        let name: string,
            value: DataTableRow.CellType;

        if (!this.autoId) {
            json.id = this.id;
        }

        for (let i = 0, iEnd = cellNames.length; i < iEnd; ++i) {
            name = cellNames[i];
            value = cells[name];

            /* eslint-disable @typescript-eslint/indent */
            switch (typeof value) {
                default:
                    if (value === null) {
                        json[name] = value;
                    } else if (value instanceof Date) {
                        json[name] = value.getTime();
                    } else { // DataTable
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
    }

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
    public updateCell(
        cellName: string,
        cellValue: DataTableRow.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const row = this;

        if (cellName === 'id') {
            return false;
        }

        row.emit({
            type: 'updateCell',
            cellName,
            cellValue,
            detail: eventDetail
        });

        row.cells[cellName] = cellValue;

        row.emit({
            type: 'afterUpdateCell',
            cellName,
            cellValue
        });

        return true;
    }

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for cells, events, and JSON conversion.
 */
namespace DataTableRow {

    /**
     * Describes the information object for cell-related events.
     */
    export interface CellEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'deleteCell'|'afterDeleteCell'|
            'insertCell'|'afterInsertCell'|
            'updateCell'|'afterUpdateCell'
        );
        readonly cellName: string;
        readonly cellValue: CellType;
    }

    /**
     * Record object with column names and their values in a row.
     */
    export type Cells = Record<string, CellType>;

    /**
     * Possible value types for a column in a row.
     *
     * *Please note:* `Date` and `DataTable` are not JSON-compatible and have
     * to be converted with the help of their `toJSON()` function.
     */
    export type CellType = (
        boolean|null|number|string|Date|DataTable|undefined
    );

    /**
     * Describes the class JSON of a DataTableRow.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        [key: string]: (DataJSON.Primitives|DataTable.ClassJSON|Array<DataTableRow.ClassJSON>);
    }

    /**
     * All information objects of DataTableRow events.
     */
    export type EventObject = (CellEventObject|RowEventObject);

    /**
     * Describes the information object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'clearRow'|'afterClearRow'
        );
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
