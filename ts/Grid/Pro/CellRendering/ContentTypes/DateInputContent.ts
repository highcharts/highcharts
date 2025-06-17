/* *
 *
 *  Date Input Cell Content class
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

import type DateInputRenderer from '../Renderers/DateInputRenderer';
import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';

import CellContentPro from '../CellContentPro.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a date input type of cell content.
 */
class DateInputContent extends CellContentPro implements EditModeContent {

    public finishAfterChange: boolean = false;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    /**
     * The HTML input element representing the date input.
     */
    private input: HTMLInputElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: TableCell,
        renderer: DateInputRenderer,
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

    public override add(
        parentElement: HTMLElement = this.cell.htmlElement
    ): HTMLInputElement {
        const cell = this.cell;
        const input = this.input = document.createElement('input');

        input.tabIndex = -1;
        input.type = 'date';
        input.name = cell.column.id + '-' + cell.row.id;

        this.update();

        parentElement.appendChild(input);

        input.addEventListener('change', this.onChange);
        input.addEventListener('keydown', this.onKeyDown);
        input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    public override update(): void {
        const input = this.input;
        const { options } = this.renderer as DateInputRenderer;

        input.value = this.convertToInputValue();
        input.disabled = !!options.disabled;
    }

    public get rawValue(): string {
        return this.input.value;
    }

    public get value(): number {
        return new Date(this.input.value).getTime();
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

    /**
     * Converts the cell value to a string for the input.
     */
    private convertToInputValue(): string {
        const time = this.cell.column.viewport.grid.time;
        return time.dateFormat('%Y-%m-%d', Number(this.cell.value || 0));
    }

    private readonly onChange = (e: Event): void => {
        this.changeHandler?.(e);
    };

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        e.stopPropagation();

        if (this.keyDownHandler) {
            this.keyDownHandler(e);
            return;
        }

        if (e.key === 'Escape') {
            this.cell.htmlElement.focus();
            this.input.value = this.convertToInputValue();
            return;
        }

        if (e.key === 'Enter') {
            this.cell.htmlElement.focus();
            void this.cell.setValue(this.value, true);
        }
    };

    private readonly onBlur = (e: FocusEvent): void => {
        if (this.blurHandler) {
            this.blurHandler(e);
            return;
        }

        void this.cell.setValue(this.value, true);
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

export default DateInputContent;
