/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2019 Highsoft AS
 *
 *  Author: Daniel Studencki
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
        class TimelinePoint extends LinePoint {
            public label?: string;
            public options: TimelinePointOptions;
            public series: TimelineSeries;
            public userDLOptions?: TimelineDataLabelsOptionsObject;
            public alignConnector(): void;
            public drawConnector(): void;
            public getConnectorPath(): SVGPathArray;
            public init(): this;
            public isValid(): boolean;
            public setState(): void;
            public setVisible(vis: boolean, redraw?: boolean): void;
        }
        class TimelineSeries extends LineSeries {
            public data: Array<TimelinePoint>;
            public drawLegendSymbol: LegendSymbolMixin['drawRectangle'];
            public drawTracker: TrackerMixin['drawTrackerPoint'];
            public options: TimelineSeriesOptions;
            public pointClass: typeof TimelinePoint;
            public points: Array<TimelinePoint>;
            public trackerGroups: Array<string>;
            public userOptions: TimelineSeriesOptions;
            public visibilityMap: Array<(
                boolean|TimelinePoint|TimelinePointOptions
            )>;
            public visiblePointsCount?: number;
            public yData?: Array<number>;
            public alignDataLabel(
                point: TimelinePoint,
                dataLabel: SVGElement,
                options: TimelineDataLabelsOptionsObject,
                alignTo: BBoxObject
            ): void;
            public bindAxes(): void;
            public distributeDL(): void;
            public generatePoints(): void;
            public getVisibilityMap(): Array<(
                boolean|TimelinePoint|TimelinePointOptions
            )>;
            public getXExtremes(xData: Array<number>): RangeObject;
            public init(): void;
            public markerAttribs(
                point: TimelinePoint,
                state?: string
            ): SVGAttributes;
            public processData(): undefined;
        }
        interface SeriesTypesDictionary {
            timeline: typeof TimelineSeries;
        }
        interface TimelineDataLabelsFormatterCallbackFunction
            extends DataLabelsFormatterCallbackFunction
        {
            (
                this: (
                    DataLabelsFormatterContextObject|
                    TimelineDataLabelsFormatterContextObject
                )
            ): string;
        }
        interface TimelineDataLabelsFormatterContextObject
            extends DataLabelsFormatterContextObject
        {
            key?: string;
            point: TimelinePoint;
            series: TimelineSeries;
        }
        interface TimelineDataLabelsOptionsObject
            extends DataLabelsOptionsObject
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
            states?: SeriesStatesOptionsObject<TimelineSeries>;
        }
    }
}

/**
 * Callback JavaScript function to format the data label as a string. Note that
 * if a `format` is defined, the format takes precedence and the formatter is
 * ignored.
 *
 * @callback Highcharts.TimelineDataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.DataLabelsFormatterContextObject|Highcharts.TimelineDataLabelsFormatterContextObject} this
 *        Data label context to format
 *
 * @return {number|string|null|undefined}
 *         Formatted data label text
 */

/**
 * @interface Highcharts.TimelineDataLabelsFormatterContextObject
 * @extends Highcharts.DataLabelsFormatterContextObject
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

import U from '../parts/Utilities.js';
const {
    arrayMax,
    arrayMin,
    defined,
    isNumber,
    objectEach,
    pick
} = U;

var addEvent = H.addEvent,
    LegendSymbolMixin = H.LegendSymbolMixin,
    TrackerMixin = H.TrackerMixin,
    merge = H.merge,
    Point = H.Point,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * The timeline series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.timeline
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.TimelineSeries>('timeline', 'line',

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
     *               turboThreshold, zoneAxis, zones
     * @requires     modules/timeline
     * @optionparent plotOptions.timeline
     */
    {
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

            backgroundColor: '${palette.backgroundColor}',

            borderWidth: 1,

            borderColor: '${palette.neutralColor40}',

            borderRadius: 3,

            color: '${palette.neutralColor80}',

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
                    Highcharts.DataLabelsFormatterContextObject|
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
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        trackerGroups: ['markerGroup', 'dataLabelsGroup'],
        // Use a simple symbol from LegendSymbolMixin
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
        // Use a group of trackers from TrackerMixin
        drawTracker: TrackerMixin.drawTrackerPoint,
        init: function (this: Highcharts.TimelineSeries): void {
            var series = this;

            Series.prototype.init.apply(series, arguments);

            addEvent(series, 'afterTranslate', function (): void {
                var lastPlotX: (number|undefined),
                    closestPointRangePx = Number.MAX_VALUE;

                series.points.forEach(function (
                    point: Highcharts.TimelinePoint
                ): void {
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
            });

            // Distribute data labels before rendering them. Distribution is
            // based on the 'dataLabels.distance' and 'dataLabels.alternate'
            // property.
            addEvent(series, 'drawDataLabels', function (): void {
                // Distribute data labels basing on defined algorithm.
                series.distributeDL(); // @todo use this scope for series
            });

            addEvent(series, 'afterDrawDataLabels', function (): void {
                var dataLabel; // @todo use this scope for series

                // Draw or align connector for each point.
                series.points.forEach(function (
                    point: Highcharts.TimelinePoint
                ): void {
                    dataLabel = point.dataLabel;

                    if (dataLabel) {
                        // Within this wrap method is necessary to save the
                        // current animation params, because the data label
                        // target position (after animation) is needed to align
                        // connectors.
                        dataLabel.animate = function (
                            this: Highcharts.SVGElement,
                            params: Highcharts.SVGAttributes
                        ): Highcharts.SVGElement {
                            if (this.targetPosition) {
                                this.targetPosition = params;
                            }
                            return H.SVGElement.prototype.animate.apply(
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
            });
            addEvent(
                series.chart,
                'afterHideOverlappingLabel',
                function (): void {
                    series.points.forEach(function (
                        p: Highcharts.TimelinePoint
                    ): void {
                        if (
                            p.connector &&
                            p.dataLabel &&
                            p.dataLabel.oldOpacity !== p.dataLabel.newOpacity
                        ) {
                            p.alignConnector();
                        }
                    });
                }
            );
        },
        alignDataLabel: function (
            this: Highcharts.TimelineSeries,
            point: Highcharts.TimelinePoint,
            dataLabel: Highcharts.SVGElement,
            options: Highcharts.TimelineDataLabelsOptionsObject,
            alignTo: Highcharts.BBoxObject
        ): void {
            var series = this,
                isInverted = series.chart.inverted,
                visiblePoints = series.visibilityMap.filter(function (
                    point: (
                        boolean|Highcharts.TimelinePoint|
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
                        width: targetDLWidth,
                        // Apply ellipsis when data label height is exceeded.
                        textOverflow: dataLabel.width / targetDLWidth *
                            dataLabel.height / 2 > availableSpace * multiplier ?
                            'ellipsis' : 'none'
                    };
                } else {
                    styles = {
                        width: userDLOptions.width ||
                            dataLabelsOptions.width ||
                            availableSpace * multiplier - (pad * 2)
                    };
                }
                dataLabel.css(styles);

                if (!series.chart.styledMode) {
                    dataLabel.shadow(dataLabelsOptions.shadow);
                }
            }
            Series.prototype.alignDataLabel.apply(series, arguments);
        },
        processData: function (this: Highcharts.TimelineSeries): undefined {
            var series = this,
                visiblePoints = 0,
                i: (number|undefined);

            series.visibilityMap = series.getVisibilityMap();

            // Calculate currently visible points.
            series.visibilityMap.forEach(function (
                point: (
                    boolean|Highcharts.TimelinePoint|
                    Highcharts.TimelinePointOptions
                )
            ): void {
                if (point) {
                    visiblePoints++;
                }
            });

            series.visiblePointsCount = visiblePoints;

            for (i = 0; i < (series.xData as any).length; i++) {
                (series.yData as any)[i] = 1;
            }

            Series.prototype.processData.call(this, arguments as any);

            return;
        },
        getXExtremes: function (
            this: Highcharts.TimelineSeries,
            xData: Array<number>
        ): Highcharts.RangeObject {
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
        },
        generatePoints: function (this: Highcharts.TimelineSeries): void {
            var series = this;

            Series.prototype.generatePoints.apply(series);
            series.points.forEach(function (
                point: Highcharts.TimelinePoint,
                i: number
            ): void {
                point.applyOptions({
                    x: (series.xData as any)[i]
                }, (series.xData as any)[i]);
            });
        },
        getVisibilityMap: function (
            this: Highcharts.TimelineSeries
        ): Array<(boolean|Highcharts.TimelinePoint|
            Highcharts.TimelinePointOptions)> {
            var series = this,
                map = (series.data.length ?
                    series.data : (series.userOptions.data as any)
                ).map(function (
                    point: (
                        Highcharts.TimelinePoint|
                        Highcharts.TimelinePointOptions
                    )
                ): (boolean|Highcharts.TimelinePoint|
                    Highcharts.TimelinePointOptions
                    ) {
                    return (
                        point &&
                        point.visible !== false &&
                        !point.isNull
                    ) ? point : false;
                });
            return map;
        },
        distributeDL: function (this: Highcharts.TimelineSeries): void {
            var series = this,
                dataLabelsOptions: Highcharts.TimelineDataLabelsOptionsObject =
                    series.options.dataLabels as any,
                options,
                pointDLOptions,
                newOptions: Highcharts.TimelineDataLabelsOptionsObject = {},
                visibilityIndex = 1,
                distance: number = dataLabelsOptions.distance as any;

            series.points.forEach(function (
                point: Highcharts.TimelinePoint
            ): void {
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
        },
        markerAttribs: function (
            this: Highcharts.TimelineSeries,
            point: Highcharts.TimelinePoint,
            state?: string
        ): Highcharts.SVGAttributes {
            var series = this,
                seriesMarkerOptions: Highcharts.PointMarkerOptionsObject =
                    series.options.marker as any,
                seriesStateOptions: Highcharts.SeriesStateOptionsObject<(
                    Highcharts.TimelineSeries
                )>,
                pointMarkerOptions = point.marker || {},
                symbol = (
                    pointMarkerOptions.symbol || seriesMarkerOptions.symbol
                ),
                pointStateOptions,
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
                attribs: (Highcharts.SVGAttributes|undefined);

            // Call default markerAttribs method, when the xAxis type
            // is set to datetime.
            if (series.xAxis.isDatetimeAxis) {
                return seriesTypes.line.prototype.markerAttribs
                    .call(this, point, state);
            }

            // Handle hover and select states
            if (state) {
                seriesStateOptions =
                    (seriesMarkerOptions.states as any)[state] || {};
                pointStateOptions = pointMarkerOptions.states &&
                    (pointMarkerOptions.states as any)[state] || {};

                radius = pick(
                    pointStateOptions.radius,
                    seriesStateOptions.radius,
                    radius + (
                        seriesStateOptions.radiusPlus || 0
                    )
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

        },
        bindAxes: function (this: Highcharts.TimelineSeries): void {
            var series = this;

            Series.prototype.bindAxes.call(series);

            ['xAxis', 'yAxis'].forEach(function (axis: string): void {
                // Initially set the linked xAxis type to category.
                if (axis === 'xAxis' && !series[axis].userOptions.type) {
                    series[axis].categories = series[axis].hasNames = true;
                }
            });
        }
    },
    /**
     * @lends Highcharts.Point#
     */
    {
        init: function (
            this: Highcharts.TimelinePoint
        ): Highcharts.TimelinePoint {
            var point: Highcharts.TimelinePoint =
                Point.prototype.init.apply(this, arguments) as any;

            point.name = pick(point.name, 'Event');
            point.y = 1;

            return point;
        },
        isValid: function (this: Highcharts.TimelinePoint): boolean {
            return this.options.y !== null;
        },
        setVisible: function (
            this: Highcharts.TimelinePoint,
            vis: boolean,
            redraw?: boolean
        ): void {
            var point = this,
                series = point.series;

            redraw = pick(redraw, series.options.ignoreHiddenPoint);

            seriesTypes.pie.prototype.pointClass.prototype
                .setVisible.call(point, vis, false);
            // Process new data
            series.processData();

            if (redraw) {
                series.chart.redraw();
            }
        },
        setState: function (this: Highcharts.TimelinePoint): void {
            var proceed = Series.prototype.pointClass.prototype.setState;

            // Prevent triggering the setState method on null points.
            if (!this.isNull) {
                proceed.apply(this, arguments);
            }
        },
        getConnectorPath: function (
            this: Highcharts.TimelinePoint
        ): Highcharts.SVGPathArray {
            var point = this,
                chart = point.series.chart,
                xAxisLen = point.series.xAxis.len,
                inverted = chart.inverted,
                direction = inverted ? 'x2' : 'y2',
                dl: Highcharts.SVGElement = point.dataLabel as any,
                targetDLPos = dl.targetPosition,
                coords: Highcharts.Dictionary<(number|string)> = {
                    x1: point.plotX as any,
                    y1: point.plotY as any,
                    x2: point.plotX as any,
                    y2: isNumber(targetDLPos.y) ? targetDLPos.y : dl.y
                },
                negativeDistance = (
                    (dl.alignAttr || dl)[direction[0]] <
                        point.series.yAxis.len / 2
                ),
                path: Highcharts.SVGPathArray;

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
                    'M',
                    coords.x1,
                    coords.y1,
                    'L',
                    coords.x2,
                    coords.y2
                ] as Highcharts.SVGPathArray,
                dl.options.connectorWidth
            );

            return path;
        },
        drawConnector: function (this: Highcharts.TimelinePoint): void {
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
        },
        alignConnector: function (this: Highcharts.TimelinePoint): void {
            var point = this,
                series = point.series,
                connector: Highcharts.SVGElement = point.connector as any,
                dl: Highcharts.SVGElement = point.dataLabel as any,
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
    }
);

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
 *            zoneAxis, zones
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
