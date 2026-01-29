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
import type LinearRegressionSlopesPoint from './LinearRegressionSlopesPoint';

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
 * The Linear Regression Slope series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionSlope
 *
 * @augments Highcharts.Series
 */
class LinearRegressionSlopesIndicator extends LinearRegressionIndicator {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Linear regression slope indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-slope
     *         Linear regression slope indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires  stock/indicators/regressions
     * @optionparent plotOptions.linearregressionslope
     */
    public static defaultOptions: LinearRegressionOptions = merge(
        LinearRegressionIndicator.defaultOptions
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<LinearRegressionSlopesPoint>;
    public options!: LinearRegressionOptions;
    public points!: Array<LinearRegressionSlopesPoint>;

    /* *
     *
     *  Functions
     *
     * */

    public getEndPointY(
        lineParameters: RegressionLineParametersObject
    ): number {
        return lineParameters.slope;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface LinearRegressionSlopesIndicator {
    pointClass: typeof LinearRegressionSlopesPoint;
    nameBase: string;
}

extend(LinearRegressionSlopesIndicator.prototype, {
    nameBase: 'Linear Regression Slope Indicator'
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        linearRegressionSlope: typeof LinearRegressionSlopesIndicator;
    }
}

SeriesRegistry.registerSeriesType(
    'linearRegressionSlope',
    LinearRegressionSlopesIndicator
);

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionSlopesIndicator;

/* *
 *
 *  API Options
 *
 * */

/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionslope.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionslope
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregressionslope
 */

''; // To include the above in the js output
