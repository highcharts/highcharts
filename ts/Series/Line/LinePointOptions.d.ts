/* *
 *
 *  (c) 2010-2025 Highsoft AS
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

import type PointOptions from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        keys?: Array<string>;
    }
    interface PointMarkerStateHoverOptions {
        /**
         * The radius of the point marker. In hover state, it
         * defaults to the normal state's radius + 2 as per the
         * [radiusPlus](#plotOptions.series.marker.states.hover.radiusPlus)
         * option.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-states-hover-radius/
         * 10px radius
         */
        radius?: number;

        /**
         * The number of pixels to increase the radius of the hovered point.
         *
         * @sample {highcharts} highcharts/plotoptions/series-states-hover-linewidthplus/
         * 5 pixels greater radius on hover
         * @sample {highstock} highcharts/plotoptions/series-states-hover-linewidthplus/
         * 5 pixels greater radius on hover
         *
         * @since 4.0.3
         * @default 2
         */
        radiusPlus?: number;
    }
}

export interface LinePointOptions extends PointOptions {
    // Nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default LinePointOptions;
