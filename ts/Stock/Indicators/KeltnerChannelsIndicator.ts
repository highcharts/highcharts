/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const {
    correctFloat,
    merge,
    seriesType
} = U;

import multipleLinesMixin from '../../mixins/multipe-lines.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class KeltnerChannelsIndicator
            extends SMAIndicator implements MultipleLinesIndicator {
            public data: Array<KeltnerChannelsIndicatorPoint>;
            public linesApiNames: MultipleLinesMixin['linesApiNames'];
            public nameBase: string;
            public nameComponents: Array<string>;
            public options: KeltnerChannelsIndicatorOptions;
            public pointArrayMap: MultipleLinesMixin['pointArrayMap'];
            public pointClass: typeof KeltnerChannelsIndicatorPoint;
            public points: Array<KeltnerChannelsIndicatorPoint>;
            public pointValKey: MultipleLinesMixin['pointValKey'];
            public requiredIndicators: Array<string>;
            public getTranslatedLinesNames: MultipleLinesMixin[
                'getTranslatedLinesNames'
            ];
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: KeltnerChannelsIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined)
        }

        interface KeltnerChannelsIndicatorOptions
            extends SMAIndicatorOptions, MultipleLinesIndicatorOptions {
            bottomLine?: Dictionary<CSSObject>;
            marker?: PointMarkerOptionsObject;
            params?: KeltnerChannelsIndicatorParamsOptions;
            tooltip?: TooltipOptions;
            topLine?: Dictionary<CSSObject>;
        }

        interface KeltnerChannelsIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            periodATR?: number;
            multiplierATR?: number;
        }

        interface KeltnerChannelsLinkedParentSeries extends Series {
            yData: Array<Array<number>>;
        }

        class KeltnerChannelsIndicatorPoint extends SMAIndicatorPoint {
            public series: KeltnerChannelsIndicator;
        }

        interface SeriesTypesDictionary {
            keltnerchannels: typeof KeltnerChannelsIndicator;
        }
    }
}


var SMA = H.seriesTypes.sma,
    EMA = H.seriesTypes.ema,
    ATR = H.seriesTypes.atr;

/**
 * The Keltner Channels series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.keltnerchannels
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.KeltnerChannelsIndicator>(
    'keltnerchannels',
    'sma',
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
    {
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
    },
    /**
     * @lends Highcharts.Series#
     */
    merge(multipleLinesMixin, {
        pointArrayMap: ['top', 'middle', 'bottom'],
        pointValKey: 'middle',
        nameBase: 'Keltner Channels',
        nameComponents: ['period', 'periodATR', 'multiplierATR'],
        linesApiNames: ['topLine', 'bottomLine'],
        requiredIndicators: ['ema', 'atr'],
        init: function (this: Highcharts.KeltnerChannelsIndicator): void {
            SMA.prototype.init.apply(this, arguments);
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
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.KeltnerChannelsIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
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
                    Highcharts.IndicatorValuesObject<TLinkedSeries>|
                    undefined
                ) = EMA.prototype.getValues(series,
                    {
                        period: period,
                        index: index
                    }),
                seriesATR: (
                    Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined
                ) =
                    ATR.prototype.getValues(series,
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
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    })
);

/**
 * A Keltner Channels indicator. If the [type](#series.keltnerchannels.type)
 * option is not specified, it is inherited from[chart.type](#chart.type).
 *
 * @extends      series,plotOptions.keltnerchannels
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
