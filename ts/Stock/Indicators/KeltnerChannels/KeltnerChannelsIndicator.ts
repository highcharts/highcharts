/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type {
    KeltnerChannelsOptions,
    KeltnerChannelsParamsOptions
} from './KeltnerChannelsOptions';
import type KeltnerChannelsPoint from './KeltnerChannelsPoint';
import type LineSeries from '../../../Series/Line/LineSeries';
import MultipleLinesMixin from '../../../Mixins/MultipleLines.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator,
        ema: EMAIndicator,
        atr: ATRIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    correctFloat,
    extend,
    merge
} = U;

/**
 * The Keltner Channels series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.keltnerchannels
 *
 * @augments Highcharts.Series
 */
class KeltnerChannelsIndicator extends SMAIndicator implements Highcharts.MultipleLinesIndicator {
    /**
     * Keltner Channels. This series requires the `linkedTo` option to be set
     * and should be loaded after the `stock/indicators/indicators.js`,
     * `stock/indicators/atr.js`, and `stock/ema/.js`.
     *
     * @sample {highstock} stock/indicators/keltner-channels
     *         Keltner Channels
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart,showInNavigator,
     *               stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/keltner-channels
     * @optionparent plotOptions.keltnerchannels
     */
    public static defaultOptions: KeltnerChannelsOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            period: 20,
            /**
             * The ATR period.
             */
            periodATR: 10,
            /**
             * The ATR multiplier.
             */
            multiplierATR: 2
        },
        /**
         * Bottom line options.
         *
         */
        bottomLine: {
            /**
             * Styles for a bottom line.
             *
             */
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * `plotOptions.keltnerchannels.color`
                 */
                lineColor: void 0
            }
        },
        /**
         * Top line options.
         *
         * @extends plotOptions.keltnerchannels.bottomLine
         */
        topLine: {
            styles: {
                lineWidth: 1,
                lineColor: void 0
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Upper Channel: {point.top}<br/>EMA({series.options.params.period}): {point.middle}<br/>Lower Channel: {point.bottom}<br/>'
        },
        marker: {
            enabled: false
        },
        dataGrouping: {
            approximation: 'averages'
        },
        lineWidth: 1
    } as KeltnerChannelsOptions)

    public data: Array<KeltnerChannelsPoint> = void 0 as any;
    public options: KeltnerChannelsOptions = void 0 as any;
    public points: Array<KeltnerChannelsPoint> = void 0 as any;

    public init(this: KeltnerChannelsIndicator): void {
        SeriesRegistry.seriesTypes.sma.prototype.init.apply(this, arguments);
        // Set default color for lines:
        this.options = merge({
            topLine: {
                styles: {
                    lineColor: this.color
                }
            },
            bottomLine: {
                styles: {
                    lineColor: this.color
                }
            }
        }, this.options);
    }

    public getValues <TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: KeltnerChannelsParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var period = (params.period as any),
            periodATR: number = (params.periodATR as any),
            multiplierATR: number = (params.multiplierATR as any),
            index: number = (params.index as any),
            yVal: Array<Array<number>> = series.yData as any,
            yValLen: number = yVal ? yVal.length : 0,
            // Keltner Channels array structure:
            // 0-date, 1-top line, 2-middle line, 3-bottom line
            KC: Array<Array<number>> = [],
            // middle line, top line and bottom lineI
            ML: number,
            TL: number,
            BL: number,
            date: number,
            seriesEMA: (
                IndicatorValuesObject<TLinkedSeries>|
                undefined
            ) = SeriesRegistry.seriesTypes.ema.prototype.getValues(series,
                {
                    period: period,
                    index: index
                }),
            seriesATR: (
                IndicatorValuesObject<TLinkedSeries>|undefined
            ) =
            SeriesRegistry.seriesTypes.atr.prototype.getValues(series,
                {
                    period: periodATR
                }),
            pointEMA: Array<number>,
            pointATR: Array<number>,
            xData: Array<number> = [],
            yData: Array<Array<number>> = [],
            i: number;

        if (yValLen < period) {
            return;
        }

        for (i = period; i <= yValLen; i++) {
            pointEMA = (seriesEMA as any).values[i - period];
            pointATR = (seriesATR as any).values[i - periodATR];
            date = pointEMA[0];
            TL = correctFloat(pointEMA[1] + (multiplierATR * pointATR[1]));
            BL = correctFloat(pointEMA[1] - (multiplierATR * pointATR[1]));
            ML = pointEMA[1];
            KC.push([date, TL, ML, BL]);
            xData.push(date);
            yData.push([TL, ML, BL]);
        }

        return {
            values: KC,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

interface KeltnerChannelsIndicator {
    linesApiNames: Highcharts.MultipleLinesMixin['linesApiNames'];
    nameBase: string;
    nameComponents: Array<string>;
    pointArrayMap: Highcharts.MultipleLinesMixin['pointArrayMap'];
    pointValKey: Highcharts.MultipleLinesMixin['pointValKey'];
    requiredIndicators: Array<string>;

    pointClass: typeof KeltnerChannelsPoint;

    drawGraph: typeof MultipleLinesMixin.drawGraph;
    getTranslatedLinesNames: typeof MultipleLinesMixin.getTranslatedLinesNames;
    translate: typeof MultipleLinesMixin.translate;
    toYData: typeof MultipleLinesMixin.toYData;
}
extend(KeltnerChannelsIndicator.prototype, {
    pointArrayMap: ['top', 'middle', 'bottom'],
    pointValKey: 'middle',
    nameBase: 'Keltner Channels',
    nameComponents: ['period', 'periodATR', 'multiplierATR'],
    linesApiNames: ['topLine', 'bottomLine'],
    requiredIndicators: ['ema', 'atr'],
    drawGraph: MultipleLinesMixin.drawGraph,
    getTranslatedLinesNames: MultipleLinesMixin.getTranslatedLinesNames,
    translate: MultipleLinesMixin.translate,
    toYData: MultipleLinesMixin.toYData
});

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        keltnerchannels: typeof KeltnerChannelsIndicator;
    }
}

SeriesRegistry.registerSeriesType('keltnerchannels', KeltnerChannelsIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default KeltnerChannelsIndicator;

/**
 * A Keltner Channels indicator. If the [type](#series.keltnerchannels.type)
 * option is not specified, it is inherited from[chart.type](#chart.type).
 *
 * @extends      series,plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *               joinBy, keys, navigatorOptions, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *               stacking, showInNavigator
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/keltner-channels
 * @apioption    series.keltnerchannels
 */

''; // to include the above in the js output
