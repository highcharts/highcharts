/* *
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
        interface SupertrendLinkedParentPointObject extends Point {
            close: number;
            index: number;
            x: number;
        }

        interface SupertrendLinkedParentObject extends Series {
            data: Array<SupertrendLinkedParentPointObject>;
            points: Array<SupertrendLinkedParentPointObject>;
            xData: Array<number>;
            yData: Array<Array<number>>;
        }

        interface SupertrendGappedExtensionObject {
            options?: SupertrendGappedExtensionOptions;
        }

        interface SupertrendGappedExtensionOptions {
            gapSize?: number;
        }

        interface SupertrendGroupedPointsObject {
            bottom: Array<Partial<Point>>;
            intersect: Array<Partial<Point>>;
            top: Array<Partial<Point>>;
        }

        interface SupertrendLineObject {
            [index: string]: (Dictionary<SVGAttributes>|undefined);
        }

        class SupertrendIndicator extends SMAIndicator {
            public data: Array<SupertrendIndicatorPoint>;
            public drawGraph(): void;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: SupertrendIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public init(): void;
            public linkedParent: SupertrendLinkedParentObject;
            public nameBase: string;
            public nameComponents: Array<string>;
            public options: SupertrendIndicatorOptions;
            public requiredIndicators: Array<string>;
            public pointClass: typeof SupertrendIndicatorPoint;
            public points: Array<SupertrendIndicatorPoint>;
        }

        interface SupertrendIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            multiplier?: number;
        }

        class SupertrendIndicatorPoint extends SMAIndicatorPoint {
            public series: SupertrendIndicator;
            public y: number;
        }

        interface SupertrendIndicatorOptions extends SMAIndicatorOptions {
            changeTrendLine?: Dictionary<CSSObject>;
            fallingTrendColor?: ColorType;
            params?: SupertrendIndicatorParamsOptions;
            risingTrendColor?: ColorType;
        }

        interface SeriesTypesDictionary {
            supertrend: typeof SupertrendIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    correctFloat
} = U;

var isArray = U.isArray,
    objectEach = U.objectEach;

var ATR = H.seriesTypes.atr,
    SMA = H.seriesTypes.sma,
    merge = H.merge;

/* eslint-disable require-jsdoc */
// Utils:
function createPointObj(
    mainSeries: Highcharts.SupertrendLinkedParentObject,
    index: number,
    close: number
): Highcharts.SupertrendLinkedParentPointObject {
    return {
        index: index,
        close: mainSeries.yData[index][close],
        x: mainSeries.xData[index]
    } as any;
}

/* eslint-enable require-jsdoc */

/**
 * The Supertrend series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.supertrend
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.SupertrendIndicator>(
    'supertrend',
    'sma',
    /**
     * Supertrend indicator. This series requires the `linkedTo` option to be
     * set and should be loaded after the `stock/indicators/indicators.js` and
     * `stock/indicators/sma.js`.
     *
     * @sample {highstock} stock/indicators/supertrend
     *         Supertrend indicator
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, cropThreshold, negativeColor, colorAxis, joinBy,
     *               keys, navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking, threshold
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/supertrend
     * @optionparent plotOptions.supertrend
     */
    {
        /**
         * Paramters used in calculation of Supertrend indicator series points.
         *
         * @excluding index
         */
        params: {
            /**
             * Multiplier for Supertrend Indicator.
             */
            multiplier: 3,
            /**
             * The base period for indicator Supertrend Indicator calculations.
             * This is the number of data points which are taken into account
             * for the indicator calculations.
             */
            period: 10
        },
        /**
         * Color of the Supertrend series line that is beneath the main series.
         *
         * @sample {highstock} stock/indicators/supertrend/
         *         Example with risingTrendColor
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        risingTrendColor: '${palette.indicatorPositiveLine}',
        /**
         * Color of the Supertrend series line that is above the main series.
         *
         * @sample {highstock} stock/indicators/supertrend/
         *         Example with fallingTrendColor
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        fallingTrendColor: '${palette.indicatorNegativeLine}',
        /**
         * The styles for the Supertrend line that intersect main series.
         *
         * @sample {highstock} stock/indicators/supertrend/
         *         Example with changeTrendLine
         */
        changeTrendLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,

                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: '${palette.neutralColor80}',

                /**
                 * The dash or dot style of the grid lines. For possible
                 * values, see
                 * [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
                 *
                 * @sample {highcharts} highcharts/yaxis/gridlinedashstyle/
                 *         Long dashes
                 * @sample {highstock} stock/xaxis/gridlinedashstyle/
                 *         Long dashes
                 *
                 * @type  {Highcharts.DashStyleValue}
                 * @since 7.0.0
                 */
                dashStyle: 'LongDash'
            }
        }
    },
    /**
     * @lends Highcharts.Series.prototype
     */
    {
        nameBase: 'Supertrend',
        nameComponents: ['multiplier', 'period'],
        requiredIndicators: ['atr'],
        init: function (this: Highcharts.SupertrendIndicator): void {
            var options: Highcharts.SupertrendIndicatorOptions,
                parentOptions: Highcharts.SeriesOptions;

            SMA.prototype.init.apply(this, arguments);

            options = this.options;
            parentOptions = this.linkedParent.options;

            // Indicator cropThreshold has to be equal linked series one
            // reduced by period due to points comparison in drawGraph method
            // (#9787)
            options.cropThreshold = (
                (parentOptions.cropThreshold as any) -
                ((options.params as any).period - 1)
            );
        },
        drawGraph: function (this: Highcharts.SupertrendIndicator): void {
            var indicator = this,
                indicOptions: Highcharts.SupertrendIndicatorOptions =
                indicator.options,

                // Series that indicator is linked to
                mainSeries = indicator.linkedParent,
                mainLinePoints: Array<(
                    Highcharts.SupertrendLinkedParentPointObject
                )> = (mainSeries ? mainSeries.points : []),
                indicPoints: Array<Highcharts.SupertrendIndicatorPoint> =
                indicator.points,
                indicPath: (Highcharts.SVGElement|undefined) = indicator.graph,
                indicPointsLen: number = indicPoints.length,

                // Points offset between lines
                tempOffset: number = mainLinePoints.length - indicPointsLen,
                offset: number = tempOffset > 0 ? tempOffset : 0,
                // @todo: fix when ichi-moku indicator is merged to master.
                gappedExtend: Highcharts.SupertrendGappedExtensionObject = {
                    options: {
                        gapSize: indicOptions.gapSize
                    }
                },

                // Sorted supertrend points array
                groupedPoitns: Highcharts.SupertrendGroupedPointsObject = {
                    top: [], // Rising trend line points
                    bottom: [], // Falling trend line points
                    intersect: [] // Change trend line points
                },

                // Options for trend lines
                supertrendLineOptions:
                Highcharts.SupertrendLineObject = {
                    top: {
                        styles: {
                            lineWidth: indicOptions.lineWidth,
                            lineColor: (
                                indicOptions.fallingTrendColor ||
                                indicOptions.color
                            ),
                            dashStyle: indicOptions.dashStyle
                        }
                    },
                    bottom: {
                        styles: {
                            lineWidth: indicOptions.lineWidth,
                            lineColor: (
                                indicOptions.risingTrendColor ||
                                indicOptions.color
                            ),
                            dashStyle: indicOptions.dashStyle
                        }
                    },
                    intersect: indicOptions.changeTrendLine
                },
                close = 3,

                // Supertrend line point
                point: Highcharts.SupertrendIndicatorPoint,

                // Supertrend line next point (has smaller x pos than point)
                nextPoint: Highcharts.SupertrendIndicatorPoint,

                // Main series points
                mainPoint: Highcharts.SupertrendLinkedParentPointObject,
                nextMainPoint: Highcharts.SupertrendLinkedParentPointObject,

                // Used when supertrend and main points are shifted
                // relative to each other
                prevMainPoint: Highcharts.SupertrendLinkedParentPointObject,
                prevPrevMainPoint: Highcharts.SupertrendLinkedParentPointObject,

                // Used when particular point color is set
                pointColor: Highcharts.ColorType,

                // Temporary points that fill groupedPoitns array
                newPoint: Partial<Highcharts.Point>,
                newNextPoint: Partial<Highcharts.Point>;

            // Loop which sort supertrend points
            while (indicPointsLen--) {
                point = indicPoints[indicPointsLen];
                nextPoint = indicPoints[indicPointsLen - 1];
                mainPoint = mainLinePoints[indicPointsLen - 1 + offset];
                nextMainPoint = mainLinePoints[indicPointsLen - 2 + offset];
                prevMainPoint = mainLinePoints[indicPointsLen + offset];
                prevPrevMainPoint = mainLinePoints[indicPointsLen + offset + 1];
                pointColor = (point.options.color as any);
                newPoint = {
                    x: point.x,
                    plotX: point.plotX,
                    plotY: point.plotY,
                    isNull: false
                };

                // When mainPoint is the last one (left plot area edge)
                // but supertrend has additional one
                if (
                    !nextMainPoint &&
                    mainPoint && mainSeries.yData[mainPoint.index - 1]
                ) {
                    nextMainPoint = createPointObj(
                        mainSeries, mainPoint.index - 1, close
                    );
                }

                // When prevMainPoint is the last one (right plot area edge)
                // but supertrend has additional one (and points are shifted)
                if (
                    !prevPrevMainPoint &&
                    prevMainPoint && mainSeries.yData[prevMainPoint.index + 1]
                ) {
                    prevPrevMainPoint = createPointObj(
                        mainSeries, prevMainPoint.index + 1, close
                    );
                }

                // When points are shifted (right or left plot area edge)
                if (
                    !mainPoint &&
                    nextMainPoint && mainSeries.yData[nextMainPoint.index + 1]
                ) {
                    mainPoint = createPointObj(
                        mainSeries, nextMainPoint.index + 1, close
                    );
                } else if (
                    !mainPoint &&
                    prevMainPoint && mainSeries.yData[prevMainPoint.index - 1]
                ) {
                    mainPoint = createPointObj(
                        mainSeries, prevMainPoint.index - 1, close
                    );
                }

                // Check if points are shifted relative to each other
                if (
                    point &&
                    mainPoint &&
                    prevMainPoint &&
                    nextMainPoint &&
                    point.x !== mainPoint.x
                ) {
                    if (point.x === prevMainPoint.x) {
                        nextMainPoint = mainPoint;
                        mainPoint = prevMainPoint;
                    } else if (point.x === nextMainPoint.x) {
                        mainPoint = nextMainPoint;
                        nextMainPoint = ({
                            close: mainSeries.yData[mainPoint.index - 1][close],
                            x: mainSeries.xData[mainPoint.index - 1]
                        } as any);
                    } else if (
                        prevPrevMainPoint && point.x === prevPrevMainPoint.x
                    ) {
                        mainPoint = prevPrevMainPoint;
                        nextMainPoint = prevMainPoint;
                    }
                }

                if (nextPoint && nextMainPoint && mainPoint) {

                    newNextPoint = {
                        x: nextPoint.x,
                        plotX: nextPoint.plotX,
                        plotY: nextPoint.plotY,
                        isNull: false
                    };

                    if (
                        point.y >= mainPoint.close &&
                        nextPoint.y >= nextMainPoint.close
                    ) {
                        point.color = (
                            pointColor || indicOptions.fallingTrendColor ||
                            indicOptions.color
                        );
                        groupedPoitns.top.push(newPoint);

                    } else if (
                        point.y < mainPoint.close &&
                        nextPoint.y < nextMainPoint.close
                    ) {
                        point.color = (
                            pointColor || indicOptions.risingTrendColor ||
                            indicOptions.color
                        );
                        groupedPoitns.bottom.push(newPoint);

                    } else {
                        groupedPoitns.intersect.push(newPoint);
                        groupedPoitns.intersect.push(newNextPoint);

                        // Additional null point to make a gap in line
                        groupedPoitns.intersect.push(merge(newNextPoint, {
                            isNull: true
                        }));

                        if (
                            point.y >= mainPoint.close &&
                            nextPoint.y < nextMainPoint.close
                        ) {
                            point.color = (
                                pointColor || indicOptions.fallingTrendColor ||
                                indicOptions.color
                            );
                            nextPoint.color = (
                                pointColor || indicOptions.risingTrendColor ||
                                indicOptions.color
                            );
                            groupedPoitns.top.push(newPoint);
                            groupedPoitns.top.push(merge(newNextPoint, {
                                isNull: true
                            }));
                        } else if (
                            point.y < mainPoint.close &&
                            nextPoint.y >= nextMainPoint.close
                        ) {
                            point.color = (
                                pointColor || indicOptions.risingTrendColor ||
                                indicOptions.color
                            );
                            nextPoint.color = (
                                pointColor || indicOptions.fallingTrendColor ||
                                indicOptions.color
                            );
                            groupedPoitns.bottom.push(newPoint);
                            groupedPoitns.bottom.push(merge(newNextPoint, {
                                isNull: true
                            }));
                        }
                    }
                } else if (mainPoint) {
                    if (point.y >= mainPoint.close) {
                        point.color = (
                            pointColor || indicOptions.fallingTrendColor ||
                            indicOptions.color
                        );
                        groupedPoitns.top.push(newPoint);
                    } else {
                        point.color = (
                            pointColor || indicOptions.risingTrendColor ||
                            indicOptions.color
                        );
                        groupedPoitns.bottom.push(newPoint);
                    }
                }
            }

            // Generate lines:
            objectEach(groupedPoitns,
                function (
                    values: Array<Highcharts.SupertrendIndicatorPoint>,
                    lineName: string
                ): void {
                    indicator.points = values;
                    indicator.options = merge(
                        (supertrendLineOptions as any)[lineName].styles,
                        gappedExtend
                    );
                    indicator.graph = (indicator as any)[
                        'graph' + lineName + 'Line'
                    ];
                    SMA.prototype.drawGraph.call(indicator);

                    // Now save line
                    (indicator as any)[
                        'graph' + lineName + 'Line'
                    ] = indicator.graph;
                }
            );

            // Restore options:
            indicator.points = indicPoints;
            indicator.options = indicOptions;
            indicator.graph = indicPath;
        },

        // Supertrend (Multiplier, Period) Formula:

        // BASIC UPPERBAND = (HIGH + LOW) / 2 + Multiplier * ATR(Period)
        // BASIC LOWERBAND = (HIGH + LOW) / 2 - Multiplier * ATR(Period)

        // FINAL UPPERBAND =
        //     IF(
        //      Current BASICUPPERBAND  < Previous FINAL UPPERBAND AND
        //      Previous Close > Previous FINAL UPPERBAND
        //     ) THEN (Current BASIC UPPERBAND)
        //     ELSE (Previous FINALUPPERBAND)

        // FINAL LOWERBAND =
        //     IF(
        //      Current BASIC LOWERBAND  > Previous FINAL LOWERBAND AND
        //      Previous Close < Previous FINAL LOWERBAND
        //     ) THEN (Current BASIC LOWERBAND)
        //     ELSE (Previous FINAL LOWERBAND)

        // SUPERTREND =
        //     IF(
        //      Previous Supertrend == Previous FINAL UPPERBAND AND
        //      Current Close < Current FINAL UPPERBAND
        //     ) THAN Current FINAL UPPERBAND
        //     ELSE IF(
        //      Previous Supertrend == Previous FINAL LOWERBAND AND
        //      Current Close < Current FINAL LOWERBAND
        //     ) THAN Current FINAL UPPERBAND
        //     ELSE IF(
        //      Previous Supertrend == Previous FINAL UPPERBAND AND
        //      Current Close > Current FINAL UPPERBAND
        //     ) THAN Current FINAL LOWERBAND
        //     ELSE IF(
        //      Previous Supertrend == Previous FINAL LOWERBAND AND
        //      Current Close > Current FINAL LOWERBAND
        //     ) THAN Current FINAL LOWERBAND


        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.SupertrendIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                multiplier: number = (params.multiplier as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                ATRData: Array<number> = [],
                // 0- date, 1- Supertrend indicator
                ST: Array<Array<(number|undefined)>> = [],
                xData: Array<number> = [],
                yData: Array<(number|undefined)> = [],
                close = 3,
                low = 2,
                high = 1,
                periodsOffset = (period === 0) ? 0 : period - 1,
                basicUp: number,
                basicDown: number,
                finalUp: Array<number> = [],
                finalDown: Array<number> = [],
                supertrend: (number|undefined),
                prevFinalUp: number,
                prevFinalDown: number,
                prevST: (number|undefined), // previous Supertrend
                prevY: Array<number>,
                y: Array<number>,
                i: number;

            if (
                (xVal.length <= period) || !isArray(yVal[0]) ||
                yVal[0].length !== 4 || period < 0
            ) {
                return;
            }

            ATRData = (ATR.prototype.getValues.call(this, series, {
                period: period
            }) as any).yData;

            for (i = 0; i < ATRData.length; i++) {
                y = yVal[periodsOffset + i];
                prevY = yVal[periodsOffset + i - 1] || [];
                prevFinalUp = finalUp[i - 1];
                prevFinalDown = finalDown[i - 1];
                prevST = yData[i - 1];

                if (i === 0) {
                    prevFinalUp = prevFinalDown = prevST = 0;
                }

                basicUp = correctFloat(
                    (y[high] + y[low]) / 2 + multiplier * ATRData[i]
                );
                basicDown = correctFloat(
                    (y[high] + y[low]) / 2 - multiplier * ATRData[i]
                );

                if (
                    (basicUp < prevFinalUp) ||
                    (prevY[close] > prevFinalUp)
                ) {
                    finalUp[i] = basicUp;
                } else {
                    finalUp[i] = prevFinalUp;
                }

                if (
                    (basicDown > prevFinalDown) ||
                    (prevY[close] < prevFinalDown)
                ) {
                    finalDown[i] = basicDown;
                } else {
                    finalDown[i] = prevFinalDown;
                }

                if (prevST === prevFinalUp && y[close] < finalUp[i] ||
                    prevST === prevFinalDown && y[close] < finalDown[i]
                ) {
                    supertrend = finalUp[i];
                } else if (
                    prevST === prevFinalUp && y[close] > finalUp[i] ||
                    prevST === prevFinalDown && y[close] > finalDown[i]
                ) {
                    supertrend = finalDown[i];
                }

                ST.push([xVal[periodsOffset + i], supertrend]);
                xData.push(xVal[periodsOffset + i]);
                yData.push(supertrend);
            }

            return {
                values: ST,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A `Supertrend indicator` series. If the [type](#series.supertrend.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.supertrend
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, cropThreshold, data, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            showInNavigator, stacking, threshold
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/supertrend
 * @apioption series.supertrend
 */

''; // to include the above in the js output
