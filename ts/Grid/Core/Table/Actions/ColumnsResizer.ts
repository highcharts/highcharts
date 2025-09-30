/* *
 *
 *  Grid Columns Resizer class.
 *
 *  (c) 2020-2025 Highsoft AS
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
const { fireEvent } = Utils;


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
     * Any column is being resized. Turned off after slight delay.
     */
    public isResizing: boolean = false;

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
     * @internal
     */
    public columnStartWidth?: number;

    /**
     * The width of the next column when dragging started.
     * @internal
     */
    public nextColumnStartWidth?: number;

    /**
     * The handles and their mouse down event listeners.
     */
    private handles: Array<[HTMLElement, (e: MouseEvent) => void]> = [];

    /**
     * The line that is displayed when resizing a column.
     * @internal
     */
    private resizeHandleLine?: HTMLElement;


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

            vp.columnsResizer?.addHandleListeners(
                handle, column
            );
        }
    }

    private reflowResizeHandleLine(): void {
        const vp = this.viewport;
        const line = this.resizeHandleLine;
        const handle = this.draggedResizeHandle;

        if (!line || !handle) {
            return;
        }

        const parentBox = vp.grid.contentWrapper!.getBoundingClientRect();
        const tbodyBox = vp.tbodyElement.getBoundingClientRect();
        const handleBox = handle.getBoundingClientRect();
        const left = Math.floor(
            handleBox.left + handleBox.width / 2 - tbodyBox.left
        );
        const bottom = Math.floor(parentBox.bottom - tbodyBox.bottom);
        const top = Math.floor(handleBox.bottom - parentBox.top);

        line.style.bottom = bottom + 'px';
        line.style.top = top + 'px';
        line.style.left = left + 'px';
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

        vp.columnResizing.resize(this, diff);

        vp.reflow();
        vp.rowsVirtualizer.adjustRowHeights();
        this.reflowResizeHandleLine();

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

        this.resizeHandleLine?.remove();
        delete this.resizeHandleLine;
        this.draggedResizeHandle?.classList.remove('hovered');

        this.dragStartX = void 0;
        this.draggedColumn = void 0;
        this.draggedResizeHandle = void 0;
        this.columnStartWidth = void 0;
        this.nextColumnStartWidth = void 0;

        requestAnimationFrame((): void => {
            this.isResizing = false;
        });
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

            this.isResizing = true;

            vp.reflow();

            if (!this.resizeHandleLine) {
                this.resizeHandleLine = makeHTMLElement('div', {
                    className: Globals.getClassName('resizerHandleLine')
                }, column.viewport.grid.contentWrapper);
            }

            this.dragStartX = e.pageX;
            this.draggedColumn = column;
            this.draggedResizeHandle = handle;
            this.columnStartWidth = column.getWidth();
            this.nextColumnStartWidth =
                vp.columns[column.index + 1]?.getWidth();

            column.header?.htmlElement.classList.add(
                Globals.getClassName('resizedColumn')
            );
            this.reflowResizeHandleLine();
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
