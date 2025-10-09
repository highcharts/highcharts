/* *
 *
 *  Highcharts UI Kit module - Text Button
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { ButtonOptions } from './ButtonOptions.js';

import { addClass } from '../Dom.js';
import { Button } from './Button.js';

/**
 * Interface for the TextButton component instance.
 */
export interface TextButton extends Button {}

/**
 * Create a text button component.
 *
 * @function TextButton
 *
 * @param {ButtonOptions} options Configuration options for the button.
 *
 * @return {TextButton} A Button instance with shared methods and button
 * element.
 */
export const TextButton = (options: ButtonOptions = {}): TextButton => {
    // Create text button
    // eslint-disable-next-line new-cap
    const textButton = Button({ ...options });

    // Add text button specific class
    addClass(textButton.element, 'highcharts-uik-text-button');

    // Return the text button instance
    return textButton as TextButton;
};
