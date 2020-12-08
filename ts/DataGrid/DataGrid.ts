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
    private outerContainer: HTMLElement;
    private scrollContainer: HTMLElement;
    private innerContainer: HTMLElement;

    public options: DataGridOptions;

    public dataTable: DataTable;

    /* *
     *
     *  Functions
     *
     * */

    constructor(container: (string|HTMLElement), options: DeepPartial<DataGridOptions>) {
        // Initialize containers
        if (typeof container === 'string') {
            container = doc.getElementById(container) || makeDiv('hc-dg-container');
        }
        this.container = container;
        this.outerContainer = makeDiv('hc-dg-outer-container');
        this.scrollContainer = makeDiv('hc-dg-scroll-container');
        this.innerContainer = makeDiv('hc-dg-inner-container');
        this.scrollContainer.appendChild(this.innerContainer);
        this.outerContainer.appendChild(this.scrollContainer);
        this.container.appendChild(this.outerContainer);

        // Init options
        this.options = merge(DataGrid.defaultOptions, options);

        // Init data table
        this.dataTable = this.getDataTableFromOptions();

        this.render();
    }


    public getRowCount(): number {
        return this.dataTable.getRowCount();
    }


    public getColumnCount(): number {
        // TBD.
        return 5;
    }


    private getDataTableFromOptions(): DataTable {
        if (this.options.dataTable) {
            return this.options.dataTable;
        }
        if (this.options.json) {
            return DataTable.fromJSON({
                $class: 'DataTable',
                rows: this.options.json
            });
        }
        return new DataTable();
    }


    private render(): void {
        this.emptyContainer();
        this.updateScrollingLength();
        this.applyContainerStyles();
        this.renderInitialRows();
    }


    private emptyContainer(): void {
        const container = this.innerContainer;
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }


    private applyContainerStyles(): void {
        this.outerContainer.style.cssText =
            'width: 100%;' +
            'height: 100%;' +
            'overflow: scroll;' +
            'position: relative;';
        this.scrollContainer.style.cssText =
            'height: 1000px;' +
            'z-index: 1;' +
            'position: relative;';
        const numColumns = this.getColumnCount();
        this.innerContainer.style.cssText =
            'display: grid;' +
            `grid-template-columns: repeat(${numColumns}, 1fr);` +
            'width: 100%;' +
            'min-height: 20px;' +
            'position: fixed;' +
            'z-index: -1;';
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


    private renderInitialRows(): void {
        const rowsToDraw = this.getNumRowsToDraw();
        let i = 0;
        while (i < rowsToDraw) {
            const rowEl = makeDiv('hc-dg-row');
            rowEl.style.cssText = 'background-color: white; width: 150px; max-height: 20px; z-index: -1;';

            const dataTableRow = this.dataTable.getRow(i);
            if (dataTableRow) {
                const row = (Object as any).values(dataTableRow.getAllCells());

                row.forEach((columnValue: string): void => {
                    const cellEl = makeDiv('hc-dg-cell');
                    cellEl.style.cssText = 'border: 1px solid black; overflow: hidden; z-index: -1;';
                    cellEl.textContent = columnValue;
                    rowEl.appendChild(cellEl);
                });
            }

            this.innerContainer.appendChild(rowEl);
            i++;
        }
    }
}

H.DataGrid = DataGrid;

export default DataGrid;
