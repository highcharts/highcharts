/* *
 *
 *  Grid Columns Resizer class.
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import Table from '../Table.js';
import Column from '../Column.js';
import GridUtils from '../../GridUtils.js';
import Cell from '../Cell.js';
import Globals from '../../Globals.js';
import Utils from '../../../../Core/Utilities.js';

const { makeHTMLElement } = GridUtils;
const {
    fireEvent,
    getStyle
} = Utils;


/* *
 *
 *  Class
 *
 * */

/**
 * The class that handles the resizing of columns in the data grid.
 */
class ColumnsResizer {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The viewport of the data grid.
     */
    private viewport: Table;

    /**
     * The column being dragged.
     * @internal
     */
    public draggedColumn?: Column;

    /**
     * The start X position of the drag.
     */
    private dragStartX?: number;

    /**
     * The element when dragging.
     * @internal
     */
    public draggedResizeHandle?: HTMLElement;

    /**
     * The width of the dragged column when dragging started.
     */
    private columnStartWidth?: number;

    /**
     * The handles and their mouse down event listeners.
     */
    private handles: Array<[HTMLElement, (e: MouseEvent) => void]> = [];


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;

        document.addEventListener('mousemove', this.onDocumentMouseMove);
        document.addEventListener('mouseup', this.onDocumentMouseUp);
    }


    /* *
     *
     *  Functions
     *
     * */

    /**
     * Render the drag handle for resizing columns.
     *
     * @param column
     * The reference to rendered column
     *
     * @param cell
     * The reference to rendered cell, where hadles should be added
     */
    public renderColumnDragHandles(column: Column, cell: Cell): void {
        const vp = column.viewport;

        if (vp.columnsResizer) {
            const handle = makeHTMLElement('div', {
                className: Globals.getClassName('resizerHandles')
            }, cell.htmlElement);

            handle.setAttribute('aria-hidden', true);

            vp.columnsResizer.addHandleListeners(
                handle, column
            );
        }
    }

    /**
     * Resizes the column. If the width of the column is set in percentage, it
     * will be changed to pixels.
     *
     * @param diff
     * The X position difference in pixels.
     */
    private resize(diff: number): void {
        const column = this.draggedColumn;
        if (!column) {
            return;
        }

        const vp = column.viewport;
        const colW = this.columnStartWidth ?? 0;
        const minWidth = ColumnsResizer.getMinWidth(column);

        let newW = colW + diff;
        if (newW < minWidth) {
            newW = minWidth;
        }

        column.width = [newW, 'px'];

        if (!Table.RESIZING_SHOULD_CHANGE_ALL_WIDTHS_UNITS_TO_PIXELS) {
            return;
        }

        for (let i = 0, iEnd = vp.columns.length; i < iEnd; i++) {
            const col = vp.columns[i];
            if (col !== column) {
                col.width = [col.getPixelWidth(), 'px'];
            }
        }
    }

    /**
     * Handles the mouse move event on the document.
     *
     * @param e
     * The mouse event.
     *
     * @internal
     */
    private onDocumentMouseMove = (e: MouseEvent): void => {
        if (!this.draggedResizeHandle || !this.draggedColumn) {
            return;
        }

        const diff = e.pageX - (this.dragStartX || 0);
        const vp = this.viewport;

        this.resize(diff);

        vp.reflow(true);

        if (vp.grid.options?.rendering?.rows?.virtualization) {
            vp.rowsVirtualizer.adjustRowHeights();
        }

        fireEvent(this.draggedColumn, 'afterResize', {
            target: this.draggedColumn,
            originalEvent: e
        });
    };

    /**
     * Handles the mouse up event on the document.
     */
    private onDocumentMouseUp = (): void => {
        this.draggedColumn?.header?.htmlElement?.classList.remove(
            Globals.getClassName('resizedColumn')
        );

        this.dragStartX = void 0;
        this.draggedColumn = void 0;
        this.draggedResizeHandle = void 0;
        this.columnStartWidth = void 0;
    };

    /**
     * Adds event listeners to the handle.
     *
     * @param handle
     * The handle element.
     *
     * @param column
     * The column the handle belongs to.
     */
    public addHandleListeners(
        handle: HTMLElement,
        column: Column
    ): void {
        const onHandleMouseDown = (e: MouseEvent): void => {
            const vp = column.viewport;
            const { grid } = vp;

            if (!grid.options?.rendering?.rows?.virtualization) {
                grid.contentWrapper?.classList.add(
                    Globals.getClassName('resizerWrapper')
                );
                // Apply widths before resizing
                vp.reflow(true);
            }

            this.dragStartX = e.pageX;
            this.draggedColumn = column;
            this.draggedResizeHandle = handle;
            this.columnStartWidth = column.getPixelWidth();

            column.header?.htmlElement.classList.add(
                Globals.getClassName('resizedColumn')
            );
        };

        this.handles.push([handle, onHandleMouseDown]);
        handle.addEventListener('mousedown', onHandleMouseDown);
    }

    /**
     * Removes all added event listeners from the document and handles. This
     * should be called on the destroy of the data grid.
     */
    public removeEventListeners(): void {
        document.removeEventListener('mousemove', this.onDocumentMouseMove);
        document.removeEventListener('mouseup', this.onDocumentMouseUp);

        for (let i = 0, iEnd = this.handles.length; i < iEnd; i++) {
            const [handle, listener] = this.handles[i];
            handle.removeEventListener('mousedown', listener);
        }
    }

    /**
     * Returns the minimum width of the column.
     *
     * @param column
     * The column to get the minimum width for.
     *
     * @returns
     * The minimum width in pixels.
     */
    public static getMinWidth(column: Column): number {
        const tableColumnEl = column.cells[1].htmlElement;
        const headerColumnEl = column.header?.htmlElement;

        const getElPaddings = (el: HTMLElement): number => (
            (getStyle(el, 'padding-left', true) || 0) +
            (getStyle(el, 'padding-right', true) || 0) +
            (getStyle(el, 'border-left', true) || 0) +
            (getStyle(el, 'border-right', true) || 0)
        );

        let result = Column.MIN_COLUMN_WIDTH;
        if (tableColumnEl) {
            result = Math.max(result, getElPaddings(tableColumnEl));
        }
        if (headerColumnEl) {
            result = Math.max(result, getElPaddings(headerColumnEl));
        }
        return result;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnsResizer;
