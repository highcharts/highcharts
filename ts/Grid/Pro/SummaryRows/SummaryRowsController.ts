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
     * Returns whether a source column participates in summary aggregation, so
     * editing it must recompute the totals.
     *
     * @param columnId
     * Source column id.
     */
    public hasColumnAggregator(columnId: string): boolean {
        if (!this.getSummaryRowOptions().length) {
            return false;
        }

        return !!this.getColumnSummaryOptions(columnId)?.aggregator;
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
                rowOptions[r].id ?? String(r),
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
    ): DataTableRowObject | null {
        const summaryRow: DataTableRowObject = {};
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
