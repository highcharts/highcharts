/* *
 *
 *  Highcharts UI Kit module - Input
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { InputOptions } from './InputOptions.js';

import { appendEl, createEl, addEvent, addClass, removeClass } from '../Dom.js';

/**
 * Interface for the Input component instance.
 */
export interface Input {
    element: HTMLElement;
    getInputElement(): HTMLInputElement | null;
    getInputValue(): string;
    setInputValue(value: string): void;
    setInputDisabled(disabled: boolean): void;
}

/**
 * Methods for Input components.
 */
const InputMethods = {
    /**
     * Get the input element from a Input container.
     *
     * @function getInputElement
     *
     * @param {Input} this The Input container element.
     *
     * @return {HTMLInputElement | null} The input element or null if not found.
     */
    getInputElement(this: Input): HTMLInputElement | null {
        return this.element.querySelector('.highcharts-uik-input');
    },

    /**
     * Get the current value of an input.
     *
     * @param {Input} this The Input container element.
     *
     * @return {string | undefined} The current input value.
     */
    getInputValue(this: Input): string | undefined {
        const input = this.getInputElement();
        if (input) {
            return input.value;
        }
    },

    /**
     * Set the new value of an input.
     *
     * @param {Input} this The Input container element.
     * @param {string} value The new value to set.
     *
     * @return {void}
     */
    setInputValue(this: Input, value: string): void {
        const input = this.getInputElement();
        if (input) {
            input.value = value;
        }
    },

    /**
     * Disable or enable an input.
     *
     * @param {Input} this The Input container element.
     *
     * @param {boolean} disabled Whether to disable the input.
     *
     * @return {void}
     */
    setInputDisabled(this: Input, disabled: boolean): void {
        const input = this.getInputElement();
        if (input) {
            const className = 'highcharts-uik-input-disabled';
            input.disabled = disabled;
            if (disabled) {
                addClass(this.element, className);
            } else {
                removeClass(this.element, className);
            }
        }
    }
};

/**
 * Create an input component.
 *
 * @function Input
 *
 * @param {InputOptions} options Configuration options for the input.
 *
 * @return {Input} An Input instance with shared methods and container element
 * with input and optional label.
 */
export const Input = (options: InputOptions = {}): Input => {
    const {
        type = 'text',
        value,
        labelText,
        placeholder,
        id,
        className,
        onChange,
        onFocus,
        onBlur
    } = options;

    // Elements to append to input container
    const elements: HTMLElement[] = [];

    // Create the container
    const containerEl = createEl('div', 'highcharts-uik-input-container');

    // Additional custom classes
    if (className) {
        addClass(containerEl, className);
    }

    // Create label if text provided
    if (labelText) {
        const labelEl = createEl(
            'label',
            'highcharts-uik-input-label',
            labelText
        );

        // Connect label with input if id is provided
        if (id) {
            labelEl.setAttribute('for', id);
        }

        // Add the label to elements array
        elements.push(labelEl);
    }

    // Create the input element
    const inputEl = createEl(
        'input',
        'highcharts-uik-input',
        value,
        id
    ) as HTMLInputElement;

    // Set the input type
    inputEl.type = type;

    // Set placeholder if provided
    if (placeholder) {
        inputEl.placeholder = placeholder;
    }

    // Add the input to elements array
    elements.push(inputEl);

    // Attach onChange event listener
    if (onChange) {
        addEvent(
            inputEl,
            'input',
            (event: Event, target: HTMLElement): void => {
                onChange((target as HTMLInputElement).value, event, target);
            }
        );
    }

    // Attach onFocus event listener
    if (onFocus) {
        addEvent(inputEl, 'focus', onFocus);
    }

    // Attach onBlur event listener
    if (onBlur) {
        addEvent(inputEl, 'blur', onBlur);
    }

    // Append label and input to container
    appendEl(containerEl, ...elements);

    // Input instance
    const input: Input = Object.create(InputMethods);

    // Save the input in the instance
    input.element = containerEl;

    // Return the instance
    return input;
};
