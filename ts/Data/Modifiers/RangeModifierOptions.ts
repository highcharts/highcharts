/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
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
export interface RangeModifierOptions extends DataModifierOptions {

    /**
     * Name of the related modifier for these options.
     */
    type: 'Range';

    /**
     * If set to true, multiple ranges will add up instead of reduce.
     */
    additive?: boolean;

    /**
     * Value ranges to include in the result.
     */
    ranges: Array<RangeModifierRangeOptions>;

    /**
     * If set to true, it will also compare the value type.
     */
    strict?: boolean;

}

/**
 * Options to configure a range.
 */
export interface RangeModifierRangeOptions {

    /**
     * Column containing the values to filter.
     */
    column: string;

    /**
     * Maximum including value (`<=` operator).
     */
    maxValue: (boolean|number|string);

    /**
     * Minimum including value (`>=` operator).
     */
    minValue: (boolean|number|string);

}

/* *
 *
 *  Default Export
 *
 * */

export default RangeModifierOptions;
