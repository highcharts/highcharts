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
    isArray,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ATRIndicatorOptions extends SMAOptions {
            params?: ATRIndicatorParamsOptions;
        }

        interface ATRIndicatorParamsOptions extends SMAParamsOptions {
            // for inheritance
        }

        class ATRIndicatorPoint extends SMAPoint {
            public series: ATRIndicator
        }
    }
}

// im port './SMAIndicator.js';

/* eslint-enable valid-jsdoc */

/* *
 *
 * Class
 * 
 * */

/**
 * The ATR series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.atr
 *
 * @augments Highcharts.Series
 */
class ATRIndicator extends SMAIndicator {
    /**
     * Average true range indicator (ATR). This series requires `linkedTo`
     * option to be set.
     *
     * @sample stock/indicators/atr
     *         ATR indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/atr
     * @optionparent plotOptions.atr
     */
    public static defaultOptions: Highcharts.ATRIndicatorOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            period: 14
        }
    } as Highcharts.ATRIndicatorOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<Highcharts.ATRIndicatorPoint> = void 0 as any;
    public pointClass: typeof Highcharts.ATRIndicatorPoint = void 0 as any;
    public points: Array<Highcharts.ATRIndicatorPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    private accumulateAverage(
        points: Array<[number, Array<number>]>,
        xVal: Array<number>,
        yVal: Array<Array<number>>,
        i: number
    ): void {
        var xValue = xVal[i],
            yValue = yVal[i];
    
        points.push([xValue, yValue]);
    }

    private getTR(
        currentPoint: Array<number>,
        prevPoint: Array<number>
    ): number {
        var pointY = currentPoint,
            prevY = prevPoint,
            HL = pointY[1] - pointY[2],
            HCp = typeof prevY === 'undefined' ? 0 : Math.abs(pointY[1] - prevY[3]),
            LCp = typeof prevY === 'undefined' ? 0 : Math.abs(pointY[2] - prevY[3]),
            TR = Math.max(HL, HCp, LCp);
    
        return TR;
    }

    private populateAverage(
        points: Array<[number, Array<number>]>,
        xVal: Array<number>,
        yVal: Array<Array<number>>,
        i: number,
        period: number,
        prevATR: number
    ): Array<number> {
        var x = xVal[i - 1],
            TR = this.getTR(yVal[i - 1], yVal[i - 2]),
            y;
    
        y = (((prevATR * (period - 1)) + TR) / period);
    
        return [x, y];
    }

    public getValues<TLinkedSeries extends LineSeries> (
        series: TLinkedSeries,
        params: Highcharts.ATRIndicatorParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        var period: number = (params.period as any),
            xVal: Array<number> = (series.xData as any),
            yVal: Array<Array<number>> = (series.yData as any),
            yValLen: number = yVal ? yVal.length : 0,
            xValue: number = (xVal as any)[0],
            yValue: Array<number> = yVal[0],
            range = 1,
            prevATR = 0,
            TR = 0,
            ATR: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [],
            point: (Array<number>|undefined),
            i: (number|undefined),
            points: Array<[number, Array<number>]>;

        points = [[xValue, yValue]];

        if (
            (xVal.length <= period) ||
            !isArray(yVal[0]) ||
            yVal[0].length !== 4
        ) {
            return;
        }

        for (i = 1; i <= yValLen; i++) {

            this.accumulateAverage(points, xVal, yVal, i);

            if (period < range) {
                point = this.populateAverage(
                    points,
                    xVal,
                    yVal,
                    i,
                    period,
                    prevATR
                );
                prevATR = point[1];
                ATR.push(point);
                xData.push(point[0]);
                yData.push(point[1]);

            } else if (period === range) {
                prevATR = TR / (i - 1);
                ATR.push([xVal[i - 1], prevATR]);
                xData.push(xVal[i - 1]);
                yData.push(prevATR);
                range++;
            } else {
                TR += this.getTR(yVal[i - 1], yVal[i - 2]);
                range++;
            }
        }

        return {
            values: ATR,
            xData: xData,
            yData: yData
        } as IndicatorValuesObject<TLinkedSeries>;
    }
};

/* *
 *
 *  Prototype Properties
 *
 * */

interface ATRIndicator {
    pointClass: typeof Highcharts.ATRIndicatorPoint;
}

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        atr: typeof ATRIndicator;
    }
}

BaseSeries.registerSeriesType('atr', ATRIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default ATRIndicator;

/**
 * A `ATR` series. If the [type](#series.atr.type) option is not specified, it
 * is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.atr
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/atr
 * @apioption series.atr
 */

''; // to include the above in the js output
