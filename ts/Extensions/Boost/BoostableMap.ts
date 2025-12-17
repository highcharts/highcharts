/* *
 *
 *  (c) 2019-2025 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
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

/**
 * These are the series we allow boosting for.
 * @internal
 */
const BoostableMap: Record<string, boolean> = {};
Boostables.forEach((item: string): void => {
    BoostableMap[item] = true;
});

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BoostableMap;
