/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type AreaPoint from './AreaPoint';
import type AreaSeriesOptions from './AreaSeriesOptions';
import type { SeriesZonesOptions } from '../../Core/Series/SeriesOptions';
import type StackingAxis from '../../Core/Axis/Stacking/StackingAxis';
import type StackItem from '../../Core/Axis/Stacking/StackItem';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import AreaSeriesDefaults from './AreaSeriesDefaults.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        line: LineSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge,
    objectEach,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SVGPath' {
    interface SVGPath {
        isArea?: boolean;
        hasStackedCliffs?: boolean;
    }
}

declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        areaPath?: SVGPath;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * Area series type.
 *
 * @private
 * @class
 * @name AreaSeries
 *
 * @augments LineSeries
 */
class AreaSeries extends LineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: AreaSeriesOptions =
        merge(LineSeries.defaultOptions, AreaSeriesDefaults);

    /* *
     *
     *  Properties
     *
     * */

    public areaPath?: SVGPath;

    public data!: Array<AreaPoint>;

    public options!: AreaSeriesOptions;

    public points!: Array<AreaPoint>;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Draw the graph and the underlying area. This method calls the Series
     * base function and adds the area. The areaPath is calculated in the
     * getSegmentPath method called from Series.prototype.drawGraph.
     * @private
     */
    public drawGraph(): void {

        // Define or reset areaPath
        this.areaPath = [];

        // Call the base method
        super.drawGraph.apply(this);

        // Define local variables
        const { areaPath, options } = this;

        [this, ...this.zones].forEach((owner, i): void => {
            const attribs: SVGAttributes = {},
                fillColor = owner.fillColor || options.fillColor;

            let area = owner.area;

            const verb = area ? 'animate' : 'attr';

            // Create or update the area
            if (area) { // Update
                area.endX = this.preventGraphAnimation ?
                    null :
                    areaPath.xMap;
                area.animate({ d: areaPath });

            } else { // Create

                attribs.zIndex = 0; // #1069

                /**
                 * SVG element of area-based charts. Can be used for styling
                 * purposes. If zones are configured, this element will be
                 * hidden and replaced by multiple zone areas, accessible
                 * via `series.zones[i].area`.
                 *
                 * @name Highcharts.Series#area
                 * @type {Highcharts.SVGElement|undefined}
                 */
                area = owner.area = this.chart.renderer
                    .path(areaPath)
                    .addClass(
                        'highcharts-area' +
                        (i ? ` highcharts-zone-area-${i - 1} ` : ' ') +
                        ((i && (owner as SeriesZonesOptions).className) || '')
                    )
                    .add(this.group);
                area.isArea = true;
            }

            if (!this.chart.styledMode) {
                // If there is fillColor defined for the area, set it.
                // Otherwise, we set it to the zone/series color and add
                // fill-opacity (#18939).
                attribs.fill = fillColor || owner.color || this.color;
                attribs['fill-opacity'] = fillColor ?
                    1 : (options.fillOpacity ?? 0.75);

                // Allow clicking through the area if sticky tracking is true
                // (#18744)
                area.css({
                    pointerEvents: this.stickyTracking ? 'none' : 'auto'
                });
            }

            area[verb](attribs);

            area.startX = areaPath.xMap;
            area.shiftUnit = options.step ? 2 : 1;
        });
    }

    /**
     * @private
     */
    public getGraphPath(points: Array<AreaPoint>): SVGPath {
        const getGraphPath = LineSeries.prototype.getGraphPath,
            options = this.options,
            stacking = options.stacking,
            yAxis = this.yAxis as StackingAxis,
            bottomPoints: Array<AreaPoint> = [],
            graphPoints: Array<AreaPoint> = [],
            seriesIndex = this.index,
            stacks = yAxis.stacking.stacks[this.stackKey as any],
            threshold = options.threshold,
            translatedThreshold = Math.round( // #10909
                yAxis.getThreshold(options.threshold as any)
            ),
            connectNulls = pick( // #10574
                options.connectNulls,
                stacking === 'percent'
            ),
            // To display null points in underlying stacked series, this
            // series graph must be broken, and the area also fall down to
            // fill the gap left by the null point. #2069
            addDummyPoints = function (
                i: number,
                otherI: number,
                side: string
            ): void {
                const point = points[i],
                    stackedValues = stacking &&
                        stacks[point.x as any].points[seriesIndex as any],
                    nullVal = (point as any)[side + 'Null'] || 0,
                    cliffVal = (point as any)[side + 'Cliff'] || 0;

                let top,
                    bottom,
                    isNull = true;

                if (cliffVal || nullVal) {

                    top = (nullVal ?
                        (stackedValues as any)[0] :
                        (stackedValues as any)[1]
                    ) + cliffVal;
                    bottom = (stackedValues as any)[0] + cliffVal;
                    isNull = !!nullVal;

                } else if (
                    !stacking &&
                    points[otherI] &&
                    points[otherI].isNull
                ) {
                    top = bottom = threshold as any;
                }

                // Add to the top and bottom line of the area
                if (typeof top !== 'undefined') {
                    graphPoints.push({
                        plotX: plotX,
                        plotY: top === null ?
                            translatedThreshold :
                            yAxis.getThreshold(top),
                        isNull: isNull,
                        isCliff: true
                    } as any);
                    bottomPoints.push({ // @todo create real point object
                        plotX: plotX,
                        plotY: bottom === null ?
                            translatedThreshold :
                            yAxis.getThreshold(bottom),
                        doCurve: false // #1041, gaps in areaspline areas
                    } as any);
                }
            };

        let plotX: (number|undefined),
            isNull,
            yBottom;

        // Find what points to use
        points = points || this.points;

        // Fill in missing points
        if (stacking) {
            points = this.getStackPoints(points);
        }

        for (let i = 0, iEnd = points.length; i < iEnd; ++i) {

            // Reset after series.update of stacking property (#12033)
            if (!stacking) {
                points[i].leftCliff = points[i].rightCliff =
                    points[i].leftNull = points[i].rightNull = void 0;
            }

            isNull = points[i].isNull;
            plotX = pick(points[i].rectPlotX, points[i].plotX);
            yBottom = stacking ?
                pick(points[i].yBottom, translatedThreshold) :
                translatedThreshold;

            if (!isNull || connectNulls) {

                if (!connectNulls) {
                    addDummyPoints(i, i - 1, 'left');
                }
                // Skip null point when stacking is false and connectNulls
                // true
                if (!(isNull && !stacking && connectNulls)) {
                    graphPoints.push(points[i]);
                    bottomPoints.push({ // @todo make real point object
                        x: i,
                        plotX: plotX,
                        plotY: yBottom
                    } as any);
                }

                if (!connectNulls) {
                    addDummyPoints(i, i + 1, 'right');
                }
            }
        }

        const topPath = getGraphPath.call(this, graphPoints, true, true);

        (bottomPoints as any).reversed = true;
        const bottomPath = getGraphPath.call(this, bottomPoints, true, true);
        const firstBottomPoint = bottomPath[0];
        if (firstBottomPoint && firstBottomPoint[0] === 'M') {
            bottomPath[0] = ['L', firstBottomPoint[1], firstBottomPoint[2]];
        }

        const areaPath: SVGPath = topPath.concat(bottomPath);
        if (areaPath.length) {
            areaPath.push(['Z']);
        }
        // TODO: don't set leftCliff and rightCliff when connectNulls?
        const graphPath = getGraphPath
            .call(this, graphPoints, false, connectNulls);

        if (
            this.chart.series.length > 1 &&
            stacking &&
            graphPoints.some((point): boolean | undefined => point.isCliff)
        ) {
            areaPath.hasStackedCliffs = graphPath.hasStackedCliffs = true;
        }

        areaPath.xMap = topPath.xMap;
        this.areaPath = areaPath;

        return graphPath;
    }

    /**
     * Return an array of stacked points, where null and missing points are
     * replaced by dummy points in order for gaps to be drawn correctly in
     * stacks.
     * @private
     */
    public getStackPoints(
        points: Array<AreaPoint>
    ): Array<AreaPoint> {
        const series = this,
            segment: Array<AreaPoint> = [],
            keys: Array<string> = [],
            xAxis = this.xAxis,
            yAxis: StackingAxis = this.yAxis as any,
            stack = yAxis.stacking.stacks[this.stackKey as any],
            pointMap: Record<string, AreaPoint> = {},
            yAxisSeries = yAxis.series,
            seriesLength = yAxisSeries.length,
            upOrDown = yAxis.options.reversedStacks ? 1 : -1,
            seriesIndex = yAxisSeries.indexOf(series);


        points = points || this.points;

        if (this.options.stacking) {

            for (let i = 0; i < points.length; i++) {
                // Reset after point update (#7326)
                points[i].leftNull = points[i].rightNull = void 0;

                // Create a map where we can quickly look up the points by
                // their X values.
                pointMap[points[i].x as any] = points[i];
            }

            // Sort the keys (#1651)
            objectEach(stack, function (
                stackX: StackItem,
                x: string
            ): void {
                // Nulled after switching between
                // grouping and not (#1651, #2336)
                if (stackX.total !== null) {
                    keys.push(x);
                }
            });
            keys.sort(function (a: string, b: string): number {
                return (a as any) - (b as any);
            });

            const visibleSeries = yAxisSeries.map((s): boolean => s.visible);

            keys.forEach(function (x: string, idx: number): void {
                let y = 0,
                    stackPoint,
                    stackedValues;

                if (pointMap[x] && !pointMap[x].isNull) {
                    segment.push(pointMap[x]);

                    // Find left and right cliff. -1 goes left, 1 goes
                    // right.
                    [-1, 1].forEach(function (direction: number): void {
                        const nullName = direction === 1 ?
                                'rightNull' :
                                'leftNull',
                            cliffName = direction === 1 ?
                                'rightCliff' :
                                'leftCliff',
                            otherStack = stack[keys[idx + direction]];

                        let cliff = 0;

                        // If there is a stack next to this one,
                        // to the left or to the right...
                        if (otherStack) {
                            let i = seriesIndex;
                            // Can go either up or down,
                            // depending on reversedStacks
                            while (i >= 0 && i < seriesLength) {
                                const si = yAxisSeries[i].index;
                                stackPoint = otherStack.points[si];
                                if (!stackPoint) {
                                    // If the next point in this series is
                                    // missing, mark the point with
                                    // point.leftNull or point.rightNull = true.
                                    if (si === series.index) {
                                        (pointMap[x] as any)[nullName] = true;

                                    // If there are missing points in the next
                                    // stack in any of the series below this
                                    // one, we need to subtract the missing
                                    // values and add a hiatus to the left or
                                    // right.
                                    } else if (visibleSeries[i]) {
                                        stackedValues = stack[x].points[si];
                                        if (stackedValues) {
                                            cliff -= (
                                                stackedValues[1] -
                                                stackedValues[0]
                                            );
                                        }
                                    }
                                }
                                // When reversedStacks is true, loop up,
                                // else loop down
                                i += upOrDown;
                            }
                        }
                        (pointMap[x] as any)[cliffName] = cliff;
                    });


                // There is no point for this X value in this series, so we
                // insert a dummy point in order for the areas to be drawn
                // correctly.
                } else {

                    // Loop down the stack to find the series below this
                    // one that has a value (#1991)
                    let i = seriesIndex;
                    while (i >= 0 && i < seriesLength) {
                        const si = yAxisSeries[i].index;
                        stackPoint = stack[x].points[si];
                        if (stackPoint) {
                            y = stackPoint[1];
                            break;
                        }
                        // When reversedStacks is true, loop up, else loop
                        // down
                        i += upOrDown;
                    }
                    y = pick(y, 0);
                    y = yAxis.translate(// #6272
                        y, 0 as any, 1 as any, 0 as any, 1 as any
                    );
                    segment.push({ // @todo create real point object
                        isNull: true,
                        plotX: xAxis.translate(// #6272
                            x as any, 0 as any, 0 as any, 0 as any, 1 as any
                        ),
                        x: x as any,
                        plotY: y,
                        yBottom: y
                    } as any);
                }
            });

        }

        return segment;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface AreaSeries {
    pointClass: typeof AreaPoint;
}
extend(AreaSeries.prototype, {
    singleStacks: false
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        area: typeof AreaSeries;
    }
}
SeriesRegistry.registerSeriesType('area', AreaSeries);

/* *
 *
 *  Default Export
 *
 * */

export default AreaSeries;
