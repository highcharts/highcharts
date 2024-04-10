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

export interface IKHParamsOptions extends SMAParamsOptions {
    periodTenkan?: number;
    periodSenkouSpanB?: number;
}

export interface IKHOptions extends SMAOptions {
    chikouLine?: Record<string, CSSObject>;
    gapSize?: number;
    kijunLine?: Record<string, CSSObject>;
    marker?: PointMarkerOptions;
    params?: IKHParamsOptions;
    senkouSpan?: IKHSenkouSpanOptions;
    senkouSpanA?: Record<string, CSSObject>;
    senkouSpanB?: Record<string, CSSObject>;
    tenkanLine?: Record<string, CSSObject>;
}
