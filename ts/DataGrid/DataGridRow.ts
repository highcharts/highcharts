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

import DataGridCell from './DataGridCell.js';
import DataGridTable from './DataGridTable.js';
import Globals from './Globals.js';
import DGUtils from './Utils.js';

const { makeHTMLElement } = DGUtils;

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class DataGridRow {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The cells of the row.
     */
    public cells: DataGridCell[] = [];

    /**
     * The HTML element of the row.
     */
    public htmlElement: HTMLTableRowElement;

    /**
     * The index of the row in the data table.
     */
    public index: number;

    /**
     * The viewport the row belongs to.
     */
    public viewport: DataGridTable;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param viewport
     * The Data Grid Table instance which the row belongs to.
     *
     * @param index
     * The index of the row in the data table.
     */
    constructor(viewport: DataGridTable, index: number) {
        this.viewport = viewport;
        this.index = index;

        this.htmlElement = makeHTMLElement('tr', {
            className: Globals.classNames.rowElement,
            style: {
                transform: `translateY(${this.getDefaultTopOffset()}px)`
            }
        });
        this.setRowAttributes();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the row's content. It does not attach the row element to the
     * viewport nor pushes the rows to the viewport.rows array.
     */
    public render(): void {
        const columns = this.viewport.columns;

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            const cell = new DataGridCell(columns[i], this);
            cell.render();
        }

        this.reflow();
    }

    /**
     * Reflows the row's content dimensions.
     */
    public reflow(): void {
        for (let j = 0, jEnd = this.cells.length; j < jEnd; ++j) {
            this.cells[j].reflow();
        }

        const vp = this.viewport;
        if (vp.rowsWidth) {
            this.htmlElement.style.width = vp.rowsWidth + 'px';
        }
    }

    /**
     * Destroys the row.
     */
    public destroy(): void {
        if (!this.htmlElement) {
            return;
        }

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            this.cells[i].destroy();
        }

        this.htmlElement.remove();
    }

    /**
     * Registers a cell in the row.
     *
     * @param cell
     * The cell to register.
     */
    public registerCell(cell: DataGridCell): void {
        this.cells.push(cell);
    }

    /**
     * Adds or removes the hovered CSS class to the row element.
     *
     * @param hovered
     * Whether the row should be hovered.
     */
    public setHoveredState(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.classNames.hoveredRow
        );

        if (hovered) {
            this.viewport.dataGrid.hoveredRowIndex = this.index;
        }
    }

    /**
     * Returns the default top offset of the row (before adjusting row heights).
     */
    public getDefaultTopOffset(): number {
        return this.index * this.viewport.rowsVirtualizer.defaultRowHeight;
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    private setRowAttributes(): void {
        const idx = this.index;
        const el = this.htmlElement;

        el.setAttribute('data-row-index', idx);

        // 1 - index of the head, 1 to avoid indexing from 0
        el.setAttribute('aria-rowindex', idx + 2);

        if (idx % 2 === 1) {
            el.classList.add(Globals.classNames.rowOdd);
        }

        if (this.viewport.dataGrid.hoveredRowIndex === idx) {
            el.classList.add(Globals.classNames.hoveredRow);
        }
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridRow;
