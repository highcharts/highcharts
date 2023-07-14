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

import Boostables from './Boostables.js';

/* *
 *
 *  Constants
 *
 * */

// These are the series we allow boosting for.
const BoostableMap: Record<string, boolean> = {};
Boostables.forEach((item: string): void => {
    BoostableMap[item] = true;
});

/* *
 *
 *  Default Export
 *
 * */

export default BoostableMap;
