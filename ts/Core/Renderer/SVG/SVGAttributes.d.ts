/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type ColorType from '../../Color/ColorType';
import type CSSObject from '../CSSObject';
import type SVGPath from './SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface SVGAttributes {
    [key: string]: any;
    clockwise?: number;
    d?: (string|SVGPath);
    fill?: ColorType;
    // height?: number;
    inverted?: boolean;
    longArc?: number;
    matrix?: Array<number>;
    rotation?: number;
    rotationOriginX?: number;
    rotationOriginY?: number;
    scaleX?: number;
    scaleY?: number;
    stroke?: ColorType;
    style?: CSSObject|string;
    translateX?: number;
    translateY?: number;
    // width?: number;
    // x?: number;
    // y?: number;
    zIndex?: number;
}

/* *
 *
 *  Export
 *
 * */

export default SVGAttributes;
