/* *
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type { AnyRecord } from '../../Shared/Types';
import type Column from '../Core/Table/Column';
import type TableCell from '../Core/Table/Body/TableCell';
import type HeaderCell from '../Core/Table/Header/HeaderCell';
import type { GridEvent } from '../Core/GridUtils';
import type Grid from '../Core/Grid';

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
 * Composition to add events options to the Grid.
 *
 * @param GridClass
 * The class to extend.
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
    GridClass: typeof Grid,
    ColumnClass: typeof Column,
    HeaderCellClass: typeof HeaderCell,
    TableCellClass: typeof TableCell
): void {

    if (!pushUnique(Globals.composed, 'GridEvents')) {
        return;
    }

    ([ // Grid Events
        'beforeLoad',
        'afterLoad',
        'beforeUpdate',
        'afterUpdate',
        'beforeRedraw',
        'afterRedraw'
    ] as const).forEach((name): void => {
        addEvent(GridClass, name, (e: GridEvent<Grid>): void => {
            const grid = e.target;
            grid.options?.events?.[name]?.call(grid, e);
        });
    });

    ([ // TableCell Events
        'mouseOver',
        'mouseOut',
        'dblClick',
        'click',
        'afterRender'
    ] as const).forEach((name): void => {
        addEvent(TableCellClass, name, (e: GridEvent<TableCell>): void => {
            const cell = e.target;
            cell.column.options.cells?.events?.[name]?.call(cell);
            propagate['cell_' + name]?.call(cell);
        });
    });

    ([ // Column Events
        'afterResize',
        'beforeSort',
        'afterSort',
        'beforeFilter',
        'afterFilter'
    ] as const).forEach((name): void => {
        addEvent(ColumnClass, name, (e: GridEvent<Column>): void => {
            const column = e.target;
            column.options?.events?.[name]?.call(column);
        });
    });

    ([ // HeaderCell Events
        'click',
        'afterRender'
    ] as const).forEach((name): void => {
        addEvent(
            HeaderCellClass,
            name,
            (e: GridEvent<HeaderCell> & { column?: Column }): void => {
                const { column } = e;
                column?.options?.header?.events?.[name]?.call(column);
            }
        );
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
 * Callback function to be called when a grid event is triggered.
 */
export type GridEventCallback = (this: Grid, e: AnyRecord) => void;

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
     */
    afterRender?: CellEventCallback;
}

/**
 * Event callbacks option group related to the column.
 */
export interface ColumnEvents {
    /**
     * Callback function to be called when the column is filtered, after input
     * keypress or select change events, but before the filtering is applied.
     */
    beforeFilter?: ColumnEventCallback;

    /**
     * Callback function to be called when the column is filtered, after input
     * keypress or select change events, and the filtering is applied.
     */
    afterFilter?: ColumnEventCallback;

    /**
     * Callback function to be called when the column is sorted,
     * before clicking on header.
     */
    beforeSort?: ColumnEventCallback;

    /**
     * Callback function to be called when the column is sorted,
     * after clicking on header.
     */
    afterSort?: ColumnEventCallback;

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
     * Callback function to be called before the grid is loaded.
     */
    beforeLoad?: GridEventCallback;

    /**
     * Callback function to be called after the grid is loaded.
     */
    afterLoad?: GridEventCallback;

    /**
     * Callback function to be called before the grid options are updated.
     */
    beforeUpdate?: GridEventCallback;

    /**
     * Callback function to be called after the grid options are updated.
     */
    afterUpdate?: GridEventCallback;

    /**
     * Callback function to be called before the grid is redrawn after an
     * update.
     */
    beforeRedraw?: GridEventCallback;

    /**
     * Callback function to be called after the grid is redrawn after an
     * update.
     */
    afterRedraw?: GridEventCallback;
}

declare module '../Core/Options' {

    interface Options {
        /**
         * Events options triggered by the grid.
         */
        events?: GridEvents;
    }

    interface ColumnCellOptions {
        /**
         * Events options triggered by the grid elements.
         */
        events?: CellEvents;
    }

    interface ColumnOptions {
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
