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

import DGUtils from './Utils.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridTable from './DataGridTable.js';

const { makeHTMLElement } = DGUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table header row containing the column names.
 */
class DataGridTableHead {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The visible columns of the table.
     */
    public columns: DataGridColumn[] = [];

    /**
     * The container of the table head.
     */
    public container: HTMLElement;

    /**
     * The viewport (table) the table head belongs to.
     */
    public viewport: DataGridTable;


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
    constructor(viewport: DataGridTable) {
        this.viewport = viewport;
        this.columns = viewport.columns;
        this.container = makeHTMLElement('tr', {}, viewport.theadElement);
        this.container.setAttribute('aria-rowindex', 1);
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
        let column;
        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            column = this.columns[i];
            const element = makeHTMLElement('th', {
                innerText: column.userOptions.headFormat || column.id
            }, this.container);

            // Set the accessibility attributes.
            element.setAttribute('scope', 'col');
            element.setAttribute('data-column-id', this.columns[i].id);

            // Set the column's head element.
            column.headElement = element;

            if (
                this.viewport.columnDistribution !== 'full' ||
                i < this.viewport.allColumnsCount - 1
            ) {
                // Render the drag handle for resizing columns.
                this.renderColumnDragHandles(
                    column,
                    element
                );
            }
        }
    }

    /**
     * Reflows the table head's content dimensions.
     */
    public reflow(): void {
        const { clientWidth, offsetWidth } = this.viewport.tbodyElement;
        const vp = this.viewport;

        for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
            const column = this.columns[i];
            const td = column.headElement;
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
     * Render the drag handle for resizing columns.
     */
    private renderColumnDragHandles(
        column: DataGridColumn, headElement: HTMLElement
    ): HTMLElement {
        const handle = makeHTMLElement('div', {
            className: 'highcharts-dg-col-resizer'
        }, headElement);

        this.viewport.columnsResizer.addHandleListeners(handle, column);

        return handle;
    }

    /**
     * Scrolls the table head horizontally.
     *
     * @param scrollLeft
     *        The left scroll position.
     */
    public scrollHorizontally(scrollLeft: number): void {
        this.viewport.theadElement.style.transform =
            `translateX(${-scrollLeft}px)`;
    }


    /* *
    *
    *  Static Methods
    *
    * */

}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridTableHead {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridTableHead;
