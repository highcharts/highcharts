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
import CenteredSeriesMixin from '../../Mixins/CenteredSeries.js';
var getStartAndEndRadians = CenteredSeriesMixin.getStartAndEndRadians;
import ColumnSeries from '../Column/ColumnSeries.js';
import H from '../../Core/Globals.js';
var noop = H.noop;
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import palette from '../../Core/Color/Palette.js';
import PiePoint from './PiePoint.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
import U from '../../Core/Utilities.js';
var clamp = U.clamp, extend = U.extend, fireEvent = U.fireEvent, merge = U.merge, pick = U.pick, relativeLength = U.relativeLength;
import '../../Core/Options.js';
/* *
 *
 *  Class
 *
 * */
/**
 * Pie series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pie
 *
 * @augments Highcharts.Series
 */
var PieSeries = /** @class */ (function (_super) {
    __extends(PieSeries, _super);
    function PieSeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.center = void 0;
        _this.data = void 0;
        _this.maxLabelDistance = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Animates the pies in.
     * @private
     */
    PieSeries.prototype.animate = function (init) {
        var series = this, points = series.points, startAngleRad = series.startAngleRad;
        if (!init) {
            points.forEach(function (point) {
                var graphic = point.graphic, args = point.shapeArgs;
                if (graphic && args) {
                    // start values
                    graphic.attr({
                        // animate from inner radius (#779)
                        r: pick(point.startR, (series.center && series.center[3] / 2)),
                        start: startAngleRad,
                        end: startAngleRad
                    });
                    // animate
                    graphic.animate({
                        r: args.r,
                        start: args.start,
                        end: args.end
                    }, series.options.animation);
                }
            });
        }
    };
    /**
     * Called internally to draw auxiliary graph in pie-like series in
     * situtation when the default graph is not sufficient enough to present
     * the data well. Auxiliary graph is saved in the same object as
     * regular graph.
     * @private
     */
    PieSeries.prototype.drawEmpty = function () {
        var centerX, centerY, start = this.startAngleRad, end = this.endAngleRad, options = this.options;
        // Draw auxiliary graph if there're no visible points.
        if (this.total === 0 && this.center) {
            centerX = this.center[0];
            centerY = this.center[1];
            if (!this.graph) {
                this.graph = this.chart.renderer
                    .arc(centerX, centerY, this.center[1] / 2, 0, start, end)
                    .addClass('highcharts-empty-series')
                    .add(this.group);
            }
            this.graph.attr({
                d: SVGRenderer.prototype.symbols.arc(centerX, centerY, this.center[2] / 2, 0, {
                    start: start,
                    end: end,
                    innerR: this.center[3] / 2
                })
            });
            if (!this.chart.styledMode) {
                this.graph.attr({
                    'stroke-width': options.borderWidth,
                    fill: options.fillColor || 'none',
                    stroke: options.color ||
                        palette.neutralColor20
                });
            }
        }
        else if (this.graph) { // Destroy the graph object.
            this.graph = this.graph.destroy();
        }
    };
    /**
     * Slices in pie chart are initialized in DOM, but it's shapes and
     * animations are normally run in `drawPoints()`.
     * @private
     */
    PieSeries.prototype.drawPoints = function () {
        var renderer = this.chart.renderer;
        this.points.forEach(function (point) {
            // When updating a series between 2d and 3d or cartesian and
            // polar, the shape type changes.
            if (point.graphic && point.hasNewShapeType()) {
                point.graphic = point.graphic.destroy();
            }
            if (!point.graphic) {
                point.graphic = renderer[point.shapeType](point.shapeArgs)
                    .add(point.series.group);
                point.delayedRendering = true;
            }
        });
    };
    /**
     * Extend the generatePoints method by adding total and percentage
     * properties to each point
     * @private
     */
    PieSeries.prototype.generatePoints = function () {
        _super.prototype.generatePoints.call(this);
        this.updateTotals();
    };
    /**
     * Utility for getting the x value from a given y, used for
     * anticollision logic in data labels. Added point for using specific
     * points' label distance.
     * @private
     */
    PieSeries.prototype.getX = function (y, left, point) {
        var center = this.center, 
        // Variable pie has individual radius
        radius = this.radii ?
            this.radii[point.index] || 0 :
            center[2] / 2, angle, x;
        angle = Math.asin(clamp((y - center[1]) / (radius + point.labelDistance), -1, 1));
        x = center[0] +
            (left ? -1 : 1) *
                (Math.cos(angle) * (radius + point.labelDistance)) +
            (point.labelDistance > 0 ?
                (left ? -1 : 1) * this.options.dataLabels.padding :
                0);
        return x;
    };
    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    PieSeries.prototype.hasData = function () {
        return !!this.processedXData.length; // != 0
    };
    /**
     * Draw the data points
     * @private
     */
    PieSeries.prototype.redrawPoints = function () {
        var series = this, chart = series.chart, renderer = chart.renderer, groupTranslation, graphic, pointAttr, shapeArgs, shadow = series.options.shadow;
        this.drawEmpty();
        if (shadow && !series.shadowGroup && !chart.styledMode) {
            series.shadowGroup = renderer
                .g('shadow')
                .attr({ zIndex: -1 })
                .add(series.group);
        }
        // draw the slices
        series.points.forEach(function (point) {
            var animateTo = {};
            graphic = point.graphic;
            if (!point.isNull && graphic) {
                shapeArgs = point.shapeArgs;
                // If the point is sliced, use special translation, else use
                // plot area translation
                groupTranslation = point.getTranslate();
                if (!chart.styledMode) {
                    // Put the shadow behind all points
                    var shadowGroup = point.shadowGroup;
                    if (shadow && !shadowGroup) {
                        shadowGroup = point.shadowGroup = renderer
                            .g('shadow')
                            .add(series.shadowGroup);
                    }
                    if (shadowGroup) {
                        shadowGroup.attr(groupTranslation);
                    }
                    pointAttr = series.pointAttribs(point, (point.selected && 'select'));
                }
                // Draw the slice
                if (!point.delayedRendering) {
                    graphic
                        .setRadialReference(series.center);
                    if (!chart.styledMode) {
                        merge(true, animateTo, pointAttr);
                    }
                    merge(true, animateTo, shapeArgs, groupTranslation);
                    graphic.animate(animateTo);
                }
                else {
                    graphic
                        .setRadialReference(series.center)
                        .attr(shapeArgs)
                        .attr(groupTranslation);
                    if (!chart.styledMode) {
                        graphic
                            .attr(pointAttr)
                            .attr({ 'stroke-linejoin': 'round' })
                            .shadow(shadow, shadowGroup);
                    }
                    point.delayedRendering = false;
                }
                graphic.attr({
                    visibility: point.visible ? 'inherit' : 'hidden'
                });
                graphic.addClass(point.getClassName(), true);
            }
            else if (graphic) {
                point.graphic = graphic.destroy();
            }
        });
    };
    /**
     * Utility for sorting data labels.
     * @private
     */
    PieSeries.prototype.sortByAngle = function (points, sign) {
        points.sort(function (a, b) {
            return ((typeof a.angle !== 'undefined') &&
                (b.angle - a.angle) * sign);
        });
    };
    /**
     * Do translation for pie slices
     * @private
     */
    PieSeries.prototype.translate = function (positions) {
        this.generatePoints();
        var series = this, cumulative = 0, precision = 1000, // issue #172
        options = series.options, slicedOffset = options.slicedOffset, connectorOffset = slicedOffset + (options.borderWidth || 0), finalConnectorOffset, start, end, angle, radians = getStartAndEndRadians(options.startAngle, options.endAngle), startAngleRad = series.startAngleRad = radians.start, endAngleRad = series.endAngleRad = radians.end, circ = endAngleRad - startAngleRad, // 2 * Math.PI,
        points = series.points, 
        // the x component of the radius vector for a given point
        radiusX, radiusY, labelDistance = options.dataLabels.distance, ignoreHiddenPoint = options.ignoreHiddenPoint, i, len = points.length, point;
        // Get positions - either an integer or a percentage string must be
        // given. If positions are passed as a parameter, we're in a
        // recursive loop for adjusting space for data labels.
        if (!positions) {
            series.center = positions = series.getCenter();
        }
        // Calculate the geometry for each point
        for (i = 0; i < len; i++) {
            point = points[i];
            // set start and end angle
            start = startAngleRad + (cumulative * circ);
            if (point.isValid() &&
                (!ignoreHiddenPoint || point.visible)) {
                cumulative += point.percentage / 100;
            }
            end = startAngleRad + (cumulative * circ);
            // set the shape
            point.shapeType = 'arc';
            point.shapeArgs = {
                x: positions[0],
                y: positions[1],
                r: positions[2] / 2,
                innerR: positions[3] / 2,
                start: Math.round(start * precision) / precision,
                end: Math.round(end * precision) / precision
            };
            // Used for distance calculation for specific point.
            point.labelDistance = pick((point.options.dataLabels &&
                point.options.dataLabels.distance), labelDistance);
            // Compute point.labelDistance if it's defined as percentage
            // of slice radius (#8854)
            point.labelDistance = relativeLength(point.labelDistance, point.shapeArgs.r);
            // Saved for later dataLabels distance calculation.
            series.maxLabelDistance = Math.max(series.maxLabelDistance || 0, point.labelDistance);
            // The angle must stay within -90 and 270 (#2645)
            angle = (end + start) / 2;
            if (angle > 1.5 * Math.PI) {
                angle -= 2 * Math.PI;
            }
            else if (angle < -Math.PI / 2) {
                angle += 2 * Math.PI;
            }
            // Center for the sliced out slice
            point.slicedTranslation = {
                translateX: Math.round(Math.cos(angle) * slicedOffset),
                translateY: Math.round(Math.sin(angle) * slicedOffset)
            };
            // set the anchor point for tooltips
            radiusX = Math.cos(angle) * positions[2] / 2;
            radiusY = Math.sin(angle) * positions[2] / 2;
            point.tooltipPos = [
                positions[0] + radiusX * 0.7,
                positions[1] + radiusY * 0.7
            ];
            point.half = angle < -Math.PI / 2 || angle > Math.PI / 2 ?
                1 :
                0;
            point.angle = angle;
            // Set the anchor point for data labels. Use point.labelDistance
            // instead of labelDistance // #1174
            // finalConnectorOffset - not override connectorOffset value.
            finalConnectorOffset = Math.min(connectorOffset, point.labelDistance / 5); // #1678
            point.labelPosition = {
                natural: {
                    // initial position of the data label - it's utilized for
                    // finding the final position for the label
                    x: positions[0] + radiusX + Math.cos(angle) *
                        point.labelDistance,
                    y: positions[1] + radiusY + Math.sin(angle) *
                        point.labelDistance
                },
                'final': {
                // used for generating connector path -
                // initialized later in drawDataLabels function
                // x: undefined,
                // y: undefined
                },
                // left - pie on the left side of the data label
                // right - pie on the right side of the data label
                // center - data label overlaps the pie
                alignment: point.labelDistance < 0 ?
                    'center' : point.half ? 'right' : 'left',
                connectorPosition: {
                    breakAt: {
                        x: positions[0] + radiusX + Math.cos(angle) *
                            finalConnectorOffset,
                        y: positions[1] + radiusY + Math.sin(angle) *
                            finalConnectorOffset
                    },
                    touchingSliceAt: {
                        x: positions[0] + radiusX,
                        y: positions[1] + radiusY
                    }
                }
            };
        }
        fireEvent(series, 'afterTranslate');
    };
    /**
     * Recompute total chart sum and update percentages of points.
     * @private
     */
    PieSeries.prototype.updateTotals = function () {
        var i, total = 0, points = this.points, len = points.length, point, ignoreHiddenPoint = this.options.ignoreHiddenPoint;
        // Get the total sum
        for (i = 0; i < len; i++) {
            point = points[i];
            if (point.isValid() &&
                (!ignoreHiddenPoint || point.visible)) {
                total += point.y;
            }
        }
        this.total = total;
        // Set each point's properties
        for (i = 0; i < len; i++) {
            point = points[i];
            point.percentage =
                (total > 0 && (point.visible || !ignoreHiddenPoint)) ?
                    point.y / total * 100 :
                    0;
            point.total = total;
        }
    };
    /**
     * A pie chart is a circular graphic which is divided into slices to
     * illustrate numerical proportion.
     *
     * @sample highcharts/demo/pie-basic/
     *         Pie chart
     *
     * @extends      plotOptions.line
     * @excluding    animationLimit, boostThreshold, connectEnds, connectNulls,
     *               cropThreshold, dashStyle, dataSorting, dragDrop,
     *               findNearestPointBy, getExtremesFromAll, label, lineWidth,
     *               marker, negativeColor, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointStart, softThreshold, stacking, step,
     *               threshold, turboThreshold, zoneAxis, zones, dataSorting,
     *               boostBlending
     * @product      highcharts
     * @optionparent plotOptions.pie
     */
    PieSeries.defaultOptions = merge(Series.defaultOptions, {
        /**
         * @excluding legendItemClick
         * @apioption plotOptions.pie.events
         */
        /**
         * Fires when the checkbox next to the point name in the legend is
         * clicked. One parameter, event, is passed to the function. The state
         * of the checkbox is found by event.checked. The checked item is found
         * by event.item. Return false to prevent the default action which is to
         * toggle the select state of the series.
         *
         * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/
         *         Alert checkbox status
         *
         * @type      {Function}
         * @since     1.2.0
         * @product   highcharts
         * @context   Highcharts.Point
         * @apioption plotOptions.pie.events.checkboxClick
         */
        /**
         * Fires when the legend item belonging to the pie point (slice) is
         * clicked. The `this` keyword refers to the point itself. One
         * parameter, `event`, is passed to the function, containing common
         * event information. The default action is to toggle the visibility of
         * the point. This can be prevented by calling `event.preventDefault()`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-point-events-legenditemclick/
         *         Confirm toggle visibility
         *
         * @type      {Highcharts.PointLegendItemClickCallbackFunction}
         * @since     1.2.0
         * @product   highcharts
         * @apioption plotOptions.pie.point.events.legendItemClick
         */
        /**
         * The center of the pie chart relative to the plot area. Can be
         * percentages or pixel values. The default behaviour (as of 3.0) is to
         * center the pie so that all slices and data labels are within the plot
         * area. As a consequence, the pie may actually jump around in a chart
         * with dynamic values, as the data labels move. In that case, the
         * center should be explicitly set, for example to `["50%", "50%"]`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-center/
         *         Centered at 100, 100
         *
         * @type    {Array<(number|string|null),(number|string|null)>}
         * @default [null, null]
         * @product highcharts
         *
         * @private
         */
        center: [null, null],
        /**
         * The color of the pie series. A pie series is represented as an empty
         * circle if the total sum of its values is 0. Use this property to
         * define the color of its border.
         *
         * In styled mode, the color can be defined by the
         * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
         * color can be set with the `.highcharts-series`,
         * `.highcharts-color-{n}`, `.highcharts-{type}-series` or
         * `.highcharts-series-{n}` class, or individual classes given by the
         * `className` option.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-emptyseries/
         *         Empty pie series
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   ${palette.neutralColor20}
         * @apioption plotOptions.pie.color
         */
        /**
         * @product highcharts
         *
         * @private
         */
        clip: false,
        /**
         * @ignore-option
         *
         * @private
         */
        colorByPoint: true,
        /**
         * A series specific or series type specific color set to use instead
         * of the global [colors](#colors).
         *
         * @sample {highcharts} highcharts/demo/pie-monochrome/
         *         Set default colors for all pies
         *
         * @type      {Array<Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject>}
         * @since     3.0
         * @product   highcharts
         * @apioption plotOptions.pie.colors
         */
        /**
         * @declare   Highcharts.SeriesPieDataLabelsOptionsObject
         * @extends   plotOptions.series.dataLabels
         * @excluding align, allowOverlap, inside, staggerLines, step
         * @private
         */
        dataLabels: {
            /**
             * Alignment method for data labels. Possible values are:
             *
             * - `toPlotEdges`: Each label touches the nearest vertical edge of
             *   the plot area.
             *
             * - `connectors`: Connectors have the same x position and the
             *   widest label of each half (left & right) touches the nearest
             *   vertical edge of the plot area.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-alignto-connectors/
             *         alignTo: connectors
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-alignto-plotedges/
             *         alignTo: plotEdges
             *
             * @type      {string}
             * @since     7.0.0
             * @product   highcharts
             * @apioption plotOptions.pie.dataLabels.alignTo
             */
            allowOverlap: true,
            /**
             * The color of the line connecting the data label to the pie slice.
             * The default color is the same as the point's color.
             *
             * In styled mode, the connector stroke is given in the
             * `.highcharts-data-label-connector` class.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorcolor/
             *         Blue connectors
             * @sample {highcharts} highcharts/css/pie-point/
             *         Styled connectors
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     2.1
             * @product   highcharts
             * @apioption plotOptions.pie.dataLabels.connectorColor
             */
            /**
             * The distance from the data label to the connector. Note that
             * data labels also have a default `padding`, so in order for the
             * connector to touch the text, the `padding` must also be 0.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorpadding/
             *         No padding
             *
             * @since   2.1
             * @product highcharts
             */
            connectorPadding: 5,
            /**
             * Specifies the method that is used to generate the connector path.
             * Highcharts provides 3 built-in connector shapes: `'fixedOffset'`
             * (default), `'straight'` and `'crookedLine'`. Using
             * `'crookedLine'` has the most sense (in most of the cases) when
             * `'alignTo'` is set.
             *
             * Users can provide their own method by passing a function instead
             * of a String. 3 arguments are passed to the callback:
             *
             * - Object that holds the information about the coordinates of the
             *   label (`x` & `y` properties) and how the label is located in
             *   relation to the pie (`alignment` property). `alignment` can by
             *   one of the following:
             *   `'left'` (pie on the left side of the data label),
             *   `'right'` (pie on the right side of the data label) or
             *   `'center'` (data label overlaps the pie).
             *
             * - Object that holds the information about the position of the
             *   connector. Its `touchingSliceAt`  porperty tells the position
             *   of the place where the connector touches the slice.
             *
             * - Data label options
             *
             * The function has to return an SVG path definition in array form
             * (see the example).
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorshape-string/
             *         connectorShape is a String
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorshape-function/
             *         connectorShape is a function
             *
             * @type    {string|Function}
             * @since   7.0.0
             * @product highcharts
             */
            connectorShape: 'fixedOffset',
            /**
             * The width of the line connecting the data label to the pie slice.
             *
             * In styled mode, the connector stroke width is given in the
             * `.highcharts-data-label-connector` class.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-connectorwidth-disabled/
             *         Disable the connector
             * @sample {highcharts} highcharts/css/pie-point/
             *         Styled connectors
             *
             * @type      {number}
             * @default   1
             * @since     2.1
             * @product   highcharts
             * @apioption plotOptions.pie.dataLabels.connectorWidth
             */
            /**
             * Works only if `connectorShape` is `'crookedLine'`. It defines how
             * far from the vertical plot edge the coonnector path should be
             * crooked.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-crookdistance/
             *         crookDistance set to 90%
             *
             * @since   7.0.0
             * @product highcharts
             */
            crookDistance: '70%',
            /**
             * The distance of the data label from the pie's edge. Negative
             * numbers put the data label on top of the pie slices. Can also be
             * defined as a percentage of pie's radius. Connectors are only
             * shown for data labels outside the pie.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-distance/
             *         Data labels on top of the pie
             *
             * @type    {number|string}
             * @since   2.1
             * @product highcharts
             */
            distance: 30,
            enabled: true,
            /**
             * A
             * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
             * for the data label. Available variables are the same as for
             * `formatter`.
             *
             * @sample {highcharts} highcharts/plotoptions/series-datalabels-format/
             *         Add a unit
             *
             * @type      {string}
             * @default   undefined
             * @since     3.0
             * @apioption plotOptions.pie.dataLabels.format
             */
            // eslint-disable-next-line valid-jsdoc
            /**
             * Callback JavaScript function to format the data label. Note that
             * if a `format` is defined, the format takes precedence and the
             * formatter is ignored.
             *
             * @type {Highcharts.DataLabelsFormatterCallbackFunction}
             * @default function () { return this.point.isNull ? void 0 : this.point.name; }
             */
            formatter: function () {
                return this.point.isNull ? void 0 : this.point.name;
            },
            /**
             * Whether to render the connector as a soft arc or a line with
             * sharp break. Works only if `connectorShape` equals to
             * `fixedOffset`.
             *
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-true/
             *         Soft
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-softconnector-false/
             *         Non soft
             *
             * @since   2.1.7
             * @product highcharts
             */
            softConnector: true,
            /**
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-overflow
             *         Long labels truncated with an ellipsis
             * @sample {highcharts} highcharts/plotoptions/pie-datalabels-overflow-wrap
             *         Long labels are wrapped
             *
             * @type      {Highcharts.CSSObject}
             * @apioption plotOptions.pie.dataLabels.style
             */
            x: 0
        },
        /**
         * If the total sum of the pie's values is 0, the series is represented
         * as an empty circle . The `fillColor` option defines the color of that
         * circle. Use [pie.borderWidth](#plotOptions.pie.borderWidth) to set
         * the border thickness.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-emptyseries/
         *         Empty pie series
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @private
         */
        fillColor: void 0,
        /**
         * The end angle of the pie in degrees where 0 is top and 90 is right.
         * Defaults to `startAngle` plus 360.
         *
         * @sample {highcharts} highcharts/demo/pie-semi-circle/
         *         Semi-circle donut
         *
         * @type      {number}
         * @since     1.3.6
         * @product   highcharts
         * @apioption plotOptions.pie.endAngle
         */
        /**
         * Equivalent to [chart.ignoreHiddenSeries](#chart.ignoreHiddenSeries),
         * this option tells whether the series shall be redrawn as if the
         * hidden point were `null`.
         *
         * The default value changed from `false` to `true` with Highcharts
         * 3.0.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-ignorehiddenpoint/
         *         True, the hiddden point is ignored
         *
         * @since   2.3.0
         * @product highcharts
         *
         * @private
         */
        ignoreHiddenPoint: true,
        /**
         * @ignore-option
         *
         * @private
         */
        inactiveOtherPoints: true,
        /**
         * The size of the inner diameter for the pie. A size greater than 0
         * renders a donut chart. Can be a percentage or pixel value.
         * Percentages are relative to the pie size. Pixel values are given as
         * integers.
         *
         *
         * Note: in Highcharts < 4.1.2, the percentage was relative to the plot
         * area, not the pie size.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-innersize-80px/
         *         80px inner size
         * @sample {highcharts} highcharts/plotoptions/pie-innersize-50percent/
         *         50% of the plot area
         * @sample {highcharts} highcharts/demo/3d-pie-donut/
         *         3D donut
         *
         * @type      {number|string}
         * @default   0
         * @since     2.0
         * @product   highcharts
         * @apioption plotOptions.pie.innerSize
         */
        /**
         * @ignore-option
         *
         * @private
         */
        legendType: 'point',
        /**
         * @ignore-option
         *
         * @private
         */
        marker: null,
        /**
         * The minimum size for a pie in response to auto margins. The pie will
         * try to shrink to make room for data labels in side the plot area,
         *  but only to this size.
         *
         * @type      {number|string}
         * @default   80
         * @since     3.0
         * @product   highcharts
         * @apioption plotOptions.pie.minSize
         */
        /**
         * The diameter of the pie relative to the plot area. Can be a
         * percentage or pixel value. Pixel values are given as integers. The
         * default behaviour (as of 3.0) is to scale to the plot area and give
         * room for data labels within the plot area.
         * [slicedOffset](#plotOptions.pie.slicedOffset) is also included in the
         * default size calculation. As a consequence, the size of the pie may
         * vary when points are updated and data labels more around. In that
         * case it is best to set a fixed value, for example `"75%"`.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-size/
         *         Smaller pie
         *
         * @type    {number|string|null}
         * @product highcharts
         *
         * @private
         */
        size: null,
        /**
         * Whether to display this particular series or series type in the
         * legend. Since 2.1, pies are not shown in the legend by default.
         *
         * @sample {highcharts} highcharts/plotoptions/series-showinlegend/
         *         One series in the legend, one hidden
         *
         * @product highcharts
         *
         * @private
         */
        showInLegend: false,
        /**
         * If a point is sliced, moved out from the center, how many pixels
         * should it be moved?.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-slicedoffset-20/
         *         20px offset
         *
         * @product highcharts
         *
         * @private
         */
        slicedOffset: 10,
        /**
         * The start angle of the pie slices in degrees where 0 is top and 90
         * right.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-startangle-90/
         *         Start from right
         *
         * @type      {number}
         * @default   0
         * @since     2.3.4
         * @product   highcharts
         * @apioption plotOptions.pie.startAngle
         */
        /**
         * Sticky tracking of mouse events. When true, the `mouseOut` event
         * on a series isn't triggered until the mouse moves over another
         * series, or out of the plot area. When false, the `mouseOut` event on
         * a series is triggered when the mouse leaves the area around the
         * series'  graph or markers. This also implies the tooltip. When
         * `stickyTracking` is false and `tooltip.shared` is false, the tooltip
         * will be hidden when moving the mouse between series.
         *
         * @product highcharts
         *
         * @private
         */
        stickyTracking: false,
        tooltip: {
            followPointer: true
        },
        /**
         * The color of the border surrounding each slice. When `null`, the
         * border takes the same color as the slice fill. This can be used
         * together with a `borderWidth` to fill drawing gaps created by
         * antialiazing artefacts in borderless pies.
         *
         * In styled mode, the border stroke is given in the `.highcharts-point`
         * class.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-bordercolor-black/
         *         Black border
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default #ffffff
         * @product highcharts
         *
         * @private
         */
        borderColor: palette.backgroundColor,
        /**
         * The width of the border surrounding each slice.
         *
         * When setting the border width to 0, there may be small gaps between
         * the slices due to SVG antialiasing artefacts. To work around this,
         * keep the border width at 0.5 or 1, but set the `borderColor` to
         * `null` instead.
         *
         * In styled mode, the border stroke width is given in the
         * `.highcharts-point` class.
         *
         * @sample {highcharts} highcharts/plotoptions/pie-borderwidth/
         *         3px border
         *
         * @product highcharts
         *
         * @private
         */
        borderWidth: 1,
        /**
         * @ignore-options
         * @private
         */
        lineWidth: void 0,
        states: {
            /**
             * @extends   plotOptions.series.states.hover
             * @excluding marker, lineWidth, lineWidthPlus
             * @product   highcharts
             */
            hover: {
                /**
                 * How much to brighten the point on interaction. Requires the
                 * main color to be defined in hex or rgb(a) format.
                 *
                 * In styled mode, the hover brightness is by default replaced
                 * by a fill-opacity given in the `.highcharts-point-hover`
                 * class.
                 *
                 * @sample {highcharts} highcharts/plotoptions/pie-states-hover-brightness/
                 *         Brightened by 0.5
                 *
                 * @product highcharts
                 */
                brightness: 0.1
            }
        }
    });
    return PieSeries;
}(Series));
extend(PieSeries.prototype, {
    axisTypes: [],
    directTouch: true,
    drawGraph: null,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    drawTracker: ColumnSeries.prototype.drawTracker,
    getCenter: CenteredSeriesMixin.getCenter,
    getSymbol: noop,
    isCartesian: false,
    noSharedTooltip: true,
    pointAttribs: ColumnSeries.prototype.pointAttribs,
    pointClass: PiePoint,
    requireSorting: false,
    searchPoint: noop,
    trackerGroups: ['group', 'dataLabelsGroup']
});
SeriesRegistry.registerSeriesType('pie', PieSeries);
/* *
 *
 *  Default Export
 *
 * */
export default PieSeries;
/* *
 *
 *  API Options
 *
 * */
/**
 * A `pie` series. If the [type](#series.pie.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pie
 * @excluding cropThreshold, dataParser, dataURL, stack, xAxis, yAxis,
 *            dataSorting, step, boostThreshold, boostBlending
 * @product   highcharts
 * @apioption series.pie
 */
/**
 * An array of data points for the series. For the `pie` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.pie.turboThreshold),
 *    this option is not available.
 *    ```js
 *    data: [{
 *        y: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        y: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
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
 * @type      {Array<number|Array<string,(number|null)>|null|*>}
 * @extends   series.line.data
 * @excluding marker, x
 * @product   highcharts
 * @apioption series.pie.data
 */
/**
 * @type      {Highcharts.SeriesPieDataLabelsOptionsObject}
 * @product   highcharts
 * @apioption series.pie.data.dataLabels
 */
/**
 * The sequential index of the data point in the legend.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.pie.data.legendIndex
 */
/**
 * Whether to display a slice offset from the center.
 *
 * @sample {highcharts} highcharts/point/sliced/
 *         One sliced point
 *
 * @type      {boolean}
 * @product   highcharts
 * @apioption series.pie.data.sliced
 */
/**
 * @extends plotOptions.pie.dataLabels
 * @excluding align, allowOverlap, inside, staggerLines, step
 * @product   highcharts
 * @apioption series.pie.dataLabels
 */
/**
 * @excluding legendItemClick
 * @product   highcharts
 * @apioption series.pie.events
 */
''; // placeholder for transpiled doclets above
