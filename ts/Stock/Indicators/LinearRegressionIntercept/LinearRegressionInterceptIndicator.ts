// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Kulig
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

import type {
    LinearRegressionOptions,
    RegressionLineParametersObject
} from '../LinearRegression/LinearRegressionOptions';
import type LinearRegressionInterceptPoint from
    './LinearRegressionInterceptPoint';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    linearRegression: LinearRegressionIndicator
} = SeriesRegistry.seriesTypes;
import U from '../../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Linear Regression Intercept series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionIntercept
 *
 * @augments Highcharts.Series
 */
class LinearRegressionInterceptIndicator extends LinearRegressionIndicator {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Linear regression intercept indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-intercept
     *         Linear intercept slope indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires  stock/indicators/regressions
     * @optionparent plotOptions.linearregressionintercept
     */
    public static defaultOptions: LinearRegressionOptions = merge(
        LinearRegressionIndicator.defaultOptions
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<LinearRegressionInterceptPoint>;
    public options!: LinearRegressionOptions;
    public points!: Array<LinearRegressionInterceptPoint>;

    /* *
     *
     *  Functions
     *
     * */

    public getEndPointY(
        lineParameters: RegressionLineParametersObject
    ): number {
        return lineParameters.intercept;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface LinearRegressionInterceptIndicator {
    pointClass: typeof LinearRegressionInterceptPoint;
    nameBase: string;
}

extend(LinearRegressionInterceptIndicator.prototype, {
    nameBase: 'Linear Regression Intercept Indicator'
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        linearRegressionIntercept: typeof LinearRegressionInterceptIndicator;
    }
}

SeriesRegistry.registerSeriesType(
    'linearRegressionIntercept',
    LinearRegressionInterceptIndicator
);

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionInterceptIndicator;

/* *
 *
 *  API Options
 *
 * */

/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionintercept.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionintercept
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregressionintercept
 */

''; // To include the above in the js output
