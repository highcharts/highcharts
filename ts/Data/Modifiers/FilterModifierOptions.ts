/* *
 *
 *  (c) 2009-2025 Highsoft AS
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

import type DataModifierOptions from './DataModifierOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to configure the modifier.
 */
export interface FilterModifierOptions extends DataModifierOptions {

    /**
     * Name of the related modifier for these options.
     */
    type: 'Filter';

    // ==== PoC OPTIONS ====
    // They will be refined & expanded before release.

    /**
     * PoC option to simply filter out values that contain a certain string.
     * @internal
     * @private
     */
    contains?: string;

    /**
     * PoC option to point to a specific column to filter values in. If not set,
     * all columns are checked.
     * @internal
     * @private
     */
    filterIn?: string | string[];

    // ==== END OF PoC OPTIONS ====

}

/* *
 *
 *  Default Export
 *
 * */

export default FilterModifierOptions;
