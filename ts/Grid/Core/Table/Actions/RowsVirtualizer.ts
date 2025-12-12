/* *
 *
 *  Grid Rows Renderer class.
 *
 *  (c) 2020-2025 Highsoft AS
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

        // Remove rows that are out of the range except the last row.
        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            const row = rows[i];
            const rowIndex = row.index;

            if (rowIndex < from || rowIndex > to) {
                row.destroy();
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
                const newRow = new TableRow(vp, i);
                rows.push(newRow);
                newRow.rendered = false;
                if (isVirtualization) {
                    newRow.setTranslateY(newRow.getDefaultTopOffset());
                }
            }
        }

        rows.sort((a, b): number => a.index - b.index);

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            if (!rows[i].rendered) {
                vp.tbodyElement.insertBefore(
                    rows[i].htmlElement,
                    vp.tbodyElement.lastChild
                );
                rows[i].render();
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
     * Returns the default height of a row. This method should be called only
     * once on initialization.
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
