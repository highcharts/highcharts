/* *
 *
 *  Grid Exporting composition
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';

import { defaultOptions } from '../../Core/Defaults.js';
import Exporting from './Exporting.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const { addEvent, pushUnique } = U;


/* *
 *
 *  Composition
 *
 * */

/**
 * Extends the grid classes with exporting.
 *
 * @param GridClass
 * The class to extend.
 *
 */
export function compose(
    GridClass: typeof Grid
): void {
    if (!pushUnique(Globals.composed, 'Exporting')) {
        return;
    }

    defaultOptions.exporting = Exporting.defaultOptions;
    addEvent(GridClass, 'beforeLoad', initExporting);
}

/**
 * Init exporting
 */
function initExporting(this: Grid): void {
    this.exporting = new Exporting(this);
}


/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * Options for the exporting.
         *
         * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/basic/exporting | Export to CSV}
         */
        exporting?: ExportingOptions;
    }

    export interface ExportingOptions {
        /**
         * The file name to use for exported the grid.
         */
        filename?: string;

        /**
         * Exporting options for the CSV.
         */
        csv?: {
            /**
             * The decimal point to use in the CSV string.
             */
            decimalPoint?: string;

            /**
             * Whether to export the first row as column names.
             *
             * @default true
             */
            firstRowAsNames?: boolean;

            /**
             * The delimiter used to separate the values in the CSV string.
             *
             * @default ','
             * */
            itemDelimiter?: string;

            /**
             * The delimiter used to separate the lines in the CSV string.
             *
             * @default '\n'
             */
            lineDelimiter?: string;

            /**
             * Whether to use the local decimal point as detected from the
             * browser.
             *
             * @default true
             */
            useLocalDecimalPoint?: boolean;
        }
    }
}
declare module '../../Core/Grid' {
    export default interface Grid {
        exporting?: Exporting;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
