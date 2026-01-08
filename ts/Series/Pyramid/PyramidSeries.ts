/* *
 *
 *  Highcharts funnel module
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

import type PyramidPoint from './PyramidPoint';
import type PyramidSeriesOptions from './PyramidSeriesOptions';

import FunnelSeries from '../Funnel/FunnelSeries.js';
import PyramidSeriesDefaults from './PyramidSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Pyramid series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pyramid
 *
 * @augments Highcharts.Series
 */
class PyramidSeries extends FunnelSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A pyramid series is a special type of funnel, without neck and reversed
     * by default.
     *
     * @sample highcharts/demo/pyramid/
     *         Pyramid chart
     *
     * @extends      plotOptions.funnel
     * @product      highcharts
     * @requires     modules/funnel
     * @optionparent plotOptions.pyramid
     */
    public static defaultOptions: PyramidSeriesOptions = merge(
        FunnelSeries.defaultOptions,
        PyramidSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<PyramidPoint>;

    public options!: PyramidSeriesOptions;

    public points!: Array<PyramidPoint>;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface PyramidSeries {
    pointClass: typeof PyramidPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pyramid: typeof PyramidSeries;
    }
}

SeriesRegistry.registerSeriesType('pyramid', PyramidSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PyramidSeries;
