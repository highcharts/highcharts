/* *
 *
 *  Grid Rows Renderer class.
 *
 *  (c) 2020-2025 Highsoft AS
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

import type { RowsSettings } from '../../Options';
import type Cell from '../Cell';

import Table from '../Table.js';
import TableRow from '../Content/TableRow.js';
import Globals from '../../Globals.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a virtualized rows renderer for the data grid.
 */
class RowsVirtualizer {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The default height of a row.
     */
    public readonly defaultRowHeight: number;

    /**
     * The index of the first visible row.
     */
    public rowCursor = 0;

    /**
     * The viewport (table) of the data grid.
     */
    public readonly viewport: Table;

    /**
     * Size of the row buffer - how many rows should be rendered outside of the
     * viewport from the top and the bottom.
     */
    public readonly buffer: number;

    /**
     * Flag indicating if the rows should have strict heights (no custom or
     * dynamic heights allowed).
     */
    private readonly strictRowHeights: boolean;

    /**
     * Flag indicating if the scrolling handler should be prevented to avoid
     * flickering loops when scrolling to the last row.
     */
    private preventScroll = false;

    /**
     * The only cell that is to be focusable using tab key - a table focus
     * entry point.
     */
    public focusAnchorCell?: Cell;

    /**
     * Rendering row settings.
     */
    public rowSettings?: RowsSettings;

    /**
     * The maximum height of a HTML element in most browsers.
     */
    private static readonly MAX_ELEMENT_HEIGHT: number = 32000000;

    /**
     * The total height of the grid, used when the Grid height
     * exceeds the max element height.
     */
    private totalGridHeight: number = 0;

    /**
     * The scroll offset in pixels used to adjust the row positions when
     * the Grid height exceeds the max element height.
     */
    private scrollOffset: number = 0;

    /**
     * The total number of rows in the grid.
     */
    private rowCount: number = 0;

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs an instance of the rows virtualizer.
     *
     * @param viewport
     * The viewport of the data grid to render rows in.
     */
    constructor(viewport: Table) {
        this.rowSettings =
            viewport.grid.options?.rendering?.rows as RowsSettings;

        this.viewport = viewport;
        this.strictRowHeights = this.rowSettings.strictHeights as boolean;
        this.buffer = Math.max(this.rowSettings.bufferSize as number, 0);
        this.defaultRowHeight = this.getDefaultRowHeight();

        if (this.strictRowHeights) {
            viewport.tbodyElement.classList.add(
                Globals.getClassName('rowsContentNowrap')
            );
        }
    }


    /* *
    *
    *  Functions
    *
    * */

    /**
     * Renders the rows in the viewport for the first time.
     */
    public initialRender(): void {
        // Initial reflow to set the viewport height
        if (this.rowSettings?.virtualization) {
            this.viewport.reflow();
        }
        this.rowCount = this.viewport.dataTable.getRowCount();
        this.totalGridHeight = this.rowCount * this.defaultRowHeight;

        // Load & render rows
        this.renderRows(this.rowCursor);

        // This is done in the reflow function, so dont think it is needed here
        // if (this.rowSettings?.virtualization) {
        //     this.adjustRowHeights();
        // }
    }

    /**
     * Renders the rows in the viewport. It is called when the rows need to be
     * re-rendered, e.g., after a sort or filter operation.
     */
    public rerender(): void {
        const tbody = this.viewport.tbodyElement;
        let rows = this.viewport.rows;

        const oldScrollLeft = tbody.scrollLeft;
        let oldScrollTop: number | undefined;

        if (rows.length) {
            oldScrollTop = tbody.scrollTop;
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                rows[i].destroy();
            }
            rows.length = 0;
        }

        this.renderRows(this.rowCursor);

        if (this.rowSettings?.virtualization) {

            if (oldScrollTop !== void 0) {
                tbody.scrollTop = oldScrollTop;
            }

            this.scroll();
        }

        rows = this.viewport.rows;

        // Reflow the rendered row cells widths (check redundancy)
        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rows[i].reflow();
        }

        tbody.scrollLeft = oldScrollLeft;
    }

    /**
     * Method called on the viewport scroll event, only when the virtualization
     * is enabled.
     */
    public scroll(): void {
        const target = this.viewport.tbodyElement;
        const { defaultRowHeight: rowHeight } = this;
        const lastScrollTop = target.scrollTop;

        const gridHeightOverflow = Math.max(
            this.totalGridHeight - RowsVirtualizer.MAX_ELEMENT_HEIGHT, 0
        );

        if (this.preventScroll) {
            if (lastScrollTop <= target.scrollTop) {
                this.preventScroll = false;
            }
            this.adjustBottomRowHeights();
            return;
        }

        let rowCursor: number;

        // Improved calculation for large datasets that exceed MAX_ELEMENT_HEIGHT
        if (gridHeightOverflow > 0) {
            // Calculate the virtual position based on scroll percentage
            const scrollPercentage = lastScrollTop / target.scrollHeight;
            this.scrollOffset = scrollPercentage * gridHeightOverflow;
            
            // Use a more stable calculation that directly maps scroll percentage to row index
            // This prevents large jumps when making small scroll adjustments
            const virtualScrollTop = lastScrollTop + this.scrollOffset;
            rowCursor = Math.floor(virtualScrollTop / rowHeight);
            
            // Add bounds checking to prevent jumping beyond valid row range
            rowCursor = Math.max(0, Math.min(rowCursor, this.rowCount - 1));
            
            // Near the bottom, use a more precise calculation to prevent jumping
            const bottomThreshold = this.rowCount - Math.ceil(target.clientHeight / rowHeight) - this.buffer;
            if (rowCursor >= bottomThreshold) {
                const remainingRows = this.rowCount - rowCursor;
                const viewportRows = Math.ceil(target.clientHeight / rowHeight);
                if (this.rowCursor !== 0 && Math.abs(rowCursor - this.rowCursor) > viewportRows) {
                    const maxJump = Math.ceil(viewportRows / 2);
                    if (rowCursor > this.rowCursor) {
                        rowCursor = Math.min(rowCursor, this.rowCursor + maxJump);
                    } else {
                        rowCursor = Math.max(rowCursor, this.rowCursor - maxJump);
                    }
                }
            }

            // --- Improved fix: Clamp rowCursor and scrollTop at the bottom ---
            const viewportRows = Math.ceil(target.clientHeight / rowHeight);
            const maxRowCursor = this.rowCount - viewportRows;
            const maxScrollTop = target.scrollHeight - target.clientHeight;
            if (lastScrollTop >= maxScrollTop - 1) { // allow for rounding error
                rowCursor = Math.max(0, maxRowCursor);
                if (target.scrollTop !== maxScrollTop) {
                    target.scrollTop = maxScrollTop;
                }
            }
            // --- End improved fix ---
        } else {
            // Standard calculation for smaller datasets
            rowCursor = Math.floor(lastScrollTop / rowHeight);
            this.scrollOffset = 0;
        }

        if (this.rowCursor !== rowCursor) {
            this.renderRows(rowCursor);
        }
        this.rowCursor = rowCursor;

        this.adjustRowHeights();
        if (
            !this.strictRowHeights &&
            lastScrollTop > target.scrollTop &&
            !this.preventScroll
        ) {
            target.scrollTop = lastScrollTop;
            this.preventScroll = true;
        }
    }

    /**
     * Adjusts the visible row heights from the bottom of the viewport.
     */
    private adjustBottomRowHeights(): void {
        const rows = this.viewport.rows;
        const rowsLn = rows.length;

        const lastRow = rows[rowsLn - 1];

        let rowTop = lastRow.translateY;
        const rowBottom = rowTop + lastRow.htmlElement.offsetHeight;
        let newHeight = lastRow.cells[0].htmlElement.offsetHeight;
        rowTop = rowBottom - newHeight;

        lastRow.htmlElement.style.height = newHeight + 'px';
        lastRow.setTranslateY(rowTop);
        for (let j = 0, jEnd = lastRow.cells.length; j < jEnd; ++j) {
            lastRow.cells[j].htmlElement.style.transform = '';
        }

        for (let i = rowsLn - 2; i >= 0; i--) {
            const row = rows[i];

            newHeight = row.cells[0].htmlElement.offsetHeight;
            rowTop -= newHeight;

            row.htmlElement.style.height = newHeight + 'px';

            row.setTranslateY(rowTop);
            for (let j = 0, jEnd = row.cells.length; j < jEnd; ++j) {
                row.cells[j].htmlElement.style.transform = '';
            }
        }
    }

    /**
     * Renders rows in the specified range. Removes rows that are out of the
     * range except the last row.
     *
     * @param rowCursor
     * The index of the first visible row.
     */
    private renderRows(rowCursor: number): void {
        console.time('renderRows');
        const { viewport: vp, buffer } = this;
        const isVirtualization = this.rowSettings?.virtualization;
        const rowCount = vp.dataTable.getRowCount();
        const rowsPerPage = isVirtualization ? Math.ceil(
            (vp.grid.tableElement?.clientHeight || 0) /
            this.defaultRowHeight
        ) : Infinity;

        // Use a Map for fast lookup
        const rowMap = new Map<number, TableRow>();
        let lastRow: TableRow | undefined;
        for (const row of vp.rows) {
            if (row.index === rowCount - 1) {
                lastRow = row;
            } else {
                rowMap.set(row.index, row);
            }
        }

        // Always ensure the last row exists for scrollbar purposes
        if (!lastRow) {
            lastRow = new TableRow(vp, rowCount - 1);
            lastRow.render();
            vp.tbodyElement.appendChild(lastRow.htmlElement);
            if (isVirtualization) {
                const topOffset = Math.min(
                    lastRow.getDefaultTopOffset(),
                    RowsVirtualizer.MAX_ELEMENT_HEIGHT
                );
                lastRow.setTranslateY(topOffset);
            }
        }

        // Calculate visible range
        const from = Math.max(0, Math.min(
            rowCursor - buffer,
            rowCount - rowsPerPage
        ));
        const to = Math.min(
            rowCursor + rowsPerPage + buffer,
            rowCount - 2 // exclude the last row from normal rendering
        );

        // Remove out-of-range rows
        for (const [index, row] of rowMap) {
            if (index < from || index > to) {
                row.destroy();
                rowMap.delete(index);
            }
        }

        // Create missing rows and batch DOM insertions
        const fragment = document.createDocumentFragment();
        for (let i = from; i <= to; ++i) {
            let row = rowMap.get(i);
            if (!row) {
                row = new TableRow(vp, i);
                row.render();
                rowMap.set(i, row);
                fragment.appendChild(row.htmlElement);
            }
        }

        // Replace vp.rows with the new visible rows in order, plus the last row
        const visibleRows = Array.from(rowMap.values()).sort((a, b) => a.index - b.index);
        visibleRows.push(lastRow);
        vp.rows = visibleRows;

        // Batch insert new rows
        if (fragment.childNodes.length > 0) {
            // Insert before the last row (spacer)
            vp.tbodyElement.insertBefore(fragment, lastRow.htmlElement);
        }

        // Render the last row if it is in the visible range and not already rendered
        if (to === rowCount - 2 && lastRow && !lastRow.rendered) {
            lastRow.render();
        }

        // Focus the cell if the focus cursor is set
        if (vp.focusCursor) {
            const [rowIndex, columnIndex] = vp.focusCursor;
            const row = visibleRows.find((row): boolean => row.index === rowIndex);
            if (row) {
                row.cells[columnIndex]?.htmlElement.focus({
                    preventScroll: true
                });
            }
        }

        // Reset the focus anchor cell
        this.focusAnchorCell?.htmlElement.setAttribute('tabindex', '-1');
        const firstVisibleRow = visibleRows[rowCursor - visibleRows[0]?.index];
        this.focusAnchorCell = firstVisibleRow?.cells[0];
        this.focusAnchorCell?.htmlElement.setAttribute('tabindex', '0');
        console.timeEnd('renderRows');
    }

    /**
     * Adjusts the heights of the rows based on the current scroll position.
     * It handles the possibility of the rows having different heights than
     * the default height.
     */
    public adjustRowHeights(): void {
        if (this.strictRowHeights) {
            return;
        }

        const { rowCursor: cursor, defaultRowHeight: defaultH } = this;
        const { rows, tbodyElement } = this.viewport;
        const rowsLn = rows.length;

        let translateBuffer = rows[0].getDefaultTopOffset();
        translateBuffer = Math.floor(translateBuffer - this.scrollOffset);

        for (let i = 0; i < rowsLn; ++i) {
            const row = rows[i];

            // Reset row height and cell transforms
            row.htmlElement.style.height = '';
            if (row.cells[0].htmlElement.style.transform) {
                for (let j = 0, jEnd = row.cells.length; j < jEnd; ++j) {
                    const cell = row.cells[j];
                    cell.htmlElement.style.transform = '';
                }
            }

            // Rows above the first visible row
            if (row.index < cursor) {
                row.htmlElement.style.height = defaultH + 'px';
                continue;
            }

            const cellHeight = row.cells[0].htmlElement.offsetHeight;
            row.htmlElement.style.height = cellHeight + 'px';

            // Rows below the first visible row
            if (row.index > cursor) {
                continue;
            }

            // First visible row
            if (row.htmlElement.offsetHeight > defaultH) {
                const newHeight = Math.floor(
                    cellHeight - (cellHeight - defaultH) * (
                        tbodyElement.scrollTop / defaultH - cursor
                    )
                );

                row.htmlElement.style.height = newHeight + 'px';

                for (let j = 0, jEnd = row.cells.length; j < jEnd; ++j) {
                    const cell = row.cells[j];
                    cell.htmlElement.style.transform = `translateY(${
                        newHeight - cellHeight
                    }px)`;
                }
            }
        }

        rows[0].setTranslateY(translateBuffer);
        for (let i = 1, iEnd = rowsLn - 1; i < iEnd; ++i) {
            translateBuffer += rows[i - 1].htmlElement.offsetHeight;
            rows[i].setTranslateY(translateBuffer);
        }

        // Set the proper offset for the last row
        const lastRow = rows[rowsLn - 1];
        const preLastRow = rows[rowsLn - 2];
        if (preLastRow && preLastRow.index === lastRow.index - 1) {
            lastRow.setTranslateY(
                preLastRow.htmlElement.offsetHeight + translateBuffer
            );
        }
    }

    /**
     * Reflow the rendered rows content dimensions.
     */
    public reflowRows(): void {
        const rows = this.viewport.rows;

        if (rows.length < 1) {
            return;
        }

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rows[i].reflow();
        }

        if (this.rowSettings?.virtualization) {
            this.adjustRowHeights();
        }
    }

    /**
     * Returns the default height of a row. This method should be called only
     * once on initialization.
     */
    private getDefaultRowHeight(): number {
        const vp = this.viewport;
        const mockRow = new TableRow(vp, 0);

        mockRow.htmlElement.style.position = 'absolute';
        mockRow.htmlElement.classList.add(Globals.getClassName('mockedRow'));

        mockRow.render();

        this.viewport.tbodyElement.appendChild(mockRow.htmlElement);

        const defaultRowHeight = mockRow.htmlElement.offsetHeight;

        mockRow.destroy();

        return defaultRowHeight;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default RowsVirtualizer;
