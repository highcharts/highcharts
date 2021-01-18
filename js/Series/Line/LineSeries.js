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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import palette from '../../Core/Color/Palette.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
var defined = U.defined, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * The line series is the base type and is therefor the series base prototype.
 *
 * @private
 */
var LineSeries = /** @class */ (function (_super) {
    __extends(LineSeries, _super);
    function LineSeries() {
        /* *
         *
         *  Static Functions
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Draw the graph. Called internally when rendering line-like series
     * types. The first time it generates the `series.graph` item and
     * optionally other series-wide items like `series.area` for area
     * charts. On subsequent calls these items are updated with new
     * positions and attributes.
     *
     * @function Highcharts.Series#drawGraph
     */
    LineSeries.prototype.drawGraph = function () {
        var series = this, options = this.options, graphPath = (this.gappedPath || this.getGraphPath).call(this), styledMode = this.chart.styledMode, props = [[
                'graph',
                'highcharts-graph'
            ]];
        // Presentational properties
        if (!styledMode) {
            props[0].push((options.lineColor ||
                this.color ||
                palette.neutralColor20 // when colorByPoint = true
            ), options.dashStyle);
        }
        props = series.getZonesGraphs(props);
        // Draw the graph
        props.forEach(function (prop, i) {
            var graphKey = prop[0], graph = series[graphKey], verb = graph ? 'animate' : 'attr', attribs;
            if (graph) {
                graph.endX = series.preventGraphAnimation ?
                    null :
                    graphPath.xMap;
                graph.animate({ d: graphPath });
            }
            else if (graphPath.length) { // #1487
                /**
                 * SVG element of area-based charts. Can be used for styling
                 * purposes. If zones are configured, this element will be
                 * hidden and replaced by multiple zone areas, accessible
                 * via `series['zone-area-x']` (where x is a number,
                 * starting with 0).
                 *
                 * @name Highcharts.Series#area
                 * @type {Highcharts.SVGElement|undefined}
                 */
                /**
                 * SVG element of line-based charts. Can be used for styling
                 * purposes. If zones are configured, this element will be
                 * hidden and replaced by multiple zone lines, accessible
                 * via `series['zone-graph-x']` (where x is a number,
                 * starting with 0).
                 *
                 * @name Highcharts.Series#graph
                 * @type {Highcharts.SVGElement|undefined}
                 */
                series[graphKey] = graph = series.chart.renderer
                    .path(graphPath)
                    .addClass(prop[1])
                    .attr({ zIndex: 1 }) // #1069
                    .add(series.group);
            }
            if (graph && !styledMode) {
                attribs = {
                    'stroke': prop[2],
                    'stroke-width': options.lineWidth,
                    // Polygon series use filled graph
                    'fill': (series.fillGraph && series.color) || 'none'
                };
                if (prop[3]) {
                    attribs.dashstyle = prop[3];
                }
                else if (options.linecap !== 'square') {
                    attribs['stroke-linecap'] =
                        attribs['stroke-linejoin'] = 'round';
                }
                graph[verb](attribs)
                    // Add shadow to normal series (0) or to first
                    // zone (1) #3932
                    .shadow((i < 2) && options.shadow);
            }
            // Helpers for animation
            if (graph) {
                graph.startX = graphPath.xMap;
                graph.isArea = graphPath.isArea; // For arearange animation
            }
        });
    };
    // eslint-disable-next-line valid-jsdoc
    /**
     * Get the graph path.
     *
     * @private
     */
    LineSeries.prototype.getGraphPath = function (points, nullsAsZeroes, connectCliffs) {
        var series = this, options = series.options, step = options.step, reversed, graphPath = [], xMap = [], gap;
        points = points || series.points;
        // Bottom of a stack is reversed
        reversed = points.reversed;
        if (reversed) {
            points.reverse();
        }
        // Reverse the steps (#5004)
        step = {
            right: 1,
            center: 2
        }[step] || (step && 3);
        if (step && reversed) {
            step = 4 - step;
        }
        // Remove invalid points, especially in spline (#5015)
        points = this.getValidPoints(points, false, !(options.connectNulls && !nullsAsZeroes && !connectCliffs));
        // Build the line
        points.forEach(function (point, i) {
            var plotX = point.plotX, plotY = point.plotY, lastPoint = points[i - 1], 
            // the path to this point from the previous
            pathToPoint;
            if ((point.leftCliff || (lastPoint && lastPoint.rightCliff)) &&
                !connectCliffs) {
                gap = true; // ... and continue
            }
            // Line series, nullsAsZeroes is not handled
            if (point.isNull && !defined(nullsAsZeroes) && i > 0) {
                gap = !options.connectNulls;
                // Area series, nullsAsZeroes is set
            }
            else if (point.isNull && !nullsAsZeroes) {
                gap = true;
            }
            else {
                if (i === 0 || gap) {
                    pathToPoint = [[
                            'M',
                            point.plotX,
                            point.plotY
                        ]];
                    // Generate the spline as defined in the SplineSeries object
                }
                else if (series.getPointSpline) {
                    pathToPoint = [series.getPointSpline(points, point, i)];
                }
                else if (step) {
                    if (step === 1) { // right
                        pathToPoint = [[
                                'L',
                                lastPoint.plotX,
                                plotY
                            ]];
                    }
                    else if (step === 2) { // center
                        pathToPoint = [[
                                'L',
                                (lastPoint.plotX + plotX) / 2,
                                lastPoint.plotY
                            ], [
                                'L',
                                (lastPoint.plotX + plotX) / 2,
                                plotY
                            ]];
                    }
                    else {
                        pathToPoint = [[
                                'L',
                                plotX,
                                lastPoint.plotY
                            ]];
                    }
                    pathToPoint.push([
                        'L',
                        plotX,
                        plotY
                    ]);
                }
                else {
                    // normal line to next point
                    pathToPoint = [[
                            'L',
                            plotX,
                            plotY
                        ]];
                }
                // Prepare for animation. When step is enabled, there are
                // two path nodes for each x value.
                xMap.push(point.x);
                if (step) {
                    xMap.push(point.x);
                    if (step === 2) { // step = center (#8073)
                        xMap.push(point.x);
                    }
                }
                graphPath.push.apply(graphPath, pathToPoint);
                gap = false;
            }
        });
        graphPath.xMap = xMap;
        series.graphPath = graphPath;
        return graphPath;
    };
    // eslint-disable-next-line valid-jsdoc
    /**
     * Get zones properties for building graphs. Extendable by series with
     * multiple lines within one series.
     *
     * @private
     */
    LineSeries.prototype.getZonesGraphs = function (props) {
        // Add the zone properties if any
        this.zones.forEach(function (zone, i) {
            var propset = [
                'zone-graph-' + i,
                'highcharts-graph highcharts-zone-graph-' + i + ' ' +
                    (zone.className || '')
            ];
            if (!this.chart.styledMode) {
                propset.push((zone.color || this.color), (zone.dashStyle || this.options.dashStyle));
            }
            props.push(propset);
        }, this);
        return props;
    };
    /**
     * General options for all series types.
     *
     * @optionparent plotOptions.series
     */
    LineSeries.defaultOptions = merge(Series.defaultOptions, {
    // nothing here yet
    });
    return LineSeries;
}(Series));
SeriesRegistry.registerSeriesType('line', LineSeries);
/* *
 *
 *  Default Export
 *
 * */
export default LineSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A line series displays information as a series of data points connected by
 * straight line segments.
 *
 * @sample {highcharts} highcharts/demo/line-basic/
 *         Line chart
 * @sample {highstock} stock/demo/basic-line/
 *         Line chart
 *
 * @extends   plotOptions.series
 * @product   highcharts highstock
 * @apioption plotOptions.line
 */
/**
 * The SVG value used for the `stroke-linecap` and `stroke-linejoin`
 * of a line graph. Round means that lines are rounded in the ends and
 * bends.
 *
 * @type       {Highcharts.SeriesLinecapValue}
 * @default    round
 * @since      3.0.7
 * @apioption  plotOptions.line.linecap
 */
/**
 * A `line` series. If the [type](#series.line.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.line
 * @excluding dataParser,dataURL
 * @product   highcharts highstock
 * @apioption series.line
 */
/**
 * An array of data points for the series. For the `line` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 1],
 *        [1, 2],
 *        [2, 8]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.line.turboThreshold),
 *    this option is not available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * **Note:** In TypeScript you have to extend `PointOptionsObject` with an
 * additional declaration to allow custom data types:
 * ```ts
 * declare module `highcharts` {
 *   interface PointOptionsObject {
 *     custom: Record<string, (boolean|number|string)>;
 *   }
 * }
 * ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @declare   Highcharts.PointOptionsObject
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @apioption series.line.data
 */
/**
 * An additional, individual class name for the data point's graphic
 * representation.
 *
 * @type      {string}
 * @since     5.0.0
 * @product   highcharts gantt
 * @apioption series.line.data.className
 */
/**
 * Individual color for the point. By default the color is pulled from
 * the global `colors` array.
 *
 * In styled mode, the `color` option doesn't take effect. Instead, use
 * `colorIndex`.
 *
 * @sample {highcharts} highcharts/point/color/
 *         Mark the highest point
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highstock gantt
 * @apioption series.line.data.color
 */
/**
 * A specific color index to use for the point, so its graphic representations
 * are given the class name `highcharts-color-{n}`. In styled mode this will
 * change the color of the graphic. In non-styled mode, the color by is set by
 * the `fill` attribute, so the change in class name won't have a visual effect
 * by default.
 *
 * @type      {number}
 * @since     5.0.0
 * @product   highcharts gantt
 * @apioption series.line.data.colorIndex
 */
/**
 * A reserved subspace to store options and values for customized functionality.
 * Here you can add additional data for your own event callbacks and formatter
 * callbacks.
 *
 * @sample {highcharts} highcharts/point/custom/
 *         Point and series with custom data
 *
 * @type      {Highcharts.Dictionary<*>}
 * @apioption series.line.data.custom
 */
/**
 * Individual data label for each point. The options are the same as
 * the ones for [plotOptions.series.dataLabels](
 * #plotOptions.series.dataLabels).
 *
 * @sample highcharts/point/datalabels/
 *         Show a label for the last value
 *
 * @declare   Highcharts.DataLabelsOptions
 * @extends   plotOptions.line.dataLabels
 * @product   highcharts highstock gantt
 * @apioption series.line.data.dataLabels
 */
/**
 * A description of the point to add to the screen reader information
 * about the point.
 *
 * @type      {string}
 * @since     5.0.0
 * @requires  modules/accessibility
 * @apioption series.line.data.description
 */
/**
 * An id for the point. This can be used after render time to get a
 * pointer to the point object through `chart.get()`.
 *
 * @sample {highcharts} highcharts/point/id/
 *         Remove an id'd point
 *
 * @type      {string}
 * @since     1.2.0
 * @product   highcharts highstock gantt
 * @apioption series.line.data.id
 */
/**
 * The rank for this point's data label in case of collision. If two
 * data labels are about to overlap, only the one with the highest `labelrank`
 * will be drawn.
 *
 * @type      {number}
 * @apioption series.line.data.labelrank
 */
/**
 * The name of the point as shown in the legend, tooltip, dataLabels, etc.
 *
 * @see [xAxis.uniqueNames](#xAxis.uniqueNames)
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Point names
 *
 * @type      {string}
 * @apioption series.line.data.name
 */
/**
 * Whether the data point is selected initially.
 *
 * @type      {boolean}
 * @default   false
 * @product   highcharts highstock gantt
 * @apioption series.line.data.selected
 */
/**
 * The x value of the point. For datetime axes, the X value is the timestamp
 * in milliseconds since 1970.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.line.data.x
 */
/**
 * The y value of the point.
 *
 * @type      {number|null}
 * @product   highcharts highstock
 * @apioption series.line.data.y
 */
/**
 * The individual point events.
 *
 * @extends   plotOptions.series.point.events
 * @product   highcharts highstock gantt
 * @apioption series.line.data.events
 */
/**
 * Options for the point markers of line-like series.
 *
 * @declare   Highcharts.PointMarkerOptionsObject
 * @extends   plotOptions.series.marker
 * @product   highcharts highstock
 * @apioption series.line.data.marker
 */
''; // include precedent doclets in transpilat
