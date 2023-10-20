/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2021 Pawel Fus
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

import type AreaRangePoint from '../../Series/AreaRange/AreaRangePoint';
import type ParallelCoordinates from './ParallelCoordinates';
import type Point from '../../Core/Series/Point';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type Series from '../../Core/Series/Series';

import T from '../../Core/Templating.js';
const { format } = T;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    erase,
    extend,
    insertItem,
    isNumber,
    pick,
    pushUnique,
    wrap
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace ParallelSeries {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Series {
        chart: ParallelCoordinates.ChartComposition;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    export function compose(
        SeriesClass: typeof Series
    ): void {
        const {
            line: { prototype: { pointClass: LinePointClass } },
            spline: { prototype: { pointClass: SplinePointClass } }
        } = SeriesClass.types;

        if (
            LinePointClass &&
            pushUnique(composedMembers, LinePointClass)
        ) {
            const linePointProto = LinePointClass.prototype;

            wrap(
                linePointProto,
                'getLabelConfig',
                wrapSeriesGetLabelConfig
            );
        }

        if (pushUnique(composedMembers, SeriesClass)) {
            const CompoClass = SeriesClass as typeof Composition;

            addEvent(
                CompoClass,
                'afterTranslate',
                onSeriesAfterTranslate,
                { order: 1 }
            );
            addEvent(CompoClass, 'bindAxes', onSeriesBindAxes);
            addEvent(CompoClass, 'destroy', onSeriesDestroy);
        }

        if (
            SplinePointClass &&
            pushUnique(composedMembers, SplinePointClass)
        ) {
            const splinePointProto = SplinePointClass.prototype;

            wrap(
                splinePointProto,
                'getLabelConfig',
                wrapSeriesGetLabelConfig
            );
        }

    }

    /**
     * Translate each point using corresponding yAxis.
     * @private
     */
    function onSeriesAfterTranslate(
        this: Composition
    ): void {
        const series = this,
            chart = this.chart,
            points = series.points,
            dataLength = points && points.length;

        let closestPointRangePx = Number.MAX_VALUE,
            lastPlotX,
            point;

        if (this.chart.hasParallelCoordinates) {
            for (let i = 0; i < dataLength; i++) {
                point = points[i];
                if (defined(point.y)) {
                    if (chart.polar) {
                        point.plotX = (
                            chart.yAxis[i] as RadialAxis.AxisComposition
                        ).angleRad || 0;
                    } else if (chart.inverted) {
                        point.plotX = (
                            chart.plotHeight -
                            chart.yAxis[i].top +
                            chart.plotTop
                        );
                    } else {
                        point.plotX = chart.yAxis[i].left - chart.plotLeft;
                    }
                    point.clientX = point.plotX;
                    point.plotY = chart.yAxis[i]
                        .translate(point.y, false, true, void 0, true);

                    // Range series (#15752)
                    if (isNumber((point as AreaRangePoint).high)) {
                        point.plotHigh = chart.yAxis[i].translate(
                            (point as AreaRangePoint).high,
                            false,
                            true,
                            void 0,
                            true
                        );
                    }

                    if (typeof lastPlotX !== 'undefined') {
                        closestPointRangePx = Math.min(
                            closestPointRangePx,
                            Math.abs(point.plotX - lastPlotX)
                        );
                    }
                    lastPlotX = point.plotX;
                    point.isInside = chart.isInsidePlot(
                        point.plotX,
                        point.plotY as any,
                        { inverted: chart.inverted }
                    );
                } else {
                    point.isNull = true;
                }
            }
            this.closestPointRangePx = closestPointRangePx;
        }
    }

    /**
     * Bind each series to each yAxis. yAxis needs a reference to all series to
     * calculate extremes.
     * @private
     */
    function onSeriesBindAxes(
        this: Composition,
        e: Event
    ): void {
        const series = this,
            chart = series.chart;

        if (chart.hasParallelCoordinates) {
            const series = this;

            for (const axis of chart.axes) {
                insertItem(series, axis.series);
                axis.isDirty = true;
            }
            series.xAxis = chart.xAxis[0];
            series.yAxis = chart.yAxis[0];

            e.preventDefault();
        }
    }

    /**
     * On destroy, we need to remove series from each `axis.series`.
     * @private
     */
    function onSeriesDestroy(
        this: Composition
    ): void {
        const series = this,
            chart = series.chart;

        if (chart.hasParallelCoordinates) {
            for (const axis of (chart.axes || [])) {
                if (axis && axis.series) {
                    erase(axis.series, series);
                    axis.isDirty = axis.forceRedraw = true;
                }
            }
        }
    }

    /**
     * @private
     */
    function wrapSeriesGetLabelConfig(
        this: Point,
        proceed: Function
    ): void {
        const chart = this.series && this.series.chart,
            config = proceed.apply(this, [].slice.call(arguments, 1));

        let formattedValue,
            yAxisOptions,
            labelFormat,
            yAxis;

        if (
            chart &&
            chart.hasParallelCoordinates &&
            !defined(config.formattedValue)
        ) {
            yAxis = chart.yAxis[this.x as any];
            yAxisOptions = yAxis.options;

            labelFormat = pick(
                yAxisOptions.tooltipValueFormat,
                yAxisOptions.labels.format
            );

            if (labelFormat) {
                formattedValue = format(
                    labelFormat,
                    extend(
                        this,
                        { value: this.y } as any
                    ),
                    chart
                );
            } else if (yAxis.dateTime) {
                formattedValue = chart.time.dateFormat(
                    chart.time.resolveDTLFormat(
                        (yAxisOptions.dateTimeLabelFormats as any)[
                            (yAxis.tickPositions.info as any).unitName
                        ]
                    ).main as any,
                    this.y as any
                );
            } else if (yAxisOptions.categories) {
                formattedValue = yAxisOptions.categories[this.y as any];
            } else {
                formattedValue = this.y;
            }

            config.formattedValue =
                config.point.formattedValue = formattedValue;
        }

        return config;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelSeries;
