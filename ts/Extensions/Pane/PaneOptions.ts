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

import type { ColorType } from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface Options {
        /**
         * The pane serves as a container for axes and backgrounds for circular
         * gauges and polar charts.
         *
         * When used in `Highcharts.setOptions` for theming, the pane must be a
         * single object, otherwise arrays are supported.
         *
         * @since    2.3.0
         * @product  highcharts
         * @requires highcharts-more
         */
        pane?: PaneOptions|Array<PaneOptions>;
    }
}

export interface PaneBackgroundOptions {
    /**
     * The background color or gradient for the pane.
     *
     * @default { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, #ffffff], [1, #e6e6e6]] }
     * @since    2.3.0
     * @requires highcharts-more
     */
    backgroundColor?: ColorType;
    /**
     * The pane background border color.
     *
     * @since    2.3.0
     * @requires highcharts-more
     */
    borderColor?: ColorType;
    /**
     * The border radius of the pane background when the shape is `arc`. Can be
     * a number (pixels) or a percentage string.
     *
     * @sample   highcharts/series-solidgauge/pane-borderradius
     *           Circular gauge and pane with equal border radius
     * @since    11.4.2
     * @requires highcharts-more
     */
    borderRadius?: number|string;
    /**
     * The pixel border width of the pane background.
     *
     * @since    2.3.0
     * @requires highcharts-more
     */
    borderWidth?: number;
    /**
     * An additional class name to apply to the pane background.
     *
     * @sample   {highcharts} highcharts/css/pane/
     *           Panes styled by CSS
     * @sample   {highstock} highcharts/css/pane/
     *           Panes styled by CSS
     * @sample   {highmaps} highcharts/css/pane/
     *           Panes styled by CSS
     *
     * @since    5.0.0
     * @requires highcharts-more
     */
    className?: string;
    /** @internal */
    from?: number;
    /**
     * The inner radius of the pane background. Can be either numeric
     * (pixels) or a percentage string.
     *
     * @since    2.3.0
     * @requires highcharts-more
     */
    innerRadius?: (number|string);
    /**
     * The outer radius of the circular pane background. Can be either
     * numeric (pixels) or a percentage string.
     *
     * @since    2.3.0
     * @requires highcharts-more
     */
    outerRadius?: (number|string);
    /**
     * The shape of the pane background. When `solid`, the background
     * is circular. When `arc`, the background extends only from the min
     * to the max of the value axis.
     *
     * @since    2.3.0
     * @requires highcharts-more
     */
    shape?: PaneBackgroundShapeValue;
    /** @internal */
    to?: number;
}

export type PaneBackgroundShapeValue = ('arc'|'circle'|'solid');

export interface PaneOptions {
    /**
     * A background item or an array of such for the pane. When used in
     * `Highcharts.setOptions` for theming, the background must be a single
     * item.
     *
     * @sample   {highcharts} highcharts/demo/gauge-speedometer/
     *           Speedometer gauge with multiple backgrounds
     * @requires highcharts-more
     */
    background?: PaneBackgroundOptions|Array<PaneBackgroundOptions>;
    /**
     * The center of a polar chart or angular gauge, given as an array
     * of [x, y] positions. Positions can be given as integers that
     * transform to pixels, or as percentages of the plot area size.
     *
     * @sample   {highcharts} highcharts/demo/gauge-vu-meter/
     *           Two gauges with different center
     * @since    2.3.0
     * @requires highcharts-more
     */
    center?: Array<(string|number)>;
    /**
     * The end angle of the polar X axis or gauge value axis, given in
     * degrees where 0 is north. Defaults to
     * [startAngle](#pane.startAngle) plus 360.
     *
     * @sample   {highcharts} highcharts/demo/gauge-vu-meter/
     *           VU-meter with custom start and end angle
     * @since    2.3.0
     * @requires highcharts-more
     */
    endAngle?: number;
    /**
     * An id for the pane.
     *
     * @requires highcharts-more
     */
    id?: string;
    /**
     * The inner size of the pane, either as a number defining pixels, or a
     * percentage defining a percentage of the pane's size.
     *
     * @sample   {highcharts} highcharts/series-polar/column-inverted-inner
     *           The inner size set to 20%
     * @requires highcharts-more
     */
    innerSize?: (number|string);
    /**
     * The size of the pane, either as a number defining pixels, or a
     * percentage defining a percentage of the available plot area (the
     * smallest of the plot height or plot width).
     *
     * @sample   {highcharts} highcharts/demo/gauge-vu-meter/
     *           Smaller size
     * @requires highcharts-more
     */
    size?: (number|string);
    /**
     * The start angle of the polar X axis or gauge axis, given in degrees
     * where 0 is north.
     *
     * @sample   {highcharts} highcharts/demo/gauge-vu-meter/
     *           VU-meter with custom start and end angle
     * @since    2.3.0
     * @requires highcharts-more
     */
    startAngle?: number;
    /**
     * The z-index of the pane group.
     *
     * @default 0
     * @requires highcharts-more
     */
    zIndex?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PaneOptions;
