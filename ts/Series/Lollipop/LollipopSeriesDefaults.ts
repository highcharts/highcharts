/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type LollipopSeriesOptions from './LollipopSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * The lollipop series is a cartesian series with a line anchored from
 * the x axis and a dot at the end to mark the value.
 * Requires `highcharts-more.js`, `modules/dumbbell.js` and
 * `modules/lollipop.js`.
 *
 * @sample {highcharts} highcharts/demo/lollipop/
 *         Lollipop chart
 * @sample {highcharts} highcharts/series-dumbbell/styled-mode-dumbbell/
 *         Styled mode
 *
 * @extends      plotOptions.dumbbell
 * @product      highcharts highstock
 * @excluding    fillColor, fillOpacity, lineWidth, stack, stacking,
 *               lowColor, stickyTracking, trackByArea
 * @since        8.0.0
 * @optionparent plotOptions.lollipop
 */
const LollipopSeriesDefaults: LollipopSeriesOptions = {

    /** @ignore-option */
    threshold: 0,

    /** @ignore-option */
    connectorWidth: 1,

    /** @ignore-option */
    groupPadding: 0.2,

    /**
     * Whether to group non-stacked lollipop points or to let them
     * render independent of each other. Non-grouped lollipop points
     * will be laid out individually and overlap each other.
     *
     * @sample highcharts/series-lollipop/enabled-grouping/
     *         Multiple lollipop series with grouping
     * @sample highcharts/series-lollipop/disabled-grouping/
     *         Multiple lollipop series with disabled grouping
     *
     * @type      {boolean}
     * @default   true
     * @since     8.0.0
     * @product   highcharts highstock
     * @apioption plotOptions.lollipop.grouping
     */

    /** @ignore-option */
    pointPadding: 0.1,

    /** @ignore-option */
    states: {
        hover: {
            /** @ignore-option */
            lineWidthPlus: 0,
            /** @ignore-option */
            connectorWidthPlus: 1,
            /** @ignore-option */
            halo: false
        }
    },

    /** @ignore-option */
    lineWidth: 0,

    dataLabels: {
        align: void 0,
        verticalAlign: void 0
    },

    pointRange: 1

} as LollipopSeriesOptions;

/* *
 *
 *  Default Export
 *
 * */

export default LollipopSeriesDefaults;
