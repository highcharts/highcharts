/* *
 *
 *  Copyright (c) 2019-2019 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 * */

import boostables from './boostables.js';

// These are the series we allow boosting for.

var boostableMap = {};

boostables.forEach(function (item) {
    boostableMap[item] = 1;
});

export default boostableMap;
