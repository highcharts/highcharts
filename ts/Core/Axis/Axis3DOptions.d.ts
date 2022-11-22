/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extenstion for 3d axes
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
