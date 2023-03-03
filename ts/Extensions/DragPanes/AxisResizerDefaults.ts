/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2023 Highsoft AS
 *
 *  Author: Kacper Madej
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

import type AxisResizerOptions from './AxisResizerOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

const AxisResizerDefaults: AxisResizerOptions = {
    /**
     * Minimal size of a resizable axis. Could be set as a percent
     * of plot area or pixel size.
     *
     * @sample {highstock} stock/yaxis/resize-min-max-length
     *         minLength and maxLength
     *
     * @type      {number|string}
     * @product   highstock
     * @requires  modules/drag-panes
     * @apioption yAxis.minLength
     */
    minLength: '10%',

    /**
     * Maximal size of a resizable axis. Could be set as a percent
     * of plot area or pixel size.
     *
     * @sample {highstock} stock/yaxis/resize-min-max-length
     *         minLength and maxLength
     *
     * @type      {number|string}
     * @product   highstock
     * @requires  modules/drag-panes
     * @apioption yAxis.maxLength
     */
    maxLength: '100%',

    /**
     * Options for axis resizing. It adds a thick line between panes which
     * the user can drag in order to resize the panes.
     *
     * @sample {highstock} stock/demo/candlestick-and-volume
     *         Axis resizing enabled
     *
     * @product      highstock
     * @requires     modules/drag-panes
     * @optionparent yAxis.resize
     */
    resize: {

        /**
         * Contains two arrays of axes that are controlled by control line
         * of the axis.
         *
         * @requires modules/drag-panes
         */
        controlledAxis: {

            /**
             * Array of axes that should move out of the way of resizing
             * being done for the current axis. If not set, the next axis
             * will be used.
             *
             * @sample {highstock} stock/yaxis/multiple-resizers
             *         Three panes with resizers
             * @sample {highstock} stock/yaxis/resize-multiple-axes
             *         One resizer controlling multiple axes
             *
             * @type     {Array<number|string>}
             * @default  []
             * @requires modules/drag-panes
             */
            next: [],

            /**
             * Array of axes that should move with the current axis
             * while resizing.
             *
             * @sample {highstock} stock/yaxis/multiple-resizers
             *         Three panes with resizers
             * @sample {highstock} stock/yaxis/resize-multiple-axes
             *         One resizer controlling multiple axes
             *
             * @type     {Array<number|string>}
             * @default  []
             * @requires modules/drag-panes
             */
            prev: []
        },

        /**
         * Enable or disable resize by drag for the axis.
         *
         * @sample {highstock} stock/demo/candlestick-and-volume
         *         Enabled resizer
         *
         * @requires modules/drag-panes
         */
        enabled: false,

        /**
         * Cursor style for the control line.
         *
         * In styled mode use class `highcharts-axis-resizer` instead.
         *
         * @requires modules/drag-panes
         */
        cursor: 'ns-resize',

        /**
         * Color of the control line.
         *
         * In styled mode use class `highcharts-axis-resizer` instead.
         *
         * @sample {highstock} stock/yaxis/styled-resizer
         *         Styled resizer
         *
         * @type     {Highcharts.ColorString}
         * @requires modules/drag-panes
         */
        lineColor: Palette.neutralColor20,

        /**
         * Dash style of the control line.
         *
         * In styled mode use class `highcharts-axis-resizer` instead.
         *
         * @see For supported options check [dashStyle](#plotOptions.series.dashStyle)
         *
         * @sample {highstock} stock/yaxis/styled-resizer
         *         Styled resizer
         *
         * @requires modules/drag-panes
         */
        lineDashStyle: 'Solid',

        /**
         * Width of the control line.
         *
         * In styled mode use class `highcharts-axis-resizer` instead.
         *
         * @sample {highstock} stock/yaxis/styled-resizer
         *         Styled resizer
         *
         * @requires modules/drag-panes
         */
        lineWidth: 4,

        /**
         * Horizontal offset of the control line.
         *
         * @sample {highstock} stock/yaxis/styled-resizer
         *         Styled resizer
         *
         * @requires modules/drag-panes
         */
        x: 0,

        /**
         * Vertical offset of the control line.
         *
         * @sample {highstock} stock/yaxis/styled-resizer
         *         Styled resizer
         *
         * @requires modules/drag-panes
         */
        y: 0
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default AxisResizerDefaults;
