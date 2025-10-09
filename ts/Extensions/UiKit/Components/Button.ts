/* *
 *
 *  Highcharts UI Kit module - Button
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { ButtonOptions } from './ButtonOptions.js';

import { createEl, addClass, removeClass, addEvent } from '../Dom.js';

/**
 * Interface for the Input component instance.
 */
export interface Button {
    element: HTMLButtonElement;
    getButtonElement(): HTMLButtonElement;
    getButtonText(): string;
    setButtonText(text: string): void;
    toggleButtonActive(active?: boolean): void;
    setButtonDisabled(disabled: boolean): void;
}

/**
 * Methods for Button components.
 */
const ButtonMethods = {
    /**
     * Get the button element from a Button container.
     *
     * @function getButtonElement
     *
     * @param {Button} this The Button container element.
     *
     * @return {HTMLButtonElement} The button element or null if not found.
     */
    getButtonElement(this: Button): HTMLButtonElement {
        return this.element;
    },

    /**
     * Get the button text.
     *
     * @function getButtonText
     *
     * @param {Button} this The Button container element.
     *
     * @return {string} The current button text.
     */
    getButtonText(this: Button): string {
        const button = this.getButtonElement();
        return button.textContent;
    },

    /**
     * Update the button text.
     *
     * @function setButtonText
     *
     * @param {Button} this The Button container element.
     * @param {string} text The new text content.
     *
     * @return {void}
     */
    setButtonText(this: Button, text: string): void {
        const button = this.getButtonElement();
        button.textContent = text;
    },

    /**
     * Toggle the active state of a button.
     *
     * @function toggleButtonActive
     *
     * @param {Button} this The Button container element.
     * @param {boolean} [active] Optional explicit state, toggles if not
     * provided.
     *
     * @return {void}
     */
    toggleButtonActive(this: Button, active?: boolean): void {
        const button = this.getButtonElement();
        const shouldBeActive =
        active !== void 0 ?
            active :
            !this.element.classList.contains('highcharts-uik-button-active');

        if (shouldBeActive) {
            addClass(button, 'highcharts-uik-button-active');
        } else {
            removeClass(button, 'highcharts-uik-button-active');
        }
    },

    /**
     * Set the disabled state of a button.
     *
     * @function setButtonDisabled
     *
     * @param {Button} this The Button container element.
     * @param {boolean} disabled Whether the button should be disabled.
     *
     * @return {void}
     */
    setButtonDisabled(this: Button, disabled: boolean): void {
        const button = this.getButtonElement();
        button.disabled = disabled;
    }
};

/**
 * Create a button component.
 *
 * @function Button
 *
 * @param {ButtonOptions | string} options Configuration options or button text.
 *
 * @return {Button} A Button instance with shared methods and button element.
 */
export const Button = (options: ButtonOptions | string): Button => {
    // Handle string shorthand
    if (typeof options === 'string') {
        options = {
            text: options
        };
    }

    const {
        text,
        variant = 'default',
        size = 'medium',
        disabled = false,
        active = false,
        id,
        className,
        onClick
    } = options;

    // Create the button element
    const buttonEl = createEl(
        'button',
        'highcharts-uik-button',
        text,
        id
    ) as HTMLButtonElement;

    // Build class names
    const classes = [
        `highcharts-uik-button-${variant}`,
        `highcharts-uik-button-${size}`
    ];

    // Active state
    if (active) {
        classes.push('highcharts-uik-button-active');
    }

    // Additional custom classes
    if (className) {
        classes.push(className);
    }

    // Add all classes to button element
    addClass(buttonEl, ...classes);

    // Set disabled state
    if (disabled) {
        buttonEl.disabled = true;
    }

    // Attach click handler
    if (onClick) {
        addEvent(buttonEl, 'click', onClick);
    }

    // Button instance
    const button: Button = Object.create(ButtonMethods);

    // Save the button in the instance
    button.element = buttonEl;

    // Return the instance
    return button;
};
