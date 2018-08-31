'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var UNDEFINED,
    seriesType = H.seriesType,
    each = H.each,
    merge = H.merge,
    color = H.color,
    isArray = H.isArray,
    defined = H.defined,
    SMA = H.seriesTypes.sma;

// Utils:
function maxHigh(arr) {
    return arr.reduce(function (max, res) {
        return Math.max(max, res[1]);
    }, -Infinity);
}

function minLow(arr) {
    return arr.reduce(function (min, res) {
        return Math.min(min, res[2]);
    }, Infinity);
}

function highlowLevel(arr) {
    return {
        high: maxHigh(arr),
        low: minLow(arr)
    };
}

function getClosestPointRange(axis) {
    var closestDataRange,
        loopLength,
        distance,
        xData,
        i;

    each(axis.series, function (series) {

        if (series.xData) {
            xData = series.xData;
            loopLength = series.xIncrement ? 1 : xData.length - 1;

            for (i = loopLength; i > 0; i--) {
                distance = xData[i] - xData[i - 1];
                if (
                    closestDataRange === UNDEFINED ||
                    distance < closestDataRange
                ) {
                    closestDataRange = distance;
                }
            }
        }
    });

    return closestDataRange;
}

// check two lines intersection (line a1-a2 and b1-b2)
// source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
function checkLineIntersection(a1, a2, b1, b2) {
    if (a1 && a2 && b1 && b2) {

        var saX = a2.plotX - a1.plotX,
            saY = a2.plotY - a1.plotY,
            sbX = b2.plotX - b1.plotX,
            sbY = b2.plotY - b1.plotY,
            sabX = a1.plotX - b1.plotX,
            sabY = a1.plotY - b1.plotY,
            u,
            t;

        u = (-saY * sabX + saX * sabY) / (-sbX * saY + saX * sbY);
        t = (sbX * sabY - sbY * sabX) / (-sbX * saY + saX * sbY);

        if (u >= 0 && u <= 1 && t >= 0 && t <= 1) {
            return {
                plotX: a1.plotX + (t * saX),
                plotY: a1.plotY + (t * saY)
            };
        }
    }

    return false;
}

// Data integrity in Ichimoku is different than default "averages":
// Point: [undefined, value, value, ...] is correct
// Point: [undefined, undefined, undefined, ...] is incorrect
H.approximations['ichimoku-averages'] = function () {
    var ret = [],
        isEmptyRange;

    each(arguments, function (arr, i) {
        ret.push(H.approximations.average(arr));
        isEmptyRange = !isEmptyRange && ret[i] === undefined;
    });

    // Return undefined when first elem. is undefined and let
    // sum method handle null (#7377)
    return isEmptyRange ? undefined : ret;
};

/**
 * The IKH series type.
 *
 * @constructor seriesTypes.ikh
 * @augments seriesTypes.sma
 */
seriesType('ikh', 'sma',
    /**
     * Ichimoku Kinko Hyo (IKH). This series requires `linkedTo` option to be
     * set.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/ichimoku-kinko-hyo
     *                        Ichimoku Kinko Hyo indicator
     * @since 6.0.0
     * @excluding
     *             allAreas,colorAxis,compare,compareBase,joinBy,keys,stacking,
     *             showInNavigator,navigatorOptions,pointInterval,
     *             pointIntervalUnit,pointPlacement,pointRange,pointStart
     * @optionparent plotOptions.ikh
     */
    {
        params: {
            period: 26,
            /**
             * The base period for Tenkan calculations.
             *
             * @type {Number}
             * @since 6.0.0
             * @product highstock
             */
            periodTenkan: 9,
            /**
             * The base period for Senkou Span B calculations
             *
             * @type {Number}
             * @since 6.0.0
             * @product highstock
             */
            periodSenkouSpanB: 52
        },
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
                'TENKAN SEN: {point.tenkanSen:.3f}<br/>' +
                'KIJUN SEN: {point.kijunSen:.3f}<br/>' +
                'CHIKOU SPAN: {point.chikouSpan:.3f}<br/>' +
                'SENKOU SPAN A: {point.senkouSpanA:.3f}<br/>' +
                'SENKOU SPAN B: {point.senkouSpanB:.3f}<br/>'
        },
        /**
         * The styles for Tenkan line
         *
         * @since 6.0.0
         * @product highstock
         */
        tenkanLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * The styles for Kijun line
         *
         * @since 6.0.0
         * @product highstock
         */
        kijunLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * The styles for Chikou line
         *
         * @since 6.0.0
         * @product highstock
         */
        chikouLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * The styles for Senkou Span A line
         *
         * @since 6.0.0
         * @product highstock
         */
        senkouSpanA: {
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * The styles for Senkou Span B line
         *
         * @since 6.0.0
         * @product highstock
         */
        senkouSpanB: {
            styles: {
                /**
                 * Pixel width of the line.
                 *
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineWidth: 1,
                /**
                 * Color of the line.
                 *
                 * @type {Highcharts.ColorString}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * The styles for area between Senkou Span A and B
         *
         * @since 6.0.0
         * @product highstock
         */
        senkouSpan: {
            /**
            * Color of the area between Senkou Span A and B,
            * when Senkou Span A is above Senkou Span B. Note that if
            * a `style.fill` is defined, the `color` takes precedence and
            * the `style.fill` is ignored.
            *
            * @type {Highcharts.ColorString}
            * @since next
            * @product highstock
            * @apioption plotOptions.ikh.senkouSpan.color
            * @default undefined
            * @see [senkouSpan.styles.fill](#series.ikh.senkouSpan.styles.fill)
            */

            /**
            * Color of the area between Senkou Span A and B,
            * when Senkou Span A is under Senkou Span B.
            *
            * @type {Highcharts.ColorString}
            * @since next
            * @product highstock
            * @apioption plotOptions.ikh.senkouSpan.negativeColor
            * @default undefined
            */
            styles: {
                /**
                 * Color of the area between Senkou Span A and B.
                 *
                 * @type {Highcharts.ColorString}
                 * @since 6.0.0
                 * @deprecated
                 * @product highstock
                 */
                fill: 'rgba(255, 0, 0, 0.5)'
            }
        },
        dataGrouping: {
            approximation: 'ichimoku-averages'
        }
    }, {
        pointArrayMap: [
            'tenkanSen',
            'kijunSen',
            'chikouSpan',
            'senkouSpanA',
            'senkouSpanB'
        ],
        pointValKey: 'tenkanSen',
        nameComponents: ['periodSenkouSpanB', 'period', 'periodTenkan'],
        init: function () {
            SMA.prototype.init.apply(this, arguments);

            // Set default color for lines:
            this.options = merge({
                tenkanLine: {
                    styles: {
                        lineColor: this.color
                    }
                },
                kijunLine: {
                    styles: {
                        lineColor: this.color
                    }
                },
                chikouLine: {
                    styles: {
                        lineColor: this.color
                    }
                },
                senkouSpanA: {
                    styles: {
                        lineColor: this.color,
                        fill: color(this.color).setOpacity(0.5).get()
                    }
                },
                senkouSpanB: {
                    styles: {
                        lineColor: this.color,
                        fill: color(this.color).setOpacity(0.5).get()
                    }
                },
                senkouSpan: {
                    styles: {
                        fill: color(this.color).setOpacity(0.2).get()
                    }
                }
            }, this.options);
        },
        toYData: function (point) {
            return [
                point.tenkanSen,
                point.kijunSen,
                point.chikouSpan,
                point.senkouSpanA,
                point.senkouSpanB
            ];
        },
        translate: function () {
            var indicator = this;

            SMA.prototype.translate.apply(indicator);

            each(indicator.points, function (point) {
                each(indicator.pointArrayMap, function (value) {
                    if (defined(point[value])) {
                        point['plot' + value] = indicator.yAxis.toPixels(
                            point[value],
                            true
                        );

                        // add extra parameters for support tooltip in moved
                        // lines
                        point.plotY = point['plot' + value];
                        point.tooltipPos = [point.plotX, point['plot' + value]];
                        point.isNull = false;
                    }
                });
            });
        },
        // One does not simply
        // Render five lines
        // And an arearange
        // In just one series..
        drawGraph: function () {

            var indicator = this,
                mainLinePoints = indicator.points,
                pointsLength = mainLinePoints.length,
                mainLineOptions = indicator.options,
                mainLinePath = indicator.graph,
                mainColor = indicator.color,
                gappedExtend = {
                    options: {
                        gapSize: mainLineOptions.gapSize
                    }
                },
                pointArrayMapLength = indicator.pointArrayMap.length,
                allIchimokuPoints = [[], [], [], [], [], []],
                ikhMap = {
                    tenkanLine: allIchimokuPoints[0],
                    kijunLine: allIchimokuPoints[1],
                    chikouLine: allIchimokuPoints[2],
                    senkouSpanA: allIchimokuPoints[3],
                    senkouSpanB: allIchimokuPoints[4],
                    senkouSpan: allIchimokuPoints[5]
                },
                intersectIndexColl = [],
                senkouSpanOptions = indicator.options.senkouSpan,
                color = senkouSpanOptions.color ||
                    senkouSpanOptions.styles.fill,
                negativeColor = senkouSpanOptions.negativeColor,

                // points to create color and negativeColor senkouSpan
                points = [
                    [], // points color
                    [] // points negative color
                ],
                // For span, we need an access to the next points, used in
                // getGraphPath()
                nextPoints = [
                    [], // nextPoints color
                    [] // nextPoints negative color
                ],
                position,
                point,
                i,
                startIntersect,
                endIntersect,
                sectionPoints,
                sectionNextPoints,
                pointsPlotYSum,
                nextPointsPlotYSum,
                j,
                k;

            indicator.ikhMap = ikhMap;

            // Generate points for all lines and spans lines:
            while (pointsLength--) {
                point = mainLinePoints[pointsLength];
                for (i = 0; i < pointArrayMapLength; i++) {
                    position = indicator.pointArrayMap[i];

                    if (defined(point[position])) {
                        allIchimokuPoints[i].push({
                            plotX: point.plotX,
                            plotY: point['plot' + position],
                            isNull: false
                        });
                    }
                }

                if (negativeColor &&
                    pointsLength !== mainLinePoints.length - 1) {
                    // check if lines intersect
                    var index = ikhMap.senkouSpanB.length - 1,
                        intersect = checkLineIntersection(
                          ikhMap.senkouSpanA[index - 1],
                          ikhMap.senkouSpanA[index],
                          ikhMap.senkouSpanB[index - 1],
                          ikhMap.senkouSpanB[index]
                        );

                    if (intersect) {
                        // add intersect point to ichimoku points collection
                        // create senkouSpan sections
                        ikhMap.senkouSpanA.splice(index, 0, {
                            plotX: intersect.plotX,
                            plotY: intersect.plotY,
                            isNull: false,
                            intersectPoint: true
                        });

                        ikhMap.senkouSpanB.splice(index, 0, {
                            plotX: intersect.plotX,
                            plotY: intersect.plotY,
                            isNull: false,
                            intersectPoint: true
                        });

                        intersectIndexColl.push(index);
                    }
                }
            }

            // Modify options and generate lines:
            each(H.keys(ikhMap), function (lineName, i) {
                if (mainLineOptions[lineName] && lineName !== 'senkouSpan') {
                    // First line is rendered by default option
                    indicator.points = allIchimokuPoints[i];
                    indicator.options = merge(
                      mainLineOptions[lineName].styles,
                      gappedExtend
                    );
                    indicator.graph = indicator['graph' + lineName];

                    indicator.fillGraph = false;
                    indicator.color = mainColor;
                    SMA.prototype.drawGraph.call(indicator);

                    // Now save line
                    indicator['graph' + lineName] = indicator.graph;
                }
            });

            // Generate senkouSpan area:

            // if graphColection exist then remove svg
            // element and indicator property
            if (indicator.graphCollection) {
                each(indicator.graphCollection, function (graphName) {
                    indicator[graphName].element.remove();
                    delete indicator[graphName];
                });
            }

            // clean grapCollection or initialize it
            indicator.graphCollection = [];

            // when user set negativeColor property
            if (
                negativeColor &&
                ikhMap.senkouSpanA[0] &&
                ikhMap.senkouSpanB[0]) {

                // add first and last point to senkouSpan area sections
                intersectIndexColl.unshift(0);
                intersectIndexColl.push(ikhMap.senkouSpanA.length - 1);

                // populate points and nextPoints arrays
                for (j = 0; j < intersectIndexColl.length - 1; j++) {
                    startIntersect = intersectIndexColl[j];
                    endIntersect = intersectIndexColl[j + 1];

                    sectionPoints = ikhMap.senkouSpanB.slice(
                        startIntersect, endIntersect + 1
                    );

                    sectionNextPoints = ikhMap.senkouSpanA.slice(
                        startIntersect, endIntersect + 1
                    );

                    // add points to color or negativeColor arrays
                    // check the middle point (if exist)
                    if (Math.floor(sectionPoints.length / 2) >= 1) {
                        var x = Math.floor(sectionPoints.length / 2);

                        // when middle points has equal values
                        // compare all ponints plotY value sum
                        if (
                            sectionPoints[x].plotY ===
                            sectionNextPoints[x].plotY
                        ) {

                            pointsPlotYSum = 0;
                            nextPointsPlotYSum = 0;

                            for (k = 0; k < sectionPoints.length; k++) {
                                pointsPlotYSum +=
                                sectionPoints[k].plotY;
                                nextPointsPlotYSum +=
                                sectionNextPoints[k].plotY;
                            }

                            if (pointsPlotYSum > nextPointsPlotYSum) {
                                points[0] = points[0].concat(sectionPoints);
                                nextPoints[0] =
                                    nextPoints[0].concat(sectionNextPoints);
                            } else {
                                points[1] = points[1].concat(sectionPoints);
                                nextPoints[1] =
                                    nextPoints[1].concat(sectionNextPoints);
                            }

                        } else {
                            // compare middle point of the section
                            if (
                                sectionPoints[x].plotY >
                                sectionNextPoints[x].plotY
                            ) {
                                points[0] = points[0].concat(sectionPoints);
                                nextPoints[0] =
                                    nextPoints[0].concat(sectionNextPoints);
                            } else {
                                points[1] = points[1].concat(sectionPoints);
                                nextPoints[1] =
                                    nextPoints[1].concat(sectionNextPoints);
                            }
                        }
                    } else {
                        // compare first point of the section
                        if (sectionPoints[0].plotY >
                            sectionNextPoints[0].plotY
                        ) {
                            points[0] = points[0].concat(sectionPoints);
                            nextPoints[0] =
                                nextPoints[0].concat(sectionNextPoints);
                        } else {
                            points[1] = points[1].concat(sectionPoints);
                            nextPoints[1] =
                                nextPoints[1].concat(sectionNextPoints);
                        }
                    }
                }

                // render color and negativeColor paths
                each(['graphsenkouSpanColor', 'graphsenkouSpanNegativeColor'],
                    function (areaName, i) {
                        if (points[i].length && nextPoints[i].length) {
                            indicator.points = points[i];
                            indicator.nextPoints = nextPoints[i];
                            indicator.color = (i === 0) ?
                                color :
                                negativeColor;

                            indicator.options = H.merge(
                                mainLineOptions.senkouSpan.styles,
                                gappedExtend
                            );
                            indicator.graph = indicator[areaName];
                            indicator.fillGraph = true;

                            SMA.prototype.drawGraph.call(indicator);

                            // Now save line
                            indicator[areaName] = indicator.graph;
                            indicator.graphCollection.push(areaName);
                        }
                    });

            } else {
                // when user set only senkouSpan style.fill property
                indicator.points = ikhMap.senkouSpanB;
                indicator.options = merge(
                    mainLineOptions.senkouSpan.styles,
                    gappedExtend
                );
                indicator.graph = indicator.graphsenkouSpan;
                indicator.nextPoints = ikhMap.senkouSpanA;

                indicator.fillGraph = true;
                indicator.color = color;
                SMA.prototype.drawGraph.call(indicator);

                // Now save line
                indicator.graphsenkouSpan = indicator.graph;
            }

            // Clean temporary properties:
            delete indicator.nextPoints;
            delete indicator.fillGraph;

            // Restore options and draw the Tenkan line:
            indicator.points = mainLinePoints;
            indicator.options = mainLineOptions;
            indicator.graph = mainLinePath;
        },
        getGraphPath: function (points) {
            var indicator = this,
                path = [],
                spanA,
                fillArray = [],
                spanAarr = [];

            points = points || this.points;


            // Render Senkou Span
            if (indicator.fillGraph && indicator.nextPoints) {

                spanA = SMA.prototype.getGraphPath.call(
                    indicator,
                    // Reverse points, so Senkou Span A will start from the end:
                    indicator.nextPoints
                );

                spanA[0] = 'L';

                path = SMA.prototype.getGraphPath.call(
                        indicator,
                        points
                    );

                spanAarr = spanA.slice(0, path.length);

                for (var i = (spanAarr.length - 1); i > 0; i -= 3) {
                    fillArray.push(
                        spanAarr[i - 2],
                        spanAarr[i - 1],
                        spanAarr[i]
                    );
                }
                path = path.concat(fillArray);

            } else {
                path = SMA.prototype.getGraphPath.apply(indicator, arguments);
            }

            return path;
        },
        getValues: function (series, params) {

            var period = params.period,
                periodTenkan = params.periodTenkan,
                periodSenkouSpanB = params.periodSenkouSpanB,
                xVal = series.xData,
                yVal = series.yData,
                xAxis = series.xAxis,
                yValLen = (yVal && yVal.length) || 0,
                closestPointRange = getClosestPointRange(xAxis),
                IKH = [],
                xData = [],
                dateStart,
                date,
                slicedTSY,
                slicedKSY,
                slicedSSBY,
                pointTS,
                pointKS,
                pointSSB,
                i,
                TS,
                KS,
                CS,
                SSA,
                SSB;

            // ikh requires close value
            if (
                xVal.length <= period ||
                !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return false;
            }


            // add timestamps at the beginning
            dateStart = xVal[0] - (period * closestPointRange);

            for (i = 0; i < period; i++) {
                xData.push(dateStart + i * closestPointRange);
            }

            for (i = 0; i < yValLen; i++) {

                // Tenkan Sen
                if (i >= periodTenkan) {

                    slicedTSY = yVal.slice(i - periodTenkan, i);

                    pointTS = highlowLevel(slicedTSY);

                    TS = (pointTS.high + pointTS.low) / 2;
                }

                if (i >= period) {

                    slicedKSY = yVal.slice(i - period, i);

                    pointKS = highlowLevel(slicedKSY);

                    KS = (pointKS.high + pointKS.low) / 2;

                    SSA = (TS + KS) / 2;
                }

                if (i >= periodSenkouSpanB) {

                    slicedSSBY = yVal.slice(i - periodSenkouSpanB, i);

                    pointSSB = highlowLevel(slicedSSBY);

                    SSB = (pointSSB.high + pointSSB.low) / 2;
                }

                CS = yVal[i][0];

                date = xVal[i];

                if (IKH[i] === UNDEFINED) {
                    IKH[i] = [];
                }

                if (IKH[i + period] === UNDEFINED) {
                    IKH[i + period] = [];
                }

                IKH[i + period][0] = TS;
                IKH[i + period][1] = KS;
                IKH[i + period][2] = UNDEFINED;

                if (i >= period) {
                    IKH[i - period][2] = CS;
                } else {
                    IKH[i + period][3] = UNDEFINED;
                    IKH[i + period][4] = UNDEFINED;
                }

                if (IKH[i + 2 * period] === UNDEFINED) {
                    IKH[i + 2 * period] = [];
                }

                IKH[i + 2 * period][3] = SSA;
                IKH[i + 2 * period][4] = SSB;

                xData.push(date);

            }

            // add timestamps for further points
            for (i = 1; i <= period; i++) {
                xData.push(date + i * closestPointRange);
            }

            return {
                values: IKH,
                xData: xData,
                yData: IKH
            };
        }
    });
/**
 * A `IKH` series. If the [type](#series.ikh.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.ikh
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.ikh
 */

/**
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.ikh.data
 */
