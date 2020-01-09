/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type PaneBackgroundShapeValue = ('arc'|'circle'|'solid');
        interface Axis {
            pane?: Pane;
        }
        interface Chart {
            pane?: Array<Pane>;
        }
        interface Options {
            pane?: PaneOptions;
        }
        interface PaneBackgroundOptions {
            backgroundColor?: GradientColorObject;
            borderColor?: (ColorString|GradientColorObject|PatternObject);
            borderWidth?: number;
            className?: string;
            from?: number;
            innerRadius?: (number|string);
            outerRadius?: (number|string);
            shape?: PaneBackgroundShapeValue;
            to?: number;
        }
        interface PaneChart extends Chart {
            pane: Array<Pane>;
        }
        interface PaneOptions {
            background?: Array<PaneBackgroundOptions>;
            center?: Array<(string|number)>;
            endAngle?: number;
            size?: (number|string);
            startAngle?: number;
            zIndex?: number;
        }
        class Pane {
            public constructor(options: PaneOptions, chart: Chart);
            public axis?: RadialAxis;
            public background: Array<SVGElement>;
            public center: Array<number>;
            public chart: PaneChart;
            public coll: 'pane';
            public defaultBackgroundOptions?: PaneBackgroundOptions;
            public defaultOptions?: PaneOptions;
            public group?: SVGElement;
            public options: PaneOptions;
            public init(options: PaneOptions, chart: Chart): void;
            public render(): void;
            public renderBackground(
                backgroundOptions: PaneBackgroundOptions,
                i: number
            ): void;
            public setOptions(options: PaneOptions): void;
            public update(options: PaneOptions, redraw?: boolean): void;
            public updateCenter(axis?: RadialAxis): void;
        }
    }
}

/**
 * @typedef {"arc"|"circle"|"solid"} Highcharts.PaneBackgroundShapeValue
 */

import '../mixins/centered-series.js';

import U from '../parts/Utilities.js';
const {
    extend,
    splat
} = U;

var CenteredSeriesMixin = H.CenteredSeriesMixin,
    merge = H.merge;

/* eslint-disable valid-jsdoc */

H.Chart.prototype.collectionsWithUpdate.push('pane');

/**
 * The Pane object allows options that are common to a set of X and Y axes.
 *
 * In the future, this can be extended to basic Highcharts and Highstock.
 *
 * @private
 * @class
 * @name Highcharts.Pane
 * @param {Highcharts.PaneOptions} options
 * @param {Highcharts.Chart} chart
 */
function Pane(
    this: Highcharts.Pane,
    options: Highcharts.PaneOptions,
    chart: Highcharts.Chart
): void {
    this.init(options, chart);
}

// Extend the Pane prototype
extend(Pane.prototype, {

    coll: 'pane', // Member of chart.pane

    /**
     * Initialize the Pane object
     *
     * @private
     * @function Highcharts.Pane#init
     *
     * @param {Highcharts.PaneOptions} options
     *
     * @param {Highcharts.Chart} chart
     */
    init: function (
        this: Highcharts.Pane,
        options: Highcharts.PaneOptions,
        chart: Highcharts.PaneChart
    ): void {
        this.chart = chart;
        this.background = [];

        chart.pane.push(this);

        this.setOptions(options);
    },

    /**
     * @private
     * @function Highcharts.Pane#setOptions
     *
     * @param {Highcharts.PaneOptions} options
     */
    setOptions: function (
        this: Highcharts.Pane,
        options: Highcharts.PaneOptions
    ): void {

        // Set options. Angular charts have a default background (#3318)
        this.options = options = merge(
            this.defaultOptions as any,
            this.chart.angular ? { background: ({} as any) } : void 0,
            options
        );
    },

    /**
     * Render the pane with its backgrounds.
     *
     * @private
     * @function Highcharts.Pane#render
     */
    render: function (this: Highcharts.Pane): void {

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
                            this.defaultBackgroundOptions as any,
                            backgroundOption[i]
                        ),
                        i
                    );
                } else if (this.background[i]) {
                    this.background[i] = this.background[i].destroy() as any;
                    this.background.splice(i, 1);
                }
            }
        }
    },

    /**
     * Render an individual pane background.
     *
     * @private
     * @function Highcharts.Pane#renderBackground
     *
     * @param {Highcharts.PaneBackgroundOptions} backgroundOptions
     *        Background options
     *
     * @param {number} i
     *        The index of the background in this.backgrounds
     */
    renderBackground: function (
        this: Highcharts.Pane,
        backgroundOptions: Highcharts.PaneBackgroundOptions,
        i: number
    ): void {
        var method = 'animate',
            attribs = {
                'class':
                    'highcharts-pane ' + (backgroundOptions.className || '')
            };

        if (!this.chart.styledMode) {
            extend(attribs, {
                'fill': backgroundOptions.backgroundColor,
                'stroke': backgroundOptions.borderColor,
                'stroke-width': backgroundOptions.borderWidth
            });
        }

        if (!this.background[i]) {
            this.background[i] = this.chart.renderer
                .path()
                .add(this.group);
            method = 'attr';
        }

        this.background[i][method]({
            'd': (this.axis as any).getPlotBandPath(
                backgroundOptions.from,
                backgroundOptions.to,
                backgroundOptions
            )
        }).attr(attribs);

    },

    /**
     * The pane serves as a container for axes and backgrounds for circular
     * gauges and polar charts.
     *
     * @since        2.3.0
     * @product      highcharts
     * @requires     highcharts-more
     * @optionparent pane
     */
    defaultOptions: {

        /**
         * The end angle of the polar X axis or gauge value axis, given in
         * degrees where 0 is north. Defaults to [startAngle](#pane.startAngle)
         * + 360.
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
         * The center of a polar chart or angular gauge, given as an array
         * of [x, y] positions. Positions can be given as integers that
         * transform to pixels, or as percentages of the plot area size.
         *
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/
         *         Two gauges with different center
         *
         * @type    {Array<string|number>}
         * @default ["50%", "50%"]
         * @since   2.3.0
         * @product highcharts
         */
        center: ['50%', '50%'],

        /**
         * The size of the pane, either as a number defining pixels, or a
         * percentage defining a percentage of the plot are.
         *
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/
         *         Smaller size
         *
         * @type    {number|string}
         * @product highcharts
         */
        size: '85%',

        /**
         * The start angle of the polar X axis or gauge axis, given in degrees
         * where 0 is north. Defaults to 0.
         *
         * @sample {highcharts} highcharts/demo/gauge-vu-meter/
         *         VU-meter with custom start and end angle
         *
         * @since   2.3.0
         * @product highcharts
         */
        startAngle: 0
    },

    /**
     * An array of background items for the pane.
     *
     * @sample {highcharts} highcharts/demo/gauge-speedometer/
     *         Speedometer gauge with multiple backgrounds
     *
     * @type         {Array<*>}
     * @optionparent pane.background
     */
    defaultBackgroundOptions: {

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
        shape: 'circle',

        /**
         * The pixel border width of the pane background.
         *
         * @since 2.3.0
         * @product highcharts
         */
        borderWidth: 1,

        /**
         * The pane background border color.
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since   2.3.0
         * @product highcharts
         */
        borderColor: '${palette.neutralColor20}',

        /**
         * The background color or gradient for the pane.
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, #ffffff], [1, #e6e6e6]] }
         * @since   2.3.0
         * @product highcharts
         */
        backgroundColor: {

            /** @ignore-option */
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },

            /** @ignore-option */
            stops: [
                [0, '${palette.backgroundColor}'],
                [1, '${palette.neutralColor10}']
            ]

        },

        /** @ignore-option */
        from: -Number.MAX_VALUE, // corrected to axis min

        /**
         * The inner radius of the pane background. Can be either numeric
         * (pixels) or a percentage string.
         *
         * @type    {number|string}
         * @since   2.3.0
         * @product highcharts
         */
        innerRadius: 0,

        /** @ignore-option */
        to: Number.MAX_VALUE, // corrected to axis max

        /**
         * The outer radius of the circular pane background. Can be either
         * numeric (pixels) or a percentage string.
         *
         * @type     {number|string}
         * @since    2.3.0
         * @product  highcharts
         */
        outerRadius: '105%'

    },

    /**
     * Gets the center for the pane and its axis.
     *
     * @private
     * @function Highcharts.Pane#updateCenter
     * @param {Highcharts.RadialAxis} [axis]
     * @return {void}
     */
    updateCenter: function (
        this: Highcharts.Pane,
        axis?: Highcharts.RadialAxis
    ): void {
        this.center = (
            axis ||
            this.axis ||
            ({} as Highcharts.Dictionary<Array<number>>)
        ).center = CenteredSeriesMixin.getCenter.call(this as any);
    },

    /**
     * Destroy the pane item
     *
     * @ignore
     * @private
     * @function Highcharts.Pane#destroy
     * /
    destroy: function () {
        H.erase(this.chart.pane, this);
        this.background.forEach(function (background) {
            background.destroy();
        });
        this.background.length = 0;
        this.group = this.group.destroy();
    },
    */

    /**
     * Update the pane item with new options
     *
     * @private
     * @function Highcharts.Pane#update
     * @param {Highcharts.PaneOptions} options
     *        New pane options
     * @param {boolean} [redraw]
     * @return {void}
     */
    update: function (
        this: Highcharts.Pane,
        options: Highcharts.PaneOptions,
        redraw?: boolean
    ): void {
        merge(true, this.options, options);
        merge(true, this.chart.options.pane, options); // #9917

        this.setOptions(this.options);
        this.render();
        this.chart.axes.forEach(function (axis: Highcharts.Axis): void {
            if (axis.pane === this) {
                axis.pane = null as any;
                axis.update({}, redraw);
            }
        }, this);
    }
});

H.Pane = Pane as any;
