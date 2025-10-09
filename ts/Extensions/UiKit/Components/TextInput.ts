/* *
 *
 *  Highcharts UI Kit module - Text Input
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { InputOptions } from './InputOptions.js';

import { addClass } from '../Dom.js';
import { Input } from './Input.js';

/**
 * Interface for the TextInput component instance.
 */
export interface TextInput extends Input {}

/**
 * Create a text input component.
 *
 * @function TextInput
 *
 * @param {InputOptions} options Configuration options for the input.
 *
 * @return {TextInput} A TextInput instance with shared methods and container
 * element with input and optional label.
 */
export const TextInput = (options: InputOptions = {}): TextInput => {
    // Create text input
    // eslint-disable-next-line new-cap
    const textInput = Input({ ...options, type: 'text' });

    // Add text input specific class
    addClass(textInput.element, 'highcharts-uik-text-input');

    // Return the text input instance
    return textInput as TextInput;
};
