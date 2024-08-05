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

import type DataTable from '../Data/DataTable';

import AST from '../Core/Renderer/HTML/AST.js';
import Column from './Column';
import Row from './Row';
import F from '../Core/Templating.js';

const { format } = F;


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

        this.column = column;
        this.row = row;
        this.row.registerCell(this);

        this.htmlElement = this.init();
    }


    /* *
    *
    *  Methods
    *
    * */

    /**
     * Init element
     */
    public init(): HTMLTableCellElement {
        return document.createElement('td', {});
    }
    /**
     * Renders the cell.
     */
    public render(): void {
        this.row.htmlElement.appendChild(this.htmlElement);
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
    public renderHTMLCellContent(
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
        this.column.unregisterCell(this);
        this.row.unregisterCell(this);
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
