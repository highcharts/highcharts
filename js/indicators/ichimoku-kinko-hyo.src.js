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
     * @extends {plotOptions.sma}
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
                 * @type {Number}
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
                 * @type {Number}
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
                 * @type {Number}
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
                 * @type {Number}
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
                 * @type {Number}
                 * @since 6.0.0
                 * @product highstock
                 */
                lineColor: undefined
            }
        },
        /**
         * The styles for fill between Senkou Span A and B
         *
         * @since 6.0.0
         * @product highstock
         */
        senkouSpan: {
            styles: {
                /**
                 * Color of the area between Senkou Span A and B.
                 *
                 * @type {Number}
                 * @since 6.0.0
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
                position,
                point,
                i;

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
            }

            // Modify options and generate lines:
            each([
                'tenkanLine',
                'kijunLine',
                'chikouLine',
                'senkouSpanA',
                'senkouSpanB',
                'senkouSpan'
            ], function (lineName, i) {
                // First line is rendered by default option
                indicator.points = allIchimokuPoints[i];
                indicator.options = merge(
                    mainLineOptions[lineName].styles,
                    gappedExtend
                );
                indicator.graph = indicator['graph' + lineName];

                // For span, we need an access to the next points, used in
                // getGraphPath()
                indicator.nextPoints = allIchimokuPoints[i - 1];
                if (i === 5) {

                    indicator.points = allIchimokuPoints[i - 1];
                    indicator.options = merge(
                        mainLineOptions[lineName].styles,
                        gappedExtend
                    );
                    indicator.graph = indicator['graph' + lineName];
                    indicator.nextPoints = allIchimokuPoints[i - 2];

                    indicator.fillGraph = true;
                    indicator.color = indicator.options.fill;
                    SMA.prototype.drawGraph.call(indicator);
                } else {
                    indicator.fillGraph = false;
                    indicator.color = mainColor;
                    SMA.prototype.drawGraph.call(indicator);
                }

                // Now save lines:
                indicator['graph' + lineName] = indicator.graph;
            });
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
