/* *
 *
 *  Copyright (c) 2019-2020 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import boostables from './Boostables.js';
// These are the series we allow boosting for.
var boostableMap = {};
boostables.forEach(function (item) {
    boostableMap[item] = 1;
});
export default boostableMap;
