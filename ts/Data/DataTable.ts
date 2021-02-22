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
import DataPresentationState from './DataPresentationState.js';
import DataTableRow from './DataTableRow.js';
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
 * Class to manage rows in a table structure.
 */
class DataTable implements DataEventEmitter<DataTable.EventObject>, DataJSON.Class {

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
    public static fromJSON(json: DataTable.ClassJSON): DataTable {
        const rows = json.rows,
            dataRows: Array<DataTableRow> = [];

        let presentationState: (DataPresentationState|undefined);

        if (json.presentationState) {
            presentationState = DataPresentationState.fromJSON(json.presentationState);
        }

        try {
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                dataRows[i] = DataTableRow.fromJSON(rows[i]);
            }
            return new DataTable(dataRows, void 0, presentationState);
        } catch (error) {
            return new DataTable(void 0, void 0, presentationState);
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
     * @param {string} [id]
     * DataTable identifier.
     *
     * @param {DataPresentationState} [presentationState]
     * Presentation state for the DataTable.
     *
     * @param {DataConverter} [converter]
     * Converter for value conversions in table rows.
     */
    public constructor(
        rows: Array<DataTableRow> = [],
        id?: string,
        presentationState: DataPresentationState = new DataPresentationState(),
        converter: DataConverter = new DataConverter()
    ) {
        const rowsIdMap: Record<string, DataTableRow> = {};

        let row: DataTableRow;

        rows = rows.slice();

        this.converter = converter;
        this.id = id || uniqueKey();
        this.presentationState = presentationState;
        this.rows = rows;
        this.rowsIdMap = rowsIdMap;
        this.unwatchIdMap = {};
        this.aliasMap = {};

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
     * A map of aliases for column names
     * [Alias]: columnName
     */
    public readonly aliasMap: Record<string, string>;

    public presentationState: DataPresentationState;

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
    private unwatchIdMap: Record<string, Function>;

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

        const rowIDs = this.getAllRowIds();

        for (let i = 0, iEnd = rowIDs.length; i < iEnd; ++i) {
            this.unwatchRow(rowIDs[i], true);
        }

        this.rows.length = 0;
        this.rowsIdMap = {};
        this.unwatchIdMap = {};

        this.emit({ type: 'afterClearTable', detail: eventDetail });
    }

    /**
     * Create an empty copy of the table with all the informations
     * from the original table.
     *
     * @return {DataTable}
     * Returns new empty DataTable instance.
     */
    public clone(): DataTable {
        const table = this,
            newTable = new DataTable([], table.id, table.presentationState, table.converter),
            aliasMapNames = Object.keys(table.aliasMap);

        let eventNames,
            eventName: DataTable.EventObject['type'],
            eventArr,
            eventFunction,
            alias;

        if (table.hcEvents) {
            eventNames = Object.keys(table.hcEvents);

            for (let i = 0, iEnd = eventNames.length; i < iEnd; i++) {
                eventName = eventNames[i] as DataTable.EventObject['type'];
                eventArr = table.hcEvents[eventName];

                for (let j = 0, jEnd = eventArr.length; j < jEnd; j++) {
                    eventFunction = (eventArr[j] as any).fn;
                    newTable.on(eventName, eventFunction);
                }
            }
        }

        if (table.versionTag) {
            newTable.versionTag = table.versionTag;
        }

        if (table.aliasMap) {
            for (let k = 0, kEnd = aliasMapNames.length; k < kEnd; k++) {
                alias = aliasMapNames[k];
                newTable.createColumnAlias(table.aliasMap[alias], alias);
            }
        }

        return newTable;
    }

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
     * True if successfully added, false if already in use or reserved.
     */
    public createColumnAlias(columnName: string, alias: string): boolean {
        if (alias === 'id' || this.aliasMap[alias]) {
            return false;
        }

        this.aliasMap[alias] = columnName;

        return true;
    }

    /**
     * Deletes a column of cells from the table.
     * @param {string} columnName
     * The name of the column to be deleted (not an alias).
     *
     * @return {boolean}
     * `true` if the at least one cell is deleted.
     */
    private deleteColumn(
        columnName: string
    ): boolean {
        const rows = this.getAllRows();
        let success = false;
        for (let i = 0, rowCount = rows.length; i < rowCount; i++) {
            if (rows[i].deleteCell(columnName)) {
                success = true;
            }
        }

        return success;
    }

    /**
     * Deletes a column alias for this table.
     *
     * @param {string} alias
     * The alias to delete.
     */
    public deleteColumnAlias(alias: string): void {
        delete this.aliasMap[alias];
    }

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
    public deleteRow(
        row: (string|DataTableRow),
        eventDetail?: DataEventEmitter.EventDetail
    ): (DataTableRow|undefined) {
        const table = this,
            rows = table.rows;

        if (typeof row === 'string') {
            row = table.rowsIdMap[row];
        }

        const index = rows.indexOf(row);

        this.emit({
            type: 'deleteRow',
            detail: eventDetail,
            index,
            row
        });

        this.unwatchRow(row.id);
        rows.splice(index, 1);
        delete table.rowsIdMap[row.id];

        this.emit({
            type: 'afterDeleteRow',
            detail: eventDetail,
            index,
            row
        });

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
     * Retrieves the given column, either by the canonical column name, or by an
     * alias.
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to get, alias takes precedence.
     *
     * @return {DataTable.Column|undefined}
     * An array with column values, or `undefined` if not found.
     */
    public getColumn(columnNameOrAlias: string): (DataTable.Column|undefined) {
        return this.getColumns([columnNameOrAlias])[columnNameOrAlias];
    }

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
    public getColumns(
        columnNamesOrAlias: Array<string> = [],
        usePresentationOrder?: boolean
    ): DataTable.ColumnCollection {
        const table = this,
            aliasMap = table.aliasMap,
            rows = table.rows,
            noColumnNames = !columnNamesOrAlias.length,
            presentationSorter = table.presentationState.getColumnSorter(),
            columns: Record<string, Array<DataTableRow.CellType>> = {};

        let columnName: string,
            row: DataTableRow,
            cell: DataTableRow.CellType;

        if (usePresentationOrder) {
            columnNamesOrAlias.sort(presentationSorter);
        }

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];

            if (noColumnNames) {
                columnNamesOrAlias = row.getCellNames();
                if (usePresentationOrder) {
                    columnNamesOrAlias.sort(presentationSorter);
                }
                columnNamesOrAlias.unshift('id');
            }

            for (let j = 0, jEnd = columnNamesOrAlias.length; j < jEnd; ++j) {
                columnName = columnNamesOrAlias[j];
                cell = (
                    columnName === 'id' ?
                        row.id :
                        row.getCell(aliasMap[columnName] || columnName)
                );

                if (
                    columns[columnName] ||
                    typeof cell !== 'undefined'
                ) {
                    if (!columns[columnName]) {
                        columns[columnName] = new Array(i + 1);
                    }
                    columns[columnName][i] = cell;
                }
            }
        }

        return columns;
    }

    /**
     * Returns the first row of the table that is not null.
     *
     * @return {DataTableRow|undefined}
     * The first non-null row, if found, otherwise `undefined`.
     */
    public getFirstNonNullRow(): (DataTableRow|undefined) {
        const rows = this.getAllRows();

        let nonNullRow: (DataTableRow|undefined),
            row: DataTableRow;

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            row = rows[i];
            if (!row.isNull) {
                nonNullRow = row;
                break;
            }
        }

        return nonNullRow;
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
        const table = this;

        if (typeof row === 'string') {
            return table.rowsIdMap[row];
        }

        return table.rows[row];
    }

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
    public getRowCell(
        row: (string|number),
        columnNameOrAlias: string
    ): DataTableRow.CellType {
        const cellName = this.aliasMap[columnNameOrAlias] || columnNameOrAlias,
            foundRow = this.getRow(row);

        return foundRow && foundRow.getCell(cellName);
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
     * Returns the index of a given row in this table.
     *
     * @param {string|DataTableRow} row
     * Row to determ index for.
     *
     * @return {number}
     * Index of the row in this table, -1 if not found.
     */
    public getRowIndex(row: (string|DataTableRow)): number {
        const table = this;

        if (typeof row === 'string') {
            row = table.rowsIdMap[row];
        }

        return table.rows.indexOf(row);
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
    public insertRow(
        row: DataTableRow,
        eventDetail?: DataEventEmitter.EventDetail,
        index?: number
    ): boolean {
        const table = this,
            rows = table.rows,
            rowsIdMap = table.rowsIdMap,
            rowsLength = rows.length,
            rowID = row.id;

        if (rowsIdMap[rowID]) {
            return false;
        }

        table.emit({
            type: 'insertRow',
            detail: eventDetail,
            index: (index || rowsLength),
            row
        });

        if (
            !index ||
            index === rowsLength
        ) {
            rows.push(row);
        } else {
            rows.splice(index, 0, row);
        }

        rowsIdMap[rowID] = row;
        table.watchRow(row);

        table.emit({
            type: 'afterInsertRow',
            detail: eventDetail,
            index: (index || rowsLength),
            row
        });

        return true;
    }

    /**
     * Inserts an array of rows into the table
     *
     * @param {Array<DataTableRow>} rows
     * Array of rows to insert
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Details for insertRow event
     *
     * @return {boolean}
     * The datatable with the inserted rows
     */
    public insertRows(
        rows: Array<DataTableRow>,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        for (
            let i = 0,
                iEnd = rows.length;
            i < iEnd;
            ++i
        ) {
            this.insertRow(rows[i], eventDetail);
        }

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
    public removeColumn(
        columnName: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): Array<DataTableRow.CellType> {
        const rows = this.getAllRows(),
            cellValueArray = [];

        this.emit({ type: 'removeColumn', detail: eventDetail, columnName });

        for (
            let i = 0,
                rowCount = rows.length;
            i < rowCount;
            ++i
        ) {
            cellValueArray.push(rows[i].removeCell(columnName));
        }

        this.emit({ type: 'afterRemoveColumn', detail: eventDetail, columnName, values: cellValueArray });

        return cellValueArray;
    }

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
    public renameColumn(
        fromColumnName: string,
        toColumnName: string,
        force: boolean = false,
        followAlias: boolean = false
    ): boolean {
        let success = false;

        if (fromColumnName !== 'id' && toColumnName !== 'id') {
            // setColumn will overwrite an alias, so check that it
            // does not exist
            if (!this.aliasMap[toColumnName] || followAlias) {
                const columns = this.getColumns([fromColumnName, toColumnName]),
                    fromColumnValues = columns[fromColumnName],
                    toColumnValues = columns[toColumnName];

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
    }

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
    public replaceRow(
        oldRow: (number|string|DataTableRow),
        newRow: DataTableRow,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            tableRows = table.rows,
            tableRowsIdMap = table.rowsIdMap,
            index = (
                typeof oldRow === 'number' ?
                    oldRow :
                    table.getRowIndex(oldRow)
            );

        oldRow = tableRows[index];

        if (
            !oldRow ||
            tableRowsIdMap[newRow.id]
        ) {
            return false;
        }

        table.deleteRow(oldRow);
        table.insertRow(newRow, eventDetail, index);

        return true;
    }

    /**
     * Sets a column of cells from an array of cell values
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to set.
     *
     * @param {Array<DataTableRow.CellType>} cells
     * Ann array of cell values to set.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * `true` if successful, `false` if unable to insert all values.
     *
     */
    public setColumn(
        columnNameOrAlias: string,
        cells: Array<DataTableRow.CellType>,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            rows = table.getAllRows();

        if (columnNameOrAlias === 'id') {
            return false;
        }

        columnNameOrAlias = (table.aliasMap[columnNameOrAlias] || columnNameOrAlias);

        for (
            let i = 0,
                iEnd = Math.max(cells.length, rows.length),
                row: DataTableRow,
                cellValue: DataTableRow.CellType;
            i < iEnd;
            ++i
        ) {
            row = rows[i];
            cellValue = cells[i];

            if (
                (
                    row &&
                    !row.setCell(columnNameOrAlias, cellValue, eventDetail)
                ) ||
                (
                    !row &&
                    !table.insertRow(
                        new DataTableRow({ [columnNameOrAlias]: cellValue }),
                        eventDetail
                    )
                )
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sets a cell value based on the rowID/index and column name/alias.
     * Will insert a new row if the specified row does not exist.
     *
     * @param {string|number|undefined} rowID
     * The ID or index of the row.
     *
     * @param {string} columnNameOrAlias
     * The column name of the cell to set.
     *
     * @param {DataTableRow.CellType} value
     * The value to set the cell to.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * `true` if successful, `false` if not
     */
    public setRowCell(
        rowID: (string|number|undefined),
        columnNameOrAlias: string,
        value: DataTableRow.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        return this.setRowCells(
            rowID,
            { [columnNameOrAlias]: value },
            eventDetail
        );
    }

    /**
     * Sets cell values based on the rowID/index and column names and column
     * alias. Will insert a new row if the specified row does not exist.
     *
     * @param {string|number|undefined} rowID
     * The ID or index of the row.
     *
     * @param {Record<string,DataTableRow.CellType>} cells
     * Cells as a dictionary of names and values.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, otherwise `false`.
     */
    public setRowCells(
        rowID: (string|number|undefined),
        cells: Record<string, DataTableRow.CellType>,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            aliasMap = table.aliasMap,
            cellNames = Object.keys(cells);

        cells = merge(cells);

        for (
            let i = 0,
                iEnd = cellNames.length,
                cellName: string;
            i < iEnd;
            ++i
        ) {
            cellName = cellNames[i];

            if (aliasMap[cellName]) {
                cells[aliasMap[cellName]] = cells[cellName];
                delete cells[cellName];
            }
        }

        if (rowID) {
            const row = this.getRow(rowID);
            if (row) {
                return row.setCells(cells, eventDetail);
            }
        }

        cells.id = (cells.id || rowID);

        return table.insertRow(new DataTableRow(cells), eventDetail);
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
            },
            rows = this.rows;

        if (this.presentationState.isSet()) {
            json.presentationState = this.presentationState.toJSON();
        }

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            json.rows.push(rows[i].toJSON());
        }

        return json;
    }

    /**
     * Removes the watch callbacks from in a row, so that version tag of the
     * table get not updated anymore, if the row is modified.
     *
     * @param {string} rowID
     * Row or row ID to unwatch.
     *
     * @param {boolean} [skipDelete]
     * True, to skip the deletion of the unregister functions. Usefull when
     * modifying multiple rows in a batch.
     */
    private unwatchRow(rowID: string, skipDelete?: boolean): void {
        const unwatchIdMap = this.unwatchIdMap,
            unwatch = unwatchIdMap[rowID];

        if (unwatch) {
            unwatch();

            if (!skipDelete) {
                delete unwatchIdMap[rowID];
            }
        }
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
            unwatchIdMap = table.unwatchIdMap;

        unwatchIdMap[row.id] = row.on(
            'afterChangeRow',
            function (e: DataTableRow.EventObject): void {
                table.versionTag = uniqueKey();
                table.emit({
                    type: 'afterUpdateRow',
                    detail: e.detail,
                    index,
                    row
                });
            }
        );
    }

}

interface DataTable extends DataEventEmitter<DataTable.EventObject> {
    // nothing here yet
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
    export type EventObject = (RowEventObject|TableEventObject|ColumnEventObject);

    /**
     * Event types related to a row in a table.
     */
    export type RowEventType = (
        'deleteRow'|'afterDeleteRow'|
        'insertRow'|'afterInsertRow'|
        'afterUpdateRow'
    );

    /**
    * Event types related to a column in the table.
    */
    export type ColumnEventType = (
        'removeColumn'|'afterRemoveColumn'
    );

    /**
     * Event types related to the table itself.
     */
    export type TableEventType = (
        'clearTable'|'afterClearTable'
    );

    /**
     * An array of column values.
     */
    export interface Column extends Array<DataTableRow.CellType> {
        [index: number]: DataTableRow.CellType;
    }

    /**
     * A record of columns, where the key is the column name
     * and the value is an array of column values
     */
    export interface ColumnCollection {
        [columnNameOrAlias: string]: Column;
    }

    /**
     * Describes the class JSON of a DataTable.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        presentationState?: DataPresentationState.ClassJSON;
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
     * Describes the information object for column-related events.
     */
    export interface ColumnEventObject extends DataEventEmitter.EventObject {
        readonly type: ColumnEventType;
        readonly columnName: string;
        readonly values?: Array<DataTableRow.CellType>;
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
