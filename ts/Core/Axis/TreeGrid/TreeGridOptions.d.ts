/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Jon Arild Nygard
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
    AxisLabelOptions,
    AxisOptions
} from '../AxisOptions';
import type ColorType from '../../Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface TreeGridAxisLabelIconOptions {
    height?: number;
    lineColor?: ColorType;
    lineWidth?: number;
    padding?: number;
    type?: number;
    width?: number;
    x?: number;
    y?: number;
}

export interface TreeGridAxisLabelOptions extends AxisLabelOptions {
    levels?: number;
    symbol?: TreeGridAxisLabelIconOptions;
}

export interface TreeGridAxisOptions extends AxisOptions {
    labels: TreeGridAxisLabelOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default TreeGridAxisOptions;
