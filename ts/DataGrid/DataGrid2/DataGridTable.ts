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

import DGUtils from './Utils.js';
import Utils from '../../Core/Utilities.js';
import DataTable from '../../Data/DataTable.js';
import DataGridRow from './DataGridRow.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridTableHead from './DataGridTableHead.js';
import DataGrid from './DataGrid.js';
import Globals from './Globals.js';

const { makeHTMLElement } = DGUtils;
const { getStyle } = Utils;

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

    /**
     * The data grid instance which the table (viewport) belongs to.
     */
    public dataGrid: DataGrid;

    /**
     * The HTML element of the table.
     */
    public container: HTMLTableElement;

    /**
     * The data source of the data grid.
     */
    public dataTable: DataTable;

    /**
     * The HTML element of the table head.
     */
    public theadElement: HTMLElement;

    /**
     * The HTML element of the table body.
     */
    public tbodyElement: HTMLElement;

    /**
     * The head of the table.
     */
    public head?: DataGridTableHead;

    /**
     * The visible columns of the table.
     */
    public columns: DataGridColumn[] = [];

    /**
     * The visible rows of the table.
     */
    public rows: DataGridRow[] = [];

    /**
     * The resize observer for the table container.
     */
    public resizeObserver: ResizeObserver;

    /**
     * The default height of a row.
     */
    public defaultRowHeight: number;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid table.
     *
     * @param dataGrid The data grid instance which the table (viewport) belongs to.
     */
    constructor(dataGrid: DataGrid) {
        this.dataGrid = dataGrid;
        this.container = dataGrid.tableElement;
        this.dataTable = dataGrid.dataTable;

        const { tableElement } = dataGrid;

        this.theadElement = makeHTMLElement('thead', {}, tableElement);
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);

        this.defaultRowHeight = this.getDefaultRowHeight();

        this.init();

        this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
        this.resizeObserver.observe(tableElement);

        this.tbodyElement.addEventListener('scroll', this.onScroll.bind(this));
    }

    /* *
    *
    *  Methods
    *
    * */

    /**
     * Initializes the data grid table.
     */
    private init(): void {
        const columnNames = this.dataTable.getColumnNames();
        const buffer = this.dataGrid.options.rowOptions?.bufferSize as number;

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
        this.renderRows(0, Math.ceil(
            this.container.offsetHeight / this.defaultRowHeight
        ) + buffer);

        // Refresh element dimensions
        this.reflow();
    }

    /**
     * Reflows the table's content dimensions.
     */
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

    /**
     * Renders rows in the specified range. Removes rows that are out of the
     * range except the last row.
     *
     * @param from first row index
     * @param to last row index (excluding the last row)
     */
    private renderRows(from: number, to: number): void {
        const rows = this.rows;

        if (!rows.length) {
            const last = new DataGridRow(
                this,
                this.dataTable.getRowCount() - 1
            );
            last.render(this);
            rows.push(last);
            this.tbodyElement.appendChild(last.htmlElement);
        }

        from = Math.max(from, 0);
        to = Math.min(to, rows[rows.length - 1].index - 1);

        const alwaysLastRow = rows.pop();

        for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
            rows[i].destroy();
        }
        rows.length = 0;

        for (let i = from; i <= to; ++i) {
            const newRow = new DataGridRow(this, i);
            newRow.render(this);
            this.tbodyElement.insertBefore(
                newRow.htmlElement,
                this.tbodyElement.lastChild
            );

            rows.push(newRow);
        }

        if (alwaysLastRow) {
            rows.push(alwaysLastRow);
        }

        this.adjustRowDimensions();
    }

    /**
     * Handles the resize event.
     */
    private onResize(): void {
        this.reflow();
    }

    /**
     * Handles the scroll event.
     */
    private onScroll(): void {
        const target = this.tbodyElement;
        const { defaultRowHeight: rowHeight } = this;

        // Vertical virtual scrolling
        const rowsPerPage = Math.ceil(target.offsetHeight / rowHeight);
        const rowCursor = Math.floor(target.scrollTop / rowHeight);
        const buffer = this.dataGrid.options.rowOptions?.bufferSize as number;

        this.renderRows(
            rowCursor - buffer,
            rowCursor + rowsPerPage + buffer
        );
    }

    /**
     * Scrolls the table to the specified row.
     *
     * @param index The index of the row to scroll to.
     */
    public scrollToRow(index: number): void {
        this.tbodyElement.scrollTop = index * this.defaultRowHeight;
    }

    public getDefaultRowHeight(): number {
        const mockRow = makeHTMLElement('tr', {
            className: Globals.classNames.rowElement
        }, this.tbodyElement);

        const defaultRowHeight = getStyle(mockRow, 'height', true) as number;
        mockRow.remove();

        return defaultRowHeight;
    }

    public adjustRowDimensions(): void {
        let translateBuffer = this.rows[0].getDefaultTopOffset();

        for (let i = 1, iEnd = this.rows.length - 1; i < iEnd; ++i) {
            translateBuffer += this.rows[i - 1].getHeight();
            this.rows[i].htmlElement.style.transform =
                `translateY(${translateBuffer}px)`;
        }
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
