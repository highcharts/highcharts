/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Axis from './Axis/Axis.js';
import Chart from './Chart/Chart.js';
import Color from './Color/Color.js';
var color = Color.parse;
import H from './Globals.js';
var hasTouch = H.hasTouch, isTouchDevice = H.isTouchDevice;
import NavigatorAxis from './Axis/NavigatorAxis.js';
import O from './Options.js';
var defaultOptions = O.defaultOptions;
import palette from './Color/Palette.js';
import Scrollbar from './Scrollbar.js';
import Series from './Series/Series.js';
import SeriesRegistry from './Series/SeriesRegistry.js';
var seriesTypes = SeriesRegistry.seriesTypes;
import U from './Utilities.js';
var addEvent = U.addEvent, clamp = U.clamp, correctFloat = U.correctFloat, defined = U.defined, destroyObjectProperties = U.destroyObjectProperties, erase = U.erase, extend = U.extend, find = U.find, isArray = U.isArray, isNumber = U.isNumber, merge = U.merge, pick = U.pick, removeEvent = U.removeEvent, splat = U.splat;
var defaultSeriesType, 
// Finding the min or max of a set of variables where we don't know if they
// are defined, is a pattern that is repeated several places in Highcharts.
// Consider making this a global utility method.
numExt = function (extreme) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var numbers = [].filter.call(args, isNumber);
    if (numbers.length) {
        return Math[extreme].apply(0, numbers);
    }
};
defaultSeriesType = typeof seriesTypes.areaspline === 'undefined' ?
    'line' :
    'areaspline';
extend(defaultOptions, {
    /**
     * Maximum range which can be set using the navigator's handles.
     * Opposite of [xAxis.minRange](#xAxis.minRange).
     *
     * @sample {highstock} stock/navigator/maxrange/
     *         Defined max and min range
     *
     * @type      {number}
     * @since     6.0.0
     * @product   highstock gantt
     * @apioption xAxis.maxRange
     */
    /**
     * The navigator is a small series below the main series, displaying
     * a view of the entire data set. It provides tools to zoom in and
     * out on parts of the data as well as panning across the dataset.
     *
     * @product      highstock gantt
     * @optionparent navigator
     */
    navigator: {
        /**
         * Whether the navigator and scrollbar should adapt to updated data
         * in the base X axis. When loading data async, as in the demo below,
         * this should be `false`. Otherwise new data will trigger navigator
         * redraw, which will cause unwanted looping. In the demo below, the
         * data in the navigator is set only once. On navigating, only the main
         * chart content is updated.
         *
         * @sample {highstock} stock/demo/lazy-loading/
         *         Set to false with async data loading
         *
         * @type      {boolean}
         * @default   true
         * @apioption navigator.adaptToUpdatedData
         */
        /**
         * An integer identifying the index to use for the base series, or a
         * string representing the id of the series.
         *
         * **Note**: As of Highcharts 5.0, this is now a deprecated option.
         * Prefer [series.showInNavigator](#plotOptions.series.showInNavigator).
         *
         * @see [series.showInNavigator](#plotOptions.series.showInNavigator)
         *
         * @deprecated
         * @type      {number|string}
         * @default   0
         * @apioption navigator.baseSeries
         */
        /**
         * Enable or disable the navigator.
         *
         * @sample {highstock} stock/navigator/enabled/
         *         Disable the navigator
         *
         * @type      {boolean}
         * @default   true
         * @apioption navigator.enabled
         */
        /**
         * When the chart is inverted, whether to draw the navigator on the
         * opposite side.
         *
         * @type      {boolean}
         * @default   false
         * @since     5.0.8
         * @apioption navigator.opposite
         */
        /**
         * The height of the navigator.
         *
         * @sample {highstock} stock/navigator/height/
         *         A higher navigator
         */
        height: 40,
        /**
         * The distance from the nearest element, the X axis or X axis labels.
         *
         * @sample {highstock} stock/navigator/margin/
         *         A margin of 2 draws the navigator closer to the X axis labels
         */
        margin: 25,
        /**
         * Whether the mask should be inside the range marking the zoomed
         * range, or outside. In Highstock 1.x it was always `false`.
         *
         * @sample {highstock} stock/navigator/maskinside-false/
         *         False, mask outside
         *
         * @since   2.0
         */
        maskInside: true,
        /**
         * Options for the handles for dragging the zoomed area.
         *
         * @sample {highstock} stock/navigator/handles/
         *         Colored handles
         */
        handles: {
            /**
             * Width for handles.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @since   6.0.0
             */
            width: 7,
            /**
             * Height for handles.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @since   6.0.0
             */
            height: 15,
            /**
             * Array to define shapes of handles. 0-index for left, 1-index for
             * right.
             *
             * Additionally, the URL to a graphic can be given on this form:
             * `url(graphic.png)`. Note that for the image to be applied to
             * exported charts, its URL needs to be accessible by the export
             * server.
             *
             * Custom callbacks for symbol path generation can also be added to
             * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
             * used by its method name, as shown in the demo.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @type    {Array<string>}
             * @default ["navigator-handle", "navigator-handle"]
             * @since   6.0.0
             */
            symbols: ['navigator-handle', 'navigator-handle'],
            /**
             * Allows to enable/disable handles.
             *
             * @since   6.0.0
             */
            enabled: true,
            /**
             * The width for the handle border and the stripes inside.
             *
             * @sample {highstock} stock/navigator/styled-handles/
             *         Styled handles
             *
             * @since     6.0.0
             * @apioption navigator.handles.lineWidth
             */
            lineWidth: 1,
            /**
             * The fill for the handle.
             *
             * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            backgroundColor: palette.neutralColor5,
            /**
             * The stroke for the handle border and the stripes inside.
             *
             * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            borderColor: palette.neutralColor40
        },
        /**
         * The color of the mask covering the areas of the navigator series
         * that are currently not visible in the main series. The default
         * color is bluish with an opacity of 0.3 to see the series below.
         *
         * @see In styled mode, the mask is styled with the
         *      `.highcharts-navigator-mask` and
         *      `.highcharts-navigator-mask-inside` classes.
         *
         * @sample {highstock} stock/navigator/maskfill/
         *         Blue, semi transparent mask
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default rgba(102,133,194,0.3)
         */
        maskFill: color(palette.highlightColor60).setOpacity(0.3).get(),
        /**
         * The color of the line marking the currently zoomed area in the
         * navigator.
         *
         * @sample {highstock} stock/navigator/outline/
         *         2px blue outline
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default #cccccc
         */
        outlineColor: palette.neutralColor20,
        /**
         * The width of the line marking the currently zoomed area in the
         * navigator.
         *
         * @see In styled mode, the outline stroke width is set with the
         *      `.highcharts-navigator-outline` class.
         *
         * @sample {highstock} stock/navigator/outline/
         *         2px blue outline
         *
         * @type    {number}
         */
        outlineWidth: 1,
        /**
         * Options for the navigator series. Available options are the same
         * as any series, documented at [plotOptions](#plotOptions.series)
         * and [series](#series).
         *
         * Unless data is explicitly defined on navigator.series, the data
         * is borrowed from the first series in the chart.
         *
         * Default series options for the navigator series are:
         * ```js
         * series: {
         *     type: 'areaspline',
         *     fillOpacity: 0.05,
         *     dataGrouping: {
         *         smoothed: true
         *     },
         *     lineWidth: 1,
         *     marker: {
         *         enabled: false
         *     }
         * }
         * ```
         *
         * @see In styled mode, the navigator series is styled with the
         *      `.highcharts-navigator-series` class.
         *
         * @sample {highstock} stock/navigator/series-data/
         *         Using a separate data set for the navigator
         * @sample {highstock} stock/navigator/series/
         *         A green navigator series
         *
         * @type {*|Array<*>|Highcharts.SeriesOptionsType|Array<Highcharts.SeriesOptionsType>}
         */
        series: {
            /**
             * The type of the navigator series.
             *
             * Heads up:
             * In column-type navigator, zooming is limited to at least one
             * point with its `pointRange`.
             *
             * @sample {highstock} stock/navigator/column/
             *         Column type navigator
             *
             * @type    {string}
             * @default {highstock} `areaspline` if defined, otherwise `line`
             * @default {gantt} gantt
             */
            type: defaultSeriesType,
            /**
             * The fill opacity of the navigator series.
             */
            fillOpacity: 0.05,
            /**
             * The pixel line width of the navigator series.
             */
            lineWidth: 1,
            /**
             * @ignore-option
             */
            compare: null,
            /**
             * Unless data is explicitly defined, the data is borrowed from the
             * first series in the chart.
             *
             * @type      {Array<number|Array<number|string|null>|object|null>}
             * @product   highstock
             * @apioption navigator.series.data
             */
            /**
             * Data grouping options for the navigator series.
             *
             * @extends plotOptions.series.dataGrouping
             */
            dataGrouping: {
                approximation: 'average',
                enabled: true,
                groupPixelWidth: 2,
                smoothed: true,
                // Day and week differs from plotOptions.series.dataGrouping
                units: [
                    ['millisecond', [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
                    ['second', [1, 2, 5, 10, 15, 30]],
                    ['minute', [1, 2, 5, 10, 15, 30]],
                    ['hour', [1, 2, 3, 4, 6, 8, 12]],
                    ['day', [1, 2, 3, 4]],
                    ['week', [1, 2, 3]],
                    ['month', [1, 3, 6]],
                    ['year', null]
                ]
            },
            /**
             * Data label options for the navigator series. Data labels are
             * disabled by default on the navigator series.
             *
             * @extends plotOptions.series.dataLabels
             */
            dataLabels: {
                enabled: false,
                zIndex: 2 // #1839
            },
            id: 'highcharts-navigator-series',
            className: 'highcharts-navigator-series',
            /**
             * Sets the fill color of the navigator series.
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @apioption navigator.series.color
             */
            /**
             * Line color for the navigator series. Allows setting the color
             * while disallowing the default candlestick setting.
             *
             * @type {Highcharts.ColorString|null}
             */
            lineColor: null,
            marker: {
                enabled: false
            },
            /**
             * Since Highstock v8, default value is the same as default
             * `pointRange` defined for a specific type (e.g. `null` for
             * column type).
             *
             * In Highstock version < 8, defaults to 0.
             *
             * @extends plotOptions.series.pointRange
             * @type {number|null}
             * @apioption navigator.series.pointRange
             */
            /**
             * The threshold option. Setting it to 0 will make the default
             * navigator area series draw its area from the 0 value and up.
             *
             * @type {number|null}
             */
            threshold: null
        },
        /**
         * Options for the navigator X axis. Default series options for the
         * navigator xAxis are:
         * ```js
         * xAxis: {
         *     tickWidth: 0,
         *     lineWidth: 0,
         *     gridLineWidth: 1,
         *     tickPixelInterval: 200,
         *     labels: {
         *            align: 'left',
         *         style: {
         *             color: '#888'
         *         },
         *         x: 3,
         *         y: -4
         *     }
         * }
         * ```
         *
         * @extends   xAxis
         * @excluding linkedTo, maxZoom, minRange, opposite, range, scrollbar,
         *            showEmpty, maxRange
         */
        xAxis: {
            /**
             * Additional range on the right side of the xAxis. Works similar to
             * xAxis.maxPadding, but value is set in milliseconds.
             * Can be set for both, main xAxis and navigator's xAxis.
             *
             * @since   6.0.0
             */
            overscroll: 0,
            className: 'highcharts-navigator-xaxis',
            tickLength: 0,
            lineWidth: 0,
            gridLineColor: palette.neutralColor10,
            gridLineWidth: 1,
            tickPixelInterval: 200,
            labels: {
                align: 'left',
                /**
                 * @type {Highcharts.CSSObject}
                 */
                style: {
                    /** @ignore */
                    color: palette.neutralColor40
                },
                x: 3,
                y: -4
            },
            crosshair: false
        },
        /**
         * Options for the navigator Y axis. Default series options for the
         * navigator yAxis are:
         * ```js
         * yAxis: {
         *     gridLineWidth: 0,
         *     startOnTick: false,
         *     endOnTick: false,
         *     minPadding: 0.1,
         *     maxPadding: 0.1,
         *     labels: {
         *         enabled: false
         *     },
         *     title: {
         *         text: null
         *     },
         *     tickWidth: 0
         * }
         * ```
         *
         * @extends   yAxis
         * @excluding height, linkedTo, maxZoom, minRange, ordinal, range,
         *            showEmpty, scrollbar, top, units, maxRange, minLength,
         *            maxLength, resize
         */
        yAxis: {
            className: 'highcharts-navigator-yaxis',
            gridLineWidth: 0,
            startOnTick: false,
            endOnTick: false,
            minPadding: 0.1,
            maxPadding: 0.1,
            labels: {
                enabled: false
            },
            crosshair: false,
            title: {
                text: null
            },
            tickLength: 0,
            tickWidth: 0
        }
    }
});
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * Draw one of the handles on the side of the zoomed range in the navigator
 *
 * @private
 * @function Highcharts.Renderer#symbols.navigator-handle
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {Highcharts.NavigatorHandlesOptions} options
 * @return {Highcharts.SVGPathArray}
 *         Path to be used in a handle
 */
H.Renderer.prototype.symbols['navigator-handle'] = function (x, y, w, h, options) {
    var halfWidth = (options && options.width || 0) / 2, markerPosition = Math.round(halfWidth / 3) + 0.5, height = options && options.height || 0;
    return [
        ['M', -halfWidth - 1, 0.5],
        ['L', halfWidth, 0.5],
        ['L', halfWidth, height + 0.5],
        ['L', -halfWidth - 1, height + 0.5],
        ['L', -halfWidth - 1, 0.5],
        ['M', -markerPosition, 4],
        ['L', -markerPosition, height - 3],
        ['M', markerPosition - 1, 4],
        ['L', markerPosition - 1, height - 3]
    ];
};
/**
 * The Navigator class
 *
 * @private
 * @class
 * @name Highcharts.Navigator
 *
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var Navigator = /** @class */ (function () {
    function Navigator(chart) {
        this.baseSeries = void 0;
        this.chart = void 0;
        this.handles = void 0;
        this.height = void 0;
        this.left = void 0;
        this.navigatorEnabled = void 0;
        this.navigatorGroup = void 0;
        this.navigatorOptions = void 0;
        this.navigatorSeries = void 0;
        this.navigatorSize = void 0;
        this.opposite = void 0;
        this.outline = void 0;
        this.outlineHeight = void 0;
        this.range = void 0;
        this.rendered = void 0;
        this.shades = void 0;
        this.size = void 0;
        this.top = void 0;
        this.xAxis = void 0;
        this.yAxis = void 0;
        this.zoomedMax = void 0;
        this.zoomedMin = void 0;
        this.init(chart);
    }
    /**
     * Draw one of the handles on the side of the zoomed range in the navigator
     *
     * @private
     * @function Highcharts.Navigator#drawHandle
     *
     * @param {number} x
     *        The x center for the handle
     *
     * @param {number} index
     *        0 for left and 1 for right
     *
     * @param {boolean|undefined} inverted
     *        flag for chart.inverted
     *
     * @param {string} verb
     *        use 'animate' or 'attr'
     */
    Navigator.prototype.drawHandle = function (x, index, inverted, verb) {
        var navigator = this, height = navigator.navigatorOptions.handles.height;
        // Place it
        navigator.handles[index][verb](inverted ? {
            translateX: Math.round(navigator.left + navigator.height / 2),
            translateY: Math.round(navigator.top + parseInt(x, 10) + 0.5 - height)
        } : {
            translateX: Math.round(navigator.left + parseInt(x, 10)),
            translateY: Math.round(navigator.top + navigator.height / 2 - height / 2 - 1)
        });
    };
    /**
     * Render outline around the zoomed range
     *
     * @private
     * @function Highcharts.Navigator#drawOutline
     *
     * @param {number} zoomedMin
     *        in pixels position where zoomed range starts
     *
     * @param {number} zoomedMax
     *        in pixels position where zoomed range ends
     *
     * @param {boolean|undefined} inverted
     *        flag if chart is inverted
     *
     * @param {string} verb
     *        use 'animate' or 'attr'
     */
    Navigator.prototype.drawOutline = function (zoomedMin, zoomedMax, inverted, verb) {
        var navigator = this, maskInside = navigator.navigatorOptions.maskInside, outlineWidth = navigator.outline.strokeWidth(), halfOutline = outlineWidth / 2, outlineCorrection = (outlineWidth % 2) / 2, // #5800
        outlineHeight = navigator.outlineHeight, scrollbarHeight = navigator.scrollbarHeight || 0, navigatorSize = navigator.size, left = navigator.left - scrollbarHeight, navigatorTop = navigator.top, verticalMin, path;
        if (inverted) {
            left -= halfOutline;
            verticalMin = navigatorTop + zoomedMax + outlineCorrection;
            zoomedMax = navigatorTop + zoomedMin + outlineCorrection;
            path = [
                ['M', left + outlineHeight, navigatorTop - scrollbarHeight - outlineCorrection],
                ['L', left + outlineHeight, verticalMin],
                ['L', left, verticalMin],
                ['L', left, zoomedMax],
                ['L', left + outlineHeight, zoomedMax],
                ['L', left + outlineHeight, navigatorTop + navigatorSize + scrollbarHeight]
            ];
            if (maskInside) {
                path.push(['M', left + outlineHeight, verticalMin - halfOutline], // upper left of zoomed range
                ['L', left + outlineHeight, zoomedMax + halfOutline] // upper right of z.r.
                );
            }
        }
        else {
            zoomedMin += left + scrollbarHeight - outlineCorrection;
            zoomedMax += left + scrollbarHeight - outlineCorrection;
            navigatorTop += halfOutline;
            path = [
                ['M', left, navigatorTop],
                ['L', zoomedMin, navigatorTop],
                ['L', zoomedMin, navigatorTop + outlineHeight],
                ['L', zoomedMax, navigatorTop + outlineHeight],
                ['L', zoomedMax, navigatorTop],
                ['L', left + navigatorSize + scrollbarHeight * 2, navigatorTop] // right
            ];
            if (maskInside) {
                path.push(['M', zoomedMin - halfOutline, navigatorTop], // upper left of zoomed range
                ['L', zoomedMax + halfOutline, navigatorTop] // upper right of z.r.
                );
            }
        }
        navigator.outline[verb]({
            d: path
        });
    };
    /**
     * Render outline around the zoomed range
     *
     * @private
     * @function Highcharts.Navigator#drawMasks
     *
     * @param {number} zoomedMin
     *        in pixels position where zoomed range starts
     *
     * @param {number} zoomedMax
     *        in pixels position where zoomed range ends
     *
     * @param {boolean|undefined} inverted
     *        flag if chart is inverted
     *
     * @param {string} verb
     *        use 'animate' or 'attr'
     */
    Navigator.prototype.drawMasks = function (zoomedMin, zoomedMax, inverted, verb) {
        var navigator = this, left = navigator.left, top = navigator.top, navigatorHeight = navigator.height, height, width, x, y;
        // Determine rectangle position & size
        // According to (non)inverted position:
        if (inverted) {
            x = [left, left, left];
            y = [top, top + zoomedMin, top + zoomedMax];
            width = [navigatorHeight, navigatorHeight, navigatorHeight];
            height = [
                zoomedMin,
                zoomedMax - zoomedMin,
                navigator.size - zoomedMax
            ];
        }
        else {
            x = [left, left + zoomedMin, left + zoomedMax];
            y = [top, top, top];
            width = [
                zoomedMin,
                zoomedMax - zoomedMin,
                navigator.size - zoomedMax
            ];
            height = [navigatorHeight, navigatorHeight, navigatorHeight];
        }
        navigator.shades.forEach(function (shade, i) {
            shade[verb]({
                x: x[i],
                y: y[i],
                width: width[i],
                height: height[i]
            });
        });
    };
    /**
     * Generate DOM elements for a navigator:
     *
     * - main navigator group
     *
     * - all shades
     *
     * - outline
     *
     * - handles
     *
     * @private
     * @function Highcharts.Navigator#renderElements
     */
    Navigator.prototype.renderElements = function () {
        var navigator = this, navigatorOptions = navigator.navigatorOptions, maskInside = navigatorOptions.maskInside, chart = navigator.chart, inverted = chart.inverted, renderer = chart.renderer, navigatorGroup, mouseCursor = {
            cursor: inverted ? 'ns-resize' : 'ew-resize'
        };
        // Create the main navigator group
        navigator.navigatorGroup = navigatorGroup = renderer.g('navigator')
            .attr({
            zIndex: 8,
            visibility: 'hidden'
        })
            .add();
        // Create masks, each mask will get events and fill:
        [
            !maskInside,
            maskInside,
            !maskInside
        ].forEach(function (hasMask, index) {
            navigator.shades[index] = renderer.rect()
                .addClass('highcharts-navigator-mask' +
                (index === 1 ? '-inside' : '-outside'))
                .add(navigatorGroup);
            if (!chart.styledMode) {
                navigator.shades[index]
                    .attr({
                    fill: hasMask ?
                        navigatorOptions.maskFill :
                        'rgba(0,0,0,0)'
                })
                    .css((index === 1) && mouseCursor);
            }
        });
        // Create the outline:
        navigator.outline = renderer.path()
            .addClass('highcharts-navigator-outline')
            .add(navigatorGroup);
        if (!chart.styledMode) {
            navigator.outline.attr({
                'stroke-width': navigatorOptions.outlineWidth,
                stroke: navigatorOptions.outlineColor
            });
        }
        // Create the handlers:
        if (navigatorOptions.handles.enabled) {
            [0, 1].forEach(function (index) {
                navigatorOptions.handles.inverted = chart.inverted;
                navigator.handles[index] = renderer.symbol(navigatorOptions.handles.symbols[index], -navigatorOptions.handles.width / 2 - 1, 0, navigatorOptions.handles.width, navigatorOptions.handles.height, navigatorOptions.handles);
                // zIndex = 6 for right handle, 7 for left.
                // Can't be 10, because of the tooltip in inverted chart #2908
                navigator.handles[index].attr({ zIndex: 7 - index })
                    .addClass('highcharts-navigator-handle ' +
                    'highcharts-navigator-handle-' +
                    ['left', 'right'][index]).add(navigatorGroup);
                if (!chart.styledMode) {
                    var handlesOptions = navigatorOptions.handles;
                    navigator.handles[index]
                        .attr({
                        fill: handlesOptions.backgroundColor,
                        stroke: handlesOptions.borderColor,
                        'stroke-width': handlesOptions.lineWidth
                    })
                        .css(mouseCursor);
                }
            });
        }
    };
    /**
     * Update navigator
     *
     * @private
     * @function Highcharts.Navigator#update
     *
     * @param {Highcharts.NavigatorOptions} options
     *        Options to merge in when updating navigator
     */
    Navigator.prototype.update = function (options) {
        // Remove references to old navigator series in base series
        (this.series || []).forEach(function (series) {
            if (series.baseSeries) {
                delete series.baseSeries.navigatorSeries;
            }
        });
        // Destroy and rebuild navigator
        this.destroy();
        var chartOptions = this.chart.options;
        merge(true, chartOptions.navigator, this.options, options);
        this.init(this.chart);
    };
    /**
     * Render the navigator
     *
     * @private
     * @function Highcharts.Navigator#render
     * @param {number} min
     *        X axis value minimum
     * @param {number} max
     *        X axis value maximum
     * @param {number} [pxMin]
     *        Pixel value minimum
     * @param {number} [pxMax]
     *        Pixel value maximum
     * @return {void}
     */
    Navigator.prototype.render = function (min, max, pxMin, pxMax) {
        var navigator = this, chart = navigator.chart, navigatorWidth, scrollbarLeft, scrollbarTop, scrollbarHeight = navigator.scrollbarHeight, navigatorSize, xAxis = navigator.xAxis, pointRange = xAxis.pointRange || 0, scrollbarXAxis = xAxis.navigatorAxis.fake ? chart.xAxis[0] : xAxis, navigatorEnabled = navigator.navigatorEnabled, zoomedMin, zoomedMax, rendered = navigator.rendered, inverted = chart.inverted, verb, newMin, newMax, currentRange, minRange = chart.xAxis[0].minRange, maxRange = chart.xAxis[0].options.maxRange;
        // Don't redraw while moving the handles (#4703).
        if (this.hasDragged && !defined(pxMin)) {
            return;
        }
        min = correctFloat(min - pointRange / 2);
        max = correctFloat(max + pointRange / 2);
        // Don't render the navigator until we have data (#486, #4202, #5172).
        if (!isNumber(min) || !isNumber(max)) {
            // However, if navigator was already rendered, we may need to resize
            // it. For example hidden series, but visible navigator (#6022).
            if (rendered) {
                pxMin = 0;
                pxMax = pick(xAxis.width, scrollbarXAxis.width);
            }
            else {
                return;
            }
        }
        navigator.left = pick(xAxis.left, 
        // in case of scrollbar only, without navigator
        chart.plotLeft + scrollbarHeight +
            (inverted ? chart.plotWidth : 0));
        navigator.size = zoomedMax = navigatorSize = pick(xAxis.len, (inverted ? chart.plotHeight : chart.plotWidth) -
            2 * scrollbarHeight);
        if (inverted) {
            navigatorWidth = scrollbarHeight;
        }
        else {
            navigatorWidth = navigatorSize + 2 * scrollbarHeight;
        }
        // Get the pixel position of the handles
        pxMin = pick(pxMin, xAxis.toPixels(min, true));
        pxMax = pick(pxMax, xAxis.toPixels(max, true));
        // Verify (#1851, #2238)
        if (!isNumber(pxMin) || Math.abs(pxMin) === Infinity) {
            pxMin = 0;
            pxMax = navigatorWidth;
        }
        // Are we below the minRange? (#2618, #6191)
        newMin = xAxis.toValue(pxMin, true);
        newMax = xAxis.toValue(pxMax, true);
        currentRange = Math.abs(correctFloat(newMax - newMin));
        if (currentRange < minRange) {
            if (this.grabbedLeft) {
                pxMin = xAxis.toPixels(newMax - minRange - pointRange, true);
            }
            else if (this.grabbedRight) {
                pxMax = xAxis.toPixels(newMin + minRange + pointRange, true);
            }
        }
        else if (defined(maxRange) &&
            correctFloat(currentRange - pointRange) > maxRange) {
            if (this.grabbedLeft) {
                pxMin = xAxis.toPixels(newMax - maxRange - pointRange, true);
            }
            else if (this.grabbedRight) {
                pxMax = xAxis.toPixels(newMin + maxRange + pointRange, true);
            }
        }
        // Handles are allowed to cross, but never exceed the plot area
        navigator.zoomedMax = clamp(Math.max(pxMin, pxMax), 0, zoomedMax);
        navigator.zoomedMin = clamp(navigator.fixedWidth ?
            navigator.zoomedMax - navigator.fixedWidth :
            Math.min(pxMin, pxMax), 0, zoomedMax);
        navigator.range = navigator.zoomedMax - navigator.zoomedMin;
        zoomedMax = Math.round(navigator.zoomedMax);
        zoomedMin = Math.round(navigator.zoomedMin);
        if (navigatorEnabled) {
            navigator.navigatorGroup.attr({
                visibility: 'visible'
            });
            // Place elements
            verb = rendered && !navigator.hasDragged ? 'animate' : 'attr';
            navigator.drawMasks(zoomedMin, zoomedMax, inverted, verb);
            navigator.drawOutline(zoomedMin, zoomedMax, inverted, verb);
            if (navigator.navigatorOptions.handles.enabled) {
                navigator.drawHandle(zoomedMin, 0, inverted, verb);
                navigator.drawHandle(zoomedMax, 1, inverted, verb);
            }
        }
        if (navigator.scrollbar) {
            if (inverted) {
                scrollbarTop = navigator.top - scrollbarHeight;
                scrollbarLeft = navigator.left - scrollbarHeight +
                    (navigatorEnabled || !scrollbarXAxis.opposite ? 0 :
                        // Multiple axes has offsets:
                        (scrollbarXAxis.titleOffset || 0) +
                            // Self margin from the axis.title
                            scrollbarXAxis.axisTitleMargin);
                scrollbarHeight = navigatorSize + 2 * scrollbarHeight;
            }
            else {
                scrollbarTop = navigator.top + (navigatorEnabled ?
                    navigator.height :
                    -scrollbarHeight);
                scrollbarLeft = navigator.left - scrollbarHeight;
            }
            // Reposition scrollbar
            navigator.scrollbar.position(scrollbarLeft, scrollbarTop, navigatorWidth, scrollbarHeight);
            // Keep scale 0-1
            navigator.scrollbar.setRange(
            // Use real value, not rounded because range can be very small
            // (#1716)
            navigator.zoomedMin / (navigatorSize || 1), navigator.zoomedMax / (navigatorSize || 1));
        }
        navigator.rendered = true;
    };
    /**
     * Set up the mouse and touch events for the navigator
     *
     * @private
     * @function Highcharts.Navigator#addMouseEvents
     */
    Navigator.prototype.addMouseEvents = function () {
        var navigator = this, chart = navigator.chart, container = chart.container, eventsToUnbind = [], mouseMoveHandler, mouseUpHandler;
        /**
         * Create mouse events' handlers.
         * Make them as separate functions to enable wrapping them:
         */
        navigator.mouseMoveHandler = mouseMoveHandler = function (e) {
            navigator.onMouseMove(e);
        };
        navigator.mouseUpHandler = mouseUpHandler = function (e) {
            navigator.onMouseUp(e);
        };
        // Add shades and handles mousedown events
        eventsToUnbind = navigator.getPartsEvents('mousedown');
        // Add mouse move and mouseup events. These are bind to doc/container,
        // because Navigator.grabbedSomething flags are stored in mousedown
        // events
        eventsToUnbind.push(addEvent(chart.renderTo, 'mousemove', mouseMoveHandler), addEvent(container.ownerDocument, 'mouseup', mouseUpHandler));
        // Touch events
        if (hasTouch) {
            eventsToUnbind.push(addEvent(chart.renderTo, 'touchmove', mouseMoveHandler), addEvent(container.ownerDocument, 'touchend', mouseUpHandler));
            eventsToUnbind.concat(navigator.getPartsEvents('touchstart'));
        }
        navigator.eventsToUnbind = eventsToUnbind;
        // Data events
        if (navigator.series && navigator.series[0]) {
            eventsToUnbind.push(addEvent(navigator.series[0].xAxis, 'foundExtremes', function () {
                chart.navigator.modifyNavigatorAxisExtremes();
            }));
        }
    };
    /**
     * Generate events for handles and masks
     *
     * @private
     * @function Highcharts.Navigator#getPartsEvents
     *
     * @param {string} eventName
     *        Event name handler, 'mousedown' or 'touchstart'
     *
     * @return {Array<Function>}
     *         An array of functions to remove navigator functions from the
     *         events again.
     */
    Navigator.prototype.getPartsEvents = function (eventName) {
        var navigator = this, events = [];
        ['shades', 'handles'].forEach(function (name) {
            navigator[name].forEach(function (navigatorItem, index) {
                events.push(addEvent(navigatorItem.element, eventName, function (e) {
                    navigator[name + 'Mousedown'](e, index);
                }));
            });
        });
        return events;
    };
    /**
     * Mousedown on a shaded mask, either:
     *
     * - will be stored for future drag&drop
     *
     * - will directly shift to a new range
     *
     * @private
     * @function Highcharts.Navigator#shadesMousedown
     *
     * @param {Highcharts.PointerEventObject} e
     *        Mouse event
     *
     * @param {number} index
     *        Index of a mask in Navigator.shades array
     */
    Navigator.prototype.shadesMousedown = function (e, index) {
        e = this.chart.pointer.normalize(e);
        var navigator = this, chart = navigator.chart, xAxis = navigator.xAxis, zoomedMin = navigator.zoomedMin, navigatorPosition = navigator.left, navigatorSize = navigator.size, range = navigator.range, chartX = e.chartX, fixedMax, fixedMin, ext, left;
        // For inverted chart, swap some options:
        if (chart.inverted) {
            chartX = e.chartY;
            navigatorPosition = navigator.top;
        }
        if (index === 1) {
            // Store information for drag&drop
            navigator.grabbedCenter = chartX;
            navigator.fixedWidth = range;
            navigator.dragOffset = chartX - zoomedMin;
        }
        else {
            // Shift the range by clicking on shaded areas
            left = chartX - navigatorPosition - range / 2;
            if (index === 0) {
                left = Math.max(0, left);
            }
            else if (index === 2 && left + range >= navigatorSize) {
                left = navigatorSize - range;
                if (navigator.reversedExtremes) {
                    // #7713
                    left -= range;
                    fixedMin = navigator.getUnionExtremes().dataMin;
                }
                else {
                    // #2293, #3543
                    fixedMax = navigator.getUnionExtremes().dataMax;
                }
            }
            if (left !== zoomedMin) { // it has actually moved
                navigator.fixedWidth = range; // #1370
                ext = xAxis.navigatorAxis.toFixedRange(left, left + range, fixedMin, fixedMax);
                if (defined(ext.min)) { // #7411
                    chart.xAxis[0].setExtremes(Math.min(ext.min, ext.max), Math.max(ext.min, ext.max), true, null, // auto animation
                    { trigger: 'navigator' });
                }
            }
        }
    };
    /**
     * Mousedown on a handle mask.
     * Will store necessary information for drag&drop.
     *
     * @private
     * @function Highcharts.Navigator#handlesMousedown
     * @param {Highcharts.PointerEventObject} e
     *        Mouse event
     * @param {number} index
     *        Index of a handle in Navigator.handles array
     * @return {void}
     */
    Navigator.prototype.handlesMousedown = function (e, index) {
        e = this.chart.pointer.normalize(e);
        var navigator = this, chart = navigator.chart, baseXAxis = chart.xAxis[0], 
        // For reversed axes, min and max are changed,
        // so the other extreme should be stored
        reverse = navigator.reversedExtremes;
        if (index === 0) {
            // Grab the left handle
            navigator.grabbedLeft = true;
            navigator.otherHandlePos = navigator.zoomedMax;
            navigator.fixedExtreme = reverse ? baseXAxis.min : baseXAxis.max;
        }
        else {
            // Grab the right handle
            navigator.grabbedRight = true;
            navigator.otherHandlePos = navigator.zoomedMin;
            navigator.fixedExtreme = reverse ? baseXAxis.max : baseXAxis.min;
        }
        chart.fixedRange = null;
    };
    /**
     * Mouse move event based on x/y mouse position.
     *
     * @private
     * @function Highcharts.Navigator#onMouseMove
     *
     * @param {Highcharts.PointerEventObject} e
     *        Mouse event
     */
    Navigator.prototype.onMouseMove = function (e) {
        var navigator = this, chart = navigator.chart, left = navigator.left, navigatorSize = navigator.navigatorSize, range = navigator.range, dragOffset = navigator.dragOffset, inverted = chart.inverted, chartX;
        // In iOS, a mousemove event with e.pageX === 0 is fired when holding
        // the finger down in the center of the scrollbar. This should be
        // ignored.
        if (!e.touches || e.touches[0].pageX !== 0) { // #4696
            e = chart.pointer.normalize(e);
            chartX = e.chartX;
            // Swap some options for inverted chart
            if (inverted) {
                left = navigator.top;
                chartX = e.chartY;
            }
            // Drag left handle or top handle
            if (navigator.grabbedLeft) {
                navigator.hasDragged = true;
                navigator.render(0, 0, chartX - left, navigator.otherHandlePos);
                // Drag right handle or bottom handle
            }
            else if (navigator.grabbedRight) {
                navigator.hasDragged = true;
                navigator.render(0, 0, navigator.otherHandlePos, chartX - left);
                // Drag scrollbar or open area in navigator
            }
            else if (navigator.grabbedCenter) {
                navigator.hasDragged = true;
                if (chartX < dragOffset) { // outside left
                    chartX = dragOffset;
                    // outside right
                }
                else if (chartX >
                    navigatorSize + dragOffset - range) {
                    chartX = navigatorSize + dragOffset - range;
                }
                navigator.render(0, 0, chartX - dragOffset, chartX - dragOffset + range);
            }
            if (navigator.hasDragged &&
                navigator.scrollbar &&
                pick(navigator.scrollbar.options.liveRedraw, 
                // By default, don't run live redraw on VML, on touch
                // devices or if the chart is in boost.
                H.svg && !isTouchDevice && !this.chart.isBoosting)) {
                e.DOMType = e.type; // DOMType is for IE8
                setTimeout(function () {
                    navigator.onMouseUp(e);
                }, 0);
            }
        }
    };
    /**
     * Mouse up event based on x/y mouse position.
     *
     * @private
     * @function Highcharts.Navigator#onMouseUp
     * @param {Highcharts.PointerEventObject} e
     *        Mouse event
     * @return {void}
     */
    Navigator.prototype.onMouseUp = function (e) {
        var navigator = this, chart = navigator.chart, xAxis = navigator.xAxis, scrollbar = navigator.scrollbar, DOMEvent = e.DOMEvent || e, inverted = chart.inverted, verb = navigator.rendered && !navigator.hasDragged ?
            'animate' : 'attr', zoomedMax, zoomedMin, unionExtremes, fixedMin, fixedMax, ext;
        if (
        // MouseUp is called for both, navigator and scrollbar (that order),
        // which causes calling afterSetExtremes twice. Prevent first call
        // by checking if scrollbar is going to set new extremes (#6334)
        (navigator.hasDragged && (!scrollbar || !scrollbar.hasDragged)) ||
            e.trigger === 'scrollbar') {
            unionExtremes = navigator.getUnionExtremes();
            // When dragging one handle, make sure the other one doesn't change
            if (navigator.zoomedMin === navigator.otherHandlePos) {
                fixedMin = navigator.fixedExtreme;
            }
            else if (navigator.zoomedMax === navigator.otherHandlePos) {
                fixedMax = navigator.fixedExtreme;
            }
            // Snap to right edge (#4076)
            if (navigator.zoomedMax === navigator.size) {
                fixedMax = navigator.reversedExtremes ?
                    unionExtremes.dataMin :
                    unionExtremes.dataMax;
            }
            // Snap to left edge (#7576)
            if (navigator.zoomedMin === 0) {
                fixedMin = navigator.reversedExtremes ?
                    unionExtremes.dataMax :
                    unionExtremes.dataMin;
            }
            ext = xAxis.navigatorAxis.toFixedRange(navigator.zoomedMin, navigator.zoomedMax, fixedMin, fixedMax);
            if (defined(ext.min)) {
                chart.xAxis[0].setExtremes(Math.min(ext.min, ext.max), Math.max(ext.min, ext.max), true, 
                // Run animation when clicking buttons, scrollbar track etc,
                // but not when dragging handles or scrollbar
                navigator.hasDragged ? false : null, {
                    trigger: 'navigator',
                    triggerOp: 'navigator-drag',
                    DOMEvent: DOMEvent // #1838
                });
            }
        }
        if (e.DOMType !== 'mousemove' &&
            e.DOMType !== 'touchmove') {
            navigator.grabbedLeft = navigator.grabbedRight =
                navigator.grabbedCenter = navigator.fixedWidth =
                    navigator.fixedExtreme = navigator.otherHandlePos =
                        navigator.hasDragged = navigator.dragOffset = null;
        }
        // Update position of navigator shades, outline and handles (#12573)
        if (navigator.navigatorEnabled &&
            isNumber(navigator.zoomedMin) &&
            isNumber(navigator.zoomedMax)) {
            zoomedMin = Math.round(navigator.zoomedMin);
            zoomedMax = Math.round(navigator.zoomedMax);
            if (navigator.shades) {
                navigator.drawMasks(zoomedMin, zoomedMax, inverted, verb);
            }
            if (navigator.outline) {
                navigator.drawOutline(zoomedMin, zoomedMax, inverted, verb);
            }
            if (navigator.navigatorOptions.handles.enabled &&
                Object.keys(navigator.handles).length ===
                    navigator.handles.length) {
                navigator.drawHandle(zoomedMin, 0, inverted, verb);
                navigator.drawHandle(zoomedMax, 1, inverted, verb);
            }
        }
    };
    /**
     * Removes the event handlers attached previously with addEvents.
     *
     * @private
     * @function Highcharts.Navigator#removeEvents
     * @return {void}
     */
    Navigator.prototype.removeEvents = function () {
        if (this.eventsToUnbind) {
            this.eventsToUnbind.forEach(function (unbind) {
                unbind();
            });
            this.eventsToUnbind = void 0;
        }
        this.removeBaseSeriesEvents();
    };
    /**
     * Remove data events.
     *
     * @private
     * @function Highcharts.Navigator#removeBaseSeriesEvents
     * @return {void}
     */
    Navigator.prototype.removeBaseSeriesEvents = function () {
        var baseSeries = this.baseSeries || [];
        if (this.navigatorEnabled && baseSeries[0]) {
            if (this.navigatorOptions.adaptToUpdatedData !== false) {
                baseSeries.forEach(function (series) {
                    removeEvent(series, 'updatedData', this.updatedDataHandler);
                }, this);
            }
            // We only listen for extremes-events on the first baseSeries
            if (baseSeries[0].xAxis) {
                removeEvent(baseSeries[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes);
            }
        }
    };
    /**
     * Initialize the Navigator object
     *
     * @private
     * @function Highcharts.Navigator#init
     *
     * @param {Highcharts.Chart} chart
     */
    Navigator.prototype.init = function (chart) {
        var chartOptions = chart.options, navigatorOptions = chartOptions.navigator, navigatorEnabled = navigatorOptions.enabled, scrollbarOptions = chartOptions.scrollbar, scrollbarEnabled = scrollbarOptions.enabled, height = navigatorEnabled ? navigatorOptions.height : 0, scrollbarHeight = scrollbarEnabled ?
            scrollbarOptions.height :
            0;
        this.handles = [];
        this.shades = [];
        this.chart = chart;
        this.setBaseSeries();
        this.height = height;
        this.scrollbarHeight = scrollbarHeight;
        this.scrollbarEnabled = scrollbarEnabled;
        this.navigatorEnabled = navigatorEnabled;
        this.navigatorOptions = navigatorOptions;
        this.scrollbarOptions = scrollbarOptions;
        this.outlineHeight = height + scrollbarHeight;
        this.opposite = pick(navigatorOptions.opposite, Boolean(!navigatorEnabled && chart.inverted)); // #6262
        var navigator = this, baseSeries = navigator.baseSeries, xAxisIndex = chart.xAxis.length, yAxisIndex = chart.yAxis.length, baseXaxis = baseSeries && baseSeries[0] && baseSeries[0].xAxis ||
            chart.xAxis[0] || { options: {} };
        chart.isDirtyBox = true;
        if (navigator.navigatorEnabled) {
            // an x axis is required for scrollbar also
            navigator.xAxis = new Axis(chart, merge({
                // inherit base xAxis' break and ordinal options
                breaks: baseXaxis.options.breaks,
                ordinal: baseXaxis.options.ordinal
            }, navigatorOptions.xAxis, {
                id: 'navigator-x-axis',
                yAxis: 'navigator-y-axis',
                isX: true,
                type: 'datetime',
                index: xAxisIndex,
                isInternal: true,
                offset: 0,
                keepOrdinalPadding: true,
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                zoomEnabled: false
            }, chart.inverted ? {
                offsets: [scrollbarHeight, 0, -scrollbarHeight, 0],
                width: height
            } : {
                offsets: [0, -scrollbarHeight, 0, scrollbarHeight],
                height: height
            }));
            navigator.yAxis = new Axis(chart, merge(navigatorOptions.yAxis, {
                id: 'navigator-y-axis',
                alignTicks: false,
                offset: 0,
                index: yAxisIndex,
                isInternal: true,
                reversed: pick((navigatorOptions.yAxis && navigatorOptions.yAxis.reversed), (chart.yAxis[0] && chart.yAxis[0].reversed), false),
                zoomEnabled: false
            }, chart.inverted ? {
                width: height
            } : {
                height: height
            }));
            // If we have a base series, initialize the navigator series
            if (baseSeries || navigatorOptions.series.data) {
                navigator.updateNavigatorSeries(false);
                // If not, set up an event to listen for added series
            }
            else if (chart.series.length === 0) {
                navigator.unbindRedraw = addEvent(chart, 'beforeRedraw', function () {
                    // We've got one, now add it as base
                    if (chart.series.length > 0 && !navigator.series) {
                        navigator.setBaseSeries();
                        navigator.unbindRedraw(); // reset
                    }
                });
            }
            navigator.reversedExtremes = (chart.inverted && !navigator.xAxis.reversed) || (!chart.inverted && navigator.xAxis.reversed);
            // Render items, so we can bind events to them:
            navigator.renderElements();
            // Add mouse events
            navigator.addMouseEvents();
            // in case of scrollbar only, fake an x axis to get translation
        }
        else {
            navigator.xAxis = {
                chart: chart,
                navigatorAxis: {
                    fake: true
                },
                translate: function (value, reverse) {
                    var axis = chart.xAxis[0], ext = axis.getExtremes(), scrollTrackWidth = axis.len - 2 * scrollbarHeight, min = numExt('min', axis.options.min, ext.dataMin), valueRange = numExt('max', axis.options.max, ext.dataMax) - min;
                    return reverse ?
                        // from pixel to value
                        (value * valueRange / scrollTrackWidth) + min :
                        // from value to pixel
                        scrollTrackWidth * (value - min) / valueRange;
                },
                toPixels: function (value) {
                    return this.translate(value);
                },
                toValue: function (value) {
                    return this.translate(value, true);
                }
            };
            navigator.xAxis.navigatorAxis.axis = navigator.xAxis;
            navigator.xAxis.navigatorAxis.toFixedRange = (NavigatorAxis.AdditionsClass.prototype.toFixedRange.bind(navigator.xAxis.navigatorAxis));
        }
        // Initialize the scrollbar
        if (chart.options.scrollbar.enabled) {
            chart.scrollbar = navigator.scrollbar = new Scrollbar(chart.renderer, merge(chart.options.scrollbar, {
                margin: navigator.navigatorEnabled ? 0 : 10,
                vertical: chart.inverted
            }), chart);
            addEvent(navigator.scrollbar, 'changed', function (e) {
                var range = navigator.size, to = range * this.to, from = range * this.from;
                navigator.hasDragged = navigator.scrollbar.hasDragged;
                navigator.render(0, 0, from, to);
                if (chart.options.scrollbar.liveRedraw ||
                    (e.DOMType !== 'mousemove' &&
                        e.DOMType !== 'touchmove')) {
                    setTimeout(function () {
                        navigator.onMouseUp(e);
                    });
                }
            });
        }
        // Add data events
        navigator.addBaseSeriesEvents();
        // Add redraw events
        navigator.addChartEvents();
    };
    /**
     * Get the union data extremes of the chart - the outer data extremes of the
     * base X axis and the navigator axis.
     *
     * @private
     * @function Highcharts.Navigator#getUnionExtremes
     * @param {boolean} [returnFalseOnNoBaseSeries]
     *        as the param says.
     * @return {Highcharts.Dictionary<(number|undefined)>|undefined}
     */
    Navigator.prototype.getUnionExtremes = function (returnFalseOnNoBaseSeries) {
        var baseAxis = this.chart.xAxis[0], navAxis = this.xAxis, navAxisOptions = navAxis.options, baseAxisOptions = baseAxis.options, ret;
        if (!returnFalseOnNoBaseSeries || baseAxis.dataMin !== null) {
            ret = {
                dataMin: pick(// #4053
                navAxisOptions && navAxisOptions.min, numExt('min', baseAxisOptions.min, baseAxis.dataMin, navAxis.dataMin, navAxis.min)),
                dataMax: pick(navAxisOptions && navAxisOptions.max, numExt('max', baseAxisOptions.max, baseAxis.dataMax, navAxis.dataMax, navAxis.max))
            };
        }
        return ret;
    };
    /**
     * Set the base series and update the navigator series from this. With a bit
     * of modification we should be able to make this an API method to be called
     * from the outside
     *
     * @private
     * @function Highcharts.Navigator#setBaseSeries
     * @param {Highcharts.SeriesOptionsType} [baseSeriesOptions]
     *        Additional series options for a navigator
     * @param {boolean} [redraw]
     *        Whether to redraw after update.
     * @return {void}
     */
    Navigator.prototype.setBaseSeries = function (baseSeriesOptions, redraw) {
        var chart = this.chart, baseSeries = this.baseSeries = [];
        baseSeriesOptions = (baseSeriesOptions ||
            chart.options && chart.options.navigator.baseSeries ||
            (chart.series.length ?
                // Find the first non-navigator series (#8430)
                find(chart.series, function (s) {
                    return !s.options.isInternal;
                }).index :
                0));
        // Iterate through series and add the ones that should be shown in
        // navigator.
        (chart.series || []).forEach(function (series, i) {
            if (
            // Don't include existing nav series
            !series.options.isInternal &&
                (series.options.showInNavigator ||
                    (i === baseSeriesOptions ||
                        series.options.id === baseSeriesOptions) &&
                        series.options.showInNavigator !== false)) {
                baseSeries.push(series);
            }
        });
        // When run after render, this.xAxis already exists
        if (this.xAxis && !this.xAxis.navigatorAxis.fake) {
            this.updateNavigatorSeries(true, redraw);
        }
    };
    /**
     * Update series in the navigator from baseSeries, adding new if does not
     * exist.
     *
     * @private
     * @function Highcharts.Navigator.updateNavigatorSeries
     * @param {boolean} addEvents
     * @param {boolean} [redraw]
     * @return {void}
     */
    Navigator.prototype.updateNavigatorSeries = function (addEvents, redraw) {
        var navigator = this, chart = navigator.chart, baseSeries = navigator.baseSeries, baseOptions, mergedNavSeriesOptions, chartNavigatorSeriesOptions = navigator.navigatorOptions.series, baseNavigatorOptions, navSeriesMixin = {
            enableMouseTracking: false,
            index: null,
            linkedTo: null,
            group: 'nav',
            padXAxis: false,
            xAxis: 'navigator-x-axis',
            yAxis: 'navigator-y-axis',
            showInLegend: false,
            stacking: void 0,
            isInternal: true,
            states: {
                inactive: {
                    opacity: 1
                }
            }
        }, 
        // Remove navigator series that are no longer in the baseSeries
        navigatorSeries = navigator.series =
            (navigator.series || []).filter(function (navSeries) {
                var base = navSeries.baseSeries;
                if (baseSeries.indexOf(base) < 0) { // Not in array
                    // If there is still a base series connected to this
                    // series, remove event handler and reference.
                    if (base) {
                        removeEvent(base, 'updatedData', navigator.updatedDataHandler);
                        delete base.navigatorSeries;
                    }
                    // Kill the nav series. It may already have been
                    // destroyed (#8715).
                    if (navSeries.chart) {
                        navSeries.destroy();
                    }
                    return false;
                }
                return true;
            });
        // Go through each base series and merge the options to create new
        // series
        if (baseSeries && baseSeries.length) {
            baseSeries.forEach(function eachBaseSeries(base) {
                var linkedNavSeries = base.navigatorSeries, userNavOptions = extend(
                // Grab color and visibility from base as default
                {
                    color: base.color,
                    visible: base.visible
                }, !isArray(chartNavigatorSeriesOptions) ?
                    chartNavigatorSeriesOptions :
                    defaultOptions.navigator.series);
                // Don't update if the series exists in nav and we have disabled
                // adaptToUpdatedData.
                if (linkedNavSeries &&
                    navigator.navigatorOptions.adaptToUpdatedData === false) {
                    return;
                }
                navSeriesMixin.name = 'Navigator ' + baseSeries.length;
                baseOptions = base.options || {};
                baseNavigatorOptions = baseOptions.navigatorOptions || {};
                mergedNavSeriesOptions = merge(baseOptions, navSeriesMixin, userNavOptions, baseNavigatorOptions);
                // Once nav series type is resolved, pick correct pointRange
                mergedNavSeriesOptions.pointRange = pick(
                // Stricte set pointRange in options
                userNavOptions.pointRange, baseNavigatorOptions.pointRange, 
                // Fallback to default values, e.g. `null` for column
                defaultOptions.plotOptions[mergedNavSeriesOptions.type || 'line'].pointRange);
                // Merge data separately. Do a slice to avoid mutating the
                // navigator options from base series (#4923).
                var navigatorSeriesData = baseNavigatorOptions.data || userNavOptions.data;
                navigator.hasNavigatorData =
                    navigator.hasNavigatorData || !!navigatorSeriesData;
                mergedNavSeriesOptions.data =
                    navigatorSeriesData ||
                        baseOptions.data && baseOptions.data.slice(0);
                // Update or add the series
                if (linkedNavSeries && linkedNavSeries.options) {
                    linkedNavSeries.update(mergedNavSeriesOptions, redraw);
                }
                else {
                    base.navigatorSeries = chart.initSeries(mergedNavSeriesOptions);
                    base.navigatorSeries.baseSeries = base; // Store ref
                    navigatorSeries.push(base.navigatorSeries);
                }
            });
        }
        // If user has defined data (and no base series) or explicitly defined
        // navigator.series as an array, we create these series on top of any
        // base series.
        if (chartNavigatorSeriesOptions.data &&
            !(baseSeries && baseSeries.length) ||
            isArray(chartNavigatorSeriesOptions)) {
            navigator.hasNavigatorData = false;
            // Allow navigator.series to be an array
            chartNavigatorSeriesOptions =
                splat(chartNavigatorSeriesOptions);
            chartNavigatorSeriesOptions.forEach(function (userSeriesOptions, i) {
                navSeriesMixin.name =
                    'Navigator ' + (navigatorSeries.length + 1);
                mergedNavSeriesOptions = merge(defaultOptions.navigator.series, {
                    // Since we don't have a base series to pull color from,
                    // try to fake it by using color from series with same
                    // index. Otherwise pull from the colors array. We need
                    // an explicit color as otherwise updates will increment
                    // color counter and we'll get a new color for each
                    // update of the nav series.
                    color: chart.series[i] &&
                        !chart.series[i].options.isInternal &&
                        chart.series[i].color ||
                        chart.options.colors[i] ||
                        chart.options.colors[0]
                }, navSeriesMixin, userSeriesOptions);
                mergedNavSeriesOptions.data = userSeriesOptions.data;
                if (mergedNavSeriesOptions.data) {
                    navigator.hasNavigatorData = true;
                    navigatorSeries.push(chart.initSeries(mergedNavSeriesOptions));
                }
            });
        }
        if (addEvents) {
            this.addBaseSeriesEvents();
        }
    };
    /**
     * Add data events.
     * For example when main series is updated we need to recalculate extremes
     *
     * @private
     * @function Highcharts.Navigator#addBaseSeriesEvent
     * @return {void}
     */
    Navigator.prototype.addBaseSeriesEvents = function () {
        var navigator = this, baseSeries = navigator.baseSeries || [];
        // Bind modified extremes event to first base's xAxis only.
        // In event of > 1 base-xAxes, the navigator will ignore those.
        // Adding this multiple times to the same axis is no problem, as
        // duplicates should be discarded by the browser.
        if (baseSeries[0] && baseSeries[0].xAxis) {
            addEvent(baseSeries[0].xAxis, 'foundExtremes', this.modifyBaseAxisExtremes);
        }
        baseSeries.forEach(function (base) {
            // Link base series show/hide to navigator series visibility
            addEvent(base, 'show', function () {
                if (this.navigatorSeries) {
                    this.navigatorSeries.setVisible(true, false);
                }
            });
            addEvent(base, 'hide', function () {
                if (this.navigatorSeries) {
                    this.navigatorSeries.setVisible(false, false);
                }
            });
            // Respond to updated data in the base series, unless explicitily
            // not adapting to data changes.
            if (this.navigatorOptions.adaptToUpdatedData !== false) {
                if (base.xAxis) {
                    addEvent(base, 'updatedData', this.updatedDataHandler);
                }
            }
            // Handle series removal
            addEvent(base, 'remove', function () {
                if (this.navigatorSeries) {
                    erase(navigator.series, this.navigatorSeries);
                    if (defined(this.navigatorSeries.options)) {
                        this.navigatorSeries.remove(false);
                    }
                    delete this.navigatorSeries;
                }
            });
        }, this);
    };
    /**
     * Get minimum from all base series connected to the navigator
     * @private
     * @param  {number} currentSeriesMin
     *         Minium from the current series
     * @return {number} Minimum from all series
     */
    Navigator.prototype.getBaseSeriesMin = function (currentSeriesMin) {
        return this.baseSeries.reduce(function (min, series) {
            // (#10193)
            return Math.min(min, series.xData ? series.xData[0] : min);
        }, currentSeriesMin);
    };
    /**
     * Set the navigator x axis extremes to reflect the total. The navigator
     * extremes should always be the extremes of the union of all series in the
     * chart as well as the navigator series.
     *
     * @private
     * @function Highcharts.Navigator#modifyNavigatorAxisExtremes
     */
    Navigator.prototype.modifyNavigatorAxisExtremes = function () {
        var xAxis = this.xAxis, unionExtremes;
        if (typeof xAxis.getExtremes !== 'undefined') {
            unionExtremes = this.getUnionExtremes(true);
            if (unionExtremes &&
                (unionExtremes.dataMin !== xAxis.min ||
                    unionExtremes.dataMax !== xAxis.max)) {
                xAxis.min = unionExtremes.dataMin;
                xAxis.max = unionExtremes.dataMax;
            }
        }
    };
    /**
     * Hook to modify the base axis extremes with information from the Navigator
     *
     * @private
     * @function Highcharts.Navigator#modifyBaseAxisExtremes
     */
    Navigator.prototype.modifyBaseAxisExtremes = function () {
        var baseXAxis = this, navigator = baseXAxis.chart.navigator, baseExtremes = baseXAxis.getExtremes(), baseMin = baseExtremes.min, baseMax = baseExtremes.max, baseDataMin = baseExtremes.dataMin, baseDataMax = baseExtremes.dataMax, range = baseMax - baseMin, stickToMin = navigator.stickToMin, stickToMax = navigator.stickToMax, overscroll = pick(baseXAxis.options.overscroll, 0), newMax, newMin, navigatorSeries = navigator.series && navigator.series[0], hasSetExtremes = !!baseXAxis.setExtremes, 
        // When the extremes have been set by range selector button, don't
        // stick to min or max. The range selector buttons will handle the
        // extremes. (#5489)
        unmutable = baseXAxis.eventArgs &&
            baseXAxis.eventArgs.trigger === 'rangeSelectorButton';
        if (!unmutable) {
            // If the zoomed range is already at the min, move it to the right
            // as new data comes in
            if (stickToMin) {
                newMin = baseDataMin;
                newMax = newMin + range;
            }
            // If the zoomed range is already at the max, move it to the right
            // as new data comes in
            if (stickToMax) {
                newMax = baseDataMax + overscroll;
                // If stickToMin is true, the new min value is set above
                if (!stickToMin) {
                    newMin = Math.max(baseDataMin, // don't go below data extremes (#13184)
                    newMax - range, navigator.getBaseSeriesMin(navigatorSeries && navigatorSeries.xData ?
                        navigatorSeries.xData[0] :
                        -Number.MAX_VALUE));
                }
            }
            // Update the extremes
            if (hasSetExtremes && (stickToMin || stickToMax)) {
                if (isNumber(newMin)) {
                    baseXAxis.min = baseXAxis.userMin = newMin;
                    baseXAxis.max = baseXAxis.userMax = newMax;
                }
            }
        }
        // Reset
        navigator.stickToMin =
            navigator.stickToMax = null;
    };
    /**
     * Handler for updated data on the base series. When data is modified, the
     * navigator series must reflect it. This is called from the Chart.redraw
     * function before axis and series extremes are computed.
     *
     * @private
     * @function Highcharts.Navigator#updateDataHandler
     */
    Navigator.prototype.updatedDataHandler = function () {
        var navigator = this.chart.navigator, baseSeries = this, navigatorSeries = this.navigatorSeries, xDataMin = navigator.getBaseSeriesMin(baseSeries.xData[0]);
        // If the scrollbar is scrolled all the way to the right, keep right as
        // new data  comes in.
        navigator.stickToMax = navigator.reversedExtremes ?
            Math.round(navigator.zoomedMin) === 0 :
            Math.round(navigator.zoomedMax) >= Math.round(navigator.size);
        // Detect whether the zoomed area should stick to the minimum or
        // maximum. If the current axis minimum falls outside the new updated
        // dataset, we must adjust.
        navigator.stickToMin = isNumber(baseSeries.xAxis.min) &&
            (baseSeries.xAxis.min <= xDataMin) &&
            (!this.chart.fixedRange || !navigator.stickToMax);
        // Set the navigator series data to the new data of the base series
        if (navigatorSeries && !navigator.hasNavigatorData) {
            navigatorSeries.options.pointStart = baseSeries.xData[0];
            navigatorSeries.setData(baseSeries.options.data, false, null, false); // #5414
        }
    };
    /**
     * Add chart events, like redrawing navigator, when chart requires that.
     *
     * @private
     * @function Highcharts.Navigator#addChartEvents
     * @return {void}
     */
    Navigator.prototype.addChartEvents = function () {
        if (!this.eventsToUnbind) {
            this.eventsToUnbind = [];
        }
        this.eventsToUnbind.push(
        // Move the scrollbar after redraw, like after data updata even if
        // axes don't redraw
        addEvent(this.chart, 'redraw', function () {
            var navigator = this.navigator, xAxis = navigator && (navigator.baseSeries &&
                navigator.baseSeries[0] &&
                navigator.baseSeries[0].xAxis ||
                this.xAxis[0]); // #5709, #13114
            if (xAxis) {
                navigator.render(xAxis.min, xAxis.max);
            }
        }), 
        // Make room for the navigator, can be placed around the chart:
        addEvent(this.chart, 'getMargins', function () {
            var chart = this, navigator = chart.navigator, marginName = navigator.opposite ?
                'plotTop' : 'marginBottom';
            if (chart.inverted) {
                marginName = navigator.opposite ?
                    'marginRight' : 'plotLeft';
            }
            chart[marginName] =
                (chart[marginName] || 0) + (navigator.navigatorEnabled || !chart.inverted ?
                    navigator.outlineHeight :
                    0) + navigator.navigatorOptions.margin;
        }));
    };
    /**
     * Destroys allocated elements.
     *
     * @private
     * @function Highcharts.Navigator#destroy
     */
    Navigator.prototype.destroy = function () {
        // Disconnect events added in addEvents
        this.removeEvents();
        if (this.xAxis) {
            erase(this.chart.xAxis, this.xAxis);
            erase(this.chart.axes, this.xAxis);
        }
        if (this.yAxis) {
            erase(this.chart.yAxis, this.yAxis);
            erase(this.chart.axes, this.yAxis);
        }
        // Destroy series
        (this.series || []).forEach(function (s) {
            if (s.destroy) {
                s.destroy();
            }
        });
        // Destroy properties
        [
            'series', 'xAxis', 'yAxis', 'shades', 'outline', 'scrollbarTrack',
            'scrollbarRifles', 'scrollbarGroup', 'scrollbar', 'navigatorGroup',
            'rendered'
        ].forEach(function (prop) {
            if (this[prop] && this[prop].destroy) {
                this[prop].destroy();
            }
            this[prop] = null;
        }, this);
        // Destroy elements in collection
        [this.handles].forEach(function (coll) {
            destroyObjectProperties(coll);
        }, this);
    };
    return Navigator;
}());
// End of prototype
if (!H.Navigator) {
    H.Navigator = Navigator;
    NavigatorAxis.compose(Axis);
    // For Stock charts. For x only zooming, do not to create the zoom button
    // because X axis zooming is already allowed by the Navigator and Range
    // selector. (#9285)
    addEvent(Chart, 'beforeShowResetZoom', function () {
        var chartOptions = this.options, navigator = chartOptions.navigator, rangeSelector = chartOptions.rangeSelector;
        if (((navigator && navigator.enabled) ||
            (rangeSelector && rangeSelector.enabled)) &&
            ((!isTouchDevice && chartOptions.chart.zoomType === 'x') ||
                (isTouchDevice && chartOptions.chart.pinchType === 'x'))) {
            return false;
        }
    });
    // Initialize navigator for stock charts
    addEvent(Chart, 'beforeRender', function () {
        var options = this.options;
        if (options.navigator.enabled ||
            options.scrollbar.enabled) {
            this.scroller = this.navigator = new Navigator(this);
        }
    });
    // For stock charts, extend the Chart.setChartSize method so that we can set
    // the final top position of the navigator once the height of the chart,
    // including the legend, is determined. #367. We can't use Chart.getMargins,
    // because labels offsets are not calculated yet.
    addEvent(Chart, 'afterSetChartSize', function () {
        var legend = this.legend, navigator = this.navigator, scrollbarHeight, legendOptions, xAxis, yAxis;
        if (navigator) {
            legendOptions = legend && legend.options;
            xAxis = navigator.xAxis;
            yAxis = navigator.yAxis;
            scrollbarHeight = navigator.scrollbarHeight;
            // Compute the top position
            if (this.inverted) {
                navigator.left = navigator.opposite ?
                    this.chartWidth - scrollbarHeight -
                        navigator.height :
                    this.spacing[3] + scrollbarHeight;
                navigator.top = this.plotTop + scrollbarHeight;
            }
            else {
                navigator.left = this.plotLeft + scrollbarHeight;
                navigator.top = navigator.navigatorOptions.top ||
                    this.chartHeight -
                        navigator.height -
                        scrollbarHeight -
                        this.spacing[2] -
                        (this.rangeSelector && this.extraBottomMargin ?
                            this.rangeSelector.getHeight() :
                            0) -
                        ((legendOptions &&
                            legendOptions.verticalAlign === 'bottom' &&
                            legendOptions.layout !== 'proximate' && // #13392
                            legendOptions.enabled &&
                            !legendOptions.floating) ?
                            legend.legendHeight +
                                pick(legendOptions.margin, 10) :
                            0) -
                        (this.titleOffset ? this.titleOffset[2] : 0);
            }
            if (xAxis && yAxis) { // false if navigator is disabled (#904)
                if (this.inverted) {
                    xAxis.options.left = yAxis.options.left = navigator.left;
                }
                else {
                    xAxis.options.top = yAxis.options.top = navigator.top;
                }
                xAxis.setAxisSize();
                yAxis.setAxisSize();
            }
        }
    });
    // Merge options, if no scrolling exists yet
    addEvent(Chart, 'update', function (e) {
        var navigatorOptions = (e.options.navigator || {}), scrollbarOptions = (e.options.scrollbar || {});
        if (!this.navigator && !this.scroller &&
            (navigatorOptions.enabled || scrollbarOptions.enabled)) {
            merge(true, this.options.navigator, navigatorOptions);
            merge(true, this.options.scrollbar, scrollbarOptions);
            delete e.options.navigator;
            delete e.options.scrollbar;
        }
    });
    // Initialize navigator, if no scrolling exists yet
    addEvent(Chart, 'afterUpdate', function (event) {
        if (!this.navigator && !this.scroller &&
            (this.options.navigator.enabled ||
                this.options.scrollbar.enabled)) {
            this.scroller = this.navigator = new Navigator(this);
            if (pick(event.redraw, true)) {
                this.redraw(event.animation); // #7067
            }
        }
    });
    // Handle adding new series
    addEvent(Chart, 'afterAddSeries', function () {
        if (this.navigator) {
            // Recompute which series should be shown in navigator, and add them
            this.navigator.setBaseSeries(null, false);
        }
    });
    // Handle updating series
    addEvent(Series, 'afterUpdate', function () {
        if (this.chart.navigator && !this.options.isInternal) {
            this.chart.navigator.setBaseSeries(null, false);
        }
    });
    Chart.prototype.callbacks.push(function (chart) {
        var extremes, navigator = chart.navigator;
        // Initialize the navigator
        if (navigator && chart.xAxis[0]) {
            extremes = chart.xAxis[0].getExtremes();
            navigator.render(extremes.min, extremes.max);
        }
    });
}
H.Navigator = Navigator;
export default H.Navigator;
