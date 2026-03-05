/* *
 *
 *  Grid Credits class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

import CreditsPro from './CreditsPro.js';
import Globals from '../../Core/Globals.js';
import U from '../../../Core/Utilities.js';
import { defaultOptions } from '../../Core/Defaults.js';

const {
    addEvent,
    merge,
    pushUnique
} = U;


/* *
 *
 *  Composition
 *
 * */

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
    if (!pushUnique(Globals.composed, 'CreditsPro')) {
        return;
    }

    merge(true, defaultOptions, {
        credits: CreditsPro.defaultOptions
    });

    // TODO: Change to `beforeLoad` after upgrading grid update.
    addEvent(GridClass, 'afterRenderViewport', initCredits);
}

/**
 * Init configurable credits.
 * @param this
 * Reference to Grid.
 */
function initCredits(this: Grid): void {
    this.credits = new CreditsPro(this, this.options?.credits);
}


/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * Options for the credits label.
         *
         * Try it: {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/grid-pro/credits | Credits options}
         */
        credits?: CreditsOptions;
    }
}

declare module '../../Core/Grid' {
    export default interface Grid {
        credits?: CreditsPro;
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
} as const;
