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
import type DashStyleValue from '../../../Core/Renderer/DashStyleValue';
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

export interface SupertrendOptions extends SMAOptions {
    changeTrendLine?: SupertrendLineOptions;
    fallingTrendColor?: ColorType;
    params?: SupertrendParamsOptions;
    risingTrendColor?: ColorType;
}

export interface SupertrendLineOptions {
    styles?: SupertrendLineStylesOptions;
}
export interface SupertrendLineStylesOptions {
    dashStyle?: DashStyleValue;
    lineColor?: ColorType;
    lineWidth?: number;
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
    [index: string]: (AnyRecord|undefined);
}

/* *
 *
 *  Default Export
 *
 * */

export default SupertrendOptions;
