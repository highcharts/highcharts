/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Wojciech Chmiel
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
export interface InvertModifierOptions extends DataModifierOptions {

    /**
     * Name of the related modifier for these options.
     */
    type: 'Invert';

}


/* *
 *
 *  Default Export
 *
 * */


export default InvertModifierOptions;
