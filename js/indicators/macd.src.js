/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var correctFloat = U.correctFloat, defined = U.defined;
var seriesType = H.seriesType, noop = H.noop, merge = H.merge, SMA = H.seriesTypes.sma, EMA = H.seriesTypes.ema;
/**
 * The MACD series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.macd
 *
 * @augments Highcharts.Series
 */
seriesType('macd', 'sma', 
/**
 * Moving Average Convergence Divergence (MACD). This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
 *
 * @sample stock/indicators/macd
 *         MACD indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/macd
 * @optionparent plotOptions.macd
 */
{
    params: {
        /**
         * The short period for indicator calculations.
         */
        shortPeriod: 12,
        /**
         * The long period for indicator calculations.
         */
        longPeriod: 26,
        /**
         * The base period for signal calculations.
         */
        signalPeriod: 9,
        period: 26
    },
    /**
     * The styles for signal line
     */
    signalLine: {
        /**
         * @sample stock/indicators/macd-zones
         *         Zones in MACD
         *
         * @extends plotOptions.macd.zones
         */
        zones: [],
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type  {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    /**
     * The styles for macd line
     */
    macdLine: {
        /**
         * @sample stock/indicators/macd-zones
         *         Zones in MACD
         *
         * @extends plotOptions.macd.zones
         */
        zones: [],
        styles: {
            /**
             * Pixel width of the line.
             */
            lineWidth: 1,
            /**
             * Color of the line.
             *
             * @type  {Highcharts.ColorString}
             */
            lineColor: void 0
        }
    },
    threshold: 0,
    groupPadding: 0.1,
    pointPadding: 0.1,
    states: {
        hover: {
            halo: {
                size: 0
            }
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
            'Value: {point.MACD}<br/>' +
            'Signal: {point.signal}<br/>' +
            'Histogram: {point.y}<br/>'
    },
    dataGrouping: {
        approximation: 'averages'
    },
    minPointLength: 0
}, 
/**
 * @lends Highcharts.Series#
 */
{
    nameComponents: ['longPeriod', 'shortPeriod', 'signalPeriod'],
    requiredIndicators: ['ema'],
    // "y" value is treated as Histogram data
    pointArrayMap: ['y', 'signal', 'MACD'],
    parallelArrays: ['x', 'y', 'signal', 'MACD'],
    pointValKey: 'y',
    // Columns support:
    markerAttribs: noop,
    getColumnMetrics: H.seriesTypes.column.prototype.getColumnMetrics,
    crispCol: H.seriesTypes.column.prototype.crispCol,
    // Colors and lines:
    init: function () {
        SMA.prototype.init.apply(this, arguments);
        // Check whether series is initialized. It may be not initialized,
        // when any of required indicators is missing.
        if (this.options) {
            // Set default color for a signal line and the histogram:
            this.options = merge({
                signalLine: {
                    styles: {
                        lineColor: this.color
                    }
                },
                macdLine: {
                    styles: {
                        color: this.color
                    }
                }
            }, this.options);
            // Zones have indexes automatically calculated, we need to
            // translate them to support multiple lines within one indicator
            this.macdZones = {
                zones: this.options.macdLine.zones,
                startIndex: 0
            };
            this.signalZones = {
                zones: this.macdZones.zones.concat(this.options.signalLine.zones),
                startIndex: this.macdZones.zones.length
            };
            this.resetZones = true;
        }
    },
    toYData: function (point) {
        return [point.y, point.signal, point.MACD];
    },
    translate: function () {
        var indicator = this, plotNames = ['plotSignal', 'plotMACD'];
        H.seriesTypes.column.prototype.translate.apply(indicator);
        indicator.points.forEach(function (point) {
            [point.signal, point.MACD].forEach(function (value, i) {
                if (value !== null) {
                    point[plotNames[i]] =
                        indicator.yAxis.toPixels(value, true);
                }
            });
        });
    },
    destroy: function () {
        // this.graph is null due to removing two times the same SVG element
        this.graph = null;
        this.graphmacd = this.graphmacd && this.graphmacd.destroy();
        this.graphsignal = this.graphsignal && this.graphsignal.destroy();
        SMA.prototype.destroy.apply(this, arguments);
    },
    drawPoints: H.seriesTypes.column.prototype.drawPoints,
    drawGraph: function () {
        var indicator = this, mainLinePoints = indicator.points, pointsLength = mainLinePoints.length, mainLineOptions = indicator.options, histogramZones = indicator.zones, gappedExtend = {
            options: {
                gapSize: mainLineOptions.gapSize
            }
        }, otherSignals = [[], []], point;
        // Generate points for top and bottom lines:
        while (pointsLength--) {
            point = mainLinePoints[pointsLength];
            if (defined(point.plotMACD)) {
                otherSignals[0].push({
                    plotX: point.plotX,
                    plotY: point.plotMACD,
                    isNull: !defined(point.plotMACD)
                });
            }
            if (defined(point.plotSignal)) {
                otherSignals[1].push({
                    plotX: point.plotX,
                    plotY: point.plotSignal,
                    isNull: !defined(point.plotMACD)
                });
            }
        }
        // Modify options and generate smoothing line:
        ['macd', 'signal'].forEach(function (lineName, i) {
            indicator.points = otherSignals[i];
            indicator.options = merge(mainLineOptions[lineName + 'Line'].styles, gappedExtend);
            indicator.graph = indicator['graph' + lineName];
            // Zones extension:
            indicator.currentLineZone = lineName + 'Zones';
            indicator.zones =
                indicator[indicator.currentLineZone].zones;
            SMA.prototype.drawGraph.call(indicator);
            indicator['graph' + lineName] = indicator.graph;
        });
        // Restore options:
        indicator.points = mainLinePoints;
        indicator.options = mainLineOptions;
        indicator.zones = histogramZones;
        indicator.currentLineZone = null;
        // indicator.graph = null;
    },
    getZonesGraphs: function (props) {
        var allZones = SMA.prototype.getZonesGraphs.call(this, props), currentZones = allZones;
        if (this.currentLineZone) {
            currentZones = allZones.splice(this[this.currentLineZone].startIndex + 1);
            if (!currentZones.length) {
                // Line has no zones, return basic graph "zone"
                currentZones = [props[0]];
            }
            else {
                // Add back basic prop:
                currentZones.splice(0, 0, props[0]);
            }
        }
        return currentZones;
    },
    applyZones: function () {
        // Histogram zones are handled by drawPoints method
        // Here we need to apply zones for all lines
        var histogramZones = this.zones;
        // signalZones.zones contains all zones:
        this.zones = this.signalZones.zones;
        SMA.prototype.applyZones.call(this);
        // applyZones hides only main series.graph, hide macd line manually
        if (this.graphmacd && this.options.macdLine.zones.length) {
            this.graphmacd.hide();
        }
        this.zones = histogramZones;
    },
    getValues: function (series, params) {
        var j = 0, MACD = [], xMACD = [], yMACD = [], signalLine = [], shortEMA, longEMA, i;
        if (series.xData.length <
            params.longPeriod + params.signalPeriod) {
            return;
        }
        // Calculating the short and long EMA used when calculating the MACD
        shortEMA = EMA.prototype.getValues(series, {
            period: params.shortPeriod
        });
        longEMA = EMA.prototype.getValues(series, {
            period: params.longPeriod
        });
        shortEMA = shortEMA.values;
        longEMA = longEMA.values;
        // Subtract each Y value from the EMA's and create the new dataset
        // (MACD)
        for (i = 1; i <= shortEMA.length; i++) {
            if (defined(longEMA[i - 1]) &&
                defined(longEMA[i - 1][1]) &&
                defined(shortEMA[i + params.shortPeriod + 1]) &&
                defined(shortEMA[i + params.shortPeriod + 1][0])) {
                MACD.push([
                    shortEMA[i + params.shortPeriod + 1][0],
                    0,
                    null,
                    shortEMA[i + params.shortPeriod + 1][1] -
                        longEMA[i - 1][1]
                ]);
            }
        }
        // Set the Y and X data of the MACD. This is used in calculating the
        // signal line.
        for (i = 0; i < MACD.length; i++) {
            xMACD.push(MACD[i][0]);
            yMACD.push([0, null, MACD[i][3]]);
        }
        // Setting the signalline (Signal Line: X-day EMA of MACD line).
        signalLine = EMA.prototype.getValues({
            xData: xMACD,
            yData: yMACD
        }, {
            period: params.signalPeriod,
            index: 2
        });
        signalLine = signalLine.values;
        // Setting the MACD Histogram. In comparison to the loop with pure
        // MACD this loop uses MACD x value not xData.
        for (i = 0; i < MACD.length; i++) {
            // detect the first point
            if (MACD[i][0] >= signalLine[0][0]) {
                MACD[i][2] = signalLine[j][1];
                yMACD[i] = [0, signalLine[j][1], MACD[i][3]];
                if (MACD[i][3] === null) {
                    MACD[i][1] = 0;
                    yMACD[i][0] = 0;
                }
                else {
                    MACD[i][1] = correctFloat(MACD[i][3] -
                        signalLine[j][1]);
                    yMACD[i][0] = correctFloat(MACD[i][3] -
                        signalLine[j][1]);
                }
                j++;
            }
        }
        return {
            values: MACD,
            xData: xMACD,
            yData: yMACD
        };
    }
});
/**
 * A `MACD` series. If the [type](#series.macd.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.macd
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/macd
 * @apioption series.macd
 */
''; // to include the above in the js output
