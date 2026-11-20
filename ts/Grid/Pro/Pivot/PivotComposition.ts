/* *
 *
 *  Grid Pivot Composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import type Options from '../../Core/Options';
import type TableCell from '../../Core/Table/Body/TableCell';
import type { DeepPartial } from '../../../Shared/Types';
import type {
    TableCellGetEditabilityEvent
} from '../../Core/Table/Body/TableCell';
import type {
    PivotColumnMeta,
    PivotLangOptions,
    PivotOptions
} from './PivotOptions';

import Globals from '../../Core/Globals.js';
import PivotController from './PivotController.js';
import { defaultOptions as gridDefaultOptions } from '../../Core/Defaults.js';
import { addEvent, merge, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Composition
 *
 * */

/**
 * Default options of the pivot feature.
 */
export const defaultOptions: DeepPartial<Options> = {
    lang: {
        pivot: {
            rowsColumnHeader: 'Rows',
            grandTotal: 'Total',
            blank: '(blank)'
        }
    }
};

/**
 * Composes Grid Pro with the pivot projection.
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
    if (!pushUnique(Globals.composed, 'Pivot')) {
        return;
    }

    merge(true, gridDefaultOptions, defaultOptions);

    addEvent(GridClass, 'beforeLoad', onBeforeLoad);
    addEvent(GridClass, 'beforeDestroy', onBeforeDestroy);
    addEvent(
        GridClass,
        'projectPresentationTable',
        onProjectPresentationTable,
        // Run before summary rows and tree view, which both project the table
        // the pivot replaces.
        { order: -1 }
    );
    addEvent(TableCellClass, 'getEditability', onCellGetEditability);
}

/**
 * Initializes the pivot controller before the first data querying.
 */
function onBeforeLoad(this: Grid): void {
    if (!this.pivot) {
        this.pivot = new PivotController(this);
    }

    if (
        this.options?.pivot?.enabled &&
        this.options?.data?.providerType === 'remote'
    ) {
        // eslint-disable-next-line no-console
        console.error(
            'Pivot: `pivot` requires the local data provider, so the pivot ' +
            'is ignored.'
        );
    }
}

/**
 * Cleans up the pivot controller on Grid destroy.
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

    this.pivot?.destroy();
    delete this.pivot;
}

/**
 * Replaces the queried table with the pivot projection, before tree view turns
 * the projected row paths into expandable rows.
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
    const controller = this.pivot;

    if (controller) {
        e.table = controller.projectTable(e.table);
    }
}

/**
 * Vetoes editing of pivot cells, which hold aggregates rather than source
 * values.
 *
 * @param e
 * Editability event fired by the body cell.
 */
function onCellGetEditability(
    this: TableCell,
    e: TableCellGetEditabilityEvent
): void {
    if (this.row.viewport.grid.pivot?.isEnabled()) {
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
        pivot?: PivotController;
    }
}

declare module '../../Core/Options' {
    interface Options {
        /**
         * Pivot options, turning the flat source data into a table where the
         * values of the column fields become generated columns and the values
         * of the row fields become expandable group rows.
         *
         * Requires the local data provider, and cannot be combined with
         * `treeView` or `rowGrouping`.
         *
         * @sample grid-pro/options/pivot Pivot table
         */
        pivot?: PivotOptions;
    }

    interface ColumnOptions {
        /**
         * Description of the pivot cell a generated column holds, set by the
         * pivot on every column it generates.
         *
         * @readonly
         */
        pivot?: PivotColumnMeta;
    }

    interface LangOptions {
        /**
         * Language options for the pivot feature.
         */
        pivot?: PivotLangOptions;
    }
}


/* *
 *
 *  Default export
 *
 * */

export default {
    compose,
    defaultOptions
} as const;
