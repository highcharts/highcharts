/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Dawid Draguła
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
     * Zero-based index at which to start the range. If not set, the range
     * starts at the beginning of the table.
     */
    start?: number;

    /**
     * Zero-based index at which to end the range. The row at this index
     * is not included in the range. If not set, the range ends at the end of
     * the table.
     */
    end?: number;
}


/* *
 *
 *  Default Export
 *
 * */

export default RangeModifierOptions;
