/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2021 Torstein Honsi
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

    public data: Array<PyramidPoint> = void 0 as any;

    public options: PyramidSeriesOptions = void 0 as any;

    public points: Array<PyramidPoint> = void 0 as any;

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
