/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type IndicatorValuesObject from '../IndicatorValuesObject';
import type MomentumOptions from './MomentumOptions';
import type MomentumPoint from './MomentumPoint';
import type Series from '../../../Core/Series/Series';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    extend,
    isArray,
    merge
} = U;

/* eslint-disable require-jsdoc */

function populateAverage(
    points: Array<number>,
    xVal: Array<number>,
    yVal: Array<Array<number>>,
    i: number,
    period: number
): [number, number] {
    var mmY: number = yVal[i - 1][3] - yVal[i - period - 1][3],
        mmX: number = xVal[i - 1];

    points.shift(); // remove point until range < period

    return [mmX, mmY];
}

/* eslint-enable require-jsdoc */

/**
 * The Momentum series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.momentum
 *
 * @augments Highcharts.Series
 */
class MomentumIndicator extends SMAIndicator {
    /**
     * Momentum. This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/momentum
     *         Momentum indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/momentum
     * @optionparent plotOptions.momentum
     */
    public static defaultOptions: MomentumOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            period: 14
        }
    } as MomentumOptions);

    public data: Array<MomentumPoint> = void 0 as any;
    public options: MomentumOptions = void 0 as any;
    public points: Array<MomentumPoint> = void 0 as any;

    getValues<TLinkedSeries extends Series>(
        series: TLinkedSeries,
        params: MomentumOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var period: number = params.period,
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            xValue: number = xVal[0],
            yValue: (Array<number>|number) = yVal[0],
            MM: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            index: any,
            i: number,
            points: Array<Array<number>>,
            MMPoint: [number, number];

        if (xVal.length <= period) {
            return;
        }

        // Switch index for OHLC / Candlestick / Arearange
        if (isArray(yVal[0])) {
            yValue = (yVal[0][3] as any);
        } else {
            return;
        }
        // Starting point
        points = [
            [xValue, (yValue as any)]
        ];


        // Calculate value one-by-one for each period in visible data
        for (i = (period + 1); i < yValLen; i++) {
            MMPoint = (populateAverage as any)(
                points, xVal, yVal, i, period, index
            );
            MM.push(MMPoint);
            xData.push(MMPoint[0]);
            yData.push(MMPoint[1]);
        }

        MMPoint = (populateAverage as any)(
            points, xVal, yVal, i, period, index
        );
        MM.push(MMPoint);
        xData.push(MMPoint[0]);
        yData.push(MMPoint[1]);

        return {
            values: MM,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
}

/* *
 *
 *  Prototype Properties
 *
 * */

interface MomentumIndicator {
    pointClass: typeof MomentumPoint;
}
extend(MomentumIndicator.prototype, {
    nameBase: 'Momentum'
});

/* *
 *
 *  Registry
 *
 * */
declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        momentum: typeof MomentumIndicator;
    }
}

SeriesRegistry.registerSeriesType('momentum', MomentumIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default MomentumIndicator;


/**
 * A `Momentum` series. If the [type](#series.momentum.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.momentum
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/momentum
 * @apioption series.momentum
 */

''; // to include the above in the js output
