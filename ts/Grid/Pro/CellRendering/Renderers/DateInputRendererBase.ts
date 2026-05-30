/* *
 *
 *  Date Input Cell Renderer Base namespace
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Dawid Draguła
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
    /**
     * Type of the built-in date-based input renderer.
     */
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
    /**
     * Minimum accepted value in the native input format.
     */
    min?: string;

    /**
     * Maximum accepted value in the native input format.
     */
    max?: string;

    /**
     * Step interval passed to the native input element.
     */
    step?: string;
}
