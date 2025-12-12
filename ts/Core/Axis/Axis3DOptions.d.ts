/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Extension for 3d axes
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
    AxisOptions,
    AxisTitleOptions
} from './AxisOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface Axis3DLabelOptions extends AxisLabelOptions {
    position3d: Axis3DPositionValue;
    skew3d: boolean;
}

export interface Axis3DOptions extends AxisOptions {
    labels: Axis3DLabelOptions;
    title: Axis3DTitleOptions;
}

export type Axis3DPositionValue = ('chart'|'flap'|'offset'|'ortho');

export interface Axis3DTitleOptions extends AxisTitleOptions {
    position3d: (Axis3DPositionValue|null);
    skew3d: (boolean|null);
}

/* *
 *
 *  Default Export
 *
 * */

export default Axis3DOptions;
