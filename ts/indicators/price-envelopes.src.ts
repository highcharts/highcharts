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

        class PriceEnvelopesIndicator extends SMAIndicator {
            public data: Array<PriceEnvelopesIndicatorPoint>;
            public drawGraph(): void;
            public init(): void;
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: PriceEnvelopesIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public nameBase: string;
            public options: PriceEnvelopesIndicatorOptions;
            public parallelArrays: Array<string>;
            public pointArrayMap: Array<string>;
            public pointClass: typeof PriceEnvelopesIndicatorPoint;
            public points: Array<PriceEnvelopesIndicatorPoint>;
            public pointValKey: string;
            public toYData(
                point: PriceEnvelopesIndicatorPoint
            ): [number, number, number];
            public translate(): void;
        }

        interface PriceEnvelopesIndicatorGappedExtensionObject {
            options?: PriceEnvelopesIndicatorGappedExtensionOptions;
        }

        interface PriceEnvelopesIndicatorGappedExtensionOptions {
            gapSize?: number;
        }

        interface PriceEnvelopesIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            topBand?: number;
            bottomBand?: number;
        }

        class PriceEnvelopesIndicatorPoint extends SMAIndicatorPoint {
            public bottom: number;
            public middle: number;
            public series: PriceEnvelopesIndicator;
            public plotBottom: number;
            public plotTop: number;
            public top: number;
        }

        interface PriceEnvelopesIndicatorOptions extends SMAIndicatorOptions {
            params?: PriceEnvelopesIndicatorParamsOptions;
            bottomLine?: Dictionary<CSSObject>;
            topLine?: Dictionary<CSSObject>;
        }

        interface SeriesTypesDictionary {
            priceenvelopes: typeof PriceEnvelopesIndicator;
        }

    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

var merge = H.merge,
    SMA = H.seriesTypes.sma;

/**
 * The Price Envelopes series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.priceenvelopes
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.PriceEnvelopesIndicator>(
    'priceenvelopes',
    'sma',
    /**
     * Price envelopes indicator based on [SMA](#plotOptions.sma) calculations.
     * This series requires the `linkedTo` option to be set and should be loaded
     * after the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/price-envelopes
     *         Price envelopes
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/price-envelopes
     * @optionparent plotOptions.priceenvelopes
     */
    {
        marker: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b><br/>Top: {point.top}<br/>Middle: {point.middle}<br/>Bottom: {point.bottom}<br/>'
        },
        params: {
            period: 20,
            /**
             * Percentage above the moving average that should be displayed.
             * 0.1 means 110%. Relative to the calculated value.
             */
            topBand: 0.1,
            /**
             * Percentage below the moving average that should be displayed.
             * 0.1 means 90%. Relative to the calculated value.
             */
            bottomBand: 0.1
        },
        /**
         * Bottom line options.
         */
        bottomLine: {
            styles: {
                /**
                 * Pixel width of the line.
                 */
                lineWidth: 1,
                /**
                 * Color of the line. If not set, it's inherited from
                 * [plotOptions.priceenvelopes.color](
                 * #plotOptions.priceenvelopes.color).
                 *
                 * @type {Highcharts.ColorString}
                 */
                lineColor: void 0
            }
        },
        /**
         * Top line options.
         *
         * @extends plotOptions.priceenvelopes.bottomLine
         */
        topLine: {
            styles: {
                lineWidth: 1
            }
        },
        dataGrouping: {
            approximation: 'averages'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameComponents: ['period', 'topBand', 'bottomBand'],
        nameBase: 'Price envelopes',
        pointArrayMap: ['top', 'middle', 'bottom'],
        parallelArrays: ['x', 'y', 'top', 'bottom'],
        pointValKey: 'middle',
        init: function (): void {
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
        toYData: function (
            point: Highcharts.PriceEnvelopesIndicatorPoint
        ): [number, number, number] {
            return [point.top, point.middle, point.bottom];
        },
        translate: function (this: Highcharts.PriceEnvelopesIndicator): void {
            var indicator = this,
                translatedEnvelopes = ['plotTop', 'plotMiddle', 'plotBottom'];

            SMA.prototype.translate.apply(indicator);

            indicator.points.forEach(
                function (
                    point: Highcharts.PriceEnvelopesIndicatorPoint
                ): void {
                    [point.top, point.middle, point.bottom].forEach(
                        function (value: number, i: number): void {
                            if (value !== null) {
                                (point as any)[translatedEnvelopes[i]] =
                                    indicator.yAxis.toPixels(value, true);
                            }
                        }
                    );
                }
            );
        },
        drawGraph: function (this: Highcharts.PriceEnvelopesIndicator): void {
            var indicator = this,
                middleLinePoints: Array<
                Highcharts.PriceEnvelopesIndicatorPoint
                > = indicator.points,
                pointsLength: number = middleLinePoints.length,
                middleLineOptions: Highcharts.PriceEnvelopesIndicatorOptions = (
                    indicator.options
                ),
                middleLinePath: (
                    Highcharts.SVGElement|undefined
                ) = indicator.graph,
                gappedExtend:
                Highcharts.PriceEnvelopesIndicatorGappedExtensionObject = {
                    options: {
                        gapSize: middleLineOptions.gapSize
                    }
                },
                deviations: Array<Array<(
                    Partial<Highcharts.PriceEnvelopesIndicatorPoint>
                )>> = [[], []], // top and bottom point place holders
                point: Highcharts.PriceEnvelopesIndicatorPoint;

            // Generate points for top and bottom lines:
            while (pointsLength--) {
                point = middleLinePoints[pointsLength];
                deviations[0].push({
                    plotX: point.plotX,
                    plotY: point.plotTop,
                    isNull: point.isNull
                });
                deviations[1].push({
                    plotX: point.plotX,
                    plotY: point.plotBottom,
                    isNull: point.isNull
                });
            }

            // Modify options and generate lines:
            ['topLine', 'bottomLine'].forEach(
                function (lineName: string, i: number): void {
                    indicator.points = (deviations[i] as any);
                    indicator.options = merge(
                        (middleLineOptions as any)[lineName].styles,
                        gappedExtend
                    );
                    indicator.graph = (indicator as any)['graph' + lineName];
                    SMA.prototype.drawGraph.call(indicator);

                    // Now save lines:
                    (indicator as any)['graph' + lineName] = indicator.graph;
                }
            );

            // Restore options and draw a middle line:
            indicator.points = middleLinePoints;
            indicator.options = middleLineOptions;
            indicator.graph = middleLinePath;
            SMA.prototype.drawGraph.call(indicator);
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            series: TLinkedSeries,
            params: Highcharts.PriceEnvelopesIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                topPercent: number = (params.topBand as any),
                botPercent: number = (params.bottomBand as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                // 0- date, 1-top line, 2-middle line, 3-bottom line
                PE: Array<Array<number>> = [],
                // middle line, top line and bottom line
                ML: number,
                TL: number,
                BL: number,
                date: number,
                xData: Array<number> = [],
                yData: Array<Array<number>> = [],
                slicedX: Array<number>,
                slicedY: Array<Array<number>>,
                point: Highcharts.IndicatorValuesObject<TLinkedSeries>,
                i: number;

            // Price envelopes requires close value
            if (
                xVal.length < period ||
                !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return;
            }

            for (i = period; i <= yValLen; i++) {
                slicedX = xVal.slice(i - period, i);
                slicedY = yVal.slice(i - period, i);

                point = (SMA.prototype.getValues.call(this, ({
                    xData: slicedX,
                    yData: slicedY
                } as any), params) as any);

                date = (point as any).xData[0];
                ML = (point as any).yData[0];
                TL = ML * (1 + topPercent);
                BL = ML * (1 - botPercent);
                PE.push([date, TL, ML, BL]);
                xData.push(date);
                yData.push([TL, ML, BL]);
            }

            return {
                values: PE,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        }
    }
);

/**
 * A price envelopes indicator. If the [type](#series.priceenvelopes.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.priceenvelopes
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/price-envelopes
 * @apioption series.priceenvelopes
 */

''; // to include the above in the js output
