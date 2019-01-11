/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var pick = H.pick,
    error = H.error,
    Series = H.Series,
    isArray = H.isArray,
    addEvent = H.addEvent,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    ohlcProto = H.seriesTypes.ohlc.prototype,
    generateMessage = requiredIndicatorMixin.generateMessage;

/**
 * The parameter allows setting line series type and use OHLC indicators. Data
 * in OHLC format is required.
 *
 * @sample {highstock} stock/indicators/use-ohlc-data
 *         Plot line on Y axis
 *
 * @type      {boolean}
 * @product   highstock
 * @apioption plotOptions.line.useOhlcData
 */

addEvent(H.Series, 'init', function (eventOptions) {
    var series = this,
        options = eventOptions.options,
        dataGrouping = options.dataGrouping;

    if (
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {

        if (dataGrouping && dataGrouping.enabled) {
            dataGrouping.approximation = 'ohlc';
        }

        H.extend(series, {
            pointValKey: ohlcProto.pointValKey,
            keys: ohlcProto.keys,
            pointArrayMap: ohlcProto.pointArrayMap,
            toYData: ohlcProto.toYData
        });
    }
});

/**
 * The SMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.sma
 *
 * @augments Highcharts.Series
 */
seriesType(
    'sma',
    'line',
    /**
     * Simple moving average indicator (SMA). This series requires `linkedTo`
     * option to be set.
     *
     * @sample stock/indicators/sma
     *         Simple moving average indicator
     *
     * @extends      plotOptions.line
     * @since        6.0.0
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking, useOhlcData
     * @product      highstock
     * @optionparent plotOptions.sma
     */
    {
        /**
         * The name of the series as shown in the legend, tooltip etc. If not
         * set, it will be based on a technical indicator type and default
         * params.
         *
         * @type {string}
         */
        name: undefined,
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
        linkedTo: undefined,
        /**
         * Paramters used in calculation of regression series' points.
         */
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             */
            index: 0,
            /**
             * The base period for indicator calculations. This is the number of
             * data points which are taken into account for the indicator
             * calculations.
             */
            period: 14
        }
    },
    /**
     * @lends Highcharts.Series.prototype
     */
    {
        bindTo: {
            series: true,
            eventName: 'updatedData'
        },
        useCommonDataGrouping: true,
        nameComponents: ['period'],
        nameSuffixes: [], // e.g. Zig Zag uses extra '%'' in the legend name
        calculateOn: 'init',
        // Defines on which other indicators is this indicator based on.
        requiredIndicators: [],
        requireIndicators: function () {
            var obj = {
                allLoaded: true
            };

            // Check whether all required indicators are loaded, else return
            // the object with missing indicator's name.
            this.requiredIndicators.forEach(function (indicator) {
                if (seriesTypes[indicator]) {
                    seriesTypes[indicator].prototype.requireIndicators();
                } else {
                    obj.allLoaded = false;
                    obj.needed = indicator;
                }
            });
            return obj;
        },
        init: function (chart, options) {
            var indicator = this,
                requiredIndicators = indicator.requireIndicators();

            // Check whether all required indicators are loaded.
            if (!requiredIndicators.allLoaded) {
                return error(
                    generateMessage(indicator.type, requiredIndicators.needed)
                );
            }

            Series.prototype.init.call(
                indicator,
                chart,
                options
            );

            // Make sure we find series which is a base for an indicator
            chart.linkSeries();

            indicator.dataEventsToUnbind = [];

            function recalculateValues() {
                var oldDataLength = (indicator.xData || []).length,
                    processedData = indicator.getValues(
                        indicator.linkedParent,
                        indicator.options.params
                    ) || {
                        values: [],
                        xData: [],
                        yData: []
                    };

                // If number of points is the same, we need to update points to
                // reflect changes in all, x and y's, values. However, do it
                // only for non-grouped data - grouping does it for us (#8572)
                if (
                    oldDataLength &&
                    oldDataLength === processedData.xData.length &&
                    !indicator.cropped && // #8968
                    !indicator.hasGroupedData &&
                    indicator.visible &&
                    indicator.points
                ) {
                    indicator.updateData(processedData.values);
                } else {
                    indicator.xData = processedData.xData;
                    indicator.yData = processedData.yData;
                    indicator.options.data = processedData.values;
                }

                // Removal of processedXData property is required because on
                // first translate processedXData array is empty
                if (indicator.bindTo.series === false) {
                    delete indicator.processedXData;

                    indicator.isDirty = true;
                    indicator.redraw();
                }
                indicator.isDirtyData = false;
            }

            if (!indicator.linkedParent) {
                return error(
                    'Series ' +
                    indicator.options.linkedTo +
                    ' not found! Check `linkedTo`.',
                    false,
                    chart
                );
            }

            indicator.dataEventsToUnbind.push(
                addEvent(
                    indicator.bindTo.series ?
                        indicator.linkedParent : indicator.linkedParent.xAxis,
                    indicator.bindTo.eventName,
                    recalculateValues
                )
            );

            if (indicator.calculateOn === 'init') {
                recalculateValues();
            } else {
                var unbinder = addEvent(
                    indicator.chart,
                    indicator.calculateOn,
                    function () {
                        recalculateValues();
                        // Call this just once, on init
                        unbinder();
                    }
                );
            }

            return indicator;
        },
        getName: function () {
            var name = this.name,
                params = [];

            if (!name) {

                (this.nameComponents || []).forEach(
                    function (component, index) {
                        params.push(
                            this.options.params[component] +
                            pick(this.nameSuffixes[index], '')
                        );
                    },
                    this
                );

                name = (this.nameBase || this.type.toUpperCase()) +
                    (this.nameComponents ? ' (' + params.join(', ') + ')' : '');
            }

            return name;
        },
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal.length,
                range = 0,
                sum = 0,
                SMA = [],
                xData = [],
                yData = [],
                index = -1,
                i,
                SMAPoint;

            if (xVal.length < period) {
                return false;
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

                sum -= index < 0 ? yVal[i - range] : yVal[i - range][index];
            }

            return {
                values: SMA,
                xData: xData,
                yData: yData
            };
        },
        destroy: function () {
            this.dataEventsToUnbind.forEach(function (unbinder) {
                unbinder();
            });
            Series.prototype.destroy.call(this);
        }
    }
);

/**
 * A `SMA` series. If the [type](#series.sma.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sma
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL, useOhlcData
 * @apioption series.sma
 */
