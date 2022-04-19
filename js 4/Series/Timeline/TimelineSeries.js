/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Daniel Studencki
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
import LegendSymbol from '../../Core/Legend/LegendSymbol.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, ColumnSeries = _a.column, LineSeries = _a.line;
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import TimelinePoint from './TimelinePoint.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, arrayMax = U.arrayMax, arrayMin = U.arrayMin, defined = U.defined, extend = U.extend, merge = U.merge, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
/**
 * The timeline series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.timeline
 *
 * @augments Highcharts.Series
 */
var TimelineSeries = /** @class */ (function (_super) {
    __extends(TimelineSeries, _super);
    function TimelineSeries() {
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
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.userOptions = void 0;
        _this.visibilityMap = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    TimelineSeries.prototype.alignDataLabel = function (point, dataLabel, _options, _alignTo) {
        var series = this, isInverted = series.chart.inverted, visiblePoints = series.visibilityMap.filter(function (point) {
            return point;
        }), visiblePointsCount = series.visiblePointsCount, pointIndex = visiblePoints.indexOf(point), isFirstOrLast = (!pointIndex || pointIndex === visiblePointsCount - 1), dataLabelsOptions = series.options.dataLabels, userDLOptions = point.userDLOptions || {}, 
        // Define multiplier which is used to calculate data label
        // width. If data labels are alternate, they have two times more
        // space to adapt (excepting first and last ones, which has only
        // one and half), than in case of placing all data labels side
        // by side.
        multiplier = dataLabelsOptions.alternate ?
            (isFirstOrLast ? 1.5 : 2) :
            1, distance, availableSpace = Math.floor(series.xAxis.len / visiblePointsCount), pad = dataLabel.padding, targetDLWidth, styles;
        // Adjust data label width to the currently available space.
        if (point.visible) {
            distance = Math.abs(userDLOptions.x || point.options.dataLabels.x);
            if (isInverted) {
                targetDLWidth = ((distance - pad) * 2 - (point.itemHeight / 2));
                styles = {
                    width: targetDLWidth + 'px',
                    // Apply ellipsis when data label height is exceeded.
                    textOverflow: dataLabel.width / targetDLWidth *
                        dataLabel.height / 2 > availableSpace * multiplier ?
                        'ellipsis' : 'none'
                };
            }
            else {
                styles = {
                    width: (userDLOptions.width ||
                        dataLabelsOptions.width ||
                        availableSpace * multiplier - (pad * 2)) + 'px'
                };
            }
            dataLabel.css(styles);
            if (!series.chart.styledMode) {
                dataLabel.shadow(dataLabelsOptions.shadow);
            }
        }
        _super.prototype.alignDataLabel.apply(series, arguments);
    };
    TimelineSeries.prototype.bindAxes = function () {
        var series = this;
        _super.prototype.bindAxes.call(series);
        ['xAxis', 'yAxis'].forEach(function (axis) {
            // Initially set the linked xAxis type to category.
            if (axis === 'xAxis' && !series[axis].userOptions.type) {
                series[axis].categories = series[axis].hasNames = true;
            }
        });
    };
    TimelineSeries.prototype.distributeDL = function () {
        var series = this, dataLabelsOptions = series.options.dataLabels;
        var visibilityIndex = 1;
        if (dataLabelsOptions) {
            var distance_1 = dataLabelsOptions.distance || 0;
            series.points.forEach(function (point) {
                var _a;
                point.options.dataLabels = merge((_a = {},
                    _a[series.chart.inverted ? 'x' : 'y'] = dataLabelsOptions.alternate && visibilityIndex % 2 ?
                        -distance_1 : distance_1,
                    _a), point.userDLOptions);
                visibilityIndex++;
            });
        }
    };
    TimelineSeries.prototype.generatePoints = function () {
        var series = this;
        _super.prototype.generatePoints.apply(series);
        series.points.forEach(function (point, i) {
            point.applyOptions({
                x: series.xData[i]
            }, series.xData[i]);
        });
    };
    TimelineSeries.prototype.getVisibilityMap = function () {
        var series = this, map = (series.data.length ?
            series.data : series.userOptions.data).map(function (point) {
            return (point &&
                point.visible !== false &&
                !point.isNull) ? point : false;
        });
        return map;
    };
    TimelineSeries.prototype.getXExtremes = function (xData) {
        var series = this, filteredData = xData.filter(function (x, i) {
            return series.points[i].isValid() &&
                series.points[i].visible;
        });
        return {
            min: arrayMin(filteredData),
            max: arrayMax(filteredData)
        };
    };
    TimelineSeries.prototype.init = function () {
        var series = this;
        _super.prototype.init.apply(series, arguments);
        series.eventsToUnbind.push(addEvent(series, 'afterTranslate', function () {
            var lastPlotX, closestPointRangePx = Number.MAX_VALUE;
            series.points.forEach(function (point) {
                // Set the isInside parameter basing also on the real point
                // visibility, in order to avoid showing hidden points
                // in drawPoints method.
                point.isInside = point.isInside && point.visible;
                // New way of calculating closestPointRangePx value, which
                // respects the real point visibility is needed.
                if (point.visible && !point.isNull) {
                    if (defined(lastPlotX)) {
                        closestPointRangePx = Math.min(closestPointRangePx, Math.abs(point.plotX - lastPlotX));
                    }
                    lastPlotX = point.plotX;
                }
            });
            series.closestPointRangePx = closestPointRangePx;
        }));
        // Distribute data labels before rendering them. Distribution is
        // based on the 'dataLabels.distance' and 'dataLabels.alternate'
        // property.
        series.eventsToUnbind.push(addEvent(series, 'drawDataLabels', function () {
            // Distribute data labels basing on defined algorithm.
            series.distributeDL(); // @todo use this scope for series
        }));
        series.eventsToUnbind.push(addEvent(series, 'afterDrawDataLabels', function () {
            var dataLabel; // @todo use this scope for series
            // Draw or align connector for each point.
            series.points.forEach(function (point) {
                dataLabel = point.dataLabel;
                if (dataLabel) {
                    // Within this wrap method is necessary to save the
                    // current animation params, because the data label
                    // target position (after animation) is needed to align
                    // connectors.
                    dataLabel.animate = function (params) {
                        if (this.targetPosition) {
                            this.targetPosition = params;
                        }
                        return SVGElement.prototype.animate.apply(this, arguments);
                    };
                    // Initialize the targetPosition field within data label
                    // object. It's necessary because there is need to know
                    // expected position of specific data label, when
                    // aligning connectors. This field is overrided inside
                    // of SVGElement.animate() wrapped  method.
                    if (!dataLabel.targetPosition) {
                        dataLabel.targetPosition = {};
                    }
                    return point.drawConnector();
                }
            });
        }));
        series.eventsToUnbind.push(addEvent(series.chart, 'afterHideOverlappingLabel', function () {
            series.points.forEach(function (p) {
                if (p.connector &&
                    p.dataLabel &&
                    p.dataLabel.oldOpacity !== p.dataLabel.newOpacity) {
                    p.alignConnector();
                }
            });
        }));
    };
    TimelineSeries.prototype.markerAttribs = function (point, state) {
        var series = this, seriesMarkerOptions = series.options.marker, seriesStateOptions, pointMarkerOptions = point.marker || {}, symbol = (pointMarkerOptions.symbol || seriesMarkerOptions.symbol), pointStateOptions, width = pick(pointMarkerOptions.width, seriesMarkerOptions.width, series.closestPointRangePx), height = pick(pointMarkerOptions.height, seriesMarkerOptions.height), radius = 0, attribs;
        // Call default markerAttribs method, when the xAxis type
        // is set to datetime.
        if (series.xAxis.dateTime) {
            return _super.prototype.markerAttribs.call(this, point, state);
        }
        // Handle hover and select states
        if (state) {
            seriesStateOptions =
                seriesMarkerOptions.states[state] || {};
            pointStateOptions = pointMarkerOptions.states &&
                pointMarkerOptions.states[state] || {};
            radius = pick(pointStateOptions.radius, seriesStateOptions.radius, radius + (seriesStateOptions.radiusPlus || 0));
        }
        point.hasImage = (symbol && symbol.indexOf('url') === 0);
        attribs = {
            x: Math.floor(point.plotX) - (width / 2) - (radius / 2),
            y: point.plotY - (height / 2) - (radius / 2),
            width: width + radius,
            height: height + radius
        };
        return attribs;
    };
    TimelineSeries.prototype.processData = function () {
        var series = this, visiblePoints = 0, i;
        series.visibilityMap = series.getVisibilityMap();
        // Calculate currently visible points.
        series.visibilityMap.forEach(function (point) {
            if (point) {
                visiblePoints++;
            }
        });
        series.visiblePointsCount = visiblePoints;
        for (i = 0; i < series.xData.length; i++) {
            series.yData[i] = 1;
        }
        _super.prototype.processData.call(this, arguments);
        return;
    };
    /**
     * The timeline series presents given events along a drawn line.
     *
     * @sample highcharts/series-timeline/alternate-labels
     *         Timeline series
     * @sample highcharts/series-timeline/inverted
     *         Inverted timeline
     * @sample highcharts/series-timeline/datetime-axis
     *         With true datetime axis
     *
     * @extends      plotOptions.line
     * @since        7.0.0
     * @product      highcharts
     * @excluding    animationLimit, boostThreshold, connectEnds, connectNulls,
     *               cropThreshold, dashStyle, findNearestPointBy,
     *               getExtremesFromAll, lineWidth, negativeColor,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointStart, softThreshold, stacking, step, threshold,
     *               turboThreshold, zoneAxis, zones, dataSorting,
     *               boostBlending
     * @requires     modules/timeline
     * @optionparent plotOptions.timeline
     */
    TimelineSeries.defaultOptions = merge(LineSeries.defaultOptions, {
        colorByPoint: true,
        stickyTracking: false,
        ignoreHiddenPoint: true,
        /**
         * @ignore
         * @private
         */
        legendType: 'point',
        lineWidth: 4,
        tooltip: {
            headerFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                '<span style="font-size: 10px"> {point.key}</span><br/>',
            pointFormat: '{point.description}'
        },
        states: {
            hover: {
                lineWidthPlus: 0
            }
        },
        /**
         * @declare Highcharts.TimelineDataLabelsOptionsObject
         *
         * @private
         */
        dataLabels: {
            enabled: true,
            allowOverlap: true,
            /**
             * Whether to position data labels alternately. For example, if
             * [distance](#plotOptions.timeline.dataLabels.distance)
             * is set equal to `100`, then data labels will be positioned
             * alternately (on both sides of the point) at a distance of 100px.
             *
             * @sample {highcharts} highcharts/series-timeline/alternate-disabled
             *         Alternate disabled
             */
            alternate: true,
            backgroundColor: "#ffffff" /* backgroundColor */,
            borderWidth: 1,
            borderColor: "#999999" /* neutralColor40 */,
            borderRadius: 3,
            color: "#333333" /* neutralColor80 */,
            /**
             * The color of the line connecting the data label to the point.
             * The default color is the same as the point's color.
             *
             * In styled mode, the connector stroke is given in the
             * `.highcharts-data-label-connector` class.
             *
             * @sample {highcharts} highcharts/series-timeline/connector-styles
             *         Custom connector width and color
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @apioption plotOptions.timeline.dataLabels.connectorColor
             */
            /**
             * The width of the line connecting the data label to the point.
             *
             * In styled mode, the connector stroke width is given in the
             * `.highcharts-data-label-connector` class.
             *
             * @sample {highcharts} highcharts/series-timeline/connector-styles
             *         Custom connector width and color
             */
            connectorWidth: 1,
            /**
             * A pixel value defining the distance between the data label and
             * the point. Negative numbers puts the label on top of the point.
             */
            distance: 100,
            // eslint-disable-next-line valid-jsdoc
            /**
             * @type    {Highcharts.TimelineDataLabelsFormatterCallbackFunction}
             * @default function () {
             *   let format;
             *
             *   if (!this.series.chart.styledMode) {
             *       format = '<span style="color:' + this.point.color +
             *           '">● </span>';
             *   } else {
             *       format = '<span>● </span>';
             *   }
             *   format += '<span>' + (this.key || '') + '</span><br/>' +
             *       (this.point.label || '');
             *   return format;
             * }
             */
            formatter: function () {
                var format;
                if (!this.series.chart.styledMode) {
                    format = '<span style="color:' + this.point.color +
                        '">● </span>';
                }
                else {
                    format = '<span>● </span>';
                }
                format += '<span class="highcharts-strong">' +
                    (this.key || '') + '</span><br/>' +
                    (this.point.label || '');
                return format;
            },
            style: {
                /** @internal */
                textOutline: 'none',
                /** @internal */
                fontWeight: 'normal',
                /** @internal */
                fontSize: '12px'
            },
            /**
             * Shadow options for the data label.
             *
             * @type {boolean|Highcharts.CSSObject}
             */
            shadow: false,
            /**
             * @type      {number}
             * @apioption plotOptions.timeline.dataLabels.width
             */
            verticalAlign: 'middle'
        },
        marker: {
            enabledThreshold: 0,
            symbol: 'square',
            radius: 6,
            lineWidth: 2,
            height: 15
        },
        showInLegend: false,
        colorKey: 'x'
    });
    return TimelineSeries;
}(LineSeries));
extend(TimelineSeries.prototype, {
    // Use a simple symbol from LegendSymbolMixin
    drawLegendSymbol: LegendSymbol.drawRectangle,
    // Use a group of trackers from TrackerMixin
    drawTracker: ColumnSeries.prototype.drawTracker,
    pointClass: TimelinePoint,
    trackerGroups: ['markerGroup', 'dataLabelsGroup']
});
SeriesRegistry.registerSeriesType('timeline', TimelineSeries);
/* *
 *
 *  Default Export
 *
 * */
export default TimelineSeries;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Callback JavaScript function to format the data label as a string. Note that
 * if a `format` is defined, the format takes precedence and the formatter is
 * ignored.
 *
 * @callback Highcharts.TimelineDataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.PointLabelObject|Highcharts.TimelineDataLabelsFormatterContextObject} this
 *        Data label context to format
 *
 * @return {number|string|null|undefined}
 *         Formatted data label text
 */
/**
 * @interface Highcharts.TimelineDataLabelsFormatterContextObject
 * @extends Highcharts.PointLabelObject
 */ /**
* @name Highcharts.TimelineDataLabelsFormatterContextObject#key
* @type {string|undefined}
*/ /**
* @name Highcharts.TimelineDataLabelsFormatterContextObject#point
* @type {Highcharts.Point}
*/ /**
* @name Highcharts.TimelineDataLabelsFormatterContextObject#series
* @type {Highcharts.Series}
*/
''; // dettach doclets above
/* *
 *
 *  API Options
 *
 * */
/**
 * The `timeline` series. If the [type](#series.timeline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.timeline
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, findNearestPointBy,
 *            getExtremesFromAll, lineWidth, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointStart,
 *            softThreshold, stacking, stack, step, threshold, turboThreshold,
 *            zoneAxis, zones, dataSorting, boostBlending
 * @product   highcharts
 * @requires  modules/timeline
 * @apioption series.timeline
 */
/**
 * An array of data points for the series. For the `timeline` series type,
 * points can be given with three general parameters, `name`, `label`,
 * and `description`:
 *
 * Example:
 *
 * ```js
 * series: [{
 *    type: 'timeline',
 *    data: [{
 *        name: 'Jan 2018',
 *        label: 'Some event label',
 *        description: 'Description to show in tooltip'
 *    }]
 * }]
 * ```
 * If all points additionally have the `x` values, and xAxis type is set to
 * `datetime`, then events are laid out on a true time axis, where their
 * placement reflects the actual time between them.
 *
 * @sample {highcharts} highcharts/series-timeline/alternate-labels
 *         Alternate labels
 * @sample {highcharts} highcharts/series-timeline/datetime-axis
 *         Real time intervals
 *
 * @type      {Array<*>}
 * @extends   series.line.data
 * @excluding marker, y
 * @product   highcharts
 * @apioption series.timeline.data
 */
/**
 * The name of event.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.name
 */
/**
 * The label of event.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.label
 */
/**
 * The description of event. This description will be shown in tooltip.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.timeline.data.description
 */
''; // adds doclets above to transpiled file
