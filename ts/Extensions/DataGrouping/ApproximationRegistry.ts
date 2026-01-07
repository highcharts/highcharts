/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { ApproximationTypeRegistry } from './ApproximationType';

/* *
 *
 *  Constants
 *
 * */

/**
 * Define the available approximation types. The data grouping
 * approximations takes an array or numbers as the first parameter. In case
 * of ohlc, four arrays are sent in as four parameters. Each array consists
 * only of numbers. In case null values belong to the group, the property
 * .hasNulls will be set to true on the array.
 *
 * @product highstock
 *
 * @private
 */
const ApproximationRegistry = {
    // Approximations added programmatically
} as ApproximationTypeRegistry;

/* *
 *
 *  Default Export
 *
 * */

export default ApproximationRegistry;
