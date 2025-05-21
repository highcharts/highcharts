/* *
 *
 *  Grid Cell Editing class.
 *
 *  (c) 2020-2025 Highsoft AS
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

import { EditModeContent, EditModeRenderer } from './CellEditMode.js';

import AST from '../../../Core/Renderer/HTML/AST.js';
import TableCell from '../../Core/Table/Body/TableCell.js';
import GridUtils from '../../Core/Table/../GridUtils.js';
import Table from '../../Core/Table/Table.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const { makeHTMLElement } = GridUtils;
const { fireEvent } = U;


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
     * The viewport the edited cells are part of.
     */
    public readonly viewport: Table;

    /**
     * The cell being currently edited.
     */
    public editedCell?: TableCell;

    /**
     * Input element for the cell.
     */
    private editModeContent?: EditModeContent;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(viewport: Table) {
        this.viewport = viewport;
    }


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
        if (
            this.editedCell === cell || (
                // If value is invalid, do not start new editing
                this.editedCell && !this.stopEditing()
            )
        ) {
            return;
        }

        this.editedCell = cell;
        const cellElement = cell.htmlElement;

        cell.content?.destroy();
        cellElement.classList.add(Globals.getClassName('editedCell'));

        this.render();
        fireEvent(cell, 'startedEditing');
    }

    /**
     * Stops the editing of the cell.
     *
     * @param submit
     * Whether to save the value of the input to the cell. Defaults to true.
     *
     * @return
     * Returns `true` if the cell was successfully stopped editing.
     */
    public stopEditing(submit = true): boolean {
        const cell = this.editedCell;
        const emContent = this.editModeContent;

        if (!cell || !emContent) {
            return false;
        }

        const { column } = cell;
        const vp = column.viewport;
        let newValue = emContent.getValue();

        if (submit) {
            const validationErrors: string[] = [];
            if (!vp.validator.validate(cell, newValue, validationErrors)) {
                vp.validator.initErrorBox(cell, validationErrors);
                vp.validator.show();
                return false;
            }

            vp.validator.hide();
            vp.validator.errorCell = void 0;
        }

        // Hide notification
        this.viewport.validator.hide();

        // Hide input
        this.destroy();
        cell.htmlElement.classList.remove(
            Globals.getClassName('editedCell')
        );

        cell.htmlElement.focus();

        // TODO: Add custom parsing callback option!
        // // Convert to number if possible
        // if (!isNaN(+newValue)) {
        //     newValue = +newValue;
        // }

        void cell.setValue(
            submit ? newValue : cell.value,
            submit && cell.value !== newValue
        );

        fireEvent(cell, 'stoppedEditing', { submit });

        delete this.editedCell;

        return true;
    }

    /**
     * Handles the blur event on the input field.
     */
    private readonly onInputBlur = (): void => {
        if (!this.stopEditing()) {
            this.editModeContent?.getMainElement().focus();
        }
    };

    /**
     * Handles the change event on the input field.
     */
    private readonly onInputChange = (): void => {
        if (
            this.editModeContent?.finishAfterChange &&
            !this.stopEditing()
        ) {
            this.editModeContent?.getMainElement().focus();
        }
    };

    /**
     * Handles the keydown event on the input field. Cancels editing on escape
     * and saves the value on enter.
     *
     * @param e
     * The keyboard event.
     */
    private readonly onInputKeyDown = (e: KeyboardEvent): void => {
        const { key } = e;

        // Enter / Escape
        if (key === 'Enter' || key === 'Escape') {
            // Cancel editing on escape
            this.stopEditing(key === 'Enter');
        }
    };

    /**
     * Renders the input field for the cell, focuses it and sets up event
     * listeners.
     */
    private render(): void {
        const cell = this.editedCell;
        if (!cell || !cell.column.editModeRenderer) {
            return;
        }

        this.editModeContent = cell.column.editModeRenderer?.render(cell);
        this.editModeContent.getMainElement().focus();

        this.editModeContent.blurHandler = this.onInputBlur;
        this.editModeContent.changeHandler = this.onInputChange;
        this.editModeContent.keyDownHandler = this.onInputKeyDown;
    }

    /**
     * Removes event listeners and the input element.
     */
    private destroy(): void {
        if (!this.editModeContent) {
            return;
        }

        this.editModeContent.destroy();
        delete this.editModeContent;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default CellEditing;
