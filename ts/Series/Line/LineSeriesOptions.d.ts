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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type LineSeries from './LineSeries';
import type {
    SeriesOptions,
    SeriesPlotOptions
} from '../../Core/Series/SeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface LineSeriesOptions
    extends SeriesOptions, LineSeriesPlotOptions
{
    // nothing to add
}

export interface LineSeriesPlotOptions extends SeriesPlotOptions {
    allAreas?: boolean;
    animation?: (boolean|DeepPartial<AnimationOptions>);
    animationLimit?: number;
    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    colorAxis?: boolean;
    connectEnds?: boolean;
    description?: string;
    linkedTo?: string;
    pointDescriptionFormatter?: Function;
    pointStart?: number;
    skipKeyboardNavigation?: boolean;
    states?: SeriesStatesOptions<LineSeries>;
    supportingColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default LineSeriesOptions;
