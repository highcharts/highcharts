/* *
 *
 *  Data Grid class
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataGridOptions from './DataGridOptions';
import DataTable from '../Data/DataTable.js';
import DataGridUtils from './DataGridUtils.js';
const {
    dataTableCellToString,
    makeDiv
} = DataGridUtils;
import H from '../Core/Globals.js';
const {
    doc
} = H;
import U from '../Core/Utilities.js';
const {
    merge
} = U;


/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        let DataGrid: DataGridClass;
    }
}
type DataGridClass = typeof DataGrid;


/* *
 *
 *  Class
 *
 * */

class DataGrid {

    /* *
     *
     *  Static Properties
     *
     * */

    private static defaultOptions: DataGridOptions = {
        // nothing here yet
    };

    public static cellHeight = 20; // TODO: Make dynamic, and add style options

    /* *
     *
     *  Properties
     *
     * */

    public container: HTMLElement;
    public options: DataGridOptions;
    public dataTable: DataTable;

    private rowElements: Array<HTMLElement>;
    private outerContainer: HTMLElement;
    private scrollContainer: HTMLElement;
    private innerContainer: HTMLElement;
    private cellInputEl?: HTMLInputElement;


    /* *
     *
     *  Functions
     *
     * */

    constructor(container: (string|HTMLElement), options: DeepPartial<DataGridOptions>) {
        // Initialize containers
        if (typeof container === 'string') {
            const existingContainer = doc.getElementById(container);
            if (existingContainer) {
                this.container = existingContainer;
            } else {
                this.container = makeDiv('hc-dg-container', container);
            }
        } else {
            this.container = container;
        }
        this.outerContainer = makeDiv('hc-dg-outer-container');
        this.scrollContainer = makeDiv('hc-dg-scroll-container');
        this.innerContainer = makeDiv('hc-dg-inner-container');
        this.scrollContainer.appendChild(this.innerContainer);
        this.outerContainer.appendChild(this.scrollContainer);
        this.container.appendChild(this.outerContainer);

        // Init options
        this.options = merge(DataGrid.defaultOptions, options);

        // Init data table
        this.dataTable = this.initDataTable();

        this.rowElements = [];
        this.render();
    }


    public getRowCount(): number {
        return this.dataTable.getRowCount();
    }


    // ---------------- Private methods


    /**
     * Get a reference to the underlying DataTable from options, or create one
     * if needed.
     * @return {DataTable}
     */
    private initDataTable(): DataTable {
        if (this.options.dataTable) {
            return this.options.dataTable;
        }
        if (this.options.json) {
            return DataTable.fromJSON(this.options.json);
        }
        return new DataTable();
    }


    /**
     * Render the data grid. To be called on first render, as well as when
     * options change, or the underlying data changes.
     */
    private render(): void {
        this.emptyContainer();
        this.updateScrollingLength();
        this.applyContainerStyles();
        this.renderInitialRows();
        this.addEvents();
    }


    /**
     * Remove the rendered row elements.
     */
    private emptyContainer(): void {
        const container = this.innerContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }


    /**
     * Apply CSS.
     */
    private applyContainerStyles(): void {
        // TODO: Use stylesheets.
        this.outerContainer.style.cssText =
            'width: 100%;' +
            'height: 100%;' +
            'overflow: scroll;' +
            'position: relative;';
        this.scrollContainer.style.cssText =
            'height: 1000px;' +
            'z-index: 1;' +
            'position: relative;';
        this.innerContainer.style.cssText =
            'display: flex;' +
            'flex-direction: column;' +
            'width: 100%;' +
            'min-height: 20px;' +
            'position: fixed;' +
            'z-index: -1;';
    }


    /**
     * Add internal event listeners to the grid.
     */
    private addEvents(): void {
        this.outerContainer.addEventListener('scroll', (e): void => this.onScroll(e));
        document.addEventListener('click', (e): void => this.onDocumentClick(e));
    }


    /**
     * Handle user scrolling the grid
     * @param {Event} e Event object
     */
    private onScroll(e: Event): void {
        e.preventDefault();
        window.requestAnimationFrame((): void => {
            const columnsInPresentationOrder = this.dataTable.getColumnNames();
            let i = Math.floor(this.outerContainer.scrollTop / DataGrid.cellHeight) || 0;

            for (const tableRow of this.rowElements) {
                const dataTableRow = this.dataTable.getRow(i, columnsInPresentationOrder);
                if (dataTableRow) {
                    const cellElements = tableRow.querySelectorAll('div');
                    dataTableRow.forEach((columnValue: DataTable.CellType, j: number): void => {
                        const cell = cellElements[j];
                        cell.textContent = dataTableCellToString(columnValue);
                    });
                }
                i++;
            }
        });
    }


    /**
     * Handle the user starting interaction with a cell.
     * @param {HTMLElement} cellEl The clicked cell.
     */
    private onCellClick(cellEl: HTMLElement): void {
        let input = cellEl.querySelector('input');
        const cellValue = cellEl.textContent;

        if (!input) {
            this.removeCellInputElement();

            // Replace cell contents with an input element
            cellEl.textContent = '';
            input = this.cellInputEl = document.createElement('input');
            input.style.width = '60px';
            cellEl.appendChild(input);
            input.focus();
            input.value = cellValue || '';
        }
    }


    /**
     * Handle the user clicking somewhere outside the grid.
     * @param {MouseEvent} e Event object.
     */
    private onDocumentClick(e: MouseEvent): void {
        if (this.cellInputEl && e.target) {
            const cellEl = this.cellInputEl.parentNode;
            const isClickInInput = cellEl && cellEl.contains(e.target as Node);
            if (!isClickInInput) {
                this.removeCellInputElement();
            }
        }
    }


    /**
     * Remove the <input> overlay and update the cell value
     */
    private removeCellInputElement(): void {
        const cellInputEl = this.cellInputEl;
        if (cellInputEl) {
            // TODO: This needs to modify DataTable. The change in DataTable
            // should cause a re-render?
            if (cellInputEl.parentNode) {
                cellInputEl.parentNode.textContent = cellInputEl.value;
            }
            cellInputEl.remove();
            delete this.cellInputEl;
        }
    }


    private updateScrollingLength(): void {
        const height = (this.getRowCount() + 1) * DataGrid.cellHeight;
        this.scrollContainer.style.height = height + 'px';
    }


    private getNumRowsToDraw(): number {
        return Math.min(
            this.getRowCount() + 1,
            Math.floor(this.outerContainer.clientHeight / DataGrid.cellHeight)
        );
    }


    /**
     * Render a data cell.
     * @param {HTMLElement} parentRow The parent row to add the cell to.
     * @param {DataTable.CellType} cellValue The value to add in the data cell.
     */
    private renderCell(parentRow: HTMLElement, cellValue: DataTable.CellType): void {
        const cellEl = makeDiv('hc-dg-cell');
        cellEl.style.cssText = 'border: 1px solid black;' +
            'overflow: hidden;' +
            'padding: 0 10px;' +
            'z-index: -1;';

        cellEl.textContent = dataTableCellToString(cellValue);

        cellEl.addEventListener('click', (): void => this.onCellClick(cellEl));
        parentRow.appendChild(cellEl);
    }


    /**
     * Render a row of data.
     * @param {DataTable.Row} row The row data to render. The data should be in presentation order.
     */
    private renderRow(row: DataTable.Row): void {
        const rowEl = makeDiv('hc-dg-row');
        rowEl.style.cssText = 'display: flex;' +
            'background-color: white;' +
            'max-height: 20px;' +
            'z-index: -1;';

        row.forEach(this.renderCell.bind(this, rowEl));

        this.innerContainer.appendChild(rowEl);
        this.rowElements.push(rowEl);
    }


    /**
     * Render initial rows before the user starts scrolling
     */
    private renderInitialRows(): void {
        this.rowElements = [];
        const rowsToDraw = this.getNumRowsToDraw();
        const columnsInPresentationOrder = this.dataTable.getColumnNames();
        const rowData = this.dataTable.getRows(0, rowsToDraw, columnsInPresentationOrder);

        rowData.forEach(this.renderRow.bind(this));
    }
}

H.DataGrid = DataGrid;

export default DataGrid;
