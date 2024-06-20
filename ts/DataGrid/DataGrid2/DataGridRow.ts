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
     * Whether the row is destroyed.
     */
    public destroyed: boolean = false;

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

        this.htmlElement.setAttribute('data-row-index', index);

        // 1 - index of the head, 1 to avoid indexing from 0
        this.htmlElement.setAttribute('aria-rowindex', index + 2);

        if (index % 2 === 1) {
            this.htmlElement.classList.add(Globals.classNames.odd);
        }
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
        this.destroyed = true;
    }

    /**
     * Registers a cell in the row.
     */
    public registerCell(cell: DataGridCell): void {
        this.cells.push(cell);
    }

    /**
     * Sets the row hover state.
     *
     * @param hovered Whether the row should be hovered.
     */
    public setHover(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.classNames.hoveredRow
        );
    }

    /**
     * Returns the default top offset of the row (before adjusting row heights).
     */
    public getDefaultTopOffset(): number {
        return this.index * this.viewport.rowsVirtualizer.defaultRowHeight;
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

namespace DataGridRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridRow;
