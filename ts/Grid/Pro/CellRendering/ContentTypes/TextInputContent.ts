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
import type TextInputRenderer from '../Renderers/TextInputRenderer.js';

import { EditModeContent } from '../../CellEditing/CellEditMode.js';
import CellContentPro from '../CellContentPro.js';

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

        this.input = document.createElement('input');
        this.input.value = '' + cell.value;
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !cell.column.options.cells?.editable;

        this.cell.htmlElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);

        return this.input;
    }

    public getValue(): string {
        return this.input?.value || '';
    }

    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    public override destroy(): void {
        this.input?.removeEventListener('blur', this.onBlur);
        this.input?.removeEventListener('keydown', this.onKeyDown);
        this.input?.removeEventListener('change', this.onChange);

        this.input?.remove();
    }

    private readonly onChange = (e: Event): void => {
        if (this.changeHandler) {
            this.changeHandler(e);
        } else {
            this.cell.setValue(
                (e.target as HTMLSelectElement).value,
                true
            );
        }
    };

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        if (this.keyDownHandler) {
            this.keyDownHandler(e);
        } else if (this.input && e.key === 'Escape') {
            this.input.value = '' + this.cell.value;
        }
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

export default TextInputContent;
