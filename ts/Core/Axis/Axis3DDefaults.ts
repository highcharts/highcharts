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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis3DOptions from './Axis3DOptions';

/* *
 *
 *  Constants
 *
 * */

/**
 * @optionparent xAxis
 */
const Axis3DDefaults = {
    labels: {
        /**
         * Defines how the labels are be repositioned according to the 3D
         * chart orientation.
         *
         * - `'offset'`: Maintain a fixed horizontal/vertical distance from
         *   the tick marks, despite the chart orientation. This is the
         *   backwards compatible behavior, and causes skewing of X and Z
         *   axes.
         *
         * - `'chart'`: Preserve 3D position relative to the chart. This
         *   looks nice, but hard to read if the text isn't forward-facing.
         *
         * - `'flap'`: Rotated text along the axis to compensate for the
         *   chart orientation. This tries to maintain text as legible as
         *   possible on all orientations.
         *
         * - `'ortho'`: Rotated text along the axis direction so that the
         *   labels are orthogonal to the axis. This is very similar to
         *   `'flap'`, but prevents skewing the labels (X and Y scaling are
         *   still present).
         *
         * @sample highcharts/3d/skewed-labels/
         *         Skewed labels
         *
         * @since      5.0.15
         * @validvalue ['offset', 'chart', 'flap', 'ortho']
         * @product    highcharts
         * @requires   highcharts-3d
         */
        position3d: 'offset',

        /**
         * If enabled, the axis labels will skewed to follow the
         * perspective.
         *
         * This will fix overlapping labels and titles, but texts become
         * less legible due to the distortion.
         *
         * The final appearance depends heavily on `labels.position3d`.
         *
         * @sample highcharts/3d/skewed-labels/
         *         Skewed labels
         *
         * @since    5.0.15
         * @product  highcharts
         * @requires highcharts-3d
         */
        skew3d: false
    },
    title: {
        /**
         * Defines how the title is repositioned according to the 3D chart
         * orientation.
         *
         * - `'offset'`: Maintain a fixed horizontal/vertical distance from
         *   the tick marks, despite the chart orientation. This is the
         *   backwards compatible behavior, and causes skewing of X and Z
         *   axes.
         *
         * - `'chart'`: Preserve 3D position relative to the chart. This
         *   looks nice, but hard to read if the text isn't forward-facing.
         *
         * - `'flap'`: Rotated text along the axis to compensate for the
         *   chart orientation. This tries to maintain text as legible as
         *   possible on all orientations.
         *
         * - `'ortho'`: Rotated text along the axis direction so that the
         *   labels are orthogonal to the axis. This is very similar to
         *   `'flap'`, but prevents skewing the labels (X and Y scaling are
         *   still present).
         *
         * - `undefined`: Will use the config from `labels.position3d`
         *
         * @sample highcharts/3d/skewed-labels/
         *         Skewed labels
         *
         * @type     {"offset"|"chart"|"flap"|"ortho"|null}
         * @since    5.0.15
         * @product  highcharts
         * @requires highcharts-3d
         */
        position3d: null,

        /**
         * If enabled, the axis title will skewed to follow the perspective.
         *
         * This will fix overlapping labels and titles, but texts become
         * less legible due to the distortion.
         *
         * The final appearance depends heavily on `title.position3d`.
         *
         * A `null` value will use the config from `labels.skew3d`.
         *
         * @sample highcharts/3d/skewed-labels/
         *         Skewed labels
         *
         * @type     {boolean|null}
         * @since    5.0.15
         * @product  highcharts
         * @requires highcharts-3d
         */
        skew3d: null
    }
} as Axis3DOptions;

/* *
 *
 *  Default Export
 *
 * */

export default Axis3DDefaults;
