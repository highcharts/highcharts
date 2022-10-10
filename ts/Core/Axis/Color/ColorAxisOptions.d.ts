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

import type AnimationOptions from '../../Animation/AnimationOptions';
import type AxisOptions from '../AxisOptions';
import type ColorType from '../../Color/ColorType';
import type GradientColor from '../../Color/GradientColor';
import type LegendOptions from '../../Legend/LegendOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ColorAxisDataClassesOptions {
    color?: ColorType;
    colorIndex?: number;
    from?: number;
    name?: string;
    to?: number;
}

export interface ColorAxisMarkerOptions {
    animation?: (boolean|Partial<AnimationOptions>);
    color?: ColorType;
    width?: number;
}

export interface ColorAxisOptions extends AxisOptions {
    dataClassColor?: string;
    dataClasses?: Array<ColorAxisDataClassesOptions>;
    layout?: string;
    legend?: LegendOptions;
    marker?: ColorAxisMarkerOptions;
    maxColor?: ColorType;
    minColor?: ColorType;
    showInLegend?: boolean;
    stops?: GradientColor['stops'];
}

/* *
 *
 *  Default Export
 *
 * */

export default ColorAxisOptions;
