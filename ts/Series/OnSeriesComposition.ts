/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type CoreSeriesOptions from '../Core/Series/SeriesOptions';
import type Point from '../Core/Series/Point';

import ColumnSeries from './Column/ColumnSeries.js';
const { prototype: columnProto } = ColumnSeries;
import Series from '../Core/Series/Series.js';
const { prototype: seriesProto } = Series;
import U from '../Core/Utilities.js';
const {
    defined,
    stableSort
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace OnSeriesComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class PointComposition extends Point {
        stackIndex?: number;
    }

    export declare class SeriesComposition extends Series {
        options: SeriesOptions;
        onSeries?: SeriesComposition;
        points: Array<PointComposition>;
    }

    export interface SeriesOptions extends CoreSeriesOptions {
        onSeries?: (string|null);
    }

    /* *
     *
     *  Properties
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose<T extends typeof Series>(
        SeriesClass: T
    ): (T&SeriesComposition) {

        if (U.pushUnique(composedMembers, SeriesClass)) {
            const seriesProto = SeriesClass.prototype as SeriesComposition;

            seriesProto.getPlotBox = getPlotBox;
            seriesProto.translate = translate;
        }

        return SeriesClass as (T&SeriesComposition);
    }

    /**
     * Override getPlotBox. If the onSeries option is valid, return the plot box
     * of the onSeries, otherwise proceed as usual.
     *
     * @private
     */
    export function getPlotBox(
        this: SeriesComposition,
        name?: string
    ): Series.PlotBoxTransform {
        return seriesProto.getPlotBox.call(
            (
                this.options.onSeries &&
                this.chart.get(this.options.onSeries)
            ) || this,
            name
        );
    }

    /**
     * Extend the translate method by placing the point on the related series
     *
     * @private
     */
    export function translate(
        this: SeriesComposition
    ): void {

        columnProto.translate.apply(this);

        const series = this,
            options = series.options,
            chart = series.chart,
            points = series.points,
            optionsOnSeries = options.onSeries,
            onSeries: (SeriesComposition|undefined) = (
                optionsOnSeries &&
                chart.get(optionsOnSeries)
            ) as any,
            step = onSeries && onSeries.options.step,
            onData: (Array<PointComposition>|undefined) =
                 (onSeries && onSeries.points),
            inverted = chart.inverted,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        let cursor = points.length - 1,
            point: PointComposition,
            lastPoint: (PointComposition|undefined),
            onKey = (options as any).onKey || 'y',
            i = onData && onData.length,
            xOffset = 0,
            leftPoint,
            lastX,
            rightPoint,
            currentDataGrouping,
            distanceRatio;

        // relate to a master series
        if (onSeries && onSeries.visible && i) {
            xOffset = (onSeries.pointXOffset || 0) + (onSeries.barW || 0) / 2;
            currentDataGrouping = onSeries.currentDataGrouping;
            lastX = (
                (onData as any)[i - 1].x +
                (currentDataGrouping ? currentDataGrouping.totalRange : 0)
            ); // #2374

            // sort the data points
            stableSort(points, (a, b): number => ((a.x as any) - (b.x as any)));

            onKey = 'plot' + onKey[0].toUpperCase() + onKey.substr(1);
            while (i-- && points[cursor]) {
                leftPoint = (onData as any)[i];
                point = points[cursor];
                point.y = leftPoint.y;

                if (
                    leftPoint.x <= (point.x as any) &&
                    typeof leftPoint[onKey] !== 'undefined'
                ) {
                    if ((point.x as any) <= lastX) { // #803

                        point.plotY = leftPoint[onKey];

                        // interpolate between points, #666
                        if (leftPoint.x < (point.x as any) &&
                            !step
                        ) {
                            rightPoint = (onData as any)[i + 1];
                            if (
                                rightPoint &&
                                typeof rightPoint[onKey] !== 'undefined'
                            ) {
                                // the distance ratio, between 0 and 1
                                distanceRatio =
                                    ((point.x as any) - leftPoint.x) /
                                    (rightPoint.x - leftPoint.x);
                                (point.plotY as any) +=
                                    distanceRatio *
                                    // the plotY distance
                                    (rightPoint[onKey] - leftPoint[onKey]);
                                (point.y as any) +=
                                    distanceRatio *
                                    (rightPoint.y - leftPoint.y);
                            }
                        }
                    }
                    cursor--;
                    i++; // check again for points in the same x position
                    if (cursor < 0) {
                        break;
                    }
                }
            }
        }

        // Add plotY position and handle stacking
        points.forEach((point, i): void => {

            let stackIndex;

            (point.plotX as any) += xOffset; // #2049

            // Undefined plotY means the point is either on axis, outside series
            // range or hidden series. If the series is outside the range of the
            // x axis it should fall through with an undefined plotY, but then
            // we must remove the shapeArgs (#847). For inverted charts, we need
            // to calculate position anyway, because series.invertGroups is not
            // defined
            if (typeof point.plotY === 'undefined' || inverted) {
                if ((point.plotX as any) >= 0 &&
                    (point.plotX as any) <= xAxis.len
                ) {
                    // We're inside xAxis range
                    if (inverted) {
                        point.plotY = xAxis.translate(
                            (point.x as any),
                            0 as any,
                            1 as any,
                            0 as any,
                            1 as any
                        );
                        point.plotX = defined(point.y) ?
                            yAxis.translate(
                                point.y,
                                0 as any,
                                0 as any,
                                0 as any,
                                1 as any
                            ) :
                            0;
                    } else {
                        point.plotY = (xAxis.opposite ? 0 : series.yAxis.len) +
                            xAxis.offset; // For the windbarb demo
                    }
                } else {
                    point.shapeArgs = {}; // 847
                }
            }

            // if multiple flags appear at the same x, order them into a stack
            lastPoint = points[i - 1];
            if (lastPoint && lastPoint.plotX === point.plotX) {
                if (typeof lastPoint.stackIndex === 'undefined') {
                    lastPoint.stackIndex = 0;
                }
                stackIndex = lastPoint.stackIndex + 1;
            }
            point.stackIndex = stackIndex; // #3639
        });

        this.onSeries = onSeries;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default OnSeriesComposition;
