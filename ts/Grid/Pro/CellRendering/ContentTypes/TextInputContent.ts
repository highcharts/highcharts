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

    constructor(cell: TableCell, renderer: TextInputRenderer) {
        super(cell, renderer);
        this.input = this.add();
    }


    /* *
     *
     *  Methods
     *
     * */

    public override add(): HTMLInputElement {
        const cell = this.cell;
        const { options } = this.renderer as TextInputRenderer;

        this.input = document.createElement('input');
        this.input.tabIndex = -1;
        this.input.value = this.convertToInputValue();
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !!options.disabled;

        this.cell.htmlElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    public getStringValue(): string {
        return this.input.value;
    }

    public getValue(): DataTable.CellType {
        const val = this.input.value;
        switch (this.cell.column.dataType) {
            case 'datetime':
            case 'number':
                return val === '' ? null : +val;
            case 'boolean':
                if (val === 'false' || +val === 0) {
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

    /**
     * Converts the cell value to a string for the input.
     */
    private convertToInputValue(): string {
        const val = this.cell.value;
        return defined(val) ? '' + val : '';
    }

    public getMainElement(): HTMLInputElement {
        return this.input;
    }

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
