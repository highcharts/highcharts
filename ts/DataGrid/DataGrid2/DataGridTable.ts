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
import DataGridColumn from './DataGridColumn.js';
import DataGridTableHead from './DataGridTableHead.js';

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

    public dataTable: DataTable;
    public tableElement: HTMLElement;
    public theadElement: HTMLElement;
    public tbodyElement: HTMLElement;
    public head?: DataGridTableHead;
    public columns: DataGridColumn[] = [];
    public rows: DataGridRow[] = [];
    public resizeObserver: ResizeObserver;


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

        this.resizeObserver = new ResizeObserver(this.resize);
        this.resizeObserver.observe(renderTo);
    }

    /* *
    *
    *  Methods
    *
    * */

    public render(): void {
        const columnNames = this.dataTable.getColumnNames();
        const rowCount = this.dataTable.getRowCount();

        // Load columns
        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            this.columns.push(
                new DataGridColumn(this, columnNames[i])
            );
        }

        // Load & render head
        this.head = new DataGridTableHead(this.theadElement, this.columns);
        this.head.render();

        // Load & render rows
        for (let i = 0; i < rowCount; ++i) {
            const row = new DataGridRow(this.dataTable, i);
            row.render(this);
        }

        this.reflow();
    }

    public reflow(): void {
        // Set the width of the visible part of the scrollable area.
        this.tbodyElement.style.height =
            `calc(100% - ${this.theadElement.offsetHeight}px)`;

        // Reflow the head
        if (this.head) {
            this.head.reflow();
        }

        // Reflow rows
        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].reflow();
        }
    }

    private resize(entries: ResizeObserverEntry[]): void {

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
