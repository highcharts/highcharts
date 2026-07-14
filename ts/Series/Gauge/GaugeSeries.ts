/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    GaugeSeriesDialOptions,
    GaugeSeriesOptions
} from './GaugeSeriesOptions';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import GaugePoint from './GaugePoint.js';
import GaugeSeriesDefaults from './GaugeSeriesDefaults.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;
import {
    clamp,
    defined,
    extend,
    isNumber,
    merge,
    pick,
    relativeLength
} from '../../Shared/Utilities.js';


/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        /** @internal */
        angular?: boolean;
    }
}

/** @internal */
declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        /** @internal */
        fixedBox?: boolean;
        /** @internal */
        forceDL?: boolean;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 *
 * The `gauge` series type
 *
 * @internal
 * @class
 * @name Highcharts.seriesTypes.map
 *
 * @augments Highcharts.Series
 */
class GaugeSeries extends Series {

    /* *
     *
     *  Static properties
     *
     * */

    public static defaultOptions: GaugeSeriesOptions = merge(
        Series.defaultOptions,
        GaugeSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<GaugePoint>;
    public points!: Array<GaugePoint>;
    public options!: GaugeSeriesOptions;

    public yAxis!: RadialAxis.AxisComposition;
    public pivot?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */


    /**
     * Calculate paths etc
     * @internal
     */
    public translate(): void {

        const series = this,
            yAxis = series.yAxis,
            options = series.options,
            center = yAxis.center;

        series.generatePoints();

        series.points.forEach((point): void => {
            if (!isNumber(point.y)) {
                return;
            }

            const dialOptions: GaugeSeriesDialOptions = merge(
                    options.dial,
                    point.dial
                ),
                radius = relativeLength(dialOptions.radius, center[2] / 2),
                baseLength = relativeLength(dialOptions.baseLength, radius),
                rearLength = Math.min(
                    relativeLength(dialOptions.rearLength, radius),
                    radius
                ),
                baseWidth = Math.min(
                    relativeLength(dialOptions.baseWidth, radius),
                    radius
                ),
                topWidth = relativeLength(dialOptions.topWidth, radius),
                borderRadius = relativeLength(dialOptions.borderRadius, radius),
                // Border radius at the base
                bRBase = Math.min(borderRadius, baseWidth / 2),
                // Border radius at the top
                bRTop = Math.min(borderRadius, topWidth / 2),
                wrap = options.wrap ?? (
                    yAxis.endAngleRad - yAxis.startAngleRad > 2 * Math.PI - 0.01
                );

            let overshoot = options.overshoot,
                rotation = yAxis.startAngleRad + yAxis.translate(
                    point.y, void 0, void 0, void 0, true
                );

            // Handle the wrap and overshoot options
            if (isNumber(overshoot) || !wrap) {
                overshoot = isNumber(overshoot) ?
                    (overshoot / 180 * Math.PI) : 0;
                rotation = clamp(
                    rotation,
                    yAxis.startAngleRad - overshoot,
                    yAxis.endAngleRad + overshoot
                );
            }

            // Positions for the tooltip
            point.tooltipPos = [
                center[0] + Math.cos(rotation) * radius,
                center[1] + Math.sin(rotation) * radius
            ];

            rotation = rotation * 180 / Math.PI;

            point.shapeType = 'path';
            const d: SVGPath = dialOptions.path || [
                ['M', bRBase - rearLength, -baseWidth / 2],
                ['L', baseLength, -baseWidth / 2],
                ['L', radius - bRTop, -topWidth / 2],
                // Top-right arc
                ['A', bRTop, bRTop, 0, 0, 1, radius, -topWidth / 2 + bRTop],
                ['L', radius, topWidth / 2 - bRTop],
                // Bottom-right arc
                ['A', bRTop, bRTop, 0, 0, 1, radius - bRTop, topWidth / 2],
                ['L', baseLength, baseWidth / 2],
                ['L', bRBase - rearLength, baseWidth / 2],
                // Bottom-left arc
                [
                    'A', bRBase, bRBase, 0, 0, 1,
                    -rearLength, baseWidth / 2 - bRBase
                ],
                ['L', -rearLength, bRBase - baseWidth / 2],
                // Top-left arc
                [
                    'A', bRBase, bRBase, 0, 0, 1,
                    bRBase - rearLength, -baseWidth / 2
                ],
                ['Z']
            ];

            point.shapeArgs = {
                d,
                translateX: center[0],
                translateY: center[1],
                rotation: rotation
            };

            // Positions for data label
            point.plotX = center[0];
            point.plotY = center[1];

            if (defined(point.y) && yAxis.max - yAxis.min) {
                point.percentage =
                    (point.y - yAxis.min) / (yAxis.max - yAxis.min) * 100;
            }
        });
    }

    /**
     * Draw the points where each point is one needle
     * @internal
     */
    public drawPoints(): void {

        const series = this,
            chart = series.chart,
            center = series.yAxis.center,
            pivot = series.pivot,
            options = series.options,
            pivotOptions = options.pivot,
            renderer = chart.renderer,
            pivotRadius = relativeLength(
                pivotOptions?.radius || 0,
                center[2] / 2
            );

        series.points.forEach((point): void => {

            if (isNumber(point.y)) {

                const graphic = point.graphic,
                    shapeArgs = point.shapeArgs,
                    d = shapeArgs.d,
                    dialOptions = merge(options.dial, point.dial); // #1233

                if (graphic) {
                    graphic.animate(shapeArgs);
                    shapeArgs.d = d; // Animate alters it
                } else {
                    point.graphic =
                        (renderer as any)[point.shapeType as any](shapeArgs)
                            .addClass('highcharts-dial')
                            .add(series.group);
                }

                // Presentational attributes
                if (!chart.styledMode && point.graphic) {
                    point.graphic[graphic ? 'animate' : 'attr']({
                        stroke: dialOptions.borderColor,
                        'stroke-width': dialOptions.borderWidth,
                        fill: dialOptions.backgroundColor
                    });
                }
            }
        });

        // Add or move the pivot

        if (pivot) {
            pivot.animate({ // #1235
                translateX: center[0],
                translateY: center[1],
                r: pivotRadius
            });
        } else if (pivotOptions) {
            series.pivot =
                renderer
                    .circle(
                        0,
                        0,
                        pivotRadius
                    )
                    .attr({
                        zIndex: 2
                    })
                    .addClass('highcharts-pivot')
                    .translate(center[0], center[1])
                    .add(series.group);

            // Presentational attributes
            if (!chart.styledMode) {
                series.pivot.attr({
                    fill: pivotOptions.backgroundColor,
                    stroke: pivotOptions.borderColor,
                    'stroke-width': pivotOptions.borderWidth
                });
            }
        }
    }

    /**
     * Animate the arrow up from startAngle
     * @internal
     */
    public animate(init?: boolean): void {
        const series = this;

        if (!init) {
            series.points.forEach((point): void => {
                const graphic = point.graphic;

                if (graphic) {
                    // Start value
                    graphic.attr({
                        rotation: series.yAxis.startAngleRad * 180 / Math.PI
                    });

                    // Animate
                    graphic.animate({
                        rotation: point.shapeArgs.rotation
                    }, series.options.animation);
                }
            });
        }
    }

    /**
     * Extend the basic setData method by running processData and generatePoints
     * immediately, in order to access the points from the legend.
     * @internal
     */
    public setData(
        data: Array<(PointOptions|PointShortOptions)>,
        redraw?: boolean
    ): void {
        Series.prototype.setData.call(this, data, false);
        this.processData();
        this.generatePoints();
        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }

    /**
     * Define hasData function for non-cartesian series.
     * Returns true if the series has points at all.
     * @internal
     */
    public hasData(): boolean {
        return !!this.points.length; // != 0
    }

}

/* *
 *
 *  Prototype properties
 *
 * */

/** @internal */
interface GaugeSeries {
    angular: boolean;
    directTouch: boolean;
    drawGraph(): void;
    fixedBox: boolean;
    forceDL: boolean;
    noSharedTooltip: boolean;
    pointClass: typeof GaugePoint;
}

extend(GaugeSeries.prototype, {
    // `chart.angular` will be set to true when a gauge series is present, and
    // this will be used on the axes
    angular: true,
    directTouch: true, // #5063
    drawGraph: noop,
    drawTracker: ColumnSeries.prototype.drawTracker,
    fixedBox: true,
    forceDL: true,
    noSharedTooltip: true,
    pointClass: GaugePoint,
    trackerGroups: ['group', 'dataLabelsGroup']
});
/* *
 *
 *  Registry
 *
 * */

/**
 * @internal
 */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        gauge: typeof GaugeSeries;
    }
}

SeriesRegistry.registerSeriesType('gauge', GaugeSeries);

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default GaugeSeries;
