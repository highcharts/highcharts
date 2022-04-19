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
import MultipleLinesComposition from '../MultipleLinesComposition.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var _a = SeriesRegistry.seriesTypes, SMAIndicator = _a.sma, EMAIndicator = _a.ema;
import U from '../../../Core/Utilities.js';
var correctFloat = U.correctFloat, error = U.error, extend = U.extend, isArray = U.isArray, merge = U.merge;
/**
 * The Klinger oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.klinger
 *
 * @augments Highcharts.Series
 */
var KlingerIndicator = /** @class */ (function (_super) {
    __extends(KlingerIndicator, _super);
    function KlingerIndicator() {
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
        _this.points = void 0;
        _this.options = void 0;
        _this.volumeSeries = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    KlingerIndicator.prototype.calculateTrend = function (yVal, i) {
        var isUpward = yVal[i][1] + yVal[i][2] + yVal[i][3] >
            yVal[i - 1][1] + yVal[i - 1][2] + yVal[i - 1][3];
        return isUpward ? 1 : -1;
    };
    // Checks if the series and volumeSeries are accessible, number of
    // points.x is longer than period, is series has OHLC data
    KlingerIndicator.prototype.isValidData = function (firstYVal) {
        var chart = this.chart, options = this.options, series = this.linkedParent, isSeriesOHLC = isArray(firstYVal) &&
            firstYVal.length === 4, volumeSeries = this.volumeSeries ||
            (this.volumeSeries =
                chart.get(options.params.volumeSeriesID));
        if (!volumeSeries) {
            error('Series ' +
                options.params.volumeSeriesID +
                ' not found! Check `volumeSeriesID`.', true, series.chart);
        }
        var isLengthValid = [series, volumeSeries].every(function (series) {
            return series && series.xData && series.xData.length >=
                options.params.slowAvgPeriod;
        });
        return !!(isLengthValid && isSeriesOHLC);
    };
    KlingerIndicator.prototype.getCM = function (previousCM, DM, trend, previousTrend, prevoiusDM) {
        return correctFloat(DM + (trend === previousTrend ? previousCM : prevoiusDM));
    };
    KlingerIndicator.prototype.getDM = function (high, low) {
        return correctFloat(high - low);
    };
    KlingerIndicator.prototype.getVolumeForce = function (yVal) {
        var volumeForce = [];
        var CM = 0, // cumulative measurement
        DM, // daily measurement
        force, i = 1, // start from second point
        previousCM = 0, previousDM = yVal[0][1] - yVal[0][2], // initial DM
        previousTrend = 0, trend;
        for (i; i < yVal.length; i++) {
            trend = this.calculateTrend(yVal, i);
            DM = this.getDM(yVal[i][1], yVal[i][2]);
            // For the first iteration when the previousTrend doesn't exist,
            // previousCM doesn't exist either, but it doesn't matter becouse
            // it's filltered out in the getCM method in else statement,
            // (in this iteration, previousCM can be raplaced with the DM).
            CM = this.getCM(previousCM, DM, trend, previousTrend, previousDM);
            force = this.volumeSeries.yData[i] *
                trend * Math.abs(2 * ((DM / CM) - 1)) * 100;
            volumeForce.push([force]);
            // Before next iteration, assign the current as the previous.
            previousTrend = trend;
            previousCM = CM;
            previousDM = DM;
        }
        return volumeForce;
    };
    KlingerIndicator.prototype.getEMA = function (yVal, prevEMA, SMA, EMApercent, index, i, xVal) {
        return EMAIndicator.prototype.calculateEma(xVal || [], yVal, typeof i === 'undefined' ? 1 : i, EMApercent, prevEMA, typeof index === 'undefined' ? -1 : index, SMA);
    };
    KlingerIndicator.prototype.getSMA = function (period, index, values) {
        return EMAIndicator.prototype
            .accumulatePeriodPoints(period, index, values) / period;
    };
    KlingerIndicator.prototype.getValues = function (series, params) {
        var Klinger = [], xVal = series.xData, yVal = series.yData, xData = [], yData = [], calcSingal = [];
        var KO, i = 0, fastEMA = 0, slowEMA, 
        // signalEMA: number|undefined = void 0,
        previousFastEMA = void 0, previousSlowEMA = void 0, signal = null;
        // If the necessary conditions are not fulfilled, don't proceed.
        if (!this.isValidData(yVal[0])) {
            return;
        }
        // Calculate the Volume Force array.
        var volumeForce = this.getVolumeForce(yVal);
        // Calculate SMA for the first points.
        var SMAFast = this.getSMA(params.fastAvgPeriod, 0, volumeForce), SMASlow = this.getSMA(params.slowAvgPeriod, 0, volumeForce);
        // Calculate EMApercent for the first points.
        var fastEMApercent = 2 / (params.fastAvgPeriod + 1), slowEMApercent = 2 / (params.slowAvgPeriod + 1);
        // Calculate KO
        for (i; i < yVal.length; i++) {
            // Get EMA for fast period.
            if (i >= params.fastAvgPeriod) {
                fastEMA = this.getEMA(volumeForce, previousFastEMA, SMAFast, fastEMApercent, 0, i, xVal)[1];
                previousFastEMA = fastEMA;
            }
            // Get EMA for slow period.
            if (i >= params.slowAvgPeriod) {
                slowEMA = this.getEMA(volumeForce, previousSlowEMA, SMASlow, slowEMApercent, 0, i, xVal)[1];
                previousSlowEMA = slowEMA;
                KO = correctFloat(fastEMA - slowEMA);
                calcSingal.push(KO);
                // Calculate signal SMA
                if (calcSingal.length >= params.signalPeriod) {
                    signal = calcSingal.slice(-params.signalPeriod)
                        .reduce(function (prev, curr) {
                        return prev + curr;
                    }) / params.signalPeriod;
                }
                Klinger.push([xVal[i], KO, signal]);
                xData.push(xVal[i]);
                yData.push([KO, signal]);
            }
        }
        return {
            values: Klinger,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Klinger oscillator. This series requires the `linkedTo` option to be set
     * and should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/klinger
     *         Klinger oscillator
     *
     * @extends      plotOptions.sma
     * @since 9.1.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/klinger
     * @optionparent plotOptions.klinger
     */
    KlingerIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * Paramters used in calculation of Klinger Oscillator.
         *
         * @excluding index, period
         */
        params: {
            /**
             * The fast period for indicator calculations.
             */
            fastAvgPeriod: 34,
            /**
             * The slow period for indicator calculations.
             */
            slowAvgPeriod: 55,
            /**
             * The base period for signal calculations.
             */
            signalPeriod: 13,
            /**
             * The id of another series to use its data as volume data for the
             * indiator calculation.
             */
            volumeSeriesID: 'volume'
        },
        signalLine: {
            /**
             * Styles for a signal line.
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.klinger.color
                 * ](#plotOptions.klinger.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: '#ff0000'
            }
        },
        dataGrouping: {
            approximation: 'averages'
        },
        tooltip: {
            pointFormat: '<span style="color: {point.color}">\u25CF</span>' +
                '<b> {series.name}</b><br/>' +
                '<span style="color: {point.color}">Klinger</span>: ' +
                '{point.y}<br/>' +
                '<span style="color: ' +
                '{point.series.options.signalLine.styles.lineColor}">' +
                'Signal</span>' +
                ': {point.signal}<br/>'
        }
    });
    return KlingerIndicator;
}(SMAIndicator));
extend(KlingerIndicator.prototype, {
    areaLinesNames: [],
    linesApiNames: ['signalLine'],
    nameBase: 'Klinger',
    nameComponents: ['fastAvgPeriod', 'slowAvgPeriod'],
    pointArrayMap: ['y', 'signal'],
    parallelArrays: ['x', 'y', 'signal'],
    pointValKey: 'y'
});
MultipleLinesComposition.compose(KlingerIndicator);
SeriesRegistry.registerSeriesType('klinger', KlingerIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default KlingerIndicator;
/**
 * A Klinger oscillator. If the [type](#series.klinger.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.klinger
 * @since 9.1.0
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/klinger
 * @apioption series.klinger
 */
''; // to include the above in the js output
