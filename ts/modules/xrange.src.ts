/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2019 Torstein Honsi, Lars A. V. Cabrera
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
        class XRangePoint extends ColumnPoint {
            public clipRectArgs?: RectangleObject;
            public len?: number;
            public options: XRangePointOptions;
            public partialFill: XRangePointOptions['partialFill'];
            public partShapeArgs?: XRangePartialFillObject;
            public series: XRangeSeries;
            public setState: Point['setState'];
            public tooltipDateKeys: Array<string>;
            public x2?: number;
            public yCategory?: string;
            public init(): XRangePoint;
            public isValid(): boolean;
            public resolveColor(): void;
        }
        class XRangeSeries extends ColumnSeries {
            public animate: LineSeries['animate'];
            public cropShoulder: number;
            public data: Array<XRangePoint>;
            public getExtremesFromAll: boolean;
            public options: XRangeSeriesOptions;
            public parallelArrays: Array<string>;
            public pointClass: typeof XRangePoint;
            public points: Array<XRangePoint>;
            public requireSorting: boolean;
            public type: string;
            public x2Data: Array<(number|undefined)>;
            public cropData(
                xData: Array<number>,
                yData: Array<number>,
                min: number,
                max: number
            ): SeriesCropDataObject;
            public drawPoint(point: XRangePoint, verb: string): void;
            public drawPoints(): void;
            public findPointIndex(
                options: XRangePointOptions
            ): (number|undefined);
            public getAnimationVerb(): string;
            public getColumnMetrics(): ColumnMetricsObject;
            public translate(): void;
            public translatePoint(point: XRangePoint): void;
        }
        interface SeriesTypesDictionary {
            xrange: typeof XRangeSeries;
        }
        interface XRangePartialFillObject extends PositionObject, SizeObject {
            r?: number;
        }
        interface XRangePointLabelObject extends PointLabelObject {
            x2?: XRangePoint['x2'];
            yCategory?: XRangePoint['yCategory'];
        }
        interface XRangePointOptions extends ColumnPointOptions {
            partialFill?: XRangePointPartialFillOptions;
            x2?: number;
        }
        interface XRangePointPartialFillOptions {
            amount?: number;
            fill?: ColorType;
            height?: number;
            width?: number;
            r?: number;
            x?: number;
            y?: number;
        }
        interface XRangeSeriesOptions extends ColumnSeriesOptions {
            partialFill?: XRangePointPartialFillOptions;
            states?: SeriesStatesOptionsObject<XRangeSeries>;
        }
    }
}

/* *
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 *//**
 * The ending X value of the range point.
 * @name Highcharts.PointOptionsObject#x2
 * @type {number|undefined}
 * @requires modules/xrange
 */

import U from '../parts/Utilities.js';
const {
    clamp,
    correctFloat,
    defined,
    isNumber,
    isObject,
    pick
} = U;

var addEvent = H.addEvent,
    color = H.color,
    columnType = H.seriesTypes.column,
    find = H.find,
    merge = H.merge,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    Axis = H.Axis,
    Point = H.Point,
    Series = H.Series;

/**
 * Return color of a point based on its category.
 *
 * @private
 * @function getColorByCategory
 *
 * @param {object} series
 *        The series which the point belongs to.
 *
 * @param {object} point
 *        The point to calculate its color for.
 *
 * @return {object}
 *         Returns an object containing the properties color and colorIndex.
 */
function getColorByCategory(
    series: Highcharts.Series,
    point: Highcharts.Point
): Highcharts.Dictionary<any> {
    var colors = series.options.colors || series.chart.options.colors,
        colorCount = colors ?
            colors.length :
            (series.chart.options.chart as any).colorCount,
        colorIndex = (point.y as any) % colorCount,
        color = colors && colors[colorIndex];

    return {
        colorIndex: colorIndex,
        color: color
    };
}

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.xrange
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.XRangeSeries>('xrange', 'column'

    /**
     * The X-range series displays ranges on the X axis, typically time
     * intervals with a start and end date.
     *
     * @sample {highcharts} highcharts/demo/x-range/
     *         X-range
     * @sample {highcharts} highcharts/css/x-range/
     *         Styled mode X-range
     * @sample {highcharts} highcharts/chart/inverted-xrange/
     *         Inverted X-range
     *
     * @extends      plotOptions.column
     * @since        6.0.0
     * @product      highcharts highstock gantt
     * @excluding    boostThreshold, crisp, cropThreshold, depth, edgeColor,
     *               edgeWidth, findNearestPointBy, getExtremesFromAll,
     *               negativeColor, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, softThreshold,
     *               stacking, threshold, data
     * @requires     modules/xrange
     * @optionparent plotOptions.xrange
     */
    , {

        /**
         * A partial fill for each point, typically used to visualize how much
         * of a task is performed. The partial fill object can be set either on
         * series or point level.
         *
         * @sample {highcharts} highcharts/demo/x-range
         *         X-range with partial fill
         *
         * @product   highcharts highstock gantt
         * @apioption plotOptions.xrange.partialFill
         */

        /**
         * The fill color to be used for partial fills. Defaults to a darker
         * shade of the point color.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highcharts highstock gantt
         * @apioption plotOptions.xrange.partialFill.fill
         */

        /**
         * A partial fill for each point, typically used to visualize how much
         * of a task is performed. See [completed](series.gantt.data.completed).
         *
         * @sample gantt/demo/progress-indicator
         *         Gantt with progress indicator
         *
         * @product   gantt
         * @apioption plotOptions.gantt.partialFill
         */

        /**
         * In an X-range series, this option makes all points of the same Y-axis
         * category the same color.
         */
        colorByPoint: true,

        dataLabels: {
            formatter: function (): (string|undefined) {
                var point = this.point,
                    amount = (point as Highcharts.XRangePoint).partialFill;

                if (isObject(amount)) {
                    amount = (amount as any).amount;
                }
                if (isNumber(amount) && amount > 0) {
                    return correctFloat(amount * 100) + '%';
                }
            },
            inside: true,
            verticalAlign: 'middle'
        },

        tooltip: {

            headerFormat: '<span style="font-size: 10px">{point.x} - {point.x2}</span><br/>',

            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
        },

        borderRadius: 3,

        pointRange: 0

    }, {

        type: 'xrange',
        parallelArrays: ['x', 'x2', 'y'],
        requireSorting: false,
        animate: seriesTypes.line.prototype.animate,
        cropShoulder: 1,
        getExtremesFromAll: true,
        autoIncrement: H.noop as any,
        buildKDTree: H.noop as any,

        /* eslint-disable valid-jsdoc */

        /**
         * Borrow the column series metrics, but with swapped axes. This gives
         * free access to features like groupPadding, grouping, pointWidth etc.
         *
         * @private
         * @function Highcharts.Series#getColumnMetrics
         *
         * @return {Highcharts.ColumnMetricsObject}
         */
        getColumnMetrics: function (
            this: Highcharts.XRangeSeries
        ): Highcharts.ColumnMetricsObject {
            var metrics,
                chart = this.chart;

            /**
             * @private
             */
            function swapAxes(): void {
                chart.series.forEach(function (s: Highcharts.Series): void {
                    var xAxis = s.xAxis;

                    s.xAxis = s.yAxis;
                    s.yAxis = xAxis;
                });
            }

            swapAxes();

            metrics = columnType.prototype.getColumnMetrics.call(this);

            swapAxes();

            return metrics;
        },

        /**
         * Override cropData to show a point where x or x2 is outside visible
         * range, but one of them is inside.
         *
         * @private
         * @function Highcharts.Series#cropData
         *
         * @param {Array<number>} xData
         *
         * @param {Array<number>} yData
         *
         * @param {number} min
         *
         * @param {number} max
         *
         * @param {number} [cropShoulder]
         *
         * @return {*}
         */
        cropData: function (
            this: Highcharts.XRangeSeries,
            xData: Array<number>,
            yData: Array<number>,
            min: number,
            max: number
        ): Highcharts.SeriesCropDataObject {

            // Replace xData with x2Data to find the appropriate cropStart
            var cropData = Series.prototype.cropData,
                crop = cropData.call(this, this.x2Data as any, yData, min, max);

            // Re-insert the cropped xData
            crop.xData = xData.slice(crop.start, crop.end);

            return crop;
        },
        /**
         * Finds the index of an existing point that matches the given point
         * options.
         *
         * @private
         * @function Highcharts.Series#findPointIndex
         * @param {object} options The options of the point.
         * @returns {number|undefined} Returns index of a matching point,
         * returns undefined if no match is found.
         */
        findPointIndex: function (
            this: Highcharts.XRangeSeries,
            options: Highcharts.XRangePointOptions
        ): (number|undefined) {
            const { cropped, cropStart, points } = this;
            const { id } = options;
            let pointIndex: (number|undefined);

            if (id) {
                const point = find(points, function (
                    point: Highcharts.XRangePoint
                ): boolean {
                    return point.id === id;
                });
                pointIndex = point ? point.index : void 0;
            }

            if (typeof pointIndex === 'undefined') {
                const point = find(points, function (
                    point: Highcharts.XRangePoint
                ): boolean {
                    return (
                        point.x === options.x &&
                        point.x2 === options.x2 &&
                        !point.touched
                    );
                });
                pointIndex = point ? point.index : void 0;
            }

            // Reduce pointIndex if data is cropped
            if (
                cropped &&
                isNumber(pointIndex) &&
                isNumber(cropStart) &&
                pointIndex >= cropStart
            ) {
                pointIndex -= cropStart;
            }

            return pointIndex;
        },
        /**
         * @private
         * @function Highcharts.Series#translatePoint
         *
         * @param {Highcharts.Point} point
         */
        translatePoint: function (
            this: Highcharts.XRangeSeries,
            point: Highcharts.XRangePoint
        ): void {
            var series = this,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                metrics: Highcharts.ColumnMetricsObject =
                    series.columnMetrics as any,
                options = series.options,
                minPointLength = options.minPointLength || 0,
                plotX = point.plotX,
                posX = pick(point.x2, (point.x as any) + (point.len || 0)),
                plotX2 = xAxis.translate(
                    posX,
                    0 as any,
                    0 as any,
                    0 as any,
                    1 as any
                ),
                length = Math.abs((plotX2 as any) - (plotX as any)),
                widthDifference,
                shapeArgs,
                partialFill: (
                    Highcharts.XRangePointPartialFillOptions|
                    undefined
                ),
                inverted = this.chart.inverted,
                borderWidth = pick(options.borderWidth, 1),
                crisper = borderWidth % 2 / 2,
                yOffset = metrics.offset,
                pointHeight = Math.round(metrics.width),
                dlLeft,
                dlRight,
                dlWidth,
                clipRectWidth;

            if (minPointLength) {
                widthDifference = minPointLength - length;
                if (widthDifference < 0) {
                    widthDifference = 0;
                }
                (plotX as any) -= widthDifference / 2;
                (plotX2 as any) += widthDifference / 2;
            }

            plotX = Math.max((plotX as any), -10);
            plotX2 = clamp(plotX2 as any, -10, xAxis.len + 10);

            // Handle individual pointWidth
            if (defined(point.options.pointWidth)) {
                yOffset -= (
                    (Math.ceil(point.options.pointWidth) - pointHeight) / 2
                );
                pointHeight = Math.ceil(point.options.pointWidth);
            }

            // Apply pointPlacement to the Y axis
            if (
                options.pointPlacement &&
                isNumber(point.plotY) &&
                yAxis.categories
            ) {
                point.plotY = yAxis.translate(
                    (point.y as any),
                    0 as any,
                    1 as any,
                    0 as any,
                    1 as any,
                    options.pointPlacement as any
                );
            }

            point.shapeArgs = {
                x: Math.floor(Math.min(plotX, plotX2)) + crisper,
                y: Math.floor((point.plotY as any) + yOffset) + crisper,
                width: Math.round(Math.abs(plotX2 - plotX)),
                height: pointHeight,
                r: series.options.borderRadius
            };

            // Align data labels inside the shape and inside the plot area
            dlLeft = point.shapeArgs.x;
            dlRight = dlLeft + point.shapeArgs.width;
            if (dlLeft < 0 || dlRight > xAxis.len) {
                dlLeft = clamp(dlLeft, 0, xAxis.len);
                dlRight = clamp(dlRight, 0, xAxis.len);
                dlWidth = dlRight - dlLeft;
                point.dlBox = merge(point.shapeArgs, {
                    x: dlLeft,
                    width: dlRight - dlLeft,
                    centerX: dlWidth ? dlWidth / 2 : null
                }) as any;

            } else {
                point.dlBox = null as any;
            }

            // Tooltip position
            const tooltipPos: number[] = (point.tooltipPos as any);
            const xIndex = !inverted ? 0 : 1;
            const yIndex = !inverted ? 1 : 0;
            // Limit position by the correct axis size (#9727)
            tooltipPos[xIndex] = clamp(
                tooltipPos[xIndex] + (
                    (!inverted ? 1 : -1) * (xAxis.reversed ? -1 : 1) *
                    (length / 2)
                ),
                0,
                xAxis.len - 1
            );
            tooltipPos[yIndex] = clamp(
                tooltipPos[yIndex] + (
                    (!inverted ? -1 : 1) * (metrics.width / 2)
                ),
                0,
                yAxis.len - 1
            );

            // Add a partShapeArgs to the point, based on the shapeArgs property
            partialFill = point.partialFill;
            if (partialFill) {
            // Get the partial fill amount
                if (isObject(partialFill)) {
                    partialFill = partialFill.amount as any;
                }
                // If it was not a number, assume 0
                if (!isNumber(partialFill)) {
                    partialFill = 0 as any;
                }
                shapeArgs = point.shapeArgs;
                point.partShapeArgs = {
                    x: shapeArgs.x,
                    y: shapeArgs.y,
                    width: shapeArgs.width,
                    height: shapeArgs.height,
                    r: series.options.borderRadius
                };

                clipRectWidth = Math.max(
                    Math.round(
                        length * (partialFill as any) + (point.plotX as any) -
                        plotX
                    ),
                    0
                );
                point.clipRectArgs = {
                    x: xAxis.reversed ? // #10717
                        shapeArgs.x + length - clipRectWidth :
                        shapeArgs.x,
                    y: shapeArgs.y,
                    width: clipRectWidth,
                    height: shapeArgs.height
                };
            }
        },

        /**
         * @private
         * @function Highcharts.Series#translate
         */
        translate: function (this: Highcharts.XRangeSeries): void {
            columnType.prototype.translate.apply(this, arguments as any);
            this.points.forEach(function (point: Highcharts.XRangePoint): void {
                this.translatePoint(point);
            }, this);
        },

        /**
         * Draws a single point in the series. Needed for partial fill.
         *
         * This override turns point.graphic into a group containing the
         * original graphic and an overlay displaying the partial fill.
         *
         * @private
         * @function Highcharts.Series#drawPoint
         *
         * @param {Highcharts.Point} point
         *        An instance of Point in the series.
         *
         * @param {"animate"|"attr"} verb
         *        'animate' (animates changes) or 'attr' (sets options)
         */
        drawPoint: function (
            this: Highcharts.XRangeSeries,
            point: Highcharts.XRangePoint,
            verb: string
        ): void {
            var series = this,
                seriesOpts = series.options,
                renderer = series.chart.renderer,
                graphic = point.graphic,
                type = point.shapeType,
                shapeArgs = point.shapeArgs,
                partShapeArgs = point.partShapeArgs,
                clipRectArgs = point.clipRectArgs,
                pfOptions = point.partialFill,
                cutOff = seriesOpts.stacking && !seriesOpts.borderRadius,
                pointState = point.state,
                stateOpts: Highcharts.SeriesStatesHoverOptionsObject = (
                    (seriesOpts.states as any)[pointState || 'normal'] ||
                    {}
                ),
                pointStateVerb = typeof pointState === 'undefined' ?
                    'attr' : verb,
                pointAttr = series.pointAttribs(point, pointState),
                animation = pick(
                    (series.chart.options.chart as any).animation,
                    stateOpts.animation
                ),
                fill;

            if (!point.isNull) {

                // Original graphic
                if (graphic) { // update
                    graphic.rect[verb](shapeArgs);
                } else {
                    point.graphic = graphic = renderer.g('point')
                        .addClass(point.getClassName())
                        .add(point.group || series.group);

                    graphic.rect = (renderer as any)[type](merge(shapeArgs))
                        .addClass(point.getClassName())
                        .addClass('highcharts-partfill-original')
                        .add(graphic);
                }

                // Partial fill graphic
                if (partShapeArgs) {
                    if (graphic.partRect) {
                        graphic.partRect[verb](
                            merge(partShapeArgs)
                        );
                        graphic.partialClipRect[verb](
                            merge(clipRectArgs)
                        );

                    } else {

                        graphic.partialClipRect = renderer.clipRect(
                            (clipRectArgs as any).x,
                            (clipRectArgs as any).y,
                            (clipRectArgs as any).width,
                            (clipRectArgs as any).height
                        );

                        graphic.partRect =
                            (renderer as any)[type](partShapeArgs)
                                .addClass('highcharts-partfill-overlay')
                                .add(graphic)
                                .clip(graphic.partialClipRect);
                    }
                }


                // Presentational
                if (!series.chart.styledMode) {
                    graphic
                        .rect[verb](
                            pointAttr,
                            animation
                        )
                        .shadow(seriesOpts.shadow, null, cutOff);

                    if (partShapeArgs) {
                        // Ensure pfOptions is an object
                        if (!isObject(pfOptions)) {
                            pfOptions = {};
                        }
                        if (isObject(seriesOpts.partialFill)) {
                            pfOptions = merge(
                                pfOptions, seriesOpts.partialFill
                            );
                        }

                        fill = (
                            (pfOptions as any).fill ||
                            color(pointAttr.fill).brighten(-0.3).get() ||
                            color(point.color || series.color)
                                .brighten(-0.3).get()
                        );

                        pointAttr.fill = fill;
                        graphic
                            .partRect[pointStateVerb](
                                pointAttr,
                                animation
                            )
                            .shadow(seriesOpts.shadow, null, cutOff);
                    }
                }

            } else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        },

        /**
         * @private
         * @function Highcharts.Series#drawPoints
         */
        drawPoints: function (this: Highcharts.XRangeSeries): void {
            var series = this,
                verb = series.getAnimationVerb();

            // Draw the columns
            series.points.forEach(function (
                point: Highcharts.XRangePoint
            ): void {
                series.drawPoint(point, verb);
            });
        },


        /**
         * Returns "animate", or "attr" if the number of points is above the
         * animation limit.
         *
         * @private
         * @function Highcharts.Series#getAnimationVerb
         *
         * @return {string}
         */
        getAnimationVerb: function (this: Highcharts.XRangeSeries): string {
            return (
                this.chart.pointCount < (this.options.animationLimit || 250) ?
                    'animate' :
                    'attr'
            );
        }

        /*
        // Override to remove stroke from points. For partial fill.
        pointAttribs: function () {
            var series = this,
                retVal = columnType.prototype.pointAttribs
                    .apply(series, arguments);

            //retVal['stroke-width'] = 0;
            return retVal;
        }
        //*/

        /* eslint-enable valid-jsdoc */

    }, { // Point class properties

        /**
         * The ending X value of the range point.
         * @name Highcharts.Point#x2
         * @type {number|undefined}
         * @requires modules/xrange
         */

        /**
         * Extend applyOptions so that `colorByPoint` for x-range means that one
         * color is applied per Y axis category.
         *
         * @private
         * @function Highcharts.Point#applyOptions
         *
         * @return {Highcharts.Series}
         */

        /* eslint-disable valid-jsdoc */

        /**
         * @private
         */
        resolveColor: function (this: Highcharts.XRangePoint): void {
            var series = this.series,
                colorByPoint;

            if (series.options.colorByPoint && !this.options.color) {
                colorByPoint = getColorByCategory(series, this);

                if (!series.chart.styledMode) {
                    this.color = colorByPoint.color;
                }

                if (!this.options.colorIndex) {
                    this.colorIndex = colorByPoint.colorIndex;
                }
            } else if (!this.color) {
                this.color = series.color;
            }

        },
        /**
         * Extend init to have y default to 0.
         *
         * @private
         * @function Highcharts.Point#init
         *
         * @return {Highcharts.Point}
         */
        init: function (this: Highcharts.XRangePoint): Highcharts.XRangePoint {
            Point.prototype.init.apply(this, arguments as any);

            if (!this.y) {
                this.y = 0;
            }

            return this;
        },

        /**
         * @private
         * @function Highcharts.Point#setState
         */
        setState: function (this: Highcharts.XRangePoint): void {
            Point.prototype.setState.apply(this, arguments as any);

            this.series.drawPoint(this, this.series.getAnimationVerb());
        },

        /**
         * @private
         * @function Highcharts.Point#getLabelConfig
         *
         * @return {Highcharts.PointLabelObject}
         */
        // Add x2 and yCategory to the available properties for tooltip formats
        getLabelConfig: function (
            this: Highcharts.XRangePoint
        ): Highcharts.XRangePointLabelObject {
            var point = this,
                cfg: Highcharts.XRangePointLabelObject =
                    Point.prototype.getLabelConfig.call(point) as any,
                yCats: Array<string> = point.series.yAxis.categories as any;

            cfg.x2 = point.x2;
            cfg.yCategory = point.yCategory = yCats && yCats[point.y as any];
            return cfg;
        },
        tooltipDateKeys: ['x', 'x2'],

        /**
         * @private
         * @function Highcharts.Point#isValid
         *
         * @return {boolean}
         */
        isValid: function (this: Highcharts.XRangePoint): boolean {
            return typeof this.x === 'number' &&
            typeof this.x2 === 'number';
        }

        /* eslint-enable valid-jsdoc */

    }
);

/**
 * Max x2 should be considered in xAxis extremes
 */
addEvent(Axis, 'afterGetSeriesExtremes', function (): void {
    var axis = this, // eslint-disable-line no-invalid-this
        axisSeries = axis.series,
        dataMax: (number|undefined),
        modMax: (boolean|undefined);

    if (axis.isXAxis) {
        dataMax = pick(axis.dataMax, -Number.MAX_VALUE);
        axisSeries.forEach(function (series: Highcharts.Series): void {
            if ((series as Highcharts.XRangeSeries).x2Data) {
                (series as Highcharts.XRangeSeries).x2Data
                    .forEach(function (val: (number|undefined)): void {
                        if ((val as any) > (dataMax as any)) {
                            dataMax = val;
                            modMax = true;
                        }
                    });
            }
        });
        if (modMax) {
            axis.dataMax = dataMax;
        }
    }
});


/**
 * An `xrange` series. If the [type](#series.xrange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.xrange
 * @excluding boostThreshold, crisp, cropThreshold, depth, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointRange,
 *            pointStart, softThreshold, stacking, threshold
 * @product   highcharts highstock gantt
 * @requires  modules/xrange
 * @apioption series.xrange
 */

/**
 * An array of data points for the series. For the `xrange` series type,
 * points can be given in the following ways:
 *
 * 1. An array of objects with named values. The objects are point configuration
 *    objects as seen below.
 *    ```js
 *    data: [{
 *        x: Date.UTC(2017, 0, 1),
 *        x2: Date.UTC(2017, 0, 3),
 *        name: "Test",
 *        y: 0,
 *        color: "#00FF00"
 *    }, {
 *        x: Date.UTC(2017, 0, 4),
 *        x2: Date.UTC(2017, 0, 5),
 *        name: "Deploy",
 *        y: 1,
 *        color: "#FF0000"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @declare   Highcharts.XrangePointOptionsObject
 * @type      {Array<*>}
 * @extends   series.line.data
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data
 */

/**
 * The starting X value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.x
 */

/**
 * The ending X value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.x2
 */

/**
 * The Y value of the range point.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.y
 */

/**
 * A partial fill for each point, typically used to visualize how much of
 * a task is performed. The partial fill object can be set either on series
 * or point level.
 *
 * @sample {highcharts} highcharts/demo/x-range
 *         X-range with partial fill
 *
 * @declare   Highcharts.XrangePointPartialFillOptionsObject
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill
 */

/**
 * The amount of the X-range point to be filled. Values can be 0-1 and are
 * converted to percentages in the default data label formatter.
 *
 * @type      {number}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill.amount
 */

/**
 * The fill color to be used for partial fills. Defaults to a darker shade
 * of the point color.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highstock gantt
 * @apioption series.xrange.data.partialFill.fill
 */

''; // adds doclets above to transpiled file
