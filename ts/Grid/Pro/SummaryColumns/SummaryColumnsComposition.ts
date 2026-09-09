/* *
 *
 *  Grid Summary Columns Composition
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

import type DataModifier from '../../../Data/Modifiers/DataModifier';
import type DataTable from '../../../Data/DataTable';
import type {
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type { RowId } from '../../Core/Data/DataProvider';
import type Grid from '../../Core/Grid';
import type { GridRefreshSourceColumnIdsEvent } from '../../Core/Grid';
import type { NoIdColumnOptions } from '../../Core/Table/Column';
import type TableCell from '../../Core/Table/Body/TableCell';
import type {
    TableCellGetEditabilityEvent
} from '../../Core/Table/Body/TableCell';
import type { IndividualColumnOptions } from '../../Core/Options';
import type { SummaryColumnSpec } from './SummaryColumnsModifier';
import type { AggregatorOption } from '../Aggregation/AggregationTypes';

import Aggregation from '../Aggregation/Aggregation.js';
import Column from '../../Core/Table/Column.js';
import SummaryColumnsModifier from './SummaryColumnsModifier.js';
import Globals from '../../Core/Globals.js';
import { hasDataTableProvider } from '../../Core/Data/DataProvider.js';
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

/**
 * Grids already told that `materialize` needs a local data provider.
 */
const warnedGrids = new WeakSet<Grid>();


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
     * Row id of the resolved cell, when the data provider exposes one. With
     * `materialize`, it is only resolved from `data.idColumn`.
     */
    rowId?: RowId;

    /**
     * Index of the resolved row. It addresses the presentation table, or the
     * source table with `materialize`, which runs before sorting and filtering.
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
 * @param GridClass
 * Grid class to extend.
 *
 * @param ColumnClass
 * Column class to extend.
 *
 * @param TableCellClass
 * TableCell class to extend.
 */
export function compose(
    GridClass: typeof Grid,
    ColumnClass: typeof Column,
    TableCellClass: typeof TableCell
): void {
    if (!pushUnique(Globals.composed, 'SummaryColumns')) {
        return;
    }

    addEvent(ColumnClass, 'afterInit', onColumnAfterInit);
    addEvent(GridClass, 'refreshSourceColumnIds', onGridRefreshSourceColumnIds);
    addEvent(GridClass, 'getGroupedModifiers', onGridGetGroupedModifiers);
    addEvent(TableCellClass, 'getEditability', onCellGetEditability);
}

/**
 * Installs the summary column class, and the value resolver unless the column
 * is materialized (then its values come from the queried table).
 */
function onColumnAfterInit(this: Column): void {
    const grid = this.viewport.grid;
    const options = grid.columnPolicy.getIndividualColumnOptions(this.id);

    if (!options?.columnAggregator) {
        delete this.valueResolver;
        return;
    }

    pushUnique(this.classNames, summaryColumnClassName);

    if (!isMaterialized(grid, this.id)) {
        this.valueResolver = resolveAggregatedValue;
    }

    // An aggregating column has no source data to infer the type from, while
    // every Formula processor function resolves to a number.
    if (!options.dataType && !grid.options?.columnDefaults?.dataType) {
        this.dataType = 'number';
    }
}

/**
 * Declares the materialized columns as source columns, so that they count as
 * bound and unlock sorting, filtering and exporting.
 *
 * @param e
 * Source column ids resolved from the data provider.
 */
function onGridRefreshSourceColumnIds(
    this: Grid,
    e: GridRefreshSourceColumnIdsEvent
): void {
    const columns = getMaterializedColumns(this);

    for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
        const columnId = columns[i].id;

        if (e.columnIds.indexOf(columnId) === -1) {
            e.columnIds.push(columnId);
        }
    }
}

/**
 * Contributes the modifier materializing the aggregating columns, ahead of the
 * sorting and filtering ones.
 *
 * @param e
 * Modifiers collected for the current query.
 *
 * @param e.modifiers
 * List to contribute to.
 */
function onGridGetGroupedModifiers(
    this: Grid,
    e: { modifiers: DataModifier[] }
): void {
    const grid = this;
    const columns = getMaterializedColumns(grid);
    if (!columns.length) {
        return;
    }

    const specs: SummaryColumnSpec[] = [];

    for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
        const options = columns[i];

        specs.push({
            columnId: options.id,
            resolve: (
                table: DataTable,
                rowIndex: number
            ): DataTableCellType => {
                const aggregatedColumnIds = resolveTableColumnIds(
                    grid,
                    table,
                    options
                );

                return aggregate(
                    options.id,
                    options,
                    aggregatedColumnIds,
                    collectTableValues(
                        grid,
                        table,
                        aggregatedColumnIds,
                        rowIndex
                    ),
                    resolveSourceRowId(grid, table, rowIndex),
                    rowIndex
                );
            }
        });
    }

    e.modifiers.push(new SummaryColumnsModifier(specs));
}

/**
 * Keeps the derived cells of an aggregating column read-only, also when the
 * column is materialized and therefore no longer unbound.
 *
 * @param e
 * Editability event payload.
 */
function onCellGetEditability(
    this: TableCell,
    e: TableCellGetEditabilityEvent
): void {
    const column = this.column;
    const options = column.viewport.grid.columnPolicy
        .getIndividualColumnOptions(column.id);

    if (options?.columnAggregator) {
        e.editable = false;
    }
}


/* *
 *
 *  Functions
 *
 * */

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
    if (!options) {
        return;
    }

    const aggregatedColumnIds = resolveColumnIds(column, options);

    return aggregate(
        column.id,
        options,
        aggregatedColumnIds,
        collectRowValues(cell, aggregatedColumnIds),
        cell.row.id,
        cell.row.index
    );
}

/**
 * Runs the resolved aggregator over the collected values of one row.
 *
 * @param columnId
 * Id of the aggregating column.
 *
 * @param options
 * Options of the aggregating column.
 *
 * @param aggregatedColumnIds
 * Resolved source column ids.
 *
 * @param values
 * Aggregable row values.
 *
 * @param rowId
 * Row id, when resolved.
 *
 * @param rowIndex
 * Index of the resolved row.
 */
function aggregate(
    columnId: string,
    options: NoIdColumnOptions,
    aggregatedColumnIds: string[],
    values: Array<Exclude<DataTableCellType, null | undefined>>,
    rowId: (RowId | undefined),
    rowIndex: number
): DataTableCellType {
    const functionName = Aggregation.resolveAggregatorName(
        options.columnAggregator,
        {
            aggregatedColumnIds,
            columnId,
            rowId,
            rowIndex
        }
    );

    if (!functionName) {
        return;
    }

    return Aggregation.executeAggregate(functionName, values);
}

/**
 * Resolves the columns an aggregating column reads. Without an explicit
 * `aggregatedColumns` list, every other numeric column of the table is
 * aggregated, skipping columns that are derived themselves.
 *
 * @param column
 * Aggregating column.
 *
 * @param options
 * Options of the aggregating column.
 */
function resolveColumnIds(
    column: Column,
    options: NoIdColumnOptions
): string[] {
    if (options.aggregatedColumns) {
        return options.aggregatedColumns;
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
 * Resolves the source columns of a materialized column. The rendered columns do
 * not exist yet when the query runs, so the implicit set is resolved from the
 * table: every numeric column that no aggregating column produces.
 *
 * @param grid
 * Grid the columns belong to.
 *
 * @param table
 * Table the query runs on.
 *
 * @param options
 * Options of the aggregating column.
 */
function resolveTableColumnIds(
    grid: Grid,
    table: DataTable,
    options: NoIdColumnOptions
): string[] {
    if (options.aggregatedColumns) {
        return options.aggregatedColumns;
    }

    const aggregating = getAggregatingColumns(grid)
        .map((column): (string | undefined) => column.id);
    const columnIds: string[] = [];
    const candidates = table.getColumnIds();

    for (let i = 0, iEnd = candidates.length; i < iEnd; ++i) {
        const columnId = candidates[i];

        if (
            aggregating.indexOf(columnId) === -1 &&
            typeof firstDefinedValue(table, columnId) === 'number'
        ) {
            columnIds.push(columnId);
        }
    }

    return columnIds;
}

/**
 * Collects the aggregable row values of the source columns from a rendered row.
 *
 * @param cell
 * Cell being resolved, holding the row data.
 *
 * @param columnIds
 * Resolved source column ids.
 */
function collectRowValues(
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

/**
 * Collects the aggregable row values of the source columns from the table.
 *
 * @param grid
 * Grid the columns belong to.
 *
 * @param table
 * Table the query runs on.
 *
 * @param columnIds
 * Resolved source column ids.
 *
 * @param rowIndex
 * Row of the table being resolved.
 */
function collectTableValues(
    grid: Grid,
    table: DataTable,
    columnIds: string[],
    rowIndex: number
): Array<Exclude<DataTableCellType, null | undefined>> {
    const columnPolicy = grid.columnPolicy;
    const values: Array<Exclude<DataTableCellType, null | undefined>> = [];

    for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
        const columnId = columnIds[i];
        const value = table.getCell(
            columnPolicy.getColumnSourceId(columnId) || columnId,
            rowIndex
        );

        if (defined(value)) {
            values.push(value);
        }
    }

    return values;
}

/**
 * Resolves the row id of a source table row, which is only known when
 * `data.idColumn` is configured.
 *
 * @param grid
 * Grid the table belongs to.
 *
 * @param table
 * Table the query runs on.
 *
 * @param rowIndex
 * Row of the table being resolved.
 */
function resolveSourceRowId(
    grid: Grid,
    table: DataTable,
    rowIndex: number
): (RowId | undefined) {
    const idColumn = grid.options?.data?.idColumn;
    if (!idColumn) {
        return;
    }

    const value = table.getCell(idColumn, rowIndex);

    return typeof value === 'number' || typeof value === 'string' ?
        value :
        void 0;
}

/**
 * First value a table column holds, used to probe the column type.
 *
 * @param table
 * Table to read.
 *
 * @param columnId
 * Column to probe.
 */
function firstDefinedValue(
    table: DataTable,
    columnId: string
): DataTableCellType {
    const column = table.getColumn(columnId);
    if (!column) {
        return;
    }

    for (let i = 0, iEnd = column.length; i < iEnd; ++i) {
        if (defined(column[i])) {
            return column[i] as DataTableCellType;
        }
    }

    return;
}

/**
 * Enabled columns of the grid that aggregate the other columns of their row.
 *
 * They are read from the user options, because the query runs before the
 * rendered columns exist.
 *
 * @param grid
 * Grid to read the options of.
 */
function getAggregatingColumns(grid: Grid): IndividualColumnOptions[] {
    const columns = grid.options?.columns;
    if (!columns) {
        return [];
    }

    return columns.filter((column): boolean => !!(
        column.columnAggregator &&
        column.enabled !== false
    ));
}

/**
 * Aggregating columns that materialize into the queried table. Materialization
 * needs a local data provider, because sorting and filtering of a remote
 * provider run on the server, which does not know the column.
 *
 * @param grid
 * Grid to read the options of.
 */
function getMaterializedColumns(grid: Grid): IndividualColumnOptions[] {
    const columns = getAggregatingColumns(grid)
        .filter((column): boolean => column.materialize === true);

    if (!columns.length || hasDataTableProvider(grid.dataProvider)) {
        return columns;
    }

    if (!warnedGrids.has(grid)) {
        warnedGrids.add(grid);

        // eslint-disable-next-line no-console
        console.warn(
            'Summary columns: `materialize` requires a local data ' +
            'provider. The columns are resolved per rendered cell instead, ' +
            'and stay out of sorting, filtering and exports.'
        );
    }

    return [];
}

/**
 * Whether an aggregating column materializes into the queried table.
 *
 * @param grid
 * Grid to read the options of.
 *
 * @param columnId
 * Id of the aggregating column.
 */
function isMaterialized(grid: Grid, columnId: string): boolean {
    return getMaterializedColumns(grid)
        .some((column): boolean => column.id === columnId);
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
         * The aggregated cells are derived, so they are never editable. Without
         * an explicit `dataType`, the column is assumed numeric. Its header and
         * body cells always carry the `hcg-summary-column` class, so no
         * `className` is needed to style them. By default the values are
         * resolved per rendered cell and therefore stay out of sorting,
         * filtering and exports - set `materialize` to change that.
         * Aggregating the rows of one column instead is what `rowAggregator`
         * and `summaryRows` do.
         *
         * @sample grid-pro/options/summary-columns Summary columns
         * @sample grid-pro/basic/summary-rows-and-columns
         *         Aggregated in both directions
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

        /**
         * Whether the `columnAggregator` result is written into the queried
         * table, which makes the column sortable, filterable and exportable
         * like a regular data column. The cells stay read-only.
         *
         * It costs a pass over every row on each query, instead of resolving
         * only the rendered cells, and it turns a cell edit into a requery. It
         * requires a local data provider: sorting and filtering of a remote
         * provider run on the server, which does not know the column.
         *
         * Materialization runs before sorting and filtering, so the aggregator
         * callback receives source table row indexes, and `rowId` only when
         * `data.idColumn` is set. Under TreeView or row grouping the column
         * behaves like any other data column: add `rowAggregator` to it for
         * parent rows to aggregate it.
         *
         * @sample grid-pro/options/summary-columns Summary columns
         *
         * @default false
         */
        materialize?: boolean;
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
