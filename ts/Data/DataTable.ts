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
import type DataValueType from './DataValueType';
import DataConverter from './DataConverter.js';
import DataJSON from './DataJSON.js';
import DataTableRow from './DataTableRow.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class to manage rows in a table structure.
 */
class DataTable implements DataEventEmitter<DataTable.EventObject>, DataJSON.Class {

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
    public static fromColumns(
        columns: DataValueType[][] = [],
        headers: string [] = []
    ): DataTable {
        const table = new DataTable();
        const columnsLength = columns.length;
        if (columnsLength) {
            const rowsLength = columns[0].length;
            let i = 0;

            while (i < rowsLength) {
                const row = new DataTableRow();
                for (let j = 0; j < columnsLength; ++j) {
                    row.insertCell((headers.length ? headers[j] : uniqueKey()), columns[j][i]);
                }
                table.insertRow(row);
                ++i;
            }
        }
        return table;
    }
    /**
     * Converts a DataTable to a record of columns
     * @param {DataTable} dataTable
     * The datatable to convert
     *
     * @return {DataTable.ColumnCollection}
     * An object with column names as keys,
     * and value an array of cell values
     */
    public static toColumns(dataTable: DataTable): DataTable.ColumnCollection {
        const columnsObject: DataTable.ColumnCollection = {};
        for (let i = 0, rowCount = dataTable.getRowCount(); i < rowCount; i++) {
            const row = dataTable.rows[i],
                cellNames = row.getCellNames(),
                cellCount = cellNames.length;

            for (let j = 0; j < cellCount; j++) {
                const cellName = cellNames[j],
                    cell = row.getCell(cellName);

                if (!columnsObject[cellName]) {
                    columnsObject[cellName] = [];
                }
                let cellValue: DataJSON.Types;

                if (cell instanceof DataTable) {
                    cellValue = cell.toJSON();
                } else if (cell instanceof Date) {
                    cellValue = row.getCellAsNumber(cellName);
                } else {
                    cellValue = cell;
                }

                columnsObject[cellName][i] = cellValue;
            }
        }

        return columnsObject;
    }
    /**
     * Converts a supported class JSON to a DataTable instance.
     *
     * @param {DataTable.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataTable}
     * DataTable instance from the class JSON.
     */
    public static fromJSON(json: DataTable.ClassJSON): DataTable {
        const rows = json.rows,
            dataRows: Array<DataTableRow> = [];

        try {
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataTableRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows);
        } catch (error) {
            return new DataTable();
        }
    }

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
    public constructor(
        rows: Array<DataTableRow> = [],
        converter: DataConverter = new DataConverter()
    ) {
        const rowsIdMap: Record<string, DataTableRow> = {};

        let row: DataTableRow;

        rows = rows.slice();

        this.converter = converter;
        this.id = uniqueKey();
        this.rows = rows;
        this.rowsIdMap = rowsIdMap;
        this.watchsIdMap = {};

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            row.converter = converter;
            rowsIdMap[row.id] = row;
            this.watchRow(row);
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Converter for value conversions in table rows.
     */
    public readonly converter: DataConverter;

    /**
     * ID of the table. As an inner table the ID links to the column ID in the
     * outer table.
     */
    public id: string;

    /**
     * Array of all rows in the table.
     */
    private rows: Array<DataTableRow>;

    /**
     * Registry as record object with row IDs and their DataTableRow instance.
     */
    private rowsIdMap: Record<string, DataTableRow>;

    /**
     * Internal version tag that changes with each modification of the table or
     * a related row.
     */
    private versionTag?: string;

    /**
     * Registry of record objects with row ID and an array of unregister
     * functions of DataTableRow-related callbacks. These callbacks are used to
     * keep the version tag changing in case of row modifications.
     */
    private watchsIdMap: Record<string, Array<Function>>;

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
    public clear(eventDetail?: DataEventEmitter.EventDetail): void {

        this.emit({ type: 'clearTable', detail: eventDetail });

        const rowIds = this.getAllRowIds();

        for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.unwatchRow(rowIds[i], true);
        }

        this.rows.length = 0;
        this.rowsIdMap = {};
        this.watchsIdMap = {};

        this.emit({ type: 'afterClearTable', detail: eventDetail });
    }

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
    public deleteRow(
        rowId: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): (DataTableRow|undefined) {
        const row = this.rowsIdMap[rowId],
            index = this.rows.indexOf(row);

        this.emit({ type: 'deleteRow', detail: eventDetail, index, row });

        this.rows[index] = row;
        delete this.rowsIdMap[rowId];
        this.unwatchRow(rowId);

        this.emit({ type: 'afterDeleteRow', detail: eventDetail, index, row });

        return row;
    }

    /**
     * Emits an event on this table to all registered callbacks of the given
     * event.
     *
     * @param {DataTable.EventObject} e
     * Event object with event information.
     */
    public emit(e: DataTable.EventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Return the array of row IDs of this table.
     *
     * @return {Array<string>}
     * Array of row IDs in this table.
     */
    public getAllRowIds(): Array<string> {
        return Object.keys(this.rowsIdMap);
    }

    /**
     * Returns a copy of the internal array with rows.
     *
     * @return {Array<DataTableRow>}
     * Copy of the internal array with rows.
     */
    public getAllRows(): Array<DataTableRow> {
        return this.rows.slice();
    }

    /**
     * Returns the row with the fiven index or row ID.
     *
     * @param {number|string} row
     * Row index or row ID.
     *
     * @return {DataTableRow.CellType}
     * Column value of the column in this row.
     */
    public getRow(row: (number|string)): (DataTableRow|undefined) {

        if (typeof row === 'string') {
            return this.rowsIdMap[row];
        }

        return this.rows[row];
    }

    /**
     * Returns the number of rows in this table.
     *
     * @return {number}
     * Number of rows in this table.
     *
     * @todo Consider implementation via property getter `.length` depending on
     *       browser support.
     */
    public getRowCount(): number {
        return this.rows.length;
    }

    /**
     * Returns the version tag that changes with each modification of the table
     * or a related row.
     *
     * @return {string}
     * Version tag of the current state.
     */
    public getVersionTag(): string {
        return this.versionTag || (this.versionTag = uniqueKey());
    }

    /**
     * Converts the datatable instance to a record of columns
     * @return {DataTable.ColumnCollection}
     * A record of columns
     */
    public toColumns(): DataTable.ColumnCollection {
        return DataTable.toColumns(this);
    }

    public insertColumn(
        column: (number|string),
        cells: (
            Array<DataTableRow.CellType>|Record<string, DataTableRow.CellType>
        ),
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            rowsIdMap = table.rowsIdMap,
            uniqueColumn = uniqueKey();

        if (cells instanceof Array) {
            const record: Record<string, DataTableRow.CellType> = {};
            for (let i = 0, iEnd = cells.length; i < iEnd; ++i) {
                record[`${i}`] = cells[i];
            }
            cells = record;
        }

        const rowIds = Object.keys(cells);

        let row: (DataTableRow|undefined),
            rowId: string,
            success = false;

        for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            rowId = rowIds[i];
            row = rowsIdMap[rowId];

            if (!row) {
                row = new DataTableRow({
                    [rowId]: cells[rowId]
                });
                success = success && table.insertRow(row);
            } else {
                if (typeof column === 'number') {
                    column = (row.getCellNames()[column] || uniqueColumn);
                }
                success = success && row.insertCell(column, cells[rowId]);
            }
        }

        return success;
    }

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
    public insertRow(
        row: DataTableRow,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const rowId = row.id;
        const index = this.rows.length;

        if (typeof this.rowsIdMap[rowId] !== 'undefined') {
            return false;
        }

        this.emit({ type: 'insertRow', detail: eventDetail, index, row });

        this.rows.push(row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);

        this.emit({ type: 'afterInsertRow', detail: eventDetail, index, row });

        return true;
    }

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
    public on(
        type: DataTable.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataTable.EventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Watchs for events in a row to keep the version tag of the table updated.
     *
     * @param {DataTableRow} row
     * Row the watch for modifications.
     *
     * @emits DataTable#afterUpdateRow
     */
    private watchRow(row: DataTableRow): void {
        const table = this,
            index = table.rows.indexOf(row),
            watchsIdMap = table.watchsIdMap,
            watchs: Array<Function> = [];

        /**
         * @private
         * @param {DataTableRow.EventObject} e
         * Received event.
         */
        function callback(e: DataTableRow.EventObject): void {
            table.versionTag = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { detail: e.detail, index, row });
        }

        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteCell', callback));
        watchs.push(row.on('afterInsertCell', callback));
        watchs.push(row.on('afterUpdateCell', callback));

        watchsIdMap[row.id] = watchs;
    }

    /**
     * Converts the table to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this table.
     */
    public toJSON(): DataTable.ClassJSON {
        const json: DataTable.ClassJSON = {
            $class: 'DataTable',
            rows: []
        };
        const rows = this.rows;

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            json.rows.push(rows[i].toJSON());
        }

        return json;
    }

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
    private unwatchRow(rowId: string, skipDelete?: boolean): void {
        const watchsIdMap = this.watchsIdMap;
        const watchs = watchsIdMap[rowId] || [];

        for (let i = 0, iEnd = watchs.length; i < iEnd; ++i) {
            watchs[i]();
        }

        if (!skipDelete) {
            delete watchsIdMap[rowId];
        }
    }

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for events and JSON conversion.
 */
namespace DataTable {

    /**
     * All information objects of DataTable events.
     */
    export type EventObject = (RowEventObject|TableEventObject);

    /**
     * Event types related to a row in a table.
     */
    export type RowEventType = (
        'deleteRow'|'afterDeleteRow'|
        'insertRow'|'afterInsertRow'|
        'afterUpdateRow'
    );

    /**
     * Event types related to the table itself.
     */
    export type TableEventType = (
        'clearTable'|'afterClearTable'
    );

    /**
     * A record of columns, where the key is the column name
     * and the value is an array of column values
     */
    export interface ColumnCollection {
        [className: string]: Array<DataJSON.Types>;
    }

    /**
     * Describes the class JSON of a DataTable.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        rows: Array<DataTableRow.ClassJSON>;
    }

    /**
     * Describes the information object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        readonly type: RowEventType;
        readonly index: number;
        readonly row: DataTableRow;
    }

    /**
     * Describes the information object for table-related events.
     */
    export interface TableEventObject extends DataEventEmitter.EventObject {
        readonly type: TableEventType;
    }

}

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
