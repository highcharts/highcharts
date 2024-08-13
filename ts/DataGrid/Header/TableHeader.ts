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

import Column from '../Column.js';
import Table from '../Table.js';
import HeaderRow from './HeaderRow.js';

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
        this.rows[0] = new HeaderRow(viewport);
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

        // TODO: render column grouping headers
        // this.rows[0].renderGroupedColumnHeaders();

        // render basic column headers
        this.rows[0].render();
    }

    /**
     * Reflows the table head's content dimensions.
     */
    public reflow(): void {
        const { clientWidth, offsetWidth } = this.viewport.tbodyElement;
        const vp = this.viewport;

        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const column = this.columns[i];
            const td = column.header?.htmlElement;

            if (!td) {
                continue;
            }

            // Set the width of the column. Max width is needed for the
            // overflow: hidden to work.
            td.style.width = td.style.maxWidth = column.getWidth() + 'px';
        }

        if (vp.rowsWidth) {
            vp.theadElement.style.width = Math.max(vp.rowsWidth, clientWidth) +
                offsetWidth - clientWidth + 'px';
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
