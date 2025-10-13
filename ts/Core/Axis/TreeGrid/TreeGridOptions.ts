/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Jon Arild Nygard
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
