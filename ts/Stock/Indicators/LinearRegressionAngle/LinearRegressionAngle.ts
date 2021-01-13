/**
 *
 *  (c) 2010-2021 Kamil Kulig
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    LinearRegressionOptions,
    LinearRegressionParamsOptions,
    RegressionLineParametersObject
} from '../LinearRegression/LinearRegressionOptions';
import type LinearRegressionAnglePoint from './LinearRegressionAnglePoint';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator,
        linearRegression: LinearRegressionIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 * Class
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
     * @requires     stock/indicators/linearregressionangle
     * @optionparent plotOptions.linearregressionangle
     */
    public static defaultOptions: LinearRegressionParamsOptions = merge(
        SMAIndicator.defaultOptions, {
            tooltip: { // add a degree symbol
                pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                '{series.name}: <b>{point.y}°</b><br/>'
            }
        } as LinearRegressionParamsOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<LinearRegressionAnglePoint> = void 0 as any;
    public options: LinearRegressionOptions = void 0 as any;
    public points: Array<LinearRegressionAnglePoint> = void 0 as any;

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
        return Math.atan(slope) * (180 / Math.PI); // rad to deg
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
 *  Prototype Properties
 *
 * */

interface LinearRegressionAngleIndicator {
    pointClass: typeof LinearRegressionAnglePoint;
    nameBase: string;
}

extend(LinearRegressionAngleIndicator.prototype, {
    nameBase: 'Linear Regression Angle Indicator'
});

/**
 *
 * Registry
 *
 */

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
 * @requires  stock/indicators/linearregressionangle
 * @apioption series.linearregressionangle
 */

''; // to include the above in the js output
