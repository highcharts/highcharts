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
 *  - Torstein Hønsi
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from './DataEvent.js';
import type DataTable from './DataTable.js';
import type DataTableOptions from './DataTableOptions.js';

import U from '../Core/Utilities.js';
const {
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
class DataTableCore {

    /**
     * Constructs an instance of the DataTable class.
     *
     * @example
     * const dataTable = new Highcharts.DataTableCore({
     *   columns: {
     *     year: [2020, 2021, 2022, 2023],
     *     cost: [11, 13, 12, 14],
     *     revenue: [12, 15, 14, 18]
     *   }
     * });

     *
     * @param {Highcharts.DataTableOptions} [options]
     * Options to initialize the new DataTable instance.
     */
    public constructor(
        options: DataTableOptions = {}
    ) {
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

        let rowCount = 0;

        objectEach(options.columns || {}, (column, columnName): void => {
            this.columns[columnName] = column.slice();
            rowCount = Math.max(rowCount, column.length);
        });

        this.applyRowCount(rowCount);

    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly autoId: boolean;

    public readonly columns: Record<string, DataTable.Column>;

    public readonly id: string;

    public modified: DataTableCore;

    public rowCount: number;

    protected versionTag: string;

    /* *
     *
     *  Functions
     *
     * */


    /**
     * Applies a row count to the table by setting the `rowCount` property and
     * adjusting the length of all columns.
     *
     * @private
     * @param {number} rowCount The new row count.
     */
    protected applyRowCount(
        rowCount: number
    ): void {
        this.rowCount = rowCount;
        objectEach(this.columns, (column): void => {
            if (isArray(column)) { // Not on typed array
                column.length = rowCount;
            }
        });
    }

    /**
     * Fetches the given column by the canonical column name. Simplified version
     * of the full `DataTable.getRow` method, always returning by reference.
     *
     * @param {string} columnName
     * Name of the column to get.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    public getColumn(
        columnName: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        asReference?: true
    ): (DataTable.Column|undefined) {
        return this.columns[columnName];
    }

    /**
     * Retrieves all or the given columns. Simplified version of the full
     * `DataTable.getColumns` method, always returning by reference.
     *
     * @param {Array<string>} [columnNames]
     * Column names to retrieve.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * Collection of columns. If a requested column was not found, it is
     * `undefined`.
     */
    public getColumns(
        columnNames?: Array<string>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        asReference?: true
    ): DataTable.ColumnCollection {
        return (columnNames || Object.keys(this.columns)).reduce(
            (columns, columnName): DataTable.ColumnCollection => {
                columns[columnName] = this.columns[columnName];
                return columns;
            },
            {} as DataTable.ColumnCollection
        );
    }

    /**
     * Retrieves the row at a given index.
     *
     * @param {number} rowIndex
     * Row index to retrieve. First row has index 0.
     *
     * @param {Array<string>} [columnNames]
     * Column names to retrieve.
     *
     * @return {Record<string, number|string|undefined>|undefined}
     * Returns the row values, or `undefined` if not found.
     */
    public getRow(
        rowIndex: number,
        columnNames?: Array<string>
    ): (DataTable.Row|undefined) {
        return (columnNames || Object.keys(this.columns)).map(
            (key): DataTableCore.CellType => this.columns[key]?.[rowIndex]
        );
    }

    /**
     * Sets cell values for a column. Will insert a new column, if not found.
     *
     * @param {string} columnName
     * Column name to set.
     *
     * @param {Highcharts.DataTableColumn} [column]
     * Values to set in the column.
     *
     * @param {number} [rowIndex=0]
     * Index of the first row to change. (Default: 0)
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumn(
        columnName: string,
        column: DataTable.Column = [],
        rowIndex: number = 0,
        eventDetail?: DataEvent.Detail
    ): void {
        this.setColumns({ [columnName]: column }, rowIndex, eventDetail);
    }

    /**
     * * Sets cell values for multiple columns. Will insert new columns, if not
     * found. Simplified version of the full `DataTable.setColumns`, limited to
     * full replacement of the columns (undefined `rowIndex`).
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Columns as a collection, where the keys are the column names.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Keep undefined to reset.
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumns(
        columns: DataTable.ColumnCollection,
        rowIndex?: number,
        eventDetail?: DataEvent.Detail
    ): void {
        let rowCount = this.rowCount;

        objectEach(columns, (column, columnName): void => {
            this.columns[columnName] = column.slice();
            rowCount = column.length;
        });

        this.applyRowCount(rowCount);

        if (!eventDetail?.silent) {
            fireEvent(this, 'afterSetColumns');
            this.versionTag = uniqueKey();
        }
    }

    /**
     * Sets cell values of a row. Will insert a new row if no index was
     * provided, or if the index is higher than the total number of table rows.
     * A simplified version of the full `DateTable.setRow`, limited to objects.
     *
     * @param {Record<string, number|string|undefined>} row
     * Cell values to set.
     *
     * @param {number} [rowIndex]
     * Index of the row to set. Leave `undefind` to add as a new row.
     *
     * @param {boolean} [insert]
     * Whether to insert the row at the given index, or to overwrite the row.
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #afterSetRows
     */
    public setRow(
        row: DataTable.RowObject,
        rowIndex: number = this.rowCount,
        insert?: boolean,
        eventDetail?: DataEvent.Detail
    ): void {
        const { columns } = this,
            indexRowCount = insert ? this.rowCount + 1 : rowIndex + 1;

        objectEach(row, (cellValue, columnName): void => {
            const column = columns[columnName] ||
                eventDetail?.addColumns !== false && new Array(indexRowCount);
            if (column) {
                if (insert) {
                    column.splice(rowIndex, 0, cellValue);
                } else {
                    column[rowIndex] = cellValue;
                }
                columns[columnName] = column;
            }
        });

        if (indexRowCount > this.rowCount) {
            this.applyRowCount(indexRowCount);
        }

        if (!eventDetail?.silent) {
            fireEvent(this, 'afterSetRows');
            this.versionTag = uniqueKey();
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
namespace DataTableCore {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Possible value types for a table cell.
     */
    export type CellType = (boolean|number|null|string|undefined);

    /**
     * Array of table cells in vertical expansion.
     */
    export interface Column extends Array<DataTable.CellType> {
        [index: number]: CellType;
    }

    /**
     * Collection of columns, where the key is the column name and
     * the value is an array of column values.
     */
    export interface ColumnCollection {
        [columnName: string]: Column;
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
        ColumnEvent|
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
}


/* *
 *
 *  Default Export
 *
 * */


export default DataTableCore;


/* *
 *
 *  API Declarations
 *
 * */

/**
 * A column of values in a data table.
 * @typedef {Array<boolean|null|number|string|undefined>} Highcharts.DataTableColumn
 *//**
 * A collection of data table columns defined by a object where the key is the
 * column name and the value is an array of the column values.
 * @typedef {Record<string, Highcharts.DataTableColumn>} Highcharts.DataTableColumnCollection
 */

/**
 * Options for the `DataTable` or `DataTableCore` classes.
 * @interface Highcharts.DataTableOptions
 *//**
 * The column options for the data table. The columns are defined by an object
 * where the key is the column ID and the value is an array of the column
 * values.
 *
 * @name Highcharts.DataTableOptions.columns
 * @type {Highcharts.DataTableColumnCollection|undefined}
 *//**
 * Custom ID to identify the new DataTable instance.
 *
 * @name Highcharts.DataTableOptions.id
 * @type {string|undefined}
 */

(''); // Keeps doclets above in JS file
