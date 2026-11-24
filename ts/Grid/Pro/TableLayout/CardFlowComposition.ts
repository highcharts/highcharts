/* *
 *
 *  Experimental wrapping cards
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type Table from '../../Core/Table/Table';

import Globals from '../../Core/Globals.js';
import { addEvent, defined, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Wraps one-cell rows into a card grid that follows the container width.
 * Delete this file, its CSS, the `compose()` call and the `flow` value to
 * remove the experiment. Core is unchanged.
 *
 * @param GridClass
 * Grid constructor to extend.
 *
 * @param TableClass
 * Table constructor to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table
): void {
    if (!pushUnique(Globals.composed, 'CardFlow')) {
        return;
    }

    addEvent(GridClass, 'beforeRenderViewport', disableVirtualization);
    addEvent(TableClass, 'beforeInit', applyFlowClass);
    addEvent(TableClass, 'afterReflow', clearFixedWidths);
}

/**
 * Core turns virtualization on from `userOptions` once the row or column
 * count passes the threshold. A wrapped card is missing from the DOM then,
 * so the mode forces both off unless the caller set them.
 *
 * @param this
 * Grid that is about to render.
 */
function disableVirtualization(this: Grid): void {
    if (!isFlow(this)) {
        return;
    }

    const userOptions = this.userOptions;
    const rendering = userOptions.rendering ?? (
        userOptions.rendering = {}
    );
    const rows = rendering.rows ?? (rendering.rows = {});
    const columns = rendering.columns ?? (rendering.columns = {});

    if (!defined(rows.virtualization)) {
        rows.virtualization = false;
    }

    if (!defined(columns.virtualization)) {
        columns.virtualization = false;
    }
}

/**
 * Adds the flow class before the table measures its rows.
 *
 * @param this
 * Table that is about to initialize.
 */
function applyFlowClass(this: Table): void {
    if (!isFlow(this.grid)) {
        return;
    }

    this.tableElement.classList.add(Globals.getClassName('layoutFlow'));
}

/**
 * Column layout writes a pixel width on every row and cell. That width is
 * the full table, so a card could never shrink into the next row.
 *
 * @param this
 * Table that just measured its columns.
 */
function clearFixedWidths(this: Table): void {
    if (!isFlow(this.grid)) {
        return;
    }

    const rows = this.rows;

    for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
        const row = rows[i];

        row.htmlElement.style.width = '';
        row.htmlElement.style.paddingLeft = '';

        const cells = row.cells;

        for (let j = 0, jEnd = cells.length; j < jEnd; ++j) {
            const cell = cells[j].htmlElement;

            cell.style.width = '';
            cell.style.maxWidth = '';
        }
    }
}

/**
 * Returns whether the grid is in the experimental flow layout.
 *
 * @param grid
 * Grid instance to read.
 */
function isFlow(grid: Grid): boolean {
    return grid.options?.rendering?.table?.layout === 'flow';
}


/* *
 *
 *  Default Export
 *
 * */

export default { compose };
