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

import type { BubblePointMarkerOptions } from './BubblePointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface BubbleSeriesOptions extends ScatterSeriesOptions {
    displayNegative?: boolean;
    marker?: BubblePointMarkerOptions;
    minSize?: (number|string);
    maxSize?: (number|string);
    sizeBy?: BubbleSizeByValue;
    sizeByAbsoluteValue?: boolean;
    blendColors?: Array<ColorType>;
    zMax?: number;
    zMin?: number;
    zThreshold?: number;
}

export type BubbleSizeByValue = ('area'|'width');

/* *
 *
 *  Default Export
 *
 * */

export default BubbleSeriesOptions;
