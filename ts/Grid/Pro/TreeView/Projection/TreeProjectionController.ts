/* *
 *
 *  Grid Tree Projection Controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
    CellType as DataTableCellType,
    ColumnCollection
} from '../../../../Data/DataTable';
import type Grid from '../../../Core/Grid';
import type { RowMetaRecord } from '../../../Core/Grid';
import type { RowId } from '../../../Core/Data/DataProvider';
import type { DataProviderOptionsType } from '../../../Core/Data/DataProviderType';
import type { LocalDataProviderOptions } from '../../../Core/Data/LocalDataProvider';
import type {
    TreeIndexBuildResult,
    TreeViewColumnAggregateOption,
    TreeViewColumnOptions,
    TreeProjectionRowState,
    TreeProjectionState
} from '../TreeViewTypes';
import type {
    NormalizedTreeInputOptions,
    ResolvedTreeViewOptions
} from '../TreeViewOptionsNormalizer';

import {
    buildIndexFromColumns as buildPathIndexFromColumns
} from '../InputAdapters/PathTreeInputAdapter.js';
import TreeAggregationResolver from './TreeAggregationResolver.js';
import {
    resolveActiveGridSortings
} from '../../../Core/Querying/SortingUtils.js';
import {
    buildIndexFromColumns as buildParentIdIndexFromColumns
} from '../InputAdapters/ParentIdTreeInputAdapter.js';
import {
    hasDataTableProvider
} from '../../../Core/Data/DataProvider.js';
import { normalizeTreeViewOptions } from '../TreeViewOptionsNormalizer.js';
import { isDeepEqual } from '../../../Core/GridUtils.js';
import { defined, fireEvent } from '../../../../Shared/Utilities.js';


/* *
 *
 *  Functions
 *
 * */

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
function areRowIndexesIdentity(
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
 * Resolved TreeView options.
 *
 * @returns
 * Expansion seed key used to decide whether state should be reinitialized.
 */
function getExpansionSeedKey(
    options: ResolvedTreeViewOptions
): string {
    if (options.expandedRowIds === 'all') {
        return 'all';
    }

    const parts: string[] = [];

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
 * Resolves effective tree input configuration for source columns.
 *
 * @param columns
 * Source columns.
 *
 * @param input
 * Normalized input configuration. When omitted, the controller auto-detects
 * the standard `parentId` or `path` columns.
 *
 * @returns
 * Resolved normalized input configuration.
 */
function resolveInputOptions(
    columns: ColumnCollection,
    input?: NormalizedTreeInputOptions
): NormalizedTreeInputOptions {
    if (input) {
        return input;
    }

    const parentIdColumn = 'parentId';
    const pathColumn = 'path';
    const separator = '/';
    const hasParentIdColumn = !!columns[parentIdColumn];
    const hasPathColumn = !!columns[pathColumn];

    if (hasPathColumn) {
        return {
            type: 'path',
            pathColumn,
            separator,
            showFullPath: false
        };
    }

    if (hasParentIdColumn) {
        return {
            type: 'parentId',
            parentIdColumn
        };
    }

    throw new Error(
        'TreeView: Could not autodetect input type. Expected either ' +
        `"${parentIdColumn}" or "${pathColumn}" column, ` +
        'or set `data.treeView.input.type` explicitly.'
    );
}

/**
 * Runtime type guard for local data provider options.
 *
 * @param dataOptions
 * Data provider options to test.
 *
 * @returns
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

    private readonly aggregationResolver: TreeAggregationResolver;

    private indexCache?: TreeIndexBuildResult;

    private projectionStateCache?: TreeProjectionState;

    private injectedAncestorIds?: Set<RowId>;

    private expansionStateSeedKey?: string;

    private resolvedOptions?: ResolvedTreeViewOptions;

    private cacheSource?: {
        table: DataTable;
        versionTag: string;
        idColumn: string;
        input: NormalizedTreeInputOptions;
    };


    /* *
     *
     *  Constructor
     *
     * */

    constructor(grid: Grid) {
        this.grid = grid;
        this.aggregationResolver = new TreeAggregationResolver({
            getColumnAggregateOption: (sourceColumnId): (
                TreeViewColumnAggregateOption | undefined
            ) => this.getColumnAggregateOption(sourceColumnId),
            resolveProjectedCellValue: (
                columnId,
                rowId,
                table,
                projectionState,
                idColumn
            ): DataTableCellType => this.resolveProjectedCellValue(
                columnId,
                rowId,
                table,
                projectionState,
                idColumn
            )
        });
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
        const dataOptions = this.getDataOptions();
        const normalizedOptions = normalizeTreeViewOptions(
            dataOptions?.treeView
        );

        if (!normalizedOptions) {
            this.resolvedOptions = void 0;
            this.clearCache();
            return;
        }

        const dataProvider = this.grid.dataProvider;
        if (!hasDataTableProvider(dataProvider)) {
            // Remote provider runtime support is intentionally deferred.
            this.resolvedOptions = void 0;
            this.clearCache();
            return;
        }

        const table = dataProvider.getDataTable(false);
        if (!table) {
            this.resolvedOptions = void 0;
            this.clearCache();
            return;
        }
        const versionTag = table.getVersionTag();

        const idColumn = dataOptions?.idColumn;
        if (!idColumn) {
            throw new Error(
                'TreeView: `data.idColumn` is required for tree input.'
            );
        }
        let resolvedInput: NormalizedTreeInputOptions;

        try {
            resolvedInput = resolveInputOptions(
                table.columns,
                normalizedOptions.input
            );
        } catch (error) {
            this.resolvedOptions = void 0;
            this.clearCache();
            throw error;
        }

        const options: ResolvedTreeViewOptions = {
            ...normalizedOptions,
            input: resolvedInput
        };

        this.resolvedOptions = options;
        const isCacheValid = (
            this.cacheSource?.table === table &&
            this.cacheSource?.versionTag === versionTag &&
            this.cacheSource?.idColumn === idColumn &&
            isDeepEqual(this.cacheSource?.input, options.input)
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
                input: options.input
            };
        }

        this.syncExpandedRowIdsState();
    }

    /**
     * Returns resolved TreeView options for the current source table.
     */
    public get options(): ResolvedTreeViewOptions | undefined {
        return this.resolvedOptions;
    }

    /**
     * Returns metadata for currently projected rows.
     */
    public getProjectionState(): TreeProjectionState | undefined {
        return this.projectionStateCache;
    }

    /**
     * Returns whether a source column participates in TreeView aggregation.
     *
     * @param columnId
     * Source column id.
     */
    public hasColumnAggregation(columnId: string): boolean {
        return this.aggregationResolver.hasColumnAggregation(columnId);
    }

    /**
     * Returns whether a projected cell is currently derived from aggregation.
     *
     * @param rowId
     * Row id of the projected row.
     *
     * @param columnId
     * Grid / source column id.
     */
    public isCellDerived(
        rowId: RowId | undefined,
        columnId: string
    ): boolean {
        if (!defined(rowId)) {
            return false;
        }

        const sourceColumnId = this.grid.columnPolicy
            .getColumnSourceId(columnId) || columnId;

        return !!this.projectionStateCache
            ?.derivedCellColumnIdsByRowId
            .get(rowId)
            ?.has(sourceColumnId);
    }

    /**
     * Returns whether a projected row is auto-generated by TreeView.
     *
     * @param rowId
     * Row id of the projected row.
     */
    public isGeneratedRow(
        rowId: RowId | undefined
    ): boolean {
        if (!defined(rowId)) {
            return false;
        }

        return !!this.indexCache?.nodes.get(rowId)?.isGenerated;
    }

    /**
     * Toggles expansion state for a row in current projection.
     *
     * @param rowId
     * Row ID to toggle.
     *
     * @param redraw
     * Whether to redraw rows after state change.
     *
     * @param originalEvent
     * Browser event that initiated the toggle.
     *
     * @returns
     * Promise resolving to `true` when state changed, otherwise `false`.
     */
    public async toggleRow(
        rowId: RowId,
        redraw: boolean = true,
        originalEvent?: TreeRowToggleTriggerEvent
    ): Promise<boolean> {
        const options = this.options;
        const projectionState = this.projectionStateCache;
        if (!options || !projectionState) {
            return false;
        }

        const rowState = projectionState.rowsById.get(rowId);
        if (!rowState?.hasChildren) {
            return false;
        }

        const newExpanded = !rowState.isExpanded;
        const beforeEvent = {
            expanded: newExpanded,
            originalEvent,
            rowId
        } as BeforeTreeRowToggleEvent;

        fireEvent(this.grid, 'beforeTreeRowToggle', beforeEvent);

        if (beforeEvent.defaultPrevented) {
            return false;
        }

        const changed = this.setRowMetaExpanded(rowId, newExpanded);

        if (!changed) {
            return false;
        }

        this.projectionStateCache = void 0;
        await this.requestRowsRedraw(redraw);

        fireEvent(this.grid, 'afterTreeRowToggle', {
            expanded: newExpanded,
            originalEvent,
            rowId
        } as AfterTreeRowToggleEvent);

        return true;
    }

    /**
     * Expands all currently expandable tree rows.
     *
     * @param redraw
     * Whether to redraw rows after state change.
     *
     * @returns
     * Promise resolving to `true` when state changed, otherwise `false`.
     */
    public async expandAll(redraw: boolean = true): Promise<boolean> {
        this.sync();

        const index = this.indexCache;
        if (!index) {
            return false;
        }

        let changed = false;

        for (const [nodeId, node] of index.nodes) {
            if (!node.childrenIds.length) {
                continue;
            }

            changed = this.setRowMetaExpanded(nodeId, true) || changed;
        }

        if (changed) {
            this.projectionStateCache = void 0;
            await this.requestRowsRedraw(redraw);
        }

        return changed;
    }

    /**
     * Collapses all currently expandable tree rows.
     *
     * @param redraw
     * Whether to redraw rows after state change.
     *
     * @returns
     * Promise resolving to `true` when state changed, otherwise `false`.
     */
    public async collapseAll(redraw: boolean = true): Promise<boolean> {
        this.sync();

        if (!this.indexCache) {
            return false;
        }

        let changed = false;

        for (const [nodeId, node] of this.indexCache.nodes) {
            if (!node.childrenIds.length) {
                continue;
            }

            changed = this.setRowMetaExpanded(nodeId, false) || changed;
        }

        if (!changed) {
            return false;
        }

        this.projectionStateCache = void 0;
        await this.requestRowsRedraw(redraw);

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
        const aggregateColumnIds = this.getAggregateColumnIds(
            table.getColumnIds()
        );

        if (
            !aggregateColumnIds.length &&
                areRowIndexesIdentity(
                    projectionState.rowIndexes,
                    table.getRowCount()
                )
        ) {
            return table;
        }

        return this.createProjectedTable(
            table,
            projectionState,
            idColumn,
            aggregateColumnIds
        );
    }

    /**
     * Destroys controller state.
     */
    public destroy(): void {
        this.clearTreeRowMetaState();
        this.expansionStateSeedKey = void 0;
        this.clearCache();
    }

    /**
     * Clears cached index, projection state, and source metadata.
     */
    private clearCache(): void {
        this.indexCache = void 0;
        this.projectionStateCache = void 0;
        this.injectedAncestorIds = void 0;
        this.cacheSource = void 0;
    }

    /**
     * Marks rows as dirty and schedules redraw after projection state updates.
     *
     * @param redraw
     * Whether to redraw rows immediately.
     */
    private async requestRowsRedraw(redraw: boolean = true): Promise<void> {
        this.grid.querying.shouldBeUpdated = true;
        this.grid.dirtyFlags.add('rows');
        if (redraw) {
            await this.grid.redraw();
        }
    }

    /**
     * Ensures row metadata record exists for a row.
     *
     * @param rowId
     * Row ID.
     *
     * @returns
     * Row metadata record.
     */
    private ensureRowMetaRecord(rowId: RowId): RowMetaRecord {
        let rowMeta = this.grid.rowMeta.get(rowId);

        if (!rowMeta) {
            rowMeta = {};
            this.grid.rowMeta.set(rowId, rowMeta);
        }

        return rowMeta;
    }

    /**
     * Removes empty row metadata records.
     *
     * @param rowId
     * Row ID.
     */
    private cleanupRowMeta(rowId: RowId): void {
        const rowMeta = this.grid.rowMeta.get(rowId);
        if (!rowMeta) {
            return;
        }

        if (!Object.keys(rowMeta).length) {
            this.grid.rowMeta.delete(rowId);
        }
    }

    /**
     * Clears TreeView metadata state for all rows.
     */
    private clearTreeRowMetaState(): void {
        for (const [rowId, rowMeta] of this.grid.rowMeta) {
            if (!defined(rowMeta.expanded)) {
                continue;
            }

            delete rowMeta.expanded;
            if (!Object.keys(rowMeta).length) {
                this.grid.rowMeta.delete(rowId);
            }
        }
    }

    /**
     * Sets explicit expanded state for a row.
     *
     * @param rowId
     * Row ID.
     *
     * @param expanded
     * Whether row should be explicitly expanded.
     *
     * @returns
     * `true` when state changed.
     */
    private setRowMetaExpanded(rowId: RowId, expanded?: boolean): boolean {
        const rowMeta = this.grid.rowMeta.get(rowId);
        if (!defined(expanded)) {
            if (!defined(rowMeta?.expanded)) {
                return false;
            }

            delete rowMeta.expanded;
            this.cleanupRowMeta(rowId);

            return true;
        }

        if (rowMeta?.expanded === expanded) {
            return false;
        }

        this.ensureRowMetaRecord(rowId).expanded = expanded;

        return true;
    }

    /**
     * Returns data options with TreeView extension for local provider.
     */
    private getDataOptions(): LocalDataProviderOptions | undefined {
        const dataOptions = this.grid.options?.data;

        if (!isLocalDataOptions(dataOptions)) {
            return;
        }

        return dataOptions;
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

        const seedKey = getExpansionSeedKey(options);
        const expandAll = options.expandedRowIds === 'all';
        const explicitExpanded = expandAll ?
            void 0 :
            new Set<RowId>(options.expandedRowIds);

        if (this.expansionStateSeedKey !== seedKey) {
            this.expansionStateSeedKey = seedKey;
            this.clearTreeRowMetaState();

            for (const [nodeId, node] of index.nodes) {
                if (!node.childrenIds.length) {
                    continue;
                }

                if (expandAll || explicitExpanded?.has(nodeId)) {
                    this.setRowMetaExpanded(nodeId, true);
                }
            }

            return;
        }

        for (const [rowId, meta] of this.grid.rowMeta) {
            if (!defined(meta.expanded)) {
                continue;
            }

            const node = index.nodes.get(rowId);
            if (!node || !node.childrenIds.length) {
                this.setRowMetaExpanded(rowId, void 0);
            }
        }

        for (const [nodeId, node] of index.nodes) {
            if (
                !node.childrenIds.length ||
                defined(this.grid.rowMeta.get(nodeId)?.expanded)
            ) {
                continue;
            }

            if (expandAll || explicitExpanded?.has(nodeId)) {
                this.setRowMetaExpanded(nodeId, true);
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
        const sourceOrderById = new Map<RowId, number>();
        const inheritedOrderById = new Map<RowId, number>();

        for (let i = 0, iEnd = index.rowOrder.length; i < iEnd; ++i) {
            sourceOrderById.set(index.rowOrder[i], i);
        }

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

        const setInheritedOrder = (nodeId: RowId, order: number): void => {
            if (rowIndexById.has(nodeId)) {
                return;
            }

            const currentOrder = inheritedOrderById.get(nodeId);
            if (
                typeof currentOrder !== 'number' ||
                order < currentOrder
            ) {
                inheritedOrderById.set(nodeId, order);
            }
        };

        const getNodeOrder = (nodeId: RowId): number => {
            const rowIndex = rowIndexById.get(nodeId);
            if (typeof rowIndex === 'number') {
                return rowIndex;
            }

            return inheritedOrderById.get(nodeId) ??
                Number.POSITIVE_INFINITY;
        };

        const compareNodeOrder = (a: RowId, b: RowId): number => {
            const aOrder = getNodeOrder(a);
            const bOrder = getNodeOrder(b);

            if (aOrder !== bOrder) {
                return aOrder - bOrder;
            }

            const aSourceOrder = sourceOrderById.get(a) ??
                Number.POSITIVE_INFINITY;
            const bSourceOrder = sourceOrderById.get(b) ??
                Number.POSITIVE_INFINITY;

            if (aSourceOrder !== bSourceOrder) {
                return aSourceOrder - bSourceOrder;
            }

            const aId = String(a);
            const bId = String(b);

            return (
                aId < bId ? -1 :
                    aId > bId ? 1 :
                        0
            );
        };

        const injectedAncestorIds = new Set<RowId>();

        for (let i = 0, iEnd = visibleRowIds.length; i < iEnd; ++i) {
            let currentId: RowId | null = visibleRowIds[i];

            while (currentId !== null) {
                setInheritedOrder(currentId, i);

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
                    visibleSet.add(parentId);
                    injectedAncestorIds.add(parentId);
                }

                addChild(parentId, currentId);
                currentId = parentId;
            }
        }

        rootIds.sort(compareNodeOrder);

        for (const children of childrenByParent.values()) {
            children.sort(compareNodeOrder);
        }

        const rowsById = new Map<RowId, TreeProjectionRowState>();

        const buildRowState = (
            nodeId: RowId,
            depth: number,
            parentId: RowId | null
        ): void => {
            const children = childrenByParent.get(nodeId);
            const hasChildren = !!(children && children.length);
            const explicitExpanded = this.grid.rowMeta.get(nodeId)?.expanded;
            const isAncestorOnly = injectedAncestorIds.has(nodeId);
            const isExpanded = (
                hasChildren &&
                (
                    explicitExpanded === true ||
                    (
                        !defined(explicitExpanded) &&
                        isAncestorOnly
                    )
                )
            );

            const rowState: TreeProjectionRowState = {
                childrenIds: children ? children.slice() : [],
                id: nodeId,
                parentId,
                depth,
                hasChildren,
                isExpanded
            };

            if (isAncestorOnly) {
                rowState.isAncestorOnly = true;
            }

            rowsById.set(nodeId, rowState);

            if (!children) {
                return;
            }

            for (let i = 0, iEnd = children.length; i < iEnd; ++i) {
                buildRowState(children[i], depth + 1, nodeId);
            }
        };

        for (let i = 0, iEnd = rootIds.length; i < iEnd; ++i) {
            buildRowState(rootIds[i], 0, null);
        }

        this.sortProjectedTreeNodes(
            table,
            idColumn,
            rootIds,
            childrenByParent,
            rowIndexById,
            rowsById
        );

        const projectedRowIds: RowId[] = [];

        const visitVisibleNode = (nodeId: RowId): void => {
            const rowState = rowsById.get(nodeId);
            if (!rowState) {
                return;
            }

            projectedRowIds.push(nodeId);

            if (!rowState.childrenIds.length || !rowState.isExpanded) {
                return;
            }

            for (
                let i = 0, iEnd = rowState.childrenIds.length;
                i < iEnd;
                ++i
            ) {
                visitVisibleNode(rowState.childrenIds[i]);
            }
        };

        for (let i = 0, iEnd = rootIds.length; i < iEnd; ++i) {
            visitVisibleNode(rootIds[i]);
        }

        const rowStateStack: TreeProjectionRowState[] = [];
        let lastVisitedRowId: RowId | undefined;

        for (let i = 0, iEnd = projectedRowIds.length; i < iEnd; ++i) {
            const rowState = rowsById.get(projectedRowIds[i]);
            if (!rowState) {
                continue;
            }

            while (rowStateStack.length > rowState.depth) {
                const completedState = rowStateStack.pop();
                if (
                    completedState &&
                    typeof lastVisitedRowId !== 'undefined'
                ) {
                    completedState.lastVisibleDescendantId = lastVisitedRowId;
                }
            }

            rowStateStack.push(rowState);
            lastVisitedRowId = rowState.id;
        }

        while (rowStateStack.length) {
            const completedState = rowStateStack.pop();
            if (
                completedState &&
                typeof lastVisitedRowId !== 'undefined'
            ) {
                completedState.lastVisibleDescendantId = lastVisitedRowId;
            }
        }

        this.injectedAncestorIds = injectedAncestorIds;

        const projectedIndexes = new Array<number | undefined>(
            projectedRowIds.length
        );
        for (let i = 0, iEnd = projectedRowIds.length; i < iEnd; ++i) {
            const rowIndex = rowIndexById.get(projectedRowIds[i]);
            if (typeof rowIndex === 'number') {
                projectedIndexes[i] = rowIndex;
                continue;
            }

            const nodeId = projectedRowIds[i];
            const node = index.nodes.get(nodeId);
            if (
                !node ||
                (!node.isGenerated && !injectedAncestorIds.has(nodeId))
            ) {
                throw new Error(
                    'TreeView: Could not resolve row index for id "' +
                    String(nodeId) +
                    '".'
                );
            }

            projectedIndexes[i] = void 0;
        }

        return {
            derivedCellColumnIdsByRowId: new Map(),
            rowIds: projectedRowIds,
            rowIndexes: projectedIndexes,
            sourceRowIndexesById: rowIndexById,
            rowsById
        };
    }

    /**
     * Applies tree-local sorting when active sort columns depend on
     * aggregation, which becomes available only during TreeView projection.
     *
     * @param table
     * Queried table after filtering/sorting and before pagination.
     *
     * @param idColumn
     * Column containing stable row IDs.
     *
     * @param rootIds
     * Root ids in the projected logical tree.
     *
     * @param childrenByParent
     * Direct children ids keyed by parent id.
     *
     * @param rowIndexById
     * Source row indexes keyed by row id.
     *
     * @param rowsById
     * Logical projected tree row states.
     */
    private sortProjectedTreeNodes(
        table: DataTable,
        idColumn: string,
        rootIds: RowId[],
        childrenByParent: Map<RowId, RowId[]>,
        rowIndexById: Map<RowId, number>,
        rowsById: Map<RowId, TreeProjectionRowState>
    ): void {
        const activeSortings = resolveActiveGridSortings(
            this.grid,
            this.grid.querying.sorting.currentSortings,
            this.grid.querying.sorting.currentSorting
        );
        if (
            !activeSortings.length ||
            !activeSortings.some((sorting): boolean =>
                this.hasColumnAggregation(sorting.sourceColumnId)
            )
        ) {
            return;
        }

        const sortProjectionState: TreeProjectionState = {
            derivedCellColumnIdsByRowId: new Map(),
            rowIds: Array.from(rowsById.keys()),
            rowIndexes: [],
            sourceRowIndexesById: rowIndexById,
            rowsById
        };
        const valueMapByColumnId = new Map<string, Map<RowId, DataTableCellType>>();

        for (let i = 0, iEnd = activeSortings.length; i < iEnd; ++i) {
            const sorting = activeSortings[i];
            if (valueMapByColumnId.has(sorting.sourceColumnId)) {
                continue;
            }

            valueMapByColumnId.set(
                sorting.sourceColumnId,
                this.aggregationResolver.resolveColumnValues(
                    sorting.sourceColumnId,
                    table,
                    sortProjectionState,
                    idColumn,
                    new Map()
                )
            );
        }

        const compareSortedNodes = (a: RowId, b: RowId): number => {
            for (let i = 0, iEnd = activeSortings.length; i < iEnd; ++i) {
                const sorting = activeSortings[i];
                const valueMap = valueMapByColumnId.get(sorting.sourceColumnId);
                const result = sorting.compare(
                    valueMap?.get(a),
                    valueMap?.get(b)
                );

                if (result) {
                    return result;
                }
            }

            const aIndex = rowIndexById.get(a);
            const bIndex = rowIndexById.get(b);

            if (
                typeof aIndex === 'number' &&
                typeof bIndex === 'number' &&
                aIndex !== bIndex
            ) {
                return aIndex - bIndex;
            }

            const aId = String(a);
            const bId = String(b);

            return (
                aId < bId ? -1 :
                    aId > bId ? 1 :
                        0
            );
        };

        rootIds.sort(compareSortedNodes);

        for (const children of childrenByParent.values()) {
            children.sort(compareSortedNodes);
        }

        for (const [rowId, rowState] of rowsById) {
            const children = childrenByParent.get(rowId);
            rowState.childrenIds = children ? children.slice() : [];
        }
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
     * @param aggregateColumnIds
     * Source column ids that should be aggregated in the projected table.
     *
     * @returns
     * Cloned table with projected column values and row index references.
     */
    private createProjectedTable(
        table: DataTable,
        projectionState: TreeProjectionState,
        idColumn: string,
        aggregateColumnIds: string[]
    ): DataTable {
        const { rowIds, rowIndexes } = projectionState;

        const projectedTable = table.clone(true);
        const sourceColumnIds = table.getColumnIds();
        const projectedColumns: ColumnCollection = {};
        const aggregateColumnIdSet = new Set(aggregateColumnIds);
        const derivedCellColumnIdsByRowId = new Map<RowId, Set<string>>();

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
            const aggregateValuesByRowId = aggregateColumnIdSet.has(columnId) ?
                this.aggregationResolver.resolveColumnValues(
                    columnId,
                    table,
                    projectionState,
                    idColumn,
                    derivedCellColumnIdsByRowId
                ) :
                void 0;

            for (let j = 0, jEnd = rowIndexes.length; j < jEnd; ++j) {
                const rowId = rowIds[j];
                if (aggregateValuesByRowId) {
                    projectedColumn[j] = (
                        aggregateValuesByRowId.get(rowId) as
                        DataTableCellType
                    );
                    continue;
                }

                const rowIndex = rowIndexes[j];
                projectedColumn[j] = typeof rowIndex === 'number' ?
                    sourceColumn?.[rowIndex] :
                    this.resolveProjectedCellValue(
                        columnId,
                        rowId,
                        table,
                        projectionState,
                        idColumn
                    );
            }

            projectedColumns[columnId] = projectedColumn;
        }

        projectionState.derivedCellColumnIdsByRowId =
            derivedCellColumnIdsByRowId;
        projectedTable.setColumns(projectedColumns);

        const originalRowIndexes = new Array<number | undefined>(
            rowIndexes.length
        );

        for (let i = 0, iEnd = rowIndexes.length; i < iEnd; ++i) {
            const rowIndex = rowIndexes[i];
            if (typeof rowIndex === 'number') {
                originalRowIndexes[i] = table.getOriginalRowIndex(rowIndex);
            } else if (this.injectedAncestorIds?.has(rowIds[i])) {
                const node = this.indexCache?.nodes.get(rowIds[i]);
                originalRowIndexes[i] = node?.rowIndex ?? void 0;
            } else {
                originalRowIndexes[i] = void 0;
            }
        }

        projectedTable.setOriginalRowIndexes(originalRowIndexes);

        return projectedTable;
    }

    /**
     * Returns source column ids configured for TreeView aggregation.
     *
     * @param columnIds
     * Source column ids available in the queried table.
     */
    private getAggregateColumnIds(columnIds: string[]): string[] {
        const aggregateColumnIds: string[] = [];

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            if (this.hasColumnAggregation(columnId)) {
                aggregateColumnIds.push(columnId);
            }
        }

        return aggregateColumnIds;
    }

    /**
     * Resolves a cell value for the projected logical tree before aggregation.
     *
     * @param columnId
     * Source column id.
     *
     * @param rowId
     * Row id in the projected logical tree.
     *
     * @param table
     * Queried table after filtering/sorting and before pagination.
     *
     * @param projectionState
     * Current projected tree state.
     *
     * @param idColumn
     * Column containing stable row IDs.
     */
    private resolveProjectedCellValue(
        columnId: string,
        rowId: RowId,
        table: DataTable,
        projectionState: TreeProjectionState,
        idColumn: string
    ): DataTableCellType {
        const rowIndex = projectionState.sourceRowIndexesById.get(rowId);
        if (typeof rowIndex === 'number') {
            return table.columns[columnId]?.[rowIndex] as DataTableCellType;
        }

        if (this.injectedAncestorIds?.has(rowId)) {
            return this.getSourceTableCellValue(columnId, rowId);
        }

        return this.getGeneratedCellValue(columnId, rowId, idColumn);
    }

    /**
     * Resolves TreeView column options for a source column id.
     *
     * @param sourceColumnId
     * Source column id.
     */
    private getColumnTreeViewOptions(
        sourceColumnId: string
    ): TreeViewColumnOptions | undefined {
        const columnPolicy = this.grid.columnPolicy;
        const defaultOptions = this.grid.options?.columnDefaults?.treeView;
        const directOptions = columnPolicy
            .getIndividualColumnOptions(sourceColumnId)
            ?.treeView;

        if (directOptions) {
            return {
                ...defaultOptions,
                ...directOptions
            };
        }

        const configuredColumnIds = columnPolicy.getColumnIds();
        for (
            let i = 0, iEnd = configuredColumnIds.length;
            i < iEnd;
            ++i
        ) {
            const configuredColumnId = configuredColumnIds[i];
            if (
                columnPolicy.getColumnSourceId(configuredColumnId) !==
                sourceColumnId
            ) {
                continue;
            }

            const mappedOptions = columnPolicy
                .getIndividualColumnOptions(configuredColumnId)
                ?.treeView;

            if (mappedOptions) {
                return {
                    ...defaultOptions,
                    ...mappedOptions
                };
            }
        }

        return defaultOptions;
    }

    /**
     * Resolves aggregation option for a source column id.
     *
     * @param sourceColumnId
     * Source column id.
     */
    private getColumnAggregateOption(
        sourceColumnId: string
    ): (TreeViewColumnAggregateOption | undefined) {
        if (this.isTreeSpecialColumn(sourceColumnId)) {
            return;
        }

        return this.getColumnTreeViewOptions(sourceColumnId)?.aggregate;
    }

    /**
     * Returns whether a source column is reserved for TreeView structure.
     *
     * @param sourceColumnId
     * Source column id.
     */
    private isTreeSpecialColumn(sourceColumnId: string): boolean {
        const idColumn = this.getDataOptions()?.idColumn;
        if (sourceColumnId === idColumn) {
            return true;
        }

        const input = this.options?.input;
        if (!input) {
            return false;
        }

        if (
            input.type === 'path' &&
            sourceColumnId === input.pathColumn
        ) {
            return true;
        }

        return (
            input.type === 'parentId' &&
            sourceColumnId === input.parentIdColumn
        );
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
     * Resolves cell value for an injected ancestor row from the source table.
     *
     * @param columnId
     * Target column ID.
     *
     * @param rowId
     * Ancestor row ID.
     *
     * @returns
     * Cell value from the source table, or `null` when unavailable.
     */
    private getSourceTableCellValue(
        columnId: string,
        rowId: RowId
    ): DataTableCellType {
        const index = this.indexCache;
        const sourceTable = this.cacheSource?.table?.getModified();

        if (!index || !sourceTable) {
            return null;
        }

        const node = index.nodes.get(rowId);
        if (!node || node.rowIndex === null) {
            return null;
        }

        return sourceTable.getCell(columnId, node.rowIndex) as
            DataTableCellType;
    }

}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Browser event that triggered a tree row toggle.
 */
export type TreeRowToggleTriggerEvent = KeyboardEvent | MouseEvent;

/**
 * Shared event payload for tree row toggle events.
 */
interface TreeRowToggleEvent {
    /**
     * Browser event that initiated the toggle, when available.
     */
    originalEvent?: TreeRowToggleTriggerEvent;

    /**
     * Row ID for the toggled tree row.
     */
    rowId: RowId;
}

/**
 * Event payload fired before a tree row toggle.
 */
export interface BeforeTreeRowToggleEvent extends TreeRowToggleEvent {
    /**
     * Expanded state requested by the toggle.
     */
    expanded: boolean;

    /**
     * Whether the toggle was canceled.
     */
    defaultPrevented?: boolean;

    /**
     * Prevents the tree row toggle.
     */
    preventDefault: () => void;
}

/**
 * Event payload fired after a tree row toggle.
 */
export interface AfterTreeRowToggleEvent extends TreeRowToggleEvent {
    /**
     * Expanded state after the toggle.
     */
    expanded: boolean;
}


/* *
 *
 *  Default export
 *
 * */

export default TreeProjectionController;
