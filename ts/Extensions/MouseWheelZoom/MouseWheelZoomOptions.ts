/* *
 *
 *  (c) 2023-2026 Highsoft AS
 *  Author: Askel Eirik Johansson
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


import type { ChartZoomingOptions } from '../../Core/Chart/ChartOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartOptions'{
    interface ChartZoomingOptions {
        /**
         * The mouse wheel zoom is a feature included in Highcharts Stock, but
         * is also available for Highcharts Core as a module. Zooming with the
         * mouse wheel is enabled by default in Highcharts Stock. In Highcharts
         * Core it is enabled if [chart.zooming.type](chart.zooming.type) is
         * set. It can be disabled by setting this option to `false`.
         *
         * @since 11.1.0
         * @requires  modules/mouse-wheel-zoom
         * @sample    {highcharts} highcharts/mouse-wheel-zoom/enabled
         *            Enable or disable
         * @sample    {highstock} stock/mouse-wheel-zoom/enabled
         *            Enable or disable
         */
        mouseWheel?: (boolean|MouseWheelZoomOptions);
    }
}

/* *
 *
 *  API Options
 *
 * */

export interface MouseWheelZoomOptions {
    /**
     * Zooming with the mouse wheel can be disabled by setting this option to
     * `false`.
     *
     * @default   true
     * @since 11.1.0
     * @requires  modules/mouse-wheel-zoom
     */
    enabled?: boolean;

    /**
     * Adjust the sensitivity of the zoom. Sensitivity of mouse wheel or
     * trackpad scrolling. `1` is no sensitivity, while with `2`, one mouse
     * wheel delta will zoom in `50%`.
     *
     * @default   1.1
     * @since 11.1.0
     * @requires  modules/mouse-wheel-zoom
     * @sample    {highcharts} highcharts/mouse-wheel-zoom/sensitivity
     *            Change mouse wheel zoom sensitivity
     * @sample    {highstock} stock/mouse-wheel-zoom/sensitivity
     *            Change mouse wheel zoom sensitivity
     */
    sensitivity?: number;

    /**
     * Decides in what dimensions the user can zoom scrolling the wheel. Can be
     * one of `x`, `y` or `xy`. In Highcharts Core, if not specified here, it
     * will inherit the type from [chart.zooming.type](chart.zooming.type). In
     * Highcharts Stock, it defaults to `x`.
     *
     * Note that particularly with mouse wheel in the y direction, the zoom is
     * affected by the default [yAxis.startOnTick](#yAxis.startOnTick) and
     * [endOnTick]((#yAxis.endOnTick)) settings. In order to respect these
     * settings, the zoom level will adjust after the user has stopped zooming.
     * To prevent this, consider setting `startOnTick` and `endOnTick` to
     * `false`.
     *
     * @default   {highcharts} undefined
     * @default   {highstock} x
     * @validvalue ["x", "y", "xy"]
     * @since 11.1.0
     * @requires  modules/mouse-wheel-zoom
     */
    type?: ChartZoomingOptions['type'];

    /**
     * Whether to enable the reset zoom button when zooming with the mouse
     * wheel.
     *
     * @default   false
     * @since 12.5.0
     * @requires  modules/mouse-wheel-zoom
     * @sample    {highcharts} highcharts/mouse-wheel-zoom/reset-zoom-button
     *            Enable reset zoom button for mouse wheel zooming
     * @sample    {highstock} stock/mouse-wheel-zoom/reset-zoom-button
     *            Enable reset zoom button for mouse wheel zooming
     */
    showResetButton?: boolean;
}

export default MouseWheelZoomOptions;
