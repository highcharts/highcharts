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

import AST from '../Core/Renderer/HTML/AST.js';
import Column from './Column';
import Row from './Row';
import F from '../Core/Templating.js';
import Utils from '../Core/Utilities.js';

const { format } = F;
const { defined, fireEvent } = Utils;


/* *
 *
 *  Abstract Class of Cell
 *
 * */
abstract class Cell {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The HTML element of the cell.
     */
    public htmlElement: HTMLTableCellElement;

    /**
     * The column of the cell.
     */
    public column: Column;

    /**
     * The row of the cell.
     */
    public row: Row;

    /**
     * The raw value of the cell.
     */
    public value: DataTable.CellType;


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
        this.htmlElement = document.createElement('td');

        this.column = column;
        this.column.registerCell(this);

        this.row = row;
        this.row.registerCell(this);

        // this.htmlElement.addEventListener('mouseover', this.onMouseOver);
        // this.htmlElement.addEventListener('mouseout', this.onMouseOut);
        // this.htmlElement.addEventListener('click', this.onClick);
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
        if (!this.column.data) {
            return;
        }

        this.setValue(this.column.data[this.row.index], false);
        this.row.htmlElement.appendChild(this.htmlElement);
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
     * Reflows the cell dimensions.
     */
    public reflow(): void {
        const column = this.column;
        const elementStyle = this.htmlElement.style;

        elementStyle.width = elementStyle.maxWidth = column.getWidth() + 'px';
    }

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
     * Renders content of cell.
     *
     * @param cellContent
     * Content to render.
     *
     * @param parentElement
     * Parent element where the content should be.
     *
     */
    private renderHTMLCellContent(
        cellContent: string,
        parentElement: HTMLElement
    ): void {
        const formattedNodes = new AST(cellContent);
        formattedNodes.addToDOM(parentElement);
    }

    /**
     * Destroys the cell.
     */
    public destroy(): void {
        this.htmlElement.remove();
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace Cell {
    /**
     * Event interface for cell events.
     */
    export interface CellEvent {
        target: Cell;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default Cell;
