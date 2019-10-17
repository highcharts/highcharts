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
        class AroonOscillatorIndicator extends AroonIndicator
            implements MultipleLinesMixin {
            public data: Array<AroonOscillatorIndicatorPoint>;
            public getValues(
                series: Series,
                params: AroonIndicatorParamsOptions
            ): IndicatorValuesObject;
            public init(): void;
            public nameBase: string;
            public options: AroonOscillatorIndicatorOptions;
            public pointArrayMap: MultipleLinesMixin['pointArrayMap'];
            public pointClass: typeof AroonOscillatorIndicatorPoint;
            public points: Array<AroonOscillatorIndicatorPoint>;
            public pointValKey: MultipleLinesMixin['pointValKey'];
            public linesApiNames: MultipleLinesMixin['linesApiNames'];
        }

        interface AroonOscillatorIndicatorParamsOptions
            extends AroonIndicatorParamsOptions {
            // for inheritance
        }

        class AroonOscillatorIndicatorPoint extends AroonIndicatorPoint {
            public series: AroonOscillatorIndicator;
        }

        interface AroonOscillatorIndicatorOptions
            extends AroonIndicatorOptions {
            params?: AroonOscillatorIndicatorParamsOptions;
            tooltip?: TooltipOptions;
        }

        interface SeriesTypesDictionary {
            aroonoscillator: typeof AroonOscillatorIndicator;
        }
    }
}

import multipleLinesMixin from '../mixins/multipe-lines.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var AROON = H.seriesTypes.aroon,
    requiredIndicator = requiredIndicatorMixin;

/**
 * The Aroon Oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroonoscillator
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.AroonOscillatorIndicator>(
    'aroonoscillator',
    'aroon',
    /**
     * Aroon Oscillator. This series requires the `linkedTo` option to be set
     * and should be loaded after the `stock/indicators/indicators.js` and
     * `stock/indicators/aroon.js`.
     *
     * @sample {highstock} stock/indicators/aroon-oscillator
     *         Aroon Oscillator
     *
     * @extends      plotOptions.aroon
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, aroonDown, colorAxis, compare, compareBase,
     *               joinBy, keys, navigatorOptions, pointInterval,
     *               pointIntervalUnit, pointPlacement, pointRange, pointStart,
     *               showInNavigator, stacking
     * @optionparent plotOptions.aroonoscillator
     */
    {
        /**
         * Paramters used in calculation of aroon oscillator series points.
         *
         * @excluding periods, index
         */
        params: {
            /**
             * Period for Aroon Oscillator
             *
             * @since   7.0.0
             * @product highstock
             */
            period: 25
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span><b> {series.name}</b>: {point.y}'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    H.merge(multipleLinesMixin, {
        nameBase: 'Aroon Oscillator',
        pointArrayMap: ['y'],
        pointValKey: 'y',
        linesApiNames: [],
        init: function (this: Highcharts.AroonOscillatorIndicator): void {
            var args = arguments,
                ctx = this;

            requiredIndicator.isParentLoaded(
                (AROON as any),
                'aroon',
                ctx.type,
                function (indicator: Highcharts.Indicator): undefined {
                    indicator.prototype.init.apply(ctx, args);
                    return;
                }
            );
        },
        getValues: function (
            series: Highcharts.Series,
            params: Highcharts.AroonIndicatorParamsOptions
        ): Highcharts.IndicatorValuesObject {
            // 0- date, 1- Aroon Oscillator
            var ARO: Array<[number, number]> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                aroon: Highcharts.IndicatorMultipleValuesObject,
                aroonUp: number,
                aroonDown: number,
                oscillator: number,
                i: number;

            aroon = (
                AROON.prototype.getValues.call(
                    this, series, params
                ) as Highcharts.IndicatorMultipleValuesObject);

            for (i = 0; i < aroon.yData.length; i++) {
                aroonUp = aroon.yData[i][0];
                aroonDown = aroon.yData[i][1];
                oscillator = aroonUp - aroonDown;

                ARO.push([aroon.xData[i], oscillator]);
                xData.push(aroon.xData[i]);
                yData.push(oscillator);
            }

            return {
                values: ARO,
                xData: xData,
                yData: yData
            };
        }
    })
);

/**
 * An `Aroon Oscillator` series. If the [type](#series.aroonoscillator.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.aroonoscillator
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, aroonDown, colorAxis, compare, compareBase, dataParser,
 *            dataURL, joinBy, keys, navigatorOptions, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointRange, pointStart,
 *            showInNavigator, stacking
 * @apioption series.aroonoscillator
 */

''; // adds doclet above to the transpiled file
