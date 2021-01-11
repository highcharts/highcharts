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
import butils from './BoostUtils.js';
import init from './BoostInit.js';
import initCanvasBoost from '../../Extensions/BoostCanvas.js';
import './BoostOverrides.js';
import './NamedColors.js';
import U from '../../Core/Utilities.js';
var error = U.error;
// These need to be fixed when we support named imports
var hasWebGLSupport = butils.hasWebGLSupport;
if (!hasWebGLSupport()) {
    if (typeof initCanvasBoost !== 'undefined') {
        // Fallback to canvas boost
        initCanvasBoost();
    }
    else {
        error(26);
    }
}
else {
    // WebGL support is alright, and we're good to go.
    init();
}
