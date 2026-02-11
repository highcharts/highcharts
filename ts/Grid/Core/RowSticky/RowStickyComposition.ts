/* *
 *
 *  Grid RowSticky composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Mikkel Espolin Birkeland
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../Grid';
import type { RowId } from '../Data/DataProvider';

import Globals from '../Globals.js';
import RowStickyController from './RowStickyController.js';
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    pushUnique
} = U;


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the grid with sticky row runtime APIs and lifecycle wiring.
 *
 * @param GridClass
 * The grid class constructor.
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'RowSticky')) {
        return;
    }

    addEvent(GridClass, 'beforeLoad', initRowStickyController);

    const gridProto = GridClass.prototype as Grid;

    if (!gridProto.stickRow) {
        gridProto.stickRow = function (
            this: Grid,
            rowId: RowId,
            index?: number
        ): Promise<void> {
            this.rowSticky?.stickRow(rowId, index);
            this.querying.shouldBeUpdated = true;
            this.dirtyFlags.add('rows');
            return this.redraw();
        };
    }

    if (!gridProto.unstickRow) {
        gridProto.unstickRow = function (
            this: Grid,
            rowId: RowId
        ): Promise<void> {
            this.rowSticky?.unstickRow(rowId);
            this.querying.shouldBeUpdated = true;
            this.dirtyFlags.add('rows');
            return this.redraw();
        };
    }

    if (!gridProto.getStickyRows) {
        gridProto.getStickyRows = function (this: Grid): RowId[] {
            return this.rowSticky?.getStickyRows() || [];
        };
    }
}

/**
 * Initializes row sticky controller on grid startup.
 */
function initRowStickyController(this: Grid): void {
    this.rowSticky = new RowStickyController(this);
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../Grid' {
    export default interface Grid {
        rowSticky?: RowStickyController;
        stickRow?: (rowId: RowId, index?: number) => Promise<void>;
        unstickRow?: (rowId: RowId) => Promise<void>;
        getStickyRows?: () => RowId[];
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
