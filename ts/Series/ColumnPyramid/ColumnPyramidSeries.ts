/* *
 *
 *  (c) 2010-2021 Sebastian Bochan
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

import type ColumnPyramidPoint from './ColumnPyramidPoint';
import type ColumnPyramidSeriesOptions from './ColumnPyramidSeriesOptions';

import ColumnPyramidSeriesDefaults from './ColumnPyramidSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    column: ColumnSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    clamp,
    merge,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The ColumnPyramidSeries class
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.columnpyramid
 *
 * @augments Highcharts.Series
 */
class ColumnPyramidSeries extends ColumnSeries {

    /* *
     *
     *  Static properties
     *
     * */

    public static defaultOptions: ColumnPyramidSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        ColumnPyramidSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<ColumnPyramidPoint> = void 0 as any;

    public options: ColumnPyramidSeriesOptions = void 0 as any;

    public points: Array<ColumnPyramidPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Overrides the column translate method
     * @private
     */
    public translate(): void {
        const series = this,
            chart = series.chart,
            options = series.options,
            dense = series.dense =
                (series.closestPointRange as any) * series.xAxis.transA < 2,
            borderWidth = series.borderWidth = pick(
                options.borderWidth,
                dense ? 0 : 1 // #3635
            ),
            yAxis = series.yAxis,
            threshold = options.threshold,
            minPointLength = pick(options.minPointLength, 5),
            metrics = series.getColumnMetrics(),
            pointWidth = metrics.width,
            pointXOffset = series.pointXOffset = metrics.offset;

        let translatedThreshold = series.translatedThreshold =
                yAxis.getThreshold(threshold as any),
            // postprocessed for border width
            seriesBarW = series.barW =
                Math.max(pointWidth, 1 + 2 * borderWidth);

        if (chart.inverted) {
            (translatedThreshold as any) -= 0.5; // #3355
        }

        // When the pointPadding is 0,
        // we want the pyramids to be packed tightly,
        // so we allow individual pyramids to have individual sizes.
        // When pointPadding is greater,
        // we strive for equal-width columns (#2694).
        if (options.pointPadding) {
            seriesBarW = Math.ceil(seriesBarW);
        }

        super.translate();

        // Record the new values
        for (const point of series.points) {
            const yBottom = pick<number|undefined, number>(
                    point.yBottom, translatedThreshold as any
                ),
                safeDistance = 999 + Math.abs(yBottom),
                plotY = clamp(
                    point.plotY as any,
                    -safeDistance,
                    yAxis.len + safeDistance
                ),
                // Don't draw too far outside plot area
                // (#1303, #2241, #4264)
                barW = seriesBarW / 2,
                barY = Math.min(plotY, yBottom),
                barH = Math.max(plotY, yBottom) - barY;

            let barX = (point.plotX as any) + pointXOffset,
                stackTotal: number,
                stackHeight: number,
                topPointY: number,
                topXwidth: number,
                bottomXwidth: number,
                invBarPos: number,
                x1, x2, x3, x4, y1, y2;

            // Adjust for null or missing points
            if (options.centerInCategory) {
                barX = series.adjustForMissingColumns(
                    barX,
                    pointWidth,
                    point,
                    metrics
                );
            }

            point.barX = barX;
            point.pointWidth = pointWidth;

            // Fix the tooltip on center of grouped pyramids
            // (#1216, #424, #3648)
            point.tooltipPos = chart.inverted ?
                [
                    yAxis.len + (yAxis.pos as any) - chart.plotLeft - plotY,
                    series.xAxis.len - barX - barW,
                    barH
                ] :
                [
                    barX + barW,
                    plotY + (yAxis.pos as any) - chart.plotTop,
                    barH
                ];

            stackTotal =
                (threshold as any) + ((point.total || point.y) as any);

            // overwrite stacktotal (always 100 / -100)
            if (options.stacking === 'percent') {
                stackTotal =
                    (threshold as any) + ((point.y as any) < 0) ?
                        -100 :
                        100;
            }

            // get the highest point (if stack, extract from total)
            topPointY = yAxis.toPixels((stackTotal), true);

            // calculate height of stack (in pixels)
            stackHeight =
                chart.plotHeight - topPointY -
                (chart.plotHeight - (translatedThreshold as any));

            // topXwidth and bottomXwidth = width of lines from the center
            // calculated from tanges proportion.
            // Cannot be a NaN #12514
            topXwidth = stackHeight ?
                (barW * (barY - topPointY)) / stackHeight : 0;
            // like topXwidth, but with height of point
            bottomXwidth = stackHeight ?
                (barW * (barY + barH - topPointY)) / stackHeight :
                0;

            /*
                    /\
                   /  \
            x1,y1,------ x2,y1
                /       \
               -----------
            x4,y2        x3,y2
            */

            x1 = barX - topXwidth + barW;
            x2 = barX + topXwidth + barW;
            x3 = barX + bottomXwidth + barW;
            x4 = barX - bottomXwidth + barW;

            y1 = barY - minPointLength;
            y2 = barY + barH;

            if ((point.y as any) < 0) {
                y1 = barY;
                y2 = barY + barH + minPointLength;
            }

            // inverted chart
            if (chart.inverted) {
                invBarPos = yAxis.width - barY;
                stackHeight =
                    topPointY - (yAxis.width - (translatedThreshold as any));

                // proportion tanges
                topXwidth = (barW *
                (topPointY - invBarPos)) / stackHeight;
                bottomXwidth = (barW *
                (topPointY - (invBarPos - barH))) / stackHeight;

                x1 = barX + barW + topXwidth; // top bottom
                x2 = x1 - 2 * topXwidth; // top top
                x3 = barX - bottomXwidth + barW; // bottom top
                x4 = barX + bottomXwidth + barW; // bottom bottom

                y1 = barY;
                y2 = barY + barH - minPointLength;

                if ((point.y as any) < 0) {
                    y2 = barY + barH + minPointLength;
                }
            }

            // Register shape type and arguments to be used in drawPoints
            point.shapeType = 'path';
            point.shapeArgs = { // args for datalabels positioning
                x: x1,
                y: y1,
                width: x2 - x1,
                height: barH,
                // path of pyramid
                d: [
                    ['M', x1, y1],
                    ['L', x2, y1],
                    ['L', x3, y2],
                    ['L', x4, y2],
                    ['Z']
                ]
            };
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface ColumnPyramidSeries {
    pointClass: typeof ColumnPyramidPoint;
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        columnpyramid: typeof ColumnPyramidSeries;
    }
}

SeriesRegistry.registerSeriesType('columnpyramid', ColumnPyramidSeries);

/* *
 *
 *  Default Export
 *
 * */

export default ColumnPyramidSeries;
