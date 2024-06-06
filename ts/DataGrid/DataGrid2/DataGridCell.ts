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

import DataGridColumn from './DataGridColumn';
import DataGridRow from './DataGridRow';
import F from '../../Core/Templating.js';
const { format } = F;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid.
 */
class DataGridCell {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The HTML element of the cell.
     */
    public htmlElement: HTMLTableCellElement;

    /**
     * The column of the cell.
     */
    public column: DataGridColumn;

    /**
     * The row of the cell.
     */
    public row: DataGridRow;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid.
     *
     * @param column The column of the cell.
     * @param row The row of the cell.
     */
    constructor(column: DataGridColumn, row: DataGridRow) {
        this.htmlElement = document.createElement('td');

        this.column = column;
        this.column.registerCell(this);

        this.row = row;
        this.row.registerCell(this);

        this.htmlElement.addEventListener('mouseenter', this.onMouseEnter);
        this.htmlElement.addEventListener('mouseout', this.onMouseOut);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the cell.
     */
    public render(): void {
        if (!this.column.data) {
            return;
        }

        const formatString = this.column.userOptions.format;
        const cellData = this.column.data[this.row.index];

        this.htmlElement.innerText = 
            (
                formatString ?
                    format(formatString, cellData) :
                    cellData
            ) as string;

        this.row.htmlElement.appendChild(this.htmlElement);
    }

    /**
     * Reflows the cell dimensions.
     */
    public reflow(): void {
        this.htmlElement.style.width =
            this.htmlElement.style.maxWidth = this.column.getWidth() + 'px';
    }

    /**
     * Sets the hover state of the cell and its row and column.
     */
    private readonly onMouseEnter = (): void => {
        this.row.setHover(true);
        this.column.setHover(true);
    };

    /**
     * Unsets the hover state of the cell and its row and column.
     */
    private readonly onMouseOut = (): void => {
        this.row.setHover(false);
        this.column.setHover(false);
    };

    /**
     * Destroys the cell.
     */
    public destroy(): void {
        this.htmlElement.removeEventListener('mouseenter', this.onMouseEnter);
        this.htmlElement.removeEventListener('mouseout', this.onMouseOut);
        this.htmlElement.remove();
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

namespace DataGridCell {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridCell;
