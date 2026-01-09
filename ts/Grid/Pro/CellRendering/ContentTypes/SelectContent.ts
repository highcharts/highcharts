/* *
 *
 *  Select Cell Content class
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

import type DataTable from '../../../../Data/DataTable';
import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type SelectRenderer from '../Renderers/SelectRenderer';
import type TableCell from '../../../Core/Table/Body/TableCell';

import CellContentPro from '../CellContentPro.js';
import AST from '../../../../Core/Renderer/HTML/AST.js';
import Globals from '../../../Core/Globals.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a select type of cell content.
 */
class SelectContent extends CellContentPro implements EditModeContent {

    /**
     * Whether to finish the edit after a change.
     */
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


    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        cell: TableCell,
        renderer: SelectRenderer,
        parentElement?: HTMLElement
    ) {
        super(cell, renderer);
        this.select = this.add(parentElement);
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Adds the select element to the parent element.
     * @param parentElement The parent element to add the select element to.
     * @returns The select element.
     */
    protected override add(
        parentElement: HTMLElement = this.cell.htmlElement
    ): HTMLSelectElement {
        const cell = this.cell;
        const { options } = this.renderer as SelectRenderer;
        const select = this.select = document.createElement('select');

        select.tabIndex = -1;
        select.name = cell.column.id + '-' + cell.row.id;
        select.classList.add(Globals.getClassName('input'));

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]): void => {
                select.setAttribute(key, value);
            });
        }

        this.update();

        parentElement.appendChild(this.select);

        select.addEventListener('change', this.onChange);
        select.addEventListener('keydown', this.onKeyDown);
        select.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return select;
    }

    /**
     * Updates the select element.
     */
    public override update(): void {
        const cell = this.cell;
        const { options } = this.renderer as SelectRenderer;

        this.select.disabled = !!options.disabled;

        // If there will be a need, we can optimize this by not removing all
        // old options and only updating the ones that need to be updated.
        this.select.innerHTML = AST.emptyHTML;
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
    }

    /**
     * Destroys the content.
     */
    public override destroy(): void {
        const select = this.select;
        this.cell.htmlElement.removeEventListener(
            'keydown',
            this.onCellKeyDown
        );
        select.removeEventListener('blur', this.onBlur);
        select.removeEventListener('keydown', this.onKeyDown);
        select.removeEventListener('change', this.onChange);

        for (const optionElement of this.optionElements) {
            optionElement.remove();
        }
        this.optionElements.length = 0;

        select.remove();
    }

    /**
     * Gets the raw value of the select element.
     */
    public get rawValue(): string {
        return this.select.value;
    }

    /**
     * Gets the value of the select element.
     */
    public get value(): DataTable.CellType {
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

    /**
     * Gets the main element (select) of the content.
     * @returns The select element.
     */
    public getMainElement(): HTMLSelectElement {
        return this.select;
    }

    private readonly onChange = (e: Event): void => {
        if (this.changeHandler) {
            this.changeHandler(e);
        } else {
            this.cell.htmlElement.focus();
            void this.cell.editValue(this.value);
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
