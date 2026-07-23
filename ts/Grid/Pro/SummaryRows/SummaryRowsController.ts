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
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type Grid from '../../Core/Grid';
import type Table from '../../Core/Table/Table';
import type TableRow from '../../Core/Table/Body/TableRow';
import type {
    SummaryColumnAggregatorContext,
    SummaryColumnLabel,
    SummaryColumnOptions,
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
 * Computes and injects a flat summary (total) row into the presentation table.
 */
class SummaryRowsController {

    /* *
     *
     *  Properties
     *
     * */

    private readonly grid: Grid;

    /**
     * Projected indices of the injected summary rows in the current
     * presentation table, before pagination. Empty when none are injected.
     */
    private summaryRowIndices = new Set<number>();


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
     * Appends the configured summary rows to the queried table when enabled.
     *
     * Aggregation runs over all rows of the queried table, after
     * filtering/sorting and before pagination.
     *
     * @param table
     * Queried table after filtering/sorting and before pagination.
     *
     * @return
     * Table including the summary rows, or the input table when disabled.
     */
    public projectTable(table: DataTable): DataTable {
        this.summaryRowIndices.clear();

        const rowOptions = this.getSummaryRowOptions();
        if (!rowOptions.length) {
            return table;
        }

        const columnIds = table.getColumnIds();
        const rowCount = table.getRowCount();
        const summaryRows: Array<Record<string, DataTableCellType>> = [];

        for (let r = 0, rEnd = rowOptions.length; r < rEnd; ++r) {
            const summaryRow = this.buildSummaryRow(
                table,
                columnIds,
                rowCount,
                rowOptions[r].id ?? String(r),
                r
            );

            if (summaryRow) {
                summaryRows.push(summaryRow);
            }
        }

        if (!summaryRows.length) {
            return table;
        }

        const projectedTable = table.clone();
        projectedTable.setRows(summaryRows);

        for (let i = 0; i < summaryRows.length; ++i) {
            this.summaryRowIndices.add(rowCount + i);
        }

        return projectedTable;
    }

    /**
     * Builds a single summary row, or `null` when it aggregates nothing.
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
     * @param summaryRowId
     * Stable id of the summary row.
     *
     * @param summaryRowIndex
     * Zero-based index of the summary row.
     */
    private buildSummaryRow(
        table: DataTable,
        columnIds: string[],
        rowCount: number,
        summaryRowId: string,
        summaryRowIndex: number
    ): Record<string, DataTableCellType> | null {
        const summaryRow: Record<string, DataTableCellType> = {};
        let hasAggregate = false;

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const options = this.getColumnSummaryOptions(columnId);
            const context: SummaryColumnAggregatorContext = {
                columnId,
                rowCount,
                summaryRowId,
                summaryRowIndex
            };
            const aggregatorName = options?.aggregator && (
                Aggregation.resolveAggregatorName(options.aggregator, context)
            );

            if (aggregatorName) {
                const values = Array.from(table.getColumn(columnId) || [])
                    .filter(defined);
                summaryRow[columnId] =
                    Aggregation.executeAggregate(aggregatorName, values);
                hasAggregate = true;
            } else {
                summaryRow[columnId] =
                    this.resolveLabel(options?.label, context) ?? null;
            }
        }

        return hasAggregate ? summaryRow : null;
    }

    /**
     * Returns whether a rendered row is one of the injected summary rows.
     *
     * @param row
     * Rendered viewport row.
     */
    public isSummaryRow(row: TableRow): boolean {
        return (
            this.summaryRowIndices.size > 0 &&
            this.summaryRowIndices.has(this.getProjectedRowIndex(row))
        );
    }

    /**
     * Resolves a summary cell label from its option.
     *
     * @param label
     * Configured label option.
     *
     * @param context
     * Summary row context.
     */
    private resolveLabel(
        label: SummaryColumnLabel | undefined,
        context: SummaryColumnAggregatorContext
    ): string | null | undefined {
        return typeof label === 'function' ? label(context) : label;
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

    /**
     * Resolves the pre-pagination projected index of a rendered row.
     *
     * @param row
     * Rendered viewport row.
     */
    private getProjectedRowIndex(row: TableRow): number {
        const table = row.viewport;

        return table.rows.indexOf(row) > -1 ?
            row.index + this.getPaginationOffset(table) :
            row.index;
    }

    /**
     * Returns the number of rows skipped before the current page.
     *
     * @param table
     * Table instance hosting the rendered rows.
     */
    private getPaginationOffset(table: Table): number {
        const pagination = table.grid.querying.pagination;

        return pagination.enabled ?
            Math.max(0, pagination.currentPage - 1) *
                pagination.currentPageSize :
            0;
    }

    /**
     * Resolves the summary options for a source column id.
     *
     * @param columnId
     * Source column id.
     */
    private getColumnSummaryOptions(
        columnId: string
    ): SummaryColumnOptions | undefined {
        const columnPolicy = this.grid.columnPolicy;
        const defaultOptions = this.grid.options?.columnDefaults?.summary;
        const directOptions = columnPolicy
            .getIndividualColumnOptions(columnId)
            ?.summary;

        if (directOptions || defaultOptions) {
            return {
                ...defaultOptions,
                ...directOptions
            };
        }

        return;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryRowsController;
