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
    merge,
    pushUnique
} = U;

/**
 * Default options for row pinning.
 */
export const defaultOptions: DeepPartial<Options> = {
    rendering: {
        rows: {
            pinned: {
                top: [],
                bottom: [],
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
    rowId: (string|number),
    position: RowPinningPosition = 'top',
    index?: number
): Promise<void> {
    this.rowPinning?.pinRow(rowId, position, index);
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
    rowId: (string|number)
): Promise<void> {
    this.rowPinning?.unpinRow(rowId);
    this.querying.shouldBeUpdated = true;
    this.dirtyFlags.add('rows');
    await this.redraw();
}

/**
 * Return a copy of current pinned rows state.
 */
function getPinnedRows(
    this: Grid
): { top: (string|number)[]; bottom: (string|number)[] } {
    return this.rowPinning?.getPinnedRows() || {
        top: [],
        bottom: []
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

declare module '../../Core/Options' {
    interface RowsSettings {
        /**
         * Row pinning options.
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
         * Remove row pinning for a row.
         */
        unpinRow(rowId: GridRowId): Promise<void>;

        /**
         * Return currently pinned row IDs.
         */
        getPinnedRows(): {
            top: GridRowId[];
            bottom: GridRowId[];
        };
    }
}

export interface RowPinningOptions {
    /**
     * Column used as stable row identity for row pinning.
     */
    idColumn?: string;
    top?: GridRowId[];
    bottom?: GridRowId[];
    maxTopHeight?: number|string;
    maxBottomHeight?: number|string;
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
