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

import type DataTable from '../../Data/DataTable';

import AST from '../../Core/Renderer/HTML/AST.js';
import DataGridColumn from './DataGridColumn';
import DataGridRow from './DataGridRow';
import F from '../../Core/Templating.js';
import Globals from './Globals.js';
import DataGridUtils from './Utils.js';
import Utils from '../../Core/Utilities.js';

const { makeHTMLElement } = DataGridUtils;
const { format } = F;
const { fireEvent } = Utils;


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

        const {
            useHTML,
            editable
        } = this.column.userOptions;
        const cell = this;
        const element = cell.htmlElement;

        let cellContent = '';

        this.value = this.column.data[this.row.index];

        if (this.value) {
            cellContent = this.formatCell(this.value, this);
        }

        if (editable) {
            element.addEventListener('click', (): void => {
                const element = this.htmlElement;
                this.onCellClick(element, this.value + '');
            });
        }

        if (useHTML) {
            this.renderHTMLCellContent(cellContent, element);
        } else {
            element.innerText = cellContent;
        }

        this.row.htmlElement.appendChild(element);
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
        this.row.setHover(true);
        this.column.setHover(true);
    };

    /**
     * Unsets the hover state of the cell and its row and column.
     */
    private readonly onMouseOut = (): void => {
        this.row.setHover(false);
        this.column.setHover(false);
    };

    /**
     * Handle the user starting interaction with a cell.
     *
     * @internal
     *
     * @param cellElement
     * The clicked cell's HTML element.
     *
     * @param value
     * The value of cell
     *
     */
    private onCellClick(cellElement: HTMLElement, value: string): void {
        const cell = this;

        // Check input to avoid creating,
        // when setting the coursor.
        if (cell.cellInputEl) {
            return;
        }

        this.removeCellInputElement();

        // Replace cell contents with an input element
        cellElement.innerHTML = '';
        cellElement.classList.add(Globals.classNames.focusedCell);

        this.column.viewport.editedCell = cell;
        const input = this.cellInputEl =
            makeHTMLElement('input', {}, cellElement);
        input.style.height = (cellElement.clientHeight - 1) + 'px';
        input.value = value || '';
        input.focus();
        input.addEventListener('keydown', (e: any): void => {
            // Enter / Escape
            if (e.keyCode === 13 || e.keyCode === 27) {
                cell.removeCellInputElement();
            }
        });

        // Emit for use in extensions
        fireEvent(input, 'cellClick');
    }

    /**
     * Remove the <input> overlay and update the cell value
     * @internal
     */
    public removeCellInputElement(): void {
        const editedCell = this.column.viewport.editedCell;
        const parentNode = editedCell?.cellInputEl?.parentNode;

        if (!editedCell || !parentNode) {
            return;
        }
        const cellValue = (
            editedCell.cellInputEl?.value || editedCell.value
        ) as string;

        if (editedCell.column.id && editedCell.row.index > -1 && editedCell) {
            editedCell.column.viewport.dataTable.setCell(
                editedCell.column.id,
                editedCell.row.index,
                cellValue
            );

            editedCell.value = cellValue;
        }

        editedCell.cellInputEl?.remove();
        parentNode.classList.remove(Globals.classNames.focusedCell);
        parentNode.innerHTML = this.formatCell(cellValue, editedCell);

        delete editedCell.cellInputEl;
        delete this.column.viewport.editedCell;

        fireEvent(parentNode, 'cellUpdated');
    }

    /**
     * Handle the formatting content of the cell.
     *
     * @internal
     *
     * @param value
     * The value of cell
     *
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
            cellContent = cellFormatter.call({
                value: value
            });
        } else {
            cellContent = (
                cellFormat ? format(cellFormat, { value: value }) : value + ''
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
        this.htmlElement.remove();
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridCell {

}


/* *
 *
 *  Default Export
 *
 * */

export default DataGridCell;
