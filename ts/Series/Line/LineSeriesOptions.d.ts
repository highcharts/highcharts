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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { DeepPartial } from '../../Shared/Types';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface LineSeriesOptions extends SeriesOptions {
    allAreas?: boolean;

    /**
     * For some series, there is a limit that shuts down animation
     * by default when the total number of points in the chart is too high.
     * For example, for a column chart and its derivatives, animation does
     * not run if there is more than 250 points totally. To disable this
     * cap, set `animationLimit` to `Infinity`. This option works if animation
     * is fired on individual points, not on a group of points like e.g. during
     * the initial animation.
     *
     * @sample {highcharts} highcharts/plotoptions/series-animationlimit/
     *         Animation limit on updating individual points
     */
    animationLimit?: number;
    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    colorAxis?: boolean;
    connectEnds?: boolean;
    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
    description?: string;
    linkedTo?: string;
    pointDescriptionFormatter?: Function;
    pointStart?: number;
    skipKeyboardNavigation?: boolean;
    states?: SeriesStatesOptions<LineSeriesOptions>;
    supportingColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default LineSeriesOptions;
