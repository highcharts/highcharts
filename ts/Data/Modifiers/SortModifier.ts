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

import type DataEventEmitter from '../DataEventEmitter';
import type DataTableRow from '../DataTableRow';

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
        a: DataTableRow.CellType,
        b: DataTableRow.CellType
    ): number {
        return (
            !a || !b ? 0 :
                a < b ? -1 :
                    a > b ? 1 :
                        0
        );
    }

    private static descending(
        a: DataTableRow.CellType,
        b: DataTableRow.CellType
    ): number {
        return (
            !a || !b ? 0 :
                b < a ? -1 :
                    b > a ? 1 :
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

    public execute<T extends DataEventEmitter.EventDetail>(
        table: DataTable,
        eventDetail?: T
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
            type: 'execute',
            detail: eventDetail,
            table
        });

        const tableRows = table.getAllRows().sort((
            a: DataTableRow,
            b: DataTableRow
        ): number => compare(
            a.getCell(orderByColumn),
            b.getCell(orderByColumn)
        ));

        if (orderInColumn) {
            for (let i = 0, iEnd = tableRows.length; i < iEnd; ++i) {
                tableRows[i].setCell(orderInColumn, i);
            }
        } else {
            table = new DataTable(tableRows);
        }

        modifier.emit({
            type: 'afterExecute',
            detail: eventDetail,
            table
        });

        return table;
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
         * If set, the order of rows in the table will not change, just the
         * index values of the given column.
         */
        orderInColumn?: string;

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SortModifier;
