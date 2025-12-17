/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type { DataLabelsOverflowValue } from '../../Series/DataLabelOptions';
import type Templating from '../../Templating';
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
    formatter?: Templating.FormatterCallback<StackItem>;
    overflow?: DataLabelsOverflowValue;
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
    'normal'|'overlap'|'percent'|'stream'|'group' | null
);

/* *
 *
 *  Default Export
 *
 * */

export default StackLabelOptions;
