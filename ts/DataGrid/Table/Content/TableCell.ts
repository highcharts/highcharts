/* *
 *
 *  DataGrid class
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

import type DataTable from '../../../Data/DataTable';

import Cell from '../Cell.js';
import Column from '../Column';
import TableRow from './TableRow';
import Utils from '../../../Core/Utilities.js';
import DGUtils from '../../Utils.js';

const { defined, fireEvent } = Utils;
const { isHTML } = DGUtils;


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
    public row: TableRow;


    /* *
    *
    *  Constructor
    *
    * */

    /**
     * Constructs a cell in the data grid.
     *
     * @param column
     * The column of the cell.
     *
     * @param row
     * The row of the cell.
     */
    constructor(column: Column, row: TableRow) {
        super(column, row);
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
        void this.setValue(this.column.data?.[this.row.index], false);
    }

    public override initEvents(): void {
        this.cellEvents.push(['dblclick', (e): void => {
            this.onDblClick(e as MouseEvent);
        }]);
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
     */
    protected onMouseDown(e: MouseEvent): void {
        const { dataGrid } = this.row.viewport;

        if (e.target === this.htmlElement) {
            this.htmlElement.focus();
        }

        fireEvent(dataGrid, 'cellMouseDown', {
            target: this
        });
    }

    /**
     * Handles the mouse over event on the cell.
     */
    protected onMouseOver(): void {
        const { dataGrid } = this.row.viewport;
        dataGrid.hoverRow(this.row.index);
        dataGrid.hoverColumn(this.column.id);
        dataGrid.options?.events?.cell?.mouseOver?.call(this);
        fireEvent(dataGrid, 'cellMouseOver', {
            target: this
        });
    }

    /**
     * Handles the mouse out event on the cell.
     */
    protected onMouseOut(): void {
        const { dataGrid } = this.row.viewport;
        dataGrid.hoverRow();
        dataGrid.hoverColumn();
        dataGrid.options?.events?.cell?.mouseOut?.call(this);
        fireEvent(dataGrid, 'cellMouseOut', {
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
        const vp = this.row.viewport;
        const { dataGrid } = vp;

        if (this.column.options.cells?.editable) {
            e.preventDefault();
            vp.cellEditing.startEditing(this);
        }

        dataGrid.options?.events?.cell?.dblClick?.call(this);
        fireEvent(dataGrid, 'cellDblClick', {
            target: this
        });
    }

    protected override onClick(): void {
        const vp = this.row.viewport;
        const { dataGrid } = vp;

        dataGrid.options?.events?.cell?.click?.call(this);
        fireEvent(dataGrid, 'cellClick', {
            target: this
        });
    }

    protected override onKeyDown(e: KeyboardEvent): void {
        if (e.target !== this.htmlElement) {
            return;
        }

        if (e.key === 'Enter') {
            if (this.column.options.cells?.editable) {
                this.row.viewport.cellEditing.startEditing(this);
            }

            return;
        }

        super.onKeyDown(e);
    }

    /**
     * Sets the value & updating content of the cell.
     *
     * @param value
     * The raw value to set.
     *
     * @param updateTable
     * Whether to update the table after setting the content.
     */
    public async setValue(
        value: DataTable.CellType,
        updateTable: boolean
    ): Promise<void> {
        this.value = value;

        const vp = this.column.viewport;
        const element = this.htmlElement;
        const cellContent = this.formatCell();

        if (isHTML(cellContent)) {
            this.renderHTMLCellContent(
                cellContent,
                element
            );
        } else {
            element.innerText = cellContent;
        }

        this.htmlElement.setAttribute('data-value', this.value + '');
        this.setCustomClassName(this.column.options.cells?.className);

        if (this.column.options.cells?.editable) {
            vp.dataGrid.accessibility?.addEditableCellHint(this.htmlElement);
        }

        vp.dataGrid.options?.events?.cell?.afterSetValue?.call(this);

        if (!updateTable) {
            return;
        }

        const { dataTable: originalDataTable } = vp.dataGrid;

        // Taken the local row index of the original datagrid data table, but
        // in the future it should affect the globally original data table.
        // (To be done after the DataLayer refinement)
        const rowTableIndex =
            this.row.id && originalDataTable?.getLocalRowIndex(this.row.id);

        if (!originalDataTable || rowTableIndex === void 0) {
            return;
        }

        originalDataTable.setCell(
            this.column.id,
            rowTableIndex,
            this.value
        );

        if (vp.dataGrid.querying.willNotModify()) {
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

        await vp.dataGrid.querying.proceed(true);
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
     * Handle the formatting content of the cell.
     */
    private formatCell(): string {
        const options = this.column.options.cells || {};
        const { format, formatter } = options;

        let value = this.value;
        if (!defined(value)) {
            value = '';
        }

        let cellContent = '';

        if (formatter) {
            cellContent = formatter.call(this).toString();
        } else {
            cellContent = (
                format ? this.format(format) : value + ''
            );
        }

        return cellContent;
    }

    /**
     * Destroys the cell.
     */
    public destroy(): void {
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
