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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    PaneBackgroundOptions,
    PaneOptions
} from './PaneOptions';

import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * A background item or an array of such for the pane. When used in
 * `Highcharts.setOptions` for theming, the background must be a single item.
 *
 * @sample {highcharts} highcharts/series-solidgauge/pane-borderradius
 *         Solid gauge with background settings
 *
 * @type         {Array<*>}
 * @optionparent pane.background
 */
const background: PaneBackgroundOptions = {

    /**
     * The class name for this background.
     *
     * @sample {highcharts} highcharts/css/pane/
     *         Panes styled by CSS
     * @sample {highstock} highcharts/css/pane/
     *         Panes styled by CSS
     * @sample {highmaps} highcharts/css/pane/
     *         Panes styled by CSS
     *
     * @type      {string}
     * @default   highcharts-pane
     * @since     5.0.0
     * @apioption pane.background.className
     */

    /**
     * The shape of the pane background. When `solid`, the background
     * is circular. When `arc`, the background extends only from the min
     * to the max of the value axis.
     *
     * @type    {Highcharts.PaneBackgroundShapeValue}
     * @since   2.3.0
     * @product highcharts
     */
    shape: 'arc',

    /**
     * The specific border radius of the pane background when the shape is
     * `arc`. Can be a number (pixels) or a percentage string. Defaults to the
     * value of `pane.borderRadius`.
     *
     * @since 11.4.2
     * @sample  highcharts/series-solidgauge/pane-borderradius Circular gauge
     *          and pane with equal border radius
     * @product highcharts
     * @type    {number|string}
     */
    borderRadius: void 0,

    /**
     * The pixel border width of the pane background.
     *
     * @since 2.3.0
     * @product highcharts
     */
    borderWidth: 0,

    /**
     * The pane background border color.
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since   2.3.0
     * @product highcharts
     */
    borderColor: Palette.neutralColor20,

    /**
     * The background color or gradient for the pane.
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, #ffffff], [1, #e6e6e6]] }
     * @since   2.3.0
     * @product highcharts
     */
    backgroundColor: Palette.neutralColor5,

    /** @ignore-option */
    from: -Number.MAX_VALUE, // Corrected to axis min

    /**
     * The inner radius of the pane background. Can be either numeric
     * (pixels) or a percentage string. Defaults to match the `pane.innerSize`.
     *
     * @type    {number|string}
     * @since   2.3.0
     * @product highcharts
     * @apioption pane.background.innerRadius
     */

    /** @ignore-option */
    to: Number.MAX_VALUE, // Corrected to axis max

    /**
     * The outer radius of the circular pane background. Can be either
     * numeric (pixels) or a percentage string.
     *
     * @type     {number|string}
     * @since    2.3.0
     * @product  highcharts
     */
    outerRadius: '100%'

};

/**
 * The pane serves as a container for axes and backgrounds for circular
 * gauges and polar charts.
 *
 * When used in `Highcharts.setOptions` for theming, the pane must be a single
 * object, otherwise arrays are supported.
 *
 * @type         {*|Array<*>}
 * @since        2.3.0
 * @product      highcharts
 * @requires     highcharts-more
 * @optionparent pane
 */
const pane: PaneOptions|Array<PaneOptions> = {

    /**
     * The end angle of the polar X axis or gauge value axis, given in
     * degrees where 0 is north. Defaults to [startAngle](#pane.startAngle)
     * + 360 for polar charts, `startAngle` + 240 for gauges.
     *
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         VU-meter with custom start and end angle
     *
     * @type      {number}
     * @since     2.3.0
     * @product   highcharts
     * @apioption pane.endAngle
     */

    /**
     * The border radius of the elements of the pane. This affects the pane
     * background, plot bands and solid gauges, unless they have specific
     * border radius settings.
     *
     * @type    {number|string}
     * @since   next
     * @product highcharts
     */
    borderRadius: 3,

    /**
     * The center of a polar chart or angular gauge, given as an array
     * of [x, y] positions. Positions can be given as integers that
     * transform to pixels, or as percentages of the plot area size.
     *
     * By default, the vertical center is calculated based on the start and end
     * angle of the pane, to fit the plot area.
     *
     * @sample {highcharts} highcharts/pane/size
     *         Responsive pane size and center
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         Two gauges with different center
     *
     * @type    {Array<string|number>}
     * @default ["50%", undefined]
     * @since   2.3.0
     * @product highcharts
     * @apioption pane.center
     */

    /**
     * The margin between the pane and the plot area when auto-fitting the pane.
     * This does not apply when an explicit `pane.size` is set. An array sets
     * individual margins for the sides in the order [top, right, bottom, left].
     *
     * @type    {number|Array<number>}
     * @since   next
     */
    margin: 20,

    /**
     * The size of the pane, either as a number defining pixels, or a percentage
     * defining a percentage of the available plot area (the smallest of the
     * plot height or plot width).
     *
     * By default, the size is calculated to fit the plot area, depending on the
     * `startAngle` and `endAngle`, `margin` and background shape.
     *
     * @sample {highcharts} highcharts/pane/size
     *         Responsive pane size and center
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         Smaller size
     *
     * @type    {number|string}
     * @default undefined
     * @product highcharts
     * @apioption pane.size
     */

    /**
     * The start angle of the polar X axis or gauge axis, given in degrees
     * where 0 is north. Defaults to 0 for polar charts, -120 for gauges.
     *
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         VU-meter with custom start and end angle
     *
     * @since   2.3.0
     * @product highcharts
     * @type      {number}
     * @apioption pane.startAngle
     */

    /**
     * The inner size of the pane, either as a number defining pixels, or a
     * percentage defining a percentage of the pane's size. Defaults to 0 on
     * polar charts, 60% on gauges.
     *
     * @sample {highcharts} highcharts/series-polar/column-inverted-inner
     *         The inner size set to 20%
     *
     * @type    {number|string}
     * @product highcharts
     * @apioption pane.innerSize
     */

};

defaultOptions.pane = pane;

/* *
 *
 *  Default Export
 *
 * */

const PaneDefaults = {
    pane,
    background
};

export default PaneDefaults;
