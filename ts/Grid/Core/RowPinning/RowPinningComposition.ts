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

import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import Globals from '../../Core/Globals.js';
import RowPinningController from './RowPinningController.js';
import U from '../../../Core/Utilities.js';

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
                topIds: [],
                bottomIds: [],
                sorting: 'exclude',
                filtering: 'exclude'
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
 * Compare row id arrays by value and order.
 *
 * @param a
 * First row id list.
 *
 * @param b
 * Second row id list.
 *
 * @return
 * Whether both lists have identical ids in the same order.
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
 * Pin a row in runtime and trigger redraw.
 *
 * @param rowId
 * Row ID to pin.
 *
 * @param position
 * Pin position.
 *
 * @param index
 * Optional insertion index in the pinned collection.
 */
async function pinRow(
    this: Grid,
    rowId: GridRowId,
    position: RowPinningPosition = 'top',
    index?: number
): Promise<void> {
    const previous = this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };

    this.rowPinning?.pinRow(rowId, position, index);

    const next = this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };
    fireEvent(this, 'rowPinningChanged', {
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
    } as RowPinningChangedEvent);

    this.querying.shouldBeUpdated = true;
    this.dirtyFlags.add('rows');
    await this.redraw();
}

/**
 * Toggle row pinning for a row. If already pinned, unpin it; otherwise pin to
 * top.
 *
 * @param rowId
 * Row ID to toggle.
 */
async function toggleRow(
    this: Grid,
    rowId: GridRowId
): Promise<void> {
    const previous = this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };
    const pinnedRows = previous;
    const isPinned = (
        pinnedRows.topIds.includes(rowId) ||
        pinnedRows.bottomIds.includes(rowId)
    );

    if (isPinned) {
        this.rowPinning?.unpinRow(rowId);
    } else {
        this.rowPinning?.pinRow(rowId, 'top');
    }

    const next = this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };
    fireEvent(this, 'rowPinningChanged', {
        rowId,
        action: 'toggle',
        position: isPinned ? void 0 : 'top',
        changed: (
            !sameIds(previous.topIds, next.topIds) ||
            !sameIds(previous.bottomIds, next.bottomIds)
        ),
        previousTopIds: previous.topIds.slice(),
        previousBottomIds: previous.bottomIds.slice(),
        topIds: next.topIds.slice(),
        bottomIds: next.bottomIds.slice()
    } as RowPinningChangedEvent);

    this.querying.shouldBeUpdated = true;
    this.dirtyFlags.add('rows');
    await this.redraw();
}

/**
 * Unpin a row in runtime and trigger redraw.
 *
 * @param rowId
 * Row ID to unpin.
 */
async function unpinRow(
    this: Grid,
    rowId: GridRowId
): Promise<void> {
    const previous = this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };

    this.rowPinning?.unpinRow(rowId);

    const next = this.rowPinning?.getPinnedRows() || {
        topIds: [],
        bottomIds: []
    };
    fireEvent(this, 'rowPinningChanged', {
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
    } as RowPinningChangedEvent);

    this.querying.shouldBeUpdated = true;
    this.dirtyFlags.add('rows');
    await this.redraw();
}

/**
 * Return a copy of current pinned rows state.
 */
function getPinnedRows(
    this: Grid
): { topIds: (string|number)[]; bottomIds: (string|number)[] } {
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
export type RowPinningMode = 'exclude'|'include';
export type GridRowId = (string|number);
export type RowPinningChangedAction = 'pin'|'unpin'|'toggle';

export interface RowPinningChangedEvent {
    rowId: GridRowId;
    action: RowPinningChangedAction;
    position?: RowPinningPosition;
    index?: number;
    changed: boolean;
    previousTopIds: GridRowId[];
    previousBottomIds: GridRowId[];
    topIds: GridRowId[];
    bottomIds: GridRowId[];
}

declare module '../../Core/Options' {
    interface RowsSettings {
        /**
         * Row pinning options.
         */
        pinning?: RowPinningOptions;

        /**
         * @deprecated Use `pinning` instead.
         */
        pinned?: RowPinningOptions;
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
         * top.
         */
        toggleRow(rowId: GridRowId): Promise<void>;

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
     * Column used as stable row identity for row pinning.
     */
    idColumn?: string;
    topIds?: GridRowId[];
    bottomIds?: GridRowId[];

    /**
     * @deprecated Use `topIds` instead.
     */
    top?: GridRowId[];

    /**
     * @deprecated Use `bottomIds` instead.
     */
    bottom?: GridRowId[];
    resolve?: (row: DataTableRowObject) => ('top'|'bottom'|null|undefined);
    sorting?: RowPinningMode;
    filtering?: RowPinningMode;
}

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
