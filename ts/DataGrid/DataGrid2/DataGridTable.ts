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

    /**
     * The container of the data grid table (viewport).
     */
    public container: HTMLElement;

    /**
     * The data source of the data grid.
     */
    public dataTable: DataTable;

    /**
     * The HTML element of the table.
     */
    public tableElement: HTMLElement;

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


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid table.
     *
     * @param dataTable The data for the viewport.
     * @param renderTo The render target (container) of the viewport.
     */
    constructor(dataTable: DataTable, renderTo: HTMLElement) {
        this.container = renderTo;
        this.dataTable = dataTable;

        this.tableElement = makeHTMLElement('table', {
            className: Globals.classNames.tableElement
        }, renderTo);
        this.theadElement = makeHTMLElement('thead', {}, this.tableElement);
        this.tbodyElement = makeHTMLElement('tbody', {}, this.tableElement);

        this.init();

        this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
        this.resizeObserver.observe(renderTo);

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
                new DataGridColumn(this, columnNames[i])
            );
        }

        // Load & render head
        this.head = new DataGridTableHead(this.theadElement, this.columns);
        this.head.render();

        // Load & render rows
        const rowsPerPage = Math.ceil(
            this.container.offsetHeight / DataGridRow.defaultHeight
        );
        this.renderRows(0, rowsPerPage);

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
            const first = new DataGridRow(this.dataTable, 0);
            const last = new DataGridRow(
                this.dataTable,
                this.dataTable.getRowCount() - 1
            );

            first.render(this);
            rows.push(first);
            this.tbodyElement.appendChild(first.htmlElement);

            last.render(this);
            rows.push(last);
            this.tbodyElement.appendChild(last.htmlElement);
        }

        const startOffset = rows[0].index;
        const endOffset = rows[rows.length - 2].index;

        from = Math.max(from, 0);
        to = Math.min(to, rows[rows.length - 1].index - 1);

        const start = Math.min(startOffset, from);
        const end = Math.max(endOffset, to);

        // Swap all rows if the range is outside the current range
        if (to < startOffset || from > endOffset) {
            const alwaysLastRow = rows.pop();

            for (let i = 0, iEnd = rows.length; i < iEnd; ++i) {
                rows[i].destroy();
            }
            rows.length = 0;

            for (let i = from; i <= to; ++i) {
                const newRow = new DataGridRow(this.dataTable, i);
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

            return;
        }

        // Add rows at the beginning
        for (let i = startOffset - 1; i >= start; --i) {
            const newRow = new DataGridRow(this.dataTable, i);
            newRow.render(this);
            this.tbodyElement.insertBefore(
                newRow.htmlElement,
                this.tbodyElement.firstChild
            );
            rows.unshift(newRow);
        }

        // Add rows at the end
        for (let i = endOffset + 1; i <= end; ++i) {
            const newRow = new DataGridRow(this.dataTable, i);
            newRow.render(this);
            this.tbodyElement.insertBefore(
                newRow.htmlElement,
                this.tbodyElement.lastChild
            );
            const alwaysLastRow = rows.pop();
            rows.push(newRow);
            if (alwaysLastRow) {
                rows.push(alwaysLastRow);
            }
        }

        // Delete first rows if there are too many
        for (let i = 0; i < from - startOffset; i++) {
            rows.shift()?.destroy();
        }

        // Delete last rows if there are too many
        for (let i = endOffset - to - 1; i >= 0; i--) {
            const alwaysLastRow = rows.pop();
            rows.pop()?.destroy();
            if (alwaysLastRow) {
                rows.push(alwaysLastRow);
            }
        }
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

        // Vertical virtual scrolling
        const rowHeight = DataGridRow.defaultHeight;
        const rowsPerPage = Math.ceil(target.offsetHeight / rowHeight);
        const rowCursor = Math.floor(target.scrollTop / rowHeight);
        this.renderRows(
            rowCursor - 5,
            rowCursor + rowsPerPage + 5
        );
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
