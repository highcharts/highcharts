/* *
 *
 *  Grid TableRow class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type DataTable from '../../../../Data/DataTable';

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
     * The row values from the data table in the original column order.
     */
    public data: DataTable.RowObject = {};

    /**
     * The local index of the row in the presentation data table.
     */
    public index: number;

    /**
     * The index of the row in the original data table (ID).
     */
    public id?: number;

    /**
     * The vertical translation of the row.
     */
    public translateY: number = 0;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a row in the data grid.
     *
     * @param viewport
     * The Grid Table instance which the row belongs to.
     *
     * @param index
     * The index of the row in the data table.
     */
    constructor(viewport: Table, index: number) {
        super(viewport);
        this.index = index;
        this.id = viewport.dataTable.getOriginalRowIndex(index);

        this.loadData();
        this.setRowAttributes();
    }

    /* *
    *
    *  Methods
    *
    * */

    public override createCell(column: Column): Cell {
        return new TableCell(this, column);
    }

    /**
     * Loads the row data from the data table.
     */
    private loadData(): void {
        const data = this.viewport.dataTable.getRowObject(this.index);
        if (!data) {
            return;
        }

        this.data = data;
    }

    /**
     * Updates the row data and its cells with the latest values from the data
     * table.
     */
    public update(): void {
        this.id = this.viewport.dataTable.getOriginalRowIndex(this.index);
        this.updateRowAttributes();

        this.loadData();

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            const cell = this.cells[i] as TableCell;
            void cell.setValue();
        }

        this.reflow();
    }

    /**
     * Reuses the row instance for a new index.
     *
     * @param index
     * The index of the row in the data table.
     *
     * @param doReflow
     * Whether to reflow the row after updating the cells.
     */
    public reuse(index: number, doReflow: boolean = true): void {
        if (this.index === index) {
            this.update();
            return;
        }

        this.index = index;
        this.id = this.viewport.dataTable.getOriginalRowIndex(index);

        this.htmlElement.setAttribute('data-row-index', index);
        this.updateRowAttributes();
        this.updateParityClass();
        this.updateStateClasses();

        this.loadData();

        for (let i = 0, iEnd = this.cells.length; i < iEnd; ++i) {
            const cell = this.cells[i] as TableCell;
            void cell.setValue();
        }

        if (doReflow) {
            this.reflow();
        }
    }

    /**
     * Adds or removes the hovered CSS class to the row element.
     *
     * @param hovered
     * Whether the row should be hovered.
     */
    public setHoveredState(hovered: boolean): void {
        this.htmlElement.classList[hovered ? 'add' : 'remove'](
            Globals.getClassName('hoveredRow')
        );

        if (hovered) {
            this.viewport.grid.hoveredRowIndex = this.index;
        }
    }

    /**
     * Adds or removes the synced CSS class to the row element.
     *
     * @param synced
     * Whether the row should be synced.
     */
    public setSyncedState(synced: boolean): void {
        this.htmlElement.classList[synced ? 'add' : 'remove'](
            Globals.getClassName('syncedRow')
        );

        if (synced) {
            this.viewport.grid.syncedRowIndex = this.index;
        }
    }

    /**
     * Sets the row HTML element attributes and additional classes.
     */
    public setRowAttributes(): void {
        const idx = this.index;
        const el = this.htmlElement;

        el.classList.add(Globals.getClassName('rowElement'));

        // Index of the row in the presentation data table
        el.setAttribute('data-row-index', idx);

        this.updateRowAttributes();

        // Indexing from 0, so rows with even index are odd.
        this.updateParityClass();
        this.updateStateClasses();
    }

    /**
     * Sets the row HTML element attributes that are updateable in the row
     * lifecycle.
     */
    public updateRowAttributes(): void {
        const vp = this.viewport;
        const a11y = vp.grid.accessibility;
        const idx = this.index;
        const el = this.htmlElement;

        // Index of the row in the original data table (ID)
        if (this.id !== void 0) {
            el.setAttribute('data-row-id', this.id);
        }

        // Calculate levels of header, 1 to avoid indexing from 0
        a11y?.setRowIndex(el, idx + (vp.header?.rows.length ?? 0) + 1);
    }

    /**
     * Updates the row parity class based on index.
     */
    private updateParityClass(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('rowEven'),
            Globals.getClassName('rowOdd')
        );

        // Indexing from 0, so rows with even index are odd.
        el.classList.add(
            Globals.getClassName(this.index % 2 ? 'rowEven' : 'rowOdd')
        );
    }

    /**
     * Updates the hovered and synced classes based on grid state.
     */
    private updateStateClasses(): void {
        const el = this.htmlElement;
        el.classList.remove(
            Globals.getClassName('hoveredRow'),
            Globals.getClassName('syncedRow')
        );

        if (this.viewport.grid.hoveredRowIndex === this.index) {
            el.classList.add(Globals.getClassName('hoveredRow'));
        }

        if (this.viewport.grid.syncedRowIndex === this.index) {
            el.classList.add(Globals.getClassName('syncedRow'));
        }
    }

    /**
     * Sets the vertical translation of the row. Used for virtual scrolling.
     *
     * @param value
     * The vertical translation of the row.
     */
    public setTranslateY(value: number): void {
        this.translateY = value;
        this.htmlElement.style.transform = `translateY(${value}px)`;
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
 *  Default Export
 *
 * */

export default TableRow;
