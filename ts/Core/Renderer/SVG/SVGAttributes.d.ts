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
import DashStyleValue from '../DashStyleValue';
import type SVGPath from './SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface SVGAttributes {
    // [key: string]: any;
    class?: string;
    'clip-path'?: string;
    clockwise?: number;
    cursor?: string;
    cx?: number;
    cy?: number;
    d?: (string|SVGPath);
    dx?: number;
    dy?: number;
    dashstyle?: DashStyleValue;
    end?: number;
    fill?: ColorType;
    'fill-opacity'?: number;
    gradientUnits?: 'userSpaceOnUse';
    height?: number;
    href?: string;
    id?: string;
    innerR?: number;
    inverted?: boolean;
    longArc?: number;
    matrix?: Array<number>;
    offset?: number;
    opacity?: number;
    padding?: number;
    paddingLeft?: number;
    paddingRight?: number;
    preserveAspectRatio?: string;
    r?: number;
    rotation?: number;
    rotationOriginX?: number;
    rotationOriginY?: number;
    scaleX?: number;
    scaleY?: number;
    start?: number;
    stroke?: ColorType;
    'stroke-linecap'?: 'butt'|'round'|'square';
    'stroke-width'?: number;
    // @todo: Create special ButtonTheme class for exporting and RangeSelector
    states?: any;
    'stop-color'?: string;
    'stop-opacity'?: number;
    style?: CSSObject|string;
    text?: string;
    'text-align'?: 'center'|'left'|'right';
    title?: string;
    translateX?: number;
    translateY?: number;
    version?: string;
    viewBox?: string;
    visibility?: 'hidden'|'inherit'|'visible';
    width?: number;
    x?: number;
    x1?: number;
    x2?: number;
    y?: number;
    y1?: number;
    y2?: number;
    zIndex?: number;
}

/* *
 *
 *  Export
 *
 * */

export default SVGAttributes;
