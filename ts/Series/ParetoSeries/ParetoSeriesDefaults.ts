/* *
 *
 *  (c) 2010-2021 Sebastian Bochan
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

import type ParetoSeriesOptions from './ParetoSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A pareto diagram is a type of chart that contains both bars and a line
 * graph, where individual values are represented in descending order by
 * bars, and the cumulative total is represented by the line.
 *
 * @sample {highcharts} highcharts/demo/pareto/
 *         Pareto diagram
 *
 * @extends      plotOptions.line
 * @since        6.0.0
 * @product      highcharts
 * @excluding    allAreas, boostThreshold, borderColor, borderRadius,
 *               borderWidth, crisp, colorAxis, depth, data, dragDrop,
 *               edgeColor, edgeWidth, findNearestPointBy, gapSize, gapUnit,
 *               grouping, groupPadding, groupZPadding, maxPointWidth, keys,
 *               negativeColor, pointInterval, pointIntervalUnit,
 *               pointPadding, pointPlacement, pointRange, pointStart,
 *               pointWidth, shadow, step, softThreshold, stacking,
 *               threshold, zoneAxis, zones, boostBlending
 * @requires     modules/pareto
 * @optionparent plotOptions.pareto
 */
const ParetoSeriesDefaults: ParetoSeriesOptions = {

    /**
     * Higher zIndex than column series to draw line above shapes.
     */
    zIndex: 3

};

/**
 * A `pareto` series. If the [type](#series.pareto.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pareto
 * @since     6.0.0
 * @product   highcharts
 * @excluding data, dataParser, dataURL, boostThreshold, boostBlending
 * @requires  modules/pareto
 * @apioption series.pareto
 */

/**
 * An integer identifying the index to use for the base series, or a string
 * representing the id of the series.
 *
 * @type      {number|string}
 * @default   undefined
 * @apioption series.pareto.baseSeries
 */

/**
 * An array of data points for the series. For the `pareto` series type,
 * points are calculated dynamically.
 *
 * @type      {Array<Array<number|string>|*>}
 * @extends   series.column.data
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.pareto.data
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default ParetoSeriesDefaults;
