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
import Row from '../Row';
import Utils from '../../Core/Utilities.js';

const { defined, fireEvent } = Utils;


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
    constructor(column: Column, row: Row) {
        super(column, row);

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
     * Unsets the hover state of the cell and its row and column.
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
    public setValue(value: DataTable.CellType, updateTable: boolean): void {
        const element = this.htmlElement;

        this.value = value;

        if (!defined(value)) {
            value = '';
        }

        this.renderHTMLCellContent(
            this.formatCell(value, this),
            element
        );

        if (updateTable) {
            const vp = this.row.viewport;
            vp.dataTable.setCell(
                this.column.id,
                this.row.index,
                this.value
            );
        }
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

}


/* *
 *
 *  Default Export
 *
 * */

export default TableCell;
