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
 *  - Gøran Slettemark
 *
 * */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type { DataModifierTypes } from './DataModifierType';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Options to configure the modifier.
 */
export interface DataModifierOptions {

    /**
     * Type of the related modifier for these options.
     */
    type: keyof DataModifierTypes;

}


/* *
 *
 *  Default Export
 *
 * */


export default DataModifierOptions;
