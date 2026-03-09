/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type { BubblePointMarkerOptions } from './BubblePointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import { ScatterSeriesTooltipOptions } from '../Scatter/ScatterSeriesOptions';

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

    tooltip?: BubbleSeriesTooltipOptions;

    zMax?: number;
    zMin?: number;
    zThreshold?: number;
}

export interface BubbleSeriesTooltipOptions
    extends ScatterSeriesTooltipOptions {
    /**
     * @default '({point.x}, {point.y}), Size: {point.z}'
     */
    pointFormat?: ScatterSeriesTooltipOptions['pointFormat'];
}

export type BubbleSizeByValue = ('area'|'width');

/* *
 *
 *  Default Export
 *
 * */

export default BubbleSeriesOptions;
