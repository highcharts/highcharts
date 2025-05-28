/* *
 *
 *  Text Input Cell Content class
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

import type TableCell from '../../../Core/Table/Body/TableCell.js';
import type TextInputRenderer from '../Renderers/TextInputRenderer.js';
import type DataTable from '../../../../Data/DataTable.js';

import { EditModeContent } from '../../CellEditing/CellEditMode.js';
import CellContentPro from '../CellContentPro.js';
import U from '../../../../Core/Utilities.js';

const {
    defined
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a text input type of cell content.
 */
class TextInputContent extends CellContentPro implements EditModeContent {

    public finishAfterChange: boolean = true;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    private input: HTMLInputElement;

    constructor(cell: TableCell, renderer: TextInputRenderer) {
        super(cell, renderer);
        this.input = this.add();
    }

    public override add(): HTMLInputElement {
        const cell = this.cell;
        const { options } = this.renderer as TextInputRenderer;

        this.input = document.createElement('input');
        this.input.tabIndex = -1;
        this.input.value = this.getInputAcceptableValue();
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !!options.disabled;

        this.cell.htmlElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    public getValue(): DataTable.CellType {
        const val = this.input.value;
        switch (this.cell.column.dataType) {
            case 'datetime':
            case 'number':
                return val === '' ? null : parseFloat(val);
            case 'boolean':
                if (val === 'false' || parseFloat(val) === 0) {
                    return false;
                }
                if (val === '') {
                    return null;
                }
                return true;
            case 'string':
                return val;
        }
    }

    private getInputAcceptableValue(): string {
        const val = this.cell.value;
        return defined(val) ? '' + val : '';
    }

    /**
     * Returns reference to the HTML input.
     * @returns
     */
    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    public override destroy(): void {
        this.cell.htmlElement.removeEventListener(
            'keydown',
            this.onCellKeyDown
        );

        this.input?.removeEventListener('blur', this.onBlur);
        this.input?.removeEventListener('keydown', this.onKeyDown);
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
            return;
        }

        void this.cell.setValue((e.target as HTMLSelectElement).value, true);
    };

    /**
     * Handles user keydown on the cell.
     *
     * @param e
     * Keyboard event object.
     */
    private readonly onKeyDown = (e: KeyboardEvent): void => {
        e.stopPropagation();

        if (this.keyDownHandler) {
            this.keyDownHandler(e);
            return;
        }

        if (e.key === 'Escape') {
            this.input.value = this.getInputAcceptableValue();
            this.cell.htmlElement.focus();
            return;
        }

        if (e.key === 'Enter') {
            this.cell.htmlElement.focus();
        }
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
            this.input.focus();
            e.preventDefault();
        }
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default TextInputContent;
