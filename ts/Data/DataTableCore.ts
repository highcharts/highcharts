/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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


import type { DataEventDetail } from './DataEvent.js';
import type {
    Column as DataTableColumn,
    ColumnCollection as DataTableColumnCollection,
    RowObject as DataTableRowObject
} from './DataTable.js';
import type DataTableOptions from './DataTableOptions.js';

import ColumnUtils from './ColumnUtils.js';
const { setLength, splice } = ColumnUtils;

import { fireEvent, objectEach } from '../Shared/Utilities.js';
import { uniqueKey } from '../Core/Utilities.js';


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
 * @name Highcharts.DataTableCore
 *
 * @param {Highcharts.DataTableOptions} [options]
 * Options to initialize the new DataTable instance.
 */
class DataTableCore {

    /**
     * Constructs an instance of the DataTableCore class.
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
        this.autoId = !options.id;
        this.columns = {};
        this.id = (options.id || uniqueKey());
        this.rowCount = 0;
        this.versionTag = uniqueKey();

        let rowCount = 0;

        objectEach(options.columns || {}, (column, columnId): void => {
            this.columns[columnId] = column.slice();
            rowCount = Math.max(rowCount, column.length);
        });

        this.applyRowCount(rowCount);

    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Whether the ID was automatic generated or given in the constructor.
     *
     * @name Highcharts.DataTableCore#autoId
     * @type {boolean}
     */
    public readonly autoId: boolean;

    /**
     * Collection of columns in the table.
     *
     * @name Highcharts.DataTableCore#columns
     * @type {Record<string, Highcharts.DataTableColumn>}
     */
    public readonly columns: Record<string, DataTableColumn>;

    /**
     * ID of the table for identification purposes.
     *
     * @name Highcharts.DataTableCore#id
     * @type {string}
     */
    public readonly id: string;

    public modified?: this;
    public readonly isDataTable = true;

    /**
     * Number of rows in the table.
     *
     * @name Highcharts.DataTableCore#rowCount
     * @type {number}
     */
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
        objectEach(this.columns, (column, columnId): void => {
            if (column.length !== rowCount) {
                this.columns[columnId] = setLength(column, rowCount);
            }
        });
    }

    /**
     * Delete rows. Simplified version of the full
     * `DataTable.deleteRows` method.
     *
     * @function Highcharts.DataTableCore#deleteRows
     *
     * @param {number} rowIndex
     * The start row index
     *
     * @param {number} [rowCount=1]
     * The number of rows to delete
     *
     * @return {void}
     *
     * @emits #afterDeleteRows
     */
    public deleteRows(
        rowIndex: number,
        rowCount = 1
    ): void {
        if (rowCount > 0 && rowIndex < this.rowCount) {
            let length = 0;
            objectEach(this.columns, (column, columnId): void => {
                this.columns[columnId] =
                    splice(column, rowIndex, rowCount).array;
                length = column.length;
            });
            this.rowCount = length;
        }

        fireEvent(this, 'afterDeleteRows', { rowIndex, rowCount });
        this.versionTag = uniqueKey();
    }

    /**
     * Fetches the given column by the canonical column ID. Simplified version
     * of the full `DataTable.getRow` method, always returning by reference.
     *
     * @function Highcharts.DataTableCore#setColumn
     *
     * @param {string} columnId
     * ID of the column to get.
     *
     * @return {Highcharts.DataTableColumn|undefined}
     * A copy of the column, or `undefined` if not found.
     */
    public getColumn(
        columnId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        asReference?: true
    ): (DataTableColumn|undefined) {
        return this.columns[columnId];
    }

    /**
     * Retrieves all or the given columns. Simplified version of the full
     * `DataTable.getColumns` method, always returning by reference.
     *
     * @function Highcharts.DataTableCore#getColumns
     *
     * @param {Array<string>} [columnIds]
     * Column ids to retrieve.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * Collection of columns. If a requested column was not found, it is
     * `undefined`.
     */
    public getColumns(
        columnIds?: Array<string>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        asReference?: true
    ): DataTableColumnCollection {
        return (columnIds || Object.keys(this.columns)).reduce(
            (columns, columnId): DataTableColumnCollection => {
                columns[columnId] = this.columns[columnId];
                return columns;
            },
            {} as DataTableColumnCollection
        );
    }

    /**
     * Retrieves the row at a given index.
     *
     * @function Highcharts.DataTableCore#getRowObject
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
    public getRowObject(
        rowIndex: number,
        columnNames?: Array<string>
    ): (DataTableRowObject|undefined) {
        const row = {} as DataTableRowObject,
            columns = this.columns;

        columnNames ??= Object.keys(this.columns);

        for (const columnName of columnNames) {
            row[columnName] = columns[columnName]?.[rowIndex];
        }
        return row;
    }

    /**
     * Output the table in the console.
     * @todo remove/comment out this method before production
     */
    public log(msg = '', limit = 10, start = 0): void {
        /* eslint-disable no-console */
        const extra = (this.rowCount > limit || start > 0) ?
            `Showing ${limit} rows out of ${this.rowCount}, start at ${start}` :
            '';
        if (extra) {
            msg += ` / ${extra}`;
        }
        if (msg) {
            console.group(msg);
        }
        console.table(
            new Array(Math.min(this.rowCount, limit))
                .fill(void 0)
                .map((_, i): DataTableRowObject =>
                    this.getRowObject(i + start) || {}
                )
        );
        if (msg) {
            console.groupEnd();
        }
        /* eslint-enable no-console */
    }

    /**
     * Sets cell values for a column. Will insert a new column, if not found.
     *
     * @function Highcharts.DataTableCore#setColumn
     *
     * @param {string} columnId
     * Column name to set.
     *
     * @param {Highcharts.DataTableColumn} [column]
     * Values to set in the column.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. (Default: 0)
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumn(
        columnId: string,
        column: DataTableColumn = [],
        rowIndex: number = 0,
        eventDetail?: DataEventDetail
    ): void {
        this.setColumns({ [columnId]: column }, rowIndex, eventDetail);
    }

    /**
     * Sets cell values for multiple columns. Will insert new columns, if not
     * found. Simplified version of the full `DataTableCore.setColumns`, limited
     * to full replacement of the columns (undefined `rowIndex`).
     *
     * @function Highcharts.DataTableCore#setColumns
     *
     * @param {Highcharts.DataTableColumnCollection} columns
     * Columns as a collection, where the keys are the column names.
     *
     * @param {number} [rowIndex]
     * Index of the first row to change. Ignored in the `DataTableCore`, as it
     * always replaces the full column.
     *
     * @param {Record<string, (boolean|number|string|null|undefined)>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits #setColumns
     * @emits #afterSetColumns
     */
    public setColumns(
        columns: DataTableColumnCollection,
        rowIndex?: number,
        eventDetail?: DataEventDetail
    ): void {
        let rowCount = this.rowCount;
        objectEach(columns, (column, columnId): void => {
            this.columns[columnId] = column.slice();
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
     * @function Highcharts.DataTableCore#setRow
     *
     * @param {Record<string, number|string|undefined>} row
     * Cell values to set.
     *
     * @param {number} [rowIndex]
     * Index of the row to set. Leave `undefined` to add as a new row.
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
        row: DataTableRowObject,
        rowIndex: number = this.rowCount,
        insert?: boolean,
        eventDetail?: DataEventDetail
    ): void {
        const { columns } = this,
            indexRowCount = insert ? this.rowCount + 1 : rowIndex + 1,
            rowKeys = Object.keys(row);

        if (eventDetail?.addColumns !== false) {
            for (let i = 0, iEnd = rowKeys.length; i < iEnd; i++) {
                columns[rowKeys[i]] ||= new Array(this.rowCount);
            }
        }

        objectEach(columns, (column, columnId): void => {
            if (column) {
                if (insert) {
                    column = splice(
                        column,
                        rowIndex,
                        0,
                        true,
                        [row[columnId]]
                    ).array;
                } else {
                    column[rowIndex] =
                        // Preserve explicit null and undefined but fall back
                        // to existing value if the new row does not have the
                        // key
                        columnId in row ?
                            row[columnId] :
                            column[rowIndex];
                }
                columns[columnId] = column;
            }
        });

        this.applyRowCount(Math.max(indexRowCount, this.rowCount));

        if (!eventDetail?.silent) {
            fireEvent(this, 'afterSetRows', { rowIndex });
            this.versionTag = uniqueKey();
        }
    }

    /**
     * Returns the modified (clone) or the original data table if the modified
     * one does not exist.
     *
     * @return {Highcharts.DataTableCore}
     * The modified (clone) or the original data table.
     */
    public getModified(): this {
        return this.modified || this;
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
 * A typed array.
 * @typedef {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} Highcharts.TypedArray
 *//**
 * A column of values in a data table.
 * @typedef {Array<boolean|null|number|string|undefined>|Highcharts.TypedArray} Highcharts.DataTableColumn
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
