/* *
 *
 *  Date Input Cell Renderer Base namespace
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import type CellRenderer from '../CellRenderer.js';


/* *
 *
 *  Namespace
 *
 * */

namespace DateInputRendererBase {

    /**
     * Options to control the date input renderer content.
     */
    export interface Options extends CellRenderer.Options {
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
}

export default DateInputRendererBase;
