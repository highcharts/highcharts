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
