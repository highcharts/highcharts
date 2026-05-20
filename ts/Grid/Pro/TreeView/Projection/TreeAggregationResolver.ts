/* *
 *
 *  Grid Tree Aggregation Resolver
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

import type DataTable from '../../../../Data/DataTable';
import type {
    CellType as DataTableCellType
} from '../../../../Data/DataTable';
import type { RowId } from '../../../Core/Data/DataProvider';
import type {
    TreeProjectionRowState,
    TreeProjectionState,
    TreeViewColumnAggregateOption
} from '../TreeViewTypes';
import type {
    Arguments as FormulaArguments
} from '../../../../Data/Formula/Formula';

import Formula from '../../../../Data/Formula/Formula.js';
import { defined } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

interface TreeAggregationResolverDependencies {
    getColumnAggregateOption: (
        sourceColumnId: string
    ) => (TreeViewColumnAggregateOption | undefined);
    resolveProjectedCellValue: (
        columnId: string,
        rowId: RowId,
        table: DataTable,
        projectionState: TreeProjectionState,
        idColumn: string | undefined
    ) => DataTableCellType;
}

/**
 * Narrows arbitrary processor results to DataTable-compatible cell values.
 *
 * @param value
 * Candidate processor result.
 */
function isDataTableCellValue(
    value: unknown
): value is DataTableCellType {
    return (
        value === null ||
        typeof value === 'undefined' ||
        typeof value === 'boolean' ||
        typeof value === 'number' ||
        typeof value === 'string'
    );
}


/* *
 *
 *  Class
 *
 * */

class TreeAggregationResolver {

    /* *
     *
     *  Properties
     *
     * */

    private readonly dependencies: TreeAggregationResolverDependencies;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(dependencies: TreeAggregationResolverDependencies) {
        this.dependencies = dependencies;
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns whether a source column participates in TreeView aggregation.
     *
     * @param columnId
     * Source column id.
     */
    public hasColumnAggregation(columnId: string): boolean {
        return !!this.dependencies.getColumnAggregateOption(columnId);
    }

    /**
     * Resolves projected values for a single aggregated column.
     *
     * Aggregation is evaluated on the projected tree after filtering/sorting,
     * but before pagination and independently of expand/collapse visibility.
     *
     * @param columnId
     * Aggregated source column id.
     *
     * @param table
     * Queried table after filtering/sorting and before pagination.
     *
     * @param projectionState
     * Current projected tree state.
     *
     * @param idColumn
     * Column containing stable row IDs, when configured.
     *
     * @param derivedCellColumnIdsByRowId
     * Mutable map collecting derived cells for the projected state.
     */
    public resolveColumnValues(
        columnId: string,
        table: DataTable,
        projectionState: TreeProjectionState,
        idColumn: string | undefined,
        derivedCellColumnIdsByRowId: Map<RowId, Set<string>>
    ): Map<RowId, DataTableCellType> {
        const resolvedValuesByRowId = new Map<RowId, DataTableCellType>();
        const resolvingRowIds = new Set<RowId>();

        const resolveValue = (rowId: RowId): DataTableCellType => {
            if (resolvedValuesByRowId.has(rowId)) {
                return resolvedValuesByRowId.get(rowId);
            }

            if (resolvingRowIds.has(rowId)) {
                return null;
            }

            resolvingRowIds.add(rowId);

            const rowState = projectionState.rowsById.get(rowId);
            const sourceValue = this.dependencies.resolveProjectedCellValue(
                columnId,
                rowId,
                table,
                projectionState,
                idColumn
            );

            let resolvedValue = sourceValue;

            if (rowState?.childrenIds.length) {
                const aggregateFunctionName = this.resolveAggregateFunctionName(
                    columnId,
                    rowState,
                    sourceValue
                );

                if (aggregateFunctionName) {
                    const childValues = rowState.childrenIds
                        .map(resolveValue)
                        .filter(defined);

                    resolvedValue = this.executeAggregateFunction(
                        aggregateFunctionName,
                        childValues
                    );

                    this.markDerivedCell(
                        derivedCellColumnIdsByRowId,
                        rowId,
                        columnId
                    );
                }
            }

            resolvingRowIds.delete(rowId);
            resolvedValuesByRowId.set(rowId, resolvedValue);

            return resolvedValue;
        };

        for (let i = 0, iEnd = projectionState.rowIds.length; i < iEnd; ++i) {
            const rowId = projectionState.rowIds[i];
            resolveValue(rowId);
        }

        return resolvedValuesByRowId;
    }

    /**
     * Marks a projected cell as derived from TreeView aggregation.
     *
     * @param derivedCellColumnIdsByRowId
     * Mutable map collecting derived cells for the projected state.
     *
     * @param rowId
     * Derived row id.
     *
     * @param columnId
     * Derived source column id.
     */
    private markDerivedCell(
        derivedCellColumnIdsByRowId: Map<RowId, Set<string>>,
        rowId: RowId,
        columnId: string
    ): void {
        let derivedColumns = derivedCellColumnIdsByRowId.get(rowId);

        if (!derivedColumns) {
            derivedColumns = new Set<string>();
            derivedCellColumnIdsByRowId.set(rowId, derivedColumns);
        }

        derivedColumns.add(columnId);
    }

    /**
     * Resolves aggregation function name for a row/column combination.
     *
     * @param columnId
     * Aggregated source column id.
     *
     * @param rowState
     * Projected row state for the current row.
     *
     * @param sourceValue
     * Source cell value before aggregation.
     */
    private resolveAggregateFunctionName(
        columnId: string,
        rowState: TreeProjectionRowState,
        sourceValue: DataTableCellType
    ): string | undefined {
        const aggregate = this.dependencies.getColumnAggregateOption(columnId);
        if (!aggregate || !rowState.childrenIds.length) {
            return;
        }

        const aggregateResult = (
            typeof aggregate === 'function' ?
                aggregate({
                    childCount: rowState.childrenIds.length,
                    childrenIds: rowState.childrenIds.slice(),
                    columnId,
                    depth: rowState.depth,
                    hasChildren: rowState.hasChildren,
                    rowId: rowState.id,
                    sourceValue
                }) :
                aggregate
        );

        if (typeof aggregateResult !== 'string') {
            return;
        }

        const normalizedName = aggregateResult.trim().toUpperCase();
        return normalizedName || void 0;
    }

    /**
     * Executes a registered Formula processor function on direct child values.
     *
     * @param functionName
     * Registered Formula processor function name.
     *
     * @param childValues
     * Direct child values after their own aggregation has been resolved.
     */
    private executeAggregateFunction(
        functionName: string,
        childValues: Array<Exclude<DataTableCellType, null | undefined>>
    ): DataTableCellType {
        const processor = Formula.processorFunctions[functionName];
        if (!processor) {
            return null;
        }

        try {
            const result = processor(
                childValues as unknown as FormulaArguments
            );
            return isDataTableCellValue(result) ?
                result :
                null;
        } catch {
            return null;
        }
    }

}


/* *
 *
 *  Default export
 *
 * */

export default TreeAggregationResolver;
