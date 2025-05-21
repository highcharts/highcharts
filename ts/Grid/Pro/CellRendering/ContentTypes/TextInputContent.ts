/* *
 *
 *  Select Cell Renderer class
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

import CellContent from '../../../Core/Table/CellContent/CellContent.js';
import { EditModeContent } from '../../CellEditing/CellEditMode.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a text input type of cell content.
 */
class TextInputContent extends CellContent implements EditModeContent {

    private input: HTMLInputElement;
    private optionElements: HTMLOptionElement[] = [];

    constructor(cell: TableCell, parent?: HTMLElement) {
        super(cell, parent);
        this.input = this.add();
    }

    public override add(): HTMLInputElement {
        const cell = this.cell;

        this.input = document.createElement('input');
        this.input.value = '' + cell.value;
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !cell.column.options.cells?.editable;

        this.parentElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);

        return this.input;
    }

    public getValue(): string {
        return this.input?.value || '';
    }

    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    public override destroy(): void {
        this.input?.removeEventListener('change', this.onChange);

        for (const optionElement of this.optionElements) {
            optionElement.remove();
        }
        this.optionElements.length = 0;

        this.input?.remove();
    }

    /**
     * Handles the change event of the input element.
     *
     * @param e
     * Mouse event object.
     */
    public onChange = (e: Event): void => {
        this.cell.setValue(
            (e.target as HTMLSelectElement).value,
            true
        );
    };

    /**
     * Handles the keydown event of the input element.
     * 
     * @param e
     * Keyboard event object.
     */
    public onKeyDown = (e: KeyboardEvent): void => {
        if (this.input && e.key === 'Escape') {
            this.input.value = '' + this.cell.value;
        }
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default TextInputContent;
