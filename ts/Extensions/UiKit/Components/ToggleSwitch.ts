/* *
 *
 * Highcharts UI Kit
 *
 * Copyright (c) 2025, Highsoft AS
 *
 * All rights reserved.
 * See LICENSE file for licensing details.
 *
 * Original author: Christer Vasseng
 *
 */

import { createEl, appendEl, createInputEl } from '../Dom';

/**
 * Creates a simple toggle switch component.
 *
 * @param {boolean} initial Initial state of the toggle switch, true for 'on'
 * and false for 'off'. Defaults to false.
 *
 * @return {HTMLElement} The toggle switch component.
 */
export const ToggleSwitch = (initial?: boolean): HTMLElement => {
    const node = createEl('label', 'highcharts-uik-toggle-switch'),
        input = createInputEl('checkbox', 'highcharts-uik-toggle-switch input'),
        ball = createEl('span', 'ball');

    input.checked = !!initial;
    return appendEl(node, input, ball);
};
