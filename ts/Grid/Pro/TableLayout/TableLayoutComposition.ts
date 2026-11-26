/* *
 *
 *  Grid table layout composition
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
 *  Declarations
 *
 * */

type TableLayout = 'matrix';


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the grid with a table body layout.
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
    if (!pushUnique(Globals.composed, 'TableLayout')) {
        return;
    }

    addEvent(GridClass, 'beforeRenderViewport', applyStrictHeights);
    addEvent(TableClass, 'beforeInit', applyLayoutClass);
}

/**
 * Turns on equal row heights while a layout is active.
 */
function applyStrictHeights(this: Grid): void {
    const rows = this.options?.rendering?.rows;
    const layout = layoutOf(this);

    if (
        !rows ||
        !layout ||
        defined(this.userOptions.rendering?.rows?.strictHeights)
    ) {
        return;
    }

    rows.strictHeights = true;
}

/**
 * Adds the layout class to the table element.
 */
function applyLayoutClass(this: Table): void {
    if (layoutOf(this.grid) !== 'matrix') {
        return;
    }

    this.tableElement.classList.add(
        Globals.getClassName('layoutMatrix')
    );
}

/**
 * Returns the active layout, if the grid has one.
 *
 * @param grid
 * Grid instance to read.
 */
function layoutOf(grid: Grid): TableLayout | undefined {
    const layout = grid.options?.rendering?.table?.layout;

    if (layout === 'matrix') {
        return layout;
    }

    return;
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface TableSettings {
        /**
         * Layout of the table body. `matrix` keeps the grid lines and sizes
         * every row from `--hcg-layout-row-height`.
         *
         * @sample grid-pro/studies/layout-calendar
         *         Calendar on a matrix layout
         *
         * @sample grid-pro/studies/layout-gantt
         *         Gantt on a matrix layout
         */
        layout?: TableLayout;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default { compose };
