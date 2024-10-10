/* *
 *
 *  (c) 2010-2024 Pawel Lysy
 *
 *  License: www.highcharts.com/license
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

import type { BorderRadiusOptionsObject } from '../../Extensions/BorderRadius';
import type RenkoSeriesOptions from './RenkoSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * An Renko series is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * @sample stock/demo/renko/
 *         Renko series
 *
 * @extends      plotOptions.column
 * @product      highstock
 * @requires     modules/renko
 * @optionparent plotOptions.renko
 */
const RenkoDefaults: RenkoSeriesOptions = {
    boxSize: 4,
    groupPadding: 0,
    pointPadding: 0,
    downColor: '#ff0000',
    navigatorOptions: {
        type: 'renko',
        dataGrouping: { enabled: false }
    },
    fillColor: 'transparent',
    borderWidth: 2,
    lineWidth: 0,
    keys: ['x', 'y', 'low', 'color'],
    stickyTracking: true,
    borderRadius: {
        where: 'all'
    } as BorderRadiusOptionsObject,
    tooltip: {
        pointFormat:
            '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low:.2f} - {point.y:.2f}</b><br/>'
    }
};

/**
 * A `renko` series. If the [type](#series.renko.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.renko
 * @excluding dataParser, dataURL, marker
 * @product   highstock
 * @requires  modules/renko
 * @apioption series.renko
 */

(''); // Adds doclets above to transpiled

/* *
 *
 *  Default Export
 *
 * */

export default RenkoDefaults;
