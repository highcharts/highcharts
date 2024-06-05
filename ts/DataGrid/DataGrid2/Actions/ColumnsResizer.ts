/* *
 *
 *  Data Grid Rows Renderer class.
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

import DataGridTable from '../DataGridTable.js';
import DataGridColumn from '../DataGridColumn.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a virtualized rows renderer for the data grid.
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

    private onDocumentMouseUp = (): void => {
        this.dragStartX = void 0;
        this.draggedColumn = void 0;
        this.nextColumn = void 0;
        this.draggedResizeHandle = void 0;
        this.columnStartWidth = void 0;
        this.nextColumnStartWidth = void 0;
    };

    public addHandleListeners(
        handle: HTMLElement,
        column: DataGridColumn
    ): void {
        handle.addEventListener('mousedown', (e: MouseEvent): void => {
            this.dragStartX = e.pageX;
            this.draggedColumn = column;
            this.nextColumn = this.viewport.columns[column.index + 1];
            this.draggedResizeHandle = handle;
            this.columnStartWidth = column.getWidth();
            this.nextColumnStartWidth = this.nextColumn?.getWidth();
        });
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnsResizer;
