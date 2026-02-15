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
 *  - Sebastian Bochan
 *
 * */

import type Grid from '../../Core/Grid';
import Table from '../../Core/Table/Table';

import Globals from '../../../Core/Globals.js';
import Credits from '../../Core/Credits.js';

import U from '../../../Core/Utilities.js';
const {
    addEvent,
    pushUnique
} = U;


/* *
 *
 *  Definitions
 *
 * */

let creditsObserver: MutationObserver | undefined;

/**
 * Extends the grid classes with credits.
 *
 * @param GridClass
 * The class to extend.
 *
 * @param TableClass
 * The class to extend.
 *
 */
export function compose(
    GridClass: typeof Grid,
    TableClass: typeof Table
): void {
    if (!pushUnique(Globals.composed, 'CreditsLite')) {
        return;
    }

    addEvent(GridClass, 'afterRenderViewport', initCredits);
    addEvent(TableClass, 'afterDestroy', destroyCredits);
}

/**
 * Callback function called before table initialization.
 */
function initCredits(this: Grid): Credits {
    const credits = new Credits(this);
    const containerStyle = credits.containerElement.style;

    // Apply static styles
    containerStyle.setProperty('display', 'flex', 'important');
    containerStyle.setProperty('padding', '5px 5px 0px 5px', 'important');
    containerStyle.setProperty(
        'flex-direction', 'row-reverse', 'important'
    );

    // Create an observer that check credits modifications
    creditsObserver = new MutationObserver((): void => {
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

    return credits;
}

/**
 * Callback function called after credits destroy.
 */
function destroyCredits(this: Table): void {
    creditsObserver?.disconnect();
}


/* *
 *
 *  Default Export
 *
 * */

export default {
    compose
};
