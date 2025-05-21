/* *
 *
 *  Checkbox Cell Renderer class
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
 * Represents a checkbox type of cell content.
 */
class CheckboxContent extends CellContent implements EditModeContent {

    public finishAfterChange: boolean = false;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    private input: HTMLInputElement;


    constructor(cell: TableCell, parent?: HTMLElement) {
        super(cell, parent);
        this.input = this.add();
    }

    protected override add(): HTMLInputElement {
        const cell = this.cell;

        this.input = document.createElement('input');
        this.input.type = 'checkbox';
        this.input.checked = !!cell.value;
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !cell.column.options.cells?.editable;

        this.parentElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);

        return this.input;
    }

    public getValue(): boolean {
        return this.input.checked;
    }

    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    public destroy(): void {
        this.input?.removeEventListener('keydown', this.onKeyDown);
        this.input?.removeEventListener('blur', this.onBlur);
        this.input?.removeEventListener('change', this.onChange);
        this.input?.remove();
    }

    private readonly onChange = (e: Event): void => {
        if (this.changeHandler) {
            this.changeHandler(e);
        } else {
            this.cell.setValue(
                (e.target as HTMLInputElement).checked,
                true
            );
        }
    };

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        this.keyDownHandler?.(e)
    };

    private readonly onBlur = (e: FocusEvent): void => {
        this.blurHandler?.(e);
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default CheckboxContent;
