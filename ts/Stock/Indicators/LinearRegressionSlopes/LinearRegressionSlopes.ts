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
import type LinearRegressionSlopesPoint from './LinearRegressionSlopesPoint';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator,
        linearRegression: LinearRegressionIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    isArray,
    extend,
    merge
} = U;

/* *
 *
 * Class
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
     * @requires     stock/indicators/linearregression
     * @optionparent plotOptions.linearregressionslope
     */
    public static defaultOptions: LinearRegressionParamsOptions = merge(
        LinearRegressionIndicator.defaultOptions
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<LinearRegressionSlopesPoint> = void 0 as any;
    public options: LinearRegressionOptions = void 0 as any;
    public points: Array<LinearRegressionSlopesPoint> = void 0 as any;

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
 *  Prototype Properties
 *
 * */
interface LinearRegressionSlopesIndicator {
    pointClass: typeof LinearRegressionSlopesPoint;
    nameBase: string;
}

extend(LinearRegressionSlopesIndicator.prototype, {
    nameBase: 'Linear Regression Slope Indicator'
});

/**
 *
 * Registry
 *
 */

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
 * @requires  stock/indicators/linearregressionslope
 * @apioption series.linearregressionslope
 */

''; // to include the above in the js output
