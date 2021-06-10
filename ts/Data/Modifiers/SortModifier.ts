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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Sort table rows according to values of a column.
 *
 * @private
 */
class SortModifier extends DataModifier {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Default options to group table rows.
     */
    public static readonly defaultOptions: SortModifier.Options = {
        modifier: 'Order',
        direction: 'desc',
        orderByColumn: 'y'
    };

    /* *
     *
     *  Static Functions
     *
     * */

    private static ascending(
        a: DataTable.CellType,
        b: DataTable.CellType
    ): number {
        return (
            (a || 0) < (b || 0) ? -1 :
                (a || 0) > (b || 0) ? 1 :
                    0
        );
    }

    private static descending(
        a: DataTable.CellType,
        b: DataTable.CellType
    ): number {
        return (
            (b || 0) < (a || 0) ? -1 :
                (b || 0) > (a || 0) ? 1 :
                    0
        );
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the range modifier.
     *
     * @param {RangeDataModifier.Options} [options]
     * Options to configure the range modifier.
     */
    public constructor(options?: DeepPartial<SortModifier.Options>) {
        super();

        this.options = merge(SortModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: SortModifier.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Sorts rows in the table.
     *
     * @param {DataTable} table
     * Table to sort in.
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {DataTable}
     * Sorted table as a reference.
     */
    public modify(
        table: DataTable,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this,
            {
                direction,
                orderByColumn,
                orderInColumn
            } = modifier.options,
            compare = (
                direction === 'asc' ?
                    SortModifier.ascending :
                    SortModifier.descending
            );

        modifier.emit({
            type: 'modify',
            detail: eventDetail,
            table
        });

        const columnNames = table.getColumnNames(),
            orderByColumnIndex = columnNames.indexOf(orderByColumn),
            rowReferences = table
                .getRows()
                .map((row, index): SortModifier.RowReference => ({
                    index,
                    row
                })),
            rowCount = table.getRowCount();

        if (orderByColumnIndex !== -1) {
            rowReferences.sort((a, b): number => compare(
                a.row[orderByColumnIndex],
                b.row[orderByColumnIndex]
            ));
        }
        if (orderInColumn) {
            const column: DataTable.Column = [];
            for (let i = 0; i < rowCount; ++i) {
                column[rowReferences[i].index] = i;
            }
            table.setColumns({ [orderInColumn]: column });
        } else {
            const rows: Array<DataTable.Row> = [];
            for (let i = 0; i < rowCount; ++i) {
                rows.push(rowReferences[i].row);
            }
            table.setRows(rows, 0);
        }

        modifier.emit({
            type: 'afterModify',
            detail: eventDetail,
            table
        });

        return table;
    }

    /**
     * Applies partial modifications of a cell change to the property `modified`
     * of the given modified table.
     *
     * @param {Highcharts.DataTable} table
     * Modified table.
     *
     * @param {string} columnName
     * Column name of changed cell.
     *
     * @param {number|undefined} rowIndex
     * Row index of changed cell.
     *
     * @param {Highcharts.DataTableCellType} cellValue
     * Changed cell value.
     *
     * @param {Highcharts.DataTableEventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Highcharts.DataTable}
     * Reference of `table.modified` with the additional modifications.
     */
    public modifyCell(
        table: DataTable,
        columnName: string,
        rowIndex: number,
        cellValue: DataTable.CellType,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {
        const modifier = this,
            {
                orderByColumn,
                orderInColumn
            } = modifier.options;

        if (columnName === orderByColumn) {
            const sortedTable = new DataTable();

            sortedTable.setColumns(table.getColumns(
                orderInColumn ?
                    [orderByColumn, orderInColumn] :
                    table.getColumnNames()
            ));

            table.modified.setColumns(
                this.modify(sortedTable).getColumns(),
                void 0,
                eventDetail
            );
        }

        return table.modified;
    }

    public modifyColumns(
        table: DataTable,
        columns: DataTable.ColumnCollection,
        rowIndex: number,
        eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {

        const modifier = this,
            {
                orderByColumn,
                orderInColumn
            } = modifier.options,
            columnNames = Object.keys(columns);

        if (columnNames.indexOf(orderByColumn) > -1) {
            const sortedTable = new DataTable();

            sortedTable.setColumns(table.getColumns(
                orderInColumn ?
                    [orderByColumn, orderInColumn] :
                    table.getColumnNames()
            ));

            table.modified.setColumns(
                this.modify(sortedTable).getColumns(),
                void 0,
                eventDetail
            );
        }

        return table.modified;
    }

    public modifyRows(
        table: DataTable,
        _rows: Array<(DataTable.Row|DataTable.RowObject)>,
        _rowIndex: number,
        _eventDetail?: DataEventEmitter.EventDetail
    ): DataTable {

        const modifier = this,
            {
                orderByColumn,
                orderInColumn
            } = modifier.options;

        const sortedTable = new DataTable();

        sortedTable.setColumns(table.getColumns(
            orderInColumn ?
                [orderByColumn, orderInColumn] :
                table.getColumnNames()
        ));

        table.modified.setColumns(this.modify(sortedTable).getColumns());

        return table.modified;
    }

    /**
     * Converts the sort modifier to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this sort modifier.
     */
    public toJSON(): SortModifier.ClassJSON {
        return {
            $class: 'SortModifier',
            options: merge(this.options)
        };
    }

}

/* *
 *
 *  Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options, and JSON
 * conversion.
 */
namespace SortModifier {

    /**
     * Interface of the class JSON to convert to modifier instances.
     */
    export interface ClassJSON extends DataModifier.ClassJSON {
        options: Options;
    }

    /**
     * Options to configure the modifier.
     */
    export interface Options extends DataModifier.Options {

        /**
         * Direction of sorting.
         *
         * @default "desc"
         */
        direction: ('asc'|'desc');

        /**
         * Column with values to order.
         *
         * @default "y"
         */
        orderByColumn: string;

        /**
         * Column to update with order index instead of change order of rows.
         */
        orderInColumn?: string;

    }

    /** @private */
    export interface RowReference {
        index: number;
        row: DataTable.Row;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SortModifier;
