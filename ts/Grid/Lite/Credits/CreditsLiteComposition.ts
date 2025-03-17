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

import Globals from '../../../Core/Globals.js';
import Credits from '../../Core/Credits.js';

import U from '../../../Core/Utilities.js';
const {
    addEvent,
    pushUnique
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
        if (!pushUnique(Globals.composed, 'CreditsLite')) {
            return;
        }

        addEvent(GridClass, 'afterRenderViewport', initCredits);
    }

    /**
     * Callback function called before table initialization.
     */
    function initCredits(this: Grid): Credits {
        const credits = new Credits(this);
        const containerStyle = credits.containerElement.style;

        // Apply static styles
        containerStyle.setProperty('display', 'inline-block', 'important');
        containerStyle.setProperty('padding', '5px 0px 0px', 'important');
        containerStyle.setProperty('text-align', 'right', 'important');

        // Create an observer that check credits modifications
        const creditsObserver = new MutationObserver((e) => {
            if (!credits.containerElement.querySelector('.hcg-logo-wrapper')) {
                credits.render();
            }
        });

        // Start observing the credits
        creditsObserver.observe(credits.containerElement, {
            attributes: true,
            childList: true,
            subtree: true
        });

        return credits;
    }
}

export default CreditsLiteComposition;
