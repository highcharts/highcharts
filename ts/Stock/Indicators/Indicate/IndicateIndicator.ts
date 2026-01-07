/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnnotationChart from '../../../Extensions/Annotations/AnnotationChart';
import type {
    IndicateResult,
    IndicateOptions,
    IndicateParamsOptions
} from './IndicateOptions';
import type IndicatePoint from './IndicatePoint';
import type { IndicatorLinkedSeriesBase } from '../IndicatorBase';
import type IndicatorValuesObject from '../IndicatorValuesObject';
import type LineSeries from '../../../Series/Line/LineSeries';

import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
const {
    sma: SMAIndicator
} = SeriesRegistry.seriesTypes;
import U from '../../../Core/Utilities.js';
const {
    isArray,
    isObject,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

class IndicateIndicator extends SMAIndicator {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: IndicateOptions = merge(SMAIndicator.defaultOptions, {} as IndicateOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<IndicatePoint>;

    public options!: IndicateOptions;

    public points!: Array<IndicatePoint>;

    /* *
     *
     *  Functions
     *
     * */

    public getValues<TLinkedSeries extends LineSeries>(
        series: TLinkedSeries & IndicatorLinkedSeriesBase,
        params: IndicateParamsOptions
    ): (IndicatorValuesObject<TLinkedSeries> | undefined) {
        const indicateCallback = this.options.indicateCallback,
            chart = this.chart as AnnotationChart,
            period = params.period || 0,
            index = params.index || 0,
            seriesXData = series.xData || [],
            seriesYData = series.yData || [],
            xAxis = typeof this.options.xAxis === 'number' ?
                this.options.xAxis :
                0,
            yAxis = typeof this.options.yAxis === 'number' ?
                this.options.yAxis :
                0,
            periodValues: Array<[(number | null), (number | null)]> = [],
            values: Array<[(number | null), (number | null)]> = [],
            xData: Array<number> = [],
            yData: Array<(number | null)> = [];

        let result: IndicateResult,
            x: (number | null),
            y: (number | null | Array<(number | null)>);

        if (
            !indicateCallback ||
            period >= seriesYData.length
        ) {
            return;
        }

        for (let i = 0; i < period; ++i) {
            y = seriesYData[i];
            periodValues.push([
                seriesXData[i] ?? null,
                (isArray(y) ? y[index] : y) ?? null
            ]);
        }

        for (let i = period, iEnd = seriesYData.length; i < iEnd; ++i) {
            x = seriesXData[i] ?? null;
            y = seriesYData[i];
            y = (isArray(y) ? y[index] : y) ?? null;

            result = indicateCallback.call(
                this,
                {
                    series,
                    periodValues: periodValues.slice(),
                    x,
                    y
                },
                params
            );

            if (isObject(result)) {
                xData.push(result.x);
                yData.push(result.y);
                chart.addAnnotation({
                    labels: [{
                        distance: 10,
                        point: {
                            x: result.x,
                            xAxis,
                            y: result.y || 0,
                            yAxis
                        },
                        text: result.text
                    }]
                });
            } else {
                xData.push(x);
                yData.push(null);
            }

            periodValues.shift();
            periodValues.push([x, y]);
        }

        return {
            values,
            xData,
            yData
        };
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface IndicateIndicator {
    pointClass: typeof IndicatePoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        indicate: typeof IndicateIndicator;
    }
}
SeriesRegistry.registerSeriesType('indicate', IndicateIndicator);

/* *
 *
 *  Default Export
 *
 * */

export default IndicateIndicator;
