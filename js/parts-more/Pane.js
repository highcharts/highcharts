/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../mixins/centered-series.js';
import '../parts/Utilities.js';
var CenteredSeriesMixin = H.CenteredSeriesMixin,
    each = H.each,
    extend = H.extend,
    merge = H.merge,
    splat = H.splat;
/**
 * The Pane object allows options that are common to a set of X and Y axes.
 *
 * In the future, this can be extended to basic Highcharts and Highstock.
 *
 */
function Pane(options, chart) {
    this.init(options, chart);
}

// Extend the Pane prototype
extend(Pane.prototype, {

    coll: 'pane', // Member of chart.pane

    /**
     * Initiate the Pane object
     */
    init: function (options, chart) {
        this.chart = chart;
        this.background = [];

        chart.pane.push(this);

        this.setOptions(options);
    },

    setOptions: function (options) {

        // Set options. Angular charts have a default background (#3318)
        this.options = options = merge(
            this.defaultOptions,
            this.chart.angular ? { background: {} } : undefined,
            options
        );
    },

    /**
     * Render the pane with its backgrounds.
     */
    render: function () {

        var options = this.options,
            backgroundOption = this.options.background,
            renderer = this.chart.renderer,
            len,
            i;

        if (!this.group) {
            this.group = renderer.g('pane-group')
                .attr({ zIndex: options.zIndex || 0 })
                .add();
        }

        this.updateCenter();

        // Render the backgrounds
        if (backgroundOption) {
            backgroundOption = splat(backgroundOption);

            len = Math.max(
                backgroundOption.length,
                this.background.length || 0
            );

            for (i = 0; i < len; i++) {
                // #6641 - if axis exists, chart is circular and apply
                // background
                if (backgroundOption[i] && this.axis) {
                    this.renderBackground(
                        merge(
                            this.defaultBackgroundOptions,
                            backgroundOption[i]
                        ),
                        i
                    );
                } else if (this.background[i]) {
                    this.background[i] = this.background[i].destroy();
                    this.background.splice(i, 1);
                }
            }
        }
    },

    /**
     * Render an individual pane background.
     * @param  {Object} backgroundOptions Background options
     * @param  {number} i The index of the background in this.backgrounds
     */
    renderBackground: function (backgroundOptions, i) {
        var method = 'animate';

        if (!this.background[i]) {
            this.background[i] = this.chart.renderer.path()
                .add(this.group);
            method = 'attr';
        }

        this.background[i][method]({
            'd': this.axis.getPlotBandPath(
                backgroundOptions.from,
                backgroundOptions.to,
                backgroundOptions
            )
        }).attr({
            /*= if (build.classic) { =*/
            'fill': backgroundOptions.backgroundColor,
            'stroke': backgroundOptions.borderColor,
            'stroke-width': backgroundOptions.borderWidth,
            /*= } =*/
            'class': 'highcharts-pane ' + (backgroundOptions.className || '')
        });

    },

    /**
     * The pane serves as a container for axes and backgrounds for circular
     * gauges and polar charts.
     * @since 2.3.0
     * @optionparent pane
     */
    defaultOptions: {

        /**
         * The end angle of the polar X axis or gauge value axis, given in
         * degrees where 0 is north. Defaults to [startAngle](#pane.startAngle)
         * + 360.
         *
         * @type {Number}
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/
         *         VU-meter with custom start and end angle
         * @since 2.3.0
         * @product highcharts
         * @apioption pane.endAngle
         */

        /**
         * The center of a polar chart or angular gauge, given as an array
         * of [x, y] positions. Positions can be given as integers that
         * transform to pixels, or as percentages of the plot area size.
         *
         * @type {Array<String|Number>}
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/
         *         Two gauges with different center
         * @default ["50%", "50%"]
         * @since 2.3.0
         * @product highcharts
         */
        center: ['50%', '50%'],

        /**
         * The size of the pane, either as a number defining pixels, or a
         * percentage defining a percentage of the plot are.
         *
         * @type {Number|String}
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/ Smaller size
         * @default 85%
         * @product highcharts
         */
        size: '85%',

        /**
         * The start angle of the polar X axis or gauge axis, given in degrees
         * where 0 is north. Defaults to 0.
         *
         * @type {Number}
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/
         *         VU-meter with custom start and end angle
         * @since 2.3.0
         * @product highcharts
         */
        startAngle: 0
    },

    /**
     * An array of background items for the pane.
     * @type {Array<Object>}
     * @sample {highcharts} highcharts/demo/gauge-speedometer/
     *         Speedometer gauge with multiple backgrounds
     * @optionparent pane.background
     */
    defaultBackgroundOptions: {
        /**
         * The class name for this background.
         *
         * @type {String}
         * @sample {highcharts} highcharts/css/pane/ Panes styled by CSS
         * @sample {highstock} highcharts/css/pane/ Panes styled by CSS
         * @sample {highmaps} highcharts/css/pane/ Panes styled by CSS
         * @default highcharts-pane
         * @since 5.0.0
         * @apioption pane.background.className
         */

        /**
         * The shape of the pane background. When `solid`, the background
         * is circular. When `arc`, the background extends only from the min
         * to the max of the value axis.
         *
         * @validvalue ["solid", "arc"]
         * @type {String}
         * @default solid
         * @since 2.3.0
         * @product highcharts
         */
        shape: 'circle',
        /*= if (build.classic) { =*/

        /**
         * The pixel border width of the pane background.
         *
         * @type {Number}
         * @default 1
         * @since 2.3.0
         * @product highcharts
         */
        borderWidth: 1,

        /**
         * The pane background border color.
         *
         * @type {Color}
         * @default #cccccc
         * @since 2.3.0
         * @product highcharts
         */
        borderColor: '${palette.neutralColor20}',

        /**
         * The background color or gradient for the pane.
         *
         * @type {Color}
         * @since 2.3.0
         * @product highcharts
         */
        backgroundColor: {
            /**
             * Definition of the gradient, similar to SVG: object literal holds
             * start position (x1, y1) and the end position (x2, y2) relative
             * to the shape, where 0 means top/left and 1 is bottom/right.
             * All positions are floats between 0 and 1.
             *
             * @type {Object}
             */
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            /**
             * The stops is an array of tuples, where the first item is a float
             * between 0 and 1 assigning the relative position in the gradient,
             * and the second item is the color.
             *
             * @default [[0, #ffffff], [1, #e6e6e6]]
             * @type {Array<Array>}
             */
            stops: [
                [0, '${palette.backgroundColor}'],
                [1, '${palette.neutralColor10}']
            ]
        },
        /*= } =*/

        /** @ignore-option */
        from: -Number.MAX_VALUE, // corrected to axis min

        /**
         * The inner radius of the pane background. Can be either numeric
         * (pixels) or a percentage string.
         *
         * @type {Number|String}
         * @default 0
         * @since 2.3.0
         * @product highcharts
         */
        innerRadius: 0,

        /** @ignore-option */
        to: Number.MAX_VALUE, // corrected to axis max

        /**
         * The outer radius of the circular pane background. Can be either
         * numeric (pixels) or a percentage string.
         *
         * @type {Number|String}
         * @default 105%
         * @since 2.3.0
         * @product highcharts
         */
        outerRadius: '105%'
    },

    /**
     * Gets the center for the pane and its axis.
     */
    updateCenter: function (axis) {
        this.center = (axis || this.axis || {}).center =
            CenteredSeriesMixin.getCenter.call(this);
    },

    /**
     * Destroy the pane item
     * /
    destroy: function () {
        H.erase(this.chart.pane, this);
        each(this.background, function (background) {
            background.destroy();
        });
        this.background.length = 0;
        this.group = this.group.destroy();
    },
    */

    /**
     * Update the pane item with new options
     * @param  {Object} options New pane options
     */
    update: function (options, redraw) {

        merge(true, this.options, options);
        this.setOptions(this.options);
        this.render();
        each(this.chart.axes, function (axis) {
            if (axis.pane === this) {
                axis.pane = null;
                axis.update({}, redraw);
            }
        }, this);
    }

});

H.Pane = Pane;
