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
     * The viewport of the data grid.
     */
    private viewport: DataGridTable;

    /**
     * The column being dragged.
     */
    private draggedColumn?: DataGridColumn;

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
     * Resizes the columns in the full distribution mode.
     *
     * @param diff
     * The X position difference in pixels.
     */
    private fullDistributionResize(diff: number): void {
        const vp = this.viewport;

        const column = this.draggedColumn;
        if (!column) {
            return;
        }

        const nextColumn = vp.columns[column.index + 1];
        if (!nextColumn) {
            return;
        }

        const leftColW = this.columnStartWidth ?? 0;
        const rightColW = this.nextColumnStartWidth ?? 0;
        const MIN_WIDTH = DataGridColumn.MIN_COLUMN_WIDTH;

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

        column.width = vp.getRatioFromWidth(newLeftW);
        nextColumn.width = vp.getRatioFromWidth(newRightW);
    }

    /**
     * Resizes the columns in the fixed distribution mode.
     *
     * @param diff
     * The X position difference in pixels.
     */
    private fixedDistributionResize(diff: number): void {
        const column = this.draggedColumn;
        if (!column) {
            return;
        }

        const colW = this.columnStartWidth ?? 0;
        const MIN_WIDTH = DataGridColumn.MIN_COLUMN_WIDTH;

        let newW = colW + diff;
        if (newW < MIN_WIDTH) {
            newW = MIN_WIDTH;
        }

        column.width = newW;
    }

    /**
     * Handles the mouse move event on the document.
     *
     * @param e
     * The mouse event.
     */
    private onDocumentMouseMove = (e: MouseEvent): void => {
        if (!this.draggedResizeHandle || !this.draggedColumn) {
            return;
        }

        const diff = e.pageX - (this.dragStartX || 0);

        if (this.viewport.columnDistribution === 'full') {
            this.fullDistributionResize(diff);
        } else {
            this.fixedDistributionResize(diff);
        }

        this.viewport.reflow();
        this.viewport.rowsVirtualizer.adjustRowHeights();
        this.viewport.dataGrid.options?.events?.column?.resize?.call(
            this.draggedColumn
        );
    };

    /**
     * Handles the mouse up event on the document.
     */
    private onDocumentMouseUp = (): void => {
        this.draggedColumn?.headerElement?.classList.remove(
            'highcharts-datagrid-head-cell-resized'
        );

        this.dragStartX = void 0;
        this.draggedColumn = void 0;
        this.draggedResizeHandle = void 0;
        this.columnStartWidth = void 0;
        this.nextColumnStartWidth = void 0;
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
        column: DataGridColumn
    ): void {
        const onHandleMouseDown = (e: MouseEvent): void => {
            this.dragStartX = e.pageX;
            this.draggedColumn = column;
            this.draggedResizeHandle = handle;
            this.columnStartWidth = column.getWidth();
            this.nextColumnStartWidth =
                this.viewport.columns[column.index + 1]?.getWidth();

            column.headerElement?.classList.add(
                'highcharts-datagrid-head-cell-resized'
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
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnsResizer;