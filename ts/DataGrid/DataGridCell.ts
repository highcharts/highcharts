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
import DataGridColumn from './DataGridColumn';
import DataGridRow from './DataGridRow';
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
class DataGridCell {

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
    public column: DataGridColumn;

    /**
     * The row of the cell.
     */
    public row: DataGridRow;

    /**
     * The raw value of the cell.
     */
    public value: DataTable.CellType;

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
    constructor(column: DataGridColumn, row: DataGridRow) {
        this.htmlElement = document.createElement('td');

        this.column = column;
        this.column.registerCell(this);

        this.row = row;
        this.row.registerCell(this);

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

        const cellContent = this.formatCell(value, this);

        if (this.column.userOptions.useHTML) {
            this.renderHTMLCellContent(cellContent, element);
        } else {
            element.innerText = cellContent;
        }

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
     * When useHTML enabled, parse the syntax and render HTML.
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
     * Sets the hover state of the cell and its row and column.
     */
    private readonly onMouseOver = (): void => {
        const { dataGrid } = this.row.viewport;
        dataGrid.hoverRow(this.row.index);
        dataGrid.hoverColumn(this.column.id);
        dataGrid.options?.events?.cell.mouseOver?.call(this);
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
        dataGrid.options?.events?.cell.mouseOut?.call(this);
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

        dataGrid.options?.events?.cell.click?.call(this);
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
        ctx: DataGridCell
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
        this.htmlElement.remove();
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridCell {
    /**
     * Event interface for cell events.
     */
    export interface CellEvent {
        target: DataGridCell;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridCell;
