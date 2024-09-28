/* *
 *
 *  (c) 2010-2024 Kamil Musiałowski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *  Imports
 *
 * */

import PointAndFigureSeriesDefaults from './PointAndFigureSeriesDefaults.js';
import PointAndFigureSeriesOptions from './PointAndFigureSeriesOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { scatter: ScatterSeries } = SeriesRegistry.seriesTypes;

import U from '../../Core/Utilities.js';
const {
    merge
} = U;


/* *
 *
 *  Declarations
 *
 * */


/* *
 *
 *  Functions
 *
 * */


/* *
 *
 *  Class
 *
 * */

/**
 * The series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pointandfigure
 *
 * @augments Highcharts.Series
 */
class PointAndFigureSeries extends ScatterSeries {

    /* *
     *
     *  Static Properties
     *
    * */

    public static defaultOptions: PointAndFigureSeriesOptions = merge(
        ScatterSeries.defaultOptions,
        PointAndFigureSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */


    /* *
     *
     *  Properties
     *
     * */


    /* *
     *
     *  Functions
     *
     * */


}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pointandfigure: typeof PointAndFigureSeries;
    }
}

SeriesRegistry.registerSeriesType('pointandfigure', PointAndFigureSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSeries;
