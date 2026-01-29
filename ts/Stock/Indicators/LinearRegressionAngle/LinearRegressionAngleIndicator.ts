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
import type LinearRegressionAnglePoint from './LinearRegressionAnglePoint';

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
 * The Linear Regression Angle series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionAngle
 *
 * @augments Highcharts.Series
 */
class LinearRegressionAngleIndicator extends LinearRegressionIndicator {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Linear regression angle indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-angle
     *         Linear intercept angle indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires  stock/indicators/regressions
     * @optionparent plotOptions.linearregressionangle
     */
    public static defaultOptions: LinearRegressionOptions = merge(
        LinearRegressionIndicator.defaultOptions,
        {
            tooltip: { // Add a degree symbol
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                '{series.name}: <b>{point.y}°</b><br/>'
            }
        } as LinearRegressionOptions
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<LinearRegressionAnglePoint>;
    public options!: LinearRegressionOptions;
    public points!: Array<LinearRegressionAnglePoint>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Convert a slope of a line to angle (in degrees) between
     * the line and x axis
     * @private
     * @param {number} slope of the straight line function
     * @return {number} angle in degrees
     */
    public slopeToAngle(
        slope: number
    ): number {
        return Math.atan(slope) * (180 / Math.PI); // Rad to deg
    }

    public getEndPointY(
        this: LinearRegressionAngleIndicator,
        lineParameters: RegressionLineParametersObject
    ): number {
        return this.slopeToAngle(lineParameters.slope);
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface LinearRegressionAngleIndicator {
    pointClass: typeof LinearRegressionAnglePoint;
    nameBase: string;
}

extend(LinearRegressionAngleIndicator.prototype, {
    nameBase: 'Linear Regression Angle Indicator'
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        linearRegressionAngle: typeof LinearRegressionAngleIndicator;
    }
}

SeriesRegistry.registerSeriesType(
    'linearRegressionAngle',
    LinearRegressionAngleIndicator
);

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionAngleIndicator;

/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionangle.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionangle
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @apioption series.linearregressionangle
 */

''; // To include the above in the js output
