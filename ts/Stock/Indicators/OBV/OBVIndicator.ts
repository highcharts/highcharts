/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    OBVOptions,
    OBVParamsOptions
} from './OBVOptions';
import type OBVPoint from './OBVPoint';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
import Series from '../../../Core/Series/Series';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../../Core/Utilities.js';
const {
    isNumber,
    extend,
    merge
} = U;

/**
 * The OBV series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.obv
 *
 * @augments Highcharts.Series
 */
class OBVIndicator extends SMAIndicator {
    /**
     * On-Balance Volume (OBV) technical indicator. This series
     * requires the `linkedTo` option to be set and should be loaded after
     * the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/obv
     *         OBV indicator
     *
     * @extends      plotOptions.sma
     * @since        next
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/obv
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @optionparent plotOptions.obv
     */
    public static defaultOptions: OBVOptions = merge(SMAIndicator.defaultOptions, {
        marker: {
            enabled: false
        },
        /**
         * @excluding index, period
         */
        params: {
            volumeSeriesID: 'volume'
        },
        tooltip: {
            valueDecimals: 0
        }
    } as OBVOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<OBVPoint> = void 0 as any;
    public points: Array<OBVPoint> = void 0 as any;
    public options: OBVOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public getCloseValues(
        yVal: Array<number> | Array<Array<number>>
    ): Array<number> {
        const index: number = 3; // take close value
        let values: Array<number>;

        if (isNumber(yVal[0])) {
            // For line series.
            values = yVal as Array<number>;
        } else {
            // For OHLC series.
            values = (yVal as Array<Array<number>>).map((value: Array<number>): number => value[index]);
        }

        return values;
    }

    public getTrend(
        curentClose: number,
        previousClose: number
    ): number {
        let trend: number = void 0 as any;

        if (curentClose > previousClose) {
            trend = 1; // up
        }
        if (curentClose === previousClose) {
            trend = 0; // constant
        }
        if (curentClose < previousClose) {
            trend = -1; // down
        }

        return trend;
    }

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries,
        params: OBVParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries>|undefined) {
        const volumeSeries = series.chart.get(params.volumeSeriesID as string),
            xVal: Array<number> = (series.xData as any),
            yVal: Array<number> | Array<Array<number>> = (series.yData as any),
            OBV: Array<Array<number>> = [],
            xData: Array<number> = [],
            yData: Array<number> = [];

        let OBVPoint: Array<number> = [],
            i: number = 0,
            previousOBV: number = 0,
            curentOBV: number = 0,
            previousClose: number = 0,
            curentClose: number = 0,
            volume: Array<number>,
            closeValues: Array<number>,
            trend: number;

        // Checks if volume series exists.
        if (volumeSeries) {
            closeValues = this.getCloseValues(yVal);
            volume = ((volumeSeries as Series).yData as any);

            for (i; i < closeValues.length; i++) {
                // Add first point and qet close value.
                if (i === 0) {
                    OBVPoint = [xVal[i], previousOBV];
                    previousClose = closeValues[i];
                } else {
                    curentClose = closeValues[i];
                    trend = this.getTrend(curentClose, previousClose);

                    if (trend === 1) {
                        curentOBV = previousOBV + volume[i];
                    }
                    if (trend === 0) {
                        curentOBV = previousOBV;
                    }
                    if (trend === -1) {
                        curentOBV = previousOBV - volume[i];
                    }

                    // Add point.
                    OBVPoint = [xVal[i], curentOBV];

                    // Asing currend as previous for next iteration
                    previousOBV = curentOBV;
                    previousClose = curentClose;
                }

                OBV.push(OBVPoint);
                xData.push(xVal[i]);
                yData.push(OBVPoint[1]);
            }
        } else {
            return;
        }

        return {
            values: OBV,
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

interface OBVIndicator {
    nameComponents: Array<string>;
    pointClass: typeof OBVPoint;
}

extend(OBVIndicator.prototype, {
    nameComponents: void 0 as any
});
/* *
 *
 *  Registry
 *
 * */
declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        obv: typeof OBVIndicator;
    }
}

SeriesRegistry.registerSeriesType('obv', OBVIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default OBVIndicator;

/**
 * A `OBV` series. If the [type](#series.obv.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.obv
 * @since     next
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/obv
 * @apioption series.obv
 */

''; // to include the above in the js output
