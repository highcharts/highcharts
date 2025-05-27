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

import type TableCell from '../../../Core/Table/Body/TableCell.js';
import type DateInputRenderer from '../Renderers/DateInputRenderer.js';

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
class DateInputContent extends CellContentPro implements EditModeContent {

    public finishAfterChange: boolean = false;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    private input: HTMLInputElement;


    constructor(cell: TableCell, renderer: DateInputRenderer) {
        super(cell, renderer);
        this.input = this.add();
    }

    public override add(): HTMLInputElement {
        const cell = this.cell;

        this.input = document.createElement('input');
        this.input.tabIndex = -1;
        this.input.type = 'date';
        this.input.value = this.getInputAcceptableValue();
        this.input.name = cell.column.id + '-' + cell.row.id;
        this.input.disabled = !cell.column.options.cells?.editable;

        this.cell.htmlElement.appendChild(this.input);

        this.input.addEventListener('change', this.onChange);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    public getValue(): number {
        return new Date(this.input.value).getTime();
    }

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

    private getInputAcceptableValue(): string {
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
            this.input.value = this.getInputAcceptableValue();
            return;
        }

        if (e.key === 'Enter') {
            this.cell.htmlElement.focus();
            void this.cell.setValue(this.getValue(), true);
        }
    };

    private readonly onBlur = (e: FocusEvent): void => {
        if (this.blurHandler) {
            this.blurHandler(e);
            return;
        }

        void this.cell.setValue(this.getValue(), true);
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
