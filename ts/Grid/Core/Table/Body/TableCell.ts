/* *
 *
 *  Grid class
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

import type DataTable from '../../../../Data/DataTable';
import type Column from '../Column';
import type TableRow from './TableRow';

import Cell from '../Cell.js';
import CellContent from '../CellContent/CellContent.js';

import Utils from '../../../../Core/Utilities.js';
const {
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
    public override render(): void {
        super.render();

        // It may happen that `await` will be needed here in the future.
        void this.setValue();
    }

    public override initEvents(): void {
        this.cellEvents.push(['dblclick', (e): void => (
            this.onDblClick(e as MouseEvent)
        )]);
        this.cellEvents.push(['mouseout', (): void => this.onMouseOut()]);
        this.cellEvents.push(['mouseover', (): void => this.onMouseOver()]);
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

    /**
     * Handles the mouse over event on the cell.
     * @internal
     */
    protected onMouseOver(): void {
        const { grid } = this.row.viewport;
        grid.hoverRow(this.row.index);
        grid.hoverColumn(this.column.id);

        fireEvent(this, 'mouseOver', {
            target: this
        });
    }

    /**
     * Handles the mouse out event on the cell.
     */
    protected onMouseOut(): void {
        const { grid } = this.row.viewport;
        grid.hoverRow();
        grid.hoverColumn();

        fireEvent(this, 'mouseOut', {
            target: this
        });
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
     * Sets the value & updating content of the cell.
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
        value: DataTable.CellType = this.column.data?.[this.row.index],
        updateTable: boolean = false
    ): Promise<void> {
        this.value = value;

        const vp = this.column.viewport;

        if (this.content) {
            this.content.update();
        } else {
            this.content = this.column.createCellContent(this);
        }

        this.htmlElement.setAttribute('data-value', this.value + '');
        this.setCustomClassName(this.column.options.cells?.className);

        fireEvent(this, 'afterRender', { target: this });

        if (!updateTable) {
            return;
        }

        const { dataTable: originalDataTable } = vp.grid;

        // Taken the local row index of the original grid data table, but
        // in the future it should affect the globally original data table.
        // (To be done after the DataLayer refinement)
        const rowTableIndex =
            this.row.id && originalDataTable?.getLocalRowIndex(this.row.id);

        if (!originalDataTable || rowTableIndex === void 0) {
            return;
        }

        this.row.data[this.column.id] = this.value;
        originalDataTable.setCell(
            this.column.id,
            rowTableIndex,
            this.value
        );

        if (vp.grid.querying.willNotModify()) {
            // If the data table does not need to be modified, skip the
            // data modification and don't update the whole table. It checks
            // if the modifiers are globally set. Can be changed in the future
            // to check if the modifiers are set for the specific columns.
            return;
        }

        let focusedRowId: number | undefined;
        if (vp.focusCursor) {
            focusedRowId = vp.dataTable.getOriginalRowIndex(vp.focusCursor[0]);
        }

        await vp.grid.querying.proceed(true);
        vp.loadPresentationData();

        if (focusedRowId !== void 0 && vp.focusCursor) {
            const newRowIndex = vp.dataTable.getLocalRowIndex(focusedRowId);
            if (newRowIndex !== void 0) {
                vp.rows[newRowIndex - vp.rows[0].index]
                    ?.cells[vp.focusCursor[1]].htmlElement.focus();
            }
        }
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
 *  Class Namespace
 *
 * */

namespace TableCell {
    /**
     * Event interface for table cell events.
     */
    export interface TableCellEvent {
        target: TableCell;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default TableCell;
