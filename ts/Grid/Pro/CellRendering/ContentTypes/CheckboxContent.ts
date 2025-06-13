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

import type CheckboxRenderer from '../Renderers/CheckboxRenderer';
import type DataTable from '../../../../Data/DataTable';
import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';

import CellContentPro from '../CellContentPro.js';
import Globals from '../../../Core/Globals.js';
import U from '../../../../Core/Utilities.js';
const {
    fireEvent
} = U;


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

    /**
     * The HTML input element representing the checkbox.
     */
    private input: HTMLInputElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(cell: TableCell, renderer: CheckboxRenderer) {
        super(cell, renderer);
        this.input = this.add();
    }


    /* *
     *
     *  Methods
     *
     * */

    protected override add(): HTMLInputElement {
        const cell = this.cell;

        this.input = document.createElement('input');
        this.input.tabIndex = -1;
        this.input.type = 'checkbox';
        this.input.name = cell.column.id + '-' + cell.row.id;

        this.update();

        this.cell.htmlElement.appendChild(this.input);
        this.input.classList.add(Globals.classNamePrefix + 'field-auto-width');

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        fireEvent(this.cell, 'afterContentCreated', { target: this });
        return this.input;
    }

    public override update(): void {
        const cell = this.cell;
        const input = this.input;
        const { options } = this.renderer as CheckboxRenderer;

        input.checked = !!cell.value;
        input.disabled = !!options.disabled;
    }

    public getValue(): DataTable.CellType {
        const val = this.input.checked;
        switch (this.cell.column.dataType) {
            case 'datetime':
            case 'number':
                return +val;
            case 'boolean':
                return val;
            case 'string':
                return '' + val;
        }
    }

    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    public destroy(): void {
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
        } else {
            void this.cell.setValue(this.getValue(), true);
        }
    };

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        this.keyDownHandler?.(e);
    };

    private readonly onBlur = (e: FocusEvent): void => {
        this.blurHandler?.(e);
    };

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
