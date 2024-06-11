/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Gøran Slettemark
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from './DataEvent';
import type DataModifier from './Modifiers/DataModifier';
import type DataTable from './DataTable';
import type DataTableOptions from './DataTableOptions';

import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    isArray,
    objectEach,
    uniqueKey
} = U;


/* *
 *
 *  Class
 *
 * */


/**
 * Class to manage columns and rows in a table structure. It provides methods
 * to add, remove, and manipulate columns and rows, as well as to retrieve data
 * from specific cells.
 *
 * @class
 * @name Highcharts.DataTable
 *
 * @param {Highcharts.DataTableOptions} [options]
 * Options to initialize the new DataTable instance.
 */
class DataTableBase implements DataEvent.Emitter {

    /**
     * Constructs an instance of the DataTable class.
     *
     * @param {Highcharts.DataTableOptions} [options]
     * Options to initialize the new DataTable instance.
     */
    public constructor(
        options: DataTableOptions = {}
    ) {

        /**
         * Dictionary of all column aliases and their mapped column. If a column
         * for one of the get-methods matches an column alias, this column will
         * be replaced with the mapped column by the column alias.
         *
         * @name Highcharts.DataTable#aliases
         * @type {Highcharts.Dictionary<string>}
         */
        this.aliases = (
            options.aliases ?
                JSON.parse(JSON.stringify(options.aliases)) :
                {}
        );

        /**
         * Whether the ID was automatic generated or given in the constructor.
         *
         * @name Highcharts.DataTable#autoId
         * @type {boolean}
         */
        this.autoId = !options.id;
        this.columns = {};

        /**
         * ID of the table for indentification purposes.
         *
         * @name Highcharts.DataTable#id
         * @type {string}
         */
        this.id = (options.id || uniqueKey());
        this.modified = this;
        this.rowCount = 0;
        this.versionTag = uniqueKey();

        const columns = options.columns || {},
            columnNames = Object.keys(columns),
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
            if (isArray(thisColumns[columnNames[i]])) { // Not on typed array
                thisColumns[columnNames[i]].length = rowCount;
            }
        }

        this.rowCount = rowCount;

        const aliases = options.aliases || {},
            aliasKeys = Object.keys(aliases),
            thisAliases = this.aliases;

        for (
            let i = 0,
                iEnd = aliasKeys.length,
                alias: string;
            i < iEnd;
            ++i
        ) {
            alias = aliasKeys[i];
            thisAliases[alias] = aliases[alias];
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly aliases: DataTable.ColumnAliases;

    public readonly autoId: boolean;

    protected columns: Record<string, DataTable.Column>;

    public readonly id: string;

    public modified: DataTableBase;

    // @note Made this public because we're using it for quick checks in
    // Highcharts
    public rowCount: number;

    protected versionTag: string;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Deletes rows in this table.
     *
     * @function Highcharts.DataTable#deleteRows
     *
     * @param {number} [rowIndex]
     * Index to start delete of rows. If not specified, all rows will be
     * deleted.
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
        this: DataTableBase|DataTable,
        rowIndex?: number,
        rowCount: number = 1,
        eventDetail?: DataEvent.Detail
    ): Array<DataTable.Row> {
        const table = this,
            deletedRows: Array<DataTable.Row> = [],
            modifiedRows: Array<DataTable.Row> = [],
            modifier = (table as DataTable).modifier;

        table.emit({
            type: 'deleteRows',
            detail: eventDetail,
            rowCount,
            rowIndex: (rowIndex || 0)
        });

        if (typeof rowIndex === 'undefined') {
            rowIndex = 0;
            rowCount = table.rowCount;
        }

        if (rowCount > 0 && rowIndex < table.rowCount) {
            const columns = (table as DataTableBase).columns,
                columnNames = Object.keys(columns);

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

                modifiedRows.push(new Array(iEnd));
            }
        }

        if (modifier) {
            modifier.modifyRows(
                table as any,
                modifiedRows,
                (rowIndex || 0),
                eventDetail
            );
        }

        table.emit({
            type: 'afterDeleteRows',
            detail: eventDetail,
            rowCount,
            rowIndex: (rowIndex || 0),
            rows: deletedRows
        });

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
    public emit<E extends DataEvent>(e: E): void {
        const table = this;

        switch (e.type) {
            case 'afterDeleteColumns':
            case 'afterDeleteRows':
            case 'afterSetCell':
            case 'afterSetColumns':
            case 'afterSetRows':
                table.versionTag = uniqueKey();
                break;
            default:
        }

        fireEvent(table, e.type, e);
    }

    public getColumn(
        columnNameOrAlias: string,
        asReference?: boolean
    ): (DataTable.Column|undefined);
    public getColumn(
        columnNameOrAlias: string,
        asReference: true
    ): (DataTable.Column|undefined);
    /**
     * Fetches the given column by the canonical column name or by an alias.
     * This function is a simplified wrap of {@link getColumns}.
     *
     * @function Highcharts.DataTable#getColumn
     *
     * @param {string} columnNameOrAlias
     * Name or alias of the column to get, alias takes precedence.
     *
     * @param {boolean} [asReference]
     * Whether to return the column as a readonly reference.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    public getColumn(
        columnNameOrAlias: string,
        asReference?: boolean
    ): (DataTable.Column|undefined) {
        return this.getColumns(
            [columnNameOrAlias],
            asReference
        )[columnNameOrAlias];
    }

    public getColumns(
        columnNamesOrAliases?: Array<string>,
        asReference?: boolean
    ): DataTable.ColumnCollection;
    public getColumns(
        columnNamesOrAliases: (Array<string>|undefined),
        asReference: true
    ): Record<string, DataTable.Column>;
    /**
     * Retrieves all or the given columns.
     *
     * @function Highcharts.DataTable#getColumns
     *
     * @param {Array<string>} [columnNamesOrAliases]
     * Column names or aliases to retrieve. Aliases taking precedence.
     *
     * @param {boolean} [asReference]
     * Whether to return columns as a readonly reference.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * Collection of columns. If a requested column was not found, it is
     * `undefined`.
     */
    public getColumns(
        columnNamesOrAliases?: Array<string>,
        asReference?: boolean
    ): DataTable.ColumnCollection {
        const table = this,
            tableAliasMap = table.aliases,
            tableColumns = table.columns,
            columns: DataTable.ColumnCollection = {};

        columnNamesOrAliases = (
            columnNamesOrAliases || Object.keys(tableColumns)
        );

        for (
            let i = 0,
                iEnd = columnNamesOrAliases.length,
                column: DataTable.Column,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNamesOrAliases[i];
            column = tableColumns[(tableAliasMap[columnName] || columnName)];

            if (column) {
                columns[columnName] = (asReference ? column : column.slice());
            }
        }

        return columns;
    }

    /**
     * Retrieves the row at a given index. This function is a simplified wrap of
     * {@link getRows}.
     *
     * @function Highcharts.DataTable#getRow
     *
     * @param {number} rowIndex
     * Row index to retrieve. First row has index 0.
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
        return this.getRows(rowIndex, 1, columnNamesOrAliases)[0];
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
            aliases = table.aliases,
            columns = table.columns,
            rows: Array<DataTable.Row> = new Array(rowCount);

        columnNamesOrAliases = (columnNamesOrAliases || Object.keys(columns));

        for (
            let i = rowIndex,
                i2 = 0,
                iEnd = Math.min(
                    table.rowCount,
                    (rowIndex + rowCount
                    )
                ),
                column: DataTable.Column,
                row: DataTable.Row;
            i < iEnd;
            ++i, ++i2
        ) {
            row = rows[i2] = [];

            for (const columnName of columnNamesOrAliases) {
                column = columns[(aliases[columnName] || columnName)];
                row.push(column ? column[i] : void 0);
            }
        }

        return rows;
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
    public on<E extends DataEvent>(
        type: E['type'],
        callback: DataEvent.Callback<this, E>
    ): Function {
        return addEvent(this, type, callback);
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
     * @param {number} [rowIndex=0]
     * Index of the first row to change. (Default: 0)
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumn(
        columnNameOrAlias: string,
        column: DataTable.Column = [],
        rowIndex: number = 0,
        eventDetail?: DataEvent.Detail
    ): void {
        this.setColumns({ [columnNameOrAlias]: column }, rowIndex, eventDetail);
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
     * Index of the first row to change. Keep undefined to reset.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumns(
        this: DataTableBase|DataTable,
        columns: DataTable.ColumnCollection,
        rowIndex?: number,
        eventDetail?: DataEvent.Detail
    ): void {
        const table = this,
            tableColumns = (table as DataTableBase).columns,
            tableModifier = (table as DataTable).modifier,
            reset = (typeof rowIndex === 'undefined'),
            columnNames = Object.keys(columns);

        table.emit({
            type: 'setColumns',
            columns,
            columnNames,
            detail: eventDetail,
            rowIndex
        });

        for (
            let i = 0,
                iEnd = columnNames.length,
                column: DataTable.Column,
                columnName: string;
            i < iEnd;
            ++i
        ) {
            columnName = columnNames[i];
            column = columns[columnName];
            columnName = (
                table.aliases[columnName] ||
                columnName
            );

            if (reset) {
                tableColumns[columnName] = column.slice();
                table.rowCount = column.length;
            } else {
                const tableColumn: DataTable.Column = (
                    tableColumns[columnName] ?
                        tableColumns[columnName] :
                        tableColumns[columnName] = new Array(table.rowCount)
                );

                for (
                    let i = (rowIndex || 0),
                        iEnd = column.length;
                    i < iEnd;
                    ++i
                ) {
                    tableColumn[i] = column[i];
                }

                table.rowCount = Math.max(table.rowCount, tableColumn.length);
            }
        }

        const tableColumnNames = Object.keys(tableColumns);

        for (let i = 0, iEnd = tableColumnNames.length; i < iEnd; ++i) {
            tableColumns[tableColumnNames[i]].length = table.rowCount;
        }

        if (tableModifier) {
            tableModifier.modifyColumns(
                table as DataTable,
                columns,
                rowIndex || 0
            );
        }

        table.emit({
            type: 'afterSetColumns',
            columns,
            columnNames,
            detail: eventDetail,
            rowIndex
        });
    }

    /**
     * A smaller version of the full DateTable.setRow, limited to objects
     */
    public setRow(
        row: DataTable.RowObject,
        rowIndex: number = this.rowCount
    ): void {
        const { aliases, columns } = this,
            indexRowCount = rowIndex + 1,
            rowColumnNames = Object.keys(row);
        for (
            let j = 0,
                jEnd = rowColumnNames.length,
                rowColumnName: string;
            j < jEnd;
            ++j
        ) {
            rowColumnName = rowColumnNames[j];
            rowColumnName = (aliases[rowColumnName] || rowColumnName);
            if (!columns[rowColumnName]) {
                columns[rowColumnName] = new Array(indexRowCount);
            }
            columns[rowColumnName][rowIndex] = row[rowColumnName];
        }

        if (indexRowCount > this.rowCount) {
            this.rowCount = indexRowCount;
            objectEach(columns, (column): void => {
                column.length = indexRowCount;
            });
        }
    }
}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally it provides necessary types for events.
 */
namespace DataTableBase {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event object for cell-related events.
     */
    export interface CellEvent extends DataEvent {
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
    export type CellType = (boolean|number|null|string|undefined);

    /**
     * Event object for clone-related events.
     */
    export interface CloneEvent extends DataEvent {
        readonly type: (
            'cloneTable'|'afterCloneTable'
        );
        readonly tableClone?: DataTableBase;
    }

    /**
     * Array of table cells in vertical expansion.
     */
    export interface Column extends Array<DataTable.CellType> {
        [index: number]: CellType;
    }

    /**
     * Map of column alias to column name.
     */
    export type ColumnAliases = Record<string, string>;

    /**
     * Collection of columns, where the key is the column name (or alias) and
     * the value is an array of column values.
     */
    export interface ColumnCollection {
        [columnNameOrAlias: string]: Column;
    }

    /**
     * Event object for column-related events.
     */
    export interface ColumnEvent extends DataEvent {
        readonly type: (
            'deleteColumns'|'afterDeleteColumns'|
            'setColumns'|'afterSetColumns'
        );
        readonly columns?: ColumnCollection;
        readonly columnNames: Array<string>;
        readonly rowIndex?: number;
    }

    /**
     * All information objects of DataTable events.
     */
    export type Event = (
        CellEvent|
        CloneEvent|
        ColumnEvent|
        SetModifierEvent|
        RowEvent
    );

    /**
     * Event object for modifier-related events.
     */
    export interface ModifierEvent extends DataEvent {
        readonly type: (
            'setModifier'|'afterSetModifier'
        );
        readonly modifier: (DataModifier|undefined);
    }

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
    export interface RowEvent extends DataEvent {
        readonly type: (
            'deleteRows'|'afterDeleteRows'|
            'setRows'|'afterSetRows'
        );
        readonly rowCount: number;
        readonly rowIndex: number;
        readonly rows?: Array<(Row|RowObject)>;
    }

    /**
     * Object of row values, where the keys are the column names.
     */
    export interface RowObject extends Record<string, CellType> {
        [column: string]: CellType;
    }


    /**
    * Event object for the setModifier events.
    */
    export interface SetModifierEvent extends DataEvent {
        readonly type: (
            'setModifier'|'afterSetModifier'|
            'setModifierError'
        );
        readonly error?: unknown;
        readonly modifier?: DataModifier;
        readonly modified?: DataTableBase;
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default DataTableBase;
