/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AxisType } from '../../../Core/Axis/Types';
import type Chart from '../../../Core/Chart/Chart';
import type IndicatorLike from '../IndicatorLike';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type RequireIndicatorsResultObject from '../RequireIndicatorsResultObject';
import type SeriesType from '../../../Core/Series/SeriesType';
import type {
    SMAOptions,
    SMAParamsOptions
} from './SMAOptions';
import type SMAPoint from './SMAPoint';

import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        line: LineSeries
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    error,
    extend,
    isArray,
    merge,
    pick,
    splat
} = U;

import './SMAComposition.js';

/* *
 *
 *  Declarations
 *
 * */

interface BindToObject {
    eventName: string;
    series: boolean;
}

declare module '../../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        useOhlcData?: boolean;
    }
}

const generateMessage = RequiredIndicatorMixin.generateMessage;

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
class SMAIndicator extends LineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * The parameter allows setting line series type and use OHLC indicators.
     * Data in OHLC format is required.
     *
     * @sample {highstock} stock/indicators/use-ohlc-data
     *         Plot line on Y axis
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
    public static defaultOptions: SMAOptions = merge(LineSeries.defaultOptions, {
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
    } as SMAOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<SMAPoint> = void 0 as any;

    public dataEventsToUnbind: Array<Function> = void 0 as any;

    public linkedParent: typeof LineSeries.prototype = void 0 as any;

    public nameBase?: string;

    public options: SMAOptions = void 0 as any;

    public points: Array<SMAPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public destroy(): void {
        this.dataEventsToUnbind.forEach(function (
            unbinder: Function
        ): void {
            unbinder();
        });
        super.destroy.apply(this, arguments);
    }

    /**
     * @private
     */
    public getName(): string {
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
    }

    /**
     * @private
     */
    public getValues<TLinkedSeries extends typeof LineSeries.prototype>(
        series: TLinkedSeries,
        params: SMAParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var period: number = params.period as any,
            xVal: Array<number> = series.xData as any,
            yVal: Array<(number|Array<(number|null)>|null)> = series.yData as any,
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
        } as IndicatorValuesObject<TLinkedSeries>;
    }

    /**
     * @private
     */
    public init(
        chart: Chart,
        options: SMAOptions
    ): void {
        var indicator = this,
            requiredIndicators = indicator.requireIndicators();

        // Check whether all required indicators are loaded.
        if (!requiredIndicators.allLoaded) {
            return error(generateMessage(
                indicator.type,
                requiredIndicators.needed as any
            )) as any;
        }

        super.init.call(
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
                processedData: IndicatorValuesObject<typeof LineSeries.prototype> = (
                    indicator.getValues(
                        indicator.linkedParent,
                        indicator.options.params as any
                    ) || {
                        values: [],
                        xData: [],
                        yData: []
                    }),
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
            addEvent<AxisType|SeriesType>(
                indicator.bindTo.series ?
                    indicator.linkedParent :
                    indicator.linkedParent.xAxis,
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

        // return indicator;
    }

    /**
     * @private
     */
    public processData(): (boolean|undefined) {
        var series = this,
            compareToMain = series.options.compareToMain,
            linkedParent = series.linkedParent;

        super.processData.apply(series, arguments);

        if (linkedParent && linkedParent.compareValue && compareToMain) {
            series.compareValue = linkedParent.compareValue;
        }

        return;
    }

    /**
     * @private
     */
    public requireIndicators(): RequireIndicatorsResultObject {
        var obj: RequireIndicatorsResultObject = {
            allLoaded: true
        };

        // Check whether all required indicators are loaded, else return
        // the object with missing indicator's name.
        this.requiredIndicators.forEach(function (indicator: string): void {
            if (SeriesRegistry.seriesTypes[indicator]) {
                (SeriesRegistry.seriesTypes[indicator].prototype as SMAIndicator).requireIndicators();
            } else {
                obj.allLoaded = false;
                obj.needed = indicator;
            }
        });
        return obj;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface SMAIndicator extends IndicatorLike {
    bindTo: BindToObject;
    calculateOn: string;
    hasDerivedData: boolean;
    nameComponents: Array<string>;
    nameSuffixes: Array<string>;
    pointClass: typeof SMAPoint;
    requiredIndicators: Array<string>;
    useCommonDataGrouping: boolean;
}
extend(SMAIndicator.prototype, {
    bindTo: {
        series: true,
        eventName: 'updatedData'
    },
    calculateOn: 'init',
    hasDerivedData: true,
    nameComponents: ['period'],
    nameSuffixes: [], // e.g. Zig Zag uses extra '%'' in the legend name
    // Defines on which other indicators is this indicator based on.
    requiredIndicators: [],
    useCommonDataGrouping: true
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        sma: typeof SMAIndicator;
    }
}
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
