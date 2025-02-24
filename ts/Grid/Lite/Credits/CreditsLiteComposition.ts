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
 *  - Sebastian Bochan
 *
 * */

import type Grid from '../../Core/Grid';
import Credits from '../../Core/Credits';

import U from '../../../Core/Utilities.js';
const {
    addEvent
} = U;

namespace CreditsLiteComposition {
    /**
     * Extends the grid classes with credits.
     *
     * @param GridClass
     * The class to extend.
     *
     */
    export function compose(
        GridClass: typeof Grid
    ): void {
        addEvent(GridClass, 'afterRenderViewport', initCredits);
    }

    /**
     * Callback function called before table initialization.
     */
    function initCredits(this: Grid): void {
        new Credits(this, Credits.defaultOptions);
    }
}

export default CreditsLiteComposition;
