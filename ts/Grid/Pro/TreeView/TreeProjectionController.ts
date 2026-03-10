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
    TreeViewOptions,
    TreeProjectionRowState,
    TreeProjectionState
} from './TreeViewTypes';
import type {
    NormalizedTreeInputOptions,
    NormalizedTreeViewOptions
} from './TreeViewOptionsNormalizer';

import {
    buildIndexFromColumns as buildPathIndexFromColumns
} from './InputAdapters/PathTreeInputAdapter.js';
import {
    buildIndexFromColumns as buildParentIdIndexFromColumns
} from './InputAdapters/ParentIdTreeInputAdapter.js';
import {
    normalizeTreeViewOptions
} from './TreeViewOptionsNormalizer.js';


/* *
 *
 *  Declarations
 *
 * */

interface DataOptionsWithTreeView extends LocalDataProviderOptions {
    treeView?: TreeViewOptions;
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

    private options?: NormalizedTreeViewOptions;

    private indexCache?: TreeIndexBuildResult;

    private projectionStateCache?: TreeProjectionState;

    private expandedRowIdsState?: Set<RowId>;

    private expansionStateSeedKey?: string;

    private cacheSource?: {
        table: DataTable;
        versionTag: string;
        idColumn: string;
        inputCacheKey: string;
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
        const options = this.options = normalizeTreeViewOptions(
            this.getDataOptions()?.treeView
        );

        if (!options) {
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
                'TreeView: `data.idColumn` is required for tree input.'
            );
        }
        const inputCacheKey = TreeProjectionController.getInputCacheKey(
            options.input
        );

        const isCacheValid = (
            this.cacheSource?.table === table &&
            this.cacheSource.versionTag === versionTag &&
            this.cacheSource.idColumn === idColumn &&
            this.cacheSource.inputCacheKey === inputCacheKey
        );

        if (!isCacheValid) {
            this.indexCache = this.buildIndexFromInput(
                table.columns,
                idColumn,
                options.input
            );

            this.cacheSource = {
                table,
                versionTag,
                idColumn,
                inputCacheKey
            };
        }

        this.syncExpandedRowIdsState();
    }

    /**
     * Returns normalized TreeView options.
     */
    public getOptions(): NormalizedTreeViewOptions | undefined {
        return this.options;
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
        const options = this.options;
        const projectionState = this.projectionStateCache;

        if (!options || !projectionState) {
            return false;
        }

        const rowState = projectionState.rowsById.get(rowId);
        if (!rowState || !rowState.hasChildren) {
            return false;
        }

        if (!this.expandedRowIdsState) {
            this.syncExpandedRowIdsState();
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
        const options = this.options;
        const index = this.indexCache;

        if (!options || !index) {
            this.projectionStateCache = void 0;
            return table;
        }

        const idColumn = this.getDataOptions()?.idColumn;
        if (!idColumn) {
            throw new Error(
                'TreeView: `data.idColumn` is required for tree input.'
            );
        }

        const projectionState = this.projectToVisibleState(table, idColumn);
        this.projectionStateCache = projectionState;

        if (
            TreeProjectionController.areRowIndexesIdentity(
                projectionState.rowIndexes,
                table.getRowCount()
            )
        ) {
            return table;
        }

        return this.createProjectedTable(
            table,
            projectionState,
            idColumn
        );
    }

    /**
     * Destroys controller state.
     */
    public destroy(): void {
        this.options = void 0;
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
     * Builds canonical tree index for currently selected input type.
     *
     * @param columns
     * Source columns.
     *
     * @param idColumn
     * Column ID containing stable row IDs.
     *
     * @param input
     * Normalized input configuration.
     *
     * @returns
     * Canonical tree index.
     */
    private buildIndexFromInput(
        columns: ColumnCollection,
        idColumn: string,
        input: NormalizedTreeInputOptions
    ): TreeIndexBuildResult {
        if (input.type === 'parentId') {
            return buildParentIdIndexFromColumns(
                columns,
                idColumn,
                input
            );
        }

        return buildPathIndexFromColumns(
            columns,
            idColumn,
            input
        );
    }

    /**
     * Synchronizes expansion state for tree nodes with children.
     *
     * Re-initializes state when expansion seed changes, otherwise prunes
     * entries that are no longer expandable.
     */
    private syncExpandedRowIdsState(): void {
        const options = this.options;
        const index = this.indexCache;

        if (!options || !index) {
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

        for (const nodeId of this.expandedRowIdsState) {
            const node = index.nodes.get(nodeId);
            if (!node || !node.childrenIds.length) {
                this.expandedRowIdsState.delete(nodeId);
            }
        }
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
     * @returns
     * Projection state describing visible rows in tree order.
     */
    private projectToVisibleState(
        table: DataTable,
        idColumn: string
    ): TreeProjectionState {
        const index = this.indexCache;
        if (!index) {
            throw new Error('TreeView: Source tree index is not initialized.');
        }

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
        const rootIdSet = new Set<RowId>();
        const childrenByParent = new Map<RowId, RowId[]>();
        const childSetByParent = new Map<RowId, Set<RowId>>();

        const addRoot = (nodeId: RowId): void => {
            if (!rootIdSet.has(nodeId)) {
                rootIdSet.add(nodeId);
                rootIds.push(nodeId);
            }
        };

        const addChild = (parentId: RowId, childId: RowId): void => {
            let childSet = childSetByParent.get(parentId);
            if (!childSet) {
                childSet = new Set<RowId>();
                childSetByParent.set(parentId, childSet);
            }

            if (childSet.has(childId)) {
                return;
            }

            childSet.add(childId);

            const children = childrenByParent.get(parentId);
            if (children) {
                children.push(childId);
            } else {
                childrenByParent.set(parentId, [childId]);
            }
        };

        for (let i = 0, iEnd = visibleRowIds.length; i < iEnd; ++i) {
            let currentId: RowId | null = visibleRowIds[i];

            while (currentId !== null) {
                const currentNode = index.nodes.get(currentId);
                if (!currentNode) {
                    break;
                }

                const parentId = currentNode.parentId;
                if (parentId === null) {
                    addRoot(currentId);
                    break;
                }

                const parentNode = index.nodes.get(parentId);
                if (!parentNode) {
                    addRoot(currentId);
                    break;
                }

                if (
                    !visibleSet.has(parentId) &&
                    !parentNode.isGenerated
                ) {
                    addRoot(currentId);
                    break;
                }

                addChild(parentId, currentId);
                currentId = parentId;
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

        const projectedIndexes = new Array<number | undefined>(
            projectedRowIds.length
        );
        for (let i = 0, iEnd = projectedRowIds.length; i < iEnd; ++i) {
            const rowIndex = rowIndexById.get(projectedRowIds[i]);
            if (typeof rowIndex === 'number') {
                projectedIndexes[i] = rowIndex;
                continue;
            }

            const node = index.nodes.get(projectedRowIds[i]);
            if (!node || !node.isGenerated) {
                throw new Error(
                    'TreeView: Could not resolve row index for id "' +
                    String(projectedRowIds[i]) +
                    '".'
                );
            }

            projectedIndexes[i] = void 0;
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
     * @param projectionState
     * Projection state for table rebuild.
     *
     * @param idColumn
     * Column containing stable row IDs.
     *
     * @returns
     * Cloned table with projected column values and row index references.
     */
    private createProjectedTable(
        table: DataTable,
        projectionState: Pick<TreeProjectionState, 'rowIds' | 'rowIndexes'>,
        idColumn: string
    ): DataTable {
        const { rowIds, rowIndexes } = projectionState;

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
                const rowIndex = rowIndexes[j];
                if (typeof rowIndex === 'number') {
                    projectedColumn[j] = sourceColumn?.[rowIndex];
                    continue;
                }

                projectedColumn[j] = this.getGeneratedCellValue(
                    columnId,
                    rowIds[j],
                    idColumn
                );
            }

            projectedColumns[columnId] = projectedColumn;
        }

        projectedTable.setColumns(projectedColumns);

        const originalRowIndexes = new Array<number | undefined>(
            rowIndexes.length
        );

        for (let i = 0, iEnd = rowIndexes.length; i < iEnd; ++i) {
            const rowIndex = rowIndexes[i];
            originalRowIndexes[i] = (
                typeof rowIndex === 'number' ?
                    table.getOriginalRowIndex(rowIndex) :
                    void 0
            );
        }

        projectedTable.setOriginalRowIndexes(originalRowIndexes);

        return projectedTable;
    }

    /**
     * Resolves column value for an auto-generated tree path row.
     *
     * @param columnId
     * Target column ID.
     *
     * @param rowId
     * Generated row ID.
     *
     * @param idColumn
     * Column containing stable row IDs.
     *
     * @returns
     * Cell value for generated row, or `null` for unsupported columns.
     */
    private getGeneratedCellValue(
        columnId: string,
        rowId: RowId,
        idColumn: string
    ): DataTableCellType {
        const index = this.indexCache;
        const input = this.options?.input;

        if (!index || !input) {
            return null;
        }

        const node = index.nodes.get(rowId);
        if (!node || !node.isGenerated) {
            return null;
        }

        if (columnId === idColumn) {
            return node.id;
        }

        if (
            input.type === 'path' &&
            columnId === input.pathColumn &&
            node.path
        ) {
            return node.path;
        }

        return null;
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
        rowIndexes: Array<number | undefined>,
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
     * Builds deterministic cache key for normalized input configuration.
     *
     * @param input
     * Normalized input configuration.
     *
     * @returns
     * Cache key representing input identity.
     */
    private static getInputCacheKey(input: NormalizedTreeInputOptions): string {
        if (input.type === 'parentId') {
            return JSON.stringify([
                'parentId',
                input.parentIdColumn
            ]);
        }

        return JSON.stringify([
            'path',
            input.pathColumn,
            input.separator
        ]);
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
