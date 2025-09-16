/* *
 *
 *  Grid Exporting composition
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

import Exporting from './Exporting.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';

const { addEvent, pushUnique } = U;

/* *
 *
 *  Class Namespace
 *
 * */

namespace ExportingComposition {
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

        addEvent(GridClass, 'afterRenderViewport', initExporting);
    }

    /**
     * Init exporting
     */
    function initExporting(this: Grid): void {
        this.exporting = new Exporting(this, this.options?.exporting);
    }
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
         * The decimal point to use in the CSV string.
         */
        decimalPoint?: string;

        /**
         * The file name to use for exported the grid.
         */
        filename?: string;

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
         * Whether to use the local decimal point as detected from the browser.
         *
         * @default true
         */
        useLocalDecimalPoint?: boolean;
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

export default ExportingComposition;
