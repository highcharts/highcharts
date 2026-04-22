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
 *  - Dawid Draguła
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../../Data/DataTable';
import type DataProvider from '../Data/DataProvider';
import type TableCell from './Body/TableCell';
import type { RowId } from '../Data/DataProvider';

import GridUtils from '../GridUtils.js';
import ColumnResizing from './ColumnResizing/ColumnResizing.js';
import ColumnResizingMode from './ColumnResizing/ResizingMode.js';
import Column from './Column.js';
import TableRow from './Body/TableRow.js';
import TableHeader from './Header/TableHeader.js';
import Grid from '../Grid.js';
import RowsVirtualizer from './Actions/RowsVirtualizer.js';
import ColumnsResizer from './Actions/ColumnsResizer.js';
import Globals from '../Globals.js';

import Cell from './Cell.js';
import { defined, fireEvent, getStyle } from '../../../Shared/Utilities.js';
import CellContextMenu from './Body/CellContextMenu.js';
import CellContextMenuBuiltInActions from './Body/CellContextMenuBuiltInActions.js';

const { makeHTMLElement } = GridUtils;


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
     * Additional rendered body sections composed into the table.
     */
    private readonly bodySections: TableBodySection[] = [];

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
     * The focus cursor position or `undefined` if no table cell is focused.
     */
    public focusCursor?: FocusCursor;

    /**
     * Pending focus target used while virtualization scrolls a body row into
     * the render window.
     */
    public pendingFocusCursor?: [number, number];

    /**
     * The only cell that is to be focusable using tab key - a table focus
     * entry point.
     */
    public focusAnchorCell?: Cell;

    /**
     * Whether the current logical focus belongs to a body cell that has been
     * detached from the DOM by virtualization.
     */
    private hasDetachedFocus = false;

    /**
     * The flag that indicates if the table rows are virtualized.
     */
    public virtualRows: boolean = true;

    /**
     * Cell context menu instance (lazy created).
     */
    private cellContextMenu?: CellContextMenu;

    /**
     * Async hooks executed after the main row update cycle.
     * @internal
     */
    public readonly afterUpdateRowsHooks: Array<() => Promise<void>> = [];

    /**
     * Whether the table body min-height was set by the grid.
     */
    private tbodyMinHeightManaged = false;

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

        this.columnResizing = ColumnResizing.initMode(this);

        if (grid.options?.rendering?.header?.enabled) {
            this.theadElement = makeHTMLElement('thead', {}, tableElement);
        }
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);

        this.rowsVirtualizer = new RowsVirtualizer(this);

        fireEvent(this, 'beforeInit');

        // Add event listeners
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(tableElement);

        this.tbodyElement.addEventListener('scroll', this.onScroll);
        this.addBodyEventListeners(this.tbodyElement);
        document.addEventListener('focusin', this.onDocumentFocusIn, true);
        document.addEventListener(
            'pointerdown',
            this.onDocumentPointerDown,
            true
        );
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * The presentation version of the data table. It has applied modifiers
     * and is ready to be rendered.
     *
     * @deprecated Use `grid.dataProvider` instead.
     */
    public get dataTable(): DataTable | undefined {
        const dp = this.grid.dataProvider as (
            DataProvider & {
                getDataTable?(presentation?: boolean): DataTable | undefined;
            }
        ) | undefined;

        return dp?.getDataTable?.(true);
    }

    /**
     * Initializes the table. Should be called after creation so that the table
     * can be asynchronously initialized.
     */
    public async init(): Promise<void> {
        try {
            this.grid.showLoading();
            const { tableElement } = this;
            const renderingOptions = this.grid.options?.rendering;
            const customClassName = renderingOptions?.table?.className;

            this.virtualRows = await this.shouldVirtualizeRows();

            if (this.virtualRows) {
                tableElement.classList.add(
                    Globals.getClassName('virtualization')
                );
            }

            if (renderingOptions?.columns?.resizing?.enabled) {
                this.columnsResizer = new ColumnsResizer(this);
            }

            if (customClassName) {
                tableElement.classList.add(...customClassName.split(/\s+/g));
            }
            tableElement.classList.add(
                Globals.getClassName('scrollableContent')
            );

            await this.loadColumns();
            this.setTbodyMinHeight();

            // Load & render head
            if (this.grid.options?.rendering?.header?.enabled) {
                this.header = new TableHeader(this);
                await this.header.render();
            }

            // TODO(footer): Load & render footer
            // this.footer = new TableFooter(this);
            // this.footer.render();

            // Ensure row widths are ready before first row render to prevent
            // initial pinned-row misalignment.
            this.columnResizing.reflow();
            await this.rowsVirtualizer.initialRender();
        } finally {
            fireEvent(this, 'afterInit');
            this.reflow();
            this.grid.hideLoading();
        }
    }

    private addBodyEventListeners(body: HTMLElement): void {
        body.addEventListener('focus', this.onTBodyFocus);
        body.addEventListener('click', this.onCellClick);
        body.addEventListener('dblclick', this.onCellDblClick);
        body.addEventListener('contextmenu', this.onCellContextMenu);
        body.addEventListener('mousedown', this.onCellMouseDown);
        body.addEventListener('mouseover', this.onCellMouseOver);
        body.addEventListener('mouseout', this.onCellMouseOut);
        body.addEventListener('keydown', this.onCellKeyDown);
    }

    private removeBodyEventListeners(body: HTMLElement): void {
        body.removeEventListener('focus', this.onTBodyFocus);
        body.removeEventListener('click', this.onCellClick);
        body.removeEventListener('dblclick', this.onCellDblClick);
        body.removeEventListener('contextmenu', this.onCellContextMenu);
        body.removeEventListener('mousedown', this.onCellMouseDown);
        body.removeEventListener('mouseover', this.onCellMouseOver);
        body.removeEventListener('mouseout', this.onCellMouseOut);
        body.removeEventListener('keydown', this.onCellKeyDown);
    }

    /**
     * Registers an auxiliary table body section.
     *
     * @param section
     * Body section descriptor.
     *
     * @internal
     */
    public registerBodySection(section: TableBodySection): void {
        this.unregisterBodySection(section.id);
        this.bodySections.push(section);
        this.addBodyEventListeners(section.tbodyElement);
    }

    /**
     * Unregisters an auxiliary table body section.
     *
     * @param sectionId
     * Body section ID.
     *
     * @internal
     */
    public unregisterBodySection(sectionId: string): void {
        const sectionIndex = this.bodySections.findIndex(
            (section): boolean => section.id === sectionId
        );
        if (sectionIndex < 0) {
            return;
        }

        this.removeBodyEventListeners(
            this.bodySections[sectionIndex].tbodyElement
        );
        this.bodySections.splice(sectionIndex, 1);
    }

    /**
     * Sets the minimum height of the table body.
     */
    private setTbodyMinHeight(): void {
        const { options } = this.grid;
        const minVisibleRows = options?.rendering?.rows?.minVisibleRows;

        const tbody = this.tbodyElement;
        if (!defined(minVisibleRows)) {
            if (this.tbodyMinHeightManaged) {
                tbody.style.minHeight = '';
                this.tbodyMinHeightManaged = false;
            }
            return;
        }

        const hasUserMinHeight = !!getStyle(tbody, 'min-height', true);
        if (!this.tbodyMinHeightManaged && hasUserMinHeight) {
            return;
        }

        const extraRowsCount = this.bodySections.reduce(
            (count, section): number => count + section.getRows().length,
            0
        );
        const minScrollableRows = Math.max(
            0,
            minVisibleRows - extraRowsCount
        );

        tbody.style.minHeight = (
            minScrollableRows * this.rowsVirtualizer.defaultRowHeight
        ) + 'px';
        this.tbodyMinHeightManaged = true;
    }

    /**
     * Checks if rows virtualization should be enabled.
     *
     * @returns
     * Whether rows virtualization should be enabled.
     */
    private async shouldVirtualizeRows(): Promise<boolean> {
        const { grid } = this;
        const rows = grid.userOptions.rendering?.rows;
        if (defined(rows?.virtualization)) {
            return rows.virtualization;
        }

        const rowCount = (await this.grid.dataProvider?.getRowCount()) ?? 0;
        const threshold = rows?.virtualizationThreshold ?? 50;

        if (grid.pagination) {
            return grid.querying.pagination.currentPageSize >= threshold;
        }

        return rowCount >= threshold;
    }

    /**
     * Loads the columns of the table.
     */
    private async loadColumns(): Promise<void> {
        const { enabledColumns } = this.grid;
        if (!enabledColumns) {
            return;
        }

        let columnId: string;
        for (let i = 0, iEnd = enabledColumns.length; i < iEnd; ++i) {
            columnId = enabledColumns[i];
            const column = new Column(this, columnId, i);
            await column.init();
            this.columns.push(column);
        }

        this.columnResizing.loadColumns();
    }

    /**
     * Updates the rows of the table.
     */
    public async updateRows(): Promise<void> {
        const vp = this;
        const { dataProvider: dp } = vp.grid;
        if (!dp) {
            return;
        }
        const focusCursor = vp.focusCursor;

        try {
            this.grid.showLoading();

            // Update data
            const oldRowsCount = vp.rows.length > 0 ?
                (vp.rows[vp.rows.length - 1]?.index ?? -1) + 1 :
                0;
            await vp.grid.querying.proceed();
            vp.grid.querying.pagination.clampPage();
            if (vp.grid.querying.shouldBeUpdated) {
                await vp.grid.querying.proceed();
            }
            for (const column of vp.columns) {
                column.loadData();
            }

            // Update virtualization if needed
            const shouldVirtualize = await this.shouldVirtualizeRows();
            let shouldRerender = false;
            if (this.virtualRows !== shouldVirtualize) {
                this.virtualRows = shouldVirtualize;
                vp.tableElement.classList.toggle(
                    Globals.getClassName('virtualization'),
                    shouldVirtualize
                );
                shouldRerender = true;
            }

            const newRowCount = await dp.getRowCount();
            if (shouldRerender) {
                // Rerender all rows
                await vp.rowsVirtualizer.rerender();
            } else if (oldRowsCount !== newRowCount) {
                // Refresh rows without full teardown
                await vp.rowsVirtualizer.refreshRows();
            } else {
                // Update existing rows - create a snapshot to avoid issues
                // if array changes during iteration
                const rowsToUpdate = [...vp.rows];
                for (let i = 0, iEnd = rowsToUpdate.length; i < iEnd; ++i) {
                    await rowsToUpdate[i].update();
                }
            }

            for (const hook of vp.afterUpdateRowsHooks) {
                await hook();
            }

            // Update the pagination controls
            vp.grid.pagination?.updateControls();
            vp.reflow();

            if (focusCursor) {
                vp.focusCellFromCursor(focusCursor, true);
            }
        } finally {
            this.grid.hideLoading();
        }

        vp.grid.dirtyFlags.delete('rows');
    }

    /**
     * Reflows the table's content dimensions.
     */
    public reflow(): void {
        this.columnResizing.reflow();

        // Reflow the head
        this.header?.reflow();

        // Reflow rows content dimensions
        this.rowsVirtualizer.reflowRows();
        const measuredRowHeight = (
            this.rowsVirtualizer.measureRenderedRowHeight()
        );
        if (defined(measuredRowHeight)) {
            this.rowsVirtualizer.applyMeasuredRowHeight(measuredRowHeight);
        }
        this.setTbodyMinHeight();

        // Reflow the pagination
        this.grid.pagination?.reflow();

        // Reflow popups
        this.grid.popups.forEach((popup): void => {
            popup.reflow();
        });

        this.grid.dirtyFlags.delete('reflow');
        fireEvent(this, 'afterReflow');
    }

    /**
     * Handles the focus event on the table body.
     *
     * @param e
     * The focus event.
     */
    private onTBodyFocus = (e: FocusEvent): void => {
        e.preventDefault();
        this.getRenderedRows()[0]?.cells[0]?.htmlElement.focus();
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
            void this.rowsVirtualizer.scroll();
        }

        this.header?.scrollHorizontally(this.tbodyElement.scrollLeft);
        fireEvent(this, 'bodyScroll', {
            scrollLeft: this.tbodyElement.scrollLeft,
            scrollTop: this.tbodyElement.scrollTop
        });
    };

    /**
     * Handles document focus changes while a logically focused cell is
     * temporarily detached by virtualization.
     *
     * @param e
     * The focus event.
     */
    private onDocumentFocusIn = (e: FocusEvent): void => {
        if (!this.hasDetachedFocus) {
            return;
        }

        const target = e.target;

        if (
            target instanceof Node &&
            this.tableElement.contains(target)
        ) {
            this.clearDetachedFocus();
            return;
        }

        this.clearDetachedFocus(true);
    };

    /**
     * Clears detached logical focus when the user interacts outside of the
     * table while the focused cell is not rendered.
     *
     * @param e
     * The pointer event.
     */
    private onDocumentPointerDown = (e: PointerEvent): void => {
        if (!this.hasDetachedFocus) {
            return;
        }

        const target = e.target;

        if (
            target instanceof Node &&
            this.tableElement.contains(target)
        ) {
            return;
        }

        this.clearDetachedFocus(true);
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
     * Delegated context menu handler for cells.
     * @param e Mouse event
     */
    private onCellContextMenu = (e: MouseEvent): void => {
        const cell = this.getCellFromElement(e.target);
        if (!cell || !('column' in cell) || !('row' in cell)) {
            return;
        }

        const tableCell = cell as TableCell;
        if (this.openCellContextMenu(tableCell, e.clientX, e.clientY)) {
            e.preventDefault();
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
        if (!cell) {
            return;
        }

        const isContextMenuKey = (
            e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)
        );

        if (isContextMenuKey && 'column' in cell && 'row' in cell) {
            const tableCell = cell as TableCell;
            const rect = tableCell.htmlElement.getBoundingClientRect();
            const opened = this.openCellContextMenu(
                tableCell,
                rect.left + 4,
                rect.bottom - 2
            );
            if (opened) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }

        (cell as { onKeyDown(e: KeyboardEvent): void }).onKeyDown(e);
    };

    /**
     * Opens a cell context menu if configured and enabled.
     *
     * @param tableCell
     * The target cell.
     *
     * @param clientX
     * The viewport X coordinate for anchoring.
     *
     * @param clientY
     * The viewport Y coordinate for anchoring.
     *
     * @returns
     * True if the menu was opened.
     */
    private openCellContextMenu(
        tableCell: TableCell,
        clientX: number,
        clientY: number
    ): boolean {
        const options = tableCell.column?.options.cells?.contextMenu;

        if (options?.enabled === false) {
            return false;
        }

        const items =
            CellContextMenuBuiltInActions.resolveCellContextMenuItems(
                tableCell
            );
        if (!items.length) {
            return false; // Keep native browser menu
        }

        if (!this.cellContextMenu) {
            this.cellContextMenu = new CellContextMenu(this.grid);
        }

        // Close any existing popups before opening a new menu.
        // Copy to array to avoid mutation during iteration.
        for (const popup of Array.from(this.grid.popups)) {
            if (popup !== this.cellContextMenu) {
                popup.hide();
            }
        }

        if (this.cellContextMenu.isVisible) {
            this.cellContextMenu.hide();
        }

        this.cellContextMenu.showAt(tableCell, clientX, clientY);

        return true;
    }

    /**
     * Scrolls the table to the specified row.
     *
     * @param index
     * The index of the row to scroll to.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/scroll-to-row | Scroll to row}
     */
    public scrollToRow(index: number): void {
        const viewportTopInset = this.getViewportTopInset();

        if (this.virtualRows) {
            this.tbodyElement.scrollTop = Math.max(
                0,
                index * this.rowsVirtualizer.defaultRowHeight -
                viewportTopInset
            );
            return;
        }

        const rowClass = '.' + Globals.getClassName('rowElement');
        const rows = this.tbodyElement.querySelectorAll(rowClass);
        const firstRow = rows[0];
        const safeIndex = Math.min(
            Math.max(0, index),
            Math.max(0, rows.length - 1)
        );
        const targetRow = rows[safeIndex];

        if (!firstRow || !targetRow) {
            return;
        }

        const firstRowTop = firstRow.getBoundingClientRect().top;

        this.tbodyElement.scrollTop = Math.max(
            0,
            targetRow.getBoundingClientRect().top -
            firstRowTop -
            viewportTopInset
        );
    }

    /**
     * Returns the top inset of the visible table body area. Composed modules
     * can extend this via the `getViewportTopInset` event.
     */
    public getViewportTopInset(): number {
        const eventObject = {
            top: 0
        };

        fireEvent(this, 'getViewportTopInset', eventObject);
        return eventObject.top;
    }

    /**
     * Ensures that a row is fully visible inside the scrollable body.
     *
     * @param row
     * The row to reveal.
     */
    public ensureRowFullyVisible(row: TableRow): void {
        if (
            !row.htmlElement.isConnected ||
            row.htmlElement.parentElement !== this.tbodyElement
        ) {
            return;
        }

        const tbodyRect = this.tbodyElement.getBoundingClientRect();
        const rowRect = row.htmlElement.getBoundingClientRect();
        const visibleTop = tbodyRect.top + this.getViewportTopInset();
        const visibleBottom = tbodyRect.bottom;
        const visibleHeight = Math.max(visibleBottom - visibleTop, 0);
        const maxScrollTop = Math.max(
            this.tbodyElement.scrollHeight - this.tbodyElement.clientHeight,
            0
        );
        let nextScrollTop = this.tbodyElement.scrollTop;

        if (rowRect.top < visibleTop) {
            nextScrollTop -= visibleTop - rowRect.top;
        } else if (rowRect.bottom > visibleBottom) {
            if (rowRect.height >= visibleHeight) {
                nextScrollTop += rowRect.top - visibleTop;
            } else {
                nextScrollTop += rowRect.bottom - visibleBottom;
            }
        }

        this.tbodyElement.scrollTop = Math.max(
            0,
            Math.min(nextScrollTop, maxScrollTop)
        );
    }

    /**
     * Focuses a body cell by its row index in the rendered table order.
     *
     * @param rowIndex
     * The target row index.
     *
     * @param columnIndex
     * The target column index.
     */
    public focusCellByRowIndex(rowIndex: number, columnIndex: number): void {
        if (
            columnIndex < 0 ||
            columnIndex >= this.columns.length ||
            rowIndex < 0 ||
            rowIndex >= this.rowsVirtualizer.rowCount
        ) {
            return;
        }

        const targetRow = this.rows.find(
            (row): boolean => row.index === rowIndex
        );
        const targetCell = targetRow?.cells[columnIndex];

        if (targetCell) {
            delete this.pendingFocusCursor;
            this.clearDetachedFocus();
            targetCell.htmlElement.focus({
                preventScroll: true
            });

            if (targetRow?.htmlElement.parentElement === this.tbodyElement) {
                this.ensureRowFullyVisible(targetRow);
            }
            return;
        }

        this.pendingFocusCursor = [rowIndex, columnIndex];
        this.scrollToRow(rowIndex);
    }

    /**
     * Marks the current logical focus as temporarily detached by
     * virtualization.
     */
    public preserveFocusDuringDetach(): void {
        this.hasDetachedFocus = true;
    }

    /**
     * Returns whether the provided cell currently owns detached logical focus.
     *
     * @param rowId
     * Target row ID.
     *
     * @param columnIndex
     * Target column index.
     */
    public hasDetachedFocusAt(
        rowId: RowId | undefined,
        columnIndex: number
    ): boolean {
        const focusCursor = this.focusCursor;

        return !!(
            this.hasDetachedFocus &&
            rowId !== void 0 &&
            focusCursor &&
            focusCursor.rowId === rowId &&
            focusCursor.columnIndex === columnIndex
        );
    }

    /**
     * Clears detached logical focus state and optionally the logical focus
     * cursor itself.
     *
     * @param clearFocusCursor
     * Whether to also clear the logical focus cursor.
     */
    public clearDetachedFocus(clearFocusCursor: boolean = false): void {
        this.hasDetachedFocus = false;

        if (clearFocusCursor) {
            delete this.focusCursor;
        }
    }

    /**
     * Restores focus to a rendered body cell. Composed modules can prevent the
     * default focus transfer via the `beforeRestoreCellFocus` event.
     *
     * @param cell
     * Rendered body cell to focus.
     *
     * @param rowIndex
     * Target row index in the rendered/projected order.
     *
     * @param columnIndex
     * Target column index.
     */
    public restoreRenderedCellFocus(
        cell: Cell | undefined,
        rowIndex: number,
        columnIndex: number
    ): void {
        if (!cell) {
            return;
        }

        const eventObject: RestoreCellFocusEvent = {
            cell,
            columnIndex,
            rowIndex
        };

        fireEvent(this, 'beforeRestoreCellFocus', eventObject, (): void => {
            this.clearDetachedFocus();
            cell.htmlElement.focus({
                preventScroll: true
            });
        });
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

        const cellElement = element.closest(
            '.' + Globals.getClassName('cell')
        );
        if (!cellElement) {
            return;
        }

        const tr = cellElement.parentElement;
        if (!tr) {
            return;
        }
        const tbody = tr.parentElement;
        if (!tbody) {
            return;
        }

        let row: TableRow | undefined;
        if (tbody === this.tbodyElement) {
            const rowIndexAttr = tr.getAttribute('data-row-index');
            if (rowIndexAttr === null) {
                return;
            }

            const rowIndex = parseInt(rowIndexAttr, 10);
            row = this.getRenderedRowByIndex(rowIndex);
        } else {
            row = this.bodySections.find(
                (section): boolean => section.tbodyElement === tbody
            )?.getRowByElement(tr);
        }

        if (!row) {
            return;
        }

        // Find cell index by position in row
        const cellIndex = Array.prototype.indexOf.call(
            tr.children,
            cellElement
        );
        return row.cells[cellIndex];
    }

    /**
     * Destroys the grid table.
     */
    public destroy(): void {
        this.tbodyElement.removeEventListener('scroll', this.onScroll);
        document.removeEventListener('focusin', this.onDocumentFocusIn, true);
        document.removeEventListener(
            'pointerdown',
            this.onDocumentPointerDown,
            true
        );
        this.removeBodyEventListeners(this.tbodyElement);
        for (const section of this.bodySections) {
            this.removeBodyEventListeners(
                section.tbodyElement
            );
        }
        this.bodySections.length = 0;
        this.resizeObserver.disconnect();
        this.columnsResizer?.removeEventListeners();
        this.header?.destroy();
        this.cellContextMenu?.hide();
        delete this.cellContextMenu;

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i]?.destroy();
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

        this.header?.scrollHorizontally(meta.scrollLeft);
        fireEvent(this, 'bodyScroll', {
            scrollLeft: meta.scrollLeft,
            scrollTop: meta.scrollTop
        });

        if (meta.focusCursor) {
            this.focusCellFromCursor(meta.focusCursor);
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
    public getRow(id: RowId): TableRow | undefined {
        return this.rows.find((row): boolean => row.id === id) ||
            this.getRenderedRows().find((row): boolean => row.id === id);
    }

    /**
     * Returns all rendered rows in visual order.
     *
     * @internal
     */
    public getRenderedRows(): TableRow[] {
        return [
            ...([] as TableRow[]).concat(
                ...this.bodySections
                    .filter((section): boolean => section.position === 'before')
                    .map((section): TableRow[] => section.getRows())
            ),
            ...this.rows,
            ...([] as TableRow[]).concat(
                ...this.bodySections
                    .filter((section): boolean => section.position === 'after')
                    .map((section): TableRow[] => section.getRows())
            )
        ];
    }

    /**
     * Returns the rendered row with the provided presentation index.
     *
     * @param index
     * The row index in the presentation table.
     *
     * @internal
     */
    public getRenderedRowByIndex(index: number): TableRow | undefined {
        return this.rows.find((row): boolean => row.index === index);
    }

    public async syncAriaRowIndexes(): Promise<void> {
        const headerRowsCount = this.header?.rows.length ?? 0;
        const rows = this.getRenderedRows();

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            this.grid.accessibility?.setRowIndex(
                rows[i].htmlElement,
                i + headerRowsCount + 1
            );
        }

        const baseRowCount = await this.grid.dataProvider?.getRowCount() || 0;
        const tableElement = this.grid.tableElement;
        if (tableElement) {
            tableElement.setAttribute(
                'aria-rowcount',
                (
                    baseRowCount +
                    this.bodySections.reduce(
                        (count, section): number =>
                            count + section.getRows().length,
                        0
                    ) +
                    headerRowsCount
                ) + ''
            );
        }
    }

    private focusCellFromCursor(
        cursor: FocusCursor,
        defer: boolean = false
    ): void {
        const focus = (): void => {
            if (cursor.bodySectionId) {
                this.bodySections.find(
                    (section): boolean => section.id === cursor.bodySectionId
                )?.getRowById(cursor.rowId)
                    ?.cells[cursor.columnIndex]
                    ?.htmlElement.focus();
                return;
            }

            void this.grid.dataProvider?.getRowIndex(cursor.rowId).then((
                rowIndex
            ): void => {
                if (rowIndex === void 0) {
                    return;
                }

                if (defer) {
                    this.focusCellByRowIndex(rowIndex, cursor.columnIndex);
                    return;
                }

                const row = this.getRenderedRowByIndex(rowIndex);
                this.restoreRenderedCellFocus(
                    row?.cells[cursor.columnIndex],
                    rowIndex,
                    cursor.columnIndex
                );
            });
        };

        if (defer) {
            setTimeout(focus);
        } else {
            focus();
        }
    }

}

export interface FocusCursor {
    rowId: RowId;
    columnIndex: number;
    bodySectionId?: string;
}

export interface TableBodySection {
    id: string;
    position: 'before'|'after';
    tbodyElement: HTMLElement;
    getRows: () => TableRow[];
    getRowByElement: (rowElement: HTMLElement) => TableRow | undefined;
    getRowById: (rowId: RowId) => TableRow | undefined;
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Represents the metadata of the viewport state. It is used to save the
 * state of the viewport and restore it when the data grid is re-rendered.
 */
export interface ViewportStateMetadata {
    scrollTop: number;
    scrollLeft: number;
    columnResizing: ColumnResizingMode;
    focusCursor?: FocusCursor;
}

/**
 * Event object emitted before focus is restored to a rendered body cell.
 */
export interface RestoreCellFocusEvent {
    cell: Cell;
    columnIndex: number;
    rowIndex: number;
    defaultPrevented?: boolean;
    preventDefault?: () => void;
}


/* *
 *
 *  Default Export
 *
 * */

export default Table;
