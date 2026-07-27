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
    SummaryCellOptions,
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
     * Summary row objects computed for the current queried table.
     */
    private rowObjects: DataTableRowObject[] = [];


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
     * Returns the summary row objects computed for the current table.
     */
    public getRowObjects(): DataTableRowObject[] {
        return this.rowObjects;
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
            const cell = this.getCellsByColumnId(rowOptions[r]).get(columnId);
            if (defined(this.getCellAggregator(rowOptions[r], cell))) {
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
            this.rowObjects = [];
            return;
        }

        const columnIds = table.getColumnIds();
        const rowCount = table.getRowCount();
        const rowObjects: DataTableRowObject[] = [];

        for (let r = 0, rEnd = rowOptions.length; r < rEnd; ++r) {
            const summaryRow = this.buildSummaryRow(
                table,
                columnIds,
                rowCount,
                rowOptions[r],
                r
            );

            if (summaryRow) {
                rowObjects.push(summaryRow);
            }
        }

        this.rowObjects = rowObjects;
    }

    /**
     * Builds a single summary row object, or `null` when it aggregates nothing.
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
    ): DataTableRowObject | null {
        const summaryRow: DataTableRowObject = {};
        const summaryRowId = options.id ?? String(summaryRowIndex);
        const cells = this.getCellsByColumnId(options);
        let hasAggregate = false;

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const cell = cells.get(columnId);

            if (cell && cell.value !== void 0) {
                summaryRow[columnId] = cell.value;
                continue;
            }

            const aggregatorName = Aggregation.resolveAggregatorName(
                this.getCellAggregator(options, cell),
                {
                    columnId,
                    rowCount,
                    summaryRowId,
                    summaryRowIndex
                }
            );

            if (aggregatorName) {
                const values = Array.from(table.getColumn(columnId) || [])
                    .filter(defined);
                summaryRow[columnId] =
                    Aggregation.executeAggregate(aggregatorName, values);
                hasAggregate = true;
            } else {
                summaryRow[columnId] = null;
            }
        }

        return hasAggregate ? summaryRow : null;
    }

    /**
     * Resolves the effective aggregator option for a summary cell.
     *
     * @param options
     * Summary row options.
     *
     * @param cell
     * Cell options for the resolved column, when present.
     */
    private getCellAggregator(
        options: SummaryRowOptions,
        cell: SummaryCellOptions | undefined
    ): (SummaryAggregatorOption | undefined) {
        if (cell && cell.aggregator !== void 0) {
            return cell.aggregator;
        }

        // A static value suppresses the row default aggregator.
        if (cell && cell.value !== void 0) {
            return;
        }

        return options.aggregator;
    }

    /**
     * Indexes a summary row's cell options by column id.
     *
     * @param options
     * Summary row options.
     */
    private getCellsByColumnId(
        options: SummaryRowOptions
    ): Map<string, SummaryCellOptions> {
        const cellsByColumnId = new Map<string, SummaryCellOptions>();
        const cells = options.cells;

        if (cells) {
            for (let i = 0, iEnd = cells.length; i < iEnd; ++i) {
                cellsByColumnId.set(cells[i].columnId, cells[i]);
            }
        }

        return cellsByColumnId;
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
