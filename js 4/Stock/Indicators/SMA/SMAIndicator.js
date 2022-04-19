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
import Chart from '../../../Core/Chart/Chart.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var LineSeries = SeriesRegistry.seriesTypes.line;
import U from '../../../Core/Utilities.js';
var addEvent = U.addEvent, error = U.error, extend = U.extend, isArray = U.isArray, merge = U.merge, pick = U.pick, splat = U.splat;
import './SMAComposition.js';
/* *
 *
 *  Class
 *
 * */
/**
 * The SMA series type.
 *
 * @private
 */
var SMAIndicator = /** @class */ (function (_super) {
    __extends(SMAIndicator, _super);
    function SMAIndicator() {
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
        _this.dataEventsToUnbind = void 0;
        _this.linkedParent = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    SMAIndicator.prototype.destroy = function () {
        this.dataEventsToUnbind.forEach(function (unbinder) {
            unbinder();
        });
        _super.prototype.destroy.apply(this, arguments);
    };
    /**
     * @private
     */
    SMAIndicator.prototype.getName = function () {
        var name = this.name, params = [];
        if (!name) {
            (this.nameComponents || []).forEach(function (component, index) {
                params.push(this.options.params[component] +
                    pick(this.nameSuffixes[index], ''));
            }, this);
            name = (this.nameBase || this.type.toUpperCase()) +
                (this.nameComponents ? ' (' + params.join(', ') + ')' : '');
        }
        return name;
    };
    /**
     * @private
     */
    SMAIndicator.prototype.getValues = function (series, params) {
        var period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal.length, range = 0, sum = 0, SMA = [], xData = [], yData = [], index = -1, i, SMAPoint;
        if (xVal.length < period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (isArray(yVal[0])) {
            index = params.index ? params.index : 0;
        }
        // Accumulate first N-points
        while (range < period - 1) {
            sum += index < 0 ? yVal[range] : yVal[range][index];
            range++;
        }
        // Calculate value one-by-one for each period in visible data
        for (i = range; i < yValLen; i++) {
            sum += index < 0 ? yVal[i] : yVal[i][index];
            SMAPoint = [xVal[i], sum / period];
            SMA.push(SMAPoint);
            xData.push(SMAPoint[0]);
            yData.push(SMAPoint[1]);
            sum -= (index < 0 ?
                yVal[i - range] :
                yVal[i - range][index]);
        }
        return {
            values: SMA,
            xData: xData,
            yData: yData
        };
    };
    /**
     * @private
     */
    SMAIndicator.prototype.init = function (chart, options) {
        var indicator = this;
        _super.prototype.init.call(indicator, chart, options);
        // Only after series are linked indicator can be processed.
        var linkedSeriesUnbiner = addEvent(Chart, 'afterLinkSeries', function () {
            var hasEvents = !!indicator.dataEventsToUnbind.length;
            if (indicator.linkedParent) {
                if (!hasEvents) {
                    // No matter which indicator, always recalculate after
                    // updating the data.
                    indicator.dataEventsToUnbind.push(addEvent(indicator.linkedParent, 'updatedData', function () {
                        indicator.recalculateValues();
                    }));
                    // Some indicators (like VBP) requires an additional
                    // event (afterSetExtremes) to properly show the data.
                    if (indicator.calculateOn.xAxis) {
                        indicator.dataEventsToUnbind.push(addEvent(indicator.linkedParent.xAxis, indicator.calculateOn.xAxis, function () {
                            indicator.recalculateValues();
                        }));
                    }
                }
                // Most indicators are being calculated on chart's init.
                if (indicator.calculateOn.chart === 'init') {
                    if (!indicator.processedYData) {
                        indicator.recalculateValues();
                    }
                }
                else if (!hasEvents) {
                    // Some indicators (like VBP) has to recalculate their
                    // values after other chart's events (render).
                    var unbinder_1 = addEvent(indicator.chart, indicator.calculateOn.chart, function () {
                        indicator.recalculateValues();
                        // Call this just once.
                        unbinder_1();
                    });
                }
            }
            else {
                return error('Series ' +
                    indicator.options.linkedTo +
                    ' not found! Check `linkedTo`.', false, chart);
            }
        }, {
            order: 0
        });
        // Make sure we find series which is a base for an indicator
        // chart.linkSeries();
        indicator.dataEventsToUnbind = [];
        indicator.eventsToUnbind.push(linkedSeriesUnbiner);
    };
    /**
     * @private
     */
    SMAIndicator.prototype.recalculateValues = function () {
        var indicator = this, oldData = indicator.points || [], oldDataLength = (indicator.xData || []).length, emptySet = {
            values: [],
            xData: [],
            yData: []
        }, processedData, croppedDataValues = [], overwriteData = true, oldFirstPointIndex, oldLastPointIndex, croppedData, min, max, i;
        // Updating an indicator with redraw=false may destroy data.
        // If there will be a following update for the parent series,
        // we will try to access Series object without any properties
        // (except for prototyped ones). This is what happens
        // for example when using Axis.setDataGrouping(). See #16670
        processedData = indicator.linkedParent.options ?
            (indicator.getValues(indicator.linkedParent, indicator.options.params) || emptySet) : emptySet;
        // We need to update points to reflect changes in all,
        // x and y's, values. However, do it only for non-grouped
        // data - grouping does it for us (#8572)
        if (oldDataLength &&
            !indicator.hasGroupedData &&
            indicator.visible &&
            indicator.points) {
            // When data is cropped update only avaliable points (#9493)
            if (indicator.cropped) {
                if (indicator.xAxis) {
                    min = indicator.xAxis.min;
                    max = indicator.xAxis.max;
                }
                croppedData = indicator.cropData(processedData.xData, processedData.yData, min, max);
                for (i = 0; i < croppedData.xData.length; i++) {
                    // (#10774)
                    croppedDataValues.push([
                        croppedData.xData[i]
                    ].concat(splat(croppedData.yData[i])));
                }
                oldFirstPointIndex = processedData.xData.indexOf(indicator.xData[0]);
                oldLastPointIndex = processedData.xData.indexOf(indicator.xData[indicator.xData.length - 1]);
                // Check if indicator points should be shifted (#8572)
                if (oldFirstPointIndex === -1 &&
                    oldLastPointIndex === processedData.xData.length - 2) {
                    if (croppedDataValues[0][0] === oldData[0].x) {
                        croppedDataValues.shift();
                    }
                }
                indicator.updateData(croppedDataValues);
                // Omit addPoint() and removePoint() cases
            }
            else if (processedData.xData.length !== oldDataLength - 1 &&
                processedData.xData.length !== oldDataLength + 1) {
                overwriteData = false;
                indicator.updateData(processedData.values);
            }
        }
        if (overwriteData) {
            indicator.xData = processedData.xData;
            indicator.yData = processedData.yData;
            indicator.options.data = processedData.values;
        }
        // Removal of processedXData property is required because on
        // first translate processedXData array is empty
        if (indicator.calculateOn.xAxis && indicator.processedXData) {
            delete indicator.processedXData;
            indicator.isDirty = true;
            indicator.redraw();
        }
        indicator.isDirtyData = false;
    };
    /**
     * @private
     */
    SMAIndicator.prototype.processData = function () {
        var series = this, compareToMain = series.options.compareToMain, linkedParent = series.linkedParent;
        _super.prototype.processData.apply(series, arguments);
        if (series.dataModify &&
            linkedParent &&
            linkedParent.dataModify &&
            linkedParent.dataModify.compareValue &&
            compareToMain) {
            series.dataModify.compareValue =
                linkedParent.dataModify.compareValue;
        }
        return;
    };
    /**
     * The parameter allows setting line series type and use OHLC indicators.
     * Data in OHLC format is required.
     *
     * @sample {highstock} stock/indicators/use-ohlc-data
     *         Use OHLC data format to plot line chart
     *
     * @type      {boolean}
     * @product   highstock
     * @apioption plotOptions.line.useOhlcData
     */
    /**
     * Simple moving average indicator (SMA). This series requires `linkedTo`
     * option to be set.
     *
     * @sample stock/indicators/sma
     *         Simple moving average indicator
     *
     * @extends      plotOptions.line
     * @since        6.0.0
     * @excluding    allAreas, colorAxis, dragDrop, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking, useOhlcData
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @optionparent plotOptions.sma
     */
    SMAIndicator.defaultOptions = merge(LineSeries.defaultOptions, {
        /**
         * The name of the series as shown in the legend, tooltip etc. If not
         * set, it will be based on a technical indicator type and default
         * params.
         *
         * @type {string}
         */
        name: void 0,
        tooltip: {
            /**
             * Number of decimals in indicator series.
             */
            valueDecimals: 4
        },
        /**
         * The main series ID that indicator will be based on. Required for this
         * indicator.
         *
         * @type {string}
         */
        linkedTo: void 0,
        /**
         * Whether to compare indicator to the main series values
         * or indicator values.
         *
         * @sample {highstock} stock/plotoptions/series-comparetomain/
         *         Difference between comparing SMA values to the main series
         *         and its own values.
         *
         * @type {boolean}
         */
        compareToMain: false,
        /**
         * Paramters used in calculation of regression series' points.
         */
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             */
            index: 3,
            /**
             * The base period for indicator calculations. This is the number of
             * data points which are taken into account for the indicator
             * calculations.
             */
            period: 14
        }
    });
    return SMAIndicator;
}(LineSeries));
extend(SMAIndicator.prototype, {
    calculateOn: {
        chart: 'init'
    },
    hasDerivedData: true,
    nameComponents: ['period'],
    nameSuffixes: [],
    useCommonDataGrouping: true
});
SeriesRegistry.registerSeriesType('sma', SMAIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default SMAIndicator;
/* *
 *
 *  API Options
 *
 * */
/**
 * A `SMA` series. If the [type](#series.sma.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sma
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL, useOhlcData
 * @requires  stock/indicators/indicators
 * @apioption series.sma
 */
''; // adds doclet above to the transpiled file
