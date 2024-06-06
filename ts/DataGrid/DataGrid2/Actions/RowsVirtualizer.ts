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
import DGUtils from '../Utils.js';
import Globals from '../Globals.js';
import DataGridRow from '../DataGridRow.js';

const { makeHTMLElement } = DGUtils;


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
    public rowCursor: number = 0;

    /**
     * The viewport (table) of the data grid.
     */
    public viewport: DataGridTable;

    /**
     * The initial height of the top row.
     */
    private topRowInitialHeight?: number;

    /**
     * Size of the row buffer - how many rows should be rendered outside of the
     * viewport from the top and the bottom.
     */
    private buffer: number;


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
    constructor(viewport: DataGridTable) {
        this.viewport = viewport;
        this.defaultRowHeight = this.getDefaultRowHeight();
        this.buffer = viewport.dataGrid.options.rows?.bufferSize as number;
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

    public scroll(): void {
        const target = this.viewport.tbodyElement;
        const { defaultRowHeight: rowHeight } = this;

        // Do vertical virtual scrolling
        const rowCursor = Math.floor(target.scrollTop / rowHeight);
        if (this.rowCursor !== rowCursor) {
            this.renderRows(rowCursor);
        }
        this.rowCursor = rowCursor;
        // -----------------------------

        this.adjustRowHeights();
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
            const last = new DataGridRow(vp, vp.dataTable.getRowCount() - 1);
            last.render();
            rows.push(last);
            vp.tbodyElement.appendChild(last.htmlElement);
        }

        const from = Math.max(rowCursor - buffer, 0);
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
            const newRow = new DataGridRow(vp, i);
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

        const bof = buffer - (rowCursor - buffer < 0 ? buffer - rowCursor : 0);
        this.topRowInitialHeight = vp.rows[bof].htmlElement.clientHeight;
    }

    /**
     * Adjusts the heights of the rows based on the current scroll position.
     * It handles the possibility of the rows having different heights than
     * the default height.
     */
    public adjustRowHeights(): void {
        const { rows, tbodyElement } = this.viewport;
        const rowsLn = rows.length;

        let translateBuffer = rows[0].getDefaultTopOffset();

        for (let i = 0; i < rowsLn; ++i) {
            const row = rows[i];
            const cursor = this.rowCursor;

            if (row.index > cursor) {
                break;
            }

            const element = row.htmlElement;
            const defaultH = this.defaultRowHeight;
            const borderH = element.offsetHeight - element.clientHeight;

            if (row.index < cursor) {
                row.htmlElement.style.height = defaultH + borderH + 'px';
            } else if (
                row.getCurrentHeight() > defaultH &&
                this.topRowInitialHeight
            ) {
                const ratio = tbodyElement.scrollTop / defaultH - cursor;
                const diff = this.topRowInitialHeight - defaultH;

                row.htmlElement.style.height =
                    this.topRowInitialHeight - diff * ratio + 'px';
            }
        }

        for (let i = 1, iEnd = rowsLn - 1; i < iEnd; ++i) {
            translateBuffer += rows[i - 1].getCurrentHeight();
            rows[i].htmlElement.style.transform =
                `translateY(${translateBuffer}px)`;
        }

        if (rows[rowsLn - 2].index + 1 === rows[rowsLn - 1].index) {
            translateBuffer += rows[rowsLn - 2].getCurrentHeight();
            rows[rowsLn - 1].htmlElement.style.transform =
                `translateY(${translateBuffer}px)`;
        } else {
            rows[rowsLn - 1].htmlElement.style.transform =
                `translateY(${rows[rowsLn - 1].getDefaultTopOffset()}px)`;
        }
    }

    /**
     * Reflow the rendered rows content dimensions.
     */
    public reflowRows(): void {
        const rows = this.viewport.rows;

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rows[i].reflow();
        }
    }

    /**
     * Returns the default height of a row. This method should be called only
     * once on initialization.
     */
    private getDefaultRowHeight(): number {
        const mockRow = makeHTMLElement('tr', {
            className: Globals.classNames.rowElement
        }, this.viewport.tbodyElement);

        const defaultRowHeight = mockRow.clientHeight;
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
