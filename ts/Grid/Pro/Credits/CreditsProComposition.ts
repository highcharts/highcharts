/* *
 *
 *  Grid Credits class
 *
 *  (c) 2020-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';

import Credits from '../../Core/Credits.js';
import CreditsPro from './CreditsPro.js';
import U from '../../../Core/Utilities.js';

const {
    addEvent,
    merge
} = U;

/* *
 *
 *  Class Namespace
 *
 * */

namespace CreditsProComposition {
    /**
     * Extends the grid classes with customizable credits.
     *
     * @param GridClass
     * The class to extend.
     *
     */
    export function compose(
        GridClass: typeof Grid
    ): void {
        addEvent(GridClass, 'afterRenderViewport', initCreditsComposition);
    }

    /**
     * Callback function called before table initialization.
     */
    function initCreditsComposition(this: Grid): void {
        const creditsOptions =
            merge(Credits.defaultOptions, this.options?.credits);

        this.options = merge(
            this.options,
            {
                credits: creditsOptions
            }
        );

        this.credits = new CreditsPro(
            this,
            creditsOptions
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default CreditsProComposition;
