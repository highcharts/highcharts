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
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from '../../Renderer/AlignObject';
import type AnimationOptions from '../../Animation/AnimationOptions';
import type { YAxisOptions } from '../AxisOptions';
import type BBoxObject from '../../Renderer/BBoxObject';
import type ColorType from '../../Color/ColorType';
import type CSSObject from '../../Renderer/CSSObject';
import type { DataLabelOverflowValue } from '../../Series/DataLabelOptions';
import type FormatUtilities from '../../FormatUtilities';
import type { OptionsOverflowValue } from '../../Options';
import type StackItem from './StackItem';

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

interface StackLabelOptions {
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
    rotation?: number;
    style?: CSSObject;
    textAlign?: AlignValue;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default StackLabelOptions;
