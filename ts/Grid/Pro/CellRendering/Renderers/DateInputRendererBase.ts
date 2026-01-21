/* *
 *
 *  Date Input Cell Renderer Base namespace
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

import type { CellRendererOptions } from '../CellRenderer.js';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to control the date input renderer content.
 */
export interface DateInputRendererBaseOptions extends CellRendererOptions {
    type: 'dateInput' | 'dateTimeInput' | 'timeInput';

    /**
     * Whether the date input is disabled.
     */
    disabled?: boolean;

    /**
     * Attributes to control the date input.
     */
    attributes?: DateInputAttributes;
}

/**
 * Attributes to control the date input.
 */
export interface DateInputAttributes {
    min?: string;
    max?: string;
    step?: string;
}
