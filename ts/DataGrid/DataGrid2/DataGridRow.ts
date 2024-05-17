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

import DataGridCell from './DataGridCell.js';
import DataTable from '../../Data/DataTable.js';
import Utils from './Utils.js';

const { makeHTMLElement } = Utils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class DataGridRow {

    /* *
    *
    *  Properties
    *
    * */

    public static defaultHeight = 41;

    public cells: DataGridCell[] = [];
    public cellsAmount: number;
    public htmlElement?: HTMLElement;
    public dataTable: DataTable;
    public index: number;


    /* *
    *
    *  Constructor
    *
    * */

    constructor(dataTable: DataTable, index: number) {
        this.dataTable = dataTable;
        this.index = index;
        this.cellsAmount = dataTable.getColumnNames().length;
        this.load();
    }

    /* *
    *
    *  Methods
    *
    * */

    public load(): void {
        if (this.htmlElement) {
            return;
        }

        this.htmlElement = makeHTMLElement('tr');
        this.htmlElement.style.height = DataGridRow.defaultHeight + 'px';
        this.htmlElement.style.top =
            this.index * DataGridRow.defaultHeight + 'px';

        const dataTable = this.dataTable;
        for (let i = 0; i < this.cellsAmount; i++) {
            makeHTMLElement('td', {
                innerText: dataTable.getCell(
                    dataTable.getColumnNames()[i], this.index
                )?.toString()
            }, this.htmlElement);
        }
    }

    public destroy(): void {
        if (!this.htmlElement) {
            return;
        }

        this.htmlElement.remove();
        this.htmlElement = void 0;
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

namespace DataGridRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridRow;
