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

class DataFrame implements DataEventEmitter<DataFrame.EventObject>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(
        json: DataFrame.ClassJSON,
        converter?: DataConverter
    ): DataFrame {
        const columns: DataFrame.ColumnCollection = {},
            jsonColumns = json.columns,
            columnNames = Object.keys(jsonColumns);

        for (
            let i = 0,
                iEnd = columnNames.length,
                columnName: string,
                column: DataFrame.Column,
                jsonColumn: DataFrame.ColumnJSON;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            columns[columnName] = column = [];
            jsonColumn = jsonColumns[columnName];
            for (
                let j = 0,
                    jEnd = jsonColumn.length,
                    jsonCell: DataFrame.ColumnJSON[0];
                j < jEnd;
                ++j
            ) {
                jsonCell = jsonColumn[j];
                if (typeof jsonCell === 'object' && jsonCell) {
                    column[j] = DataFrame.fromJSON(jsonCell, converter);
                } else {
                    column[j] = jsonCell;
                }
            }
        }

        const frame = new DataFrame(
            columns,
            json.id,
            (
                json.presentationState &&
                DataPresentationState.fromJSON(json.presentationState)
            ),
            converter
        );

        if (json.aliasMap) {
            const aliasMap = (json.aliasMap || {}),
                aliases = Object.keys(aliasMap);

            for (
                let i = 0,
                    iEnd = aliases.length,
                    alias: string;
                i < iEnd;
                ++i
            ) {
                alias = aliases[i];
                frame.aliasMap[alias] = aliasMap[alias];
            }
        }

        return frame;
    }

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
                column = columns[columnName].slice();
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
     * Removes all columns and rows from this data frame.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits DataFrame#clearFrame
     * @emits DataFrame#afterClearTable
     */
    public clear(eventDetail?: DataEventEmitter.EventDetail): void {

        this.emit({ type: 'clearFrame', detail: eventDetail });

        this.columns = {};
        this.columnNames.length = 0;

        this.emit({ type: 'afterClearFrame', detail: eventDetail });
    }

    /**
     * Returns a clone of this data frame.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataFrame}
     * Clone of this data frame.
     *
     * @emits DataFrame#cloneFrame
     * @emits DataFrame#afterCloneFrame
     */
    public clone(eventDetail?: DataEventEmitter.EventDetail): DataFrame {
        const frame = this;

        frame.emit({ type: 'cloneFrame', detail: eventDetail });

        const frameClone = new DataFrame(
                frame.columns,
                frame.id,
                frame.presentationState,
                frame.converter
            ),
            aliases = Object.keys(frame.aliasMap);

        frameClone.versionTag = frame.versionTag;

        for (
            let k = 0,
                kEnd = aliases.length,
                alias: string;
            k < kEnd;
            ++k
        ) {
            alias = aliases[k];
            frameClone.aliasMap[alias] = frame.aliasMap[alias];
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
                    frameClone.on(eventName, eventFunction);
                }
            }
        }

        frame.emit({
            type: 'afterCloneFrame',
            detail: eventDetail,
            frameClone
        });

        return frameClone;
    }

    /**
     * Deletes a column from the table.
     *
     * @param {string} columnName
     * Name (no alias) of column that shall be deleted.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataFrame.Column|undefined}
     * Returns the deleted column, if found.
     *
     * @emits DataFrame#deleteColumn
     * @emits DataFrame#afterDeleteColumn
     */
    public deleteColumn(
        columnName: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): (DataFrame.Column|undefined) {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns,
            deletedColumn = columns[columnName];

        if (deletedColumn) {

            frame.emit({
                type: 'deleteColumn',
                cellValues: deletedColumn,
                columnName,
                detail: eventDetail
            });

            columnNames.splice(columnNames.indexOf(columnName), 1);
            delete columns[columnName];

            frame.emit({
                type: 'afterDeleteColumn',
                cellValues: deletedColumn,
                columnName,
                detail: eventDetail
            });

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
     * @emits DataFrame#deleteRow
     * @emits DataFrame#afterDeleteRow
     */
    public deleteRow(
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): (DataFrame.Row|undefined) {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns;

        if (rowIndex < frame.rowCount) {
            const deletedRow: DataFrame.Row = [];

            frame.emit({
                type: 'deleteRow',
                detail: eventDetail,
                rowIndex
            });

            for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                deletedRow.push(...columns[columnNames[i]].splice(rowIndex, 1));
            }

            frame.emit({
                type: 'afterDeleteRow',
                detail: eventDetail,
                rowIndex
            });

            return deletedRow;
        }
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
            allColumns[columnName] = columns[columnName].slice();
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
                fetchedColumns[columnNameOrAlias] = column.slice();
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
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, `false` if not.
     *
     * @emits DataFrame#setColumn
     * @emits DataFrame#afterSetColumn
     */
    public setColumn(
        columnNameOrAlias: string,
        cellValues: DataFrame.Column = [],
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const frame = this,
            columns = frame.columns;

        columnNameOrAlias = (
            frame.aliasMap[columnNameOrAlias] || columnNameOrAlias
        );

        frame.emit({
            type: 'setColumn',
            cellValues,
            columnName: columnNameOrAlias,
            detail: eventDetail
        });

        if (!columns[columnNameOrAlias]) {
            frame.columnNames.push(columnNameOrAlias);
        }

        columns[columnNameOrAlias] = cellValues.slice();

        frame.emit({
            type: 'afterSetColumn',
            cellValues,
            columnName: columnNameOrAlias,
            detail: eventDetail
        });

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
     *
     * @emits DataFrame#setRow
     * @emits DataFrame#afterSetRow
     */
    public setRow(
        rowIndex: number = this.rowCount,
        cellValues: Array<DataFrame.CellType>,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns;

        frame.emit({
            type: 'setRow',
            detail: eventDetail,
            rowIndex
        });

        if (rowIndex >= frame.rowCount) {
            frame.rowCount = (rowIndex + 1);
        }

        for (let i = 0, iEnd = cellValues.length; i < iEnd; ++i) {
            columns[columnNames[i]][rowIndex] = cellValues[i];
        }

        frame.emit({
            type: 'afterSetRow',
            detail: eventDetail,
            rowIndex
        });

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

    /**
     * Converts the frame to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this frame.
     */
    public toJSON(): DataFrame.ClassJSON {
        const frame = this,
            columnNames = frame.columnNames,
            columns = frame.columns,
            json: DataFrame.ClassJSON = {
                $class: 'DataFrame',
                columns: {},
                id: frame.id
            },
            jsonColumns = json.columns,
            rowCount = frame.rowCount;

        if (frame.presentationState.isSet()) {
            json.presentationState = this.presentationState.toJSON();
        }

        for (
            let i = 0,
                iEnd = columnNames.length,
                columnName: string,
                column: DataFrame.Column,
                jsonColumn: DataFrame.ColumnJSON;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            column = columns[columnName];
            jsonColumns[columnName] = jsonColumn = [];
            for (
                let j = 0,
                    jEnd = rowCount,
                    cell: DataFrame.CellType;
                j < jEnd;
                ++j
            ) {
                cell = column[j];
                if (typeof cell === 'object' && cell) {
                    jsonColumn[j] = cell.toJSON();
                } else {
                    jsonColumn[j] = cell;
                }
            }
        }

        return json;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */
interface DataFrame extends DataEventEmitter<DataFrame.EventObject> {
    // nothing here yet
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataFrame {

    /**
     * Possible value types for a cell.
     */
    export type CellType = (DataFrame|DataJSON.JSONPrimitive);

    /**
     * All information objects of DataTable events.
     */
    export type EventObject = (
        ColumnEventObject|
        FrameEventObject|
        RowEventObject
    );

    /**
     * Class JSON of a DataFrame.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        aliasMap?: Record<string, string>;
        columns: ColumnCollectionJSON;
        id: string;
        presentationState?: DataPresentationState.ClassJSON;
    }

    /**
     * Array of column values.
     */
    export interface Column extends Array<DataFrame.CellType> {
        [index: number]: DataFrame.CellType;
    }

    /**
     * JSON Array of column values.
     */
    export interface ColumnJSON extends DataJSON.JSONArray {
        [index: number]: (DataJSON.JSONPrimitive|DataFrame.ClassJSON);
    }

    /**
     * Record of columns, where the key is the column name or requested alias
     * and the value is an array of column values.
     */
    export interface ColumnCollection {
        [columnNameOrAlias: string]: Column;
    }

    /**
     * Record of columns, where the key is the column name or requested alias
     * and the value is an array of column values.
     */
    export interface ColumnCollectionJSON {
        [columnNameOrAlias: string]: ColumnJSON;
    }

    /**
     * Event object for column-related events.
     */
    export interface ColumnEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'deleteColumn'|'afterDeleteColumn'|
            'setColumn'|'afterSetColumn'
        );
        readonly columnName: string;
        readonly cellValues?: Array<DataFrame.CellType>;
    }

    /**
     * Event object for frame-related events.
     */
    export interface FrameEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'clearFrame'|'afterClearFrame'|
            'cloneFrame'|'afterCloneFrame'
        );
        readonly frameClone?: DataFrame;
    }

    /**
     * Array of row values.
     */
    export interface Row extends Array<DataFrame.CellType> {
        [index: number]: DataFrame.CellType;
    }

    /**
     * Event object for row-related events.
     */
    export interface RowEventObject extends DataEventEmitter.EventObject {
        readonly type: (
            'deleteRow'|'afterDeleteRow'|
            'setRow'|'afterSetRow'
        );
        readonly rowIndex: number;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataJSON.addClass(DataFrame);

/* *
 *
 *  Default Export
 *
 * */

export default DataFrame;
