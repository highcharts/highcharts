/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Dawid Dragula
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type DataEvent from '../DataEvent';
import type SortModifierOptions from './SortModifierOptions';
import type { SortModifierOrderByOption } from './SortModifierOptions';

import DataModifier from './DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;


/* *
 *
 *  Declarations
 *
 * */


/** @private */
interface SortRowReference {
    index: number;
    row: DataTable.Row;
}


/* *
 *
 *  Class
 *
 * */

/**
 * Sort table rows according to values of a column.
 *
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
    public static readonly defaultOptions: SortModifierOptions = {
        type: 'Sort',
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

    private static compareFactory(
        direction: 'asc'|'desc',
        customCompare?: (a: DataTable.CellType, b: DataTable.CellType) => number
    ): ((a: DataTable.CellType, b: DataTable.CellType) => number) {
        if (customCompare) {
            if (direction === 'desc') {
                return (
                    a: DataTable.CellType,
                    b: DataTable.CellType
                ): number => -customCompare(a, b);
            }
            return customCompare;
        }

        return (
            direction === 'asc' ?
                SortModifier.ascending :
                SortModifier.descending
        );
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of the sort modifier.
     *
     * @param {Partial<SortDataModifier.Options>} [options]
     * Options to configure the sort modifier.
     */
    public constructor(
        options?: Partial<SortModifierOptions>
    ) {
        super();

        this.options = merge(SortModifier.defaultOptions, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: SortModifierOptions;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Returns index and row for sort reference.
     *
     * @private
     *
     * @param {Highcharts.DataTable} table
     * Table with rows to reference.
     *
     * @return {Array<SortModifier.RowReference>}
     * Array of row references.
     */
    protected getRowReferences(
        table: DataTable
    ): Array<SortRowReference> {
        const rows = table.getRows(),
            rowReferences: Array<SortRowReference> = [];

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rowReferences.push({
                index: i,
                row: rows[i]
            });
        }

        return rowReferences;
    }

    public override modifyTable(
        table: DataTable,
        eventDetail?: DataEvent.Detail
    ): DataTable {
        const modifier = this;

        modifier.emit({ type: 'modify', detail: eventDetail, table });

        const columnIds = table.getColumnIds(),
            rowCount = table.getRowCount(),
            rowReferences = this.getRowReferences(table),
            {
                direction,
                orderByColumn,
                orderInColumn,
                compare: customCompare
            } = modifier.options,
            modified = table.getModified();

        const orderBy: Array<(string|SortModifierOrderByOption)> = (
            Array.isArray(orderByColumn) ?
                orderByColumn :
                [orderByColumn]
        );

        const orderByIndexes: Array<{
            columnIndex: number;
            compare: (
                a: DataTable.CellType,
                b: DataTable.CellType
            ) => number;
        }> = [];

        for (let i = 0, iEnd = orderBy.length; i < iEnd; ++i) {
            const sort = orderBy[i];
            const column = (typeof sort === 'string' ? sort : sort.column);
            const columnIndex = columnIds.indexOf(column);
            if (columnIndex === -1) {
                continue;
            }

            orderByIndexes.push({
                columnIndex,
                compare: SortModifier.compareFactory(
                    typeof sort === 'string' ?
                        direction :
                        (sort.direction || direction),
                    typeof sort === 'string' ?
                        customCompare :
                        (sort.compare || customCompare)
                )
            });
        }

        if (orderByIndexes.length) {
            rowReferences.sort((a, b): number => {
                for (let i = 0, iEnd = orderByIndexes.length; i < iEnd; ++i) {
                    const { columnIndex, compare } = orderByIndexes[i];
                    const result = compare(
                        a.row[columnIndex],
                        b.row[columnIndex]
                    );
                    if (result) {
                        return result;
                    }
                }
                return a.index - b.index;
            });
        }

        if (orderInColumn) {
            const column: DataTable.Column = [];
            for (let i = 0; i < rowCount; ++i) {
                column[rowReferences[i].index] = i;
            }
            modified.setColumns({ [orderInColumn]: column });
        } else {
            const originalIndexes: Array<number|undefined> = [];
            const rows: Array<DataTable.Row> = [];

            let rowReference: SortRowReference;
            for (let i = 0; i < rowCount; ++i) {
                rowReference = rowReferences[i];

                originalIndexes.push(
                    table.getOriginalRowIndex(rowReference.index)
                );
                rows.push(rowReference.row);
            }
            modified.setRows(rows, 0);
            modified.setOriginalRowIndexes(originalIndexes);
        }

        modifier.emit({ type: 'afterModify', detail: eventDetail, table });

        return table;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Additionally provided types for modifier events and options.
 */
namespace SortModifier {

}

/* *
 *
 *  Registry
 *
 * */

declare module './DataModifierType' {
    interface DataModifierTypes {
        Sort: typeof SortModifier;
    }
}

DataModifier.registerType('Sort', SortModifier);

/* *
 *
 *  Default Export
 *
 * */

export default SortModifier;
