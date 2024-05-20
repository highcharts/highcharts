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

    public htmlElement: HTMLElement;
    public column: DataGridColumn;
    public row: DataGridRow;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(column: DataGridColumn, row: DataGridRow) {
        this.htmlElement = document.createElement('td');

        this.column = column;
        this.column.registerCell(this);

        this.row = row;
        this.row.registerCell(this);
    }


    /* *
    *
    *  Methods
    *
    * */

    public render(): void {
        if (!this.column.data) {
            return;
        }

        const cellData = this.column.data[this.row.index];

        this.htmlElement.innerText = '' + cellData;
        this.row.htmlElement.appendChild(this.htmlElement);
    }

    public reflow(): void {
        this.htmlElement.style.width = this.column.getWidth() + 'px';
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
