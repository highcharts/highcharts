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

const { makeHTMLElement } = DataGridUtils;
const { format } = F;


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

    // /**
    //  * The input element of a cell after mouse focus.
    //  * @internal
    //  */
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

        this.htmlElement.addEventListener('mouseenter', this.onMouseEnter);
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
            cellFormat,
            cellFormatter,
            useHTML,
            editable
        } = this.column.userOptions;
        const cell = this;
        const element = cell.htmlElement;

        let cellContent = '';

        this.value = this.column.data[this.row.index];

        if (cellFormatter) {
            cellContent = cellFormatter.call({
                value: this.value
            });
        } else {
            cellContent = (
                    cellFormat ?
                        format(cellFormat, this) :
                        this.value + ''
                );
        }

        if (editable) {
            element.addEventListener('click', (): void => {
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
    private readonly onMouseEnter = (): void => {
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
     * @param cellEl
     * The clicked cell.
     *
     */
    private onCellClick(cellElement: HTMLElement, value: string): void {
        console.log('cell: ', cellElement);
        // if (this.isColumnEditable(columnName)) {
            let input = cellElement.querySelector('input');
            // const cellValue = cellElement.getAttribute('data-original-data');

            if (!input) {
                this.removeCellInputElement();

                // Replace cell contents with an input element
                cellElement.innerHTML = '';

                // create an input
                input = this.cellInputEl =
                    makeHTMLElement('input', {}, cellElement);
                input.style.height = (cellElement.clientHeight - 1) + 'px';
                cellElement.classList.add(Globals.classNames.focusedCell);
                input.focus();
                input.value = value || '';

                this.column.viewport.editedCell = this;

            }
        //     // Emit for use in extensions
        //     this.emit({ type: 'cellClick', input });
        // }

    }

    /**
     * Remove the <input> overlay and update the cell value
     * @internal
     */
    private removeCellInputElement(): void {
        const editedCell = this.column.viewport.editedCell;

        if (!editedCell) {
            return;
        }

        const parentNode = editedCell.cellInputEl.parentNode;
        let cellValue = editedCell.value;

        editedCell.cellInputEl.remove();
        delete this.column.viewport.editedCell;

        parentNode.classList.remove(Globals.classNames.focusedCell);
        parentNode.innerHTML = cellValue;
    }

    /**
     * Destroys the cell.
     */
    public destroy(): void {
        this.htmlElement.removeEventListener('mouseenter', this.onMouseEnter);
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
