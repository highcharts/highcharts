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
    SMAOptions,
    SMAParamsOptions
} from './SMA/SMAOptions';
import type SMAPoint from './SMA/SMAPoint';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = BaseSeries;
import U from '../../Core/Utilities.js';
const {
    extend,
    isArray,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {

        interface MomentumIndicatorParamsOptions
            extends SMAParamsOptions {
            // for inheritance
        }

        class MomentumIndicatorPoint extends SMAPoint {
            public series: MomentumIndicator;
        }

        interface MomentumIndicatorOptions extends SMAOptions {
            params?: MomentumIndicatorParamsOptions;
        }
    }
}

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
    public static defaultOptions: Highcharts.MomentumIndicatorOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            period: 14
        }
    } as Highcharts.MomentumIndicatorOptions);
}
/* *
 *
 *  Prototype Properties
 *
 * */

interface MomentumIndicator {
    data: Array<Highcharts.MomentumIndicatorPoint>;
    getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: Highcharts.MomentumIndicatorParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined);
    nameBase: string;
    options: Highcharts.MomentumIndicatorOptions;
    pointClass: typeof Highcharts.MomentumIndicatorPoint;
    points: Array<Highcharts.MomentumIndicatorPoint>;
} extend(MomentumIndicator.prototype, {
    getValues: function<TLinkedSeries extends LineSeries> (
        series: TLinkedSeries,
        params: Highcharts.MomentumIndicatorParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var period: number = (params.period as any),
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
});

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        momentum: typeof MomentumIndicator;
    }
}

BaseSeries.registerSeriesType('momentum', MomentumIndicator);

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
