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
import DataConverter from './DataConverter.js';
import DataJSON from './DataJSON.js';
import DataRow from './DataRow.js';
import U from '../Core/Utilities.js';
import DataValueType from './DataValueType';
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
class DataTable implements DataEventEmitter<DataTable.EventObjects>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Converts a supported class JSON to a DataTable instance.
     *
     * @param {DataRow.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {DataTable}
     * DataTable instance from the class JSON.
     */
    public static fromJSON(json: DataTable.ClassJSON): DataTable {
        const rows = json.rows,
            dataRows: Array<DataRow> = [];

        try {
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows);
        } catch (error) {
            return new DataTable();
        }
    }

    public static fromColumns(columns: DataValueType[][] = [], headers: string [] = []): DataTable {
        const table = new DataTable();
        const columnsLength = columns.length;
        if (columnsLength) {
            const rowsLength = columns[0].length;
            let i = 0;

            while (i < rowsLength) {
                const row = new DataRow();
                for (let j = 0; j < columnsLength; ++j) {
                    row.insertColumn((headers.length ? headers[j] : uniqueKey()), columns[j][i]);
                }
                table.insertRow(row);
                ++i;
            }
        }
        return table;
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the DataRow class.
     *
     * @param {Array<DataRow>} [rows]
     * Array of table rows as DataRow instances.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
     */
    public constructor(
        rows: Array<DataRow> = [],
        converter: DataConverter = new DataConverter()
    ) {
        const rowsIdMap: Record<string, DataRow> = {};

        let row: DataRow;

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
    private rows: Array<DataRow>;

    /**
     * Registry as record object with row IDs and their DataRow instance.
     */
    private rowsIdMap: Record<string, DataRow>;

    /**
     * Internal version tag that changes with each modification of the table or
     * a related row.
     */
    private versionTag?: string;

    /**
     * Registry of record objects with row ID and an array of unregister
     * functions of DataRow-related callbacks. These callbacks are used to keep
     * the version tag changing in case of row modifications.
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
     * @emits DataTable#clearTable
     * @emits DataTable#afterClearTable
     */
    public clear(): void {

        this.emit({ type: 'clearTable' });

        const rowIds = this.getAllRowIds();

        for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
            this.unwatchRow(rowIds[i], true);
        }

        this.rows.length = 0;
        this.rowsIdMap = {};
        this.watchsIdMap = {};

        this.emit({ type: 'afterClearTable' });
    }

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
    public deleteRow(rowId: string): (DataRow|undefined) {
        const row = this.rowsIdMap[rowId],
            index = this.rows.indexOf(row);

        this.emit({ type: 'deleteRow', index, row });

        this.rows[index] = row;
        delete this.rowsIdMap[rowId];
        this.unwatchRow(rowId);

        this.emit({ type: 'afterDeleteRow', index, row });

        return row;
    }

    /**
     * Emits an event on this row to all registered callbacks of the given
     * event.
     *
     * @param {DataTable.EventObjects} [e]
     * Event object with event information.
     */
    public emit(e: DataTable.EventObjects): void {
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
     * @return {Array<DataRow>}
     * Copy of the internal array with rows.
     */
    public getAllRows(): Array<DataRow> {
        return this.rows.slice();
    }

    /**
     * Returns the row with the fiven index or row ID.
     *
     * @param {number|string} row
     * Row index or row ID.
     *
     * @return {DataRow.ColumnTypes}
     * Column value of the column in this row.
     */
    public getRow(row: (number|string)): (DataRow|undefined) {

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
     * Adds a row to this table.
     *
     * @param {DataRow} row
     * Row to add to this table.
     *
     * @return {boolean}
     * Returns true, if the row has been added to the table. Returns false, if
     * a row with the same row ID already exists in the table.
     */
    public insertRow(row: DataRow): boolean {
        const rowId = row.id;
        const index = this.rows.length;

        if (typeof this.rowsIdMap[rowId] !== 'undefined') {
            return false;
        }

        this.emit({ type: 'insertRow', index, row });

        this.rows.push(row);
        this.rowsIdMap[rowId] = row;
        this.watchRow(row);

        this.emit({ type: 'afterInsertRow', index, row });

        return true;
    }

    /**
     * Registers a callback for a specific event.
     *
     * @param {DataRow.EventTypes} type
     * Event type as a string.
     *
     * @param {DataRow.EventCallbacks} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    public on(
        type: DataTable.EventObjects['type'],
        callback: DataEventEmitter.EventCallback<this, DataTable.EventObjects>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Watchs for events in a row to keep the version tag of the table updated.
     *
     * @param {DataRow} row
     * Row the watch for modifications.
     */
    private watchRow(row: DataRow): void {
        const table = this,
            index = table.rows.indexOf(row),
            watchsIdMap = table.watchsIdMap,
            watchs: Array<Function> = [];

        /** @private */
        function callback(): void {
            table.versionTag = uniqueKey();
            fireEvent(table, 'afterUpdateRow', { index, row });
        }

        watchs.push(row.on('afterClearRow', callback));
        watchs.push(row.on('afterDeleteColumn', callback));
        watchs.push(row.on('afterInsertColumn', callback));
        watchs.push(row.on('afterUpdateColumn', callback));

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
    export type EventObjects = (RowEventObject|TableEventObject);

    /**
     * Event types related to a row in a table.
     */
    export type RowEventTypes = (
        'deleteRow'|'afterDeleteRow'|
        'insertRow'|'afterInsertRow'|
        'afterUpdateRow'
    );

    /**
     * Event types related to the table itself.
     */
    export type TableEventTypes = (
        'clearTable'|'afterClearTable'
    );

    /**
     * Describes the class JSON of a DataTable.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        rows: Array<DataRow.ClassJSON>;
    }

    /**
     * Describes the information object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        readonly index: number;
        readonly row: DataRow;
    }

    /**
     * Describes the information object for table-related events.
     */
    export interface TableEventObject extends DataEventEmitter.EventObject {
        // nothing here yet
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
