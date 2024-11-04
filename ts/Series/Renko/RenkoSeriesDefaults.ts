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
 * A Renko series is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * @sample stock/demo/renko/
 *         Renko series
 *
 *
 * @sample stock/demo/renko-vs-heikinashi-vs-candlestick
 *         Renko series
 *
 * @extends      plotOptions.column
 * @excluding boost, boostBlending, boostThreshold, centerInCategory,
 * cumulative, cumulativeStart, dashStyle, dragDrop, dataSorting, edgeColor,
 * stacking, getExtremesFromAll, clip, colorByPoint, compare, compareBase,
 * compareStart, compareTo, dataGrouping, edgeWidth, lineColor, linkedTo,
 * pointPadding, pointPlacement, pointRange, pointStart, pointWidth
 * @product      highstock
 * @requires     modules/renko
 * @optionparent plotOptions.renko
 */
const RenkoDefaults: RenkoSeriesOptions = {
    /**
     * The size of the individual box, representing a point. Can be set in yAxis
     * value, or percent value of the first point e.g. if first point's value is
     * 200, and box size is set to `20%`, the box will be 40, so the new point
     * will be drawn when the next value changes for more than 40.
     */
    boxSize: 4,
    groupPadding: 0,
    pointPadding: 0,
    downColor: '#ff0000',
    navigatorOptions: {
        type: 'renko'
    },
    fillColor: 'transparent',
    borderWidth: 2,
    lineWidth: 0,
    stickyTracking: true,
    borderRadius: {
        where: 'all'
    } as BorderRadiusOptionsObject,
    tooltip: {
        pointFormat:
            '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low:.2f} - {point.y:.2f}</b><br/>'
    }
};

/* *
 *
 *  API Options
 *
 * */

/**
 * A `renko` series. If the [type](#series.renko.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.renko
 * @product   highstock
 * @excluding boost, compare, compareStart, connectNulls, cumulative,
 * cumulativeStart, dataGrouping, dataParser, dataSorting, dataURL,
 * dragDrop, marker, step
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
