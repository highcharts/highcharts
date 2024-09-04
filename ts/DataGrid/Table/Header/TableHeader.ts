/* *
 *
 *  Data Grid class
 *
 *  (c) 2020-2024 Highsoft AS
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
import type { GroupedHeaderOptions } from '../../Options';
import Column from '../Column.js';
import Table from '../Table.js';
import HeaderRow from './HeaderRow.js';
import HeaderCell from './HeaderCell';
import Utils from '../../../Core/Utilities.js';
const { getStyle } = Utils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table header row containing the cells (headers) with
 * column names.
 */
class TableHeader {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The visible columns of the table.
     */
    public columns: Column[] = [];

    /**
     * The container of the table head.
     */
    public rows: HeaderRow[] = [];

    /**
     * The viewport (table) the table head belongs to.
     */
    public viewport: Table;

    /**
     * The headers and their mouse click event listeners.
     */
    private headersEvents: Array<[HTMLElement, (e: MouseEvent) => void]> = [];

    /**
     * Amount of levels in the header, that is used in creating correct rows.
     */
    public levels: number = 1;
    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new table head.
     *
     * @param viewport
     * The viewport (table) the table head belongs to.
     */
    constructor(viewport: Table) {
        this.viewport = viewport;
        this.columns = viewport.columns;

        if (viewport.dataGrid.options?.header) {
            this.levels = this.getRowLevels(
                viewport.dataGrid.options?.header
            );
        }

    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the table head content.
     */
    public render(): void {
        const vp = this.viewport;
        const dataGrid = vp.dataGrid;

        if (!dataGrid.enabledColumns) {
            return;
        }

        for (let i = 0, iEnd = this.levels; i < iEnd; i++) {
            const row = new HeaderRow(vp, i + 1); // Avoid indexing from 0
            row.renderMultipleLevel(i);
            this.rows.push(row);
        }
    }

    /**
     * Reflows the table head's content dimensions.
     */
    public reflow(): void {
        const { clientWidth, offsetWidth } = this.viewport.tbodyElement;
        const vp = this.viewport;
        const header = vp.header;
        const rows = this.rows;
        const tableEl = header?.viewport.dataGrid.tableElement;
        const theadEL = header?.viewport.theadElement;
        const theadBorder =
            theadEL && getStyle(theadEL, 'border-right-width', true) || 0;
        const tableBorder = (
            tableEl && getStyle(tableEl, 'border-right-width', true)) || 0;

        for (const row of rows) {
            for (const cell of row.cells) {
                const headerCell = cell as HeaderCell;
                const th = cell.htmlElement;

                if (!th) {
                    continue;
                }

                let width = 0;

                if (headerCell.columns) {
                    for (const col of headerCell.columns) {
                        width +=
                            (vp.getColumn(col.columnId || '')?.getWidth()) || 0;
                    }
                } else {
                    width = cell.column.getWidth();
                }

                // Set the width of the column. Max width is needed for the
                // overflow: hidden to work.
                th.style.width = th.style.maxWidth = width + 'px';
            }
        }

        if (vp.rowsWidth) {
            vp.theadElement.style.width = Math.max(vp.rowsWidth, clientWidth) +
                (offsetWidth - clientWidth - theadBorder - tableBorder) + 'px';
        }

        // Adjust cell's width when scrollbar is enabled.
        if (
            header &&
            ((offsetWidth - clientWidth) > (theadBorder + tableBorder))
        ) {
            const cells = header.rows[header.rows.length - 1].cells;
            const cellHtmlElement = cells[cells.length - 1].htmlElement;

            cellHtmlElement.style.width = cellHtmlElement.style.maxWidth =
                cellHtmlElement.offsetWidth +
                (offsetWidth - clientWidth - theadBorder - tableBorder) + 'px';
        }
    }

    /**
     * Setter for events
     *
     * @param element
     * HTML column's header element.
     *
     * @param event
     * Callback that is triggered.
     *
     * @internal
     */
    public addHeaderEvent(
        element: HTMLElement,
        event: (e: MouseEvent) => void
    ): void {
        this.headersEvents.push([
            element,
            event
        ]);
    }

    /**
     * Returns amount of rows for the current cell in header tree.
     *
     * @param scope
     * Structure of header
     *
     * @returns
     */
    private getRowLevels(
        scope: Array<GroupedHeaderOptions | string>
    ): number {
        let maxDepth = 0;

        for (const item of scope) {
            if (typeof item !== 'string' && item.columns) {
                const depth = this.getRowLevels(item.columns);
                if (depth > maxDepth) {
                    maxDepth = depth;
                }
            }
        }

        return maxDepth + 1;
    }

    /**
     * Scrolls the table head horizontally.
     *
     * @param scrollLeft
     * The left scroll position.
     */
    public scrollHorizontally(scrollLeft: number): void {
        this.viewport.theadElement.style.transform =
            `translateX(${-scrollLeft}px)`;
    }

    /**
     * Unbind header events.
     * @internal
     */
    public removeHeaderEventListeners(): void {
        for (let i = 0, iEnd = this.headersEvents.length; i < iEnd; i++) {
            const [handle, listener] = this.headersEvents[i];
            handle.removeEventListener('click', listener);
        }
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace TableHeader {

}


/* *
 *
 *  Default Export
 *
 * */

export default TableHeader;
