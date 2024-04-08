/* *
 *
 *  (c) 2010-2024 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';
import BellcurveSeries from './BellcurveSeries';
import DerivedComposition from '../DerivedComposition';
import {
    SeriesStatesOptions,
    ColorType,
    PointMarkerOptions
} from '../../Core/Series/SeriesOptions';
import {
    SeriesStatesOptions,
    ColorType,
    PointMarkerOptions
} from '../../Core/Series/SeriesOptions';
import DerivedComposition from '../DerivedComposition';
import BellcurveSeries from './BellcurveSeries';
import AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';

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
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to
 * [plotOptions.bellcurve](#plotOptions.bellcurve).
 *
 * @sample {highcharts} highcharts/demo/bellcurve/
 * Bell curve
 *
 * @since 6.0.0
 *
 * @product highcharts
 *
 * @extends   plotOptions.areaspline
 * @excluding boostThreshold, connectNulls, dragDrop, stacking, pointInterval,
 *            pointIntervalUnit
 *
 * @extends   series,plotOptions.bellcurve
 * @excluding dataParser, dataURL, data, boostThreshold, boostBlending
 *
 * @requires modules/bellcurve
 */
export interface BellcurveSeriesOptions extends AreaSplineSeriesOptions, DerivedComposition.SeriesOptions {
    /**
     * An integer identifying the index to use for the base series, or a string
     * representing the id of the series.
     *
     * @type {number|string}
     * @apioption series.bellcurve.baseSeries
     */
    baseSeries?: (number|string);
    data?: undefined;
    /**
     * This option allows to define the length of the bell curve. A unit of
     * the length of the bell curve is standard deviation.
     *
     * @sample highcharts/plotoptions/bellcurve-intervals-pointsininterval
     *         Intervals and points in interval
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
    states?: SeriesStatesOptions<BellcurveSeries>;

    marker?: PointMarkerOptions;

    /**
     * @see [color](#series.bellcurve.color)
     * @see [fillColor](#series.bellcurve.fillColor)
     * @default {highcharts} 0.75
     * @default {highstock} 0.75
     * @apioption series.bellcurve.fillOpacity
     */
    fillOpacity?: number;

    /**
     * @see [color](#series.bellcurve.color)
     * @see [fillOpacity](#series.bellcurve.fillOpacity)
     * @apioption series.bellcurve.fillColor
     */
    fillColor?: ColorType;

    /**
     * @see [fillColor](#series.bellcurve.fillColor)
     * @see [fillOpacity](#series.bellcurve.fillOpacity)
     * @apioption series.bellcurve.color
     */
    color?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default BellcurveSeriesOptions;
