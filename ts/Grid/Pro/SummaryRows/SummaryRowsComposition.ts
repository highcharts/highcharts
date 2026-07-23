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
import type TableCell from '../../Core/Table/Body/TableCell';
import type {
    TableCellGetEditabilityEvent
} from '../../Core/Table/Body/TableCell';
import type {
    SummaryColumnOptions,
    SummaryOptions
} from './SummaryRowsTypes';

import Globals from '../../Core/Globals.js';
import TableRow from '../../Core/Table/Body/TableRow.js';
import SummaryRowsController from './SummaryRowsController.js';
import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Constants
 *
 * */

const summaryRowClassName = Globals.classNamePrefix + 'summary-row';


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
 * @param TableCellClass
 * TableCell class to extend.
 */
export function compose(
    GridClass: typeof Grid,
    TableCellClass: typeof TableCell
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
    addEvent(TableRow, 'afterUpdateAttributes', onRowAfterUpdateAttributes);
    addEvent(TableCellClass, 'getEditability', onCellGetEditability);
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
 * Injects the summary row into the queried table before pagination.
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
    const controller = this.summaryRows;
    if (!controller) {
        return;
    }

    e.table = controller.projectTable(e.table);
}

/**
 * Toggles the summary row class name on rendered rows.
 */
function onRowAfterUpdateAttributes(this: TableRow): void {
    const isSummaryRow = !!this.viewport.grid.summaryRows?.isSummaryRow(this);
    this.htmlElement.classList.toggle(summaryRowClassName, isSummaryRow);
}

/**
 * Vetoes editing for cells in the summary row.
 *
 * @param e
 * Editability event fired by the body cell.
 */
function onCellGetEditability(
    this: TableCell,
    e: TableCellGetEditabilityEvent
): void {
    if (this.row.viewport.grid.summaryRows?.isSummaryRow(this.row)) {
        e.editable = false;
    }
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
