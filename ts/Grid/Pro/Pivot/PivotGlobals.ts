/* *
 *
 *  Grid Pivot globals
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import Globals from '../../Core/Globals.js';


/* *
 *
 *  Constants
 *
 * */

export const classNames = {
    grandTotalRow: Globals.classNamePrefix + 'pivot-grand-total-row',
    totalColumn: Globals.classNamePrefix + 'pivot-total-column'
} as const;


/* *
 *
 *  Default Export
 *
 * */

export default {
    classNames
} as const;
