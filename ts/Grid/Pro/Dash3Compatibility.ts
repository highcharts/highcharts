/* *
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

import type Grid from '../Core/Grid';
import type Table from '../Core/Table/Table';

import U from '../../Core/Utilities.js';
import Globals from '../../Core/Globals.js';

const {
    pushUnique
} = U;


/* *
 *
 *  Functions
 *
 * */

/**
 * Composition to add compatibility with the old `dataGrid` property.
 *
 * @param TableClass
 * The class to extend.
 */
function compose(
    TableClass: typeof Table
): void {

    if (!pushUnique(Globals.composed, 'Dash3Compatibility')) {
        return;
    }

    Object.defineProperty(TableClass.prototype, 'dataGrid', {
        get: function (this: Table): Grid {
            return this.grid;
        },
        configurable: true,
        enumerable: false
    });

}


/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Table/Table' {
    export default interface Table {
        /**
         * Deprecated. Use `grid` instead.
         * @deprecated
         */
        readonly dataGrid: Grid;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default { compose };
