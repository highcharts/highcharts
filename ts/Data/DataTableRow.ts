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
     *  Static Properties
     *
     * */

    /**
     * Shared table row representing `null` with id `"NULL"`.
     */
    public static readonly NULL = new DataTableRow({ id: 'NULL' });

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
            columnValue: (DataJSON.JSONPrimitive|DataTable.ClassJSON|Array<DataTableRow.ClassJSON>),
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
            this.isNull = true;
            if (cells.id === 'NULL') {
                return DataTableRow.NULL;
            }
        } else {
            this.autoId = true;
            this.id = uniqueKey();
            this.isNull = false;
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
    public readonly autoId: boolean;

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
    public readonly id: string;

    /**
     * True, if this row is an instance of `DataTableRow.NULL`.
     */
    public readonly isNull: boolean;

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
        const row = this;

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
     * @emits DataTableRow#afterChangeRow
     */
    public deleteCell(
        cellName: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const row = this,
            cells = row.cells,
            cellValue = cells[cellName];

        if (
            cellName === 'id' ||
            row.id === 'NULL'
        ) {
            return false;
        }

        row.emit({
            type: 'deleteCell',
            cellName,
            cellValue,
            detail: eventDetail
        });

        delete cells[cellName];

        row.emit({
            type: 'afterDeleteCell',
            cellName,
            cellValue,
            detail: eventDetail
        });
        row.emit({
            type: 'afterChangeRow',
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
     * Returns the value of the given cell name.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTableRow.CellType}
     * Cell value in this row.
     */
    public getCell(cellName: string): DataTableRow.CellType {
        const row = this;

        if (row.id === 'NULL') {
            return null;
        }

        return row.cells[cellName];
    }

    /**
     * Converts the value of the given cell name to a boolean and returns it.
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
     * Converts the value of the given cell name to a Date and returns it.
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
     * Converts the value of the given cell name to a number and returns it.
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
     * Converts the value of the given cell name to a string and returns it.
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
     * Tests if the value of the given cell name is a DataTable and returns it.
     *
     * @param {string} cellName
     * Cell name to fetch.
     *
     * @return {DataTable|undefined}
     * Cell value of the cell in this row, if it is a DataTable.
     */
    public getCellAsTable(cellName: string): (DataTable|undefined) {
        const value = this.getCell(cellName);

        if (
            !value ||
            typeof value !== 'object' ||
            value instanceof Date
        ) {
            return;
        }

        return value;
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
     * Checks whether a cell with the given name exists in this row.
     *
     * @param {string} cellName
     * Cell name to check.
     *
     * @return {boolean}
     * True, if a cell with the name exists.
     */
    public hasCell(cellName: string): boolean {
        return (this.getCellNames().indexOf(cellName) >= 0);
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
    public removeCell(
        cellName: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTableRow.CellType {
        const row = this,
            cells = row.cells,
            cellValue = cells[cellName];

        if (
            cellName === 'id' ||
            row.id === 'NULL'
        ) {
            return void 0;
        }

        row.deleteCell(cellName, eventDetail); // delete row.cells[cellName];

        return cellValue;
    }

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
    public setCell(
        cellName: string,
        cellValue: DataTableRow.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        return this.setCells({ [cellName]: cellValue }, eventDetail);
    }

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
    public setCells(
        cells: Record<string, DataTableRow.CellType>,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const row = this,
            rowCells = this.cells,
            cellNames = Object.keys(cells);

        if (
            cellNames.indexOf('id') >= 0 ||
            row.id === 'NULL'
        ) {
            return false;
        }

        for (
            let i = 0,
                iEnd = cellNames.length,
                cellName: string,
                cellValue: DataTableRow.CellType;
            i < iEnd;
            ++i
        ) {
            cellName = cellNames[i];
            cellValue = cells[cellName];

            row.emit({
                type: 'setCell',
                cellName,
                cellValue,
                detail: eventDetail
            });

            rowCells[cellName] = cellValue;

            row.emit({
                type: 'afterSetCell',
                cellName,
                cellValue,
                detail: eventDetail
            });
        }

        row.emit({
            type: 'afterChangeRow',
            detail: eventDetail
        });

        return true;
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
            cellNames = row.getCellNames(),
            json: DataTableRow.ClassJSON = {
                $class: 'DataTableRow'
            };

        let name: string,
            value: DataTableRow.CellType;

        if (!this.autoId) {
            json.id = this.id;
        }

        for (
            let i = 0,
                iEnd = cellNames.length;
            i < iEnd;
            ++i
        ) {
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
            'setCell'|'afterSetCell'
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
        [key: string]: (DataJSON.JSONPrimitive|DataTable.ClassJSON|Array<DataTableRow.ClassJSON>);
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
            'clearRow'|'afterClearRow'|
            'afterChangeRow'
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
