/* *
 *
 *  Date Input Cell Content Base class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import type {
    DateInputRendererBaseOptions
} from '../Renderers/DateInputRendererBase';
import type { EditModeContent } from '../../CellEditing/CellEditMode';
import type TableCell from '../../../Core/Table/Body/TableCell';

import CellContentPro from '../CellContentPro.js';
import CellRenderer from '../CellRenderer';
import Globals from '../../../Core/Globals.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Represents a date/time/datetime input type of cell content.
 */
abstract class DateInputContentBase extends CellContentPro implements EditModeContent {

    /**
     * Whether to finish the edit after a change.
     */
    public finishAfterChange: boolean = false;

    public blurHandler?: (e: FocusEvent) => void;

    public keyDownHandler?: (e: KeyboardEvent) => void;

    public changeHandler?: (e: Event) => void;

    /**
     * Options of the renderer.
     */
    public options: DateInputRendererBaseOptions;

    /**
     * The HTML input element representing the date input.
     */
    protected input: HTMLInputElement;


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: TableCell,
        renderer: CellRenderer,
        parentElement?: HTMLElement
    ) {
        super(cell, renderer);
        this.options = renderer.options as DateInputRendererBaseOptions;
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
        input.type = this.getInputType();
        input.name = cell.column.id + '-' + cell.row.id;
        input.classList.add(Globals.getClassName('input'));

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
     * Gets the input type. Used to override the input type.
     */
    protected abstract getInputType(): 'date' | 'datetime-local' | 'time';

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
        return new Date(`${this.input.value}Z`).getTime();
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
    protected abstract convertToInputValue(): string;

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
            void this.cell.editValue(this.value);
        }
    };

    private readonly onBlur = (e: FocusEvent): void => {
        if (this.blurHandler) {
            this.blurHandler(e);
            return;
        }

        void this.cell.editValue(this.value);
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

export default DateInputContentBase;
