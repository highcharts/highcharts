/* *
 *
 *  Checkbox Cell Content class
 *
 *  (c) 2020-2025 Highsoft AS
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

import type CheckboxRenderer from '../Renderers/CheckboxRenderer.js';
import type TableCell from '../../../Core/Table/Body/TableCell.js';

import { EditModeContent } from '../../CellEditing/CellEditMode.js';
import CellContentPro from '../CellContentPro.js';
import Globals from '../../../Core/Globals.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a checkbox type of cell content.
 */
class CheckboxContent extends CellContentPro implements EditModeContent {

    public finishAfterChange: boolean = false;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    private input: HTMLInputElement;


    constructor(cell: TableCell, renderer: CheckboxRenderer) {
        super(cell, renderer);
        this.input = this.add();
    }

    protected override add(): HTMLInputElement {
        const cell = this.cell;
        const { options } = this.renderer as CheckboxRenderer;

        this.input = document.createElement('input');
        this.input.tabIndex = -1;
        this.input.type = 'checkbox';
        this.input.checked = !!cell.value;
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !!options.disabled;

        this.cell.htmlElement.appendChild(this.input);
        this.input.classList.add(Globals.classNamePrefix + 'field-auto-width');

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    /**
     * Returns value of input as boolean.
     */
    public getValue(): boolean {
        return this.input.checked;
    }

    /**
     * Returns reference to the HTML checkbox.
     * @returns
     */
    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    public destroy(): void {
        this.cell.htmlElement.removeEventListener(
            'keydown',
            this.onCellKeyDown
        );

        this.input?.removeEventListener('keydown', this.onKeyDown);
        this.input?.removeEventListener('blur', this.onBlur);
        this.input?.removeEventListener('change', this.onChange);
        this.input?.remove();
    }

    /**
     * Handles the change event on the cell.
     *
     * @param e
     * The event object.
     */
    private readonly onChange = (e: Event): void => {
        if (this.changeHandler) {
            this.changeHandler(e);
        } else {
            void this.cell.setValue(this.getValue(), true);
        }
    };

    /**
     * Handles user keydown on the cell.
     *
     * @param e
     * Keyboard event object.
     */
    private readonly onKeyDown = (e: KeyboardEvent): void => {
        this.keyDownHandler?.(e);
    };

    /**
     * Handles the blur event on the cell.
     *
     * @param e
     * The event object.
     *
     */
    private readonly onBlur = (e: FocusEvent): void => {
        this.blurHandler?.(e);
    };

    /**
     * Callback function called when a key is pressed on a cell.
     *
     * @param e
     * The event object.
     */
    private readonly onCellKeyDown = (e: KeyboardEvent): void => {
        if (e.key === ' ') {
            this.input.click();
        }
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default CheckboxContent;
