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

import type DataTable from '../Data/DataTable';

import Cell from './Cell.js';
import AST from '../Core/Renderer/HTML/AST.js';
import Column from './Column';
import Row from './Row';
import F from '../Core/Templating.js';
import Utils from '../Core/Utilities.js';

const { format } = F;
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
     * Handle the formatting content of the cell.
     *
     * @param value
     * The value of cell
     *
     * @param ctx
     * The context of the cell
     *
     * @internal
     */
    public formatCell(
        value: string | number | boolean,
        ctx: Cell
    ): string {
        const {
            cellFormat,
            cellFormatter
        } = ctx.column.userOptions;

        let cellContent = '';

        if (cellFormatter) {
            cellContent = cellFormatter.call(this);
        } else {
            cellContent = (
                cellFormat ? format(cellFormat, ctx) : value + ''
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

}


/* *
 *
 *  Default Export
 *
 * */

export default TableCell;
