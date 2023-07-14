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

import type {
    AlignValue,
    VerticalAlignValue
} from '../Renderer/AlignObject';
import type AnimationOptions from '../Animation/AnimationOptions';
import type ColorString from '../Color/ColorString';
import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type Point from './Point';
import type ShadowOptionsObject from '../Renderer/ShadowOptionsObject';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type { SymbolTypeRegistry } from '../Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export type DataLabelFilterOperatorValue = ('>'|'<'|'>='|'<='|'=='|'===');

export interface TextPathAttributes extends SVGAttributes {
    startOffset?: string;
    textAnchor?: 'start'|'middle'|'end';
    dy?: number;
}

export interface DataLabelFilterOptions {
    operator: DataLabelFilterOperatorValue;
    property: string;
    value: (null|number);
}

export interface DataLabelFormatterCallback {
    (this: Point.PointLabelObject): (number|string|null|undefined);
}

export interface DataLabelOptions {
    animation?: (boolean|Partial<AnimationOptions>);
    align?: AlignValue;
    allowOverlap?: boolean;
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number;
    borderWidth?: number;
    className?: string;
    color?: ColorString;
    crop?: boolean;
    defer?: boolean;
    distance?: number;
    enabled?: boolean;
    filter?: DataLabelFilterOptions;
    format?: string;
    formatter?: DataLabelFormatterCallback;
    inside?: boolean;
    nullFormat?: (boolean|string);
    overflow?: DataLabelOverflowValue;
    padding?: number;
    rotation?: number;
    shadow?: (boolean|Partial<ShadowOptionsObject>);
    shape?: keyof SymbolTypeRegistry;
    style?: CSSObject;
    textPath?: DataLabelTextPathOptions;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
    zIndex?: number;
}

export type DataLabelOverflowValue = ('allow'|'justify');

export interface DataLabelTextPathOptions {
    attributes?: TextPathAttributes;
    enabled?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataLabelOptions;
