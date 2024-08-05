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

import Row from '../Row.js';
import Table from '../Table.js';
import Globals from '../Globals.js';
import HeaderCell from './HeaderCell.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class HeaderRow extends Row {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The cells of the row.
     */
    public cells: HeaderCell[] = [];

    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param viewport
     * The Data Grid Table instance which the row belongs to.
     *
     * @param index
     * The index of the row in the data table.
     */
    constructor(viewport: Table, index: number) {
        super(viewport, index);
        this.setRowAttributes();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the row's content in the header.
     */
    public renderColumnsHeaders(): void {
        const columns = this.viewport.columns;
        const cells = this.cells;
        // Render element
        this.viewport.theadElement.appendChild(
            this.htmlElement
        );

        this.htmlElement.classList.add(
            Globals.classNames.headerRow
        );

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            const last = new HeaderCell(columns[i], this);
            last.render();
            cells.push(last);
        }

        this.reflow();
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    private setRowAttributes(): void {
        const el = this.htmlElement;
        el.setAttribute('aria-rowindex', 1);
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace HeaderRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderRow;
