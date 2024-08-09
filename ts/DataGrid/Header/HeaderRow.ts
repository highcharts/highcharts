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
import Cell from '../Cell.js';
import Column from '../Column.js';

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
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param viewport
     * The Data Grid Table instance which the row belongs to.
     */
    constructor(viewport: Table) {
        super(viewport);
        this.setRowAttributes();
    }


    /* *
    *
    *  Methods
    *
    * */

    public override createCell(column: Column): Cell {
        return new HeaderCell(column, this);
    }

    /**
     * Renders the row's content in the header.
     */
    public override render(): void {

        // Render element
        this.viewport.theadElement.appendChild(
            this.htmlElement
        );

        this.htmlElement.classList.add(
            Globals.classNames.headerRow
        );

        super.render();
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
