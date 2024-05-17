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

import Globals from './Globals.js';
import Utils from './Utils.js';
import DataTable from '../../Data/DataTable.js';
import DataGridRow from './DataGridRow.js';

const { makeHTMLElement } = Utils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table viewport for the data grid.
 */
class DataGridTable {

    /* *
    *
    *  Properties
    *
    * */

    private dataTable: DataTable;
    private tableElement: HTMLElement;
    private theadElement: HTMLElement;
    private tbodyElement: HTMLElement;
    private rows: DataGridRow[] = [];


    /* *
    *
    *  Constructor
    *
    * */

    constructor(dataTable: DataTable, renderTo: HTMLElement) {
        this.dataTable = dataTable;

        this.tableElement = makeHTMLElement('table', {
            className: Globals.classNames.tableElement
        }, renderTo);
        this.theadElement = makeHTMLElement('thead', {}, this.tableElement);
        this.tbodyElement = makeHTMLElement('tbody', {}, this.tableElement);

        this.render();
    }

    /* *
    *
    *  Methods
    *
    * */

    public render(): void {
        this.renderHead();
        this.renderBody();
    }

    public renderHead(): void {
        const columnNames = this.dataTable.getColumnNames();

        this.theadElement.innerHTML = '';

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            makeHTMLElement('th', {
                innerText: columnNames[i]
            }, this.theadElement);
        }
    }

    public renderBody(): void {
        const rowCount = this.dataTable.getRowCount();

        this.tbodyElement.innerHTML = '';
        this.refreshViewportHeight();

        for (let i = 0; i < rowCount; ++i) {
            const row = new DataGridRow(this.dataTable, i);
            this.rows.push(row);

            if (row.htmlElement) {
                this.tbodyElement.appendChild(row.htmlElement);
            }
        }
    }

    public refreshViewportHeight(): void {
        this.tbodyElement.style.height = `calc(100% - ${this.theadElement.offsetHeight}px)`;
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

namespace DataGridTable {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridTable;
