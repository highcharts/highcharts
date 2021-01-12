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

import boostables from './Boostables.js';

// These are the series we allow boosting for.

const boostableMap: Record<string, number> = {};

boostables.forEach(function (item: string): void {
    boostableMap[item] = 1;
});

export default boostableMap;
