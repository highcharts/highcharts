/* *
 *
 *  Data Grid Columns Resizer class.
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

import DataGridTable from '../DataGridTable.js';
import DataGridColumn from '../DataGridColumn.js';


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
     * The minimum width of a column.
     */
    private static readonly MIN_COLUMN_WIDTH = 20;


    /**
     * The viewport of the data grid.
     */
    private viewport: DataGridTable;

    /**
     * The column being dragged.
     */
    private draggedColumn?: DataGridColumn;

    /**
     * The column right next to the dragged column.
     */
    private nextColumn?: DataGridColumn;

    /**
     * The start X position of the drag.
     */
    private dragStartX?: number;

    /**
     * The element when dragging.
     */
    private draggedResizeHandle?: HTMLElement;

    /**
     * The width of the dragged column when dragging started.
     */
    private columnStartWidth?: number;

    /**
     * The width of the next column when dragging started.
     */
    private nextColumnStartWidth?: number;

    /**
     * The handles and their mouse down event listeners.
     */
    private handles: Array<[HTMLElement, (e: MouseEvent) => void]> = [];


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: DataGridTable) {
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
     * Handles the mouse move event on the document.
     *
     * @param e
     *        The mouse event.
     */
    private onDocumentMouseMove = (e: MouseEvent): void => {
        if (!this.draggedResizeHandle || !this.draggedColumn) {
            return;
        }

        const diff = e.pageX - (this.dragStartX || 0);
        const { draggedColumn: column, nextColumn } = this;

        if (!nextColumn) {
            return;
        }

        const leftColW = this.columnStartWidth ?? 0;
        const rightColW = this.nextColumnStartWidth ?? 0;
        const MIN_WIDTH = ColumnsResizer.MIN_COLUMN_WIDTH;

        let newLeftW = leftColW + diff;
        let newRightW = rightColW - diff;

        if (newLeftW < MIN_WIDTH) {
            newLeftW = MIN_WIDTH;
            newRightW = leftColW + rightColW - MIN_WIDTH;
        }

        if (newRightW < MIN_WIDTH) {
            newRightW = MIN_WIDTH;
            newLeftW = leftColW + rightColW - MIN_WIDTH;
        }

        column.widthRatio = this.viewport.getRatioFromWidth(newLeftW);
        nextColumn.widthRatio = this.viewport.getRatioFromWidth(newRightW);

        this.viewport.reflow();
    };

    /**
     * Handles the mouse up event on the document.
     */
    private onDocumentMouseUp = (): void => {
        this.dragStartX = void 0;
        this.draggedColumn = void 0;
        this.nextColumn = void 0;
        this.draggedResizeHandle = void 0;
        this.columnStartWidth = void 0;
        this.nextColumnStartWidth = void 0;
    };

    /**
     * Adds event listeners to the handle.
     *
     * @param handle
     *        The handle element.
     * @param column
     *        The column the handle belongs to.
     */
    public addHandleListeners(
        handle: HTMLElement,
        column: DataGridColumn
    ): void {
        const onHandleMouseDown = (e: MouseEvent): void => {
            this.dragStartX = e.pageX;
            this.draggedColumn = column;
            this.nextColumn = this.viewport.columns[column.index + 1];
            this.draggedResizeHandle = handle;
            this.columnStartWidth = column.getWidth();
            this.nextColumnStartWidth = this.nextColumn?.getWidth();
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
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnsResizer;
