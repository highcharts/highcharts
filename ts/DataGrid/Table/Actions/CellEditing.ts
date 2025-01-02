/* *
 *
 *  DataGrid Cell Editing class.
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

import TableCell from '../Content/TableCell.js';
import Globals from '../../Globals.js';
import DGUtils from '../../Utils.js';

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
    public editedCell?: TableCell;

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
    public startEditing(cell: TableCell): void {
        if (this.editedCell === cell) {
            return;
        }

        if (this.editedCell) {
            this.stopEditing();
        }

        this.editedCell = cell;
        const cellElement = cell.htmlElement;

        cellElement.innerHTML = '';
        cellElement.classList.add(Globals.classNames.editedCell);

        cell.row.viewport.dataGrid.accessibility?.userEditedCell('started');
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
        const editedCell = this.editedCell;

        if (!cell || !input || !editedCell) {
            return;
        }

        const { column } = editedCell;
        const dataGrid = cell.column.viewport.dataGrid;
        const newValue: string | number = input.value;

        this.destroyInput();
        cell.htmlElement.classList.remove(Globals.classNames.editedCell);

        cell.htmlElement.focus();

        /* TODO: Adjust it or delete after implementing the validation.
        // Convert to number if possible
        if (!isNaN(+newValue)) {
            newValue = +newValue;
        }
        */

        const validationRules = column.options.validation;

        if (
            validationRules &&
            !validationRules.rules.call(editedCell, newValue)
        ) {
            cell.htmlElement.classList.add(Globals.classNames.editedCellError);

            // 1. Set position
            // 2. Show
            // 3. Set text

            return;
        } else {
            cell.htmlElement.classList.remove(
                Globals.classNames.editedCellError
            );
        }

        void cell.setValue(
            submit ? newValue : cell.value,
            submit && cell.value !== newValue
        );

        dataGrid.options?.events?.cell?.afterEdit?.call(cell);
        cell.row.viewport.dataGrid.accessibility?.userEditedCell(
            submit ? 'edited' : 'cancelled'
        );

        delete this.editedCell;
    }

    /**
     * Handles the blur event on the input field.
     */
    private onInputBlur = (): void => {
        this.stopEditing();
    };

    /**
     * Handles the keydown event on the input field. Cancels editing on escape
     * and saves the value on enter.
     *
     * @param e
     * The keyboard event.
     */
    private onInputKeyDown = (e: KeyboardEvent): void => {
        const { keyCode } = e;

        // Enter / Escape
        if (keyCode === 13 || keyCode === 27) {
            // Cancel editing on escape
            this.stopEditing(keyCode === 13);
        }
    };

    /**
     * Renders the input field for the cell, focuses it and sets up event
     * listeners.
     */
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

    /**
     * Removes event listeners and the input element.
     */
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
