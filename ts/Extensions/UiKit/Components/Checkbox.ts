/* *
 *
 * Highcharts UI Kit
 *
 * Copyright (c) 2025, Highsoft AS
 *
 * All rights reserved.
 * See LICENSE file for licensing details.
 *
 * Author: Jedrzej Ruta
 *
 */

import { createInputEl } from '../Dom';

/**
 * Create a simple checkbox component.
 *
 * @param {boolean} checked Initial checked state.
 * @param {boolean} disabled If true, the checkbox will be disabled.
 *
 * @return {HTMLInputElement} The checkbox component.
 */
export const Checkbox = (
    checked?: boolean,
    disabled?: boolean
): HTMLInputElement => {
    const input = createInputEl('checkbox', 'highcharts-uik-checkbox');
    input.checked = !!checked;

    input.disabled = !!disabled;

    return input;
};
