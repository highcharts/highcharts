/* *
 *
 *  Grid Row Pinning controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Author:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type { GridEvent } from '../../Core/GridUtils';
import type DataTable from '../../../Data/DataTable';
import type RowPinningView from './RowPinningView';
import type {
    RowObject as RowObjectType,
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type { RowId as DataProviderRowId } from '../../Core/Data/DataProvider';

import {
    hasDataTableProvider
} from '../../Core/Data/DataProvider.js';
import { formatText } from '../../Core/GridUtils.js';
import {
    erase,
    fireEvent,
    isNumber,
    isString
} from '../../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

export type RowId = DataProviderRowId;
export type RowPinningPosition = 'top'|'bottom';
export type RowPinningChangeAction = 'pin'|'unpin'|'toggle';

/**
 * Snapshot of pinned row IDs by section.
 */
export interface RowPinningState {
    topIds: RowId[];
    bottomIds: RowId[];
}

export interface RowPinningChangeEvent {
    rowId: RowId;
    action: RowPinningChangeAction;
    position?: RowPinningPosition;
    index?: number;
    changed: boolean;
    previousTopIds: RowId[];
    previousBottomIds: RowId[];
    topIds: RowId[];
    bottomIds: RowId[];
}

export type RowPinningChangeEventCallback = (
    this: Grid,
    e: GridEvent<Grid> & RowPinningChangeEvent
) => void;

export interface RowPinningEvents {
    beforeRowPin?: RowPinningChangeEventCallback;
    afterRowPin?: RowPinningChangeEventCallback;
}

export interface RowPinningSectionOptions {
    /**
     * Maximum height for this pinned tbody. Enables vertical scrolling in the
     * pinned section when content exceeds this height.
     */
    maxHeight?: number|string;
}

export interface RowPinningOptions {
    enabled?: boolean;
    idColumn?: string;
    topIds?: RowId[];
    bottomIds?: RowId[];
    top?: RowPinningSectionOptions;
    bottom?: RowPinningSectionOptions;
    events?: RowPinningEvents;
    resolve?: (row: RowObjectType) => ('top'|'bottom'|null|undefined);
}

export type GridRowPinningOptions = RowPinningOptions;

export interface RowPinningLangA11yOptions {
    announcements?: {
        pinned?: string;
        unpinned?: string;
    };
    descriptions?: {
        pinnedTop?: string;
        pinnedBottom?: string;
        alsoPinnedTop?: string;
        alsoPinnedBottom?: string;
    };
}

declare module '../../Core/Options' {
    interface CellContextMenuBuiltInActionIdRegistry {
        pinRowTop: never;
        pinRowBottom: never;
        unpinRow: never;
    }

    interface LangOptions {
        pinRowTop?: string;
        pinRowBottom?: string;
        unpinRow?: string;
    }

    interface RowsSettings {
        pinning?: RowPinningOptions;
    }
}

declare module '../../Core/Accessibility/A11yOptions' {
    interface A11yAnnouncementsOptions {
        rowPinning?: boolean;
    }

    interface LangAccessibilityOptions {
        rowPinning?: RowPinningLangA11yOptions;
    }
}

declare module '../../Core/Grid' {
    export default interface Grid {
        rowPinning?: RowPinningController;
    }
}

declare module '../../Core/Table/Table' {
    export default interface Table {
        rowPinningView?: RowPinningView;
    }
}

/**
 * Returns whether row pinning was explicitly configured by the user.
 *
 * @param grid
 * Grid instance options container.
 */
export function hasConfiguredGridRowPinningOptions(
    grid: Pick<Grid, 'userOptions'>
): boolean {
    return grid.userOptions?.rendering?.rows?.pinning !== void 0;
}

/**
 * Returns merged row pinning options from the grid.
 *
 * @param grid
 * Grid instance options container.
 */
export function getGridRowPinningOptions(
    grid: Pick<Grid, 'options'>
): (GridRowPinningOptions | undefined) {
    return grid.options?.rendering?.rows?.pinning;
}

/**
 * Compare row id arrays by value and order.
 *
 * @param a
 * First row id array.
 *
 * @param b
 * Second row id array.
 */
function sameIds(a: RowId[], b: RowId[]): boolean {
    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0, iEnd = a.length; i < iEnd; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Returns whether two pinned row states differ.
 *
 * @param previous
 * Previous pinned row state.
 *
 * @param next
 * Next pinned row state.
 */
function didPinnedRowsChange(
    previous: RowPinningState,
    next: RowPinningState
): boolean {
    return (
        !sameIds(previous.topIds, next.topIds) ||
        !sameIds(previous.bottomIds, next.bottomIds)
    );
}

/**
 * Stores row pinning state from two sources:
 * - explicit pinned ids from config/runtime API
 * - resolved pinned ids produced by `pinning.resolve`
 *
 * The effective pinned state is the normalized combination of both, minus
 * rows explicitly unpinned at runtime.
 */
class RowPinningController {

    /**
     * Owning grid instance.
     */
    public readonly grid: Grid;

    /**
     * Explicitly pinned top row IDs from config or runtime API calls.
     */
    private topRowIds: RowId[] = [];

    /**
     * Explicitly pinned bottom row IDs from config or runtime API calls.
     */
    private bottomRowIds: RowId[] = [];

    /**
     * Top row IDs produced by the `pinning.resolve` callback.
     */
    private resolvedTopRowIds: RowId[] = [];

    /**
     * Bottom row IDs produced by the `pinning.resolve` callback.
     */
    private resolvedBottomRowIds: RowId[] = [];

    /**
     * Set of row IDs that were explicitly unpinned at runtime, overriding
     * resolved pins.
     */
    private explicitUnpinned: Set<RowId> = new Set();

    /**
     * Cache of row data objects for all currently pinned rows.
     */
    private pinnedRowObjects: Map<RowId, RowObjectType> = new Map();

    /**
     * Whether the explicit pinned IDs need to be reloaded from options.
     */
    private optionsDirty = true;

    /**
     * Creates a new row pinning controller for the given grid.
     *
     * @param grid
     * Owning grid instance.
     */
    constructor(grid: Grid) {
        this.grid = grid;
    }

    /**
     * Returns the current row pinning options from the grid.
     */
    public getPinningOptions(): ReturnType<typeof getGridRowPinningOptions> {
        return getGridRowPinningOptions(this.grid);
    }

    /**
     * Reloads explicit pinned IDs from options when they are marked dirty.
     */
    public loadOptions(): void {
        if (!this.optionsDirty) {
            return;
        }

        this.optionsDirty = false;
        const pinningOptions = this.getPinningOptions();
        const top = pinningOptions?.topIds || [];
        const bottom = pinningOptions?.bottomIds || [];

        const normalized = RowPinningController.normalizeSections(top, bottom);

        this.topRowIds = normalized.topIds;
        this.bottomRowIds = normalized.bottomIds;
        this.resolvedTopRowIds.length = 0;
        this.resolvedBottomRowIds.length = 0;
        this.syncPinnedRowObjects();
    }

    /**
     * Marks pinning options as dirty so they are reloaded on the next access.
     */
    public markOptionsDirty(): void {
        this.optionsDirty = true;
    }

    /**
     * Returns whether row pinning is effectively active (any rows are pinned
     * or a resolve function is configured).
     */
    public isEnabled(): boolean {
        this.loadOptions();

        const explicit = this.getExplicitPinnedRows();
        const pinningOptions = this.getPinningOptions();

        return !!(
            explicit.topIds.length ||
            explicit.bottomIds.length ||
            this.resolvedTopRowIds.length ||
            this.resolvedBottomRowIds.length ||
            pinningOptions?.resolve
        );
    }

    /**
     * Returns whether the `enabled` pinning option is not explicitly `false`.
     */
    public isOptionEnabled(): boolean {
        return this.getPinningOptions()?.enabled !== false;
    }

    /**
     * Pins a row to the given section.
     *
     * @param rowId
     * Row identifier to pin.
     *
     * @param position
     * Target section — `'top'` (default) or `'bottom'`.
     *
     * @param index
     * Zero-based insertion index within the section. Appends when omitted.
     */
    public async pin(
        rowId: RowId,
        position: RowPinningPosition = 'top',
        index?: number
    ): Promise<void> {
        const previous = this.getPinnedRows();
        const eventPayload = this.createChangeEvent(
            previous,
            'pin',
            rowId,
            'pin',
            position,
            index
        );

        await this.runRuntimeChange(
            eventPayload,
            async (): Promise<void> => {
                await this.applyPin(rowId, position, index);
            },
            'pin',
            position
        );
    }

    /**
     * Toggles a row between pinned and unpinned state.
     *
     * @param rowId
     * Row identifier to toggle.
     *
     * @param position
     * Section to pin to when the row is currently unpinned.
     */
    public async toggle(
        rowId: RowId,
        position: RowPinningPosition = 'top'
    ): Promise<void> {
        const previous = this.getPinnedRows();
        const isPinned = (
            previous.topIds.includes(rowId) ||
            previous.bottomIds.includes(rowId)
        );
        const nextAction = isPinned ? 'unpin' : 'pin';
        const eventPayload = this.createChangeEvent(
            previous,
            'toggle',
            rowId,
            nextAction,
            isPinned ? void 0 : position
        );

        await this.runRuntimeChange(
            eventPayload,
            async (): Promise<void> => {
                if (isPinned) {
                    this.applyUnpin(rowId);
                } else {
                    await this.applyPin(rowId, position);
                }
            },
            isPinned ? 'unpin' : 'pin',
            isPinned ? void 0 : position
        );
    }

    /**
     * Unpins a row from whichever section it currently belongs to.
     *
     * @param rowId
     * Row identifier to unpin.
     */
    public async unpin(rowId: RowId): Promise<void> {
        const previous = this.getPinnedRows();
        const eventPayload = this.createChangeEvent(
            previous,
            'unpin',
            rowId,
            'unpin'
        );

        await this.runRuntimeChange(
            eventPayload,
            (): void => {
                this.applyUnpin(rowId);
            },
            'unpin'
        );
    }

    /**
     * Returns the pinned row state that would result from applying an action,
     * without mutating any internal state.
     *
     * @param previous
     * Current pinned row state to derive from.
     *
     * @param action
     * Whether to simulate a pin or unpin.
     *
     * @param rowId
     * Row identifier to act on.
     *
     * @param position
     * Target section for a pin action.
     *
     * @param index
     * Insertion index within the section for a pin action.
     */
    public previewPinnedRowsChange(
        previous: RowPinningState,
        action: 'pin'|'unpin',
        rowId: RowId,
        position: RowPinningPosition = 'top',
        index?: number
    ): RowPinningState {
        const topIds = previous.topIds.slice();
        const bottomIds = previous.bottomIds.slice();
        const source = position === 'top' ? topIds : bottomIds;
        const other = position === 'top' ? bottomIds : topIds;

        erase(source, rowId);
        erase(other, rowId);

        if (action === 'pin') {
            if (typeof index === 'number' && index >= 0) {
                source.splice(Math.min(index, source.length), 0, rowId);
            } else {
                source.push(rowId);
            }
        }

        return { topIds, bottomIds };
    }

    /**
     * Replaces the resolved (callback-derived) pinned row IDs.
     *
     * @param topIds
     * Resolved top-section row IDs.
     *
     * @param bottomIds
     * Resolved bottom-section row IDs.
     */
    public setResolvedIds(topIds: RowId[], bottomIds: RowId[]): void {
        const normalized = RowPinningController.normalizeSections(
            topIds,
            bottomIds
        );

        this.resolvedTopRowIds = normalized.topIds;
        this.resolvedBottomRowIds = normalized.bottomIds;
        this.syncPinnedRowObjects();
    }

    /**
     * Removes the given row IDs from the explicit pin lists.
     *
     * @param rowIds
     * Row IDs confirmed to be absent from the data source.
     */
    public pruneMissingExplicitIds(rowIds: RowId[]): void {
        if (!rowIds.length) {
            return;
        }

        const missing = new Set(rowIds);
        this.topRowIds = this.topRowIds.filter((rowId): boolean =>
            !missing.has(rowId)
        );
        this.bottomRowIds = this.bottomRowIds.filter((rowId): boolean =>
            !missing.has(rowId)
        );
        this.syncPinnedRowObjects();
    }

    /**
     * Returns the effective pinned row state — the union of explicit and
     * resolved IDs, deduplicated and filtered by explicit unpins.
     */
    public getPinnedRows(): RowPinningState {
        this.loadOptions();

        const normalized = RowPinningController.normalizeSections(
            [
                ...this.topRowIds,
                ...this.resolvedTopRowIds
            ],
            [
                ...this.bottomRowIds,
                ...this.resolvedBottomRowIds
            ]
        );

        const topIds = normalized.topIds.filter((rowId): boolean =>
            !this.explicitUnpinned.has(rowId)
        );
        const topSet = new Set(topIds);
        const bottomIds = normalized.bottomIds.filter((rowId): boolean =>
            !this.explicitUnpinned.has(rowId) && !topSet.has(rowId)
        );

        return {
            topIds,
            bottomIds
        };
    }

    /**
     * Returns the cached row data object for a pinned row, if available.
     *
     * @param rowId
     * Row identifier to look up.
     */
    public getPinnedRowObject(rowId: RowId): RowObjectType | undefined {
        return this.pinnedRowObjects.get(rowId);
    }

    /**
     * Caches the data object of a materialized row if it is currently pinned.
     *
     * @param rowId
     * Row identifier.
     *
     * @param row
     * Row data object to cache.
     */
    public rememberMaterializedRow(
        rowId: RowId | undefined,
        row: RowObjectType
    ): void {
        if (rowId === void 0 || !this.isPinnedRowId(rowId)) {
            return;
        }

        this.pinnedRowObjects.set(rowId, row);
    }

    /**
     * Attempts to hydrate row data objects for the given pinned row IDs from
     * the materialized viewport rows or the source data table.
     *
     * @param rowIds
     * Pinned row IDs to hydrate.
     */
    public ensurePinnedRowsAvailable(rowIds: RowId[]): Promise<{
        hydratedRowIds: RowId[];
        definitiveMissingRowIds: RowId[];
    }> {
        const hydratedRowIds: RowId[] = [];
        const definitiveMissingRowIds: RowId[] = [];

        if (!rowIds.length) {
            return Promise.resolve({
                hydratedRowIds,
                definitiveMissingRowIds
            });
        }

        const dataProvider = this.grid.dataProvider;
        const dataTable = hasDataTableProvider(dataProvider) ?
            dataProvider.getDataTable() :
            void 0;
        const dataOptions = this.grid.options?.data as (
            { idColumn?: string } | undefined
        );
        const idColumn = dataOptions?.idColumn;
        const sourceRowIndexesMap = (
            dataTable && idColumn ?
                this.getSourceRowIndexesMap(dataTable, idColumn) :
                void 0
        );

        for (const rowId of RowPinningController.uniqueRowIds(rowIds)) {
            if (this.pinnedRowObjects.has(rowId)) {
                continue;
            }

            const row =
                this.getMaterializedRowObjectById(rowId) ||
                this.getSourceRowObjectById(
                    rowId,
                    dataTable,
                    idColumn,
                    sourceRowIndexesMap
                );

            if (row) {
                this.pinnedRowObjects.set(rowId, row);
                hydratedRowIds.push(rowId);
            } else if (
                this.canDeterminePinnedRowAbsence(
                    rowId,
                    dataTable,
                    idColumn,
                    sourceRowIndexesMap
                )
            ) {
                definitiveMissingRowIds.push(rowId);
            } else {
                this.pinnedRowObjects.delete(rowId);
            }
        }

        this.syncPinnedRowObjects();

        return Promise.resolve({
            hydratedRowIds,
            definitiveMissingRowIds
        });
    }

    /**
     * Updates a single cell value in the cached row data object of a pinned
     * row.
     *
     * @param rowId
     * Row identifier whose cache entry to update.
     *
     * @param columnId
     * Column identifier of the cell to update.
     *
     * @param value
     * New cell value.
     */
    public updatePinnedRowValue(
        rowId: RowId,
        columnId: string,
        value: DataTableCellType
    ): void {
        const row = this.pinnedRowObjects.get(rowId);

        if (row) {
            row[columnId] = value;
        }
    }

    /**
     * Clears all cached row data objects, forcing re-hydration on next render.
     */
    public invalidatePinnedRowObjects(): void {
        this.pinnedRowObjects.clear();
    }

    /**
     * Re-runs the `pinning.resolve` callback over all rows in the data
     * provider and updates the resolved pinned IDs accordingly.
     */
    public async recomputeResolvedFromMaterializedRows(): Promise<void> {
        const resolve = this.getPinningOptions()?.resolve;
        const dataProvider = this.grid.dataProvider;
        if (!dataProvider) {
            this.setResolvedIds([], []);
            return;
        }

        if (!resolve) {
            this.setResolvedIds([], []);
            const pinned = this.getPinnedRows();
            await this.ensurePinnedRowsAvailable([
                ...pinned.topIds,
                ...pinned.bottomIds
            ]);
            return;
        }

        const explicit = this.getExplicitPinnedRows();
        const used = new Set<RowId>([
            ...explicit.topIds,
            ...explicit.bottomIds
        ]);
        const topResolved: RowId[] = [];
        const bottomResolved: RowId[] = [];
        const rowCount = await dataProvider.getRowCount();

        for (let i = 0; i < rowCount; ++i) {
            const rowId = await dataProvider.getRowId(i);
            const row = await dataProvider.getRowObject(i);
            if (rowId === void 0 || !row) {
                continue;
            }

            if (used.has(rowId) || this.explicitUnpinned.has(rowId)) {
                continue;
            }

            let position: ('top'|'bottom'|null|undefined);
            try {
                position = resolve(row);
            } catch {
                continue;
            }

            if (position === 'top') {
                topResolved.push(rowId);
                used.add(rowId);
            } else if (position === 'bottom') {
                bottomResolved.push(rowId);
                used.add(rowId);
            }
        }

        this.setResolvedIds(topResolved, bottomResolved);
        const pinned = this.getPinnedRows();
        await this.ensurePinnedRowsAvailable([
            ...pinned.topIds,
            ...pinned.bottomIds
        ]);
    }

    /**
     * Handles missing pinned rows reported after a render cycle by
     * attempting to hydrate them or pruning them from the pin lists.
     *
     * @param result
     * Render result containing IDs of rows that could not be rendered.
     *
     * @param result.missingPinnedRowIds
     * IDs of pinned rows that were not found during the render cycle.
     *
     * @param source
     * Whether the render was triggered by a query cycle or a runtime API call.
     */
    public async handlePinnedRenderResult(
        result: { missingPinnedRowIds: RowId[] },
        source: 'query'|'runtime'
    ): Promise<void> {
        void source;

        if (!result.missingPinnedRowIds.length) {
            return;
        }

        const {
            hydratedRowIds,
            definitiveMissingRowIds
        } = await this.ensurePinnedRowsAvailable(result.missingPinnedRowIds);

        if (definitiveMissingRowIds.length) {
            this.pruneMissingExplicitIds(definitiveMissingRowIds);
        }

        if (
            this.grid.viewport &&
            (hydratedRowIds.length || definitiveMissingRowIds.length)
        ) {
            await this.grid.viewport.rowPinningView?.render(true);
        }
    }

    /**
     * Returns the normalized explicit (non-resolved) pinned row state.
     */
    private getExplicitPinnedRows(): RowPinningState {
        return RowPinningController.normalizeSections(
            this.topRowIds,
            this.bottomRowIds
        );
    }

    /**
     * Mutates internal state to pin a row without firing events.
     *
     * @param rowId
     * Row identifier to pin.
     *
     * @param position
     * Target section.
     *
     * @param index
     * Insertion index within the section.
     */
    private async applyPin(
        rowId: RowId,
        position: RowPinningPosition = 'top',
        index?: number
    ): Promise<void> {
        this.loadOptions();
        this.explicitUnpinned.delete(rowId);

        const next = this.previewPinnedRowsChange(
            this.getExplicitPinnedRows(),
            'pin',
            rowId,
            position,
            index
        );

        this.topRowIds = next.topIds;
        this.bottomRowIds = next.bottomIds;
        await this.ensurePinnedRowsAvailable([rowId]);
    }

    /**
     * Mutates internal state to unpin a row without firing events.
     *
     * @param rowId
     * Row identifier to unpin.
     */
    private applyUnpin(rowId: RowId): void {
        this.loadOptions();
        const next = this.previewPinnedRowsChange(
            this.getExplicitPinnedRows(),
            'unpin',
            rowId
        );

        this.topRowIds = next.topIds;
        this.bottomRowIds = next.bottomIds;
        this.explicitUnpinned.add(rowId);
        this.pinnedRowObjects.delete(rowId);
    }

    /**
     * Builds the event payload for a pin/unpin/toggle operation.
     *
     * @param previous
     * Pinned row state before the change.
     *
     * @param action
     * Public action name (`'pin'`, `'unpin'`, or `'toggle'`).
     *
     * @param rowId
     * Row identifier being acted on.
     *
     * @param nextAction
     * Resolved action to apply (`'pin'` or `'unpin'`).
     *
     * @param position
     * Target section for a pin action.
     *
     * @param index
     * Insertion index within the section for a pin action.
     */
    private createChangeEvent(
        previous: RowPinningState,
        action: RowPinningChangeAction,
        rowId: RowId,
        nextAction: 'pin'|'unpin',
        position?: RowPinningPosition,
        index?: number
    ): RowPinningChangeEvent {
        const next = this.previewPinnedRowsChange(
            previous,
            nextAction,
            rowId,
            position,
            index
        );

        return {
            rowId,
            action,
            position,
            index,
            changed: didPinnedRowsChange(previous, next),
            previousTopIds: previous.topIds.slice(),
            previousBottomIds: previous.bottomIds.slice(),
            topIds: next.topIds.slice(),
            bottomIds: next.bottomIds.slice()
        };
    }

    /**
     * Fires events, applies a pin/unpin mutation, triggers a render, and
     * announces the change for accessibility.
     *
     * @param eventPayload
     * Pre-built event payload describing the change.
     *
     * @param applyChange
     * Callback that mutates the internal pin state.
     *
     * @param announcementAction
     * Whether to announce a pin or unpin for accessibility.
     *
     * @param announcementPosition
     * Section to include in the pin announcement.
     */
    private async runRuntimeChange(
        eventPayload: RowPinningChangeEvent,
        applyChange: () => Promise<void> | void,
        announcementAction: 'pin'|'unpin',
        announcementPosition?: RowPinningPosition
    ): Promise<void> {
        const { grid } = this;
        const compensationState = eventPayload.changed ?
            grid.viewport?.rowPinningView?.captureViewportCompensation(
                eventPayload.rowId
            ) :
            void 0;

        fireEvent(grid, 'beforeRowPin', eventPayload);
        this.callEventCallback('beforeRowPin', eventPayload);

        await applyChange();

        if (grid.viewport && grid.querying.pagination.enabled) {
            await grid.viewport.rowsVirtualizer.refreshRows();
        }

        const renderResult = grid.viewport ?
            await grid.viewport.rowPinningView?.render(true) ||
                { missingPinnedRowIds: [] } :
            { missingPinnedRowIds: [] };

        await this.handlePinnedRenderResult(renderResult, 'runtime');
        grid.viewport?.reflow();
        if (compensationState) {
            grid.viewport?.rowPinningView?.restoreViewportCompensation(
                compensationState
            );
        }

        if (
            announcementAction === 'pin' &&
            eventPayload.changed &&
            eventPayload.position
        ) {
            grid.viewport?.rowPinningView?.revealRowInSection(
                eventPayload.rowId,
                eventPayload.position
            );
        }

        fireEvent(grid, 'afterRowPin', eventPayload);
        this.callEventCallback('afterRowPin', eventPayload);

        if (eventPayload.changed) {
            this.announceChange(
                announcementAction,
                eventPayload.rowId,
                announcementPosition
            );
        }
    }

    /**
     * Invokes the user-configured event callback for a pin change event.
     *
     * @param eventName
     * Event name to look up in the pinning options.
     *
     * @param eventPayload
     * Event payload to pass to the callback.
     */
    private callEventCallback(
        eventName: 'beforeRowPin'|'afterRowPin',
        eventPayload: RowPinningChangeEvent
    ): void {
        const callback = this.getPinningOptions()?.events?.[eventName];

        if (!callback) {
            return;
        }

        callback.call(this.grid, {
            target: this.grid,
            ...eventPayload
        } as (GridEvent<Grid> & RowPinningChangeEvent));
    }

    /**
     * Sends an accessibility announcement for a completed pin/unpin change.
     *
     * @param action
     * Whether the row was pinned or unpinned.
     *
     * @param rowId
     * Row identifier that was changed.
     *
     * @param position
     * Section the row was pinned to (only relevant for pin actions).
     */
    private announceChange(
        action: 'pin'|'unpin',
        rowId: RowId,
        position?: RowPinningPosition
    ): void {
        const { grid } = this;

        if (!grid.options?.accessibility?.announcements?.rowPinning) {
            return;
        }

        const lang = grid.options?.lang?.accessibility?.rowPinning
            ?.announcements;
        let msg: string | undefined;

        if (action === 'pin' && position) {
            msg = formatText(lang?.pinned || '', {
                rowId: String(rowId),
                position
            });
        } else {
            msg = formatText(lang?.unpinned || '', {
                rowId: String(rowId)
            });
        }

        if (msg) {
            grid.accessibility?.announce(msg, true);
        }
    }

    /**
     * Prunes cached pinned row objects for rows that are no longer pinned.
     *
     * @param state
     * Explicit pinned state snapshot. When omitted, the current state is used.
     */
    private syncPinnedRowObjects(state?: RowPinningState): void {
        const pinned = state || this.getPinnedRows();
        const activeIds = new Set<RowId>([
            ...pinned.topIds,
            ...pinned.bottomIds
        ]);

        for (const rowId of this.pinnedRowObjects.keys()) {
            if (!activeIds.has(rowId)) {
                this.pinnedRowObjects.delete(rowId);
            }
        }
    }

    /**
     * Returns whether a row ID appears in the effective pinned row state.
     *
     * @param rowId
     * Row identifier to check.
     *
     * @param state
     * Pinned row state to check against. Defaults to the current state.
     */
    private isPinnedRowId(
        rowId: RowId,
        state: RowPinningState = this.getPinnedRows()
    ): boolean {
        return (
            state.topIds.includes(rowId) ||
            state.bottomIds.includes(rowId)
        );
    }

    /**
     * Returns the row data object from a currently rendered viewport row.
     *
     * @param rowId
     * Row identifier to look up.
     */
    private getMaterializedRowObjectById(
        rowId: RowId
    ): RowObjectType | undefined {
        return this.grid.viewport?.getRow(rowId)?.data;
    }

    /**
     * Returns the row data object from the source data table by row ID.
     *
     * @param rowId
     * Row identifier to look up.
     *
     * @param dataTable
     * Source data table to search.
     *
     * @param idColumn
     * Column name used as the row identifier.
     *
     * @param sourceRowIndexesMap
     * Pre-built map from row ID to row index for `idColumn` lookups.
     */
    private getSourceRowObjectById(
        rowId: RowId,
        dataTable?: DataTable,
        idColumn?: string,
        sourceRowIndexesMap?: Map<RowId, number>
    ): RowObjectType | undefined {
        const rowIndex = this.getSourceRowIndexById(
            rowId,
            dataTable,
            idColumn,
            sourceRowIndexesMap
        );

        if (!dataTable || rowIndex === void 0) {
            return;
        }

        return dataTable.getRowObject(rowIndex);
    }

    /**
     * Returns the numeric row index in the source data table for a given row
     * ID.
     *
     * @param rowId
     * Row identifier to resolve.
     *
     * @param dataTable
     * Source data table.
     *
     * @param idColumn
     * Column name used as the row identifier.
     *
     * @param sourceRowIndexesMap
     * Pre-built map from row ID to row index for `idColumn` lookups.
     */
    private getSourceRowIndexById(
        rowId: RowId,
        dataTable?: DataTable,
        idColumn?: string,
        sourceRowIndexesMap?: Map<RowId, number>
    ): number | undefined {
        if (!dataTable) {
            return;
        }

        if (idColumn) {
            return sourceRowIndexesMap?.get(rowId);
        }

        if (isNumber(rowId)) {
            return rowId;
        }
    }

    /**
     * Builds a map from row ID to row index by scanning `idColumn` in the
     * source data table.
     *
     * @param dataTable
     * Source data table to scan.
     *
     * @param idColumn
     * Column name whose values are the row identifiers.
     */
    private getSourceRowIndexesMap(
        dataTable: DataTable,
        idColumn: string
    ): Map<RowId, number> | undefined {
        const idColumnValues = dataTable.getColumn(idColumn, true) as
            Array<RowId | undefined> | undefined;

        if (!idColumnValues) {
            return;
        }

        const rowIndexes = new Map<RowId, number>();

        for (let i = 0, iEnd = idColumnValues.length; i < iEnd; ++i) {
            const rowId = idColumnValues[i];

            if (isString(rowId) || isNumber(rowId)) {
                rowIndexes.set(rowId, i);
            }
        }

        return rowIndexes;
    }

    /**
     * Returns whether the data source has enough information to confirm that a
     * row ID does not exist (as opposed to simply not being loaded yet).
     *
     * @param rowId
     * Row identifier to verify.
     *
     * @param dataTable
     * Source data table.
     *
     * @param idColumn
     * Column name used as the row identifier.
     *
     * @param sourceRowIndexesMap
     * Pre-built map from row ID to row index for `idColumn` lookups.
     */
    private canDeterminePinnedRowAbsence(
        rowId: RowId,
        dataTable?: DataTable,
        idColumn?: string,
        sourceRowIndexesMap?: Map<RowId, number>
    ): boolean {
        if (!dataTable) {
            return false;
        }

        if (idColumn) {
            return !!sourceRowIndexesMap;
        }

        return isNumber(rowId);
    }

    /**
     * Deduplicates and resolves conflicts between top and bottom ID arrays,
     * giving priority to top.
     *
     * @param topIds
     * Candidate top-section row IDs.
     *
     * @param bottomIds
     * Candidate bottom-section row IDs.
     */
    private static normalizeSections(
        topIds: RowId[],
        bottomIds: RowId[]
    ): RowPinningState {
        const uniqueTopIds = RowPinningController.uniqueRowIds(topIds);
        const topSet = new Set(uniqueTopIds);
        const uniqueBottomIds = RowPinningController.uniqueRowIds(bottomIds)
            .filter((rowId): boolean => !topSet.has(rowId));

        return {
            topIds: uniqueTopIds,
            bottomIds: uniqueBottomIds
        };
    }

    /**
     * Filters an array to unique, valid row IDs (strings and numbers only).
     *
     * @param values
     * Raw values to filter and deduplicate.
     */
    private static uniqueRowIds(values: unknown[]): RowId[] {
        const result: RowId[] = [];
        const seen = new Set<RowId>();

        for (const value of values) {
            if (!isNumber(value) && !isString(value)) {
                continue;
            }

            if (seen.has(value)) {
                continue;
            }

            seen.add(value);
            result.push(value);
        }

        return result;
    }
}

export default RowPinningController;
