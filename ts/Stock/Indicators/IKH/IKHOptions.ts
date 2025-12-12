/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */
import type ColorType from '../../../Core/Color/ColorType';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type DataGroupingOptions from '../../../Extensions/DataGrouping/DataGroupingOptions';
import type IKHIndicator from './IKHIndicator';
import type IKHPoint from './IKHPoint';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';
import type { SMAParamsOptions, SMAOptions } from '../SMA/SMAOptions';
import type SVGElement from '../../../Core/Renderer/SVG/SVGElement';
import type TooltipOptions from '../../../Core/TooltipOptions';

/* *
 *
 * Declarations
 *
 * */

/**
 * Ichimoku Kinko Hyo (IKH). This series requires `linkedTo` option to be
 * set.
 *
 * @sample stock/indicators/ichimoku-kinko-hyo
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
 * @optionparent plotOptions.ikh
 * @interface Highcharts.IKHOptions
 */
export interface IKHOptions extends SMAOptions {
    /**
     * @excluding index
     */
    params?: IKHParamsOptions;

    chikouLine?: Record<string, CSSObject>;
    gapSize?: number;
    kijunLine?: Record<string, CSSObject>;
    marker?: PointMarkerOptions;
    senkouSpan?: IKHSenkouSpanOptions;
    senkouSpanA?: Record<string, CSSObject>;
    senkouSpanB?: Record<string, CSSObject>;
    tenkanLine?: Record<string, CSSObject>;

    tooltip?: Partial<TooltipOptions>;

    dataGrouping?: DataGroupingOptions;
}

export interface IKHParamsOptions extends SMAParamsOptions {
    periodTenkan?: number;
    periodSenkouSpanB?: number;
}

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
    color?: ColorType;
    negativeColor?: ColorType;
    styles?: CSSObject & { fill: ColorType };
}

export interface IKHGapExtensionObject {
    options?: IKHGapSizeOptions;
}

export interface IKHGapSizeOptions {
    gapSize?: IKHOptions['gapSize'];
}

/* *
 *
 *  Default Export
 *
 * */

export default IKHOptions;
