/* *
 *
 *  Grid Table Viewport class
 *
 *  (c) 2020-2025 Highsoft AS
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

import type TableRow from './Body/TableRow';

import GridUtils from '../GridUtils.js';
import Utils from '../../../Core/Utilities.js';
import DataTable from '../../../Data/DataTable.js';
import ColumnDistribution from './ColumnDistribution/ColumnDistribution.js';
import ColumnDistributionStrategy from './ColumnDistribution/ColumnDistributionStrategy.js';
import Column from './Column.js';
import TableHeader from './Header/TableHeader.js';
import Grid from '../Grid.js';
import RowsVirtualizer from './Actions/RowsVirtualizer.js';
import ColumnsResizer from './Actions/ColumnsResizer.js';
import Globals from '../Globals.js';
import Defaults from '../Defaults.js';

const { makeHTMLElement } = GridUtils;
const {
    fireEvent,
    getStyle,
    defined
} = Utils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a table viewport of the data grid.
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
    public readonly grid: Grid;

    /**
     * The presentation version of the data table. It has applied modifiers
     * and is ready to be rendered.
     *
     * If you want to modify the data table, you should use the original
     * instance that is stored in the `grid.dataTable` property.
     */
    public dataTable: DataTable;

    /**
     * The HTML element of the table head.
     */
    public readonly theadElement?: HTMLElement;

    /**
     * The HTML element of the table body.
     */
    public readonly tbodyElement: HTMLElement;

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
     * @internal
     */
    public resizeObserver: ResizeObserver;

    /**
     * The rows virtualizer instance that handles the rows rendering &
     * dimensioning logic.
     * @internal
     */
    public rowsVirtualizer: RowsVirtualizer;

    /**
     * The column distribution.
     */
    public readonly columnDistribution: ColumnDistributionStrategy;

    /**
     * The columns resizer instance that handles the columns resizing logic.
     * @internal
     */
    public columnsResizer?: ColumnsResizer;

    /**
     * The width of each row in the table. Each of the rows has the same width.
     * Only for the `fixed` column distribution.
     * @internal
     */
    public rowsWidth?: number;

    /**
     * The focus cursor position: [rowIndex, columnIndex] or `undefined` if the
     * table cell is not focused.
     */
    public focusCursor?: [number, number];

    /**
     * The flag that indicates if the table rows are virtualized.
     */
    public virtualRows: boolean;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a new data grid table.
     *
     * @param grid
     * The data grid instance which the table (viewport) belongs to.
     *
     * @param tableElement
     * The HTML table element of the data grid.
     */
    constructor(
        grid: Grid,
        tableElement: HTMLTableElement
    ) {
        this.grid = grid;
        this.dataTable = this.grid.presentationTable as DataTable;

        const dgOptions = grid.options;
        const customClassName = dgOptions?.rendering?.table?.className;

        this.columnDistribution = ColumnDistribution.initStrategy(this);
        this.virtualRows = !!dgOptions?.rendering?.rows?.virtualization;

        if (dgOptions?.rendering?.header?.enabled) {
            this.theadElement = makeHTMLElement('thead', {}, tableElement);
        }
        this.tbodyElement = makeHTMLElement('tbody', {}, tableElement);
        if (this.virtualRows) {
            tableElement.classList.add(
                Globals.getClassName('virtualization')
            );
        }

        if (!(
            dgOptions?.rendering?.columns?.resizing?.enabled === false ||
            dgOptions?.columnDefaults?.resizing === false
        )) {
            this.columnsResizer = new ColumnsResizer(this);
        }

        if (customClassName) {
            tableElement.classList.add(...customClassName.split(/\s+/g));
        }
        tableElement.classList.add(Globals.getClassName('scrollableContent'));

        // Load columns
        this.loadColumns();

        // Virtualization
        this.rowsVirtualizer = new RowsVirtualizer(this);

        // Init Table
        this.init();

        // Add event listeners
        this.resizeObserver = new ResizeObserver(this.onResize);
        this.resizeObserver.observe(tableElement);

        this.tbodyElement.addEventListener('scroll', this.onScroll);
        this.tbodyElement.addEventListener('focus', this.onTBodyFocus);
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
        fireEvent(this, 'beforeInit');

        this.setTbodyMinHeight();

        // Load & render head
        if (this.grid.options?.rendering?.header?.enabled) {
            this.header = new TableHeader(this);
            this.header.render();
        }

        // TODO: Load & render footer
        // this.footer = new TableFooter(this);
        // this.footer.render();

        this.rowsVirtualizer.initialRender();
        fireEvent(this, 'afterInit');
    }

    /**
     * Sets the minimum height of the table body.
     */
    private setTbodyMinHeight(): void {
        const { options } = this.grid;
        const minVisibleRows = options?.rendering?.rows?.minVisibleRows;

        const tbody = this.tbodyElement;
        if (
            defined(minVisibleRows) &&
            !getStyle(tbody, 'min-height', true)
        ) {
            tbody.style.minHeight = (
                minVisibleRows * this.rowsVirtualizer.defaultRowHeight
            ) + 'px';
        }
    }

    /**
     * Loads the columns of the table.
     */
    private loadColumns(): void {
        const { enabledColumns } = this.grid;
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

        this.columnDistribution.loadColumns();
    }

    /**
     * Fires an empty update to properly load the virtualization, only if
     * there's a row count compared to the threshold change detected (due to
     * performance reasons).
     */
    private updateVirtualization(): void {
        const rows = this.grid.options?.rendering?.rows;
        const threshold = Number(
            rows?.virtualizationThreshold ||
            Defaults.defaultOptions.rendering?.rows?.virtualizationThreshold
        );
        const rowCount = Number(this.dataTable?.rowCount);

        if (rows?.virtualization !== (rowCount >= threshold)) {
            void this.grid.update();
        }
    }

    /**
     * Loads the modified data from the data table and renders the rows.
     */
    public loadPresentationData(): void {
        this.dataTable = this.grid.presentationTable as DataTable;

        for (const column of this.columns) {
            column.loadData();
        }

        this.updateVirtualization();
        this.rowsVirtualizer.rerender();
    }

    /**
     * Reflows the table's content dimensions.
     */
    public reflow(): void {
        this.columnDistribution.reflow();

        // Reflow the head
        this.header?.reflow();

        // Reflow rows content dimensions
        this.rowsVirtualizer.reflowRows();
    }

    /**
     * Handles the focus event on the table body.
     *
     * @param e
     * The focus event.
     */
    private onTBodyFocus = (e: FocusEvent): void => {
        e.preventDefault();

        this.rows[this.rowsVirtualizer.rowCursor - this.rows[0].index]
            ?.cells[0]?.htmlElement.focus();
    };

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
        if (this.virtualRows) {
            this.rowsVirtualizer.scroll();
        }

        this.header?.scrollHorizontally(this.tbodyElement.scrollLeft);
    };

    /**
     * Scrolls the table to the specified row.
     *
     * @param index
     * The index of the row to scroll to.
     *
     * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-lite/basic/scroll-to-row | Scroll to row}
     */
    public scrollToRow(index: number): void {
        if (this.grid.options?.rendering?.rows?.virtualization) {
            this.tbodyElement.scrollTop =
                index * this.rowsVirtualizer.defaultRowHeight;
            return;
        }

        const rowClass = '.' + Globals.getClassName('rowElement');
        const firstRowTop = this.tbodyElement
            .querySelectorAll(rowClass)[0]
            .getBoundingClientRect().top;

        this.tbodyElement.scrollTop = (
            this.tbodyElement
                .querySelectorAll(rowClass)[index]
                .getBoundingClientRect().top
        ) - firstRowTop;
    }

    /**
     * Get the widthRatio value from the width in pixels. The widthRatio is
     * calculated based on the width of the viewport.
     *
     * @param width
     * The width in pixels.
     *
     * @return The width ratio.
     *
     * @internal
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
     *
     * @internal
     */
    public getWidthFromRatio(ratio: number): number {
        return this.tbodyElement.clientWidth * ratio;
    }

    /**
     * Destroys the grid table.
     */
    public destroy(): void {
        this.tbodyElement.removeEventListener('focus', this.onTBodyFocus);
        this.tbodyElement.removeEventListener('scroll', this.onScroll);
        this.resizeObserver.disconnect();
        this.columnsResizer?.removeEventListeners();

        for (let i = 0, iEnd = this.rows.length; i < iEnd; ++i) {
            this.rows[i].destroy();
        }

        fireEvent(this, 'afterDestroy');
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
            focusCursor: this.focusCursor
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

        if (meta.focusCursor) {
            const [rowIndex, columnIndex] = meta.focusCursor;
            const row = this.rows[rowIndex - this.rows[0].index];
            row?.cells[columnIndex]?.htmlElement.focus();
        }
    }

    /**
     * Returns the column with the provided ID.
     *
     * @param id
     * The ID of the column.
     */
    public getColumn(id: string): Column | undefined {
        const columns = this.grid.enabledColumns;

        if (!columns) {
            return;
        }
        const columnIndex = columns.indexOf(id);
        if (columnIndex < 0) {
            return;
        }

        return this.columns[columnIndex];
    }

    /**
     * Returns the row with the provided ID.
     *
     * @param id
     * The ID of the row.
     */
    public getRow(id: number): TableRow | undefined {
        // TODO: Change `find` to a method using `vp.dataTable.getLocalRowIndex`
        // and rows[presentationRowIndex - firstRowIndex]. Needs more testing,
        // but it should be faster.
        return this.rows.find((row): boolean => row.id === id);
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
        columnDistribution: ColumnDistributionStrategy;
        focusCursor?: [number, number];
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Table;
