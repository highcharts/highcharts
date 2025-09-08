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
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../../../Data/DataTable';
import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type TextInputRenderer from '../Renderers/TextInputRenderer';

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

    /**
     * Whether to finish the edit after a change.
     */
    public finishAfterChange: boolean = true;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    /**
     * The HTML input element representing the text input.
     */
    private input: HTMLInputElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: TableCell,
        renderer: TextInputRenderer,
        parentElement?: HTMLElement
    ) {
        super(cell, renderer);
        this.input = this.add(parentElement);
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Adds the input element to the parent element.
     * @param parentElement The parent element to add the input element to.
     * @returns The input element.
     */
    public override add(
        parentElement: HTMLElement = this.cell.htmlElement
    ): HTMLInputElement {
        const cell = this.cell;
        const input = this.input = document.createElement('input');
        const { options } = this.renderer as TextInputRenderer;

        input.tabIndex = -1;
        input.name = cell.column.id + '-' + cell.row.id;

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]):void => {
                input.setAttribute(key, value);
            });
        }

        this.update();

        parentElement.appendChild(this.input);

        input.addEventListener('change', this.onChange);
        input.addEventListener('keydown', this.onKeyDown);
        input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return input;
    }

    /**
     * Updates the input element.
     */
    public override update(): void {
        const { options } = this.renderer as TextInputRenderer;
        this.input.value = this.convertToInputValue();
        this.input.disabled = !!options.disabled;
    }

    /**
     * Gets the raw value of the input element.
     */
    public get rawValue(): string {
        return this.input.value;
    }

    /**
     * Gets the value of the input element.
     */
    public get value(): DataTable.CellType {
        const val = this.input.value;
        switch (this.cell.column.dataType) {
            case 'datetime':
            case 'number':
                return val === '' ? null : +val;
            case 'boolean':
                if (val === '') {
                    return null;
                }
                if (val === 'false' || +val === 0) {
                    return false;
                }
                return true;
            case 'string':
                return val;
        }
    }

    /**
     * Converts the cell value to a string for the input.
     */
    private convertToInputValue(): string {
        const val = this.cell.value;
        return defined(val) ? '' + val : '';
    }

    /**
     * Gets the main element (input) of the content.
     * @returns The input element.
     */
    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    /**
     * Destroys the content.
     */
    public override destroy(): void {
        const input = this.input;
        this.cell.htmlElement.removeEventListener(
            'keydown',
            this.onCellKeyDown
        );

        input.removeEventListener('blur', this.onBlur);
        input.removeEventListener('keydown', this.onKeyDown);
        input.removeEventListener('change', this.onChange);

        input.remove();
    }

    private readonly onChange = (e: Event): void => {
        if (this.changeHandler) {
            this.changeHandler(e);
            return;
        }

        void this.cell.setValue((e.target as HTMLSelectElement).value, true);
    };

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        e.stopPropagation();

        if (this.keyDownHandler) {
            this.keyDownHandler(e);
            return;
        }

        if (e.key === 'Escape') {
            this.input.value = this.convertToInputValue();
            this.cell.htmlElement.focus();
            return;
        }

        if (e.key === 'Enter') {
            this.cell.htmlElement.focus();
        }
    };

    private readonly onBlur = (e: FocusEvent): void => {
        this.blurHandler?.(e);
    };

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
