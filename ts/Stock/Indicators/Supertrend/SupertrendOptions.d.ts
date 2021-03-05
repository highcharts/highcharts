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
import type LinePoint from '../../../Series/Line/LinePoint';
import type LineSeries from '../../../Series/Line/LineSeries';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type SupertrendPoint from './SupertrendPoint';
import type SVGAttributes from '../../../Core/Renderer/SVG/SVGAttributes';

/* *
*
*  Declarations
*
* */

export interface SupertrendOptions extends SMAOptions {
    changeTrendLine?: Record<string, CSSObject>;
    fallingTrendColor?: ColorType;
    params?: SupertrendParamsOptions;
    risingTrendColor?: ColorType;
}

export interface SupertrendParamsOptions extends SMAParamsOptions {
    multiplier?: number;
}

export interface SupertrendLinkedParentPointObject extends LinePoint {
    close: number;
    index: number;
    x: number;
}

export interface SupertrendLinkedParentObject extends LineSeries {
    data: Array<SupertrendLinkedParentPointObject>;
    points: Array<SupertrendLinkedParentPointObject>;
    xData: Array<number>;
    yData: Array<Array<number>>;
}

export interface SupertrendGappedExtensionObject {
    options?: SupertrendGappedExtensionOptions;
}

export interface SupertrendGappedExtensionOptions {
    gapSize?: number;
}

export interface SupertrendGroupedPointsObject {
    bottom: Array<SupertrendPoint>;
    intersect: Array<SupertrendPoint>;
    top: Array<SupertrendPoint>;
}

export interface SupertrendLineObject {
    [index: string]: (Record<string, any>|undefined);
}

export default SupertrendOptions;
