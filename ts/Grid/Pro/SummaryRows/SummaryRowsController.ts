/* *
 *
 *  Grid Summary Rows Controller
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

import type DataTable from '../../../Data/DataTable';
import type {
    CellType as DataTableCellType,
    RowObject as DataTableRowObject
} from '../../../Data/DataTable';
import type Grid from '../../Core/Grid';
import type { StyleValue } from '../../Core/GridUtils';
import type SummaryTableCell from './SummaryTableCell';
import type {
    SummaryAggregatorOption,
    SummaryColumnOptions,
    SummaryRenderRow,
    SummaryRowOptions,
    SummaryRowScope
} from './SummaryRowsTypes';

import Aggregation from '../Aggregation/Aggregation.js';
import { hasDataTableProvider } from '../../Core/Data/DataProvider.js';
import { defined } from '../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Rows a summary row aggregates, resolved from its `scope`.
 */
interface SummaryScopedSource {

    /**
     * Table holding the rows.
     */
    table: DataTable;

    /**
     * Row range within the table, when the scope selects a part of it.
     */
    range?: [number, number];
}


/* *
 *
 *  Class
 *
 * */

/**
 * Computes the flat summary (total) row objects for the current table. The
 * objects are rendered in a dedicated frozen section by `SummaryView`.
 */
class SummaryRowsController {

    /* *
     *
     *  Properties
     *
     * */

    private readonly grid: Grid;

    /**
     * Summary rows computed for the current queried table (values + formats).
     */
    private rows: SummaryRenderRow[] = [];

    /**
     * Whether an unsupported scope was already reported.
     */
    private warnedScope: boolean = false;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid) {
        this.grid = grid;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns the resolved summary rows (values + per-cell formats).
     */
    public getRows(): SummaryRenderRow[] {
        return this.rows;
    }

    /**
     * Returns the computed summary row value objects.
     */
    public getRowObjects(): DataTableRowObject[] {
        return this.rows.map((row): DataTableRowObject => row.data);
    }

    /**
     * Returns whether a source column is aggregated by any summary row, so
     * editing it must recompute the totals.
     *
     * @param columnId
     * Source column id.
     */
    public hasColumnAggregator(columnId: string): boolean {
        const rowOptions = this.getSummaryRowOptions();

        for (let r = 0, rEnd = rowOptions.length; r < rEnd; ++r) {
            const column = this.getColumnsById(rowOptions[r]).get(columnId);
            if (defined(this.getColumnAggregator(rowOptions[r], column))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Recomputes the summary row objects from the queried table.
     *
     * Each row aggregates the pipeline stage its `scope` selects, defaulting to
     * the queried table, after filtering/sorting and before pagination.
     *
     * @param table
     * Queried table after filtering/sorting and before pagination.
     */
    public updateFromTable(table: DataTable): void {
        const rowOptions = this.getSummaryRowOptions();
        if (!rowOptions.length) {
            this.rows = [];
            return;
        }

        const columnIds = table.getColumnIds();
        const rows: SummaryRenderRow[] = [];

        for (let r = 0, rEnd = rowOptions.length; r < rEnd; ++r) {
            rows.push(this.buildSummaryRow(
                this.getScopedSource(table, rowOptions[r].scope),
                columnIds,
                rowOptions[r],
                r
            ));
        }

        this.rows = rows;
    }

    /**
     * Builds a single summary row object. Columns that neither aggregate nor
     * carry a static value render empty.
     *
     * @param source
     * Rows the aggregation runs over, resolved from the row `scope`.
     *
     * @param columnIds
     * Column ids of the queried table.
     *
     * @param options
     * Options of the summary row.
     *
     * @param summaryRowIndex
     * Zero-based index of the summary row.
     */
    private buildSummaryRow(
        source: SummaryScopedSource,
        columnIds: string[],
        options: SummaryRowOptions,
        summaryRowIndex: number
    ): SummaryRenderRow {
        const rowCount = this.getScopedRowCount(source);
        const data: DataTableRowObject = {};
        const formats: Record<string, string> = {};
        const classNames: Record<string, string> = {};
        const styles: Record<string, StyleValue<SummaryTableCell>> = {};
        const summaryRowId = options.id ?? String(summaryRowIndex);
        const columnsById = this.getColumnsById(options);

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const column = columnsById.get(columnId);

            const format = column?.format ?? options.format;
            if (format !== void 0) {
                formats[columnId] = format;
            }

            if (column?.className !== void 0) {
                classNames[columnId] = column.className;
            }

            if (column?.style !== void 0) {
                styles[columnId] = column.style;
            }

            if (column && column.value !== void 0) {
                data[columnId] = column.value;
                continue;
            }

            const aggregatorName = Aggregation.resolveAggregatorName(
                this.getColumnAggregator(options, column),
                {
                    columnId,
                    rowCount,
                    summaryRowId,
                    summaryRowIndex
                }
            );

            data[columnId] = aggregatorName ?
                Aggregation.executeAggregate(
                    aggregatorName,
                    this.getAggregableValues(source, columnId)
                ) :
                null;
        }

        return {
            data,
            formats,
            classNames,
            styles,
            className: options.className,
            style: options.style,
            position: options.position ?? 'bottom'
        };
    }

    /**
     * Resolves the rows a `scope` selects, falling back to the queried table.
     *
     * @param table
     * Queried table, after filtering/sorting and before pagination.
     *
     * @param scope
     * Pipeline stage to aggregate.
     */
    private getScopedSource(
        table: DataTable,
        scope?: SummaryRowScope
    ): SummaryScopedSource {
        if (scope === 'all') {
            const dataProvider = this.grid.dataProvider;
            const sourceTable = hasDataTableProvider(dataProvider) ?
                dataProvider.getDataTable() :
                void 0;

            if (!sourceTable) {
                this.warnScope(
                    '`scope: \'all\'` requires a local data provider'
                );

                return { table };
            }

            return { table: sourceTable };
        }

        if (scope === 'page') {
            return { table, range: this.getPageRange() };
        }

        return { table };
    }

    /**
     * Resolves the row range of the current page within the queried table, or
     * nothing when the page scope does not apply.
     *
     * The queried table is the one the pagination modifier slices, so the page
     * is a plain range of it. A projecting feature (TreeView, row grouping)
     * replaces that table with the projected rows before pagination, and the
     * range then addresses rows the aggregation never sees.
     */
    private getPageRange(): ([number, number] | undefined) {
        const grid = this.grid;
        const pagination = grid.querying.pagination;

        // Resolved from the options, not from the projection state, which this
        // handler runs before.
        if (!pagination.enabled || grid.treeView?.isEnabled()) {
            this.warnScope(
                '`scope: \'page\'` requires pagination and is not supported ' +
                'with TreeView or row grouping'
            );

            return;
        }

        const pageSize = pagination.currentPageSize;
        const offset = Math.max(0, pagination.currentPage - 1) * pageSize;

        return [offset, offset + pageSize];
    }

    /**
     * Number of rows the scoped source holds, surfaced in the aggregator
     * context so that it matches the aggregated values.
     *
     * @param source
     * Resolved scoped source.
     */
    private getScopedRowCount(source: SummaryScopedSource): number {
        const rowCount = source.table.getRowCount();
        const range = source.range;

        return range ?
            Math.max(0, Math.min(range[1], rowCount) - range[0]) :
            rowCount;
    }

    /**
     * Collects the values a column contributes to the totals.
     *
     * @param source
     * Resolved scoped source.
     *
     * @param columnId
     * Aggregated column id.
     */
    private getAggregableValues(
        source: SummaryScopedSource,
        columnId: string
    ): Array<Exclude<DataTableCellType, null | undefined>> {
        const column = source.table.getColumn(columnId) || [];
        const range = source.range;

        return Array.from(
            range ?
                column.slice(range[0], range[1]) :
                column
        ).filter(defined);
    }

    /**
     * Reports an unsupported scope once, so that a per-query recompute does not
     * repeat it.
     *
     * @param reason
     * What is unsupported.
     */
    private warnScope(reason: string): void {
        if (this.warnedScope) {
            return;
        }

        this.warnedScope = true;

        // eslint-disable-next-line no-console
        console.warn(
            `Summary rows: ${reason}. The row aggregates the filtered rows ` +
            'instead.'
        );
    }

    /**
     * Resolves the effective aggregator option for a summary column.
     *
     * @param options
     * Summary row options.
     *
     * @param column
     * Column options for the resolved column, when present.
     */
    private getColumnAggregator(
        options: SummaryRowOptions,
        column: SummaryColumnOptions | undefined
    ): (SummaryAggregatorOption | undefined) {
        if (column && column.aggregator !== void 0) {
            return column.aggregator;
        }

        // A static value suppresses the row default aggregator.
        if (column && column.value !== void 0) {
            return;
        }

        return options.aggregator;
    }

    /**
     * Indexes a summary row's column options by column id.
     *
     * @param options
     * Summary row options.
     */
    private getColumnsById(
        options: SummaryRowOptions
    ): Map<string, SummaryColumnOptions> {
        const columnsById = new Map<string, SummaryColumnOptions>();
        const columns = options.columns;

        if (columns) {
            for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
                columnsById.set(columns[i].id, columns[i]);
            }
        }

        return columnsById;
    }

    /**
     * Returns the enabled summary rows, normalizing the object-or-array option.
     */
    private getSummaryRowOptions(): SummaryRowOptions[] {
        const summary = this.grid.options?.summaryRows;
        if (!summary) {
            return [];
        }

        return (Array.isArray(summary) ? summary : [summary])
            .filter((row): boolean => row.enabled !== false);
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryRowsController;
