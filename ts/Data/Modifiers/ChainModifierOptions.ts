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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */


import type DataModifierOptions from './DataModifierOptions';
import type { DataModifierTypeOptions } from './DataModifierType';

/* *
 *
 *  Declarations
 *
 * */


/**
 * Options to configure the chain modifier.
 */
export interface ChainModifierOptions extends DataModifierOptions {

    /**
     * Name of the related modifier for these options.
     */
    type: 'Chain';

    /**
     * Array of options of the chain modifiers.
     */
    chain?: Array<Partial<DataModifierTypeOptions>>;

    /**
     * Whether to revert the order before execution.
     */
    reverse?: boolean;

}


/* *
 *
 *  Default Export
 *
 * */


export default ChainModifierOptions;
