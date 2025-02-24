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
import { CreditsOptions } from '../../Core/Options.js';
import Credits from '../../Core/Credits.js';

import U from '../../../Core/Utilities.js';
const {
    addEvent
} = U;

namespace CreditsLiteComposition {

    /**
     * Default options of the credits.
     */
    export const defaultOptions: CreditsOptions = {
        enabled: true,
        text: '<img src="https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2021/05/19085042/favicon-1.ico">',
        href: 'https://www.highcharts.com',
        position: 'bottom'
    };

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
    function initCredits(this: Grid): Credits {
        return new Credits(this, defaultOptions);
    }
}

export default CreditsLiteComposition;
