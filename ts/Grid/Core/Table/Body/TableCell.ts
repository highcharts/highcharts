/* *
 *
 *  Grid class
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

import type DataTable from '../../../../Data/DataTable';
import type Column from '../Column';
import type TableRow from './TableRow';

import Globals from '../../Globals.js';
import Cell from '../Cell.js';
import CellContent from '../CellContent/CellContent.js';

import Utils from '../../../../Core/Utilities.js';
const {
    defined,
    fireEvent
} = Utils;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a cell in the data grid.
 */
class TableCell extends Cell {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The row of the cell.
     */
    public readonly row: TableRow;

    /**
     * The column of the cell.
     */
    public override column: Column;

    /**
     * The cell's content.
     */
    public content?: CellContent;

    /**
     * A token used to prevent stale async responses from overwriting cell
     * data. In virtualized grids, cells are reused as rows scroll in/out of
     * view. If a cell starts an async value fetch for row A, then gets reused
     * for row B before the fetch completes, the stale response for row A
     * could incorrectly overwrite row B's data. This token is incremented
     * before each async fetch, and checked when the fetch completes - if the
     * token has changed, the response is discarded as stale.
     */
    private asyncFetchToken: number = 0;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid.
     *
     * @param row
     * The row of the cell.
     *
     * @param column
     * The column of the cell.
     */
    constructor(row: TableRow, column: Column) {
        super(row, column);

        this.column = column;
        this.row = row;

        this.column.registerCell(this);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the cell by appending it to the row and setting its value.
     */
    public override async render(): Promise<void> {
        await super.render();
        await this.setValue();
    }

    /**
     * Edits the cell value and updates the data table. Call this instead of
     * `setValue` when you want it to trigger the cell value user change event.
     *
     * @param value
     * The new value to set.
     */
    public async editValue(value: DataTable.CellType): Promise<void> {
        if (this.value === value) {
            return;
        }

        fireEvent(this, 'beforeEditValue');
        await this.setValue(value, true);
        fireEvent(this, 'afterEditValue');
    }

    /**
     * Sets the cell value and updates its content with it.
     *
     * @param value
     * The raw value to set. If not provided, it will use the value from the
     * data table for the current row and column.
     *
     * @param updateTable
     * Whether to update the table after setting the content. Defaults to
     * `false`, meaning the table will not be updated.
     */
    public async setValue(
        value?: DataTable.CellType,
        updateTable: boolean = false
    ): Promise<void> {
        const fetchToken = ++this.asyncFetchToken;

        // TODO: Find a better way to show the cell value being updated.
        this.htmlElement.style.opacity = '0.1';

        if (!defined(value)) {
            value = await this.column.viewport.grid.dataProvider?.getValue(
                this.column.id,
                this.row.index
            );

            // Discard stale response if cell was reused for a different row
            if (fetchToken !== this.asyncFetchToken) {
                this.htmlElement.style.opacity = '';
                return;
            }
        }

        this.value = value;

        if (updateTable && await this.updateDataTable()) {
            return;
        }

        if (this.content) {
            this.content.update();
        } else {
            this.content = this.column.createCellContent(this);
        }

        this.htmlElement.setAttribute('data-value', this.value + '');

        // Set alignment in column cells based on column data type
        this.htmlElement.classList[
            this.column.dataType === 'number' ? 'add' : 'remove'
        ](Globals.getClassName('rightAlign'));

        // Add custom class name from column options
        this.setCustomClassName(this.column.options.cells?.className);

        // TODO: Remove this after the first part was implemented.
        this.htmlElement.style.opacity = '';

        fireEvent(this, 'afterRender', { target: this });
    }

    /**
     * Updates the the data table so that it reflects the current state of
     * the grid.
     *
     * @returns
     * A promise that resolves to `true` if the cell triggered all the whole
     * viewport rows to be updated, or `false` if the only change should be
     * the cell's content.
     */
    private async updateDataTable(): Promise<boolean> {
        const oldValue = await this.column.viewport.grid.dataProvider?.getValue(
            this.column.id,
            this.row.index
        );

        if (oldValue === this.value) {
            // Abort if the value is the same as in the data table.
            return false;
        }

        const vp = this.column.viewport;
        const { dataProvider: dp } = vp.grid;

        const rowId = this.row.id && await dp?.getRowIndex(this.row.id);

        if (!dp || rowId === void 0) {
            return false;
        }

        this.row.data[this.column.id] = this.value;
        await dp.setValue(
            this.value,
            this.column.id,
            rowId
        );

        // If no modifiers, don't update all rows
        // TODO: Handle this differently
        // if (vp.grid.dataTable === vp.grid.presentationTable) {
        //     return false;
        // }

        await vp.updateRows();
        return true;
    }

    public override initEvents(): void {
        this.cellEvents.push(['dblclick', (e): void => (
            this.onDblClick(e as MouseEvent)
        )]);
        this.cellEvents.push(['mousedown', (e): void => {
            this.onMouseDown(e as MouseEvent);
        }]);

        super.initEvents();
    }

    /**
     * Handles the focus event on the cell.
     */
    protected override onFocus(): void {
        super.onFocus();

        const vp = this.row.viewport;

        vp.focusCursor = [
            this.row.index,
            this.column.index
        ];
    }

    /**
     * Handles the mouse down event on the cell.
     *
     * @param e
     * The mouse event object.
     *
     * @internal
     */
    protected onMouseDown(e: MouseEvent): void {
        if (e.target === this.htmlElement) {
            this.htmlElement.focus();
        }

        fireEvent(this, 'mouseDown', {
            target: this,
            originalEvent: e
        });
    }

    public override onMouseOver(): void {
        this.row.viewport.grid.hoverRow(this.row.index);
        super.onMouseOver();
    }

    public override onMouseOut(): void {
        this.row.viewport.grid.hoverRow();
        super.onMouseOut();
    }

    /**
     * Handles the double click event on the cell.
     *
     * @param e
     * The mouse event object.
     */
    protected onDblClick(e: MouseEvent): void {
        fireEvent(this, 'dblClick', {
            target: this,
            originalEvent: e
        });
    }

    public override onClick(): void {
        fireEvent(this, 'click', {
            target: this
        });
    }

    /**
     * Handles the key down event on the cell.
     *
     * @param e
     * Keyboard event object.
     *
     * @internal
     */
    public override onKeyDown(e: KeyboardEvent): void {
        if (e.target !== this.htmlElement) {
            return;
        }

        fireEvent(this, 'keyDown', {
            target: this,
            originalEvent: e
        });

        super.onKeyDown(e);
    }

    /**
     * Destroys the cell.
     */
    public destroy(): void {
        this.content?.destroy();
        delete this.content;

        super.destroy();
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * Event interface for table cell events.
 */
export interface TableCellEvent {
    target: TableCell;
}


/* *
 *
 *  Default Export
 *
 * */

export default TableCell;
