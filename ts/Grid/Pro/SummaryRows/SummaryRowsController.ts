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
    DataProviderOptionsType
} from '../../Core/Data/DataProviderType';
import type {
    LocalDataProviderOptions
} from '../../Core/Data/LocalDataProvider';
import type { SummaryColumnOptions } from './SummaryRowsTypes';

import Aggregation from '../Aggregation/Aggregation.js';
import { defined } from '../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

/**
 * Runtime type guard for local data provider options.
 *
 * @param dataOptions
 * Data provider options to test.
 *
 * @return
 * `true` when options belong to the local data provider.
 */
function isLocalDataOptions(
    dataOptions?: DataProviderOptionsType
): dataOptions is LocalDataProviderOptions {
    return !!(
        dataOptions &&
        (
            typeof dataOptions.providerType === 'undefined' ||
            dataOptions.providerType === 'local'
        )
    );
}


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
     * Projected index of the summary row in the current presentation table,
     * before pagination. `undefined` when no summary row is injected.
     */
    private summaryRowIndex?: number;


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
     * Returns whether the summary row feature is enabled.
     */
    public get enabled(): boolean {
        return this.getDataOptions()?.summary?.enabled === true;
    }

    /**
     * Appends a summary row to the queried table when enabled.
     *
     * Aggregation runs over all rows of the queried table, after
     * filtering/sorting and before pagination.
     *
     * @param table
     * Queried table after filtering/sorting and before pagination.
     *
     * @return
     * Table including the summary row, or the input table when disabled.
     */
    public projectTable(table: DataTable): DataTable {
        this.summaryRowIndex = void 0;

        if (!this.enabled) {
            return table;
        }

        const columnIds = table.getColumnIds();
        const rowCount = table.getRowCount();
        const summaryRow: Record<string, DataTableCellType> = {};
        let hasAggregate = false;

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const options = this.getColumnSummaryOptions(columnId);
            const aggregatorName = options?.aggregator && (
                Aggregation.resolveAggregatorName(options.aggregator, {
                    columnId,
                    rowCount
                })
            );

            if (aggregatorName) {
                const values = Array.from(table.getColumn(columnId) || [])
                    .filter(defined);
                summaryRow[columnId] =
                    Aggregation.executeAggregate(aggregatorName, values);
                hasAggregate = true;
            } else if (defined(options?.label)) {
                summaryRow[columnId] = options.label;
            } else {
                summaryRow[columnId] = null;
            }
        }

        if (!hasAggregate) {
            return table;
        }

        const projectedTable = table.clone();
        projectedTable.setRows([summaryRow]);
        this.summaryRowIndex = rowCount;

        return projectedTable;
    }

    /**
     * Returns whether a rendered row is the injected summary row.
     *
     * @param row
     * Rendered viewport row.
     */
    public isSummaryRow(row: TableRow): boolean {
        return (
            defined(this.summaryRowIndex) &&
            this.getProjectedRowIndex(row) === this.summaryRowIndex
        );
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

    /**
     * Returns local data provider options when available.
     */
    private getDataOptions(): LocalDataProviderOptions | undefined {
        const dataOptions = this.grid.options?.data;

        if (!isLocalDataOptions(dataOptions)) {
            return;
        }

        return dataOptions;
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default SummaryRowsController;
