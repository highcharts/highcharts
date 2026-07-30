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
    RowObject as DataTableRowObject
} from '../../../Data/DataTable';
import type Grid from '../../Core/Grid';
import type {
    SummaryAggregatorOption,
    SummaryColumnOptions,
    SummaryRenderRow,
    SummaryRowOptions
} from './SummaryRowsTypes';

import Aggregation from '../Aggregation/Aggregation.js';
import { defined } from '../../../Shared/Utilities.js';


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
     * Aggregation runs over all rows of the queried table, after
     * filtering/sorting and before pagination.
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
        const rowCount = table.getRowCount();
        const rows: SummaryRenderRow[] = [];

        for (let r = 0, rEnd = rowOptions.length; r < rEnd; ++r) {
            rows.push(this.buildSummaryRow(
                table,
                columnIds,
                rowCount,
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
     * @param table
     * Queried table the aggregation runs over.
     *
     * @param columnIds
     * Column ids of the queried table.
     *
     * @param rowCount
     * Number of data rows.
     *
     * @param options
     * Options of the summary row.
     *
     * @param summaryRowIndex
     * Zero-based index of the summary row.
     */
    private buildSummaryRow(
        table: DataTable,
        columnIds: string[],
        rowCount: number,
        options: SummaryRowOptions,
        summaryRowIndex: number
    ): SummaryRenderRow {
        const data: DataTableRowObject = {};
        const formats: Record<string, string> = {};
        const summaryRowId = options.id ?? String(summaryRowIndex);
        const columnsById = this.getColumnsById(options);

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const column = columnsById.get(columnId);

            if (column && column.format !== void 0) {
                formats[columnId] = column.format;
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
                    Array.from(table.getColumn(columnId) || []).filter(defined)
                ) :
                null;
        }

        return { data, formats, position: options.position ?? 'bottom' };
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
