import type DataEventEmitter from './DataEventEmitter';

import DataConverter from './DataConverter.js';
import DataJSON from './DataJSON.js';
import DataPresentationState from './DataPresentationState.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    merge,
    uniqueKey
} = U;

class DataFrame implements DataEventEmitter<DataFrame.EventObject> {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        columns: Record<string, DataFrame.Column> = {},
        id?: string,
        presentationState: DataPresentationState = new DataPresentationState(),
        converter: DataConverter = new DataConverter()
    ) {

        const myColumnNames = this.columnNames = Object.keys(columns);
        this.columns = {};
        this.converter = converter;
        this.id = id || uniqueKey();
        this.presentationState = presentationState;
        this.rowCount = 0;

        if (myColumnNames.length) {
            const myColumns = this.columns;

            let column: DataFrame.Column,
                columnName: string,
                maxRowCount: number = 0;

            for (let i = 0, iEnd = myColumnNames.length; i < iEnd; ++i) {
                columnName = myColumnNames[i];
                column = [...columns[columnName]];
                myColumns[columnName] = column;
                maxRowCount = Math.max(maxRowCount, column.length);
            }

            for (let i = 0, iEnd = myColumnNames.length; i < iEnd; ++i) {
                myColumns[myColumnNames[i]].length = maxRowCount;
            }

            this.rowCount = maxRowCount;
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * A map of aliases for column names
     * [Alias]: columnName
     */
    public readonly aliasMap: Record<string, string> = {};

    /**
     * Converter for value conversions in table rows.
     */
    public readonly converter: DataConverter;

    private columnNames: Array<string>;

    private columns: Record<string, DataFrame.Column>;

    public id: string;

    public readonly presentationState: DataPresentationState;

    private rowCount: number;

    /**
     * Internal version tag that changes with each modification of the table or
     * a related row.
     */
    private versionTag?: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Removes all rows from this frame.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataTable#clearFrame
     * @emits DataTable#afterClearTable
     */
    public clear(eventDetail?: DataEventEmitter.EventDetail): void {

        this.emit({ type: 'clearFrame', detail: eventDetail });

        this.columns = {};
        this.columnNames.length = 0;

        this.emit({ type: 'afterClearFrame', detail: eventDetail });
    }

    public clone(): DataFrame {
        const frame = this,
            newFrame = new DataFrame(
                frame.columns,
                frame.id,
                frame.presentationState,
                frame.converter
            ),
            aliases = Object.keys(frame.aliasMap);

        newFrame.versionTag = frame.versionTag;

        for (
            let k = 0,
                kEnd = aliases.length,
                alias: string;
            k < kEnd;
            ++k
        ) {
            alias = aliases[k];
            newFrame.aliasMap[alias] = frame.aliasMap[alias];
        }

        if (frame.hcEvents) {
            const eventNames = Object.keys(frame.hcEvents);

            let eventName: DataFrame.EventObject['type'],
                eventArr,
                eventFunction;

            for (let i = 0, iEnd = eventNames.length; i < iEnd; i++) {
                eventName = eventNames[i] as DataFrame.EventObject['type'];
                eventArr = frame.hcEvents[eventName];

                for (let j = 0, jEnd = eventArr.length; j < jEnd; j++) {
                    eventFunction = (eventArr[j] as any).fn;
                    newFrame.on(eventName, eventFunction);
                }
            }
        }

        return newFrame;
    }

    /**
     * Deletes a column from the table.
     *
     * @param {string} columnName
     * Name (no alias) of column that shall be deleted.
     *
     * @return {DataFrame.Column|undefined}
     * Returns the deleted column, if found.
     */
    public deleteColumn(
        columnName: string
    ): (DataFrame.Column|undefined) {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns,
            deletedColumn = columns[columnName];

        if (deletedColumn) {
            columnNames.splice(columnNames.indexOf(columnName), 1);
            delete columns[columnName];
            return deletedColumn;
        }
    }

    /**
     * Deletes a column alias and returns the original column name.
     *
     * @param {string} alias
     * The alias to delete.
     *
     * @return {string|undefined}
     * Returns the original column name, if found.
     */
    public deleteColumnAlias(alias: string): (string|undefined) {
        const frame = this,
            aliasMap = frame.aliasMap,
            deletedAlias = aliasMap[alias];

        if (deletedAlias) {
            delete this.aliasMap[alias];
            return deletedAlias;
        }
    }

    /**
     * Deletes a row in this frame.
     *
     * @param {number} rowIndex
     * Row index to delete.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataFrame.Row|undefined}
     * Returns the deleted row, if found.
     *
     * @emits DataTable#deleteRow
     * @emits DataTable#afterDeleteRow
     */
    public deleteRow(
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): (DataFrame.Row|undefined) {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns,
            deletedRow: DataFrame.Row = [];

        this.emit({
            type: 'deleteRow',
            detail: eventDetail,
            rowIndex
        });

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            deletedRow.push(...columns[columnNames[i]].splice(rowIndex, 1));
        }

        this.emit({
            type: 'afterDeleteRow',
            detail: eventDetail,
            rowIndex
        });

        return deletedRow;
    }

    /**
     * Emits an event on this table to all registered callbacks of the given
     * event.
     *
     * @param {DataFrame.EventObject} e
     * Event object with event information.
     */
    public emit(e: DataFrame.EventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Returns a collection of all columns.
     *
     * @return {DataFrame.ColumnCollection}
     * Collection of all columns.
     */
    public getAllColumns(): DataFrame.ColumnCollection {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns,
            allColumns: DataFrame.ColumnCollection = {};

        for (
            let i = 0,
                iEnd = columnNames.length,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            allColumns[columnName] = [...columns[columnName]];
        }

        return allColumns;
    }

    /**
     * Returns an array of all rows.
     *
     * @return {Array<DataFrame.Row>}
     * Array of all rows.
     */
    public getAllRows(): Array<DataFrame.Row> {
        const frame = this,
            columns = frame.columns,
            columnNames = frame.columnNames,
            rows: Array<DataFrame.Row> = [];

        for (
            let i = 0,
                iEnd = frame.rowCount,
                row: Array<DataFrame.CellType>;
            i < iEnd;
            ++i
        ) {
            row = [];
            for (let j = 0, jEnd = columnNames.length; j < jEnd; ++j) {
                row.push(columns[columnNames[j]][i]);
            }
            rows.push(row);
        }

        return rows;
    }

    /**
     * Retrieves the given column, either by the canonical column name, or by an
     * alias.
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to get, alias takes precedence.
     *
     * @return {DataFrame.Column|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    public getColumn(
        columnNameOrAlias: string
    ): (DataFrame.Column|undefined) {
        const frame = this,
            columns = frame.columns;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        const column = columns[columnNameOrAlias];

        if (column) {
            return [...column];
        }
    }

    /**
     * Retrieves the column names.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {Array<string>}
     * Column names.
     */
    public getColumnNames(
        usePresentationOrder?: boolean
    ): Array<string> {
        const frame = this,
            columnNames = [...frame.columnNames];

        if (usePresentationOrder) {
            columnNames.sort(frame.presentationState.getColumnSorter());
        }

        return columnNames;
    }

    /**
     * Retrieves the given columns, either by the canonical column name,
     * or by an alias. This function can also retrieve row IDs as column `id`.
     *
     * @param {Array<string>} [columnNamesOrAlias]
     * Names or aliases for the columns to get, aliases taking precedence.
     *
     * @return {DataFrame.ColumnCollection}
     * A two-dimensional array of the specified columns,
     * if the column does not exist it will be `undefined`
     */
    public getColumns(
        columnNamesOrAlias?: Array<string>
    ): DataFrame.ColumnCollection {
        const frame = this,
            aliasMap = frame.aliasMap,
            columns = frame.columns,
            fetchedColumns: DataFrame.ColumnCollection = {};

        if (!columnNamesOrAlias) {
            columnNamesOrAlias = frame.columnNames;
        }

        for (
            let i = 0,
                iEnd = columnNamesOrAlias.length,
                column: DataFrame.Column,
                columnNameOrAlias: string;
            i < iEnd;
            ++i
        ) {
            columnNameOrAlias = columnNamesOrAlias[i];
            columnNameOrAlias = (
                aliasMap[columnNameOrAlias] || columnNameOrAlias
            );
            column = columns[columnNameOrAlias];

            if (column) {
                fetchedColumns[columnNameOrAlias] = [...column];
            }
        }

        return fetchedColumns;
    }

    /**
     * Retrieves the row with the given index.
     *
     * @param {number} rowIndex
     * Row index.
     *
     * @return {DataFrame.Row}
     * Row values.
     */
    public getRow(
        rowIndex: number
    ): (DataFrame.Row|undefined) {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns,
            row = new Array(columnNames.length);

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            row[i] = columns[columnNames[i]][rowIndex];
        }

        return row;
    }

    /**
     * Get a row matching a specific cell value.
     *
     * @param {string} columnNameOrAlias
     * Column to search in.
     *
     * @param {DataFrame.CellType} cellValue
     * Cell value to search for. `NaN` and `undefined` are not supported.
     *
     * @return {DataFrame.Row|undefined}
     * First row with value.
     */
    public getRowBy(
        columnNameOrAlias: string,
        cellValue: DataFrame.CellType
    ): (DataFrame.Row|undefined) {
        const frame = this;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        const column = frame.columns[columnNameOrAlias];

        if (column) {
            const rowIndex = column.indexOf(cellValue);

            if (rowIndex > -1) {
                return frame.getRow(rowIndex);
            }
        }
    }

    /**
     * Returns the column value for the given row.
     *
     * @param {number} rowIndex
     * Row index to fetch.
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to fetch.
     *
     * @return {DataFrame.CellType}
     * Cell value for the row.
     */
    public getRowCell(
        rowIndex: number,
        columnNameOrAlias: string
    ): DataFrame.CellType {
        const frame = this;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        const column = frame.columns[columnNameOrAlias];

        if (column) {
            return column[rowIndex];
        }
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
        return this.rowCount;
    }

    /**
     * Searches for a specific cell value.
     *
     * @param {string} columnNameOrAlias
     * Column to search in.
     *
     * @param {DataFrame.CellType} cellValue
     * Cell value to search for. `NaN` and `undefined` are not supported.
     *
     * @return {boolean}
     * True, if a row has been found, otherwise false.
     */
    public hasRowWith(
        columnNameOrAlias: string,
        cellValue: DataFrame.CellType
    ): boolean {
        const frame = this;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        const column = frame.columns[columnNameOrAlias];

        if (column) {
            return (column.indexOf(cellValue) > -1);
        }

        return false;
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
        type: DataFrame.EventObject['type'],
        callback: DataEventEmitter.EventCallback<this, DataFrame.EventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Sets cell values for a column. Will insert a new column
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to set.
     *
     * @param {DataFrame.Column} cellValues
     * Values to set in the column.
     *
     * @return {boolean}
     * Returns `true` if successful, `false` if not.
     */
    public setColumn(
        columnNameOrAlias: string,
        cellValues: DataFrame.Column = []
    ): boolean {
        const frame = this,
            columns = frame.columns;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        if (!columns[columnNameOrAlias]) {
            frame.columnNames.push(columnNameOrAlias);
        }

        columns[columnNameOrAlias] = [...cellValues];

        return true;
    }

    /**
     * Defines an alias for a column.
     *
     * @param {string} columnAlias
     * Column alias to create.
     *
     * @param {string} columnName
     * Column name to create an alias for.
     *
     * @return {boolean}
     * True if successfully changed, false if reserved.
     */
    public setColumnAlias(columnAlias: string, columnName: string): boolean {
        const aliasMap = this.aliasMap;

        aliasMap[columnAlias] = columnName;

        return true;
    }

    /**
     * Sets cell values based on the rowID/index and column names / alias
     * alias. Will insert a new row if the specified row does not exist.
     *
     * @param {number|undefined} rowIndex
     * Row index. Do not set to add a new row.
     *
     * @param {Array<DataFrame.CellType>} cellValues
     * Cell values.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, otherwise `false`.
     */
    public setRow(
        rowIndex: (number|undefined),
        cellValues: Array<DataFrame.CellType>,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns;

        if (typeof rowIndex === 'undefined') {
            rowIndex = frame.rowCount++;
        } else if (rowIndex >= frame.rowCount) {
            frame.rowCount = (rowIndex + 1);
        }

        for (let i = 0, iEnd = cellValues.length; i < iEnd; ++i) {
            columns[columnNames[i]][rowIndex] = cellValues[i];
        }

        return true;
    }

    /**
     * Sets a cell value based on the row ID/index and column name/alias.
     * Will insert a new row if the specified row does not exist.
     *
     * @param {number|undefined} rowIndex
     * Row index to set. Do not set to add a new row.
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to set.
     *
     * @param {DataFrame.CellType} cellValue
     * Cell value to set.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * `true` if successful, `false` if not
     */
    public setRowCell(
        rowIndex: (number|undefined),
        columnNameOrAlias: string,
        cellValue: DataFrame.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const frame = this,
            columns = frame.columns;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        const column = columns[columnNameOrAlias];

        if (column) {
            if (!rowIndex) {
                rowIndex = column.length;
            }

            if (rowIndex >= frame.rowCount) {
                frame.rowCount = (rowIndex + 1);
            }

            column[rowIndex] = cellValue;

            return true;
        }

        return false;
    }

}

interface DataFrame extends DataEventEmitter<DataFrame.EventObject> {
    // nothing here yet
}

namespace DataFrame {

    /**
     * Possible value types for a column in a row.
     *
     * *Please note:* `Date` and `DataTable` are not JSON-compatible and have
     * to be converted with the help of their `toJSON()` function.
     */
    export type CellType = (
        boolean|null|number|string|undefined
    );

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
        'clearFrame'|'afterClearFrame'
    );

    /**
     * Describes the class JSON of a DataTable.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        presentationState?: DataPresentationState.ClassJSON;
        columnNames: Array<string>;
        columns: Array<Column>;
    }

    /**
     * An array of column values.
     */
    export interface Column extends Array<DataFrame.CellType> {
        [index: number]: DataFrame.CellType;
    }

    /**
     * A record of columns, where the key is the column name
     * and the value is an array of column values
     */
    export interface ColumnCollection {
        [columnNameOrAlias: string]: Column;
    }

    /**
     * Describes the information object for column-related events.
     */
    export interface ColumnEventObject extends DataEventEmitter.EventObject {
        readonly type: ColumnEventType;
        readonly columnName: string;
        readonly values?: Array<DataFrame.CellType>;
    }

    /**
     * An array of row values.
     */
    export interface Row extends Array<DataFrame.CellType> {
        [index: number]: DataFrame.CellType;
    }

    /**
     * Describes the information object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        readonly type: RowEventType;
        readonly rowIndex: number;
    }

    /**
     * Describes the information object for table-related events.
     */
    export interface TableEventObject extends DataEventEmitter.EventObject {
        readonly type: TableEventType;
    }

}

export default DataFrame;
