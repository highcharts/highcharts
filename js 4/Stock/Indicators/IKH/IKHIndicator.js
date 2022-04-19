/* *
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
import Color from '../../../Core/Color/Color.js';
var color = Color.parse;
import H from '../../../Core/Globals.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var SMAIndicator = SeriesRegistry.seriesTypes.sma;
import U from '../../../Core/Utilities.js';
var defined = U.defined, extend = U.extend, isArray = U.isArray, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach;
/* eslint-disable require-jsdoc */
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
    var closestDataRange, loopLength, distance, xData, i;
    axis.series.forEach(function (series) {
        if (series.xData) {
            xData = series.xData;
            loopLength = series.xIncrement ? 1 : xData.length - 1;
            for (i = loopLength; i > 0; i--) {
                distance = xData[i] - xData[i - 1];
                if (typeof closestDataRange === 'undefined' ||
                    distance < closestDataRange) {
                    closestDataRange = distance;
                }
            }
        }
    });
    return closestDataRange;
}
// Check two lines intersection (line a1-a2 and b1-b2)
// Source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
function checkLineIntersection(a1, a2, b1, b2) {
    if (a1 && a2 && b1 && b2) {
        var saX = a2.plotX - a1.plotX, // Auxiliary section a2-a1 X
        saY = a2.plotY - a1.plotY, // Auxiliary section a2-a1 Y
        sbX = b2.plotX - b1.plotX, // Auxiliary section b2-b1 X
        sbY = b2.plotY - b1.plotY, // Auxiliary section b2-b1 Y
        sabX = a1.plotX - b1.plotX, // Auxiliary section a1-b1 X
        sabY = a1.plotY - b1.plotY, // Auxiliary section a1-b1 Y
        // First degree Bézier parameters
        u = void 0, t = void 0;
        u = (-saY * sabX + saX * sabY) / (-sbX * saY + saX * sbY);
        t = (sbX * sabY - sbY * sabX) / (-sbX * saY + saX * sbY);
        if (u >= 0 && u <= 1 && t >= 0 && t <= 1) {
            return {
                plotX: a1.plotX + t * saX,
                plotY: a1.plotY + t * saY
            };
        }
    }
    return false;
}
// Parameter opt (indicator options object) include indicator, points,
// nextPoints, color, options, gappedExtend and graph properties
function drawSenkouSpan(opt) {
    var indicator = opt.indicator;
    indicator.points = opt.points;
    indicator.nextPoints = opt.nextPoints;
    indicator.color = opt.color;
    indicator.options = merge(opt.options.senkouSpan.styles, opt.gap);
    indicator.graph = opt.graph;
    indicator.fillGraph = true;
    SeriesRegistry.seriesTypes.sma.prototype.drawGraph.call(indicator);
}
// Data integrity in Ichimoku is different than default 'averages':
// Point: [undefined, value, value, ...] is correct
// Point: [undefined, undefined, undefined, ...] is incorrect
H.approximations['ichimoku-averages'] = function () {
    var ret = [], isEmptyRange;
    [].forEach.call(arguments, function (arr, i) {
        ret.push(H.approximations.average(arr));
        isEmptyRange = !isEmptyRange && typeof ret[i] === 'undefined';
    });
    // Return undefined when first elem. is undefined and let
    // sum method handle null (#7377)
    return isEmptyRange ? void 0 : ret;
};
/* eslint-enable require-jsdoc */
/**
 * The IKH series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ikh
 *
 * @augments Highcharts.Series
 */
/* *
*
* Class
*
* */
var IKHIndicator = /** @class */ (function (_super) {
    __extends(IKHIndicator, _super);
    function IKHIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
        *
        *  Properties
        *
        * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.graphCollection = void 0;
        _this.graphsenkouSpan = void 0;
        _this.ikhMap = void 0;
        _this.nextPoints = void 0;
        return _this;
    }
    /* *
    *
    * Functions
    *
    * */
    IKHIndicator.prototype.init = function () {
        SeriesRegistry.seriesTypes.sma.prototype.init.apply(this, arguments);
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
    };
    IKHIndicator.prototype.toYData = function (point) {
        return [
            point.tenkanSen,
            point.kijunSen,
            point.chikouSpan,
            point.senkouSpanA,
            point.senkouSpanB
        ];
    };
    IKHIndicator.prototype.translate = function () {
        var indicator = this;
        SeriesRegistry.seriesTypes.sma.prototype.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            indicator.pointArrayMap.forEach(function (key) {
                var pointValue = point[key];
                if (isNumber(pointValue)) {
                    point['plot' + key] = indicator.yAxis.toPixels(pointValue, true);
                    // Add extra parameters for support tooltip in moved
                    // lines
                    point.plotY = point['plot' + key];
                    point.tooltipPos = [
                        point.plotX,
                        point['plot' + key]
                    ];
                    point.isNull = false;
                }
            });
        });
    };
    IKHIndicator.prototype.drawGraph = function () {
        var indicator = this, mainLinePoints = indicator.points, pointsLength = mainLinePoints.length, mainLineOptions = indicator.options, mainLinePath = indicator.graph, mainColor = indicator.color, gappedExtend = {
            options: {
                gapSize: mainLineOptions.gapSize
            }
        }, pointArrayMapLength = indicator.pointArrayMap.length, allIchimokuPoints = [
            [],
            [],
            [],
            [],
            [],
            []
        ], ikhMap = {
            tenkanLine: allIchimokuPoints[0],
            kijunLine: allIchimokuPoints[1],
            chikouLine: allIchimokuPoints[2],
            senkouSpanA: allIchimokuPoints[3],
            senkouSpanB: allIchimokuPoints[4],
            senkouSpan: allIchimokuPoints[5]
        }, intersectIndexColl = [], senkouSpanOptions = indicator
            .options.senkouSpan, color = senkouSpanOptions.color ||
            senkouSpanOptions.styles.fill, negativeColor = senkouSpanOptions.negativeColor, 
        // Points to create color and negativeColor senkouSpan
        points = [
            [],
            [] // Points negative color
        ], 
        // For span, we need an access to the next points, used in
        // getGraphPath()
        nextPoints = [
            [],
            [] // NextPoints negative color
        ], lineIndex = 0, position, point, i, startIntersect, endIntersect, sectionPoints, sectionNextPoints, pointsPlotYSum, nextPointsPlotYSum, senkouSpanTempColor, concatArrIndex, j, k;
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
            if (negativeColor && pointsLength !== mainLinePoints.length - 1) {
                // Check if lines intersect
                var index = ikhMap.senkouSpanB.length - 1, intersect = checkLineIntersection(ikhMap.senkouSpanA[index - 1], ikhMap.senkouSpanA[index], ikhMap.senkouSpanB[index - 1], ikhMap.senkouSpanB[index]), intersectPointObj = {
                    plotX: intersect.plotX,
                    plotY: intersect.plotY,
                    isNull: false,
                    intersectPoint: true
                };
                if (intersect) {
                    // Add intersect point to ichimoku points collection
                    // Create senkouSpan sections
                    ikhMap.senkouSpanA.splice(index, 0, intersectPointObj);
                    ikhMap.senkouSpanB.splice(index, 0, intersectPointObj);
                    intersectIndexColl.push(index);
                }
            }
        }
        // Modify options and generate lines:
        objectEach(ikhMap, function (values, lineName) {
            if (mainLineOptions[lineName] &&
                lineName !== 'senkouSpan') {
                // First line is rendered by default option
                indicator.points = allIchimokuPoints[lineIndex];
                indicator.options = merge(mainLineOptions[lineName].styles, gappedExtend);
                indicator.graph = indicator['graph' + lineName];
                indicator.fillGraph = false;
                indicator.color = mainColor;
                SeriesRegistry.seriesTypes.sma.prototype.drawGraph.call(indicator);
                // Now save line
                indicator['graph' + lineName] = indicator.graph;
            }
            lineIndex++;
        });
        // Generate senkouSpan area:
        // If graphColection exist then remove svg
        // element and indicator property
        if (indicator.graphCollection) {
            indicator.graphCollection.forEach(function (graphName) {
                indicator[graphName].destroy();
                delete indicator[graphName];
            });
        }
        // Clean grapCollection or initialize it
        indicator.graphCollection = [];
        // When user set negativeColor property
        if (negativeColor && ikhMap.senkouSpanA[0] && ikhMap.senkouSpanB[0]) {
            // Add first and last point to senkouSpan area sections
            intersectIndexColl.unshift(0);
            intersectIndexColl.push(ikhMap.senkouSpanA.length - 1);
            // Populate points and nextPoints arrays
            for (j = 0; j < intersectIndexColl.length - 1; j++) {
                startIntersect = intersectIndexColl[j];
                endIntersect = intersectIndexColl[j + 1];
                sectionPoints = ikhMap.senkouSpanB.slice(startIntersect, endIntersect + 1);
                sectionNextPoints = ikhMap.senkouSpanA.slice(startIntersect, endIntersect + 1);
                // Add points to color or negativeColor arrays
                // Check the middle point (if exist)
                if (Math.floor(sectionPoints.length / 2) >= 1) {
                    var x = Math.floor(sectionPoints.length / 2);
                    // When middle points has equal values
                    // Compare all ponints plotY value sum
                    if (sectionPoints[x].plotY === sectionNextPoints[x].plotY) {
                        pointsPlotYSum = 0;
                        nextPointsPlotYSum = 0;
                        for (k = 0; k < sectionPoints.length; k++) {
                            pointsPlotYSum += sectionPoints[k].plotY;
                            nextPointsPlotYSum += sectionNextPoints[k].plotY;
                        }
                        concatArrIndex =
                            pointsPlotYSum > nextPointsPlotYSum ? 0 : 1;
                        points[concatArrIndex] = points[concatArrIndex].concat(sectionPoints);
                        nextPoints[concatArrIndex] = nextPoints[concatArrIndex].concat(sectionNextPoints);
                    }
                    else {
                        // Compare middle point of the section
                        concatArrIndex = (sectionPoints[x].plotY > sectionNextPoints[x].plotY) ? 0 : 1;
                        points[concatArrIndex] = points[concatArrIndex].concat(sectionPoints);
                        nextPoints[concatArrIndex] = nextPoints[concatArrIndex].concat(sectionNextPoints);
                    }
                }
                else {
                    // Compare first point of the section
                    concatArrIndex = (sectionPoints[0].plotY > sectionNextPoints[0].plotY) ? 0 : 1;
                    points[concatArrIndex] = points[concatArrIndex].concat(sectionPoints);
                    nextPoints[concatArrIndex] = nextPoints[concatArrIndex].concat(sectionNextPoints);
                }
            }
            // Render color and negativeColor paths
            ['graphsenkouSpanColor', 'graphsenkouSpanNegativeColor'].forEach(function (areaName, i) {
                if (points[i].length && nextPoints[i].length) {
                    senkouSpanTempColor = i === 0 ? color : negativeColor;
                    drawSenkouSpan({
                        indicator: indicator,
                        points: points[i],
                        nextPoints: nextPoints[i],
                        color: senkouSpanTempColor,
                        options: mainLineOptions,
                        gap: gappedExtend,
                        graph: indicator[areaName]
                    });
                    // Now save line
                    indicator[areaName] = indicator.graph;
                    indicator.graphCollection.push(areaName);
                }
            });
        }
        else {
            // When user set only senkouSpan style.fill property
            drawSenkouSpan({
                indicator: indicator,
                points: ikhMap.senkouSpanB,
                nextPoints: ikhMap.senkouSpanA,
                color: color,
                options: mainLineOptions,
                gap: gappedExtend,
                graph: indicator.graphsenkouSpan
            });
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
        indicator.color = mainColor;
    };
    IKHIndicator.prototype.getGraphPath = function (points) {
        var indicator = this, path = [], spanA, spanAarr = [];
        points = points || this.points;
        // Render Senkou Span
        if (indicator.fillGraph && indicator.nextPoints) {
            spanA = SeriesRegistry.seriesTypes.sma.prototype.getGraphPath.call(indicator, 
            // Reverse points, so Senkou Span A will start from the end:
            indicator.nextPoints);
            if (spanA && spanA.length) {
                spanA[0][0] = 'L';
                path = SeriesRegistry.seriesTypes.sma.prototype.getGraphPath
                    .call(indicator, points);
                spanAarr = spanA.slice(0, path.length);
                for (var i = spanAarr.length - 1; i >= 0; i--) {
                    path.push(spanAarr[i]);
                }
            }
        }
        else {
            path = SeriesRegistry.seriesTypes.sma.prototype.getGraphPath
                .apply(indicator, arguments);
        }
        return path;
    };
    IKHIndicator.prototype.getValues = function (series, params) {
        var period = params.period, periodTenkan = params.periodTenkan, periodSenkouSpanB = params.periodSenkouSpanB, xVal = series.xData, yVal = series.yData, xAxis = series.xAxis, yValLen = (yVal && yVal.length) || 0, closestPointRange = getClosestPointRange(xAxis), IKH = [], xData = [], dateStart, date, slicedTSY, slicedKSY, slicedSSBY, pointTS, pointKS, pointSSB, i, TS, KS, CS, SSA, SSB;
        // Ikh requires close value
        if (xVal.length <= period ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4) {
            return;
        }
        // Add timestamps at the beginning
        dateStart = xVal[0] - period * closestPointRange;
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
            CS = yVal[i][3];
            date = xVal[i];
            if (typeof IKH[i] === 'undefined') {
                IKH[i] = [];
            }
            if (typeof IKH[i + period] === 'undefined') {
                IKH[i + period] = [];
            }
            IKH[i + period][0] = TS;
            IKH[i + period][1] = KS;
            IKH[i + period][2] = void 0;
            IKH[i][2] = CS;
            if (i <= period) {
                IKH[i + period][3] = void 0;
                IKH[i + period][4] = void 0;
            }
            if (typeof IKH[i + 2 * period] === 'undefined') {
                IKH[i + 2 * period] = [];
            }
            IKH[i + 2 * period][3] = SSA;
            IKH[i + 2 * period][4] = SSB;
            xData.push(date);
        }
        // Add timestamps for further points
        for (i = 1; i <= period; i++) {
            xData.push(date + i * closestPointRange);
        }
        return {
            values: IKH,
            xData: xData,
            yData: IKH
        };
    };
    /**
     * Ichimoku Kinko Hyo (IKH). This series requires `linkedTo` option to be
     * set.
     *
     * @sample stock/indicators/ichimoku-kinko-hyo
     *         Ichimoku Kinko Hyo indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ichimoku-kinko-hyo
     * @optionparent plotOptions.ikh
     */
    IKHIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding index
         */
        params: {
            index: void 0,
            period: 26,
            /**
             * The base period for Tenkan calculations.
             */
            periodTenkan: 9,
            /**
             * The base period for Senkou Span B calculations
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
         */
        tenkanLine: {
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
                lineColor: void 0
            }
        },
        /**
         * The styles for Kijun line
         */
        kijunLine: {
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
                lineColor: void 0
            }
        },
        /**
         * The styles for Chikou line
         */
        chikouLine: {
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
                lineColor: void 0
            }
        },
        /**
         * The styles for Senkou Span A line
         */
        senkouSpanA: {
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
                lineColor: void 0
            }
        },
        /**
         * The styles for Senkou Span B line
         */
        senkouSpanB: {
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
                lineColor: void 0
            }
        },
        /**
         * The styles for area between Senkou Span A and B.
         */
        senkouSpan: {
            /**
             * Color of the area between Senkou Span A and B,
             * when Senkou Span A is above Senkou Span B. Note that if
             * a `style.fill` is defined, the `color` takes precedence and
             * the `style.fill` is ignored.
             *
             * @see [senkouSpan.styles.fill](#series.ikh.senkouSpan.styles.fill)
             *
             * @sample stock/indicators/ichimoku-kinko-hyo
             *         Ichimoku Kinko Hyo color
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     7.0.0
             * @apioption plotOptions.ikh.senkouSpan.color
             */
            /**
             * Color of the area between Senkou Span A and B,
             * when Senkou Span A is under Senkou Span B.
             *
             * @sample stock/indicators/ikh-negative-color
             *         Ichimoku Kinko Hyo negativeColor
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     7.0.0
             * @apioption plotOptions.ikh.senkouSpan.negativeColor
             */
            styles: {
                /**
                 * Color of the area between Senkou Span A and B.
                 *
                 * @deprecated
                 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 */
                fill: 'rgba(255, 0, 0, 0.5)'
            }
        },
        dataGrouping: {
            approximation: 'ichimoku-averages'
        }
    });
    return IKHIndicator;
}(SMAIndicator));
extend(IKHIndicator.prototype, {
    pointArrayMap: [
        'tenkanSen',
        'kijunSen',
        'chikouSpan',
        'senkouSpanA',
        'senkouSpanB'
    ],
    pointValKey: 'tenkanSen',
    nameComponents: ['periodSenkouSpanB', 'period', 'periodTenkan']
});
SeriesRegistry.registerSeriesType('ikh', IKHIndicator);
export default IKHIndicator;
/**
 * A `IKH` series. If the [type](#series.ikh.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ikh
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ichimoku-kinko-hyo
 * @apioption series.ikh
 */
(''); // add doclet above to transpiled file
