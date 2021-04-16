/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2021 Torstein Honsi
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
 * Class to manage columns and rows in a table structure.
 *
 * @class
 * @name Highcharts.DataTable
 *
 * @param {Highcharts.DataTableColumnCollection} [columns]
 * Collection of columns.
 *
 * @param {string} [id]
 * DataTable identifier.
 */
class DataTable implements DataEventEmitter<DataTable.Event>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Null state for a row record.
     *
     * @name Highcharts.DataTable.NULL
     * @type {Highcharts.DataTableRowObject}
     *
     * @see {@link Highcharts.DataTable.isNull} for a null test.
     *
     * @example
     * table.setRows([DataTable.NULL, DataTable.NULL], 10);
     */
    public static readonly NULL: Readonly<DataTable.RowObject> = {};

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
     * @param {DataConverter} [converter]
     * Converter for conversions of cell values.
     *
     * @return {DataTable}
     * DataTable instance from the class JSON.
     */
    public static fromJSON(
        json: DataTable.ClassJSON,
        converter?: DataConverter
    ): DataTable {
        const columns: DataTable.ColumnCollection = {},
            jsonColumns = json.columns,
            columnNames = Object.keys(jsonColumns);

        for (
            let i = 0,
                iEnd = columnNames.length,
                columnName: string,
                column: DataTable.Column,
                jsonColumn: DataTable.ColumnJSON;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            columns[columnName] = column = [];
            jsonColumn = jsonColumns[columnName];
            for (
                let j = 0,
                    jEnd = jsonColumn.length,
                    jsonCell: DataTable.ColumnJSON[0];
                j < jEnd;
                ++j
            ) {
                jsonCell = jsonColumn[j];
                if (typeof jsonCell === 'object' && jsonCell) {
                    column[j] = DataTable.fromJSON(jsonCell, converter);
                } else {
                    column[j] = jsonCell;
                }
            }
        }

        const table = new DataTable(
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
                table.aliasMap[alias] = aliasMap[alias];
            }
        }

        return table;
    }

    /**
     * Tests whether a row contains only null values.
     *
     * @function Highcharts.DataTable.isNull
     *
     * @param {Highcharts.DataTableRow|Highcharts.DataTableRowObject} row
     * Row to test.
     *
     * @return {boolean}
     * Returns `true`, if the row contains only null, otherwise `false`.
     *
     * @example
     * if (DataTable.isNull(row)) {
     *   // handle null
     * }
     */
    public static isNull(
        row: (DataTable.Row|DataTable.RowObject)
    ): boolean {
        if (row === DataTable.NULL) {
            return true;
        }
        if (row instanceof Array) {
            if (!row.length) {
                return false;
            }
            for (let i = 0, iEnd = row.length; i < iEnd; ++i) {
                if (row[i] !== null) {
                    return false;
                }
            }
        } else {
            const columnNames = Object.keys(row);
            if (!columnNames.length) {
                return false;
            }
            for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                if (row[columnNames[i]] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Constructs an instance of the DataTable class.
     *
     * @param {DataTable.ColumnCollection} [columns]
     * Collection of columns.
     *
     * @param {string} [id]
     * DataTable identifier.
     *
     * @param {DataPresentationState} [presentationState]
     * Presentation state for the DataTable.
     *
     * @param {DataConverter} [converter]
     * Converter for conversions of cell values.
     */
    public constructor(
        columns: DataTable.ColumnCollection = {},
        id?: string,
        presentationState: DataPresentationState = new DataPresentationState(),
        converter: DataConverter = new DataConverter()
    ) {
        /**
         * Whether the ID was automatic generated or given.
         *
         * @name Highcharts.DataTable#autoId
         * @type {boolean}
         */
        this.autoId = !id;
        this.columns = {};
        this.converter = converter;
        /**
         * ID of the table.
         *
         * @name Highcharts.DataTable#id
         * @type {string}
         */
        this.id = (id || uniqueKey());
        this.presentationState = presentationState;
        this.rowCount = 0;
        this.versionTag = uniqueKey();

        const columnNames = Object.keys(columns),
            thisColumns = this.columns;

        let rowCount = 0;

        for (
            let i = 0,
                iEnd = columnNames.length,
                column: DataTable.Column,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            column = columns[columnName].slice();
            thisColumns[columnName] = column;
            rowCount = Math.max(rowCount, column.length);
        }

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            thisColumns[columnNames[i]].length = rowCount;
        }

        this.rowCount = rowCount;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Mapping aliases to column names.
     * @private
     */
    private readonly aliasMap: Record<string, string> = {};

    public readonly autoId: boolean;

    /**
     * Converter for type conversions of cell values.
     * @private
     */
    public readonly converter: DataConverter;

    private columns: Record<string, DataTable.Column>;

    public readonly id: string;

    private presentationState: DataPresentationState;

    private rowCount: number;

    private versionTag: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Removes all columns and rows from the table.
     *
     * @function Highcharts.DataTable#clear
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #clearTable
     * @emits #afterClearTable
     */
    public clear(eventDetail?: DataEventEmitter.EventDetail): void {
        const table = this;

        table.emit({ type: 'clearTable', detail: eventDetail });

        table.columns = {};
        table.rowCount = 0;

        table.emit({ type: 'afterClearTable', detail: eventDetail });
    }


    /**
     * Removes all cell values from a column.
     *
     * @function Highcharts.DataTable#clearColumn
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to clear.
     *
     * @param {number} [rowIndex=0]
     * Row index to start removing.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #clearColumn
     * @emits #afterClearColumn
     */
    public clearColumn(
        columnNameOrAlias: string,
        rowIndex: number = 0,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        if (column) {
            const columnClone = column.slice();

            table.emit({
                type: 'clearColumn',
                column: columnClone,
                columnName: columnNameOrAlias,
                detail: eventDetail,
                rowIndex
            });

            column.length = rowIndex;

            table.emit({
                type: 'afterClearColumn',
                column: columnClone,
                columnName: columnNameOrAlias,
                detail: eventDetail,
                rowIndex
            });
        }
    }

    /**
     * Removes all rows from this data table.
     *
     * @function Highcharts.DataTable#clearRows
     *
     * @param {number} [rowIndex=0]
     * Row index to start removing.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #clearRows
     * @emits #afterClearRows
     */
    public clearRows(
        rowIndex: number = 0,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const table = this,
            columns = table.columns,
            columnNames = Object.keys(columns),
            rowCount = Math.max(table.rowCount - rowIndex, 0);

        if (!rowCount) {
            return;
        }

        table.emit({
            type: 'clearRows',
            detail: eventDetail,
            rowCount,
            rowIndex
        });

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            columns[columnNames[i]].length = 0;
        }

        table.rowCount = 0;

        table.emit({
            type: 'afterClearRows',
            detail: eventDetail,
            rowCount,
            rowIndex
        });
    }

    /**
     * Returns a clone of this data table.
     *
     * @function Highcharts.DataTable#clone
     *
     * @param {boolean} [skipColumns]
     * Whether to clone columns or not.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Clone of this data table.
     *
     * @emits #cloneTable
     * @emits #afterCloneTable
     */
    public clone(
        skipColumns?: boolean,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const table = this,
            aliasMap = table.aliasMap,
            aliases = Object.keys(table.aliasMap);

        table.emit({ type: 'cloneTable', detail: eventDetail });

        const clone = new DataTable(
            skipColumns ? {} : table.columns,
            table.autoId ? void 0 : table.id,
            table.presentationState,
            table.converter
        );

        if (aliases.length) {
            const cloneAliasMap = clone.aliasMap;
            for (let i = 0, iEnd = aliases.length, alias: string; i < iEnd; ++i) {
                alias = aliases[i];
                cloneAliasMap[alias] = aliasMap[alias];
            }
        }

        clone.versionTag = table.versionTag;

        table.emit({
            type: 'afterCloneTable',
            detail: eventDetail,
            tableClone: clone
        });

        return clone;
    }

    /**
     * Deletes a column from the table.
     *
     * @function Highcharts.DataTable#deleteColumn
     *
     * @param {string} columnName
     * Name (no alias) of column that shall be deleted.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * Returns the deleted column, if found.
     *
     * @emits #deleteColumn
     * @emits #afterDeleteColumn
     */
    public deleteColumn(
        columnName: string,
        eventDetail?: DataEventEmitter.EventDetail
    ): (DataTable.Column|undefined) {
        const table = this,
            columns = table.columns,
            deletedColumn = columns[columnName];

        if (deletedColumn) {
            table.emit({
                type: 'deleteColumn',
                column: deletedColumn,
                columnName,
                detail: eventDetail
            });

            delete columns[columnName];

            table.emit({
                type: 'afterDeleteColumn',
                column: deletedColumn,
                columnName,
                detail: eventDetail
            });

            return deletedColumn;
        }
    }

    /**
     * Deletes a column alias and returns the original column name.
     *
     * @function Highcharts.DataTable#deleteColumnAlias
     *
     * @param {string} alias
     * The alias to delete.
     *
     * @return {string|undefined}
     * Returns the original column name, if found.
     */
    public deleteColumnAlias(alias: string): (string|undefined) {
        const table = this,
            aliasMap = table.aliasMap,
            deletedAlias = aliasMap[alias];

        if (deletedAlias) {
            delete table.aliasMap[alias];
            return deletedAlias;
        }
    }

    /**
     * Deletes rows in this table.
     *
     * @function Highcharts.DataTable#deleteRows
     *
     * @param {number} rowIndex
     * Index to start delete of rows.
     *
     * @param {number} [rowCount=1]
     * Number of rows to delete.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Array<Highcharts.DataTableRow>}
     * Returns the deleted rows, if found.
     *
     * @emits #deleteRows
     * @emits #afterDeleteRows
     */
    public deleteRows(
        rowIndex: number,
        rowCount: number = 1,
        eventDetail?: DataEventEmitter.EventDetail
    ): Array<DataTable.Row> {
        const table = this,
            deletedRows: Array<DataTable.Row> = [];

        if (rowCount > 0 && rowIndex < table.rowCount) {
            const columns = table.columns,
                columnNames = Object.keys(columns);

            table.emit({
                type: 'deleteRows',
                detail: eventDetail,
                rowCount,
                rowIndex
            });

            for (
                let i = 0,
                    iEnd = columnNames.length,
                    column: DataTable.Column,
                    deletedCells: Array<DataTable.CellType>;
                i < iEnd;
                ++i
            ) {
                column = columns[columnNames[i]];
                deletedCells = column.splice(rowIndex, rowCount);
                if (!i) {
                    table.rowCount = column.length;
                }
                for (let j = 0, jEnd = deletedCells.length; j < jEnd; ++j) {
                    deletedRows[j] = (deletedRows[j] || []);
                    deletedRows[j][i] = deletedCells[j];
                }
            }

            table.emit({
                type: 'afterDeleteRows',
                detail: eventDetail,
                rowCount,
                rowIndex
            });

        }

        return deletedRows;
    }

    /**
     * Emits an event on this table to all registered callbacks of the given
     * event.
     * @private
     *
     * @param {DataTable.Event} e
     * Event object with event information.
     */
    public emit(e: DataTable.Event): void {
        const frame = this;

        switch (e.type) {
            case 'afterClearColumn':
            case 'afterClearRows':
            case 'afterClearTable':
            case 'afterDeleteColumn':
            case 'afterDeleteRows':
            case 'afterSetCell':
            case 'afterSetColumn':
            case 'afterSetRows':
                frame.versionTag = uniqueKey();
                break;
            default:
        }

        fireEvent(frame, e.type, e);
    }

    /**
     * Fetches a single cell value.
     *
     * @function Highcharts.DataTable#getCell
     *
     * @param {string} columnNameOrAlias
     * Column name or alias of the cell to retrieve.
     *
     * @param {number} rowIndex
     * Row index of the cell to retrieve.
     *
     * @return {Highcharts.DataTableCellType|undefined}
     * Returns the cell value or `undefined`.
     */
    public getCell(
        columnNameOrAlias: string,
        rowIndex: number
    ): (DataTable.CellType|undefined) {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        if (column) {
            return column[rowIndex];
        }
    }

    /**
     * Fetches a cell value for the given row as a boolean.
     *
     * @function Highcharts.DataTable#getCellAsBoolean
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to fetch.
     *
     * @param {number} rowIndex
     * Row index to fetch.
     *
     * @return {boolean}
     * Returns the cell value of the row as a boolean.
     */
    public getCellAsBoolean(
        columnNameOrAlias: string,
        rowIndex: number
    ): boolean {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        return table.converter.asBoolean(column && column[rowIndex]);
    }

    /**
     * Fetches a cell value for the given row as a date.
     *
     * @function Highcharts.DataTable#getCellAsDate
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to fetch.
     *
     * @param {number} rowIndex
     * Row index to fetch.
     *
     * @return {Date}
     * Returns the cell value of the row as a date.
     */
    public getCellAsDate(
        columnNameOrAlias: string,
        rowIndex: number
    ): Date {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        return table.converter.asDate(column && column[rowIndex]);
    }

    public getCellAsNumber(
        columnNameOrAlias: string,
        rowIndex: number,
        useNaN: true
    ): number;
    public getCellAsNumber(
        columnNameOrAlias: string,
        rowIndex: number,
        useNaN?: false
    ): (number|null);
    /**
     * Fetches a cell value for the given row as a number.
     *
     * @function Highcharts.DataTable#getCellAsNumber
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to fetch.
     *
     * @param {number} rowIndex
     * Row index to fetch.
     *
     * @param {boolean} [useNaN]
     * Whether to return NaN instead of `null` and `undefined`.
     *
     * @return {number|null}
     * Returns the cell value of the row as a number.
     */
    public getCellAsNumber(
        columnNameOrAlias: string,
        rowIndex: number,
        useNaN?: boolean
    ): (number|null) {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias],
            cellValue = table.converter.asNumber(column && column[rowIndex]);

        if (!useNaN && isNaN(cellValue)) {
            return null;
        }

        return cellValue;
    }

    /**
     * Fetches a cell value for the given row as a string.
     *
     * @function Highcharts.DataTable#getCellAsString
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to fetch.
     *
     * @param {number} rowIndex
     * Row index to fetch.
     *
     * @return {string}
     * Returns the cell value of the row as a string.
     */
    public getCellAsString(
        columnNameOrAlias: string,
        rowIndex: number
    ): string {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        return table.converter.asString(column && column[rowIndex]);
    }

    /**
     * Fetches the given column by the canonical column name or by an alias.
     *
     * @function Highcharts.DataTable#getColumn
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to get, alias takes precedence.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    public getColumn(
        columnNameOrAlias: string
    ): (DataTable.Column|undefined) {
        const table = this,
            columns = table.columns;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = columns[columnNameOrAlias];

        if (column) {
            return column.slice();
        }
    }

    /**
     * Fetches all column aliases.
     *
     * @function Highcharts.DataTable#getColumnAliases
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {Array<string>}
     * Returns all column aliases.
     */
    public getColumnAliases(
        usePresentationOrder?: boolean
    ): Array<string> {
        const table = this,
            columnAliases = Object.keys(table.aliasMap);

        if (usePresentationOrder && columnAliases.length) {
            columnAliases.sort(table.presentationState.getColumnSorter());
        }

        return columnAliases;
    }

    public getColumnAsNumbers(
        columnNameOrAlias: string,
        useNaN: true
    ): Array<number>;
    public getColumnAsNumbers(
        columnNameOrAlias: string,
        useNaN?: false
    ): Array<(number|null)>;
    /**
     * Fetches the given column by the canonical column name or by an alias, and
     * validates the type of the first few cells. If the first defined cell is
     * of type number, it assumes for performance reasons, that all cells are of
     * type number or `null`. Otherwise it will convert all cells to number
     * type, except `null`.
     *
     * @function Highcharts.DataTable#getColumnAsNumbers
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to get, alias takes precedence.
     *
     * @param {boolean} [useNaN]
     * Whether to use NaN instead of `null` and `undefined`.
     *
     * @return {Array<(number|null)>}
     * A copy of the column, or an empty array if not found.
     */
    public getColumnAsNumbers(
        columnNameOrAlias: string,
        useNaN?: boolean
    ): Array<(number|null)> {
        const table = this,
            columns = table.columns,
            converter = table.converter;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = columns[columnNameOrAlias],
            columnAsNumber: Array<(number|null)> = [];

        if (column) {
            const columnLength = column.length;

            if (useNaN) {
                for (let i = 0; i < columnLength; ++i) {
                    columnAsNumber.push(converter.asNumber(column[i]));
                }
            } else {
                for (
                    let i = 0,
                        cellValue: DataTable.CellType;
                    i < columnLength;
                    ++i
                ) {
                    cellValue = column[i];
                    if (typeof cellValue === 'number') {
                        // assume unmixed data
                        return column.slice() as Array<(number|null)>;
                    }
                    if (
                        cellValue !== null &&
                        typeof cellValue !== 'undefined'
                    ) {
                        break;
                    }
                }
                for (
                    let i = 0,
                        cellValue: number;
                    i < columnLength;
                    ++i
                ) {
                    cellValue = converter.asNumber(column[i]);
                    columnAsNumber.push(isNaN(cellValue) ? null : cellValue);
                }
            }
        }

        return columnAsNumber;
    }

    /**
     * Fetches all column names.
     *
     * @function Highcharts.DataTable#getColumnNames
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state.
     *
     * @return {Array<string>}
     * Returns all column names.
     */
    public getColumnNames(
        usePresentationOrder?: boolean
    ): Array<string> {
        const table = this,
            columnNames = Object.keys(table.columns);

        if (usePresentationOrder && columnNames.length) {
            columnNames.sort(table.presentationState.getColumnSorter());
        }

        return columnNames;
    }

    /**
     * Retrieves all or the given columns.
     *
     * @function Highcharts.DataTable#getColumns
     * @param {Array<string>} [columnNamesOrAliases]
     * Column names or aliases to retrieve. Aliases taking precedence.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * Collection of columns. If a requested column was not found, it is
     * `undefined`.
     */
    public getColumns(
        columnNamesOrAliases?: Array<string>
    ): DataTable.ColumnCollection {
        const table = this,
            tableColumns = table.columns,
            columns: DataTable.ColumnCollection = {};

        if (columnNamesOrAliases) {
            columnNamesOrAliases = table.getNormalizedColumnNames(columnNamesOrAliases);
        } else {
            columnNamesOrAliases = Object.keys(tableColumns);
        }

        for (
            let i = 0,
                iEnd = columnNamesOrAliases.length,
                column: DataTable.Column,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNamesOrAliases[i];
            column = tableColumns[columnName];

            if (column) {
                columns[columnName] = column.slice();
            }
        }

        return columns;
    }

    /**
     * Normalize column names and aliases.
     *
     * @param {Array<string>} columnNamesOrAliases
     * Column names or aliases to normalize. Aliases taking precedence.
     *
     * @return {Array<string>}
     * Returns all column names available in the table.
     */
    private getNormalizedColumnNames(
        columnNamesOrAliases: Array<string>
    ): Array<string> {
        const table = this,
            aliasMap = table.aliasMap,
            columnNamesLength = columnNamesOrAliases.length,
            columnNames: Array<string> = [],
            columns = table.columns;

        for (let i = 0, columnName: string; i < columnNamesLength; ++i) {
            columnName = columnNamesOrAliases[i];
            columnName = (aliasMap[columnName] || columnName);
            if (columns[columnName]) {
                columnNames.push(columnName);
            }
        }

        return columnNames;
    }

    /**
     * Returns the presentation state of the table.
     *
     * @return {DataPresentationState}
     * Returns the presentation state.
     */
    public getPresentationState(): DataPresentationState {
        return this.presentationState;
    }

    /**
     * Retrieves the row at a given index.
     *
     * @function Highcharts.DataTable#getRow
     *
     * @param {number} rowIndex
     * Row index.
     *
     * @param {Array<string>} [columnNamesOrAliases]
     * Column names or aliases in order to retrieve.
     *
     * @return {Highcharts.DataTableRow}
     * Returns the row values, or `undefined` if not found.
     */
    public getRow(
        rowIndex: number,
        columnNamesOrAliases?: Array<string>
    ): (DataTable.Row|undefined) {
        const table = this,
            columns = table.columns;

        if (columnNamesOrAliases) {
            columnNamesOrAliases = table.getNormalizedColumnNames(columnNamesOrAliases);
        } else {
            columnNamesOrAliases = Object.keys(columns);
        }

        const columnNamesLength = columnNamesOrAliases.length,
            row = new Array(columnNamesLength);

        for (let i = 0; i < columnNamesLength; ++i) {
            row[i] = columns[columnNamesOrAliases[i]][rowIndex];
        }

        return row;
    }

    /**
     * Returns the number of rows in this table.
     *
     * @function Highcharts.DataTable#getRowCount
     *
     * @return {number}
     * Number of rows in this table.
     */
    public getRowCount(): number {
        // @todo Implement via property getter `.length` browsers supported
        return this.rowCount;
    }

    /**
     * Retrieves the index of the first row matching a specific cell value.
     *
     * @function Highcharts.DataTable#getRowIndexBy
     *
     * @param {string} columnNameOrAlias
     * Column to search in.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Cell value to search for. `NaN` and `undefined` are not supported.
     *
     * @param {number} [rowIndexOffset]
     * Index offset to start searching.
     *
     * @return {number|undefined}
     * Index of the first row matching the cell value.
     */
    public getRowIndexBy(
        columnNameOrAlias: string,
        cellValue: DataTable.CellType,
        rowIndexOffset?: number
    ): (number|undefined) {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        if (column) {
            const rowIndex = column.indexOf(cellValue, rowIndexOffset);

            if (rowIndex !== -1) {
                return rowIndex;
            }
        }
    }

    /**
     * Retrieves the row at a given index.
     *
     * @function Highcharts.DataTable#getRowObject
     *
     * @param {number} rowIndex
     * Row index.
     *
     * @param {Array<string>} [columnNamesOrAliases]
     * Column names or aliases and their order to retrieve.
     *
     * @return {Highcharts.DataTableRowObject}
     * Returns the row values, or `undefined` if not found.
     */
    public getRowObject(
        rowIndex: number,
        columnNamesOrAliases?: Array<string>
    ): (DataTable.RowObject|undefined) {
        const table = this,
            tableColumns = table.columns,
            row: DataTable.RowObject = {};

        if (columnNamesOrAliases) {
            columnNamesOrAliases = table.getNormalizedColumnNames(columnNamesOrAliases);
        } else {
            columnNamesOrAliases = Object.keys(tableColumns);
        }

        let allNull = true;

        for (
            let i = 0,
                iEnd = columnNamesOrAliases.length,
                cell: DataTable.CellType,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNamesOrAliases[i];
            cell = tableColumns[columnName][rowIndex];
            allNull = (allNull && cell === null);
            row[columnName] = cell;
        }

        if (allNull) {
            return DataTable.NULL;
        }

        return row;
    }

    /**
     * Fetches all or a number of rows.
     *
     * @function Highcharts.DataTable#getRowObjects
     *
     * @param {number} [rowIndex]
     * Index of the first row to fetch. Defaults to first row at index `0`.
     *
     * @param {number} [rowCount]
     * Number of rows to fetch. Defaults to maximal number of rows.
     *
     * @param {Array<string>} [columnNamesOrAliases]
     * Column names or aliases and their order to retrieve.
     *
     * @return {Highcharts.DataTableRowObject}
     * Returns retrieved rows.
     */
    public getRowObjects(
        rowIndex: number = 0,
        rowCount: number = (this.rowCount - rowIndex),
        columnNamesOrAliases?: Array<string>
    ): (Array<DataTable.RowObject>) {
        const table = this,
            columns = table.columns,
            rows: Array<DataTable.RowObject> = new Array(rowCount);

        if (columnNamesOrAliases) {
            columnNamesOrAliases = table.getNormalizedColumnNames(columnNamesOrAliases);
        } else {
            columnNamesOrAliases = Object.keys(columns);
        }

        const columnNamesLength = columnNamesOrAliases.length;

        for (
            let i = rowIndex,
                i2 = 0,
                iEnd = Math.min(
                    table.rowCount,
                    (rowIndex + rowCount)
                ),
                row: DataTable.RowObject;
            i < iEnd;
            ++i, ++i2
        ) {
            row = rows[i2] = {};

            for (
                let j = 0,
                    jEnd = columnNamesLength,
                    columnName: string;
                j < jEnd;
                ++j
            ) {
                columnName = columnNamesOrAliases[j];
                row[columnName] = columns[columnName][i];
            }
        }

        return rows;
    }

    /**
     * Fetches all or a number of rows.
     *
     * @function Highcharts.DataTable#getRows
     *
     * @param {number} [rowIndex]
     * Index of the first row to fetch. Defaults to first row at index `0`.
     *
     * @param {number} [rowCount]
     * Number of rows to fetch. Defaults to maximal number of rows.
     *
     * @param {Array<string>} [columnNamesOrAliases]
     * Column names or aliases and their order to retrieve.
     *
     * @return {Highcharts.DataTableRow}
     * Returns retrieved rows.
     */
    public getRows(
        rowIndex: number = 0,
        rowCount: number = (this.rowCount - rowIndex),
        columnNamesOrAliases?: Array<string>
    ): (Array<DataTable.Row>) {
        const table = this,
            columns = table.columns,
            rows: Array<DataTable.Row> = new Array(rowCount);

        if (columnNamesOrAliases) {
            columnNamesOrAliases = table.getNormalizedColumnNames(columnNamesOrAliases);
        } else {
            columnNamesOrAliases = Object.keys(columns);
        }

        const columnNamesLength = columnNamesOrAliases.length;

        for (
            let i = rowIndex,
                i2 = 0,
                iEnd = Math.min(
                    table.rowCount,
                    (rowIndex + rowCount)
                ),
                row: DataTable.Row;
            i < iEnd;
            ++i, ++i2
        ) {
            row = rows[i2] = new Array(columnNamesLength);
            for (let j = 0; j < columnNamesLength; ++j) {
                row[j] = columns[columnNamesOrAliases[j]][i];
            }
        }

        return rows;
    }

    /**
     * Returns the unique version tag of the current state of the table.
     *
     * @function Highcharts.DataTable#getVersionTag
     *
     * @return {string}
     * Unique version tag.
     */
    public getVersionTag(): string {
        return this.versionTag;
    }

    /**
     * Checks for given column names or aliases.
     *
     * @function Highcharts.DataTable#hasColumn
     *
     * @param {Array<string>} columnNamesOrAliases
     * Column names of aliases to check.
     *
     * @return {boolean}
     * Returns `true` if all columns have been found, otherwise `false`.
     */
    public hasColumns(columnNamesOrAliases: Array<string>): boolean {
        const table = this,
            aliasMap = table.aliasMap,
            columns = table.columns;

        for (let i = 0, iEnd = columnNamesOrAliases.length; i < iEnd; ++i) {
            if (
                !columns[columnNamesOrAliases[i]] &&
                !aliasMap[columnNamesOrAliases[i]]
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Searches for a specific cell value.
     *
     * @function Highcharts.DataTable#hasRowWith
     *
     * @param {string} columnNameOrAlias
     * Column to search in.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Cell value to search for. `NaN` and `undefined` are not supported.
     *
     * @return {boolean}
     * True, if a row has been found, otherwise false.
     */
    public hasRowWith(
        columnNameOrAlias: string,
        cellValue: DataTable.CellType
    ): boolean {
        const table = this;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        const column = table.columns[columnNameOrAlias];

        if (column) {
            return (column.indexOf(cellValue) !== -1);
        }

        return false;
    }

    /**
     * Registers a callback for a specific event.
     *
     * @function Highcharts.DataTable#on
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.DataTable>} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    public on(
        type: DataTable.Event['type'],
        callback: DataEventEmitter.EventCallback<this, DataTable.Event>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Renames a column of cell values.
     *
     * @function Highcharts.DataTable#renameColumn
     *
     * @param {string} columnName
     * Name of the column to be renamed.
     *
     * @param {string} newColumnName
     * New name of the column. An existing column with the same name will be
     * replaced.
     *
     * @return {boolean}
     * Returns `true` if successful, `false` if the column was not found.
     */
    public renameColumn(
        columnName: string,
        newColumnName: string
    ): boolean {
        const table = this,
            columns = table.columns;

        if (columns[columnName]) {
            if (columnName !== newColumnName) {
                const aliasMap = table.aliasMap;

                if (aliasMap[newColumnName]) {
                    delete aliasMap[newColumnName];
                }

                columns[newColumnName] = columns[columnName];
                delete columns[columnName];
            }

            return true;
        }

        return false;
    }

    /**
     * Sets a cell value based on the row index and column name or alias.  Will
     * insert a new column, if not found.
     *
     * @function Highcharts.DataTable#setCell
     *
     * @param {number|undefined} rowIndex
     * Row index to set.
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to set.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Cell value to set.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, `false` if not.
     *
     * @emits #setCell
     * @emits #afterSetCell
     */
    public setCell(
        rowIndex: number,
        columnNameOrAlias: string,
        cellValue: DataTable.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            columns = table.columns;

        columnNameOrAlias = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        let column = columns[columnNameOrAlias];

        if (!column) {
            column = columns[columnNameOrAlias] = new Array(table.rowCount);
        }

        table.emit({
            type: 'setCell',
            cellValue,
            columnName: columnNameOrAlias,
            detail: eventDetail,
            rowIndex
        });

        if (rowIndex >= table.rowCount) {
            table.rowCount = (rowIndex + 1);
        }

        column[rowIndex] = cellValue;

        table.emit({
            type: 'afterSetCell',
            cellValue,
            columnName: columnNameOrAlias,
            detail: eventDetail,
            rowIndex
        });

        return true;
    }

    /**
     * Sets cell values for a column. Will insert a new column, if not found.
     *
     * @function Highcharts.DataTable#setColumn
     *
     * @param {string} columnNameOrAlias
     * Column name or alias to set.
     *
     * @param {Highcharts.DataTableColumn} [column]
     * Values to set in the column.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Leave `undefind` to set as new column.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, `false` if not.
     *
     * @emits #setColumn
     * @emits #afterSetColumn
     */
    public setColumn(
        columnNameOrAlias: string,
        column: DataTable.Column = [],
        rowIndex?: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            columns = table.columns;

        const columnName = (
            table.aliasMap[columnNameOrAlias] ||
            columnNameOrAlias
        );

        column = column.slice();

        table.emit({
            type: 'setColumn',
            column: column,
            columnName,
            detail: eventDetail
        });

        if (rowIndex) {
            if (!columns[columnName]) {
                columns[columnName] = [];
            }

            const tableColumn = columns[columnName];

            let rowCount = tableColumn.length;

            if (rowIndex > rowCount) {
                tableColumn.length = rowIndex;
                tableColumn.push(...column);

                rowCount = Math.max(table.rowCount, tableColumn.length);

                const columnNames = Object.keys(columns);

                for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                    columns[columnNames[i]].length = rowCount;
                }

                table.rowCount = rowCount;
            } else {
                tableColumn.splice(rowIndex, (rowCount - rowIndex), ...column);
            }
        } else {
            columns[columnName] = column.slice();
            table.rowCount = Math.max(table.rowCount, column.length);
        }

        table.emit({
            type: 'afterSetColumn',
            column: column,
            columnName,
            detail: eventDetail
        });

        return true;
    }

    /**
     * Defines an alias for a column.
     *
     * @function Highcharts.DataTable#setColumnAlias
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
    public setColumnAlias(
        columnAlias: string,
        columnName: string
    ): boolean {
        const aliasMap = this.aliasMap;

        if (!aliasMap[columnAlias]) {
            aliasMap[columnAlias] = columnName;
            return true;
        }

        return false;
    }

    /**
     * Sets cell values for multiple columns. Will insert new columns, if not
     * found.
     *
     * @function Highcharts.DataTable#setColumns
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Columns as a collection, where the keys are the column names or aliases.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Leave `undefind` to set as new columns.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, `false` if not.
     *
     * @emits #setColumn
     * @emits #afterSetColumn
     */
    public setColumns(
        columns: DataTable.ColumnCollection,
        rowIndex?: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            columnNames = Object.keys(columns);

        let failed = false;

        for (
            let i = 0,
                iEnd = columnNames.length,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            failed = (
                !table.setColumn(
                    columnName,
                    columns[columnName],
                    rowIndex,
                    eventDetail
                ) ||
                failed
            );
        }

        return !failed;
    }

    /**
     * Sets a new presentation state for the table.
     * @private
     *
     * @param {DataPresentationState} presentationState
     * The new presentation state to use.
     */
    public setPresentationState(
        presentationState: DataPresentationState
    ): void {
        this.presentationState = presentationState;
    }

    /**
     * Sets cell values for multiple rows. Will insert new rows, if no
     * index was provided, or if the index is higher than the total number of
     * rows.
     *
     * @function Highcharts.DataTable#setRows
     *
     * @param {Array<Highcharts.DataTableRow>} rows
     * Row values to insert.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Leave `undefind` to add as new rows.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {boolean}
     * Returns `true` if successful, otherwise `false`.
     *
     * @emits #setRow
     * @emits #afterSetRow
     */
    public setRows(
        rows: Array<(DataTable.Row|DataTable.RowObject)>,
        rowIndex: number = this.rowCount,
        eventDetail?: DataEventEmitter.EventDetail
    ): boolean {
        const table = this,
            aliasMap = table.aliasMap,
            columns = table.columns,
            columnNames = Object.keys(columns),
            rowCount = rows.length;

        table.emit({
            type: 'setRows',
            detail: eventDetail,
            rowCount,
            rowIndex,
            rows
        });

        for (
            let i = 0,
                i2 = rowIndex,
                row: (DataTable.Row|DataTable.RowObject);
            i < rowCount;
            ++i, ++i2
        ) {
            row = rows[i];
            if (row === DataTable.NULL) {
                for (let j = 0, jEnd = columnNames.length; j < jEnd; ++j) {
                    columns[columnNames[j]][i2] = null;
                }
            } else if (row instanceof Array) {
                for (let j = 0, jEnd = columnNames.length; j < jEnd; ++j) {
                    columns[columnNames[j]][i2] = row[j];
                }
            } else {
                const rowColumnNames = Object.keys(row);
                for (
                    let j = 0,
                        jEnd = rowColumnNames.length,
                        rowColumnName: string;
                    j < jEnd;
                    ++j
                ) {
                    rowColumnName = rowColumnNames[j];
                    rowColumnName = (aliasMap[rowColumnName] || rowColumnName);
                    if (!columns[rowColumnName]) {
                        columns[rowColumnName] = new Array(i2 + 1);
                    }
                    columns[rowColumnName][i2] = row[rowColumnName];
                }
            }
        }

        const indexRowCount = (rowIndex + rowCount);
        if (indexRowCount > table.rowCount) {
            table.rowCount = indexRowCount;
            for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
                columns[columnNames[i]].length = indexRowCount;
            }
        }

        table.emit({
            type: 'afterSetRows',
            detail: eventDetail,
            rowCount,
            rowIndex,
            rows
        });

        return true;
    }

    /**
     * Converts the table to a class JSON.
     * @private
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this table.
     */
    public toJSON(): DataTable.ClassJSON {
        const table = this,
            aliasMap = table.aliasMap,
            aliases = Object.keys(aliasMap),
            columns = table.columns,
            columnNames = Object.keys(columns),
            json: DataTable.ClassJSON = {
                $class: 'DataTable',
                columns: {}
            },
            jsonColumns = json.columns,
            rowCount = table.rowCount;

        if (!table.autoId) {
            json.id = table.id;
        }

        if (table.presentationState.isSet()) {
            json.presentationState = table.presentationState.toJSON();
        }

        if (aliases.length) {
            const jsonAliasMap: Record<string, string> = json.aliasMap = {};

            for (
                let i = 0,
                    iEnd = aliases.length,
                    alias: string;
                i < iEnd;
                ++i
            ) {
                alias = aliases[i];
                jsonAliasMap[alias] = aliasMap[alias];
            }
        }

        for (
            let i = 0,
                iEnd = columnNames.length,
                column: DataTable.Column,
                columnJSON: DataTable.ColumnJSON,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            column = columns[columnName];
            jsonColumns[columnName] = columnJSON = [];
            for (
                let j = 0,
                    jEnd = rowCount,
                    cell: DataTable.CellType;
                j < jEnd;
                ++j
            ) {
                cell = column[j];
                if (typeof cell === 'object' && cell) {
                    columnJSON[j] = cell.toJSON();
                } else {
                    columnJSON[j] = cell;
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

interface DataTable extends DataEventEmitter<DataTable.Event> {
    // nothing here yet
}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally it provides necessary types for events and JSON conversion.
 */
namespace DataTable {

    /**
     * Event object for cell-related events.
     */
    export interface CellEvent extends DataEventEmitter.Event {
        readonly type: (
            'setCell'|'afterSetCell'
        );
        readonly cellValue: CellType;
        readonly columnName: string;
        readonly rowIndex: number;
    }

    /**
     * Possible value types for a table cell.
     */
    export type CellType = (DataTable|DataJSON.JSONPrimitive);

    /**
     * Class JSON of a DataTable.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        aliasMap?: Record<string, string>;
        columns: ColumnCollectionJSON;
        id?: string;
        presentationState?: DataPresentationState.ClassJSON;
    }

    /**
     * Array of table cells in vertical expansion.
     */
    export interface Column extends Array<DataTable.CellType> {
        [index: number]: CellType;
    }

    /**
     * JSON Array of column values.
     */
    export interface ColumnJSON extends DataJSON.JSONArray {
        [index: number]: (DataJSON.JSONPrimitive|ClassJSON);
    }

    /**
     * Collection of columns, where the key is the column name (or alias) and
     * the value is an array of column values.
     */
    export interface ColumnCollection {
        [columnNameOrAlias: string]: Column;
    }

    /**
     * Collection of columns, where the key is the column name and the value is
     * an array of column values.
     */
    export interface ColumnCollectionJSON {
        [columnNameOrAlias: string]: ColumnJSON;
    }

    /**
     * Event object for column-related events.
     */
    export interface ColumnEvent extends DataEventEmitter.Event {
        readonly type: (
            'clearColumn'|'afterClearColumn'|
            'deleteColumn'|'afterDeleteColumn'|
            'setColumn'|'afterSetColumn'
        );
        readonly column: Readonly<Column>;
        readonly columnName: string;
        readonly rowIndex?: number;
    }

    /**
     * All information objects of DataTable events.
     */
    export type Event = (
        CellEvent|
        ColumnEvent|
        TableEvent|
        RowEvent
    );

    /**
     * Array of table cells in horizontal expansion. Index of the array is the
     * index of the column names.
     */
    export interface Row extends Array<CellType> {
        [index: number]: CellType;
    }

    /**
     * Event object for row-related events.
     */
    export interface RowEvent extends DataEventEmitter.Event {
        readonly type: (
            'clearRows'|'afterClearRows'|
            'deleteRows'|'afterDeleteRows'|
            'setRows'|'afterSetRows'
        );
        readonly rowCount: number;
        readonly rowIndex: number;
        readonly rows?: ReadonlyArray<(Readonly<Row>|Readonly<RowObject>)>;
    }

    /**
     * Object of row values, where the keys are the column names.
     */
    export interface RowObject extends Record<string, CellType> {
        [column: string]: CellType;
    }

    /**
     * Event object for table-related events.
     */
    export interface TableEvent extends DataEventEmitter.Event {
        readonly type: (
            'clearTable'|'afterClearTable'|
            'cloneTable'|'afterCloneTable'
        );
        readonly tableClone?: DataTable;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataJSON.addClass(DataTable);

/* *
 *
 *  Default Export
 *
 * */

export default DataTable;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Possible value types for a table cell.
 * @typedef {boolean|null|number|string|Highcharts.DataTable|undefined} Highcharts.DataTableCellType
 */

/**
 * Array of table cells in vertical expansion.
 * @typedef {Array<Highcharts.DataTableCellType>} Highcharts.DataTableColumn
 */

/**
 * Collection of columns, where the key is the column name (or alias) and
 * the value is an array of column values.
 * @interface Highcharts.DataTableColumnCollection
 *//**
 * @name Highcharts.DataTableColumnCollection#[key:string]
 * @type {Highcharts.DataTableColumn}
 */

/**
 * Custom information for an event.
 * @typedef Highcharts.DataTableEventDetail
 * @type {Record<string,(boolean|number|string|null|undefined)>}
 */

/**
 * Array of table cells in horizontal expansion. Index of the array is the index
 * of the column names.
 * @typedef {Array<Highcharts.DataTableCellType>} Highcharts.DataTableRow
 */

/**
 * Record of table cells in horizontal expansion. Keys of the record are the
 * column names (or aliases).
 * @typedef {Record<string,Highcharts.DataTableCellType>} Highcharts.DataTableRowObject
 */

(''); // keeps doclets above in transpiled file
