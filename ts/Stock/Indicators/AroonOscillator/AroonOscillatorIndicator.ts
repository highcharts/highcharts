/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    AroonOscillatorOptions,
    AroonOscillatorParamsOptions
} from '../AroonOscillator/AroonOscillatorOptions';
import type AroonOscillatorPoint from '../AroonOscillator/AroonOscillatorPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type Series from '../../../Core/Series/Series';
import multipleLinesMixin from '../../../Mixins/MultipleLines.js';
import requiredIndicator from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        aroon: AroonIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

const AROON = SeriesRegistry.seriesTypes.aroon;

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
    public static defaultOptions: AroonOscillatorOptions = merge(AroonIndicator.defaultOptions, {
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
    } as AroonOscillatorOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<AroonOscillatorPoint> = void 0 as any;
    public options: AroonOscillatorOptions = void 0 as any;
    public points: Array<AroonOscillatorPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getValues<TLinkedSeries extends Series>(
        series: TLinkedSeries,
        params: AroonOscillatorParamsOptions
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

    public init(this: AroonOscillatorIndicator): void {
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
    }
}

/* *
*
*   Prototype Properties
*
* */

interface AroonOscillatorIndicator {
    nameBase: string;
    pointArrayMap: Highcharts.MultipleLinesMixin['pointArrayMap'];
    pointClass: typeof AroonOscillatorPoint;
    pointValKey: Highcharts.MultipleLinesMixin['pointValKey'];
    linesApiNames: Highcharts.MultipleLinesMixin['linesApiNames'];
}

extend(AroonOscillatorIndicator.prototype, merge(multipleLinesMixin, {
    nameBase: 'Aroon Oscillator',
    pointArrayMap: ['y'],
    pointValKey: 'y',
    linesApiNames: []
}));

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        aroonoscillator: typeof AroonOscillatorIndicator;
    }
}

SeriesRegistry.registerSeriesType('aroonoscillator', AroonOscillatorIndicator);

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
