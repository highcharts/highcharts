/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Color from '../../Core/Color/Color';

import BU from './BoostUtils.js';
import init from './BoostInit.js';
import initCanvasBoost from '../../Extensions/BoostCanvas.js';
import './BoostOverrides.js';
import NamedColors from './NamedColors.js';
import U from '../../Core/Utilities.js';
const {
    error
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace BoostComposition {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose(
        ColorClass: typeof Color
    ): void {
        if (!BU.hasWebGLSupport()) {
            if (typeof initCanvasBoost !== 'undefined') {
                // Fallback to canvas boost
                initCanvasBoost();
            } else {
                error(26);
            }
        } else {
            // WebGL support is alright, and we're good to go.
            init();
        }

        ColorClass.names = {
            ...ColorClass.names,
            ...NamedColors.defaultHTMLColorMap
        };
    }

}

export default BoostComposition;
