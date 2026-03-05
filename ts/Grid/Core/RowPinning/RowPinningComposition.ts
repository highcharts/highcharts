/* *
 *
 *  Grid Row Pinning composition
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
import type { DeepPartial } from '../../../Shared/Types';
import type Options from '../../Core/Options';
import type { RowObject as DataTableRowObject } from '../../../Data/DataTable';
import type { GridEvent } from '../../Core/GridUtils';
import type { RowId } from '../Data/DataProvider';

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import GridUtils from '../../Core/GridUtils.js';
import RowPinningController from './RowPinningController.js';
import U from '../../../Core/Utilities.js';

const { formatText } = GridUtils;
const {
    addEvent,
    fireEvent,
    merge,
    pushUnique
} = U;

/**
 * Default options for row pinning.
 */
export const defaultOptions: DeepPartial<Options> = {
    rendering: {
        rows: {
            pinning: {
                enabled: true,
                topIds: [],
                bottomIds: [],
                events: {},
                top: {},
                bottom: {}
            }
        }
    }
};

/* *
 *
 *  Composition
 *
 * */

/**
 * Compose row pinning APIs into Grid.
 *
 * @param GridClass
 * Grid class constructor.
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'RowPinning')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);

    addEvent(GridClass, 'beforeLoad', initRowPinning);
    GridClass.prototype.pinRow = pinRow;
    GridClass.prototype.toggleRow = toggleRow;
    GridClass.prototype.unpinRow = unpinRow;
    GridClass.prototype.getPinnedRows = getPinnedRows;
}

/**
 * Initialize row pinning controller before grid options are loaded.
 */
function initRowPinning(this: Grid): void {
    this.rowPinning = new RowPinningController(this);
    this.rowPinning.loadOptions();
}

/**
 * Announce a row pinning change to screen readers.
 *
 * @param grid
 * Grid instance.
 *
 * @param action
 * Whether the row was pinned or unpinned.
 *
 * @param rowId
 * The row ID that changed.
 *
 * @param position
 * Pin position (only relevant when action is 'pin').
 */
function announceRowPinningChange(
    grid: Grid,
    action: 'pin'|'unpin',
    rowId: GridRowId,
    position?: RowPinningPosition
): void {
    if (!grid.options?.accessibility?.announcements?.rowPinning) {
        return;
    }

    const lang = grid.options?.lang?.accessibility?.rowPinning?.announcements;
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
 * Calls configured row pinning event callbacks from `pinning.events`.
 *
 * @param grid
 * Grid instance.
 *
 * @param eventName
 * Row pinning event callback name.
 *
 * @param eventPayload
 * Event payload object.
 */
function callRowPinningEventCallback(
    grid: Grid,
    eventName: keyof RowPinningEvents,
    eventPayload: RowPinningChangeEvent
): void {
    const callback = (
        grid.options?.rendering?.rows?.pinning?.events?.[eventName] ||
        grid.userOptions?.rendering?.rows?.pinning?.events?.[eventName]
    );

    const callbackEvent = {
        target: grid,
        ...eventPayload
    } as (GridEvent<Grid> & RowPinningChangeEvent);

    callback?.call(grid, callbackEvent);
}

/**
 * Compare row id arrays by value and order.
 *
 * @param a
 * First row id list.
 *
 * @param b
 * Second row id list.
 */
function sameIds(a: GridRowId[], b: GridRowId[]): boolean {
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
 * Compute next pinned state without mutating controller.
 *
 * @param previous
 * Previous pinned state snapshot.
 *
 * @param previous.topIds
 * Previous top-pinned row IDs.
 *
 * @param previous.bottomIds
 * Previous bottom-pinned row IDs.
 *
 * @param action
 * Runtime pinning action.
 *
 * @param rowId
 * Row identifier to pin/unpin.
 *
 * @param position
 * Target pinning position for pin actions.
 *
 * @param index
 * Optional insertion index in target collection.
 */
function computeNextPinnedIds(
    previous: { topIds: GridRowId[]; bottomIds: GridRowId[] },
    action: 'pin'|'unpin',
    rowId: GridRowId,
    position?: RowPinningPosition,
    index?: number
): { topIds: GridRowId[]; bottomIds: GridRowId[] } {
    const topIds = previous.topIds.slice();
    const bottomIds = previous.bottomIds.slice();

    const topIdx = topIds.indexOf(rowId);
    if (topIdx !== -1) {
        topIds.splice(topIdx, 1);
    }

    const bottomIdx = bottomIds.indexOf(rowId);
    if (bottomIdx !== -1) {
        bottomIds.splice(bottomIdx, 1);
    }

    if (action === 'pin' && position) {
        const target = position === 'top' ? topIds : bottomIds;
        if (typeof index === 'number' && index >= 0) {
            target.splice(Math.min(index, target.length), 0, rowId);
        } else {
            target.push(rowId);
        }
    }

    return { topIds, bottomIds };
}

/**
 * Execute shared runtime pinning sequence.
 *
 * @param eventPayload
 * Event payload passed to before/after row pinning hooks.
 *
 * @param applyChange
 * Callback that mutates pinning state and provider cache hooks.
 *
 * @param announcementAction
 * Announcement action for accessibility.
 *
 * @param announcementPosition
 * Optional pinning position used by pin announcements.
 */
async function runRuntimePinningChange(
    this: Grid,
    eventPayload: RowPinningChangeEvent,
    applyChange: () => Promise<void> | void,
    announcementAction: 'pin'|'unpin',
    announcementPosition?: RowPinningPosition
): Promise<void> {
    fireEvent(this, 'beforeRowPin', eventPayload);
    callRowPinningEventCallback(this, 'beforeRowPin', eventPayload);

    await applyChange();

    const renderResult = this.viewport ?
        await this.viewport.renderPinnedRows(true) :
        { missingPinnedRowIds: [] };

    await this.rowPinning?.handlePinnedRenderResult(renderResult, 'runtime');
    this.viewport?.reflow();
    if (
        announcementAction === 'pin' &&
        eventPayload.changed &&
        eventPayload.position
    ) {
        this.viewport?.revealPinnedRowInSection(
            eventPayload.rowId,
            eventPayload.position
        );
    }

    fireEvent(this, 'afterRowPin', eventPayload);
    callRowPinningEventCallback(this, 'afterRowPin', eventPayload);
    announceRowPinningChange(
        this,
        announcementAction,
        eventPayload.rowId,
        announcementPosition
    );
}

/**
 * Pin a row in runtime and re-render pinned sections only.
 *
 * @param rowId
 * Row identifier to pin.
 *
 * @param position
 * Pin target section.
 *
 * @param index
 * Optional insert index for pinned order.
 */
async function pinRow(
    this: Grid,
    rowId: GridRowId,
    position: RowPinningPosition = 'top',
    index?: number
): Promise<void> {
    if (!this.rowPinning?.isOptionEnabled()) {
        return;
    }

    const previous = this.rowPinning.getPinnedRows();
    const next = computeNextPinnedIds(previous, 'pin', rowId, position, index);
    const eventPayload = {
        rowId,
        action: 'pin',
        position,
        index,
        changed: (
            !sameIds(previous.topIds, next.topIds) ||
            !sameIds(previous.bottomIds, next.bottomIds)
        ),
        previousTopIds: previous.topIds.slice(),
        previousBottomIds: previous.bottomIds.slice(),
        topIds: next.topIds.slice(),
        bottomIds: next.bottomIds.slice()
    } as RowPinningChangeEvent;

    await runRuntimePinningChange.call(
        this,
        eventPayload,
        async (): Promise<void> => {
            this.rowPinning?.pinRow(rowId, position, index);
            await this.dataProvider?.primePinnedRows([rowId]);
        },
        'pin',
        position
    );
}

/**
 * Toggle row pinning.
 *
 * @param rowId
 * Row identifier to toggle.
 *
 * @param position
 * Pin target section when toggling into pinned state.
 */
async function toggleRow(
    this: Grid,
    rowId: GridRowId,
    position: RowPinningPosition = 'top'
): Promise<void> {
    if (!this.rowPinning?.isOptionEnabled()) {
        return;
    }

    const previous = this.rowPinning.getPinnedRows();
    const isPinned = (
        previous.topIds.includes(rowId) ||
        previous.bottomIds.includes(rowId)
    );
    const next = computeNextPinnedIds(
        previous,
        isPinned ? 'unpin' : 'pin',
        rowId,
        isPinned ? void 0 : position
    );
    const eventPayload = {
        rowId,
        action: 'toggle',
        position: isPinned ? void 0 : position,
        changed: (
            !sameIds(previous.topIds, next.topIds) ||
            !sameIds(previous.bottomIds, next.bottomIds)
        ),
        previousTopIds: previous.topIds.slice(),
        previousBottomIds: previous.bottomIds.slice(),
        topIds: next.topIds.slice(),
        bottomIds: next.bottomIds.slice()
    } as RowPinningChangeEvent;

    await runRuntimePinningChange.call(
        this,
        eventPayload,
        async (): Promise<void> => {
            if (isPinned) {
                this.rowPinning?.unpinRow(rowId);
                this.dataProvider?.clearPinnedRowCache(rowId);
            } else {
                this.rowPinning?.pinRow(rowId, position);
                await this.dataProvider?.primePinnedRows([rowId]);
            }
        },
        isPinned ? 'unpin' : 'pin',
        isPinned ? void 0 : position
    );
}

/**
 * Unpin a row in runtime and re-render pinned sections only.
 *
 * @param rowId
 * Row identifier to unpin.
 */
async function unpinRow(
    this: Grid,
    rowId: GridRowId
): Promise<void> {
    if (!this.rowPinning?.isOptionEnabled()) {
        return;
    }

    const previous = this.rowPinning.getPinnedRows();
    const next = computeNextPinnedIds(previous, 'unpin', rowId);
    const eventPayload = {
        rowId,
        action: 'unpin',
        changed: (
            !sameIds(previous.topIds, next.topIds) ||
            !sameIds(previous.bottomIds, next.bottomIds)
        ),
        previousTopIds: previous.topIds.slice(),
        previousBottomIds: previous.bottomIds.slice(),
        topIds: next.topIds.slice(),
        bottomIds: next.bottomIds.slice()
    } as RowPinningChangeEvent;

    await runRuntimePinningChange.call(
        this,
        eventPayload,
        (): void => {
            this.rowPinning?.unpinRow(rowId);
            this.dataProvider?.clearPinnedRowCache(rowId);
        },
        'unpin'
    );
}

/**
 * Return a copy of current pinned rows state.
 */
function getPinnedRows(
    this: Grid
): { topIds: GridRowId[]; bottomIds: GridRowId[] } {
    return this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };
}

/* *
 *
 *  Declarations
 *
 * */

export type RowPinningPosition = 'top'|'bottom';
export type GridRowId = RowId;
export type RowPinningChangeAction = 'pin'|'unpin'|'toggle';

export interface RowPinningChangeEvent {
    rowId: GridRowId;
    action: RowPinningChangeAction;
    position?: RowPinningPosition;
    index?: number;
    changed: boolean;
    previousTopIds: GridRowId[];
    previousBottomIds: GridRowId[];
    topIds: GridRowId[];
    bottomIds: GridRowId[];
}

export type RowPinningChangeEventCallback = (
    this: Grid,
    e: GridEvent<Grid> & RowPinningChangeEvent
) => void;

export interface RowPinningEvents {
    /**
     * Callback function to be called before runtime row pinning state changes
     * are redrawn (Grid Pro).
     */
    beforeRowPin?: RowPinningChangeEventCallback;

    /**
     * Callback function to be called after runtime row pinning state changes
     * are redrawn (Grid Pro).
     */
    afterRowPin?: RowPinningChangeEventCallback;
}

declare module '../../Core/Options' {
    interface RowsSettings {
        /**
         * Row pinning options.
         */
        pinning?: RowPinningOptions;
    }
}

declare module '../../Core/Grid' {
    export default interface Grid {
        /**
         * Row pinning controller instance.
         */
        rowPinning?: RowPinningController;

        /**
         * Pin a row to top or bottom.
         */
        pinRow(
            rowId: GridRowId,
            position?: RowPinningPosition,
            index?: number
        ): Promise<void>;

        /**
         * Toggle row pinning. If already pinned, unpin it; otherwise pin to
         * selected position (defaults to top).
         */
        toggleRow(
            rowId: GridRowId,
            position?: RowPinningPosition
        ): Promise<void>;

        /**
         * Remove row pinning for a row.
         */
        unpinRow(rowId: GridRowId): Promise<void>;

        /**
         * Return currently pinned row IDs.
         */
        getPinnedRows(): {
            topIds: GridRowId[];
            bottomIds: GridRowId[];
        };
    }
}

export interface RowPinningOptions {
    /**
     * Enable/disable row pinning behavior.
     */
    enabled?: boolean;

    /**
     * Column used as stable row identity for row pinning.
     */
    idColumn?: string;
    topIds?: GridRowId[];
    bottomIds?: GridRowId[];
    top?: RowPinningSectionOptions;
    bottom?: RowPinningSectionOptions;
    events?: RowPinningEvents;
    resolve?: (row: DataTableRowObject) => ('top'|'bottom'|null|undefined);
}

export interface RowPinningSectionOptions {
    /**
     * Maximum height for this pinned tbody. Enables vertical scrolling in the
     * pinned section when content exceeds this height.
     */
    maxHeight?: number|string;
}

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
