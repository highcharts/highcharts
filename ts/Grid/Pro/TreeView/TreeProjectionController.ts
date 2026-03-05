/* *
 *
 *  Grid Tree Projection Controller
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
    ColumnCollection
} from '../../../Data/DataTable';
import type Grid from '../../Core/Grid';
import type { RowId } from '../../Core/Data/DataProvider';
import type { LocalDataProviderOptions } from '../../Core/Data/LocalDataProvider';
import type {
    TreeIndexBuildResult,
    TreeInputParentIdOptions,
    TreeProjectionRowState,
    TreeProjectionState
} from './TreeViewTypes';

import { buildIndexFromColumns } from './InputAdapters/ParentIdTreeInputAdapter.js';
import { isNumber, isString } from '../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

type DataOptionsWithTreeView = LocalDataProviderOptions;

interface NormalizedTreeViewOptions {
    enabled: true;
    input: TreeInputParentIdOptions;
    treeColumn?: string;
    initiallyExpanded: boolean;
    expandedRowIds: RowId[];
}


/* *
 *
 *  Class
 *
 * */

/**
 * Infrastructure controller for TreeView projection state.
 *
 * Validates tree input options, builds a canonical relation index and projects
 * queried tables into tree order before pagination.
 */
class TreeProjectionController {

    /* *
     *
     *  Properties
     *
     * */

    private readonly grid: Grid;

    private normalizedOptions?: NormalizedTreeViewOptions;

    private indexCache?: TreeIndexBuildResult;

    private projectionStateCache?: TreeProjectionState;

    private expandedRowIdsState?: Set<RowId>;

    private expansionStateSeedKey?: string;

    private cacheSource?: {
        table: DataTable;
        versionTag: string;
        idColumn: string;
        parentIdColumn: string;
    };


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
     * Synchronizes internal state from current Grid options and provider.
     */
    public sync(): void {
        const normalizedOptions = this.normalizeOptions();
        this.normalizedOptions = normalizedOptions;

        if (!normalizedOptions) {
            this.clearCache();
            return;
        }

        const dataProvider = this.grid.dataProvider;
        if (!TreeProjectionController.hasGetDataTable(dataProvider)) {
            // Remote provider runtime support is intentionally deferred.
            this.clearCache();
            return;
        }

        const table = dataProvider.getDataTable(false);
        if (!table) {
            this.clearCache();
            return;
        }
        const versionTag = table.getVersionTag();

        const dataOptions = this.getDataOptions();
        const idColumn = dataOptions?.idColumn;
        if (!idColumn) {
            throw new Error(
                'TreeView: `data.idColumn` is required for `parentId` input.'
            );
        }

        const parentIdColumn = normalizedOptions.input.parentIdColumn;

        this.syncExpandedRowIdsState(normalizedOptions, this.indexCache);

        if (
            this.cacheSource?.table === table &&
            this.cacheSource.versionTag === versionTag &&
            this.cacheSource.idColumn === idColumn &&
            this.cacheSource.parentIdColumn === parentIdColumn
        ) {
            return;
        }

        this.indexCache = buildIndexFromColumns(
            table.columns,
            idColumn,
            parentIdColumn
        );
        this.syncExpandedRowIdsState(normalizedOptions, this.indexCache);

        this.cacheSource = {
            table,
            versionTag,
            idColumn,
            parentIdColumn
        };
    }

    /**
     * Returns normalized TreeView options.
     */
    public getOptions(): NormalizedTreeViewOptions | undefined {
        return this.normalizedOptions;
    }

    /**
     * Returns canonical tree index cache.
     */
    public getIndexCache(): TreeIndexBuildResult | undefined {
        return this.indexCache;
    }

    /**
     * Returns metadata for currently projected rows.
     */
    public getProjectionState(): TreeProjectionState | undefined {
        return this.projectionStateCache;
    }

    /**
     * Toggles expansion state for a row in current projection.
     *
     * @param rowId
     * Row ID to toggle.
     *
     * @returns
     * `true` when state changed, otherwise `false`.
     */
    public toggleRow(rowId: RowId): boolean {
        const options = this.normalizedOptions;
        const projectionState = this.projectionStateCache;

        if (!options || !projectionState) {
            return false;
        }

        const rowState = projectionState.rowsById.get(rowId);
        if (!rowState || !rowState.hasChildren) {
            return false;
        }

        if (!this.expandedRowIdsState) {
            this.syncExpandedRowIdsState(options, this.indexCache);
        }

        if (!this.expandedRowIdsState) {
            return false;
        }

        if (rowState.isExpanded) {
            this.expandedRowIdsState.delete(rowId);
        } else {
            this.expandedRowIdsState.add(rowId);
        }

        this.projectionStateCache = void 0;

        return true;
    }

    /**
     * Projects a queried table into TreeView row order and visibility.
     *
     * @param table
     * Table after sort/filter and before pagination.
     *
     * The input table is expected to be after sort/filter, but before
     * pagination. If TreeView is disabled, unchanged table is returned.
     */
    public projectTable(table: DataTable): DataTable {
        const options = this.normalizedOptions;
        const index = this.indexCache;

        if (!options || !index) {
            this.projectionStateCache = void 0;
            return table;
        }

        const idColumn = this.getDataOptions()?.idColumn;
        if (!idColumn) {
            throw new Error(
                'TreeView: `data.idColumn` is required for `parentId` input.'
            );
        }

        const projectionState = this.projectToVisibleState(
            table,
            idColumn,
            index
        );
        this.projectionStateCache = projectionState;

        if (
            TreeProjectionController.areRowIndexesIdentity(
                projectionState.rowIndexes,
                table.getRowCount()
            )
        ) {
            return table;
        }

        return this.createProjectedTable(table, projectionState.rowIndexes);
    }

    /**
     * Destroys controller state.
     */
    public destroy(): void {
        this.normalizedOptions = void 0;
        this.expandedRowIdsState = void 0;
        this.expansionStateSeedKey = void 0;
        this.clearCache();
    }

    /**
     * Clears cached index, projection state, and source metadata.
     */
    private clearCache(): void {
        this.indexCache = void 0;
        this.projectionStateCache = void 0;
        this.cacheSource = void 0;
    }

    /**
     * Returns data options with TreeView extension for local provider.
     */
    private getDataOptions(): DataOptionsWithTreeView | undefined {
        return this.grid.options?.data as DataOptionsWithTreeView | undefined;
    }

    /**
     * Validates and normalizes TreeView options from Grid config.
     */
    private normalizeOptions(): NormalizedTreeViewOptions | undefined {
        const dataOptions = this.getDataOptions();
        const treeView = dataOptions?.treeView;

        if (!treeView || treeView.enabled === false) {
            return;
        }

        if (!treeView.input || treeView.input.type !== 'parentId') {
            throw new Error(
                'TreeView: `data.treeView.input.type` must be "parentId".'
            );
        }

        if (!treeView.input.parentIdColumn) {
            throw new Error(
                'TreeView: `data.treeView.input.parentIdColumn` is required.'
            );
        }

        const treeColumn = treeView.treeColumn;

        return {
            enabled: true,
            input: {
                type: 'parentId',
                parentIdColumn: treeView.input.parentIdColumn
            },
            treeColumn,
            initiallyExpanded: treeView.initiallyExpanded ?? false,
            expandedRowIds: this.normalizeExpandedRowIds(
                treeView.expandedRowIds
            )
        };
    }

    /**
     * Normalizes configured expanded row IDs to runtime-safe values.
     *
     * @param expandedRowIds
     * Candidate row IDs from options.
     *
     * @returns
     * Normalized list containing only valid row IDs.
     */
    private normalizeExpandedRowIds(expandedRowIds?: RowId[]): RowId[] {
        if (!expandedRowIds) {
            return [];
        }

        const normalized: RowId[] = [];
        for (let i = 0, iEnd = expandedRowIds.length; i < iEnd; ++i) {
            const rowId = expandedRowIds[i];
            if (!isString(rowId) && !isNumber(rowId)) {
                throw new Error(
                    'TreeView: `data.treeView.expandedRowIds` must contain ' +
                    'only string or number values.'
                );
            }
            normalized.push(rowId);
        }

        return normalized;
    }

    /**
     * Synchronizes expansion state for tree nodes with children.
     *
     * Re-initializes state when expansion seed changes, otherwise prunes
     * entries that are no longer expandable.
     *
     * @param options
     * Normalized TreeView options.
     *
     * @param index
     * Current tree index.
     */
    private syncExpandedRowIdsState(
        options: NormalizedTreeViewOptions,
        index?: TreeIndexBuildResult
    ): void {
        if (!index) {
            return;
        }

        const seedKey = TreeProjectionController.getExpansionSeedKey(options);
        const explicitExpanded = new Set<RowId>(options.expandedRowIds);

        if (
            this.expansionStateSeedKey !== seedKey ||
            !this.expandedRowIdsState
        ) {
            this.expansionStateSeedKey = seedKey;
            this.expandedRowIdsState = new Set<RowId>();

            for (const [nodeId, node] of index.nodes) {
                if (!node.childrenIds.length) {
                    continue;
                }
                if (options.initiallyExpanded || explicitExpanded.has(nodeId)) {
                    this.expandedRowIdsState.add(nodeId);
                }
            }

            return;
        }

        const nextExpandedState = new Set<RowId>();

        for (const nodeId of this.expandedRowIdsState) {
            const node = index.nodes.get(nodeId);
            if (node && node.childrenIds.length) {
                nextExpandedState.add(nodeId);
            }
        }

        this.expandedRowIdsState = nextExpandedState;
    }

    /**
     * Computes projected row order and per-row tree metadata for visible rows.
     *
     * @param table
     * Queried table after sort/filter and before pagination.
     *
     * @param idColumn
     * Column containing row IDs.
     *
     * @param index
     * Canonical tree index built from source data.
     *
     * @returns
     * Projection state describing visible rows in tree order.
     */
    private projectToVisibleState(
        table: DataTable,
        idColumn: string,
        index: TreeIndexBuildResult
    ): TreeProjectionState {
        const idValues = table.columns[idColumn];
        if (!idValues) {
            throw new Error(
                `TreeView: idColumn "${idColumn}" not found in ` +
                'presentation table.'
            );
        }

        const visibleRowIds: RowId[] = [];
        const visibleSet = new Set<RowId>();
        const rowIndexById = new Map<RowId, number>();

        for (
            let rowIndex = 0,
                rowCount = table.getRowCount();
            rowIndex < rowCount;
            ++rowIndex
        ) {
            const rowId = idValues[rowIndex] as RowId;
            if (!index.nodes.has(rowId)) {
                throw new Error(
                    `TreeView: Row id "${String(rowId)}" is not present in ` +
                    'the source tree index.'
                );
            }

            visibleRowIds.push(rowId);
            visibleSet.add(rowId);
            rowIndexById.set(rowId, rowIndex);
        }

        const rootIds: RowId[] = [];
        const childrenByParent = new Map<RowId, RowId[]>();

        for (let i = 0, iEnd = visibleRowIds.length; i < iEnd; ++i) {
            const nodeId = visibleRowIds[i];
            const node = index.nodes.get(nodeId);
            if (!node) {
                continue;
            }

            const parentId = node.parentId;
            if (parentId !== null && visibleSet.has(parentId)) {
                const children = childrenByParent.get(parentId);
                if (children) {
                    children.push(nodeId);
                } else {
                    childrenByParent.set(parentId, [nodeId]);
                }
            } else {
                rootIds.push(nodeId);
            }
        }

        const projectedRowIds: RowId[] = [];
        const rowsById = new Map<RowId, TreeProjectionRowState>();
        const expandedState = this.expandedRowIdsState || new Set<RowId>();

        const visitNode = (nodeId: RowId, depth: number): void => {
            projectedRowIds.push(nodeId);

            const children = childrenByParent.get(nodeId);
            const hasChildren = !!(children && children.length);
            const isExpanded = (
                hasChildren &&
                expandedState.has(nodeId)
            );

            rowsById.set(nodeId, {
                id: nodeId,
                depth,
                hasChildren,
                isExpanded
            });

            if (!children || !isExpanded) {
                return;
            }

            for (let i = 0, iEnd = children.length; i < iEnd; ++i) {
                visitNode(children[i], depth + 1);
            }
        };

        for (let i = 0, iEnd = rootIds.length; i < iEnd; ++i) {
            visitNode(rootIds[i], 0);
        }

        const projectedIndexes = new Array<number>(projectedRowIds.length);
        for (let i = 0, iEnd = projectedRowIds.length; i < iEnd; ++i) {
            const rowIndex = rowIndexById.get(projectedRowIds[i]);
            if (typeof rowIndex !== 'number') {
                throw new Error(
                    'TreeView: Could not resolve row index for id "' +
                    String(projectedRowIds[i]) +
                    '".'
                );
            }
            projectedIndexes[i] = rowIndex;
        }

        return {
            rowIds: projectedRowIds,
            rowIndexes: projectedIndexes,
            rowsById
        };
    }

    /**
     * Builds a projected table by reordering all columns to projected indexes.
     *
     * @param table
     * Input queried table.
     *
     * @param rowIndexes
     * Source row indexes in projected order.
     *
     * @returns
     * Cloned table with projected column values and row index references.
     */
    private createProjectedTable(
        table: DataTable,
        rowIndexes: number[]
    ): DataTable {
        const projectedTable = table.clone(true);
        const sourceColumnIds = table.getColumnIds();
        const projectedColumns: ColumnCollection = {};

        for (
            let i = 0,
                iEnd = sourceColumnIds.length;
            i < iEnd;
            ++i
        ) {
            const columnId = sourceColumnIds[i];
            const sourceColumn = table.columns[columnId];
            const projectedColumn = new Array<DataTableCellType>(
                rowIndexes.length
            );

            for (let j = 0, jEnd = rowIndexes.length; j < jEnd; ++j) {
                projectedColumn[j] = sourceColumn?.[rowIndexes[j]];
            }

            projectedColumns[columnId] = projectedColumn;
        }

        projectedTable.setColumns(projectedColumns);

        const originalRowIndexes = new Array<number | undefined>(
            rowIndexes.length
        );

        for (let i = 0, iEnd = rowIndexes.length; i < iEnd; ++i) {
            originalRowIndexes[i] = table.getOriginalRowIndex(rowIndexes[i]);
        }

        projectedTable.setOriginalRowIndexes(originalRowIndexes);

        return projectedTable;
    }

    /**
     * Checks whether provided row indexes represent identity mapping.
     *
     * @param rowIndexes
     * Row indexes to verify.
     *
     * @param rowCount
     * Expected number of rows in identity mapping.
     *
     * @returns
     * `true` for `[0, 1, 2, ...]`, otherwise `false`.
     */
    private static areRowIndexesIdentity(
        rowIndexes: number[],
        rowCount: number
    ): boolean {
        if (rowIndexes.length !== rowCount) {
            return false;
        }

        for (let i = 0; i < rowCount; ++i) {
            if (rowIndexes[i] !== i) {
                return false;
            }
        }

        return true;
    }

    /**
     * Builds a stable key for expansion state seeds from options.
     *
     * @param options
     * Normalized TreeView options.
     *
     * @returns
     * Expansion seed key used to decide whether state should be reinitialized.
     */
    private static getExpansionSeedKey(
        options: NormalizedTreeViewOptions
    ): string {
        const parts = [
            options.initiallyExpanded ? '1' : '0'
        ];

        for (
            let i = 0,
                iEnd = options.expandedRowIds.length;
            i < iEnd;
            ++i
        ) {
            const id = options.expandedRowIds[i];
            parts.push(typeof id + ':' + String(id));
        }

        return parts.join('|');
    }

    /**
     * Runtime type guard for providers exposing `getDataTable`.
     *
     * @param provider
     * Data provider instance to test.
     *
     * @returns
     * `true` when provider exposes `getDataTable`.
     */
    private static hasGetDataTable(
        provider: unknown
    ): provider is {
        getDataTable: (presentation?: boolean) => DataTable | undefined;
    } {
        return !!(
            provider &&
            typeof (
                provider as {
                    getDataTable?: unknown;
                }
            ).getDataTable === 'function'
        );
    }
}


/* *
 *
 *  Default export
 *
 * */

export default TreeProjectionController;
