/* *
 *
 *  Select Cell Content class
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

import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';
import type DataTable from '../../../../Data/DataTable';
import type SelectRenderer from '../Renderers/SelectRenderer.js';

import CellContentPro from '../CellContentPro.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a select type of cell content.
 */
class SelectContent extends CellContentPro implements EditModeContent {

    public finishAfterChange: boolean = true;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    /**
     * The HTML select element representing the select input.
     */
    private select: HTMLSelectElement;

    /**
     * The HTML option elements representing the options in the select input.
     */
    private optionElements: HTMLOptionElement[] = [];


    public constructor(cell: TableCell, renderer: SelectRenderer) {
        super(cell, renderer);
        this.select = this.add();
    }

    protected override add(): HTMLSelectElement {
        const cell = this.cell;
        const { options } = this.renderer as SelectRenderer;

        this.select = document.createElement('select');
        this.select.tabIndex = -1;
        this.select.name = cell.column.id + '-' + cell.row.id;
        this.select.disabled = !!options.disabled;

        for (const option of options.options) {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.label || option.value;
            optionElement.disabled = !!option.disabled;

            if (cell.value === option.value) {
                optionElement.selected = true;
            }

            this.select.appendChild(optionElement);
            this.optionElements.push(optionElement);
        }

        this.cell.htmlElement.appendChild(this.select);

        this.select.addEventListener('change', this.onChange);
        this.select.addEventListener('keydown', this.onKeyDown);
        this.select.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.select;
    }

    public override destroy(): void {
        this.cell.htmlElement.removeEventListener(
            'keydown',
            this.onCellKeyDown
        );
        this.select?.removeEventListener('blur', this.onBlur);
        this.select?.removeEventListener('keydown', this.onKeyDown);
        this.select?.removeEventListener('change', this.onChange);

        for (const optionElement of this.optionElements) {
            optionElement.remove();
        }
        this.optionElements.length = 0;

        this.select?.remove();
    }

    public getValue(): DataTable.CellType {
        const val = this.select.value;
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

    public getMainElement(): HTMLSelectElement {
        return this.select;
    }

    private readonly onChange = (e: Event): void => {
        if (this.changeHandler) {
            this.changeHandler(e);
        } else {
            this.cell.htmlElement.focus();
            void this.cell.setValue(this.getValue(), true);
        }
    };

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        e.stopPropagation();

        if (this.keyDownHandler) {
            this.keyDownHandler?.(e);
            return;
        }

        if (e.key === 'Escape' || e.key === 'Enter') {
            this.cell.htmlElement.focus();
        }
    };

    private readonly onBlur = (e: FocusEvent): void => {
        this.blurHandler?.(e);
    };

    private readonly onCellKeyDown = (e: KeyboardEvent): void => {
        if (e.key === ' ') {
            this.select.focus();
            e.preventDefault();
        }
    };
}


/* *
 *
 *  Default Export
 *
 * */

export default SelectContent;
