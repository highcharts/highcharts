/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Dot plot series type for Highcharts
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
