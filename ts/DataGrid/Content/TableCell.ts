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

import type DataTable from '../../Data/DataTable';
import Cell from '../Cell.js';
import Column from '../Column';
import TableRow from './TableRow';
import Utils from '../../Core/Utilities.js';
import F from '../../Core/Templating.js';

const { defined, fireEvent } = Utils;
const { format } = F;


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

    /**
     * The input element of a cell after mouse focus.
     * @internal
     */
    public cellInputEl?: HTMLInputElement;


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

        this.htmlElement.addEventListener('mouseover', this.onMouseOver);
        this.htmlElement.addEventListener('mouseout', this.onMouseOut);
        this.htmlElement.addEventListener('click', this.onClick);
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Renders the cell.
     */
    public render(): void {
        super.render();
        this.setValue(this.column.data?.[this.row.index], false);
    }

    /**
     * Sets the hover state of the cell and its row and column.
     */
    private readonly onMouseOver = (): void => {
        const { dataGrid } = this.row.viewport;
        dataGrid.hoverRow(this.row.index);
        dataGrid.hoverColumn(this.column.id);
        dataGrid.options?.events?.cell?.mouseOver?.call(this);
        fireEvent(dataGrid, 'cellMouseOver', {
            target: this
        });
    };

    /**
     * Unset the hover state of the cell and its row and column.
     */
    private readonly onMouseOut = (): void => {
        const { dataGrid } = this.row.viewport;
        dataGrid.hoverRow();
        dataGrid.hoverColumn();
        dataGrid.options?.events?.cell?.mouseOut?.call(this);
        fireEvent(dataGrid, 'cellMouseOut', {
            target: this
        });
    };

    /**
     * Handles the user clicking on a cell.
     */
    private readonly onClick = (): void => {
        const vp = this.row.viewport;
        const { dataGrid } = vp;

        if (this.column.options.editable) {
            vp.cellEditing.startEditing(this);
        }

        dataGrid.options?.events?.cell?.click?.call(this);
        fireEvent(dataGrid, 'cellClick', {
            target: this
        });
    };

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
        const element = this.htmlElement;
        const isHTML = value?.toString().indexOf('<') === -1;

        this.value = value;

        if (isHTML) {
            this.renderHTMLCellContent(
                this.formatCell(),
                element
            );
        } else {
            element.innerText = this.formatCell();
        }

        if (!updateTable) {
            return;
        }

        const vp = this.column.viewport;
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

        await vp.dataGrid.querying.proceed(true);
        vp.loadPresentationData();
    }

    /**
     * Handle the formatting content of the cell.
     */
    private formatCell(): string {
        const {
            cellFormat,
            cellFormatter
        } = this.column.userOptions;

        let value = this.value;
        if (!defined(value)) {
            value = '';
        }

        let cellContent = '';

        if (cellFormatter) {
            cellContent = cellFormatter.call(this);
        } else {
            cellContent = (
                cellFormat ? format(cellFormat, this) : value + ''
            );
        }

        return cellContent;
    }

    /**
     * Destroys the cell.
     */
    public destroy(): void {
        this.htmlElement.removeEventListener('mouseover', this.onMouseOver);
        this.htmlElement.removeEventListener('mouseout', this.onMouseOut);
        this.htmlElement.removeEventListener('click', this.onClick);
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
