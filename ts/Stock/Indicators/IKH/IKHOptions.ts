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
import type IKHIndicator from './IKHIndicator';
import type IKHPoint from './IKHPoint';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';
import type { SMAParamsOptions, SMAOptions } from '../SMA/SMAOptions';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';

/* *
 *
 * Declarations
 *
 * */

export interface IKHMarkerOptions extends PointMarkerOptions {
    /**
     * @default false
     */
    enabled?: PointMarkerOptions['enabled'];
}

/**
 * Ichimoku Kinko Hyo (IKH). This series requires `linkedTo` option to be
 * set.
 *
 * @sample {highstock} stock/indicators/ichimoku-kinko-hyo
 *         Ichimoku Kinko Hyo indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ichimoku-kinko-hyo
 * @interface Highcharts.IKHOptions
 */
export interface IKHOptions extends SMAOptions {
    /**
     * The styles for Chikou line
     */
    chikouLine?: Record<string, CSSObject>;

    /**
     * The styles for Kijun line
     */
    kijunLine?: Record<string, CSSObject>;

    marker?: IKHMarkerOptions;

    params?: IKHParamsOptions;

    /**
     * The styles for area between Senkou Span A and B.
     */
    senkouSpan?: IKHSenkouSpanOptions;

    /**
     * The styles for Senkou Span A line
     */
    senkouSpanA?: Record<string, CSSObject>;

    /**
     * The styles for Senkou Span B line
     */
    senkouSpanB?: Record<string, CSSObject>;

    /**
     * The styles for Tenkan line
     */
    tenkanLine?: Record<string, CSSObject>;
}

export interface IKHParamsOptions extends SMAParamsOptions {
    /**
     * The base period for Tenkan calculations.
     */
    periodTenkan?: number;
    /**
     * The base period for Senkou Span B calculations
     */
    periodSenkouSpanB?: number;

    /* *
     *
     *  Excluded
     *
     * */

    index?: undefined;
}

/** @internal */
export interface IKHDrawSenkouSpanObject {
    indicator: IKHIndicator;
    points: Array<IKHPoint>;
    nextPoints: Array<IKHPoint>;
    color?: ColorType;
    options: IKHOptions;
    gap: IKHGapExtensionObject;
    graph: (SVGElement|undefined);
}

export interface IKHSenkouSpanOptions {
    /**
     * Color of the area between Senkou Span A and B,
     * when Senkou Span A is above Senkou Span B. Note that if
     * a `style.fill` is defined, the `color` takes precedence and
     * the `style.fill` is ignored.
     *
     * @see [senkouSpan.styles.fill](#series.ikh.senkouSpan.styles.fill)
     *
     * @sample {highstock} stock/indicators/ichimoku-kinko-hyo
     *         Ichimoku Kinko Hyo color
     *
     * @since     7.0.0
     */
    color?: ColorType;
    /**
     * Color of the area between Senkou Span A and B,
     * when Senkou Span A is under Senkou Span B.
     *
     * @sample {highstock} stock/indicators/ikh-negative-color
     *         Ichimoku Kinko Hyo negativeColor
     *
     * @since     7.0.0
     */
    negativeColor?: ColorType;
    styles?: CSSObject & {
        /**
         * Color of the area between Senkou Span A and B.
         *
         * @deprecated
         */
        fill: ColorType;
    };
}

/** @internal */
export interface IKHGapExtensionObject {
    options?: IKHGapSizeOptions;
}

/** @internal */
export interface IKHGapSizeOptions {
    gapSize?: IKHOptions['gapSize'];
}
