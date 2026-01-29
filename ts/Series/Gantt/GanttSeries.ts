/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import type Chart from '../../Core/Chart/Chart';
import type GanttSeriesOptions from './GanttSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type Tick from '../../Core/Axis/Tick';

import GanttPoint from './GanttPoint.js';
import GanttSeriesDefaults from './GanttSeriesDefaults.js';
import Pathfinder from '../../Gantt/Pathfinder.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        xrange: XRangeSeries
    }
} = SeriesRegistry;
import StaticScale from '../../Extensions/StaticScale.js';
import TreeGridAxis from '../../Core/Axis/TreeGrid/TreeGridAxis.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    isNumber,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.gantt
 *
 * @augments Highcharts.Series
 */
class GanttSeries extends XRangeSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: GanttSeriesOptions = merge(
        XRangeSeries.defaultOptions,
        GanttSeriesDefaults
    );

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        AxisClass: typeof Axis,
        ChartClass?: typeof Chart,
        SeriesClass?: typeof Series,
        TickClass?: typeof Tick
    ): void {

        XRangeSeries.compose(AxisClass);

        if (!ChartClass) {
            return;
        }

        StaticScale.compose(AxisClass, ChartClass);

        if (!SeriesClass) {
            return;
        }

        Pathfinder.compose(ChartClass, SeriesClass.prototype.pointClass);

        if (!TickClass) {
            return;
        }

        TreeGridAxis.compose(AxisClass, ChartClass, SeriesClass, TickClass);

    }

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<GanttPoint>;

    public options!: GanttSeriesOptions;

    public points!: Array<GanttPoint>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Draws a single point in the series.
     *
     * This override draws the point as a diamond if point.options.milestone
     * is true, and uses the original drawPoint() if it is false or not set.
     *
     * @requires highcharts-gantt
     *
     * @private
     * @function Highcharts.seriesTypes.gantt#drawPoint
     *
     * @param {Highcharts.Point} point
     *        An instance of Point in the series
     *
     * @param {"animate"|"attr"} verb
     *        'animate' (animates changes) or 'attr' (sets options)
     */
    public drawPoint(
        point: GanttPoint,
        verb: string
    ): void {
        const series = this,
            seriesOpts = series.options,
            renderer = series.chart.renderer,
            shapeArgs: SVGAttributes = point.shapeArgs as any,
            plotY = point.plotY,
            state = point.selected && 'select',
            cutOff = seriesOpts.stacking && !seriesOpts.borderRadius;

        let graphic = point.graphic,
            diamondShape: SVGPath;

        if (point.options.milestone) {
            if (
                isNumber(plotY) &&
                point.y !== null &&
                point.visible !== false
            ) {
                diamondShape = renderer.symbols.diamond(
                    shapeArgs.x || 0,
                    shapeArgs.y || 0,
                    shapeArgs.width || 0,
                    shapeArgs.height || 0
                );

                if (graphic) {
                    graphic[verb]({
                        d: diamondShape
                    });
                } else {
                    point.graphic = graphic = renderer.path(diamondShape)
                        .addClass(point.getClassName(), true)
                        .add(point.group || series.group);
                }

                // Presentational
                if (!series.chart.styledMode) {
                    (point.graphic as any)
                        .attr(series.pointAttribs(point, state as any))
                        .shadow(seriesOpts.shadow, null, cutOff);
                }
            } else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        } else {
            super.drawPoint(point, verb);
        }
    }

    /**
     * Handle milestones, as they have no x2.
     * @private
     */
    public translatePoint(point: GanttPoint): void {
        let shapeArgs: SVGAttributes,
            size: number;

        super.translatePoint(point);

        if (point.options.milestone) {
            shapeArgs = point.shapeArgs as any;
            size = shapeArgs.height || 0;
            point.shapeArgs = {
                x: (shapeArgs.x || 0) - (size / 2),
                y: shapeArgs.y,
                width: size,
                height: size
            };
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface GanttSeries{
    keyboardMoveVertical: boolean;
    pointClass: typeof GanttPoint;
}

extend(GanttSeries.prototype, { // Props - series member overrides
    pointArrayMap: ['start', 'end', 'y'],
    pointClass: GanttPoint,
    setData: Series.prototype.setData
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        gantt: typeof GanttSeries;
    }
}

SeriesRegistry.registerSeriesType('gantt', GanttSeries);

/* *
 *
 *  Default Export
 *
 * */

export default GanttSeries;
