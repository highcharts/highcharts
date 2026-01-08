/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';
import type DerivedComposition from '../DerivedComposition';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type { PointMarkerOptions, PointShortOptions } from '../../Core/Series/PointOptions';
import type ColorType from '../../Core/Color/ColorType';
import BellcurvePointOptions from './BellcurvePointOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * A bell curve is an areaspline series which represents the probability
 * density function of the normal distribution. It calculates mean and
 * standard deviation of the base series data and plots the curve according
 * to the calculated parameters.
 *
 * A `bellcurve` series. If the [type](#series.bellcurve.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to
 * [plotOptions.bellcurve](#plotOptions.bellcurve).
 *
 * @sample {highcharts} highcharts/demo/bellcurve/
 *          Bell curve
 *
 * @extends plotOptions.areaspline
 *
 * @extends series,plotOptions.bellcurve
 *
 * @since 6.0.0
 *
 * @product highcharts
 *
 * @excluding boostThreshold, connectNulls, dragDrop, stacking, pointInterval,
 *            pointIntervalUnit
 *
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 *
 * @requires modules/histogram-bellcurve
 */
export interface BellcurveSeriesOptions extends AreaSplineSeriesOptions, DerivedComposition.SeriesOptions {

    /**
     * An integer identifying the index to use for the base series, or a string
     * representing the id of the series.
     *
     * @type {number|string}
     */
    baseSeries?: (number|string);

    /**
     * An array of data points for the series. For the `bellcurve` series type,
     * points can be given in the following way:
     *
     * An array of numerical values. In this case, the numerical values will
     *  be
     *    used to calculate the `x` and `y` values. Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * Data can also be passed in the form of a derived series.
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @type {Array<number|null>|null|*}
     *
     * @extends series.line.data
     *
     * @product highcharts
     */
    data?: Array<(BellcurvePointOptions|PointShortOptions)>;

    /**
     * This option allows to define the length of the bell curve. A unit of
     * the length of the bell curve is standard deviation.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *          Intervals and points in interval
     */
    intervals: number;

    /**
     * Defines how many points should be plotted within 1 interval. See
     * `plotOptions.bellcurve.intervals`.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *         Intervals and points in interval
     */
    pointsInInterval: number;
    states?: SeriesStatesOptions<BellcurveSeriesOptions>;

    marker?: PointMarkerOptions;

    /**
     *
     * @see [color](#plotOptions.bellcurve.color)
     *
     * @see [fillColor](#plotOptions.bellcurve.fillColor)
     *
     * @see [color](#series.bellcurve.color)
     *
     * @see [fillColor](#series.bellcurve.fillColor)
     *
     * @default {highcharts} 0.75
     *
     * @default {highstock} 0.75
     */
    fillOpacity?: number;

    /**
     *
     * @see [color](#plotOptions.bellcurve.color)
     *
     * @see [fillOpacity](#plotOptions.bellcurve.fillOpacity)
     *
     * @see [color](#series.bellcurve.color)
     *
     * @see [fillOpacity](#series.bellcurve.fillOpacity)
     */
    fillColor?: ColorType;

    /**
     *
     * @see [fillColor](#plotOptions.bellcurve.fillColor)
     *
     * @see [fillOpacity](#plotOptions.bellcurve.fillOpacity)
     *
     * @see [fillColor](#series.bellcurve.fillColor)
     *
     * @see [fillOpacity](#series.bellcurve.fillOpacity)
     */
    color?: ColorType;
}

export default BellcurveSeriesOptions;
