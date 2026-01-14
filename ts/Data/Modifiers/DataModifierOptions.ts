/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
