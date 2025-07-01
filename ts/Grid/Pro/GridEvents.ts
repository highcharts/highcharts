/* *
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import type Column from '../Core/Table/Column';
import type TableCell from '../Core/Table/Body/TableCell';
import type HeaderCell from '../Core/Table/Header/HeaderCell';
import type { GridEvent } from '../Core/GridUtils';

import U from '../../Core/Utilities.js';
import Globals from '../../Core/Globals.js';

const {
    addEvent,
    fireEvent,
    pushUnique
} = U;


/* *
 *
 *  Constants
 *
 * */

type CustomAction = (this: TableCell) => void;
const propagate: Record<string, CustomAction> = {
    'cell_mouseOver': function (this: TableCell): void {
        fireEvent(this.row.viewport.grid, 'cellMouseOver', {
            target: this
        });
    },
    'cell_mouseOut': function (this: TableCell): void {
        fireEvent(this.row.viewport.grid, 'cellMouseOut', {
            target: this
        });
    }
};


/* *
 *
 *  Functions
 *
 * */

/**
 * Composition to add events to the TableCellClass methods.
 *
 * @param ColumnClass
 * The class to extend.
 *
 * @param HeaderCellClass
 * The class to extend.
 *
 * @param TableCellClass
 * The class to extend.
 *
 * @internal
 */
function compose(
    ColumnClass: typeof Column,
    HeaderCellClass: typeof HeaderCell,
    TableCellClass: typeof TableCell
): void {

    if (!pushUnique(Globals.composed, 'GridEvents')) {
        return;
    }

    ([ // TableCell Events
        'mouseOver',
        'mouseOut',
        'dblClick',
        'click',
        'afterRender'
    ] as const).forEach((name): void => {
        addEvent(TableCellClass, name, (e: GridEvent<TableCell>): void => {
            const cell = e.target;
            const cellEvent =
                cell.column.options.cells?.events?.[name] ||
                // Backward compatibility
                cell.row.viewport.grid.options?.events?.cell?.[name];

            cellEvent?.call(cell);
            propagate['cell_' + name]?.call(cell);
        });
    });

    ([ // Column Events
        'afterResize',
        'afterSorting'
    ] as const).forEach((name): void => {
        addEvent(ColumnClass, name, (e: GridEvent<Column>): void => {
            const column = e.target;
            const columnEvent =
                column.options?.events?.[name] ||
                // Backward compatibility
                column.viewport.grid.options?.events?.column?.[name];

            columnEvent?.call(column);
        });
    });

    // HeaderCell Events
    ([
        'click',
        'afterRender'
    ] as const).forEach((name): void => {
        addEvent(HeaderCellClass, name, (e: GridEvent<Column>): void => {
            const column = e.target;
            const headerEvent =
                column.options?.header?.events?.[name] ||
                // Backward compatibility
                column.viewport?.grid?.options?.events?.header?.[name];

            headerEvent?.call(column);
        });
    });
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Callback function to be called when a cell event is triggered.
 */
export type CellEventCallback = (this: TableCell) => void;

/**
 * Callback function to be called when a column event is triggered.
 */
export type ColumnEventCallback = (this: Column) => void;

/**
 * Events related to the cells.
 */
export interface CellEvents {
    /**
     * Callback function to be called when the cell is clicked.
     */
    click?: CellEventCallback;

    /**
     * Callback function to be called when the cell is double clicked.
     */
    dblClick?: CellEventCallback;

    /**
     * Callback function to be called when the cell is hovered.
     */
    mouseOver?: CellEventCallback;

    /**
     * Callback function to be called when the cell is no longer hovered.
     */
    mouseOut?: CellEventCallback;

    /**
     * Callback function to be called after the cell value is set (on init or
     * after editing).
     *
     * Use the `afterRender` event instead.
     *
     * @deprecated
     */
    afterSetValue?: CellEventCallback;

    /**
     * Callback function to be called after the cell value is set (on init or
     * after editing).
     */
    afterRender?: CellEventCallback;
}

/**
 * Event callbacks option group related to the column.
 */
export interface ColumnEvents {
    /**
     * Callback function to be called when the column is sorted for instance,
     * after clicking on header.
     */
    afterSorting?: ColumnEventCallback;

    /**
     * Callback function to be called when the column is resized.
     */
    afterResize?: ColumnEventCallback;
}

export interface HeaderEvents {
    /**
     * Callback function to be called when the header is clicked.
     */
    click?: ColumnEventCallback;

    /**
     * Callback function to be called after the header is initialized.
     */
    afterRender?: ColumnEventCallback;
}

/**
 * Events options.
 */
export interface GridEvents {
    /**
     * Events related to the cells.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/cell-events/ | Grid events}
     */
    cell?: CellEvents;

    /**
     * Events related to the column.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/cell-events/ | Grid events}
     */
    column?: ColumnEvents

    /**
     * Events related to the header.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/cell-events/ | Grid events}
     */
    header?: HeaderEvents
}

declare module '../Core/Options' {
    interface Options {
        /**
         * Events options triggered by the grid elements.
         * @deprecated
         */
        events?: GridEvents;
    }

    interface ColumnCellOptions {
        /**
         * Events options triggered by the grid elements.
         */
        events?: CellEvents;
    }

    interface IndividualColumnOptions {
        /**
         * Events options triggered by the grid elements.
         */
        events?: ColumnEvents;
    }

    interface ColumnHeaderOptions {
        /**
         * Events options triggered by the grid elements.
         */
        events?: HeaderEvents;
    }
}

/* *
 *
 *  Default Export
 *
 * */

/**
 * @internal
 */
export default { compose };
