/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
import type {
    CSSObject,
    CursorValue
} from '../CSSObject';
import type DashStyleValue from '../DashStyleValue';
import type SVGPath from './SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface SVGAttributes {
    // [key: string]: any;
    align?: 'left'|'center'|'right';
    'alignment-baseline'?: string;
    alphaCorrection?: number;
    anchorX?: number;
    anchorY?: number;
    /**
     * Dummy property used for custom step animations
     */
    animator?: number;
    'aria-expanded'?: boolean;
    'aria-hidden'?: boolean;
    'aria-label'?: string;
    class?: string;
    'clip-path'?: string;
    clockwise?: number;
    cursor?: CursorValue;
    cx?: number;
    cy?: number;
    d?: (string|SVGPath);
    dashstyle?: DashStyleValue;
    depth?: number;
    display?: ''|'block'|'none';
    'dominant-baseline'?: string;
    dx?: number;
    dy?: number;
    end?: number;
    fill?: ColorType;
    'fill-opacity'?: number;
    filter?: string;
    filterUnits?: string;
    'flood-color'?: string;
    'flood-opacity'?: number;
    gradientUnits?: 'userSpaceOnUse';
    height?: number;
    href?: string;
    id?: string;
    in?: string;
    innerR?: number;
    inverted?: boolean;
    longArc?: number;
    markerHeight?: number;
    markerWidth?: number;
    matrix?: Array<number>;
    offset?: number;
    opacity?: number;
    open?: boolean;
    operator?: string;
    padding?: number;
    paddingLeft?: number|'unset';
    paddingRight?: number|'unset';
    patternContentUnits?: 'userSpaceOnUse'|'objectBoundingBox';
    patternTransform?: string;
    patternUnits?: 'userSpaceOnUse';
    preserveAspectRatio?: string;
    r?: number;
    radius?: number;
    refX?: number;
    refY?: number;
    rx?: number;
    ry?: number;
    role?: string;
    rotation?: number;
    rotationOriginX?: number;
    rotationOriginY?: number;
    scaleX?: number;
    scaleY?: number;
    slope?: number;
    start?: number;
    stdDeviation?: number;
    stroke?: ColorType;
    'stroke-linecap'?: 'butt'|'round'|'square';
    'stroke-linejoin'?: 'butt'|'round'|'square';
    'stroke-opacity'?: number;
    'stroke-width'?: number;
    strokeWidth?: number; // Used in PatternFill, transformed to stroke-width
    // @todo: Create special ButtonTheme class for exporting and RangeSelector
    // states?: any;
    'stop-color'?: string;
    'stop-opacity'?: number;
    style?: CSSObject|string;
    'sweep-flag'?: 0|1;
    tabindex?: number;
    tableValues?: string;
    text?: string;
    'text-align'?: 'center'|'left'|'right';
    'text-anchor'?: string;
    title?: string;
    transform?: string;
    translateX?: number;
    translateY?: number;
    type?: string;
    version?: string;
    viewBox?: string;
    visibility?: 'hidden'|'inherit'|'visible';
    width?: number;
    x?: number;
    x1?: number;
    x2?: number;
    xmlns?: string;
    y?: number;
    y1?: number;
    y2?: number;
    z?: number;
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SVGAttributes;
