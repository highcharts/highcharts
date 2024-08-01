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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Cell from './Cell.js';
import Column from './Column';
import Row from './Row';
import DGUtils from './Utils.js';
import Globals from './Globals.js';
import Templating from '../Core/Templating.js';
// import ColumnSorting from './Actions/ColumnSorting.js';

const { format } = Templating;
const { makeHTMLElement } = DGUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid.
 */
class HeaderCell extends Cell {

    /* *
    *
    *  Properties
    *
    * */


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid.
     *
     * @param column
     * The column of the cell.
     *
     * @param row
     * The row of the cell.
     */
    constructor(column: Column, row: Row) {
        super(column, row);
    }

    /* *
    *
    *  Methods
    *
    * */
    /**
     * Render the cell container.
     */
    public render(): any {
        const cell = makeHTMLElement('th', {}, this.row.htmlElement);
        const column = this.column;

        const innerText = column.userOptions.headerFormat ? (
            format(column.userOptions.headerFormat, column)
        ) : column.id;

        makeHTMLElement('div', {
            innerText: innerText,
            className: Globals.classNames.headCellContent
        }, cell);
        
        // Set the accessibility attributes.
        cell.setAttribute('scope', 'col');
        cell.setAttribute('data-column-id', column.id);

        return cell;
    }
    /**
     * Destroys the cell.
     */
    public destroy(): void {
        super.destroy();
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace HeaderCell {

}


/* *
 *
 *  Default Export
 *
 * */

export default HeaderCell;
