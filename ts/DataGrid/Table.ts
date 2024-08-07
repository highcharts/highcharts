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
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { ColumnDistribution } from './Options';
import type TableCell from './Content/TableCell';

import DGUtils from './Utils.js';
import DataTable from '../Data/DataTable.js';
import Column from './Column.js';
import TableHeader from './Header/TableHeader.js';
import DataGrid from './DataGrid.js';
import RowsVirtualizer from './Actions/RowsVirtualizer.js';
import ColumnsResizer from './Actions/ColumnsResizer.js';
import Globals from './Globals.js';
import Utils from '../Core/Utilities.js';
import CellEditing from './Actions/CellEditing.js';
import TableRow from './Content/TableRow';

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
class Table {

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
    public header?: TableHeader;

    /**
     * The visible columns of the table.
     */
    public columns: Column[] = [];

    /**
     * The visible rows of the table.
     */
    public rows: TableRow[] = [];

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
    public columnsResizer?: ColumnsResizer;

    /**
     * The width of each row in the table. Each of the rows has the same width.
     * Only for the `fixed` column distribution.
     */
    public rowsWidth?: number;

    /**
     * The caption of the data grid.
     */
    public captionElement?: HTMLElement;

    /**
     * The input element of a cell after mouse focus.
     * @internal
     */
    public editedCell?: TableCell;

    /**
     * The cell editing instance that handles the manual editing of cells in
     * the data grid.
     */
    public cellEditing: CellEditing;


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
     * @param tableElement
     * The HTML table element of the data grid.
     */
    constructor(
        dataGrid: DataGrid,
        tableElement: HTMLTableElement
    ) {
        this.dataGrid = dataGrid;
        this.dataTable = this.dataGrid.dataTable as DataTable;

        const dgOptions = dataGrid.options;

        this.columnDistribution =
            dgOptions?.settings?.columns?.distribution as ColumnDistribution;

        this.renderCaption();

        this.theadElement = makeHTMLElement('thead', {}, tableElement);
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);

        this.rowsVirtualizer = new RowsVirtualizer(this);
        if (dgOptions?.settings?.columns?.resizable) {
            this.columnsResizer = new ColumnsResizer(this);
        }

        this.cellEditing = new CellEditing();

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
        this.header = new TableHeader(this);
        this.header.render();

        // TODO: Load & render footer
        // this.footer = new TableFooter(this);
        // this.footer.render();

        this.rowsVirtualizer.initialRender();

        // Refresh element dimensions after initial rendering
        this.reflow();
    }

    /**
     * Loads the columns of the table.
     */
    private loadColumns(): void {
        const { enabledColumns } = this.dataGrid;
        if (!enabledColumns) {
            return;
        }

        let columnId: string;
        for (let i = 0, iEnd = enabledColumns.length; i < iEnd; ++i) {
            columnId = enabledColumns[i];
            this.columns.push(
                new Column(this, columnId, i)
            );
        }
    }

    /**
     * Reflows the table's content dimensions.
     */
    public reflow(): void {
        const tableEl = this.dataGrid.tableElement;
        const borderWidth = tableEl ? (
            (getStyle(tableEl, 'border-top-width', true) || 0) +
            (getStyle(tableEl, 'border-bottom-width', true) || 0)
        ) : 0;

        this.tbodyElement.style.height = this.tbodyElement.style.minHeight = `${
            (this.dataGrid.container?.clientHeight || 0) -
            this.theadElement.offsetHeight -
            (this.captionElement?.offsetHeight || 0) -
            borderWidth
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
        if (this.header) {
            this.header.reflow();
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
        this.header?.scrollHorizontally(this.tbodyElement.scrollLeft);
    };

    /**
     * Scrolls the table to the specified row.
     *
     * @param index
     * The index of the row to scroll to.
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
     * The width in pixels.
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
     * The width ratio.
     *
     * @returns The width in pixels.
     */
    public getWidthFromRatio(ratio: number): number {
        return this.tbodyElement.clientWidth * ratio;
    }

    /**
     * Render caption above the datagrid
     */
    public renderCaption(): void {
        const captionOptions = this.dataGrid.options?.settings?.caption;
        if (!captionOptions?.text) {
            return;
        }

        this.captionElement = makeHTMLElement('caption', {
            innerText: captionOptions.text,
            className: Globals.classNames.captionElement
        }, this.dataGrid.tableElement);

        if (captionOptions.className) {
            this.captionElement.classList.add(captionOptions.className);
        }
    }

    /**
     * Destroys the data grid table.
     */
    public destroy(): void {
        this.tbodyElement.removeEventListener('scroll', this.onScroll);
        this.resizeObserver.disconnect();
        this.columnsResizer?.removeEventListeners();
        this.columns.forEach((column): void => {
            column.columnSorting?.removeEventListeners();
        });
        this.header?.removeHeaderEventListeners();

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].destroy();
        }
    }

    /**
     * Get the viewport state metadata. It is used to save the state of the
     * viewport and restore it when the data grid is re-rendered.
     *
     * @returns
     * The viewport state metadata.
     */
    public getStateMeta(): Table.ViewportStateMetadata {
        return {
            scrollTop: this.tbodyElement.scrollTop,
            scrollLeft: this.tbodyElement.scrollLeft,
            columnDistribution: this.columnDistribution,
            columnWidths: this.columns.map((column): number => column.width)
        };
    }

    /**
     * Apply the metadata to the viewport state. It is used to restore the state
     * of the viewport when the data grid is re-rendered.
     *
     * @param meta
     * The viewport state metadata.
     */
    public applyStateMeta(
        meta: Table.ViewportStateMetadata
    ): void {
        this.tbodyElement.scrollTop = meta.scrollTop;
        this.tbodyElement.scrollLeft = meta.scrollLeft;

        if (
            this.columnDistribution === meta.columnDistribution &&
            this.columns.length === meta.columnWidths.length
        ) {
            const widths = meta.columnWidths;
            for (let i = 0, iEnd = widths.length; i < iEnd; ++i) {
                this.columns[i].width = widths[i];
            }
            this.reflow();
        }
    }
}

namespace Table {

    /**
     * Represents the metadata of the viewport state. It is used to save the
     * state of the viewport and restore it when the data grid is re-rendered.
     */
    export interface ViewportStateMetadata {
        scrollTop: number;
        scrollLeft: number;
        columnDistribution: ColumnDistribution;
        columnWidths: number[];
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Table;
