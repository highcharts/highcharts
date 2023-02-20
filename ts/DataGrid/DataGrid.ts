/* *
 *
 *  Data Grid class
 *
 *  (c) 2020-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Øystein Moseng
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../Data/DataEvent';
import type DataGridOptions from './DataGridOptions';
import DataTable from '../Data/DataTable.js';
import DataGridUtils from './DataGridUtils.js';
const {
    dataTableCellToString,
    emptyHTMLElement,
    makeDiv
} = DataGridUtils;
import defaultOptions from './DataGridDefaults.js';
import H from '../Core/Globals.js';
const {
    doc
} = H;
import U from '../Core/Utilities.js';
const {
    addEvent,
    clamp,
    fireEvent,
    isNumber,
    merge,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class DataGrid {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly defaultOptions = defaultOptions;

    /* *
     *
     *  Properties
     *
     * */

    public container: HTMLElement;
    public options: DataGridOptions;
    public dataTable: DataTable;
    public hoveredRow?: HTMLElement;
    public rowElements: Array<HTMLElement>;

    private gridContainer: HTMLElement;
    private outerContainer: HTMLElement;
    private scrollContainer: HTMLElement;
    private innerContainer: HTMLElement;
    private headerContainer?: HTMLElement;
    private cellInputEl?: HTMLInputElement;
    private columnHeadersContainer?: HTMLElement;
    private columnDragHandlesContainer?: HTMLElement;
    private columnResizeCrosshair?: HTMLElement;
    private draggedResizeHandle: null | HTMLElement;
    private draggedColumnRightIx: null | number;
    private dragResizeStart?: number;
    private prevTop = -1;
    private scrollEndRowCount = 0;
    private scrollEndTop = 0;
    private bottom = false;
    private columnNames: Array<string>;


    /* *
     *
     *  Functions
     *
     * */

    constructor(container: (string | HTMLElement), options: DeepPartial<DataGridOptions>) {
        // Initialize containers
        if (typeof container === 'string') {
            const existingContainer = doc.getElementById(container);
            if (existingContainer) {
                this.container = existingContainer;
            } else {
                this.container = makeDiv('hc-dg-container', container);
            }
        } else {
            this.container = container;
        }
        this.gridContainer = makeDiv('hc-dg-container');
        this.outerContainer = makeDiv('hc-dg-outer-container');
        this.scrollContainer = makeDiv('hc-dg-scroll-container');
        this.innerContainer = makeDiv('hc-dg-inner-container');
        this.outerContainer.appendChild(this.scrollContainer);
        this.gridContainer.appendChild(this.outerContainer);
        this.container.appendChild(this.gridContainer);

        // Init options
        this.options = merge(DataGrid.defaultOptions, options);

        // Init data table
        this.dataTable = this.initDataTable();
        this.columnNames = this.dataTable.getColumnNames();

        this.rowElements = [];
        this.draggedResizeHandle = null;
        this.draggedColumnRightIx = null;
        this.render();
    }


    public getRowCount(): number {
        return this.dataTable.getRowCount();
    }


    /**
     * Update the data grid with new options.
     *
     * @param {DataGridOptions} options
     *        An object with new options.
     */
    public update(options: DeepPartial<DataGridOptions>): void {
        this.options = merge(this.options, options);

        this.scrollContainer.removeChild(this.innerContainer);
        this.render();
    }


    /**
     * Resize a column.
     *
     * @param {number} width
     *        New column width.
     *
     * @param {string|number|undefined} columnNameOrIndex
     *        Name or index of the column to resize, omit to resize all
     *        columns.
     *
     * @emits #afterResizeColumn
     */
    public resizeColumn(
        width: number,
        columnNameOrIndex?: (string | number)
    ): void {
        const headers = this.columnHeadersContainer;
        const index = typeof columnNameOrIndex === 'string' ?
            this.columnNames.indexOf(columnNameOrIndex) :
            columnNameOrIndex;
        const flex = `${width}`;

        if (isNumber(index)) {
            if (index !== -1) {
                if (headers) {
                    const header = headers.children[index] as HTMLElement;
                    if (header) {
                        header.style.flex = flex;
                    }
                }
                this.rowElements.forEach((row): void => {
                    const cellElement = row.children[index] as HTMLElement;
                    if (cellElement) {
                        cellElement.style.flex = flex;
                    }
                });
            }
        } else {
            if (headers) {
                for (let i = 0; i < headers.children.length; i++) {
                    (headers.children[i] as HTMLElement).style.flex = flex;
                }
            }
            this.rowElements.forEach((row): void => {
                for (let i = 0; i < row.children.length; i++) {
                    (row.children[i] as HTMLElement).style.flex = flex;
                }
            });
        }

        this.renderColumnDragHandles();

        this.emit<DataGrid.Event>({
            type: 'afterResizeColumn',
            width,
            index,
            name: isNumber(index) ? this.columnNames[index] : void 0
        });
    }


    /**
     * Emits an event on this data grid to all registered callbacks of the
     * given event.
     * @private
     *
     * @param {DataGrid.Event} e
     * Event object with event information.
     */
    public emit<E extends DataEvent>(e: E): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Add class to given element to toggle highlight.
     * @param  {HTMLElement} row Row to highlight.
     * @return {void}
     */
    public toggleRowHighlight(row?: HTMLElement): void {
        if (this.hoveredRow && this.hoveredRow.classList.contains('hovered')) {
            this.hoveredRow.classList.remove('hovered');
        }
        row && (row.classList.contains('hovered') ?
            row.classList.remove('hovered') : row.classList.add('hovered'));
    }

    /**
     * Registers a callback for a specific event.
     *
     * @function Highcharts.DataGrid#on
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {Highcharts.EventCallbackFunction<Highcharts.DataGrid>} callback
     * Function to register for an event callback.
     *
     * @return {Function}
     * Function to unregister callback from the event.
     */
    public on<E extends DataEvent>(
        type: E['type'],
        callback: DataEvent.Callback<this, E>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Scroll to a given row.
     * @param  {number} row Row number
     */
    public scrollToRow(row: number): void {
        this.outerContainer.scrollTop = row * this.options.cellHeight;
    }

    // ---------------- Private methods


    private isColumnEditable(columnName: string): boolean {
        const columnOptions = this.options.columns[columnName] || {};
        return pick(
            columnOptions.editable,
            this.options.editable
        );
    }


    /**
     * Get a reference to the underlying DataTable from options, or create one
     * if needed.
     *
     * @return {Highcharts.DataTable}
     * Table reference
     */
    private initDataTable(): DataTable {
        if (this.options.dataTable) {
            return this.options.dataTable;
        }
        return new DataTable();
    }


    /**
     * Render the data grid. To be called on first render, as well as when
     * options change, or the underlying data changes.
     */
    private render(): void {
        const { options } = this;
        this.prevTop = -1;
        this.bottom = false;

        emptyHTMLElement(this.innerContainer);

        if (options.columnHeaders.enabled) {
            this.outerContainer.style.top = this.options.cellHeight + 'px';
            this.renderColumnHeaders();
        } else {
            this.outerContainer.style.top = '0';
        }

        this.updateInnerContainerWidth();
        this.renderInitialRows();
        this.addEvents();
        this.updateScrollingLength();
        this.updateVisibleCells();

        if (options.columnHeaders.enabled && options.resizableColumns) {
            this.renderColumnDragHandles();
        }
    }


    /**
     * Add internal event listeners to the grid.
     */
    private addEvents(): void {
        this.outerContainer.addEventListener('scroll', (e): void => {
            this.onScroll(e);
        });
        document.addEventListener('click', (e): void => {
            this.onDocumentClick(e);
        });
        this.container.addEventListener('mouseover', (e): void => {
            this.handleMouseOver(e);
        });
    }


    private updateVisibleCells = (): void => {
        let scrollTop = this.outerContainer.scrollTop;
        if (H.isSafari) {
            scrollTop = clamp(
                scrollTop,
                0,
                (
                    this.outerContainer.scrollHeight -
                    this.outerContainer.clientHeight
                )
            );
        }

        let i = Math.floor(scrollTop / this.options.cellHeight);
        if (i === this.prevTop) {
            return;
        }
        this.prevTop = i;

        const columnsInPresentationOrder = this.columnNames;
        const rowCount = this.getRowCount();

        for (let j = 0; j < this.rowElements.length && i < rowCount; j++, i++) {
            const rowElement = this.rowElements[j];
            rowElement.dataset.rowIndex = String(i);

            const cellElements = rowElement.childNodes;


            for (let k = 0; k < columnsInPresentationOrder.length; k++) {
                const cell = cellElements[k] as HTMLElement;
                const value = this.dataTable
                    .getCell(columnsInPresentationOrder[k], i);
                cell.textContent = dataTableCellToString(value);

                // TODO: consider adding these dynamically to the input element
                cell.dataset.originalData = cell.textContent;
                cell.dataset.columnName = columnsInPresentationOrder[k];
                // TODO: get this from the store if set?
                cell.dataset.dataType = typeof value;

                if (k === 0) { // first column, that is x
                    rowElement.dataset.rowXIndex =
                        String(isNumber(value) ? value : i);
                }
            }
        }

        // Scroll innerContainer to align the bottom of the last row with the
        // bottom of the grid when scrolled to the end
        if (this.prevTop + this.scrollEndRowCount === rowCount) {
            if (!this.bottom && this.scrollEndTop) {
                this.bottom = true;
                this.innerContainer.scrollTop = this.scrollEndTop;
            }
        } else if (this.bottom) {
            this.bottom = false;
            this.innerContainer.scrollTop = 0;
        }
    };


    /**
     * Handle user scrolling the grid
     * @param {Event} e Event object
     */
    private onScroll(e: Event): void {
        e.preventDefault();
        window.requestAnimationFrame(this.updateVisibleCells);
    }


    /**
     * Handle the user starting interaction with a cell.
     * @param {HTMLElement} cellEl The clicked cell.
     * @param {string} columnName The column the clicked cell belongs to.
     */
    private onCellClick(cellEl: HTMLElement, columnName: string): void {
        if (this.isColumnEditable(columnName)) {
            let input = cellEl.querySelector('input');
            const cellValue = cellEl.textContent;

            if (!input) {
                this.removeCellInputElement();

                // Replace cell contents with an input element
                const inputHeight = cellEl.clientHeight;
                cellEl.textContent = '';
                input = this.cellInputEl = document.createElement('input');
                input.style.height = inputHeight + 'px';
                input.className = 'hc-dg-cell-input';
                cellEl.appendChild(input);
                input.focus();
                input.value = cellValue || '';
            }

            // Emit for use in extensions
            this.emit({ type: 'cellClick', input });
        }
    }


    /**
     * Handle the user clicking somewhere outside the grid.
     * @param {MouseEvent} e Event object.
     */
    private onDocumentClick(e: MouseEvent): void {
        if (this.cellInputEl && e.target) {
            const cellEl = this.cellInputEl.parentNode;
            const isClickInInput = cellEl && cellEl.contains(e.target as Node);
            if (!isClickInInput) {
                this.removeCellInputElement();
            }
        }
    }

    /**
     * Handle hovering over rows- highlight proper row if needed.
     * @param  {MouseEvent} e Mouse event object.
     * @return {void}
     */
    private handleMouseOver(e: MouseEvent): void {
        const target = e.target as HTMLElement;

        if (target && target.classList.contains('hc-dg-cell')) {
            const row = target.parentElement as HTMLElement;
            this.toggleRowHighlight(row);
            this.hoveredRow = row;
            fireEvent(this.container, 'dataGridHover', { row });
        } else if (this.hoveredRow) {
            this.toggleRowHighlight();
            this.hoveredRow = void 0;
        }
    }

    /**
     * Remove the <input> overlay and update the cell value
     */
    private removeCellInputElement(): void {
        const cellInputEl = this.cellInputEl;
        if (cellInputEl) {
            // TODO: This needs to modify DataTable. The change in DataTable
            // should cause a re-render?
            if (cellInputEl.parentNode) {
                cellInputEl.parentNode.textContent = cellInputEl.value;
            }
            cellInputEl.remove();
            delete this.cellInputEl;
        }
    }


    private updateInnerContainerWidth(): void {
        const newWidth = this.scrollContainer.offsetWidth;
        this.innerContainer.style.width = newWidth + 'px';
    }


    private updateScrollingLength(): void {
        const columnsInPresentationOrder = this.columnNames;
        let i = this.dataTable.getRowCount() - 1;
        let height = 0;
        const top = i - this.getNumRowsToDraw();
        const outerHeight = this.outerContainer.clientHeight;

        // Explicit height is needed for overflow: hidden to work, to make sure
        // innerContainer is not scrollable by user input
        this.innerContainer.style.height = outerHeight + 'px';

        // Calculate how many of the bottom rows is needed to potentially
        // overflow innerContainer and use it to add extra rows to scrollHeight
        // to ensure it is possible to scroll to the last row when rows have
        // variable heights
        for (let j = 0; j < this.rowElements.length; j++) {
            const cellElements = this.rowElements[j].childNodes;
            for (let k = 0; k < columnsInPresentationOrder.length; k++) {
                cellElements[k].textContent = dataTableCellToString(
                    this.dataTable.getCell(columnsInPresentationOrder[k], i - j)
                );
            }
        }

        this.scrollContainer.appendChild(this.innerContainer);

        for (let j = 0; i > top; i--, j++) {
            height += this.rowElements[j].offsetHeight;
            if (height > outerHeight) {
                i--;
                break;
            }
        }

        const extraRows = i - top;
        this.scrollEndRowCount = this.rowElements.length - extraRows;
        // How much innerContainer needs to be scrolled to fully show the last
        // row when scrolled to the end
        this.scrollEndTop = height - outerHeight;

        const scrollHeight =
            (this.getRowCount() + extraRows) * this.options.cellHeight;
        this.scrollContainer.style.height = scrollHeight + 'px';
    }


    private getNumRowsToDraw(): number {
        return Math.min(
            this.getRowCount(),
            Math.ceil(
                this.outerContainer.offsetHeight / this.options.cellHeight
            )
        );
    }


    /**
     * Render a data cell.
     * @param {HTMLElement} parentRow The parent row to add the cell to.
     * @param {string} columnName The column the cell belongs to.
     */
    private renderCell(parentRow: HTMLElement, columnName: string): void {
        let className = 'hc-dg-cell';

        if (!this.isColumnEditable(columnName)) {
            className += ' hc-dg-cell-readonly';
        }

        const cellEl = makeDiv(className);
        cellEl.style.minHeight = this.options.cellHeight + 'px';

        cellEl.addEventListener('click', (): void =>
            this.onCellClick(cellEl, columnName)
        );
        parentRow.appendChild(cellEl);
    }


    /**
     * Render a row of data.
     */
    private renderRow(): void {
        const rowEl = makeDiv('hc-dg-row');

        for (let i = 0; i < this.columnNames.length; i++) {
            this.renderCell(rowEl, this.columnNames[i]);
        }

        this.innerContainer.appendChild(rowEl);
        this.rowElements.push(rowEl);
    }


    /**
     * Render a column header for a column.
     * @param {HTMLElement} parentEl The parent element of the column header.
     * @param {string} columnName The name of the column.
     */
    private renderColumnHeader(
        parentEl: HTMLElement,
        columnName: string
    ): void {
        let className = 'hc-dg-column-header';

        if (!this.isColumnEditable(columnName)) {
            className += ' hc-dg-column-header-readonly';
        }

        const headerEl = makeDiv(className);
        headerEl.style.height = this.options.cellHeight + 'px';

        headerEl.textContent = columnName;
        parentEl.appendChild(headerEl);
    }


    /**
     * Render the column headers of the table
     */
    private renderColumnHeaders(): void {
        const columnNames = this.dataTable.getColumnNames();
        const columnHeadersContainer = this.columnHeadersContainer =
            this.columnHeadersContainer || makeDiv('hc-dg-column-headers');

        emptyHTMLElement(columnHeadersContainer);

        columnNames.forEach(
            this.renderColumnHeader.bind(this, columnHeadersContainer)
        );

        this.headerContainer = makeDiv('hc-dg-header-container');
        this.headerContainer.appendChild(columnHeadersContainer);
        this.gridContainer.insertBefore(
            this.headerContainer,
            this.outerContainer
        );
    }


    /**
     * Render initial rows before the user starts scrolling
     */
    private renderInitialRows(): void {
        this.rowElements = [];
        const rowsToDraw = this.getNumRowsToDraw();
        for (let i = 0; i < rowsToDraw; i++) {
            this.renderRow();
        }
    }


    /**
     * Render the drag handles for resizing columns.
     */
    private renderColumnDragHandles(): void {
        if (!this.columnHeadersContainer) {
            return;
        }
        const container = this.columnDragHandlesContainer = (
            this.columnDragHandlesContainer ||
            makeDiv('hc-dg-col-resize-container')
        );
        const columnEls = this.columnHeadersContainer.children;
        const handleHeight = this.options.cellHeight;

        emptyHTMLElement(container);

        for (let i = 1; i < columnEls.length; ++i) {
            const col = columnEls[i] as HTMLElement;
            const handle = makeDiv('hc-dg-col-resize-handle');
            handle.style.height = handleHeight + 'px';
            handle.style.left = col.offsetLeft - 2 + 'px';
            handle.addEventListener('mouseover', (): void => {
                if (!this.draggedResizeHandle) {
                    handle.style.opacity = '1';
                }
            });
            handle.addEventListener('mouseleave', (): void => {
                if (!this.draggedResizeHandle) {
                    handle.style.opacity = '0';
                }
            });
            handle.addEventListener(
                'mousedown',
                this.onHandleMouseDown.bind(this, handle, i)
            );
            container.appendChild(handle);
        }

        this.renderColumnResizeCrosshair(container);

        document.addEventListener('mouseup', (e: MouseEvent): void => {
            if (this.draggedResizeHandle) {
                this.stopColumnResize(this.draggedResizeHandle, e);
            }
        });
        document.addEventListener('mousemove', (e: MouseEvent): void => {
            if (this.draggedResizeHandle) {
                this.updateColumnResizeDrag(e);
            }
        });
        if (this.headerContainer) {
            this.headerContainer.appendChild(container);
        }
    }


    /**
     * Render the crosshair shown when resizing columns.
     * @param {HTMLElement} container The container to place the crosshair in.
     */
    private renderColumnResizeCrosshair(container: HTMLElement): void {
        const el = this.columnResizeCrosshair = (
            this.columnResizeCrosshair ||
            makeDiv('hc-dg-col-resize-crosshair')
        );
        const handleHeight = this.options.cellHeight;

        el.style.top = handleHeight + 'px';
        el.style.height = this.innerContainer.offsetHeight + 'px';

        container.appendChild(el);
    }


    /**
     * On column resize handle click
     * @param {HTMLElement} handle The drag handle being clicked
     * @param {number} colRightIx The column ix to the right of the resize handle
     * @param {MouseEvent} e The mousedown event
     */
    private onHandleMouseDown(
        handle: HTMLElement,
        colRightIx: number,
        e: MouseEvent
    ): void {
        if (this.draggedResizeHandle) {
            return;
        }
        e.preventDefault();
        this.draggedResizeHandle = handle;
        this.draggedColumnRightIx = colRightIx;
        this.dragResizeStart = e.pageX;

        const crosshair = this.columnResizeCrosshair;
        if (crosshair) {
            crosshair.style.left = (
                handle.offsetLeft + handle.offsetWidth / 2 -
                crosshair.offsetWidth / 2 + 'px'
            );
            crosshair.style.opacity = '1';
        }
    }


    /**
     * Update as we drag column resizer
     * @param {MouseEvent} e The mousemove event
     */
    private updateColumnResizeDrag(e: MouseEvent): void {
        const handle = this.draggedResizeHandle;
        const crosshair = this.columnResizeCrosshair;
        const colRightIx = this.draggedColumnRightIx;
        const colHeaders = this.columnHeadersContainer;
        if (
            !handle ||
            !crosshair ||
            colRightIx === null ||
            !colHeaders ||
            !this.dragResizeStart
        ) {
            return;
        }

        const col = colHeaders.children[colRightIx] as HTMLElement;
        const diff = e.pageX - this.dragResizeStart;
        const newPos = col.offsetLeft + diff;
        handle.style.left = newPos - handle.offsetWidth / 2 + 'px';
        crosshair.style.left = newPos - crosshair.offsetWidth / 2 + 'px';
    }


    /**
     * Stop resizing a column
     * @param {HTMLElement} handle The handle being dragged
     * @param {MouseEvent} e The mouse up event
     */
    private stopColumnResize(handle: HTMLElement, e: MouseEvent): void {
        const crosshair = this.columnResizeCrosshair;
        const colRightIx = this.draggedColumnRightIx;
        const colContainer = this.columnHeadersContainer;
        if (
            !crosshair ||
            !colContainer ||
            !this.dragResizeStart ||
            colRightIx === null
        ) {
            return;
        }
        handle.style.opacity = '0';
        crosshair.style.opacity = '0';

        const colLeft = colContainer.children[colRightIx - 1] as HTMLElement;
        const colRight = colContainer.children[colRightIx] as HTMLElement;
        const diff = e.pageX - this.dragResizeStart;
        const newWidthLeft = colLeft.offsetWidth + diff;
        const newWidthRight = colRight.offsetWidth - diff;
        const diffRatioLeft = newWidthLeft / colLeft.offsetWidth;
        const diffRatioRight = newWidthRight / colRight.offsetWidth;
        const leftFlexRatio = (
            (colLeft.style.flex ? parseFloat(colLeft.style.flex) : 1) *
            diffRatioLeft
        );
        const rightFlexRatio = (
            (colRight.style.flex ? parseFloat(colRight.style.flex) : 1) *
            diffRatioRight
        );

        this.resizeColumn(leftFlexRatio, colRightIx - 1);
        this.resizeColumn(rightFlexRatio, colRightIx);

        this.draggedResizeHandle = null;
        this.draggedColumnRightIx = null;
    }

    /**
     * Update the size of datagrid container
     * @param {number | string | null} width new width
     * @param {number | string | null} height new height
     */
    public setSize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        if (width) {
            this.innerContainer.style.width = width + 'px';
        }

        if (height) {
            this.gridContainer.style.height = height + 'px';
            this.outerContainer.style.height = height + 'px';
        }

        this.render();
    }
}

namespace DataGrid {

    export type Event = (
        ColumnResizeEvent |
        CellClickEvent
    );

    export interface ColumnResizeEvent extends DataEvent {
        readonly type: 'afterResizeColumn';
        readonly width: number;
        readonly index?: number;
        readonly name?: string;
    }

    export interface CellClickEvent {
        readonly type: 'cellClick';
        readonly input: HTMLElement;
    }
}

export default DataGrid;
