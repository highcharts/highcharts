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

/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type {
    TimelineDataLabelContextObject,
    TimelineDataLabelOptions
} from './TimelineDataLabelOptions';
import type TimelinePointOptions from './TimelinePointOptions';
import type TimelineSeriesOptions from './TimelineSeriesOptions';
import type Point from '../../Core/Series/Point';
import type {
    PointMarkerOptions,
    PointStatesOptions
} from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        column: ColumnSeries,
        line: LineSeries
    }
} = SeriesRegistry;
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import TimelinePoint from './TimelinePoint.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    defined,
    extend,
    merge,
    pick
} = U;

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
class TimelineSeries extends LineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

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
    public static defaultOptions: TimelineSeriesOptions = merge(LineSeries.defaultOptions, {
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

            backgroundColor: palette.backgroundColor,

            borderWidth: 1,

            borderColor: palette.neutralColor40,

            borderRadius: 3,

            color: palette.neutralColor80,

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
             *   var format;
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
            formatter: function (
                this: (Point.PointLabelObject|TimelineDataLabelContextObject)
            ): string {
                var format;

                if (!this.series.chart.styledMode) {
                    format = '<span style="color:' + this.point.color +
                        '">● </span>';
                } else {
                    format = '<span>● </span>';
                }
                format += '<span class="highcharts-strong">' +
                    ((this as any).key || '') + '</span><br/>' +
                    ((this.point as any).label || '');
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
    } as TimelineSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<TimelinePoint> = void 0 as any;

    public options: TimelineSeriesOptions = void 0 as any;

    public points: Array<TimelinePoint> = void 0 as any;

    public userOptions: TimelineSeriesOptions = void 0 as any;

    public visibilityMap: Array<(boolean|TimelinePoint|TimelinePointOptions)> = void 0 as any;

    public visiblePointsCount?: number;

    public yData?: Array<number>;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public alignDataLabel(
        point: TimelinePoint,
        dataLabel: SVGElement,
        _options: TimelineDataLabelOptions,
        _alignTo: BBoxObject
    ): void {
        var series = this,
            isInverted = series.chart.inverted,
            visiblePoints = series.visibilityMap.filter(function (point): boolean {
                return point as any;
            }),
            visiblePointsCount: number = series.visiblePointsCount as any,
            pointIndex = visiblePoints.indexOf(point),
            isFirstOrLast = (
                !pointIndex || pointIndex === visiblePointsCount - 1
            ),
            dataLabelsOptions: TimelineDataLabelOptions = series.options.dataLabels as any,
            userDLOptions = point.userDLOptions || {},
            // Define multiplier which is used to calculate data label
            // width. If data labels are alternate, they have two times more
            // space to adapt (excepting first and last ones, which has only
            // one and half), than in case of placing all data labels side
            // by side.
            multiplier = dataLabelsOptions.alternate ?
                (isFirstOrLast ? 1.5 : 2) :
                1,
            distance,
            availableSpace = Math.floor(
                series.xAxis.len / visiblePointsCount
            ),
            pad = dataLabel.padding,
            targetDLWidth,
            styles;

        // Adjust data label width to the currently available space.
        if (point.visible) {
            distance = Math.abs(
                userDLOptions.x || (point.options.dataLabels as any).x
            );
            if (isInverted) {
                targetDLWidth = (
                    (distance - pad) * 2 - ((point.itemHeight as any) / 2)
                );
                styles = {
                    width: targetDLWidth + 'px',
                    // Apply ellipsis when data label height is exceeded.
                    textOverflow: dataLabel.width / targetDLWidth *
                        dataLabel.height / 2 > availableSpace * multiplier ?
                        'ellipsis' : 'none'
                };
            } else {
                styles = {
                    width: (
                        userDLOptions.width ||
                        dataLabelsOptions.width ||
                        availableSpace * multiplier - (pad * 2)
                    ) + 'px'
                };
            }
            dataLabel.css(styles);

            if (!series.chart.styledMode) {
                dataLabel.shadow(dataLabelsOptions.shadow);
            }
        }
        super.alignDataLabel.apply(series, arguments);
    }

    public bindAxes(): void {
        var series = this;

        super.bindAxes.call(series);

        ['xAxis', 'yAxis'].forEach(function (axis): void {
            // Initially set the linked xAxis type to category.
            if (axis === 'xAxis' && !series[axis].userOptions.type) {
                series[axis].categories = series[axis].hasNames = true as any;
            }
        });
    }

    public distributeDL(): void {
        var series = this,
            dataLabelsOptions: TimelineDataLabelOptions = series.options.dataLabels as any,
            options,
            pointDLOptions,
            newOptions: TimelineDataLabelOptions = {} as any,
            visibilityIndex = 1,
            distance: number = dataLabelsOptions.distance as any;

        series.points.forEach(function (point): void {
            if (point.visible && !point.isNull) {
                options = point.options;
                pointDLOptions = point.options.dataLabels;

                if (!series.hasRendered) {
                    point.userDLOptions =
                        merge(
                            {} as TimelineDataLabelContextObject,
                            pointDLOptions
                        );
                }

                newOptions[series.chart.inverted ? 'x' : 'y'] =
                    dataLabelsOptions.alternate && visibilityIndex % 2 ?
                        -distance : distance;

                options.dataLabels = merge(newOptions, point.userDLOptions);
                visibilityIndex++;
            }
        });
    }

    public generatePoints(): void {
        var series = this;

        super.generatePoints.apply(series);
        series.points.forEach(function (point, i): void {
            point.applyOptions({
                x: (series.xData as any)[i]
            }, (series.xData as any)[i]);
        });
    }

    public getVisibilityMap(): Array<(boolean|TimelinePoint|TimelinePointOptions)> {
        var series = this,
            map = (series.data.length ?
                series.data : (series.userOptions.data as any)
            ).map(function (
                point: (TimelinePoint|TimelinePointOptions)
            ): (boolean|TimelinePoint|TimelinePointOptions) {
                return (
                    point &&
                    point.visible !== false &&
                    !point.isNull
                ) ? point : false;
            });
        return map;
    }

    public getXExtremes(xData: Array<number>): Highcharts.RangeObject {
        var series = this,
            filteredData = xData.filter(function (
                x: number,
                i: number
            ): boolean {
                return series.points[i].isValid() &&
                    series.points[i].visible;
            });

        return {
            min: arrayMin(filteredData),
            max: arrayMax(filteredData)
        };
    }

    public init(): void {
        var series = this;

        super.init.apply(series, arguments);

        series.eventsToUnbind.push(addEvent(series, 'afterTranslate', function (): void {
            var lastPlotX: (number|undefined),
                closestPointRangePx = Number.MAX_VALUE;

            series.points.forEach(function (point): void {
                // Set the isInside parameter basing also on the real point
                // visibility, in order to avoid showing hidden points
                // in drawPoints method.
                point.isInside = point.isInside && point.visible;

                // New way of calculating closestPointRangePx value, which
                // respects the real point visibility is needed.
                if (point.visible && !point.isNull) {
                    if (defined(lastPlotX)) {
                        closestPointRangePx = Math.min(
                            closestPointRangePx,
                            Math.abs((point.plotX as any) - lastPlotX)
                        );
                    }
                    lastPlotX = point.plotX;
                }
            });
            series.closestPointRangePx = closestPointRangePx;
        }));

        // Distribute data labels before rendering them. Distribution is
        // based on the 'dataLabels.distance' and 'dataLabels.alternate'
        // property.
        series.eventsToUnbind.push(addEvent(series, 'drawDataLabels', function (): void {
            // Distribute data labels basing on defined algorithm.
            series.distributeDL(); // @todo use this scope for series
        }));

        series.eventsToUnbind.push(addEvent(series, 'afterDrawDataLabels', function (): void {
            var dataLabel; // @todo use this scope for series

            // Draw or align connector for each point.
            series.points.forEach(function (point): void {
                dataLabel = point.dataLabel;

                if (dataLabel) {
                    // Within this wrap method is necessary to save the
                    // current animation params, because the data label
                    // target position (after animation) is needed to align
                    // connectors.
                    dataLabel.animate = function (
                        this: SVGElement,
                        params: SVGAttributes
                    ): SVGElement {
                        if (this.targetPosition) {
                            this.targetPosition = params;
                        }
                        return SVGElement.prototype.animate.apply(
                            this,
                            arguments
                        );
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

        series.eventsToUnbind.push(addEvent(
            series.chart,
            'afterHideOverlappingLabel',
            function (): void {
                series.points.forEach(function (p): void {
                    if (
                        p.connector &&
                        p.dataLabel &&
                        p.dataLabel.oldOpacity !== p.dataLabel.newOpacity
                    ) {
                        p.alignConnector();
                    }
                });
            }
        ));
    }

    public markerAttribs(
        point: TimelinePoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        var series = this,
            seriesMarkerOptions: PointMarkerOptions = series.options.marker as any,
            seriesStateOptions: SeriesStatesOptions<TimelineSeries>,
            pointMarkerOptions = point.marker || {},
            symbol = (
                pointMarkerOptions.symbol || seriesMarkerOptions.symbol
            ),
            pointStateOptions: PointStatesOptions<TimelinePoint>,
            width = pick<number|undefined, number|undefined, number>(
                pointMarkerOptions.width,
                seriesMarkerOptions.width,
                series.closestPointRangePx as any
            ),
            height = pick<number|undefined, number>(
                pointMarkerOptions.height,
                seriesMarkerOptions.height as any
            ),
            radius = 0,
            attribs: (SVGAttributes|undefined);

        // Call default markerAttribs method, when the xAxis type
        // is set to datetime.
        if (series.xAxis.dateTime) {
            return super.markerAttribs.call(this, point, state);
        }

        // Handle hover and select states
        if (state) {
            seriesStateOptions =
                (seriesMarkerOptions.states as any)[state] || {};
            pointStateOptions = pointMarkerOptions.states &&
                (pointMarkerOptions.states as any)[state] || {};

            radius = pick(
                (pointStateOptions as any).radius,
                (seriesStateOptions as any).radius,
                radius + ((seriesStateOptions as any).radiusPlus as any || 0)
            );
        }

        point.hasImage = (symbol && symbol.indexOf('url') === 0) as any;

        attribs = {
            x: Math.floor(point.plotX as any) - (width / 2) - (radius / 2),
            y: (point.plotY as any) - (height / 2) - (radius / 2),
            width: width + radius,
            height: height + radius
        };

        return attribs;

    }

    public processData(): undefined {
        var series = this,
            visiblePoints = 0,
            i: (number|undefined);

        series.visibilityMap = series.getVisibilityMap();

        // Calculate currently visible points.
        series.visibilityMap.forEach(function (point): void {
            if (point) {
                visiblePoints++;
            }
        });

        series.visiblePointsCount = visiblePoints;

        for (i = 0; i < (series.xData as any).length; i++) {
            (series.yData as any)[i] = 1;
        }

        super.processData.call(this, arguments as any);

        return;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface TimelineSeries {
    drawLegendSymbol: Highcharts.LegendSymbolMixin['drawRectangle'];
    pointClass: typeof TimelinePoint;
    trackerGroups: Array<string>;
}
extend(TimelineSeries.prototype, {
    // Use a simple symbol from LegendSymbolMixin
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    // Use a group of trackers from TrackerMixin
    drawTracker: ColumnSeries.prototype.drawTracker,
    pointClass: TimelinePoint,
    trackerGroups: ['markerGroup', 'dataLabelsGroup']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        timeline: typeof TimelineSeries;
    }
}
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
 *//**
 * @name Highcharts.TimelineDataLabelsFormatterContextObject#key
 * @type {string|undefined}
 *//**
 * @name Highcharts.TimelineDataLabelsFormatterContextObject#point
 * @type {Highcharts.Point}
 *//**
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
