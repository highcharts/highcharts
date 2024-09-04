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

import Table from '../Table.js';
import DGUtils from '../../Utils.js';
import Globals from '../../Globals.js';
import TableRow from '../Content/TableRow.js';

const { makeHTMLElement, getTranslateY } = DGUtils;


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
    public defaultRowHeight: number;

    /**
     * The index of the first visible row.
     */
    public rowCursor = 0;

    /**
     * The viewport (table) of the data grid.
     */
    public viewport: Table;

    /**
     * Size of the row buffer - how many rows should be rendered outside of the
     * viewport from the top and the bottom.
     */
    private buffer: number;

    /**
     * Flag indicating if the rows should have strict heights (no custom or
     * dynamic heights allowed).
     */
    private strictRowHeights: boolean;

    /**
     * Flag indicating if the scrolling handler should be prevented to avoid
     * flickering loops when scrolling to the last row.
     */
    private preventScroll = false;


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
        const rowSettings = viewport.dataGrid.options?.rendering?.rows;

        this.viewport = viewport;
        this.strictRowHeights = rowSettings?.strictHeights as boolean;
        this.buffer = Math.max(rowSettings?.bufferSize as number, 0);
        this.defaultRowHeight = this.getDefaultRowHeight();

        if (this.strictRowHeights) {
            viewport.tbodyElement.classList.add(
                Globals.classNames.rowsContentNowrap
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
        this.viewport.reflow();

        // Load & render rows
        this.renderRows(this.rowCursor);
        this.adjustRowHeights();
    }

    /**
     * Renders the rows in the viewport. It is called when the rows need to be
     * re-rendered, e.g., after a sort or filter operation.
     */
    public rerender(): void {
        const rows = this.viewport.rows;
        const tbody = this.viewport.tbodyElement;

        let oldScrollTop: number | undefined;

        if (rows.length) {
            oldScrollTop = tbody.scrollTop;
            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                rows[i].destroy();
            }
            rows.length = 0;
        }

        this.renderRows(this.rowCursor);

        if (oldScrollTop !== void 0) {
            tbody.scrollTop = oldScrollTop;
        }

        this.scroll();

        // Reflow the rendered row cells widths (check redundancy)
        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rows[i].reflow();
        }
    }

    /**
     * Method called on the viewport scroll event.
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

        let rowTop = getTranslateY(lastRow.htmlElement);
        const rowBottom = rowTop + lastRow.htmlElement.offsetHeight;
        let newHeight = lastRow.cells[0].htmlElement.offsetHeight;
        rowTop = rowBottom - newHeight;

        lastRow.htmlElement.style.height = newHeight + 'px';
        lastRow.htmlElement.style.transform = `translateY(${rowTop}px)`;
        for (let j = 0, jEnd = lastRow.cells.length; j < jEnd; ++j) {
            lastRow.cells[j].htmlElement.style.transform = '';
        }

        for (let i = rowsLn - 2; i >= 0; i--) {
            const row = rows[i];

            newHeight = row.cells[0].htmlElement.offsetHeight;
            rowTop -= newHeight;

            row.htmlElement.style.height = newHeight + 'px';
            row.htmlElement.style.transform = `translateY(${rowTop}px)`;
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
        const rowsPerPage = Math.ceil(
            vp.tbodyElement.offsetHeight / this.defaultRowHeight
        );

        const rows = vp.rows;

        if (!rows.length) {
            const last = new TableRow(vp, vp.dataTable.getRowCount() - 1);
            last.render();
            rows.push(last);
            vp.tbodyElement.appendChild(last.htmlElement);
        }

        const from = Math.max(0, Math.min(
            rowCursor - buffer,
            vp.dataTable.getRowCount() - rowsPerPage
        ));
        const to = Math.min(
            rowCursor + rowsPerPage + buffer,
            rows[rows.length - 1].index - 1
        );

        const alwaysLastRow = rows.pop();

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rows[i].destroy();
        }
        rows.length = 0;

        for (let i = from; i <= to; ++i) {
            const newRow = new TableRow(vp, i);
            newRow.render();
            vp.tbodyElement.insertBefore(
                newRow.htmlElement,
                vp.tbodyElement.lastChild
            );

            rows.push(newRow);
        }

        if (alwaysLastRow) {
            rows.push(alwaysLastRow);
        }
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

        for (let i = 1, iEnd = rowsLn - 1; i < iEnd; ++i) {
            translateBuffer += rows[i - 1].htmlElement.offsetHeight;
            rows[i].htmlElement.style.transform =
                `translateY(${translateBuffer}px)`;
        }

        // Set the proper offset for the last row
        const lastRow = rows[rowsLn - 1];
        const preLastRow = rows[rowsLn - 2];
        if (preLastRow && preLastRow.index === lastRow.index - 1) {
            lastRow.htmlElement.style.transform = `translateY(${
                preLastRow.htmlElement.offsetHeight +
                getTranslateY(preLastRow.htmlElement)
            }px)`;
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
        const mockRow = makeHTMLElement('tr', {
            className: Globals.classNames.rowElement
        }, this.viewport.tbodyElement);

        const defaultRowHeight = mockRow.offsetHeight;
        mockRow.remove();

        return defaultRowHeight;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default RowsVirtualizer;
