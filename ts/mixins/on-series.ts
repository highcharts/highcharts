/* *
 *
 *  (c) 2010-2019 Torstein Honsi
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
        type OnSeriesPointType = (FlagsPoint);
        type OnSeriesType = (FlagsSeries);
        interface OnSeriesMixin {
            getPlotBox(this: OnSeriesType): SeriesPlotBoxObject;
            translate(): void;
        }
        const OnSeriesMixin: OnSeriesMixin;
    }
}

import U from '../parts/Utilities.js';
var defined = U.defined;

var seriesTypes = H.seriesTypes,
    stableSort = H.stableSort;

/**
 * @private
 * @mixin onSeriesMixin
 */
var onSeriesMixin = {

    /* eslint-disable valid-jsdoc */

    /**
     * Override getPlotBox. If the onSeries option is valid, return the plot box
     * of the onSeries, otherwise proceed as usual.
     *
     * @private
     * @function onSeriesMixin.getPlotBox
     * @return {Highcharts.SeriesPlotBoxObject}
     */
    getPlotBox: function (
        this: Highcharts.OnSeriesType
    ): Highcharts.SeriesPlotBoxObject {
        return H.Series.prototype.getPlotBox.call(
            (
                this.options.onSeries &&
                this.chart.get(this.options.onSeries)
            ) || this
        );
    },

    /**
     * Extend the translate method by placing the point on the related series
     *
     * @private
     * @function onSeriesMixin.translate
     * @return {void}
     */
    translate: function (this: Highcharts.OnSeriesType): void {

        seriesTypes.column.prototype.translate.apply(this);

        var series = this,
            options = series.options,
            chart = series.chart,
            points = series.points,
            cursor = points.length - 1,
            point,
            lastPoint,
            optionsOnSeries = options.onSeries,
            onSeries = (
                optionsOnSeries &&
                chart.get(optionsOnSeries)
            ) as Highcharts.OnSeriesType,
            onKey = options.onKey || 'y',
            step = onSeries && onSeries.options.step,
            onData = (onSeries && onSeries.points) as (
                Array<Highcharts.OnSeriesPointType>|undefined
            ),
            i = onData && onData.length,
            inverted = chart.inverted,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
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
            stableSort(points, function (
                a: Highcharts.OnSeriesPointType,
                b: Highcharts.OnSeriesPointType
            ): number {
                return ((a.x as any) - (b.x as any));
            });

            onKey = 'plot' + onKey[0].toUpperCase() + onKey.substr(1);
            while (i-- && points[cursor]) {
                leftPoint = (onData as any)[i];
                point = points[cursor];
                point.y = leftPoint.y;

                if (leftPoint.x <= (point.x as any) &&
                    leftPoint[onKey] !== undefined
                ) {
                    if ((point.x as any) <= lastX) { // #803

                        point.plotY = leftPoint[onKey];

                        // interpolate between points, #666
                        if (leftPoint.x < (point.x as any) &&
                            !step
                        ) {
                            rightPoint = (onData as any)[i + 1];
                            if (rightPoint && rightPoint[onKey] !== undefined) {
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
        points.forEach(function (
            point: Highcharts.OnSeriesPointType,
            i: number
        ): void {

            var stackIndex;

            (point.plotX as any) += xOffset; // #2049

            // Undefined plotY means the point is either on axis, outside series
            // range or hidden series. If the series is outside the range of the
            // x axis it should fall through with an undefined plotY, but then
            // we must remove the shapeArgs (#847). For inverted charts, we need
            // to calculate position anyway, because series.invertGroups is not
            // defined
            if (point.plotY === undefined || inverted) {
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
                if (lastPoint.stackIndex === undefined) {
                    lastPoint.stackIndex = 0;
                }
                stackIndex = lastPoint.stackIndex + 1;
            }
            point.stackIndex = stackIndex; // #3639
        });

        this.onSeries = onSeries;
    }

    /* eslint-enable valid-jsdoc */
};

export default onSeriesMixin;
