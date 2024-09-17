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
import type Column from '../Column';

import Row from '../Row.js';
import Table from '../Table.js';
import TableCell from './TableCell.js';
import Globals from '../../Globals.js';

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
     * The local index of the row in the presentation data table.
     */
    public index: number;

    /**
     * The index of the row in the original data table (ID).
     */
    public id?: number;


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
        super(viewport);
        this.index = index;
        this.id = viewport.dataTable.getOriginalRowIndex(index);
        this.setRowAttributes();
    }

    /* *
    *
    *  Methods
    *
    * */

    public override createCell(column: Column): Cell {
        return new TableCell(column, this);
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
    public setRowAttributes(): void {
        const idx = this.index;
        const el = this.htmlElement;

        el.style.transform = `translateY(${this.getDefaultTopOffset()}px)`;
        el.classList.add(Globals.classNames.rowElement);

        // Index of the row in the presentation data table
        el.setAttribute('data-row-index', idx);

        // Index of the row in the original data table (ID)
        if (this.id !== void 0) {
            el.setAttribute('data-row-id', this.id);
        }

        // Calculate levels of header, 1 to avoid indexing from 0
        el.setAttribute(
            'aria-rowindex',
            idx + (this.viewport.header?.levels ?? 1) + 1
        );

        if (idx % 2 === 1) {
            el.classList.add(Globals.classNames.rowOdd);
        }

        if (this.viewport.dataGrid.hoveredRowIndex === idx) {
            el.classList.add(Globals.classNames.hoveredRow);
        }
    }

    /**
     * Returns the default top offset of the row (before adjusting row heights).
     * @internal
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
