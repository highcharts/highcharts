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

import TableRow from './Body/TableRow.js';
import type DataTable from '../../../Data/DataTable';
import type { RowId } from '../Data/DataProvider';

import GridUtils from '../GridUtils.js';
import Utils from '../../../Core/Utilities.js';
import ColumnResizing from './ColumnResizing/ColumnResizing.js';
import ColumnResizingMode from './ColumnResizing/ResizingMode.js';
import Column from './Column.js';
import TableHeader from './Header/TableHeader.js';
import Grid from '../Grid.js';
import RowsVirtualizer from './Actions/RowsVirtualizer.js';
import ColumnsResizer from './Actions/ColumnsResizer.js';
import Globals from '../Globals.js';
import type TableCell from './Body/TableCell';

import Cell from './Cell.js';
import CellContextMenu from './Body/CellContextMenu.js';
import CellContextMenuBuiltInActions from './Body/CellContextMenuBuiltInActions.js';

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
     * The HTML element containing top pinned rows.
     */
    public readonly pinnedTopTbodyElement: HTMLElement;

    /**
     * The HTML element containing bottom pinned rows.
     */
    public readonly pinnedBottomTbodyElement: HTMLElement;

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
     * The rendered top pinned rows.
     */
    public pinnedTopRows: TableRow[] = [];

    /**
     * The rendered bottom pinned rows.
     */
    public pinnedBottomRows: TableRow[] = [];

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
    public virtualRows: boolean = true;

    /**
     * Cell context menu instance (lazy created).
     */
    private cellContextMenu?: CellContextMenu;

    /**
     * Whether pinned scrollbar compensation is queued for next frame.
     */
    private pinnedScrollbarCompensationQueued = false;

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
        this.pinnedTopTbodyElement = makeHTMLElement(
            'tbody',
            { className: Globals.getClassName('pinnedTopTbodyElement') }
        );
        this.pinnedTopTbodyElement.setAttribute(
            'aria-label', 'Pinned top rows'
        );
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);
        this.tbodyElement.classList.add(
            Globals.getClassName('scrollableTbodyElement')
        );
        this.pinnedBottomTbodyElement = makeHTMLElement(
            'tbody',
            { className: Globals.getClassName('pinnedBottomTbodyElement') }
        );
        this.pinnedBottomTbodyElement.setAttribute(
            'aria-label', 'Pinned bottom rows'
        );

        this.rowsVirtualizer = new RowsVirtualizer(this);

        fireEvent(this, 'beforeInit');

        // Add event listeners
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(tableElement);

        this.tbodyElement.addEventListener('scroll', this.onScroll);
        this.addBodyEventListeners(this.tbodyElement);
        this.addBodyEventListeners(this.pinnedTopTbodyElement);
        this.addBodyEventListeners(this.pinnedBottomTbodyElement);
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
        const dp = this.grid.dataProvider;
        if (dp && 'getDataTable' in dp) {
            return dp.getDataTable();
        }
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

        const rowPinningMeta = this.grid.rowPinningMeta;
        const pinnedRowsCount = (
            (rowPinningMeta?.topCount || 0) +
            (rowPinningMeta?.bottomCount || 0)
        );
        const minScrollableRows = Math.max(
            0,
            minVisibleRows - pinnedRowsCount
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

        const rowCount = (
            grid.rowPinningMeta?.scrollableCount ??
            await this.grid.dataProvider?.getRowCount()
        ) ?? 0;
        const threshold = rows?.virtualizationThreshold ?? 50;

        if (grid.pagination) {
            return grid.querying.pagination.effectivePageSize >= threshold;
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
        const oldPinningMeta = vp.grid.rowPinningMeta;
        const oldPinningMaxHeightSignature =
            this.getPinnedBodyMaxHeightSignature();
        let focusedRowId: RowId | undefined;
        if (vp.focusCursor) {
            focusedRowId = await dp.getRowId(vp.focusCursor[0]);
        }

        try {
            this.grid.showLoading();

            // Update data
            const oldRowsCount = vp.rows.length > 0 ?
                (vp.rows[vp.rows.length - 1]?.index ?? -1) + 1 :
                0;
            const forceQuerying = !!(vp.grid as {
                rowPinning?: { isEnabled(): boolean };
            }).rowPinning?.isEnabled();
            await vp.grid.querying.proceed(forceQuerying);
            vp.grid.querying.pagination.clampPage();
            if (vp.grid.querying.shouldBeUpdated) {
                await vp.grid.querying.proceed(forceQuerying);
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
            const newPinningMeta = vp.grid.rowPinningMeta;
            const pinningMetaChanged = (
                oldPinningMeta?.topCount !== newPinningMeta?.topCount ||
                oldPinningMeta?.bottomCount !== newPinningMeta?.bottomCount ||
                oldPinningMeta?.scrollableCount !==
                    newPinningMeta?.scrollableCount ||
                oldPinningMeta?.topRowIds.join('|') !==
                    newPinningMeta?.topRowIds.join('|') ||
                oldPinningMeta?.bottomRowIds.join('|') !==
                    newPinningMeta?.bottomRowIds.join('|')
            );
            const pinningMaxHeightChanged = (
                oldPinningMaxHeightSignature !==
                this.getPinnedBodyMaxHeightSignature()
            );
            if (pinningMetaChanged) {
                shouldRerender = true;
            }
            if (pinningMaxHeightChanged) {
                shouldRerender = true;
            }

            const newRowCount = await dp.getRowCount();
            if (shouldRerender || oldRowsCount !== newRowCount) {
                // Rerender all rows
                await vp.rowsVirtualizer.rerender();
            } else {
                // Update existing rows - create a snapshot to avoid issues
                // if array changes during iteration
                const rowsToUpdate = [...vp.getRenderedRows()];
                for (let i = 0, iEnd = rowsToUpdate.length; i < iEnd; ++i) {
                    await rowsToUpdate[i].update();
                }
            }

            // Update the pagination controls
            vp.grid.pagination?.updateControls();
            vp.reflow();

            if (focusedRowId !== void 0 && vp.focusCursor) {
                const newRowIndex = await dp.getRowIndex(focusedRowId);
                if (newRowIndex !== void 0) {
                    vp.scrollToRow(newRowIndex);
                    setTimeout((): void => {
                        if (!defined(vp.focusCursor?.[1])) {
                            return;
                        }
                        vp.getRenderedRowByIndex(newRowIndex)
                            ?.cells[vp.focusCursor[1]].htmlElement.focus();
                    });
                }
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
        for (let i = 0, iEnd = this.pinnedTopRows.length; i < iEnd; ++i) {
            this.pinnedTopRows[i].reflow();
        }
        for (let i = 0, iEnd = this.pinnedBottomRows.length; i < iEnd; ++i) {
            this.pinnedBottomRows[i].reflow();
        }
        this.applyPinnedBodyMaxHeights();
        this.applyPinnedScrollbarCompensation();
        this.syncPinnedHorizontalScroll(this.tbodyElement.scrollLeft);

        // Reflow the pagination
        this.grid.pagination?.reflow();

        // Reflow popups
        this.grid.popups.forEach((popup): void => {
            popup.reflow();
        });

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

        this.syncPinnedHorizontalScroll(this.tbodyElement.scrollLeft);

        this.header?.scrollHorizontally(this.tbodyElement.scrollLeft);
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
        const topPinnedCount = this.grid.rowPinningMeta?.topCount || 0;
        if (this.virtualRows) {
            this.tbodyElement.scrollTop = Math.max(
                0,
                (index - topPinnedCount) * this.rowsVirtualizer.defaultRowHeight
            );
            return;
        }

        const rowClass = '.' + Globals.getClassName('rowElement');
        const scrollableIndex = Math.max(0, index - topPinnedCount);
        const rows = this.tbodyElement.querySelectorAll(rowClass);
        const firstRow = rows[0];
        const safeIndex = Math.min(
            scrollableIndex,
            Math.max(0, rows.length - 1)
        );
        const targetRow = rows[safeIndex];

        if (!firstRow || !targetRow) {
            return;
        }

        const firstRowTop = firstRow.getBoundingClientRect().top;

        this.tbodyElement.scrollTop = (
            targetRow.getBoundingClientRect().top
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
        const row = this.getRenderedRowByIndex(rowIndex);
        if (!row) {
            return;
        }

        // Find cell index by position in row
        const cellIndex = Array.prototype.indexOf.call(tr.children, td);
        return row.cells[cellIndex];
    }

    /**
     * Destroys the grid table.
     */
    public destroy(): void {
        this.tbodyElement.removeEventListener('scroll', this.onScroll);
        this.removeBodyEventListeners(this.tbodyElement);
        this.removeBodyEventListeners(this.pinnedTopTbodyElement);
        this.removeBodyEventListeners(this.pinnedBottomTbodyElement);
        this.resizeObserver.disconnect();
        this.columnsResizer?.removeEventListeners();
        this.header?.destroy();
        this.cellContextMenu?.hide();
        delete this.cellContextMenu;

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i]?.destroy();
        }
        for (let i = 0, iEnd = this.pinnedTopRows.length; i < iEnd; ++i) {
            this.pinnedTopRows[i].destroy();
        }
        for (let i = 0, iEnd = this.pinnedBottomRows.length; i < iEnd; ++i) {
            this.pinnedBottomRows[i].destroy();
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
        this.syncPinnedHorizontalScroll(meta.scrollLeft);

        if (meta.focusCursor) {
            const [rowIndex, columnIndex] = meta.focusCursor;
            const row = this.getRenderedRowByIndex(rowIndex);
            row?.cells[columnIndex]?.htmlElement.focus();
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
        return this.getRenderedRows().find((row): boolean => row.id === id);
    }

    /**
     * Returns all rendered rows in visual order.
     *
     * @internal
     */
    public getRenderedRows(): TableRow[] {
        return [
            ...this.pinnedTopRows,
            ...this.rows,
            ...this.pinnedBottomRows
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
        return this.getRenderedRows()
            .find((row): boolean => row.index === index);
    }

    /**
     * Re-renders top and bottom pinned rows using current row pinning meta.
     *
     * @internal
     */
    public async renderPinnedRows(): Promise<void> {
        // Cancel any active cell editing before destroying/moving rows to
        // prevent orphaned inputs and stale cell references.
        if (this.cellEditing?.editedCell) {
            this.cellEditing.stopEditing(false);
        }

        const meta = this.grid.rowPinningMeta;
        const hasPinning = !!meta;
        this.ensurePinnedBodiesRendered(hasPinning);

        if (!hasPinning) {
            this.pinnedTopRows.forEach((row): void => row.destroy());
            this.pinnedBottomRows.forEach((row): void => row.destroy());
            this.pinnedTopRows.length = 0;
            this.pinnedBottomRows.length = 0;
            this.tbodyElement.style.display = '';
            this.setTbodyMinHeight();
            this.applyPinnedBodyMaxHeights();
            return;
        }

        const topCount = meta?.topCount || 0;
        const bottomCount = meta?.bottomCount || 0;
        const rowCount = await this.grid.dataProvider?.getRowCount() || 0;

        await this.syncPinnedRows(
            this.pinnedTopRows,
            this.pinnedTopTbodyElement,
            0,
            topCount
        );
        await this.syncPinnedRows(
            this.pinnedBottomRows,
            this.pinnedBottomTbodyElement,
            rowCount - bottomCount,
            bottomCount
        );

        this.pinnedTopTbodyElement.classList.toggle(
            Globals.getClassName('pinnedTbodyElementActive'),
            topCount > 0
        );
        this.pinnedBottomTbodyElement.classList.toggle(
            Globals.getClassName('pinnedTbodyElementActive'),
            bottomCount > 0
        );
        this.tbodyElement.style.display = (
            meta &&
            meta.scrollableCount < 1 &&
            topCount + bottomCount > 0
        ) ?
            'none' :
            '';
        this.setTbodyMinHeight();
        this.applyPinnedBodyMaxHeights();
        this.syncPinnedHorizontalScroll(this.tbodyElement.scrollLeft);

        this.applyPinnedScrollbarCompensation();
    }

    /**
     * Reads pinned tbody max-height options from row pinning config.
     *
     * @param position
     * The pinned section position.
     */
    private getPinnedBodyMaxHeight(
        position: 'top'|'bottom'
    ): number|string|undefined {
        const pinningOptions = this.grid.options?.rendering?.rows?.pinning;
        const userPinningOptions = this.grid.userOptions?.rendering?.rows
            ?.pinning;
        return position === 'top' ?
            (
                pinningOptions?.top?.maxHeight ??
                userPinningOptions?.top?.maxHeight
            ) :
            (
                pinningOptions?.bottom?.maxHeight ??
                userPinningOptions?.bottom?.maxHeight
            );
    }

    /**
     * Converts max-height option values to a CSS length.
     *
     * @param value
     * The max-height option value.
     */
    private normalizeMaxHeight(
        value?: number|string
    ): string {
        if (typeof value === 'number' && value >= 0) {
            return value + 'px';
        }
        if (typeof value !== 'string') {
            return '';
        }

        const trimmed = value.trim();
        const percentMatch = trimmed.match(/^(\d+(\.\d+)?)%$/);
        if (percentMatch) {
            const percent = parseFloat(percentMatch[1]);
            const tableHeight = this.tableElement.clientHeight ||
                this.tbodyElement.clientHeight;
            const pxHeight = Math.max(
                0, Math.round(tableHeight * percent / 100)
            );
            return pxHeight + 'px';
        }

        if (/^\d+(\.\d+)?px$/.test(trimmed)) {
            return trimmed;
        }

        return '';
    }

    /**
     * Returns a normalized signature used to detect max-height option changes.
     */
    private getPinnedBodyMaxHeightSignature(): string {
        return [
            this.normalizeMaxHeight(this.getPinnedBodyMaxHeight('top')),
            this.normalizeMaxHeight(this.getPinnedBodyMaxHeight('bottom'))
        ].join('|');
    }

    /**
     * Applies optional max-height scrolling behavior to pinned tbodies.
     */
    private applyPinnedBodyMaxHeights(): void {
        const apply = (tbody: HTMLElement, value?: number|string): void => {
            const maxHeight = this.normalizeMaxHeight(value);

            tbody.style.maxHeight = maxHeight;
            tbody.style.overflowY = maxHeight ? 'auto' : '';
            tbody.style.overflowX = maxHeight ? 'hidden' : '';
        };

        apply(
            this.pinnedTopTbodyElement,
            this.getPinnedBodyMaxHeight('top')
        );
        apply(
            this.pinnedBottomTbodyElement,
            this.getPinnedBodyMaxHeight('bottom')
        );
    }

    private syncPinnedHorizontalScroll(scrollLeft: number): void {
        if (!this.pinnedTopTbodyElement.isConnected) {
            return;
        }

        this.pinnedTopTbodyElement.scrollLeft = scrollLeft;
        this.pinnedBottomTbodyElement.scrollLeft = scrollLeft;

        const offset = -scrollLeft;
        const transform = offset ? `translateX(${offset}px)` : '';

        for (let i = 0, iEnd = this.pinnedTopRows.length; i < iEnd; ++i) {
            this.pinnedTopRows[i].htmlElement.style.transform = transform;
        }
        for (
            let i = 0, iEnd = this.pinnedBottomRows.length;
            i < iEnd;
            ++i
        ) {
            this.pinnedBottomRows[i].htmlElement.style.transform = transform;
        }
    }

    private async syncPinnedRows(
        targetRows: TableRow[],
        tbody: HTMLElement,
        startIndex: number,
        count: number
    ): Promise<void> {
        const safeCount = Math.max(0, count);
        const safeStart = Math.max(0, startIndex);

        while (targetRows.length > safeCount) {
            targetRows.pop()?.destroy();
        }

        for (let i = 0; i < safeCount; ++i) {
            const rowIndex = safeStart + i;
            let row = targetRows[i];

            if (!row) {
                row = new TableRow(this, rowIndex);
                targetRows.push(row);
                await row.init();
                row.htmlElement.setAttribute(
                    'aria-roledescription', 'pinned row'
                );
                tbody.appendChild(row.htmlElement);
                await row.render();
                row.reflow();
                continue;
            }

            await row.reuse(rowIndex, false);
            row.htmlElement.setAttribute(
                'aria-roledescription', 'pinned row'
            );
            row.reflow();
            if (!row.htmlElement.isConnected) {
                tbody.appendChild(row.htmlElement);
            }
        }
    }

    /**
     * Keeps pinned sections aligned with the scrollable tbody content width by
     * compensating for the vertical scrollbar gutter.
     */
    private applyPinnedScrollbarCompensation(): void {
        const scrollableBody = this.tbodyElement;
        const mainGutterWidth = Math.max(
            0,
            scrollableBody.offsetWidth - scrollableBody.clientWidth
        );
        const applyToPinnedBody = (pinnedBody: HTMLElement): void => {
            if (!pinnedBody.isConnected) {
                pinnedBody.style.width = '';
                return;
            }
            const pinnedGutterWidth = Math.max(
                0,
                pinnedBody.offsetWidth - pinnedBody.clientWidth
            );
            const compensation = Math.max(
                0,
                mainGutterWidth - pinnedGutterWidth
            );

            pinnedBody.style.width = compensation > 0 ?
                `calc(100% - ${compensation}px)` :
                '';
        };

        applyToPinnedBody(this.pinnedTopTbodyElement);
        applyToPinnedBody(this.pinnedBottomTbodyElement);

        if (!this.pinnedScrollbarCompensationQueued) {
            this.pinnedScrollbarCompensationQueued = true;
            requestAnimationFrame((): void => {
                this.pinnedScrollbarCompensationQueued = false;
                applyToPinnedBody(this.pinnedTopTbodyElement);
                applyToPinnedBody(this.pinnedBottomTbodyElement);
            });
        }
    }

    /**
     * Ensure pinned tbody elements are attached only when row pinning is
     * active, keeping a single tbody in the default non-pinning mode.
     *
     * @param shouldRender
     * Whether pinned tbody elements should be attached.
     */
    private ensurePinnedBodiesRendered(shouldRender: boolean): void {
        const {
            tableElement,
            pinnedTopTbodyElement,
            pinnedBottomTbodyElement
        } = this;
        const topConnected = (
            pinnedTopTbodyElement.parentElement === tableElement
        );
        const bottomConnected = (
            pinnedBottomTbodyElement.parentElement === tableElement
        );

        if (!shouldRender) {
            if (topConnected) {
                pinnedTopTbodyElement.remove();
            }
            if (bottomConnected) {
                pinnedBottomTbodyElement.remove();
            }
            return;
        }

        if (!topConnected) {
            tableElement.insertBefore(pinnedTopTbodyElement, this.tbodyElement);
        }
        if (!bottomConnected) {
            tableElement.appendChild(pinnedBottomTbodyElement);
        }
    }

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
