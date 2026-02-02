/* *
 *
 *  Grid Rows Renderer class.
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import Table from '../Table.js';
import TableRow from '../Body/TableRow.js';
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
     * Rendering row settings.
     */
    public rowSettings?: RowsSettings;

    /**
     * Reuse pool for rows that are currently out of viewport.
     */
    private readonly rowPool: TableRow[] = [];

    /**
     * Maximum number of rows to keep in the reuse pool.
     */
    private static readonly MAX_POOL_SIZE = 100;

    /**
     * Flag indicating if a scroll update is queued for the next animation
     * frame.
     */
    private scrollQueued = false;


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
        if (this.viewport.virtualRows) {
            this.viewport.reflow();
        }

        // Load & render rows
        this.renderRows(this.rowCursor);
        this.adjustRowHeights();
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

        if (this.rowPool.length) {
            for (let i = this.rowPool.length - 1; i >= 0; --i) {
                this.rowPool[i].destroy();
            }
            this.rowPool.length = 0;
        }

        if (rows.length) {
            oldScrollTop = tbody.scrollTop;
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                rows[i].destroy();
            }
            rows.length = 0;
        }

        this.renderRows(this.rowCursor);

        if (this.viewport.virtualRows) {

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
        if (this.scrollQueued) {
            return;
        }

        this.scrollQueued = true;
        requestAnimationFrame((): void => {
            this.scrollQueued = false;
            this.applyScroll();
        });
    }

    /**
     * Applies the scroll logic for virtualized rows.
     */
    private applyScroll(): void {
        const target = this.viewport.tbodyElement;
        const { defaultRowHeight: rowHeight } = this;
        const lastScrollTop = target.scrollTop;

        if (this.preventScroll) {
            if (lastScrollTop <= target.scrollTop) {
                this.preventScroll = false;
            }
            this.adjustBottomRowHeights();
            return;
        }

        // Do vertical virtual scrolling
        const rowCursor = Math.floor(target.scrollTop / rowHeight);
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
        const { viewport: vp, buffer } = this;
        const rowCount = vp.dataTable.getRowCount();

        // Stop rendering if there are no rows to render.
        if (rowCount < 1) {
            return;
        }

        const isVirtualization = this.viewport.virtualRows;
        const rowsPerPage = isVirtualization ? Math.ceil(
            (vp.grid.tableElement?.clientHeight || 0) /
            this.defaultRowHeight
        ) : Infinity; // Need to be refactored when add pagination

        let rows = vp.rows;

        if (!isVirtualization && rows.length > 50) {
            // eslint-disable-next-line no-console
            console.warn(
                'Grid: a large dataset can cause performance issues when ' +
                'virtualization is disabled. Consider enabling ' +
                'virtualization in the rows settings.'
            );
        }

        if (!rows.length) {
            const last = new TableRow(vp, rowCount - 1);
            vp.tbodyElement.appendChild(last.htmlElement);
            last.render();
            rows.push(last);

            if (isVirtualization) {
                last.setTranslateY(last.getDefaultTopOffset());
            }
        }

        const from = Math.max(0, Math.min(
            rowCursor - buffer,
            rowCount - rowsPerPage
        ));
        const to = Math.min(
            rowCursor + rowsPerPage + buffer,
            rows[rows.length - 1].index - 1
        );

        const alwaysLastRow = rows.pop();
        const tempRows: TableRow[] = [];

        const currentFrom = rows[0]?.index;
        const currentTo = rows[rows.length - 1]?.index;
        const hasOverlap = (
            rows.length > 0 &&
            currentFrom !== void 0 &&
            currentTo !== void 0 &&
            !(to < currentFrom || from > currentTo)
        );

        if (!hasOverlap) {
            // Remove rows that are out of the range except the last row.
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                const row = rows[i];
                const rowIndex = row.index;

                if (rowIndex < from || rowIndex > to) {
                    this.poolRow(row);
                } else {
                    tempRows.push(row);
                }
            }

            rows = tempRows;
            vp.rows = rows;

            for (let i = from; i <= to; ++i) {
                const row = rows[i - (rows[0]?.index || 0)];

                // Recreate row when it is destroyed and it is in the range.
                if (!row) {
                    rows.push(this.getOrCreateRow(i));
                }
            }

            rows.sort((a, b): number => a.index - b.index);
        } else {
            // Remove rows outside the range from the start.
            while (rows.length && rows[0].index < from) {
                this.poolRow(rows.shift() as TableRow);
            }

            // Remove rows outside the range from the end.
            while (rows.length && rows[rows.length - 1].index > to) {
                this.poolRow(rows.pop() as TableRow);
            }

            if (!rows.length) {
                for (let i = from; i <= to; ++i) {
                    rows.push(this.getOrCreateRow(i));
                }
            } else {
                // Add rows before the current range.
                for (let i = rows[0].index - 1; i >= from; --i) {
                    rows.unshift(this.getOrCreateRow(i));
                }

                // Add rows after the current range.
                for (let i = rows[rows.length - 1].index + 1; i <= to; ++i) {
                    rows.push(this.getOrCreateRow(i));
                }
            }

            vp.rows = rows;
        }

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            const row = rows[i];
            if (!row.rendered) {
                vp.tbodyElement.insertBefore(
                    row.htmlElement,
                    vp.tbodyElement.lastChild
                );
                row.render();
                continue;
            }

            if (!row.htmlElement.isConnected) {
                vp.tbodyElement.insertBefore(
                    row.htmlElement,
                    vp.tbodyElement.lastChild
                );
            }
        }

        if (alwaysLastRow) {
            rows.push(alwaysLastRow);
        }

        // Focus the cell if the focus cursor is set
        if (vp.focusCursor) {
            const [rowIndex, columnIndex] = vp.focusCursor;
            const row = rows.find((row): boolean => row.index === rowIndex);

            if (row) {
                row.cells[columnIndex]?.htmlElement.focus({
                    preventScroll: true
                });
            }
        }

        // Set the focus anchor cell
        if (
            (!vp.focusCursor || !vp.focusAnchorCell?.row.rendered) &&
            rows.length > 0
        ) {
            const rowIndex = rowCursor - rows[0].index;
            if (rows[rowIndex]) {
                vp.setFocusAnchorCell(rows[rowIndex].cells[0]);
            }
        }
    }

    /**
     * Adjusts the heights of the rows based on the current scroll position.
     * It handles the possibility of the rows having different heights than
     * the default height.
     */
    public adjustRowHeights(): void {
        if (
            this.strictRowHeights ||
            !this.viewport.virtualRows
        ) {
            return;
        }

        const { rowCursor: cursor, defaultRowHeight: defaultH } = this;
        const { rows, tbodyElement } = this.viewport;
        const rowsLn = rows.length;
        if (rowsLn < 1) {
            return;
        }

        let translateBuffer = rows[0].getDefaultTopOffset();

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

        this.adjustRowHeights();
    }

    /**
     * Gets a row from the pool or creates a new one for the given index.
     *
     * @param index
     * The row index in the data table.
     *
     * @returns
     * A TableRow instance ready for use.
     */
    private getOrCreateRow(index: number): TableRow {
        const vp = this.viewport;
        const isVirtualization = vp.virtualRows;
        const pooledRow = this.rowPool.pop();

        if (pooledRow) {
            pooledRow.reuse(index, false);
            if (isVirtualization) {
                pooledRow.setTranslateY(pooledRow.getDefaultTopOffset());
            }
            return pooledRow;
        }

        const newRow = new TableRow(vp, index);
        newRow.rendered = false;
        if (isVirtualization) {
            newRow.setTranslateY(newRow.getDefaultTopOffset());
        }
        return newRow;
    }

    /**
     * Adds a row to the reuse pool, or destroys it if the pool is full.
     *
     * @param row
     * The row to pool.
     */
    private poolRow(row: TableRow): void {
        row.htmlElement.remove();
        if (this.rowPool.length < RowsVirtualizer.MAX_POOL_SIZE) {
            this.rowPool.push(row);
        } else {
            row.destroy();
        }
    }

    /**
     * Returns the default height of a row. This method should be called only
     * once on initialization.
     *
     * @returns
     * The default height of a row.
     */
    private getDefaultRowHeight(): number {
        const vp = this.viewport;
        const mockRow = new TableRow(vp, 0);

        mockRow.htmlElement.style.position = 'absolute';
        mockRow.htmlElement.classList.add(Globals.getClassName('mockedRow'));
        this.viewport.tbodyElement.appendChild(mockRow.htmlElement);
        mockRow.render();

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
