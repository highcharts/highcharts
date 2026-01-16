/* *
 *
 *  Grid Table Viewport class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type TableRow from './Body/TableRow';

import GridUtils from '../GridUtils.js';
import Utils from '../../../Core/Utilities.js';
import DataTable from '../../../Data/DataTable.js';
import ColumnResizing from './ColumnResizing/ColumnResizing.js';
import ColumnResizingMode from './ColumnResizing/ResizingMode.js';
import Column from './Column.js';
import TableHeader from './Header/TableHeader.js';
import Grid from '../Grid.js';
import RowsVirtualizer from './Actions/RowsVirtualizer.js';
import ColumnsResizer from './Actions/ColumnsResizer.js';
import Globals from '../Globals.js';
import Cell from './Cell.js';

const { makeHTMLElement } = GridUtils;
const {
    fireEvent,
    getStyle,
    defined
} = Utils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table viewport of the data grid.
 */
class Table {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The data grid instance which the table (viewport) belongs to.
     */
    public readonly grid: Grid;

    /**
     * The presentation version of the data table. It has applied modifiers
     * and is ready to be rendered.
     *
     * If you want to modify the data table, you should use the original
     * instance that is stored in the `grid.dataTable` property.
     */
    public dataTable: DataTable;

    /**
     * The HTML element of the table.
     */
    public readonly tableElement: HTMLTableElement;

    /**
     * The HTML element of the table head.
     */
    public readonly theadElement?: HTMLElement;

    /**
     * The HTML element of the table body.
     */
    public readonly tbodyElement: HTMLElement;

    /**
     * The head of the table.
     */
    public header?: TableHeader;

    /**
     * The visible columns of the table.
     */
    public columns: Column[] = [];

    /**
     * The visible rows of the table.
     */
    public rows: TableRow[] = [];

    /**
     * The resize observer for the table container.
     * @internal
     */
    public resizeObserver: ResizeObserver;

    /**
     * The rows virtualizer instance that handles the rows rendering &
     * dimensioning logic.
     * @internal
     */
    public rowsVirtualizer: RowsVirtualizer;

    /**
     * The column distribution.
     */
    public readonly columnResizing: ColumnResizingMode;

    /**
     * The columns resizer instance that handles the columns resizing logic.
     * @internal
     */
    public columnsResizer?: ColumnsResizer;

    /**
     * The width of each row in the table. Each of the rows has the same width.
     * Only for the `fixed` column distribution.
     * @internal
     */
    public rowsWidth?: number;

    /**
     * The flag that indicates if the table columns are virtualized.
     */
    public virtualColumns: boolean;

    /**
     * The focus cursor position: [rowIndex, columnIndex] or `undefined` if the
     * table cell is not focused.
     */
    public focusCursor?: [number, number];

    /**
     * The only cell that is to be focusable using tab key - a table focus
     * entry point.
     */
    public focusAnchorCell?: Cell;

    /**
     * The flag that indicates if the table rows are virtualized.
     */
    public virtualRows: boolean;

    /**
     * Cached column offsets for virtualization.
     */
    private columnOffsets: number[] = [];

    /**
     * Cached column widths for virtualization.
     */
    private columnWidths: number[] = [];

    /**
     * Cached column viewport data for virtualization.
     */
    private columnViewport?: ColumnViewport;

    /**
     * Whether column metrics should be recalculated.
     */
    private columnMetricsDirty = true;

    /**
     * Tracks the last horizontal scroll position.
     */
    private lastScrollLeft?: number;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid table.
     *
     * @param grid
     * The data grid instance which the table (viewport) belongs to.
     *
     * @param tableElement
     * The HTML table element of the data grid.
     */
    constructor(
        grid: Grid,
        tableElement: HTMLTableElement
    ) {
        this.grid = grid;
        this.tableElement = tableElement;
        this.dataTable = this.grid.presentationTable as DataTable;

        const dgOptions = grid.options;
        const customClassName = dgOptions?.rendering?.table?.className;

        this.columnResizing = ColumnResizing.initMode(this);

        if (dgOptions?.rendering?.header?.enabled) {
            this.theadElement = makeHTMLElement('thead', {}, tableElement);
        }
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);

        if (dgOptions?.rendering?.columns?.resizing?.enabled) {
            this.columnsResizer = new ColumnsResizer(this);
        }

        if (customClassName) {
            tableElement.classList.add(...customClassName.split(/\s+/g));
        }
        tableElement.classList.add(Globals.getClassName('scrollableContent'));

        // Load columns
        this.loadColumns();

        this.virtualColumns = this.shouldVirtualizeColumns();

        // Virtualization
        this.virtualRows = this.shouldVirtualizeRows();
        if (this.virtualRows) {
            tableElement.classList.add(
                Globals.getClassName('virtualization')
            );
        }
        this.rowsVirtualizer = new RowsVirtualizer(this);

        // Init Table
        this.init();

        // Add event listeners
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(tableElement);

        this.tbodyElement.addEventListener('scroll', this.onScroll);
        this.tbodyElement.addEventListener('focus', this.onTBodyFocus);

        // Delegated cell events
        this.tbodyElement.addEventListener('click', this.onCellClick);
        this.tbodyElement.addEventListener('dblclick', this.onCellDblClick);
        this.tbodyElement.addEventListener('mousedown', this.onCellMouseDown);
        this.tbodyElement.addEventListener('mouseover', this.onCellMouseOver);
        this.tbodyElement.addEventListener('mouseout', this.onCellMouseOut);
        this.tbodyElement.addEventListener('keydown', this.onCellKeyDown);
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Initializes the data grid table.
     */
    private init(): void {
        fireEvent(this, 'beforeInit');

        this.setTbodyMinHeight();

        // Load & render head
        if (this.grid.options?.rendering?.header?.enabled) {
            this.header = new TableHeader(this);
            this.header.render();
        }

        // TODO: Load & render footer
        // this.footer = new TableFooter(this);
        // this.footer.render();

        if (this.virtualColumns) {
            this.updateColumnMetrics();
            this.columnViewport = this.calculateColumnViewport();
        }

        this.rowsVirtualizer.initialRender();
        this.updateColumnViewport(true);
        fireEvent(this, 'afterInit');
    }

    /**
     * Sets the minimum height of the table body.
     */
    private setTbodyMinHeight(): void {
        const { options } = this.grid;
        const minVisibleRows = options?.rendering?.rows?.minVisibleRows;

        const tbody = this.tbodyElement;
        if (
            defined(minVisibleRows) &&
            !getStyle(tbody, 'min-height', true)
        ) {
            tbody.style.minHeight = (
                minVisibleRows * this.rowsVirtualizer.defaultRowHeight
            ) + 'px';
        }
    }

    /**
     * Checks if rows virtualization should be enabled.
     *
     * @returns
     * Whether rows virtualization should be enabled.
     */
    private shouldVirtualizeRows(): boolean {
        const { grid } = this;
        const rows = grid.userOptions.rendering?.rows;
        if (defined(rows?.virtualization)) {
            return rows.virtualization;
        }

        // Consider changing this to use the presentation table row count
        // instead of the original data table row count.
        const rowCount = Number(grid.dataTable?.rowCount);
        const threshold = rows?.virtualizationThreshold ?? 50;

        if (grid.pagination) {
            return grid.querying.pagination.currentPageSize >= threshold;
        }

        return rowCount >= threshold;
    }

    /**
     * Checks if columns virtualization should be enabled.
     */
    private shouldVirtualizeColumns(): boolean {
        const { grid } = this;
        const columns = grid.userOptions.rendering?.columns;
        if (defined(columns?.virtualization)) {
            return columns.virtualization;
        }

        const threshold = columns?.virtualizationThreshold ?? 50;
        return this.columns.length >= threshold;
    }

    /**
     * Returns the current column viewport for column virtualization.
     */
    public getColumnViewport(): ColumnViewport | undefined {
        if (!this.virtualColumns) {
            return void 0;
        }
        if (!this.columnViewport) {
            this.columnViewport = this.calculateColumnViewport();
        }
        return this.columnViewport;
    }

    /**
     * Ensures the column viewport includes the provided column index.
     *
     * @param columnIndex
     * The column index to include.
     *
     * @param rowIndex
     * Optional row index to keep focus cursor aligned.
     */
    public ensureColumnViewport(columnIndex: number, rowIndex?: number): void {
        if (!this.virtualColumns) {
            return;
        }

        if (defined(rowIndex)) {
            this.focusCursor = [rowIndex, columnIndex];
        }

        const current = this.columnViewport;
        if (
            !current ||
            columnIndex < current.start ||
            columnIndex > current.end
        ) {
            this.updateColumnViewport(true);
        }
    }

    /**
     * Loads the columns of the table.
     */
    private loadColumns(): void {
        const { enabledColumns } = this.grid;
        if (!enabledColumns) {
            return;
        }

        let columnId: string;
        for (let i = 0, iEnd = enabledColumns.length; i < iEnd; ++i) {
            columnId = enabledColumns[i];
            this.columns.push(
                new Column(this, columnId, i)
            );
        }

        this.columnResizing.loadColumns();
    }

    /**
     * Updates the rows of the table.
     */
    public async updateRows(): Promise<void> {
        const vp = this;
        const trackTimings = !!vp.grid.options?.performance?.timings?.enabled;
        const now = trackTimings ? (
            typeof performance !== 'undefined' && performance.now ?
                performance.now.bind(performance) :
                Date.now
        ) : null;
        const timings = trackTimings ? {
            totalMs: 0,
            queryMs: 0,
            loadColumnsMs: 0,
            virtualizationMs: 0,
            rowsMs: 0,
            reflowMs: 0,
            paginationMs: 0,
            focusMs: 0,
            rowCount: 0,
            reuseRows: false,
            recycleStats: void 0 as {
                created: number;
                reused: number;
                pooled: number;
                kept: number;
            } | undefined
        } : null;
        const totalStart = now ? now() : 0;

        let focusedRowId: number | undefined;
        if (vp.focusCursor) {
            focusedRowId = vp.dataTable.getOriginalRowIndex(vp.focusCursor[0]);
        }

        vp.grid.querying.pagination.clampPage();

        // Update data
        const oldRowsCount = (vp.rows[vp.rows.length - 1]?.index ?? -1) + 1;
        if (timings && now) {
            const start = now();
            await vp.grid.querying.proceed();
            timings.queryMs = now() - start;
        } else {
            await vp.grid.querying.proceed();
        }
        vp.dataTable = vp.grid.presentationTable as DataTable;
        if (timings && now) {
            const start = now();
            for (const column of vp.columns) {
                column.loadData();
            }
            timings.loadColumnsMs = now() - start;
        } else {
            for (const column of vp.columns) {
                column.loadData();
            }
        }

        // Update virtualization if needed
        let shouldVirtualize: boolean;
        let shouldRerender = false;
        if (timings && now) {
            const start = now();
            shouldVirtualize = this.shouldVirtualizeRows();
            if (this.virtualRows !== shouldVirtualize) {
                this.virtualRows = shouldVirtualize;
                vp.tableElement.classList.toggle(
                    Globals.getClassName('virtualization'),
                    shouldVirtualize
                );
                shouldRerender = true;
            }
            timings.virtualizationMs = now() - start;
        } else {
            shouldVirtualize = this.shouldVirtualizeRows();
            if (this.virtualRows !== shouldVirtualize) {
                this.virtualRows = shouldVirtualize;
                vp.tableElement.classList.toggle(
                    Globals.getClassName('virtualization'),
                    shouldVirtualize
                );
                shouldRerender = true;
            }
        }

        const rowCountChanged = oldRowsCount !== vp.dataTable.rowCount;
        const reuseRows = rowCountChanged && !shouldRerender;
        if (timings) {
            timings.reuseRows = reuseRows;
        }

        if (timings && now) {
            const start = now();
            if (shouldRerender || rowCountChanged) {
                // Rerender rows, optionally reusing DOM.
                vp.rowsVirtualizer.rerender(reuseRows);
            } else {
                // Update existing rows
                for (let i = 0, iEnd = vp.rows.length; i < iEnd; ++i) {
                    vp.rows[i].update();
                }
            }
            timings.rowsMs = now() - start;
        } else if (shouldRerender || rowCountChanged) {
            // Rerender all rows
            vp.rowsVirtualizer.rerender(reuseRows);
        } else {
            // Update existing rows
            for (let i = 0, iEnd = vp.rows.length; i < iEnd; ++i) {
                vp.rows[i].update();
            }
        }

        // Update the pagination controls
        if (timings && now) {
            const start = now();
            vp.grid.pagination?.updateControls();
            timings.paginationMs = now() - start;
        } else {
            vp.grid.pagination?.updateControls();
        }

        if (timings && now) {
            const start = now();
            vp.reflow();
            timings.reflowMs = now() - start;
        } else {
            vp.reflow();
        }

        // Scroll to the focused row
        if (timings && now) {
            const start = now();
            if (focusedRowId !== void 0 && vp.focusCursor) {
                const newRowIndex = vp.dataTable.getLocalRowIndex(focusedRowId);
                if (newRowIndex !== void 0) {
                    // Scroll to the focused row.
                    vp.scrollToRow(newRowIndex);

                    // Focus the cell that was focused before the update.
                    setTimeout((): void => {
                        if (!defined(vp.focusCursor?.[1])) {
                            return;
                        }
                        const row = vp.rows[
                            newRowIndex - vp.rows[0].index
                        ];
                        const columnIndex = vp.focusCursor[1];
                        const cell = row?.cells[columnIndex];
                        if (!cell) {
                            return;
                        }
                        if (
                            vp.virtualColumns &&
                            !cell.htmlElement.isConnected
                        ) {
                            vp.ensureColumnViewport(columnIndex, row.index);
                        }
                        cell.htmlElement.focus();
                    });
                }
            }
            timings.focusMs = now() - start;
        } else if (focusedRowId !== void 0 && vp.focusCursor) {
            const newRowIndex = vp.dataTable.getLocalRowIndex(focusedRowId);
            if (newRowIndex !== void 0) {
                // Scroll to the focused row.
                vp.scrollToRow(newRowIndex);

                // Focus the cell that was focused before the update.
                setTimeout((): void => {
                    if (!defined(vp.focusCursor?.[1])) {
                        return;
                    }
                    const row = vp.rows[
                        newRowIndex - vp.rows[0].index
                    ];
                    const columnIndex = vp.focusCursor[1];
                    const cell = row?.cells[columnIndex];
                    if (!cell) {
                        return;
                    }
                    if (
                        vp.virtualColumns &&
                        !cell.htmlElement.isConnected
                    ) {
                        vp.ensureColumnViewport(columnIndex, row.index);
                    }
                    cell.htmlElement.focus();
                });
            }
        }

        vp.grid.dirtyFlags.delete('rows');

        if (timings) {
            const end = now ? now() : Date.now();
            timings.totalMs = end - totalStart;
            timings.rowCount = vp.dataTable.rowCount;
            timings.recycleStats = vp.rowsVirtualizer.lastRecycleStats;
            vp.grid.performanceStats = { updateRows: timings };
        }
    }

    /**
     * Reflows the table's content dimensions.
     */
    public reflow(): void {
        // TODO: More `needsReflow` logic can be added in the future to avoid
        // unnecessary reflows of the table parts.

        this.columnResizing.reflow();
        this.columnMetricsDirty = true;
        if (this.virtualColumns) {
            this.updateColumnMetrics();
        }

        // Reflow the head
        this.header?.reflow();

        // Reflow rows content dimensions
        this.rowsVirtualizer.reflowRows();

        // Reflow the pagination
        this.grid.pagination?.reflow();

        // Reflow popups
        this.grid.popups.forEach((popup): void => {
            popup.reflow();
        });

        if (this.virtualColumns) {
            this.updateColumnViewport(true);
        }

        this.grid.dirtyFlags.delete('reflow');
    }

    /**
     * Handles the focus event on the table body.
     *
     * @param e
     * The focus event.
     */
    private onTBodyFocus = (e: FocusEvent): void => {
        e.preventDefault();

        const row = this.rows[
            this.rowsVirtualizer.rowCursor - this.rows[0].index
        ];
        row?.getFirstRenderedCell()?.htmlElement.focus();
    };

    /**
     * Handles the resize event.
     */
    private onResize = (): void => {
        this.reflow();
    };

    /**
     * Handles the scroll event.
     */
    private onScroll = (): void => {
        if (this.virtualRows) {
            this.rowsVirtualizer.scroll();
        }

        this.header?.scrollHorizontally(this.tbodyElement.scrollLeft);

        const scrollLeft = this.tbodyElement.scrollLeft;
        if (this.virtualColumns && scrollLeft !== this.lastScrollLeft) {
            this.lastScrollLeft = scrollLeft;
            this.updateColumnViewport();
        }
    };

    /**
     * Delegated click handler for cells.
     * @param e Mouse event
     */
    private onCellClick = (e: MouseEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (cell) {
            (cell as { onClick(e: MouseEvent | KeyboardEvent): void })
                .onClick(e);
        }
    };

    /**
     * Delegated double-click handler for cells.
     * @param e Mouse event
     */
    private onCellDblClick = (e: MouseEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (cell && 'onDblClick' in cell) {
            (cell as { onDblClick(e: MouseEvent): void }).onDblClick(e);
        }
    };

    /**
     * Delegated mousedown handler for cells.
     * @param e Mouse event
     */
    private onCellMouseDown = (e: MouseEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (cell && 'onMouseDown' in cell) {
            (cell as { onMouseDown(e: MouseEvent): void }).onMouseDown(e);
        }
    };

    /**
     * Delegated mouseover handler for cells.
     * @param e Mouse event
     */
    private onCellMouseOver = (e: MouseEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (cell) {
            (cell as { onMouseOver(): void }).onMouseOver();
        }
    };

    /**
     * Delegated mouseout handler for cells.
     * @param e Mouse event
     */
    private onCellMouseOut = (e: MouseEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (cell) {
            (cell as { onMouseOut(): void }).onMouseOut();
        }
    };

    /**
     * Delegated keydown handler for cells.
     * @param e Keyboard event
     */
    private onCellKeyDown = (e: KeyboardEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (cell) {
            (cell as { onKeyDown(e: KeyboardEvent): void }).onKeyDown(e);
        }
    };

    /**
     * Scrolls the table to the specified row.
     *
     * @param index
     * The index of the row to scroll to.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/scroll-to-row | Scroll to row}
     */
    public scrollToRow(index: number): void {
        if (this.virtualRows) {
            this.tbodyElement.scrollTop =
                index * this.rowsVirtualizer.defaultRowHeight;
            return;
        }

        const rowClass = '.' + Globals.getClassName('rowElement');
        const firstRowTop = this.tbodyElement
            .querySelectorAll(rowClass)[0]
            .getBoundingClientRect().top;

        this.tbodyElement.scrollTop = (
            this.tbodyElement
                .querySelectorAll(rowClass)[index]
                .getBoundingClientRect().top
        ) - firstRowTop;
    }

    /**
     * Get the widthRatio value from the width in pixels. The widthRatio is
     * calculated based on the width of the viewport.
     *
     * @param width
     * The width in pixels.
     *
     * @return The width ratio.
     *
     * @internal
     */
    public getRatioFromWidth(width: number): number {
        return width / this.tbodyElement.clientWidth;
    }

    /**
     * Get the width in pixels from the widthRatio value. The width is
     * calculated based on the width of the viewport.
     *
     * @param ratio
     * The width ratio.
     *
     * @returns The width in pixels.
     *
     * @internal
     */
    public getWidthFromRatio(ratio: number): number {
        return this.tbodyElement.clientWidth * ratio;
    }

    /**
     * Finds a cell from a DOM element within the table body.
     *
     * @param element
     * The DOM element to find the cell for (typically event.target).
     *
     * @returns
     * The Cell instance or undefined if not found.
     *
     * @internal
     */
    public getCellFromElement(element: EventTarget | null): Cell | undefined {
        if (!(element instanceof Element)) {
            return;
        }

        const td = element.closest('td');
        if (!td) {
            return;
        }

        const tr = td.parentElement;
        if (!tr) {
            return;
        }

        const rowIndexAttr = tr.getAttribute('data-row-index');
        if (rowIndexAttr === null) {
            return;
        }

        const rowIndex = parseInt(rowIndexAttr, 10);
        const firstRowIndex = this.rows[0]?.index ?? 0;
        const row = this.rows[rowIndex - firstRowIndex];
        if (!row) {
            return;
        }

        const columnId = td.getAttribute('data-column-id');
        if (!columnId) {
            return;
        }

        return row.getCell(columnId);
    }

    /**
     * Updates cached column metrics used for virtualization.
     */
    private updateColumnMetrics(): void {
        if (
            !this.columnMetricsDirty &&
            this.columnOffsets.length === this.columns.length
        ) {
            return;
        }

        const offsets = this.columnOffsets;
        const widths = this.columnWidths;
        const columns = this.columns;

        offsets.length = columns.length;
        widths.length = columns.length;

        let offset = 0;
        for (let i = 0, iEnd = columns.length; i < iEnd; ++i) {
            const width = this.columnResizing.getColumnWidth(columns[i]);
            offsets[i] = offset;
            widths[i] = width;
            offset += width;
        }

        this.columnMetricsDirty = false;
    }

    /**
     * Calculates the current column viewport for virtualization.
     *
     * @param scrollLeft
     * The horizontal scroll offset.
     */
    private calculateColumnViewport(
        scrollLeft: number = this.tbodyElement.scrollLeft
    ): ColumnViewport | undefined {
        const columnCount = this.columns.length;
        if (!columnCount) {
            return;
        }

        this.updateColumnMetrics();

        const viewportWidth = this.tbodyElement.clientWidth;
        const leftEdge = Math.max(scrollLeft, 0);
        const rightEdge = leftEdge + viewportWidth;

        const startIndex = this.findColumnStart(leftEdge);
        const endIndex = this.findColumnEnd(rightEdge);

        const bufferSize = Math.max(
            this.grid.userOptions.rendering?.columns?.bufferSize ?? 2,
            0
        );

        let start = Math.max(0, startIndex - bufferSize);
        let end = Math.min(columnCount - 1, endIndex + bufferSize);

        const focusIndex = this.focusCursor?.[1];
        if (defined(focusIndex)) {
            start = Math.min(start, focusIndex);
            end = Math.max(end, focusIndex);
        }

        const totalWidth = this.columnOffsets[columnCount - 1] +
            this.columnWidths[columnCount - 1];
        const leftPad = this.columnOffsets[start] ?? 0;
        const rightEdgeOffset =
            this.columnOffsets[end] + this.columnWidths[end];
        const rightPad = Math.max(totalWidth - rightEdgeOffset, 0);

        return {
            start,
            end,
            leftPad,
            rightPad
        };
    }

    private findColumnStart(leftEdge: number): number {
        const offsets = this.columnOffsets;
        const widths = this.columnWidths;
        let low = 0;
        let high = offsets.length - 1;
        let result = 0;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (offsets[mid] + widths[mid] > leftEdge) {
                result = mid;
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        return result;
    }

    private findColumnEnd(rightEdge: number): number {
        const offsets = this.columnOffsets;
        let low = 0;
        let high = offsets.length - 1;
        let result = high;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (offsets[mid] < rightEdge) {
                result = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return result;
    }

    /**
     * Updates the rendered columns for all rendered rows.
     *
     * @param force
     * Whether to force an update even if the viewport did not change.
     */
    private updateColumnViewport(force: boolean = false): void {
        const shouldVirtualize = this.shouldVirtualizeColumns();
        if (!shouldVirtualize) {
            if (this.virtualColumns) {
                this.virtualColumns = false;
                this.columnViewport = void 0;
                for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
                    this.rows[i].updateRenderedColumns();
                }
            }
            return;
        }

        this.virtualColumns = true;
        const nextViewport = this.calculateColumnViewport();
        if (!nextViewport) {
            return;
        }

        if (
            !force &&
            this.columnViewport &&
            this.columnViewport.start === nextViewport.start &&
            this.columnViewport.end === nextViewport.end &&
            this.columnViewport.leftPad === nextViewport.leftPad &&
            this.columnViewport.rightPad === nextViewport.rightPad
        ) {
            return;
        }

        this.columnViewport = nextViewport;
        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].updateRenderedColumns(nextViewport);
        }
    }

    /**
     * Destroys the grid table.
     */
    public destroy(): void {
        this.tbodyElement.removeEventListener('focus', this.onTBodyFocus);
        this.tbodyElement.removeEventListener('scroll', this.onScroll);
        this.tbodyElement.removeEventListener('click', this.onCellClick);
        this.tbodyElement.removeEventListener('dblclick', this.onCellDblClick);
        this.tbodyElement.removeEventListener(
            'mousedown', this.onCellMouseDown
        );
        this.tbodyElement.removeEventListener(
            'mouseover', this.onCellMouseOver
        );
        this.tbodyElement.removeEventListener('mouseout', this.onCellMouseOut);
        this.tbodyElement.removeEventListener('keydown', this.onCellKeyDown);
        this.resizeObserver.disconnect();
        this.columnsResizer?.removeEventListeners();
        this.header?.destroy();

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].destroy();
        }

        fireEvent(this, 'afterDestroy');
    }

    /**
     * Get the viewport state metadata. It is used to save the state of the
     * viewport and restore it when the data grid is re-rendered.
     *
     * @returns
     * The viewport state metadata.
     */
    public getStateMeta(): ViewportStateMetadata {
        return {
            scrollTop: this.tbodyElement.scrollTop,
            scrollLeft: this.tbodyElement.scrollLeft,
            columnResizing: this.columnResizing,
            focusCursor: this.focusCursor
        };
    }

    /**
     * Apply the metadata to the viewport state. It is used to restore the state
     * of the viewport when the data grid is re-rendered.
     *
     * @param meta
     * The viewport state metadata.
     */
    public applyStateMeta(
        meta: ViewportStateMetadata
    ): void {
        this.tbodyElement.scrollTop = meta.scrollTop;
        this.tbodyElement.scrollLeft = meta.scrollLeft;

        if (meta.focusCursor) {
            const [rowIndex, columnIndex] = meta.focusCursor;
            const row = this.rows[rowIndex - this.rows[0].index];
            const cell = row?.cells[columnIndex];
            if (!cell) {
                return;
            }
            if (this.virtualColumns && !cell.htmlElement.isConnected) {
                this.ensureColumnViewport(columnIndex, row.index);
            }
            cell.htmlElement.focus();
        }
    }

    /**
     * Sets the focus anchor cell.
     *
     * @param cell
     * The cell to set as the focus anchor cell.
     */
    public setFocusAnchorCell(cell: Cell): void {
        this.focusAnchorCell?.htmlElement.setAttribute('tabindex', '-1');
        this.focusAnchorCell = cell;
        this.focusAnchorCell.htmlElement.setAttribute('tabindex', '0');
    }

    /**
     * Returns the column with the provided ID.
     *
     * @param id
     * The ID of the column.
     */
    public getColumn(id: string): Column | undefined {
        const columns = this.grid.enabledColumns;

        if (!columns) {
            return;
        }
        const columnIndex = columns.indexOf(id);
        if (columnIndex < 0) {
            return;
        }

        return this.columns[columnIndex];
    }

    /**
     * Returns the row with the provided ID.
     *
     * @param id
     * The ID of the row.
     */
    public getRow(id: number): TableRow | undefined {
        // TODO: Change `find` to a method using `vp.dataTable.getLocalRowIndex`
        // and rows[presentationRowIndex - firstRowIndex]. Needs more testing,
        // but it should be faster.
        return this.rows.find((row): boolean => row.id === id);
    }
}

/**
 * Column viewport data for column virtualization.
 */
export interface ColumnViewport {
    start: number;
    end: number;
    leftPad: number;
    rightPad: number;
}

/**
 * Represents the metadata of the viewport state. It is used to save the
 * state of the viewport and restore it when the data grid is re-rendered.
 */
export interface ViewportStateMetadata {
    scrollTop: number;
    scrollLeft: number;
    columnResizing: ColumnResizingMode;
    focusCursor?: [number, number];
}


/* *
 *
 *  Default Export
 *
 * */

export default Table;
