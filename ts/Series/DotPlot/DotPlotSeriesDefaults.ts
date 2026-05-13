/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Dot plot series type for Highcharts
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DotPlotSeriesOptions from './DotPlotSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

const DotPlotSeriesDefaults: DotPlotSeriesOptions = {
    itemPadding: 0.1,
    marker: {
        symbol: 'circle',
        states: {
            hover: {},
            select: {}
        }
    },
    slotsPerBar: void 0
};

/* *
 *
 *  Default Export
 *
 * */

export default DotPlotSeriesDefaults;
