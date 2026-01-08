/* *
 *
 *  Grid Cell Editing class.
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import { EditModeContent } from './CellEditMode.js';

import TableCell from '../../Core/Table/Body/TableCell.js';
import Table from '../../Core/Table/Table.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const {
    fireEvent
} = U;


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
     * The content of the cell edit mode, which represents a context containing
     * the input field or similar element for applying changes to the cell
     * value.
     */
    public editModeContent?: EditModeContent;

    /**
     * The container element for the cell edit mode, which is used to
     * position the edit mode content correctly within the cell.
     */
    private containerElement?: HTMLDivElement;


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
        cell.htmlElement.classList.add(Globals.getClassName('editedCell'));

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
        const newValue = emContent.value;

        if (submit) {
            const validationErrors: string[] = [];
            if (!vp.validator.validate(cell, validationErrors)) {
                vp.validator.initErrorBox(cell, validationErrors);
                this.setA11yAttributes(false);

                return false;
            }

            this.setA11yAttributes(true);

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

        const isValueChanged = cell.value !== newValue;
        void cell.setValue(
            submit ? newValue : cell.value,
            submit && isValueChanged
        );

        if (isValueChanged) {
            fireEvent(cell, 'stoppedEditing', { submit });
        }

        delete this.editedCell;

        return true;
    }

    public setA11yAttributes(valid: boolean): void {
        const mainElement = this.editModeContent?.getMainElement();
        if (!mainElement) {
            return;
        }

        if (!valid) {
            mainElement.setAttribute('aria-invalid', 'true');
            mainElement.setAttribute(
                'aria-errormessage',
                'notification-error'
            );
        } else {
            mainElement.setAttribute('aria-invalid', 'false');
            mainElement.setAttribute('aria-errormessage', '');
        }
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
        e.stopPropagation();

        if (key === 'Escape') {
            this.stopEditing(false);
            return;
        }

        if (key === 'Enter') {
            if (
                this.editModeContent?.finishAfterChange
            ) {
                this.onInputChange();
                return;
            }

            this.stopEditing();
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

        this.containerElement = this.containerElement ||
            document.createElement('div');
        this.containerElement.className = classNames.cellEditingContainer;
        this.editedCell?.htmlElement.appendChild(this.containerElement);

        this.editModeContent = cell.column.editModeRenderer?.render(
            cell, this.containerElement
        );
        this.editModeContent.getMainElement().focus();

        this.editModeContent.blurHandler = this.onInputBlur;
        this.editModeContent.changeHandler = this.onInputChange;
        this.editModeContent.keyDownHandler = this.onInputKeyDown;

        const rules = cell.column.options?.cells?.editMode?.validationRules ||
            [];
        if (rules.includes('notEmpty')) {
            this.editModeContent.getMainElement().setAttribute(
                'aria-required',
                'true'
            );
        }
    }

    /**
     * Removes event listeners and the input element.
     */
    private destroy(): void {
        if (!this.editModeContent) {
            return;
        }

        this.editModeContent.destroy();
        this.containerElement?.remove();
        delete this.editModeContent;
        delete this.containerElement;
    }
}


/* *
 *
 *  Declarations
 *
 * */

/**
 * The class names used by the CellEditing functionality.
 */
export const classNames = {
    cellEditingContainer: Globals.classNamePrefix + 'cell-editing-container'
} as const;


/* *
 *
 *  Default Export
 *
 * */

export default CellEditing;
