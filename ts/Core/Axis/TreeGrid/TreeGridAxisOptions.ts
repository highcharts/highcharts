/* *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AxisOptions from '../AxisOptions';
import type ColorType from '../../Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../AxisOptions' {
    interface AxisBreakOptions {
        showPoints?: boolean;
        maxOffset?: number;
    }
    interface AxisLabelOptions {
        levels?: number;
        symbol?: TreeGridAxisLabelIconOptions;
    }
}

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

/* *
 *
 *  Default Export
 *
 * */

export default AxisOptions;
