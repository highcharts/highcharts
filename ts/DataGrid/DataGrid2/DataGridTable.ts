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
import DataTable from '../../Data/DataTable.js';
import DataGridRow from './DataGridRow.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridTableHead from './DataGridTableHead.js';
import DataGrid from './DataGrid.js';
import Globals from './Globals.js';

const { makeHTMLElement } = DGUtils;

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

    /**
     * The index of the first visible row.
     */
    public rowCursor: number = 0;

    /**
     * The initial height of the top row.
     */
    private topRowInitialHeight?: number;


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

        // Load columns
        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            this.columns.push(
                new DataGridColumn(this, columnNames[i], i)
            );
        }

        // Load & render head
        this.head = new DataGridTableHead(this.theadElement, this.columns);
        this.head.render();

        // Initial reflow to set the viewport height
        this.reflow();

        // Load & render rows
        this.renderRows(this.rowCursor);
        this.adjustRowDimensions();

        // Refresh element dimensions after initial rendering
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
     * @param rowCursor
     * The index of the first visible row.
     */
    private renderRows(rowCursor: number): void {
        const buffer = this.dataGrid.options.rowOptions?.bufferSize as number;
        const rowsPerPage = Math.ceil(
            this.tbodyElement.offsetHeight / this.defaultRowHeight
        );

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

        const from = Math.max(rowCursor - buffer, 0);
        const to = Math.min(
            rowCursor + rowsPerPage + buffer,
            rows[rows.length - 1].index - 1
        );

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

        const bof = rowCursor - buffer < 0 ? buffer - rowCursor : 0;
        this.topRowInitialHeight =
            this.rows[buffer - bof].htmlElement.clientHeight;
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
        const rowCursor = Math.floor(target.scrollTop / rowHeight);
        if (this.rowCursor !== rowCursor) {
            this.renderRows(rowCursor);
        }
        this.rowCursor = rowCursor;

        this.adjustRowDimensions();
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

        const defaultRowHeight = mockRow.clientHeight;
        mockRow.remove();

        return defaultRowHeight;
    }

    public adjustRowDimensions(): void {
        let translateBuffer = this.rows[0].getDefaultTopOffset();
        const rowLen = this.rows.length;

        for (let i = 0; i < rowLen; ++i) {
            const row = this.rows[i];
            const cursor = this.rowCursor;

            if (row.index > cursor) {
                break;
            }

            const element = row.htmlElement;
            const defaultH = this.defaultRowHeight;
            const borderH = element.offsetHeight - element.clientHeight;

            if (row.index < cursor) {
                row.htmlElement.style.height = defaultH + borderH + 'px';
            } else if (
                row.getCurrentHeight() > defaultH &&
                this.topRowInitialHeight
            ) {
                const ratio = this.tbodyElement.scrollTop / defaultH - cursor;
                const diff = this.topRowInitialHeight - defaultH;

                row.htmlElement.style.height =
                    this.topRowInitialHeight - diff * ratio + 'px';
            }
        }

        for (let i = 1, iEnd = rowLen - 1; i < iEnd; ++i) {
            translateBuffer += this.rows[i - 1].getCurrentHeight();
            this.rows[i].htmlElement.style.transform =
                `translateY(${translateBuffer}px)`;
        }

        if (this.rows[rowLen - 2].index + 1 === this.rows[rowLen - 1].index) {
            translateBuffer += this.rows[rowLen - 2].getCurrentHeight();
            this.rows[rowLen - 1].htmlElement.style.transform =
                `translateY(${translateBuffer}px)`;
        } else {
            this.rows[rowLen - 1].htmlElement.style.transform =
                `translateY(${this.rows[rowLen - 1].getDefaultTopOffset()}px)`;
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
