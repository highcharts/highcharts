/* *
 *
 *  (c) 2020-2024 Highsoft AS
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
import type { ColumnSortingOrder } from '../Core/Options';
import type TableCell from '../Core/Table/Content/TableCell.js';
import type CellEditing from '../Core/Table/Actions/CellEditing.js';
import type ColumnSorting from '../Core/Table/Actions/ColumnSorting.js';
import type ColumnsResizer from '../Core/Table/Actions/ColumnsResizer.js';

import U from '../../Core/Utilities.js';
import Globals from '../../Core/Globals.js';

const {
    fireEvent,
    wrap,
    pushUnique
} = U;


/* *
 *
 *  Functions
 *
 * */

/**
 * Composition to add events to the TableCellClass methods.
 *
 * @param TableCellClass
 * Class to extend.
 *
 * @param ColumnSortingClass
 * Class to extend.
 *
 * @param ColumnsResizerClass
 * Class to extend.
 *
 * @param CellEditingClass
 * Class to extend.
 *
 * @private
 */
function compose(
    TableCellClass: typeof TableCell,
    ColumnSortingClass: typeof ColumnSorting,
    ColumnsResizerClass: typeof ColumnsResizer,
    CellEditingClass: typeof CellEditing
): void {

    if (!pushUnique(Globals.composed, 'GridEvents')) {
        return;
    }

    wrap(TableCellClass.prototype, 'onMouseDown', function (
        this: TableCell,
        proceed
    ): void {
        proceed.call(this);

        fireEvent(this.row.viewport.grid, 'cellMouseDown', {
            target: this
        });
    });

    wrap(TableCellClass.prototype, 'onMouseDown', function (
        this: TableCell,
        proceed
    ): void {
        proceed.call(this);

        const grid = this.row.viewport.grid;

        grid.options?.events?.cell?.mouseOver?.call(this);
        fireEvent(grid, 'cellMouseOver', {
            target: this
        });
    });

    wrap(TableCellClass.prototype, 'onMouseOut', function (
        this: TableCell,
        proceed
    ): void {
        proceed.call(this);

        const grid = this.row.viewport.grid;

        grid.options?.events?.cell?.mouseOut?.call(this);
        fireEvent(grid, 'cellMouseOut', {
            target: this
        });
    });

    wrap(TableCellClass.prototype, 'onDblClick', function (
        this: TableCell,
        proceed
    ): void {
        proceed.call(this);

        const grid = this.row.viewport.grid;

        grid.options?.events?.cell?.dblClick?.call(this);
        fireEvent(grid, 'cellDblClick', {
            target: this
        });
    });

    wrap(TableCellClass.prototype, 'onClick', function (
        this: TableCell,
        proceed
    ): void {
        proceed.call(this);

        const grid = this.row.viewport.grid;

        grid.options?.events?.cell?.click?.call(this);
        fireEvent(grid, 'cellClick', {
            target: this
        });
    });

    wrap(TableCellClass.prototype, 'onAfterSetValue', function (
        this: TableCell,
        proceed
    ): void {
        proceed.call(this);

        this.row.viewport.grid.options?.events?.cell?.afterSetValue?.call(this);
    });

    wrap(ColumnSortingClass.prototype, 'setOrder', async function (
        this: ColumnSorting,
        proceed,
        order: ColumnSortingOrder
    ): Promise<void> {
        await proceed.call(this, order);

        this.column.viewport.grid.options?.events?.column?.afterSorting?.call(
            this.column
        );
    });

    wrap(ColumnsResizerClass.prototype, 'onColumnResize', function (
        this: ColumnsResizer,
        proceed
    ): void {
        proceed.call(this);

        this.draggedColumn?.viewport.grid.options?.events?.column
            ?.afterResize?.call(
                this.draggedColumn
            );
    });

    wrap(CellEditingClass.prototype, 'stopEditing', function (
        this: CellEditing,
        proceed,
        submit: boolean
    ): void {
        const cell = this.editedCell;

        proceed.call(this, submit);

        cell?.row.viewport.grid.options?.events?.cell?.afterEdit?.call(cell);
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
     * Callback function to be called after editing of cell value.
     */
    afterEdit?: CellEventCallback;

    /**
     * Callback function to be called after the cell value is set (on init or
     * after editing).
     */
    afterSetValue?: CellEventCallback;
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
}

/**
 * Events options.
 */
export interface GridEvents {
    /**
     * Events related to the cells.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-events/ | Datagrid events}
     */
    cell?: CellEvents;

    /**
     * Events related to the column.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-events/ | Datagrid events}
     */
    column?: ColumnEvents

    /**
     * Events related to the header.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/data-grid/basic/cell-events/ | Datagrid events}
     */
    header?: HeaderEvents
}

declare module '../Core/Options' {
    interface Options {
        /**
         * Events options triggered by the grid elements.
         */
        events?: GridEvents;
    }
}


/* *
 *
 *  Default Export
 *
 * */

const GridEvents = {
    compose
};

export default GridEvents;
