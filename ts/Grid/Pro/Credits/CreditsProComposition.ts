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
import CreditsLiteComposition from '../../Lite/Credits/CreditsLiteComposition.js';
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

/**
 * Options for the credits label.
 */
export interface CreditsOptions {
    /**
     * Whether to show the credits.
     *
     * @default true
     */
    enabled?: boolean;

    /**
     * The URL that will be opened when the credits label is clicked.
     *
     * @default 'https://www.highcharts.com?credits'
     */
    href?: string;

    /**
     * The text for the credits label.
     *
     * Reference to Highcharts icon, that is enabled in Grid Lite, by default.
     *
     */
    text?: string;

    /**
     * The position of the credits label.
     *
     * @default 'bottom'
     */
    position?: 'bottom' | 'top';
}

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
            merge(CreditsLiteComposition.defaultOptions, this.options?.credits);

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
