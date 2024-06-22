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

import type { ColumnDistribution } from './DataGridOptions';

import DGUtils from './Utils.js';
import DataTable from '../../Data/DataTable.js';
import DataGridRow from './DataGridRow.js';
import DataGridColumn from './DataGridColumn.js';
import DataGridTableHead from './DataGridTableHead.js';
import DataGrid from './DataGrid.js';
import RowsVirtualizer from './Actions/RowsVirtualizer.js';
import ColumnsResizer from './Actions/ColumnsResizer.js';
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
     * The rows virtualizer instance that handles the rows rendering &
     * dimensioning logic.
     */
    public rowsVirtualizer: RowsVirtualizer;

    /**
     * The column distribution.
     */
    public readonly columnDistribution: ColumnDistribution;

    /**
     * The columns resizer instance that handles the columns resizing logic.
     */
    public columnsResizer: ColumnsResizer;

    /**
     * The width of each row in the table. Each of the rows has the same width.
     * Only for the `fixed` column distribution.
     */
    public rowsWidth?: number;

    /**
     * The list of IDs of columns displayed enabled in the data grid.
     */
    public readonly enabledColumns: string[];

    /**
     * Title of data grid
     */
    public titleElement?: HTMLElement;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid table.
     *
     * @param dataGrid
     * The data grid instance which the table (viewport) belongs to.
     *
     * @param dataTable
     * The data source of the data grid.
     *
     * @param tableElement
     * The HTML table element of the data grid.
     */
    constructor(
        dataGrid: DataGrid,
        dataTable: DataTable,
        tableElement: HTMLTableElement
    ) {
        this.dataGrid = dataGrid;
        this.dataTable = dataTable;

        const dgOptions = dataGrid.options;

        this.columnDistribution =
            dgOptions.settings?.columnDistribution as ColumnDistribution;

        this.enabledColumns = this.getEnabledColumnsIDs();

        this.renderTitle();

        this.theadElement = makeHTMLElement('thead', {}, tableElement);
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);

        this.rowsVirtualizer = new RowsVirtualizer(this);
        this.columnsResizer = new ColumnsResizer(this);

        this.init();

        // Add event listeners
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(tableElement);
        this.tbodyElement.addEventListener('scroll', this.onScroll);
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
        // Load columns
        this.loadColumns();

        // Load & render head
        this.head = new DataGridTableHead(this);
        this.head.render();

        if (this.enabledColumns.length > 0) {
            this.rowsVirtualizer.initialRender();
        } else {
            this.renderNoResultRow();
        }

        // Refresh element dimensions after initial rendering
        this.reflow();
    }

    /**
     * Loads the columns of the table.
     */
    private loadColumns(): void {
        let columnId: string;
        for (let i = 0, iEnd = this.enabledColumns.length; i < iEnd; ++i) {
            columnId = this.enabledColumns[i];
            this.columns.push(
                new DataGridColumn(this, columnId, i)
            );
        }
    }

    /**
     * Reflows the table's content dimensions.
     */
    public reflow(): void {

        this.tbodyElement.style.height = this.tbodyElement.style.minHeight = `${
            this.dataGrid.container.clientHeight -
            this.theadElement.offsetHeight -
            (this.titleElement?.offsetHeight || 0)
        }px`;

        // Get the width of the rows.
        if (this.columnDistribution === 'fixed') {
            let rowsWidth = 0;
            for (let i = 0, iEnd = this.columns.length; i < iEnd; ++i) {
                rowsWidth += this.columns[i].width;
            }
            this.rowsWidth = rowsWidth;
        }

        // Reflow the head
        if (this.head) {
            this.head.reflow();
        }

        // Reflow rows content dimensions
        this.rowsVirtualizer.reflowRows();
    }

    /**
     * Handles the resize event.
     */
    private onResize = (): void => {
        this.reflow();
    };

    /**
     * Handles the scroll event.
     */
    private onScroll = (): void => {
        this.rowsVirtualizer.scroll();
        this.head?.scrollHorizontally(this.tbodyElement.scrollLeft);
    };

    /**
     * Scrolls the table to the specified row.
     *
     * @param index The index of the row to scroll to.
     */
    public scrollToRow(index: number): void {
        this.tbodyElement.scrollTop =
            index * this.rowsVirtualizer.defaultRowHeight;
    }

    /**
     * Get the widthRatio value from the width in pixels. The widthRatio is
     * calculated based on the width of the viewport.
     *
     * @param width
     *        The width in pixels.
     *
     * @return The width ratio.
     */
    public getRatioFromWidth(width: number): number {
        return width / this.tbodyElement.clientWidth;
    }

    /**
     * Get the width in pixels from the widthRatio value. The width is
     * calculated based on the width of the viewport.
     *
     * @param ratio
     *       The width ratio.
     *
     * @returns The width in pixels.
     */
    public getWidthFromRatio(ratio: number): number {
        return this.tbodyElement.clientWidth * ratio;
    }

    /**
     * Renders the no result row.
     */
    private renderNoResultRow(): void {
        const row = makeHTMLElement('tr', {
            className: Globals.classNames.rowElement
        }, this.tbodyElement);

        const cell = makeHTMLElement('td', {
            className: Globals.classNames.noResultColumn
        }, row);

        cell.innerHTML = 'No data';
    }

    /**
     * Render title above the datagrid
     */
    public renderTitle(): void {
        if (!this.dataGrid.options.title) {
            return;
        }

        this.titleElement = makeHTMLElement('caption', {
            innerText: this.dataGrid.options.title.text,
            className: Globals.classNames.titleElement
        }, this.dataGrid.tableElement);
    }

    /**
     * Destroys the data grid table.
     */
    public destroy(): void {
        this.tbodyElement.removeEventListener('scroll', this.onScroll);
        this.resizeObserver.disconnect();
        this.columnsResizer.removeEventListeners();

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].destroy();
        }
    }

    private getEnabledColumnsIDs(): string[] {
        const columnsOptions = this.dataGrid.options.columns;
        const columnsIncluded =
            this.dataGrid.options.columnsIncluded ??
            this.dataTable.getColumnNames();

        let columnName: string;
        const result: string[] = [];
        for (let i = 0, iEnd = columnsIncluded.length; i < iEnd; ++i) {
            columnName = columnsIncluded[i];
            if (columnsOptions?.[columnName]?.enabled !== false) {
                result.push(columnName);
            }
        }

        return result;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridTable;
