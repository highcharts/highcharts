/* *
 *
 *  Grid Column Aggregation Composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type {
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type { RowId } from '../../Core/Data/DataProvider';
import type TableCell from '../../Core/Table/Body/TableCell';
import type { AggregatorOption } from './AggregationTypes';

import Aggregation from './Aggregation.js';
import Column from '../../Core/Table/Column.js';
import Globals from '../../Core/Globals.js';
import { addEvent, defined, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

/**
 * Class name added to the header and body cells of an aggregating column, so
 * that summary columns can be styled without a manual `className`.
 */
const summaryColumnClassName = Globals.classNamePrefix + 'summary-column';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Context passed to a column aggregator callback, describing the row cell that
 * is being resolved.
 */
export interface ColumnAggregatorContext {

    /**
     * Ids of the columns the value is aggregated from, after the
     * `aggregatedColumns` option is resolved.
     */
    aggregatedColumnIds: string[];

    /**
     * Id of the aggregating column.
     */
    columnId: string;

    /**
     * Row id of the resolved cell, when the data provider exposes one.
     */
    rowId?: RowId;

    /**
     * Local index of the resolved cell's row in the presentation table.
     */
    rowIndex: number;
}

/**
 * Aggregator option accepted by an aggregating column.
 *
 * Set it to `false` to skip aggregation, leaving the column's own data in
 * place.
 */
export type ColumnAggregatorOption = AggregatorOption<ColumnAggregatorContext>;


/* *
 *
 *  Composition
 *
 * */

/**
 * Composes Grid Pro with per-row column aggregation, letting a column derive
 * its value from the other columns of the same row.
 *
 * @param ColumnClass
 * Column class to extend.
 */
export function compose(
    ColumnClass: typeof Column
): void {
    if (!pushUnique(Globals.composed, 'ColumnAggregation')) {
        return;
    }

    addEvent(ColumnClass, 'afterInit', onColumnAfterInit);
}

/**
 * Installs the aggregating value resolver and the summary column class on a
 * configured column.
 */
function onColumnAfterInit(this: Column): void {
    const grid = this.viewport.grid;
    const options = grid.columnPolicy.getIndividualColumnOptions(this.id);

    if (!options?.columnAggregator) {
        delete this.valueResolver;
        return;
    }

    this.valueResolver = resolveAggregatedValue;
    pushUnique(this.classNames, summaryColumnClassName);

    // An aggregating column has no source data to infer the type from, while
    // every Formula processor function resolves to a number.
    if (!options.dataType && !grid.options?.columnDefaults?.dataType) {
        this.dataType = 'number';
    }
}

/**
 * Aggregates the row values of the source columns into the cell value. Returns
 * nothing when no aggregation applies, which leaves the column's own data in
 * place.
 *
 * @param cell
 * Cell to resolve the value for.
 */
function resolveAggregatedValue(
    this: TableCell,
    cell: TableCell
): DataTableCellType {
    const column = cell.column;
    const options = column.viewport.grid.columnPolicy
        .getIndividualColumnOptions(column.id);
    const aggregatedColumnIds = resolveAggregatedColumnIds(
        column,
        options?.aggregatedColumns
    );

    const functionName = Aggregation.resolveAggregatorName(
        options?.columnAggregator,
        {
            aggregatedColumnIds,
            columnId: column.id,
            rowId: cell.row.id,
            rowIndex: cell.row.index
        }
    );

    if (!functionName) {
        return;
    }

    return Aggregation.executeAggregate(
        functionName,
        getRowValues(cell, aggregatedColumnIds)
    );
}

/**
 * Resolves the columns an aggregating column reads. Without an explicit
 * `aggregatedColumns` list, every other numeric column of the table is
 * aggregated, skipping columns that are derived themselves.
 *
 * @param column
 * Aggregating column.
 *
 * @param configured
 * Explicitly configured source column ids.
 */
function resolveAggregatedColumnIds(
    column: Column,
    configured?: string[]
): string[] {
    if (configured) {
        return configured;
    }

    const columns = column.viewport.columns;
    const columnIds: string[] = [];

    for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
        const candidate = columns[i];

        if (
            candidate !== column &&
            candidate.dataType === 'number' &&
            !candidate.isDerived()
        ) {
            columnIds.push(candidate.id);
        }
    }

    return columnIds;
}

/**
 * Collects the aggregable row values of the source columns.
 *
 * @param cell
 * Cell being resolved, holding the row data.
 *
 * @param columnIds
 * Resolved source column ids.
 */
function getRowValues(
    cell: TableCell,
    columnIds: string[]
): Array<Exclude<DataTableCellType, null | undefined>> {
    const columnPolicy = cell.column.viewport.grid.columnPolicy;
    const data = cell.row.data;
    const values: Array<Exclude<DataTableCellType, null | undefined>> = [];

    for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
        const columnId = columnIds[i];
        const sourceColumnId = columnPolicy.getColumnSourceId(columnId);
        const value = (
            sourceColumnId && sourceColumnId in data ?
                data[sourceColumnId] :
                data[columnId]
        ) as DataTableCellType;

        if (defined(value)) {
            values.push(value);
        }
    }

    return values;
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface IndividualColumnOptions {
        /**
         * Aggregator deriving the column value from the other columns of the
         * same row, for example a `Total` column summing quarterly columns.
         *
         * When provided as a string, that Formula processor function is applied
         * to every row of the column. When provided as a callback, it is
         * invoked per row and should return a registered function name, or a
         * falsy value to skip aggregation and leave the column's own data in
         * place.
         *
         * The aggregated cells are derived, so they are not editable when the
         * column is unbound (an `id` that no source column provides, or
         * `dataId: null`). Without an explicit `dataType`, the column is
         * assumed numeric. Its header and body cells always carry the
         * `hcg-summary-column` class, so no `className` is needed to style
         * them. Aggregating the rows of one column instead is what
         * `rowAggregator` and `summaryRows` do.
         *
         * @sample grid-pro/options/summary-columns Summary columns
         */
        columnAggregator?: ColumnAggregatorOption;

        /**
         * Ids of the columns that `columnAggregator` reads, ordered as they
         * should be passed to the aggregation function.
         *
         * When omitted, every other numeric column of the table is aggregated,
         * skipping columns that are derived themselves. List the columns
         * explicitly whenever the table holds numeric columns that must stay
         * out of the result, for example an id or a year.
         *
         * @sample grid-pro/options/summary-columns Summary columns
         */
        aggregatedColumns?: string[];
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
