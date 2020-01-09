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
        class SMAIndicator extends Series {
            public bindTo: SMAIndicatorBindToObject;
            public calculateOn: string;
            public data: Array<SMAIndicatorPoint>;
            public dataEventsToUnbind: Array<Function>;
            public hasDerivedData: boolean;
            public linkedParent: Series;
            public nameBase?: string;
            public nameComponents: Array<string>;
            public nameSuffixes: Array<string>;
            public options: SMAIndicatorOptions;
            public pointClass: typeof SMAIndicatorPoint;
            public points: Array<SMAIndicatorPoint>;
            public processData: Series['processData'];
            public requiredIndicators: Array<string>;
            public useCommonDataGrouping: boolean;
            public init(chart: Chart, options: SMAIndicatorOptions): void;
            public getName(): string;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: SMAIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public requireIndicators(): SMAIndicatorRequireIndicatorsObject;
        }

        class SMAIndicatorPoint extends LinePoint {
            public series: SMAIndicator;
        }

        interface IndicatorValuesObject<
            TLinkedSeries extends Series
        > {
            values: Array<Array<(
                ExtractArrayType<TLinkedSeries['xData']>|
                ExtractArrayType<TLinkedSeries['yData']>
            )>>;
            xData: NonNullable<TLinkedSeries['xData']>;
            yData: NonNullable<TLinkedSeries['yData']>;
        }

        interface LineSeriesOptions {
            useOhlcData?: boolean;
        }

        interface SMAIndicatorOptions extends LineSeriesOptions {
            compareToMain?: boolean;
            data?: Array<Array<number>>;
            params?: SMAIndicatorParamsOptions;
        }

        interface SMAIndicatorParamsOptions {
            index?: number;
            period?: number;
        }

        interface SeriesTypesDictionary {
            sma: typeof SMAIndicator;
        }

        interface SMAIndicatorBindToObject {
            eventName: string;
            series: boolean;
        }

        interface SMAIndicatorRequireIndicatorsObject {
            allLoaded: boolean;
            needed?: string;
        }

        interface Series {
            /** @requires indicators/indicators */
            requireIndicators(): SMAIndicatorRequireIndicatorsObject;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    addEvent,
    extend,
    isArray,
    pick,
    splat
} = U;

import requiredIndicatorMixin from '../mixins/indicator-required.js';

var error = H.error,
    Series = H.Series,
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

/* eslint-disable no-invalid-this */

addEvent(H.Series, 'init', function (
    eventOptions: { options: Highcharts.SMAIndicatorOptions }
): void {
    var series = this,
        options = eventOptions.options;

    if (
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {
        extend(series, {
            pointValKey: ohlcProto.pointValKey,
            keys: (ohlcProto as any).keys, // @todo potentially nonsense
            pointArrayMap: ohlcProto.pointArrayMap,
            toYData: ohlcProto.toYData
        });
    }
});

addEvent(Series, 'afterSetOptions', function (
    e: { options: Highcharts.LineSeriesOptions }
): void {
    var options = e.options,
        dataGrouping = options.dataGrouping;

    if (
        dataGrouping &&
        options.useOhlcData &&
        options.id !== 'highcharts-navigator-series'
    ) {
        dataGrouping.approximation = 'ohlc';
    }
});

/* eslint-enable no-invalid-this */

/**
 * The SMA series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.sma
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.SMAIndicator>(
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
     * @excluding    allAreas, colorAxis, dragDrop, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking, useOhlcData
     * @product      highstock
     * @requires     stock/indicators/indicators
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
        processData: function (
            this: Highcharts.SMAIndicator
        ): (boolean|undefined) {
            var series = this,
                compareToMain = series.options.compareToMain,
                linkedParent = series.linkedParent;

            Series.prototype.processData.apply(series, arguments);

            if (linkedParent && linkedParent.compareValue && compareToMain) {
                series.compareValue = linkedParent.compareValue;
            }

            return;
        },
        bindTo: {
            series: true,
            eventName: 'updatedData'
        },
        hasDerivedData: true,
        useCommonDataGrouping: true,
        nameComponents: ['period'],
        nameSuffixes: [], // e.g. Zig Zag uses extra '%'' in the legend name
        calculateOn: 'init',
        // Defines on which other indicators is this indicator based on.
        requiredIndicators: [],
        requireIndicators: function (
            this: Highcharts.SMAIndicator
        ): Highcharts.SMAIndicatorRequireIndicatorsObject {
            var obj: Highcharts.SMAIndicatorRequireIndicatorsObject = {
                allLoaded: true
            };

            // Check whether all required indicators are loaded, else return
            // the object with missing indicator's name.
            this.requiredIndicators.forEach(function (indicator: string): void {
                if (seriesTypes[indicator]) {
                    seriesTypes[indicator].prototype.requireIndicators();
                } else {
                    obj.allLoaded = false;
                    obj.needed = indicator;
                }
            });
            return obj;
        },
        init: function (
            this: Highcharts.SMAIndicator,
            chart: Highcharts.Chart,
            options: Highcharts.SMAIndicatorOptions
        ): (Highcharts.SMAIndicator) {
            var indicator = this,
                requiredIndicators = indicator.requireIndicators();

            // Check whether all required indicators are loaded.
            if (!requiredIndicators.allLoaded) {
                return error(generateMessage(
                    indicator.type,
                    requiredIndicators.needed as any
                )) as any;
            }

            Series.prototype.init.call(
                indicator,
                chart,
                options
            );

            // Make sure we find series which is a base for an indicator
            chart.linkSeries();

            indicator.dataEventsToUnbind = [];

            /**
             * @private
             * @return {void}
             */
            function recalculateValues(): void {
                var oldData = indicator.points || [],
                    oldDataLength = (indicator.xData || []).length,
                    processedData: Highcharts.IndicatorValuesObject<
                    Highcharts.Series
                    > = indicator.getValues(
                        indicator.linkedParent,
                        indicator.options.params as any
                    ) || {
                        values: [],
                        xData: [],
                        yData: []
                    },
                    croppedDataValues = [],
                    overwriteData = true,
                    oldFirstPointIndex,
                    oldLastPointIndex,
                    croppedData,
                    min,
                    max,
                    i;

                // We need to update points to reflect changes in all,
                // x and y's, values. However, do it only for non-grouped
                // data - grouping does it for us (#8572)
                if (
                    oldDataLength &&
                    !indicator.hasGroupedData &&
                    indicator.visible &&
                    indicator.points
                ) {
                    // When data is cropped update only avaliable points (#9493)
                    if (indicator.cropped) {
                        if (indicator.xAxis) {
                            min = indicator.xAxis.min;
                            max = indicator.xAxis.max;
                        }

                        croppedData = indicator.cropData(
                            processedData.xData,
                            processedData.yData,
                            min as any,
                            max as any
                        );

                        for (i = 0; i < croppedData.xData.length; i++) {
                            // (#10774)
                            croppedDataValues.push([
                                croppedData.xData[i]
                            ].concat(
                                splat(croppedData.yData[i])
                            ));
                        }

                        oldFirstPointIndex = processedData.xData.indexOf(
                            (indicator.xData as any)[0]
                        );
                        oldLastPointIndex = processedData.xData.indexOf(
                            (indicator.xData as any)[
                                (indicator.xData as any).length - 1
                            ]
                        );

                        // Check if indicator points should be shifted (#8572)
                        if (
                            oldFirstPointIndex === -1 &&
                            oldLastPointIndex === processedData.xData.length - 2
                        ) {
                            if (croppedDataValues[0][0] === oldData[0].x) {
                                croppedDataValues.shift();
                            }
                        }

                        indicator.updateData(croppedDataValues);

                    // Omit addPoint() and removePoint() cases
                    } else if (
                        processedData.xData.length !== oldDataLength - 1 &&
                        processedData.xData.length !== oldDataLength + 1
                    ) {
                        overwriteData = false;
                        indicator.updateData(processedData.values as any);
                    }
                }

                if (overwriteData) {
                    indicator.xData = processedData.xData;
                    indicator.yData = (processedData.yData as any);
                    indicator.options.data = (processedData.values as any);
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
                ) as any;
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
                    function (): void {
                        recalculateValues();
                        // Call this just once, on init
                        unbinder();
                    }
                );
            }

            return indicator;
        },
        getName: function (
            this: Highcharts.SMAIndicator
        ): string {
            var name = this.name,
                params: Array<string> = [];

            if (!name) {

                (this.nameComponents || []).forEach(
                    function (component: string, index: number): void {
                        params.push(
                            (this.options.params as any)[component] +
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
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.SMAIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = params.period as any,
                xVal: Array<number> = series.xData as any,
                yVal: Array<(
                    number|Array<(number|null|undefined)>|null|undefined
                )> = series.yData as any,
                yValLen = yVal.length,
                range = 0,
                sum = 0,
                SMA: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                index = -1,
                i: (number|undefined),
                SMAPoint: (Array<number>|undefined);

            if (xVal.length < period) {
                return;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                index = params.index ? params.index : 0;
            }

            // Accumulate first N-points
            while (range < period - 1) {
                sum += index < 0 ? yVal[range] : (yVal as any)[range][index];
                range++;
            }

            // Calculate value one-by-one for each period in visible data
            for (i = range; i < yValLen; i++) {
                sum += index < 0 ? yVal[i] : (yVal as any)[i][index];

                SMAPoint = [xVal[i], sum / period];
                SMA.push(SMAPoint);
                xData.push(SMAPoint[0]);
                yData.push(SMAPoint[1]);

                sum -= (
                    index < 0 ?
                        yVal[i - range] :
                        (yVal as any)[i - range][index]
                );
            }

            return {
                values: SMA,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        },
        destroy: function (this: Highcharts.SMAIndicator): void {
            this.dataEventsToUnbind.forEach(function (
                unbinder: Function
            ): void {
                unbinder();
            });
            Series.prototype.destroy.apply(this, arguments);
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
 * @requires  stock/indicators/indicators
 * @apioption series.sma
 */

''; // adds doclet above to the transpiled file
