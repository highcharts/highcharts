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

import type Cell from '../Cell';
import TableCell from './TableCell.js';
import Row from '../Row.js';
import Table from '../Table.js';
import Globals from '../Globals.js';

/* *
 *
 *  Class
 *
 * */

/**
 * Represents a row in the data grid.
 */
class TableRow extends Row {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The cells of the row.
     */
    public cells: Cell[] = [];

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
    constructor(viewport: Table, index: number) {
        super(viewport, index);
        this.htmlElement.style.transform =
            `translateY(${this.getDefaultTopOffset()}px)`;

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
        this.htmlElement.classList.add(Globals.classNames.rowElement);

        for (let i = 0, iEnd = columns.length; i < iEnd; i++) {
            const cell = new TableCell(columns[i], this);
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
    public registerCell(cell: Cell): void {
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
     * Sets the row HTML element attributes and additional classes.
     */
    private setRowAttributes(): void {
        const idx = this.index;
        const el = this.htmlElement;

        el.setAttribute('data-row-index', idx);

        // 1 - index of the head, 1 to avoid indexing from 0
        el.setAttribute('aria-rowindex', idx + 2);

        if (idx % 2 === 1) {
            el.classList.add(Globals.classNames.odd);
        }

        if (this.viewport.dataGrid.hoveredRowIndex === idx) {
            el.classList.add(Globals.classNames.hoveredRow);
        }
    }

    /**
     * Returns the default top offset of the row (before adjusting row heights).
     */
    public getDefaultTopOffset(): number {
        return this.index * this.viewport.rowsVirtualizer.defaultRowHeight;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace TableRow {

}


/* *
 *
 *  Default Export
 *
 * */

export default TableRow;
