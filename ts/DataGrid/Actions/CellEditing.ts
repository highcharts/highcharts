/* *
 *
 *  Data Grid Cell Editing class.
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

import DataGridCell from '../DataGridCell.js';
import Globals from '../Globals.js';
import DGUtils from '../Utils.js';

const { makeHTMLElement } = DGUtils;


/* *
 *
 *  Class
 *
 * */

/**
 * The class that handles the manual editing of cells in the data grid.
 */
class CellEditing {

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The cell being currently edited.
     */
    public editedCell?: DataGridCell;

    /**
     * Input element for the cell.
     */
    private inputElement?: HTMLInputElement;


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Turns the cell into an editable input field.
     *
     * @param cell
     * The cell that is to be edited.
     */
    public startEditing(cell: DataGridCell): void {
        if (this.editedCell === cell) {
            return;
        }

        if (this.editedCell) {
            this.stopEditing();
        }

        this.editedCell = cell;
        const cellElement = cell.htmlElement;

        cellElement.innerHTML = '';
        cellElement.classList.add(Globals.classNames.focusedCell);

        this.renderInput();
    }

    /**
     * Stops the editing of the cell.
     *
     * @param submit
     * Whether to save the value of the input to the cell. Defaults to true.
     */
    public stopEditing(submit = true): void {
        const cell = this.editedCell;
        const input = this.inputElement;
        if (!cell || !input) {
            return;
        }

        let newValue: string | number = input.value;
        this.destroyInput();
        cell.htmlElement.classList.remove(Globals.classNames.focusedCell);

        // Convert to number if possible
        if (!isNaN(+newValue)) {
            newValue = +newValue;
        }

        cell.setContent(submit ? newValue : cell.value);
        delete this.editedCell;
    }

    private onInputBlur = (): void => {
        this.stopEditing();
    };

    private onInputKeyDown = (e: KeyboardEvent): void => {
        const { keyCode } = e;

        // Enter / Escape
        if (keyCode === 13 || keyCode === 27) {
            // Cancel editing on escape
            this.stopEditing(keyCode === 13);
        }
    };

    private renderInput(): void {
        const cell = this.editedCell;
        if (!cell) {
            return;
        }

        const cellEl = cell.htmlElement;
        const input = this.inputElement = makeHTMLElement('input', {}, cellEl);

        input.value = '' + cell.value;
        input.focus();

        input.addEventListener('blur', this.onInputBlur);
        input.addEventListener('keydown', this.onInputKeyDown);
    }

    private destroyInput(): void {
        const input = this.inputElement;
        if (!input) {
            return;
        }

        input.removeEventListener('keydown', this.onInputKeyDown);
        input.removeEventListener('blur', this.onInputBlur);

        input.remove();
        delete this.inputElement;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default CellEditing;
