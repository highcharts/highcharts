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
 * @sample {highcharts} highcharts/demo/gauge-speedometer/
 *         Speedometer gauge with multiple backgrounds
 *
 * @type         {*|Array<*>}
 * @requires     highcharts-more
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
     * @default   "highcharts-pane"
     * @since     5.0.0
     * @requires  highcharts-more
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
     * @requires highcharts-more
     */
    shape: 'circle',

    /**
     * The border radius of the pane background when the shape is `arc`. Can be
     * a number (pixels) or a percentage string.
     *
     * @since 11.4.2
     * @sample  highcharts/series-solidgauge/pane-borderradius
     *          Circular gauge and pane with equal border radius
     * @product highcharts
     * @type    {number|string}
     * @requires highcharts-more
     */
    borderRadius: 0,

    /**
     * The pixel border width of the pane background.
     *
     * @since 2.3.0
     * @product highcharts
     * @requires highcharts-more
     */
    borderWidth: 1,

    /**
     * The pane background border color.
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since   2.3.0
     * @product highcharts
     * @requires highcharts-more
     */
    borderColor: Palette.neutralColor20,

    /**
     * The background color or gradient for the pane.
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since   2.3.0
     * @product highcharts
     * @requires highcharts-more
     */
    backgroundColor: {

        /** @ignore-option */
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },

        /** @ignore-option */
        stops: [
            [0, Palette.backgroundColor],
            [1, Palette.neutralColor10]
        ]

    },

    /** @ignore-option */
    from: -Number.MAX_VALUE, // Corrected to axis min

    /**
     * The inner radius of the pane background. Can be either numeric
     * (pixels) or a percentage string.
     *
     * @type    {number|string}
     * @since   2.3.0
     * @product highcharts
     * @requires highcharts-more
     */
    innerRadius: 0,

    /** @ignore-option */
    to: Number.MAX_VALUE, // Corrected to axis max

    /**
     * The outer radius of the circular pane background. Can be either
     * numeric (pixels) or a percentage string.
     *
     * @type     {number|string}
     * @since    2.3.0
     * @product  highcharts
     * @requires highcharts-more
     */
    outerRadius: '105%'

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
 */
const pane: PaneOptions|Array<PaneOptions> = {

    background,

    /**
     * The end angle of the polar X axis or gauge value axis, given in
     * degrees where 0 is north.
     *
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         VU-meter with custom start and end angle
     *
     * @type      {number}
     * @since     2.3.0
     * @product   highcharts
     * @requires  highcharts-more
     * @apioption pane.endAngle
     */

    /**
     * The center of a polar chart or angular gauge, given as an array
     * of [x, y] positions. Positions can be given as integers that
     * transform to pixels, or as percentages of the plot area size.
     *
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         Two gauges with different center
     *
     * @type    {Array<string|number>}
     * @since   2.3.0
     * @product highcharts
     * @requires highcharts-more
     */
    center: ['50%', '50%'],

    /**
     * The size of the pane, either as a number defining pixels, or a
     * percentage defining a percentage of the available plot area (the
     * smallest of the plot height or plot width).
     *
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         Smaller size
     *
     * @type    {number|string}
     * @product highcharts
     * @requires highcharts-more
     */
    size: '85%',

    /**
     * The inner size of the pane, either as a number defining pixels, or a
     * percentage defining a percentage of the pane's size.
     *
     * @sample {highcharts} highcharts/series-polar/column-inverted-inner
     *         The inner size set to 20%
     *
     * @type    {number|string}
     * @product highcharts
     * @requires highcharts-more
     */
    innerSize: '0%',

    /**
     * The start angle of the polar X axis or gauge axis, given in degrees
     * where 0 is north.
     *
     * @sample {highcharts} highcharts/demo/gauge-vu-meter/
     *         VU-meter with custom start and end angle
     *
     * @since   2.3.0
     * @product highcharts
     * @requires highcharts-more
     */
    startAngle: 0

};

defaultOptions.pane = pane;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const PaneDefaults = {
    pane,
    background
};

/** @internal */
export default PaneDefaults;
