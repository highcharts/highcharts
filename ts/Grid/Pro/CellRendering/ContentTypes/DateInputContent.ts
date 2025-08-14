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
 *  - Sebastian Bochan
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

    /**
     * The format of the input value for each input type.
     */
    private static readonly inputValueFormats: Record<
    NonNullable<DateInputRenderer.Options['inputType']>,
    string
    > = {
            date: '%Y-%m-%d',
            datetime: '%Y-%m-%dT%H:%M:%S',
            time: '%H:%M:%S'
        } as const;

    /**
     * Whether to finish the edit after a change.
     */
    public finishAfterChange: boolean = false;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    /**
     * The HTML input element representing the date input.
     */
    private input: HTMLInputElement;

    /**
     * The options of the date input renderer.
     */
    private options: DateInputRenderer.Options;


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
        this.options = renderer.options;
        this.input = this.add(parentElement);
    }


    /* *
     *
     *  Methods
     *
     * */

    /**
     * Adds the input element to the parent element.
     * @param parentElement The parent element to add the input element to.
     * @returns The input element.
     */
    public override add(
        parentElement: HTMLElement = this.cell.htmlElement
    ): HTMLInputElement {
        const { cell, options } = this;
        const input = this.input = document.createElement('input');

        input.tabIndex = -1;
        input.type = (
            options.inputType === 'datetime' ?
                'datetime-local' : options.inputType
        ) || 'date';
        input.name = cell.column.id + '-' + cell.row.id;

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]): void => {
                input.setAttribute(key, value);
            });
        }

        this.update();

        parentElement.appendChild(input);

        input.addEventListener('change', this.onChange);
        input.addEventListener('keydown', this.onKeyDown);
        input.addEventListener('blur', this.onBlur);
        this.cell.htmlElement.addEventListener('keydown', this.onCellKeyDown);

        return this.input;
    }

    /**
     * Updates the input element.
     */
    public override update(): void {
        const input = this.input;

        input.value = this.convertToInputValue();
        input.disabled = !!this.options.disabled;
    }

    /**
     * Gets the raw value of the input element.
     */
    public get rawValue(): string {
        return this.input.value;
    }

    /**
     * Gets the value of the input element.
     */
    public get value(): number {
        return new Date(
            this.options.inputType === 'time' ?
                `1970-01-01T${this.input.value}Z` :
                `${this.input.value}Z`
        ).getTime();
    }

    /**
     * Gets the main element (input) of the content.
     * @returns The input element.
     */
    public getMainElement(): HTMLInputElement {
        return this.input;
    }

    /**
     * Destroys the content.
     */
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
        return time.dateFormat(
            DateInputContent.inputValueFormats[
                this.options.inputType || 'date'
            ],
            Number(this.cell.value || 0)
        );
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
