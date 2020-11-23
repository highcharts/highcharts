/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from './IndicatorValuesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import type {
    AroonOptions,
    AroonParamsOptions
} from './Aroon/AroonOptions';
import type AroonPoint from './Aroon/AroonPoint';
const {
    seriesTypes: {
        aroon: AroonIndicator
    }
} = BaseSeries;
import BaseSeries from '../../Core/Series/Series.js';
import multipleLinesMixin from '../../Mixins/MultipleLines.js';
import requiredIndicator from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface AroonOscillatorIndicatorParamsOptions
            extends AroonParamsOptions {
            // for inheritance
        }

        class AroonOscillatorIndicatorPoint extends AroonPoint {
            public series: AroonOscillatorIndicator;
        }

        interface AroonOscillatorIndicatorOptions
            extends AroonOptions {
            params?: AroonOscillatorIndicatorParamsOptions;
            tooltip?: TooltipOptions;
        }
    }
}

const AROON = BaseSeries.seriesTypes.aroon;

/* *
 *
 *  Class
 *
 * */

/**
 * The Aroon Oscillator series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.aroonoscillator
 *
 * @augments Highcharts.Series
 */
class AroonOscillatorIndicator extends AroonIndicator implements Highcharts.MultipleLinesIndicator {
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
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/aroon
     * @requires     stock/indicators/aroon-oscillator
     * @optionparent plotOptions.aroonoscillator
     */
    public static defaultOptions: Highcharts.AroonOscillatorIndicatorOptions = merge(AroonIndicator.defaultOptions, {
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
    } as Highcharts.AroonOscillatorIndicatorOptions);
}

/* *
*
*   Prototype Properties
*
* */

interface AroonOscillatorIndicator {
    data: Array<Highcharts.AroonOscillatorIndicatorPoint>;
    getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: AroonParamsOptions
    ): IndicatorValuesObject<TLinkedSeries>;
    init(): void;
    nameBase: string;
    options: Highcharts.AroonOscillatorIndicatorOptions;
    pointArrayMap: Highcharts.MultipleLinesMixin['pointArrayMap'];
    pointClass: typeof Highcharts.AroonOscillatorIndicatorPoint;
    points: Array<Highcharts.AroonOscillatorIndicatorPoint>;
    pointValKey: Highcharts.MultipleLinesMixin['pointValKey'];
    linesApiNames: Highcharts.MultipleLinesMixin['linesApiNames'];
}

extend(AroonOscillatorIndicator.prototype, merge(multipleLinesMixin, {
    nameBase: 'Aroon Oscillator',
    pointArrayMap: ['y'],
    pointValKey: 'y',
    linesApiNames: [],
    init: function (this: AroonOscillatorIndicator): void {
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
    getValues: function<TLinkedSeries extends LineSeries> (
        series: TLinkedSeries,
        params: AroonParamsOptions
    ): IndicatorValuesObject<TLinkedSeries> {
        // 0- date, 1- Aroon Oscillator
        var ARO: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            aroon: IndicatorValuesObject<TLinkedSeries>,
            aroonUp: number,
            aroonDown: number,
            oscillator: number,
            i: number;

        aroon = (
            AROON.prototype.getValues.call(
                this, series, params
            ) as IndicatorValuesObject<TLinkedSeries>);

        for (i = 0; i < aroon.yData.length; i++) {
            aroonUp = (aroon.yData[i] as any)[0];
            aroonDown = (aroon.yData[i] as any)[1];
            oscillator = aroonUp - aroonDown;

            ARO.push([aroon.xData[i], oscillator]);
            xData.push(aroon.xData[i]);
            yData.push(oscillator);
        }

        return {
            values: ARO,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}));

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        aroonoscillator: typeof AroonOscillatorIndicator;
    }
}

BaseSeries.registerSeriesType('aroonoscillator', AroonOscillatorIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default AroonOscillatorIndicator;

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
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/aroon
 * @requires  stock/indicators/aroon-oscillator
 * @apioption series.aroonoscillator
 */

''; // adds doclet above to the transpiled file
