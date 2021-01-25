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
import ColorType from '../../../Core/Color/ColorType';
import CSSObject from '../../../Core/Renderer/CSSObject';
import { PointMarkerOptions } from '../../../Core/Series/PointOptions';
import type { SMAParamsOptions, SMAOptions } from '../SMA/SMAOptions';
import IKHIndicator from './IKHIndicator';
import type IKHPoint from './IKHPoint';

/* *
*
* Declarations
*
* */

/* eslint-disable @typescript-eslint/interface-name-prefix */

export interface IKHDrawSenkouSpanObject {
    indicator: IKHIndicator;
    points: Array<IKHPoint>;
    nextPoints: Array<IKHPoint>;
    color?: ColorType;
    options: IKHOptions;
    gap: IKHGapExtensionObject;
    graph: Highcharts.SVGElement | undefined;
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
    tooltip?: Highcharts.TooltipOptions;
}
/* eslint-enable @typescript-eslint/interface-name-prefix */
