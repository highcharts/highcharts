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
import type TableCell from '../../Core/Table/Body/TableCell';

import Globals from '../../Core/Globals.js';
import { addEvent, defined, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

type TableLayout = 'matrix' | 'cards' | 'flow';


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
 *
 * @param TableCellClass
 * Table cell constructor to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table,
    TableCellClass: typeof TableCell
): void {
    if (!pushUnique(Globals.composed, 'TableLayout')) {
        return;
    }

    addEvent(GridClass, 'beforeRenderViewport', applyStrictHeights);
    addEvent(TableClass, 'beforeInit', applyLayoutClass);
    addEvent(TableCellClass, 'afterRender', applyCardClass);
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
    const layout = layoutOf(this.grid);

    if (!layout) {
        return;
    }

    this.tableElement.classList.add(
        Globals.getClassName(
            layout === 'matrix' ? 'layoutMatrix' : 'layoutCards'
        )
    );
}

/**
 * Marks body cells as cards. Matrix cells stay plain grid cells.
 */
function applyCardClass(this: TableCell): void {
    this.htmlElement.classList.toggle(
        Globals.getClassName('card'),
        layoutOf(this.row.viewport.grid) === 'cards'
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

    if (layout === 'matrix' || layout === 'cards') {
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
         * every row from `--hcg-layout-row-height`. `cards` adds the
         * `hcg-card` class to each body cell, hides the grid lines and draws
         * the card border. The number of columns stays as declared.
         * `flow` is experimental: each row is one card and the cards wrap
         * when the container gets narrower. See `CardFlowComposition`.
         *
         * @sample grid-pro/studies/layout-cards
         *         Card layout
         *
         * @sample grid-pro/studies/layout-cards-flow
         *         Wrapping cards
         *
         * @sample grid-pro/studies/layout-calendar
         *         Matrix layout
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
