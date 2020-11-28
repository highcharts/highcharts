/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2020 Highsoft AS
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

import type BBoxObject from '../Core/Renderer/BBoxObject';
import type ColorType from '../Core/Color/ColorType';
import type {
    DataLabelFormatterCallback,
    DataLabelOptions
} from '../Core/Series/DataLabelOptions';
import type LinePointOptions from './Line/LinePointOptions';
import type LineSeriesOptions from './Line/LineSeriesOptions';
import type Point from '../Core/Series/Point';
import type {
    PointMarkerOptions,
    PointStatesOptions
} from '../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../Core/Series/StatesOptions';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import BaseSeries from '../Core/Series/Series.js';
const {
    seriesTypes: {
        line: LineSeries,
        pie: {
            prototype: {
                pointClass: PiePoint
            }
        }
    }
} = BaseSeries;
import H from '../Core/Globals.js';
import LegendSymbolMixin from '../Mixins/LegendSymbol.js';
import palette from '../Core/Color/Palette.js';
import SVGElement from '../Core/Renderer/SVG/SVGElement.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    defined,
    extend,
    isNumber,
    merge,
    objectEach,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface TimelineDataLabelsFormatterCallbackFunction
            extends DataLabelFormatterCallback
        {
            (
                this: (
                    Point.PointLabelObject|
                    TimelineDataLabelsFormatterContextObject
                )
            ): string;
        }
        interface TimelineDataLabelsFormatterContextObject
            extends Point.PointLabelObject
        {
            key?: string;
            point: TimelinePoint;
            series: TimelineSeries;
        }
        interface TimelineDataLabelsOptionsObject extends DataLabelOptions
        {
            alternate?: boolean;
            connectorColor?: ColorType;
            connectorWidth?: number;
            distance?: number;
            formatter?: TimelineDataLabelsFormatterCallbackFunction;
            width?: number;
        }
        interface TimelinePointOptions extends LinePointOptions {
            dataLabels?: TimelineDataLabelsOptionsObject;
            isNull?: boolean;
            radius?: number;
            visible?: boolean;
        }
        interface TimelineSeriesOptions extends LineSeriesOptions {
            data?: Array<TimelinePointOptions>;
            dataLabels?: TimelineDataLabelsOptionsObject;
            ignoreHiddenPoint?: boolean;
            radius?: number;
            radiusPlus?: number;
            states?: SeriesStatesOptions<TimelineSeries>;
        }
    }
}

var TrackerMixin = H.TrackerMixin;

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
    public static defaultOptions: Highcharts.TimelineSeriesOptions = merge(LineSeries.defaultOptions, {
        colorByPoint: true,
        stickyTracking: false,
        ignoreHiddenPoint: true,
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
                this: (
                    Point.PointLabelObject|
                    Highcharts.TimelineDataLabelsFormatterContextObject
                )
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
    } as Highcharts.TimelineSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<TimelinePoint> = void 0 as any;

    public options: Highcharts.TimelineSeriesOptions = void 0 as any;

    public points: Array<TimelinePoint> = void 0 as any;

    public userOptions: Highcharts.TimelineSeriesOptions = void 0 as any;

    public visibilityMap: Array<(boolean|TimelinePoint|Highcharts.TimelinePointOptions)> = void 0 as any;

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
        _options: Highcharts.TimelineDataLabelsOptionsObject,
        _alignTo: BBoxObject
    ): void {
        var series = this,
            isInverted = series.chart.inverted,
            visiblePoints = series.visibilityMap.filter(function (
                point: (
                    boolean|TimelinePoint|
                    Highcharts.TimelinePointOptions
                )
            ): boolean {
                return point as any;
            }),
            visiblePointsCount: number = series.visiblePointsCount as any,
            pointIndex = visiblePoints.indexOf(point),
            isFirstOrLast = (
                !pointIndex || pointIndex === visiblePointsCount - 1
            ),
            dataLabelsOptions: Highcharts.TimelineDataLabelsOptionsObject =
                series.options.dataLabels as any,
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
            dataLabelsOptions: Highcharts.TimelineDataLabelsOptionsObject =
                series.options.dataLabels as any,
            options,
            pointDLOptions,
            newOptions: Highcharts.TimelineDataLabelsOptionsObject = {},
            visibilityIndex = 1,
            distance: number = dataLabelsOptions.distance as any;

        series.points.forEach(function (point): void {
            if (point.visible && !point.isNull) {
                options = point.options;
                pointDLOptions = point.options.dataLabels;

                if (!series.hasRendered) {
                    point.userDLOptions =
                        merge<Highcharts.TimelineDataLabelsOptionsObject>(
                            {},
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

    public getVisibilityMap(): Array<(boolean|TimelinePoint|Highcharts.TimelinePointOptions)> {
        var series = this,
            map = (series.data.length ?
                series.data : (series.userOptions.data as any)
            ).map(function (
                point: (
                    TimelinePoint|
                    Highcharts.TimelinePointOptions
                )
            ): (boolean|TimelinePoint|
                Highcharts.TimelinePointOptions
                ) {
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
    drawTracker: Highcharts.TrackerMixin['drawTrackerPoint'];
    pointClass: typeof TimelinePoint;
    trackerGroups: Array<string>;
}
extend(TimelineSeries.prototype, {
    // Use a simple symbol from LegendSymbolMixin
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    // Use a group of trackers from TrackerMixin
    drawTracker: TrackerMixin.drawTrackerPoint,
    trackerGroups: ['markerGroup', 'dataLabelsGroup']
});

/* *
 *
 *  Class
 *
 * */

class TimelinePoint extends LineSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public label?: string;

    public options: Highcharts.TimelinePointOptions = void 0 as any;

    public series: TimelineSeries = void 0 as any;

    public userDLOptions?: Highcharts.TimelineDataLabelsOptionsObject;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public alignConnector(): void {
        var point = this,
            series = point.series,
            connector: SVGElement = point.connector as any,
            dl: SVGElement = point.dataLabel as any,
            dlOptions = (point.dataLabel as any).options = merge(
                series.options.dataLabels,
                point.options.dataLabels
            ),
            chart = point.series.chart,
            bBox = connector.getBBox(),
            plotPos = {
                x: bBox.x + dl.translateX,
                y: bBox.y + dl.translateY
            },
            isVisible;

        // Include a half of connector width in order to run animation,
        // when connectors are aligned to the plot area edge.
        if (chart.inverted) {
            plotPos.y -= dl.options.connectorWidth / 2;
        } else {
            plotPos.x += dl.options.connectorWidth / 2;
        }

        isVisible = chart.isInsidePlot(
            plotPos.x, plotPos.y
        );

        connector[isVisible ? 'animate' : 'attr']({
            d: point.getConnectorPath()
        });

        if (!series.chart.styledMode) {
            connector.attr({
                stroke: dlOptions.connectorColor || point.color,
                'stroke-width': dlOptions.connectorWidth,
                opacity: dl[
                    defined(dl.newOpacity) ? 'newOpacity' : 'opacity'
                ]
            });
        }
    }

    public drawConnector(): void {
        var point = this,
            series = point.series;

        if (!point.connector) {
            point.connector = series.chart.renderer
                .path(point.getConnectorPath())
                .attr({
                    zIndex: -1
                })
                .add(point.dataLabel);
        }

        if (point.series.chart.isInsidePlot( // #10507
            (point.dataLabel as any).x, (point.dataLabel as any).y
        )) {
            point.alignConnector();
        }
    }

    public getConnectorPath(): SVGPath {
        var point = this,
            chart = point.series.chart,
            xAxisLen = point.series.xAxis.len,
            inverted = chart.inverted,
            direction = inverted ? 'x2' : 'y2',
            dl: SVGElement = point.dataLabel as any,
            targetDLPos = dl.targetPosition,
            coords: Record<string, (number|string)> = {
                x1: point.plotX as any,
                y1: point.plotY as any,
                x2: point.plotX as any,
                y2: isNumber(targetDLPos.y) ? targetDLPos.y : dl.y
            },
            negativeDistance = (
                (dl.alignAttr || dl)[direction[0]] <
                    point.series.yAxis.len / 2
            ),
            path: SVGPath;

        // Recalculate coords when the chart is inverted.
        if (inverted) {
            coords = {
                x1: point.plotY as any,
                y1: xAxisLen - (point.plotX as any),
                x2: targetDLPos.x || dl.x,
                y2: xAxisLen - (point.plotX as any)
            };
        }

        // Subtract data label width or height from expected coordinate so
        // that the connector would start from the appropriate edge.
        if (negativeDistance) {
            coords[direction] += dl[inverted ? 'width' : 'height'];
        }

        // Change coordinates so that they will be relative to data label.
        objectEach(coords, function (
            _coord: (number|string),
            i: string
        ): void {
            (coords[i] as any) -= (dl.alignAttr || dl)[i[0]];
        });

        path = chart.renderer.crispLine(
            [
                ['M', coords.x1, coords.y1],
                ['L', coords.x2, coords.y2]
            ] as SVGPath,
            dl.options.connectorWidth
        );

        return path;
    }

    public init(): TimelinePoint {
        var point: TimelinePoint = super.init.apply(this, arguments) as any;

        point.name = pick(point.name, 'Event');
        point.y = 1;

        return point;
    }

    public isValid(): boolean {
        return this.options.y !== null;
    }

    public setState(): void {
        var proceed = super.setState;

        // Prevent triggering the setState method on null points.
        if (!this.isNull) {
            proceed.apply(this, arguments);
        }
    }

    public setVisible(
        visible: boolean,
        redraw?: boolean
    ): void {
        var point = this,
            series = point.series;

        redraw = pick(redraw, series.options.ignoreHiddenPoint);

        PiePoint.prototype.setVisible.call(point, visible, false);
        // Process new data
        series.processData();

        if (redraw) {
            series.chart.redraw();
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Registry
 *
 * */

declare module '../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        timeline: typeof TimelineSeries;
    }
}
TimelineSeries.prototype.pointClass = TimelinePoint;
BaseSeries.registerSeriesType('timeline', TimelineSeries);

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
