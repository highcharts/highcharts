/* *
 *
 *  Grid Summary Rows Composition
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
import type Grid from '../../Core/Grid';
import type Table from '../../Core/Table/Table';
import type {
    SummaryColumnOptions,
    SummaryOptions
} from './SummaryRowsTypes';

import Globals from '../../Core/Globals.js';
import SummaryRowsController from './SummaryRowsController.js';
import SummaryView from './SummaryView.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Composes Grid Pro with the flat summary rows feature.
 *
 * @param GridClass
 * Grid class to extend.
 *
 * @param TableClass
 * Table (viewport) class to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table
): void {
    if (!pushUnique(Globals.composed, 'SummaryRows')) {
        return;
    }

    addEvent(GridClass, 'beforeLoad', onBeforeLoad);
    addEvent(GridClass, 'beforeDestroy', onBeforeDestroy);
    addEvent(
        GridClass,
        'projectPresentationTable',
        onProjectPresentationTable
    );
    addEvent(TableClass, 'beforeInit', onTableBeforeInit);
    addEvent(TableClass, 'afterReflow', onTableAfterReflow);
    addEvent(TableClass, 'bodyScroll', onTableBodyScroll);
    addEvent(TableClass, 'afterDestroy', onTableAfterDestroy);
}

/**
 * Initializes the summary rows controller before first data querying.
 */
function onBeforeLoad(this: Grid): void {
    if (!this.summaryRows) {
        this.summaryRows = new SummaryRowsController(this);
    }
}

/**
 * Cleans up the summary rows controller on Grid destroy.
 *
 * @param e
 * Grid destroy event metadata.
 *
 * @param e.onlyDOM
 * Whether destroy is limited to DOM teardown before a re-render.
 */
function onBeforeDestroy(this: Grid, e: { onlyDOM?: boolean }): void {
    if (e.onlyDOM) {
        return;
    }

    delete this.summaryRows;
}

/**
 * Recomputes the summary row objects from the queried table before pagination.
 *
 * @param e
 * Presentation table event fired after sort/filter and before pagination.
 *
 * @param e.table
 * Queried table after filter/sort and before pagination.
 */
function onProjectPresentationTable(
    this: Grid,
    e: {
        table: DataTable;
    }
): void {
    this.summaryRows?.updateFromTable(e.table);
}

/**
 * Creates the summary view and wires its re-render into the render cycle.
 */
function onTableBeforeInit(this: Table): void {
    const table = this;
    const view = new SummaryView(table);
    table.summaryView = view;

    const renderSummary = async (): Promise<void> => {
        await view.render(table.grid.summaryRows?.getRowObjects() ?? []);
    };

    // Initial render is not covered by afterUpdateRowsHooks; wrap the
    // virtualizer hook (preserving any previously registered handler).
    const virtualizer = table.rowsVirtualizer;
    const previousBeforeInitialRender = virtualizer.beforeInitialRenderRows;
    virtualizer.beforeInitialRenderRows = async (): Promise<void> => {
        await previousBeforeInitialRender?.();
        await renderSummary();
    };

    table.afterUpdateRowsHooks.push(renderSummary);
}

/**
 * Re-applies summary cell widths and offset after a table reflow.
 */
function onTableAfterReflow(this: Table): void {
    this.summaryView?.reflow();
}

/**
 * Keeps the summary section aligned with the main body horizontal scroll.
 *
 * @param e
 * Body scroll event payload.
 *
 * @param e.scrollLeft
 * Current horizontal scroll offset.
 */
function onTableBodyScroll(
    this: Table,
    e: { scrollLeft?: number }
): void {
    this.summaryView?.syncHorizontalScroll(e.scrollLeft || 0);
}

/**
 * Destroys the summary view on table teardown.
 */
function onTableAfterDestroy(this: Table): void {
    this.summaryView?.destroy();
    delete this.summaryView;
}


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Grid' {
    export default interface Grid {
        summaryRows?: SummaryRowsController;
    }
}

declare module '../../Core/Table/Table' {
    export default interface Table {
        summaryView?: SummaryView;
    }
}

declare module '../../Core/Options' {
    interface Options {
        /**
         * Flat summary (total) row options (Grid Pro module).
         *
         * Provide a single object for one summary row, or an array of objects
         * for several.
         *
         * @sample grid-pro/options/summary-rows Summary row
         */
        summaryRows?: SummaryOptions;
    }

    interface ColumnOptions {
        /**
         * Summary row options for a single column.
         */
        summary?: SummaryColumnOptions;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
