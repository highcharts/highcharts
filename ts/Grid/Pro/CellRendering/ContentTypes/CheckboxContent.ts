/* *
 *
 *  Checkbox Cell Content class
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

import type CheckboxRenderer from '../Renderers/CheckboxRenderer';
import type DataTable from '../../../../Data/DataTable';
import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';

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

    /**
     * The HTML input element representing the checkbox.
     */
    private input: HTMLInputElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: TableCell,
        renderer: CheckboxRenderer,
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

    protected override add(
        parentElement: HTMLElement = this.cell.htmlElement
    ): HTMLInputElement {
        const cell = this.cell;
        const { options } = this.renderer as CheckboxRenderer;
        const input = this.input = document.createElement('input');

        input.tabIndex = -1;
        input.type = 'checkbox';
        input.name = cell.column.id + '-' + cell.row.id;
        input.classList.add(Globals.getClassName('input'));

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]): void => {
                input.setAttribute(key, value);
            });
        }

        this.update();

        parentElement.appendChild(this.input);

        input.addEventListener('change', this.onChange);
        input.addEventListener('keydown', this.onKeyDown);
        input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    public override update(): void {
        const cell = this.cell;
        const input = this.input;
        const { options } = this.renderer as CheckboxRenderer;

        input.checked = !!cell.value;
        input.disabled = !!options.disabled;
    }

    public get rawValue(): string {
        return this.input.checked ? 'true' : 'false';
    }

    public get value(): DataTable.CellType {
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
            void this.cell.editValue(this.value);
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
