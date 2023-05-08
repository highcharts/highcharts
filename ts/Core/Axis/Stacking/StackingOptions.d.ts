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
} from '../../Renderer/AlignObject';
import type AnimationOptions from '../../Animation/AnimationOptions';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../../Renderer/CSSObject';
import type { DataLabelOverflowValue } from '../../Series/DataLabelOptions';
import type FormatUtilities from '../../FormatUtilities';
import type StackItem from './StackItem';
import type { SymbolKey } from '../../Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../AxisOptions' {
    interface AxisOptions {
        stackLabels?: StackLabelOptions;
    }
}

declare module '../../Series/SeriesOptions' {
    interface SeriesOptions {
        stack?: (number|string);
        stacking?: StackOverflowValue;
    }
}

export interface StackLabelOptions {
    animation?: (false|Partial<AnimationOptions>);
    align?: AlignValue;
    allowOverlap?: boolean;
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number;
    borderWidth?: number;
    crop?: boolean;
    enabled?: boolean;
    format?: string;
    formatter?: FormatUtilities.FormatterCallback<StackItem>;
    overflow?: DataLabelOverflowValue;
    padding?: number;
    rotation?: number;
    shape?: SymbolKey;
    style?: CSSObject;
    textAlign?: AlignValue;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
}

export type StackOverflowValue = (
    'normal'|'overlap'|'percent'|'stream'|'group'
);

/* *
 *
 *  Default Export
 *
 * */

export default StackLabelOptions;
