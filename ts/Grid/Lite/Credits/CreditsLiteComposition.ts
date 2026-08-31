/* *
 *
 *  Grid Credits class
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 *  Authors:
 *  - Sebastian Bochan
 *
 * */

import type Grid from '../../Core/Grid';

import Globals from '../../../Core/Globals.js';
import Credits from '../../Core/Credits.js';

import { addEvent, pushUnique } from '../../../Shared/Utilities.js';


/* *
 *
 *  Definitions
 *
 * */

const creditsObservers = new WeakMap<Grid, MutationObserver>();

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
    addEvent(GridClass, 'beforeDestroy', destroyCredits);
    addEvent(GridClass, 'beforeRenderViewport', destroyCredits);
}

/**
 * Callback function called before table initialization.
 */
function initCredits(this: Grid): void {
    const credits = new Credits(this);
    const containerStyle = credits.containerElement.style;

    // Apply static styles
    containerStyle.setProperty('display', 'flex', 'important');
    containerStyle.setProperty('padding', '5px 5px 0px 5px', 'important');
    containerStyle.setProperty(
        'flex-direction', 'row-reverse', 'important'
    );

    // Create an observer that check credits modifications
    const creditsObserver = new MutationObserver((): void => {
        if (!credits.containerElement.querySelector('.hcg-credits')) {
            credits.render();
        }
    });

    // Start observing the credits
    creditsObserver.observe(credits.containerElement, {
        attributes: true,
        childList: true,
        subtree: true
    });

    creditsObservers.set(this, creditsObserver);
}

/**
 * Callback function called after credits destroy.
 */
function destroyCredits(this: Grid): void {
    creditsObservers.get(this)?.disconnect();
    creditsObservers.delete(this);
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
