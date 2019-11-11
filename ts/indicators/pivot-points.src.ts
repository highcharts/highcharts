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
        class PivotPointsIndicator extends SMAIndicator {
            public camarillaPlacement(
                values: Array<number>
            ): Array<number>;
            public data: Array<PivotPointsIndicatorPoint>;
            public endPoint: number;
            public fibonacciPlacement(
                values: Array<number>
            ): Array<(number|null)>;
            public getPivotAndHLC(
                values: Array<Array<number>>
            ): [number, number, number, number];
            public getValues<TLinkedSeries extends Series>(
                series: TLinkedSeries,
                params: PivotPointsIndicatorParamsOptions
            ): (IndicatorValuesObject<TLinkedSeries>|undefined);
            public nameBase: string;
            public options: PivotPointsIndicatorOptions;
            public plotEndPoint: number;
            public pointArrayMap: Array<string>;
            public pointClass: typeof PivotPointsIndicatorPoint;
            public points: Array<PivotPointsIndicatorPoint>;
            public pointValKey: string;
            public standardPlacement(
                values: Array<number>
            ): Array<(number|null)>
            public toYData(point: Point): Array<number>;
            public translate(): void;
        }

        interface PivotPointsIndicatorParamsOptions
            extends SMAIndicatorParamsOptions {
            algorithm?: string;
        }

        class PivotPointsIndicatorPoint extends SMAIndicatorPoint {
            public destroy(): void;
            public destroyElements(): void;
            public P: number;
            public pivotLine: string;
            public series: PivotPointsIndicator;
        }

        interface PivotPointsIndicatorOptions extends SMAIndicatorOptions {
            params?: PivotPointsIndicatorParamsOptions;
        }

        interface SeriesTypesDictionary {
            pivotpoints: typeof PivotPointsIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var defined = U.defined,
    isArray = U.isArray;

var SMA = H.seriesTypes.sma;

/* eslint-disable valid-jsdoc */

/**
 * @private
 */
function destroyExtraLabels(
    point: Highcharts.PivotPointsIndicatorPoint,
    functionName: string
): void {
    var props: Array<string> = point.series.pointArrayMap,
        prop: string,
        i: number = props.length;

    (SMA.prototype.pointClass.prototype as any)[functionName].call(point);

    while (i--) {
        prop = 'dataLabel' + props[i];
        // S4 dataLabel could be removed by parent method:
        if ((point as any)[prop] && (point as any)[prop].element) {
            (point as any)[prop].destroy();
        }
        (point as any)[prop] = null;
    }
}

/* eslint-enable valid-jsdoc */

/**
 * The Pivot Points series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pivotpoints
 *
 * @augments Highcharts.Series
 */
H.seriesType<Highcharts.PivotPointsIndicator>(
    'pivotpoints',
    'sma',
    /**
     * Pivot points indicator. This series requires the `linkedTo` option to be
     * set and should be loaded after `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/pivot-points
     *         Pivot points
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/pivotpoints
     * @optionparent plotOptions.pivotpoints
     */
    {
        /**
         * @excluding index
         */
        params: {
            period: 28,
            /**
             * Algorithm used to calculate ressistance and support lines based
             * on pivot points. Implemented algorithms: `'standard'`,
             * `'fibonacci'` and `'camarilla'`
             */
            algorithm: 'standard'
        },
        marker: {
            enabled: false
        },
        enableMouseTracking: false,
        dataLabels: {
            enabled: true,
            format: '{point.pivotLine}'
        },
        dataGrouping: {
            approximation: 'averages'
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Pivot Points',
        pointArrayMap: ['R4', 'R3', 'R2', 'R1', 'P', 'S1', 'S2', 'S3', 'S4'],
        pointValKey: 'P',
        toYData: function (
            point: Highcharts.PivotPointsIndicatorPoint
        ): Array<number> {
            return [point.P]; // The rest should not affect extremes
        },
        translate: function (this: Highcharts.PivotPointsIndicator): void {
            var indicator = this;

            SMA.prototype.translate.apply(indicator);

            indicator.points.forEach(
                function (
                    point: Highcharts.PivotPointsIndicatorPoint
                ): void {
                    indicator.pointArrayMap.forEach(
                        function (value: string): void {
                            if (defined((point as any)[value])) {
                                (point as any)['plot' + value] = (
                                    indicator.yAxis.toPixels(
                                        (point as any)[value],
                                        true
                                    )
                                );
                            }
                        }
                    );
                }
            );

            // Pivot points are rendered as horizontal lines
            // And last point start not from the next one (as it's the last one)
            // But from the approximated last position in a given range
            indicator.plotEndPoint = indicator.xAxis.toPixels(
                indicator.endPoint,
                true
            );
        },
        getGraphPath: function (
            this: Highcharts.PivotPointsIndicator,
            points: Array<Highcharts.Point>
        ): Highcharts.SVGPathArray {
            var indicator = this,
                pointsLength: number = points.length,
                allPivotPoints: Array<Array<Highcharts.Point>> = (
                    [[], [], [], [], [], [], [], [], []]
                ),
                path: Highcharts.SVGPathArray = [],
                endPoint: (number|undefined) = indicator.plotEndPoint,
                pointArrayMapLength: number = indicator.pointArrayMap.length,
                position: string,
                point: Highcharts.Point,
                i: number;

            while (pointsLength--) {
                point = points[pointsLength];
                for (i = 0; i < pointArrayMapLength; i++) {
                    position = indicator.pointArrayMap[i];

                    if (defined((point as any)[position])) {
                        allPivotPoints[i].push(({
                            // Start left:
                            plotX: point.plotX,
                            plotY: (point as any)['plot' + position],
                            isNull: false
                        } as any), ({
                            // Go to right:
                            plotX: endPoint,
                            plotY: (point as any)['plot' + position],
                            isNull: false
                        } as any), ({
                            // And add null points in path to generate breaks:
                            plotX: endPoint,
                            plotY: null,
                            isNull: true
                        } as any));
                    }
                }
                endPoint = point.plotX;
            }

            allPivotPoints.forEach(function (
                pivotPoints: Array<Highcharts.Point>
            ): void {
                path = path.concat(
                    SMA.prototype.getGraphPath.call(indicator, pivotPoints)
                );
            });

            return path;
        },
        // TODO: Rewrite this logic to use multiple datalabels
        drawDataLabels: function (this: Highcharts.PivotPointsIndicator): void {
            var indicator = this,
                pointMapping: Array<(string|boolean)> = indicator.pointArrayMap,
                currentLabel: (Highcharts.SVGElement|null),
                pointsLength: number,
                point: Highcharts.PivotPointsIndicatorPoint,
                i: number;

            if ((indicator.options as any).dataLabels.enabled) {
                pointsLength = indicator.points.length;

                // For every Ressitance/Support group we need to render labels.
                // Add one more item, which will just store dataLabels from
                // previous iteration
                pointMapping.concat([false]).forEach(
                    function (position: (string|boolean), k: number): void {
                        i = pointsLength;
                        while (i--) {
                            point = indicator.points[i];

                            if (!position) {
                                // Store S4 dataLabel too:
                                (point as any)[
                                    'dataLabel' + pointMapping[k - 1]
                                ] =
                                    point.dataLabel;
                            } else {
                                point.y = (point as any)[(position as any)];
                                point.pivotLine = (position as any);
                                point.plotY = (point as any)['plot' + position];
                                currentLabel = (point as any)[
                                    'dataLabel' + position
                                ];

                                // Store previous label
                                if (k) {
                                    (point as any)[
                                        'dataLabel' + pointMapping[k - 1]
                                    ] = point.dataLabel;
                                }

                                if (!point.dataLabels) {
                                    point.dataLabels = [];
                                }
                                (point.dataLabels[0] as any) = (
                                    point.dataLabel as any
                                ) =
                                    currentLabel =
                                    currentLabel && currentLabel.element ?
                                        currentLabel :
                                        null;
                            }
                        }
                        SMA.prototype.drawDataLabels.apply(
                            indicator, arguments
                        );
                    }
                );
            }
        },
        getValues: function<TLinkedSeries extends Highcharts.Series> (
            this: Highcharts.PivotPointsIndicator,
            series: TLinkedSeries,
            params: Highcharts.PivotPointsIndicatorParamsOptions
        ): (Highcharts.IndicatorValuesObject<TLinkedSeries>|undefined) {
            var period: number = (params.period as any),
                xVal: Array<number> = (series.xData as any),
                yVal: Array<Array<number>> = (series.yData as any),
                yValLen: number = yVal ? yVal.length : 0,
                placement: Function = (this as any)[
                    params.algorithm + 'Placement'
                ],
                // 0- from, 1- to, 2- R1, 3- R2, 4- pivot, 5- S1 etc.
                PP: Array<Array<number>> = [],
                endTimestamp: (number|undefined),
                xData: Array<number> = [],
                yData: Array<Array<number>> = [],
                slicedXLen: (number|undefined),
                slicedX: (Array<number>|undefined),
                slicedY: Array<Array<number>>,
                lastPP: number,
                pivot: [number, number, number, number],
                avg: Array<number>,
                i: number;

            // Pivot Points requires high, low and close values
            if (
                xVal.length < period ||
                !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return;
            }

            for (i = period + 1; i <= yValLen + period; i += period) {
                slicedX = xVal.slice(i - period - 1, i);
                slicedY = yVal.slice(i - period - 1, i);

                slicedXLen = slicedX.length;

                endTimestamp = slicedX[slicedXLen - 1];

                pivot = this.getPivotAndHLC(slicedY);
                avg = placement(pivot);

                lastPP = PP.push(
                    [endTimestamp]
                        .concat(avg)
                );

                xData.push(endTimestamp);
                yData.push(PP[lastPP - 1].slice(1));
            }

            // We don't know exact position in ordinal axis
            // So we use simple logic:
            // Get first point in last range, calculate visible average range
            // and multiply by period
            this.endPoint = (slicedX as any)[0] + (
                ((endTimestamp as any) - (slicedX as any)[0]) /
                (slicedXLen as any)
            ) * period;

            return {
                values: PP,
                xData: xData,
                yData: yData
            } as Highcharts.IndicatorValuesObject<TLinkedSeries>;
        },
        getPivotAndHLC: function (
            values: Array<Array<number>>
        ): [number, number, number, number] {
            var high = -Infinity,
                low = Infinity,
                close: number = values[values.length - 1][3],
                pivot: number;

            values.forEach(function (p: Array<number>): void {
                high = Math.max(high, p[1]);
                low = Math.min(low, p[2]);
            });
            pivot = (high + low + close) / 3;

            return [pivot, high, low, close];
        },
        standardPlacement: function (
            values: Array<number>
        ): Array<(number|null)> {
            var diff: number = values[1] - values[2],
                avg: Array<(number|null)> = [
                    null,
                    null,
                    values[0] + diff,
                    values[0] * 2 - values[2],
                    values[0],
                    values[0] * 2 - values[1],
                    values[0] - diff,
                    null,
                    null
                ];

            return avg;
        },
        camarillaPlacement: function (
            values: Array<number>
        ): Array<number> {
            var diff: number = values[1] - values[2],
                avg = [
                    values[3] + diff * 1.5,
                    values[3] + diff * 1.25,
                    values[3] + diff * 1.1666,
                    values[3] + diff * 1.0833,
                    values[0],
                    values[3] - diff * 1.0833,
                    values[3] - diff * 1.1666,
                    values[3] - diff * 1.25,
                    values[3] - diff * 1.5
                ];

            return avg;
        },
        fibonacciPlacement: function (
            values: Array<number>
        ): Array<(number|null)> {
            var diff: number = values[1] - values[2],
                avg = [
                    null,
                    values[0] + diff,
                    values[0] + diff * 0.618,
                    values[0] + diff * 0.382,
                    values[0],
                    values[0] - diff * 0.382,
                    values[0] - diff * 0.618,
                    values[0] - diff,
                    null
                ];

            return avg;
        }
    },
    /**
     * @lends Highcharts.Point#
     */
    {
        // Destroy labels:
        // This method is called when cropping data:
        destroyElements: function (
            this: Highcharts.PivotPointsIndicatorPoint
        ): void {
            destroyExtraLabels(this, 'destroyElements');
        },
        // This method is called when removing points, e.g. series.update()
        destroy: function (
            this: Highcharts.PivotPointsIndicatorPoint
        ): void {
            destroyExtraLabels(this, 'destroyElements');
        }
    }
);

/**
 * A pivot points indicator. If the [type](#series.pivotpoints.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pivotpoints
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/pivotpoints
 * @apioption series.pivotpoints
 */

''; // to include the above in the js output'
