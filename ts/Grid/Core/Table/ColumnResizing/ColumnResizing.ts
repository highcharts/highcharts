/* *
 *
 *  Column Distribution namespace
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

import type Table from '../Table';

import ResizingMode from './ResizingMode.js';
import AdjacentResizingMode from './AdjacentResizingMode.js';
import IndependentResizingMode from './IndependentResizingMode.js';


/* *
 *
 *  Namespace
 *
 * */

namespace ColumnResizing {

    /**
     * Abstract class representing a column distribution strategy.
     */
    export const AbstractStrategy = ResizingMode;

    /**
     * Registry of column distribution strategies.
     */
    export const types = {
        adjacent: AdjacentResizingMode,
        independent: IndependentResizingMode
    };

    export type ModeType = keyof typeof types;

    /**
     * Creates a new column distribution strategy instance based on the
     * viewport's options.
     *
     * @param viewport
     * The table that the column distribution strategy is applied to.
     *
     * @returns
     * The proper column distribution strategy.
     */
    export function initStrategy(viewport: Table): ResizingMode {
        return new types[
            viewport.grid.options?.rendering?.columns?.resizing?.mode ||
            'adjacent'
        ](viewport);
    }

}


/* *
 *
 *  Default Export
 *
 * */

export default ColumnResizing;
