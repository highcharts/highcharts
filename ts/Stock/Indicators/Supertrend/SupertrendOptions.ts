/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../../Core/Color/ColorType';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type LinePoint from '../../../Series/Line/LinePoint';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type SupertrendPoint from './SupertrendPoint';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Supertrend indicator. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js` and
 * `stock/indicators/sma.js`.
 *
 * @sample {highstock} stock/indicators/supertrend
 *         Supertrend indicator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, cropThreshold, negativeColor, colorAxis, joinBy,
 *               keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking, threshold
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/supertrend
 * @optionparent plotOptions.supertrend
 * @interface Highcharts.SupertrendOptions
 */
export interface SupertrendOptions extends SMAOptions {
    /**
     * The styles for the Supertrend line that intersect main series.
     *
     * @sample {highstock} stock/indicators/supertrend/
     *         Example with changeTrendLine
     */
    changeTrendLine?: Record<string, CSSObject>;
    /**
     * Color of the Supertrend series line that is above the main series.
     *
     * @sample {highstock} stock/indicators/supertrend/
     *         Example with fallingTrendColor
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    fallingTrendColor?: ColorType;
    params?: SupertrendParamsOptions;
    /**
     * Color of the Supertrend series line that is beneath the main series.
     *
     * @sample {highstock} stock/indicators/supertrend/
     *         Example with risingTrendColor
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    risingTrendColor?: ColorType;
}

export interface SupertrendParamsOptions extends SMAParamsOptions {
    /**
     * Multiplier for Supertrend Indicator.
     */
    multiplier?: number;
    /**
     * The base period for indicator Supertrend Indicator calculations.
     * This is the number of data points which are taken into account
     * for the indicator calculations.
     */
    period?: number;

    /* *
     *
     *  Excluded
     *
     * */

    index?: undefined;
}

/** @internal */
export interface SupertrendLinkedParentPointObject extends LinePoint {
    close: number;
    index: number;
    x: number;
}

/** @internal */
export interface SupertrendLinkedParentObject extends LineSeries {
    data: Array<SupertrendLinkedParentPointObject>;
    points: Array<SupertrendLinkedParentPointObject>;
    xData: Array<number>;
    yData: Array<Array<number>>;
}

/** @internal */
export interface SupertrendGappedExtensionObject {
    options?: SupertrendGappedExtensionOptions;
}

/** @internal */
export interface SupertrendGappedExtensionOptions {
    gapSize?: number;
}

/** @internal */
export interface SupertrendGroupedPointsObject {
    bottom: Array<SupertrendPoint>;
    intersect: Array<SupertrendPoint>;
    top: Array<SupertrendPoint>;
}

/** @internal */
export interface SupertrendLineObject {
    [index: string]: (AnyRecord|undefined);
}

/* *
 *
 *  Default Export
 *
 * */

export default SupertrendOptions;
