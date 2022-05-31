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

import type {
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type BBoxObject from '../Core/Renderer/BBoxObject';
import type ColumnPoint from '../Series/Column/ColumnPoint';
import type ColumnSeries from '../Series/Column/ColumnSeries';
import type DataLabelOptions from '../Core/Series/DataLabelOptions';
import type Point from '../Core/Series/Point';
import type PointerEvent from '../Core/PointerEvent';
import type RadialAxis from '../Core/Axis/RadialAxis';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGLabel from '../Core/Renderer/SVG/SVGLabel';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import A from '../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import Pane from './Pane.js';
import Pointer from '../Core/Pointer.js';
import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const { seriesTypes } = SeriesRegistry;
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    defined,
    find,
    isNumber,
    pick,
    splat,
    uniqueKey,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Axis/AxisLike' {
    interface AxisLike {
        center?: Array<number>;
    }
}

declare module '../Core/Renderer/SVG/SVGRendererLike' {
    interface SVGRendererLike {
        clipCircle(
            x: number,
            y: number,
            r: number,
            innerR: number
        ): SVGElement;
    }
}

declare module '../Core/Series/PointLike' {
    interface PointLike {
        rectPlotX?: Highcharts.PolarPoint['rectPlotX'];
        rectPlotY?: Highcharts.PolarPoint['rectPlotY'];
        ttBelow?: boolean;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        hasClipCircleSetter?: boolean;
        /** @requires Series/Polar */
        polarArc: Highcharts.PolarSeries['polarArc'];
        /** @requires Series/Polar */
        findAlignments: Highcharts.PolarSeries['findAlignments'];
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        connectEnds?: boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface AreaRangeSeries {
            findAlignments: PolarSeries['findAlignments'];
        }
        interface PolarConnector {
            leftContX: number;
            leftContY: number;
            plotX: number;
            plotY: number;
            prevPointCont?: PolarConnector;
            rightContX: number;
            rightContY: number;
        }
        interface PolarPoint extends Point {
            plotX: number;
            plotY: number;
            polarPlotX: number;
            polarPlotY: number;
            rectPlotX: number;
            rectPlotY: number;
            series: PolarSeries;
        }
        interface PolarSeries extends Series {
            startAngleRad: number;
            clipCircle: SVGElement;
            connectEnds?: boolean;
            data: Array<PolarPoint>;
            group: SVGElement;
            hasClipCircleSetter?: boolean;
            kdByAngle?: boolean;
            points: Array<PolarPoint>;
            preventPostTranslate?: boolean;
            thresholdAngleRad: number | undefined;
            translatedThreshold?: number;
            animate(init?: boolean): void;
            searchPoint: (
                PolarSeries['kdByAngle'] extends true ?
                    PolarSeries['searchPointByAngle'] :
                    Series['searchPoint']
            );
            xAxis: RadialAxis.AxisComposition;
            yAxis: RadialAxis.AxisComposition;
            getConnectors(
                segment: Array<Point>,
                index: number,
                calculateNeighbours?: boolean,
                connectEnds?: boolean
            ): PolarConnector;
            polarArc(
                low: number,
                high: number,
                start: number,
                end: number
            ): SVGAttributes;
            findAlignments(
                angle: number,
                options: DataLabelOptions,
            ): DataLabelOptions;
            searchPointByAngle(e: PointerEvent): (Point|undefined);
            translate(): void;
            toXY(point: Point): void;
        }
    }
}

// Extensions for polar charts. Additionally, much of the geometry required for
// polar charts is gathered in RadialAxes.js.

let seriesProto = Series.prototype as Highcharts.PolarSeries,
    pointerProto = Pointer.prototype,
    columnProto: Highcharts.PolarSeries,
    arearangeProto: Highcharts.AreaRangeSeries;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Search a k-d tree by the point angle, used for shared tooltips in polar
 * charts
 * @private
 */
seriesProto.searchPointByAngle = function (
    e: PointerEvent
): (Point|undefined) {
    const series = this,
        chart = series.chart,
        xAxis = series.xAxis,
        center = xAxis.pane.center,
        plotX = e.chartX - center[0] - chart.plotLeft,
        plotY = e.chartY - center[1] - chart.plotTop;

    return this.searchKDTree({
        clientX: 180 + (Math.atan2(plotX, plotY) * (-180 / Math.PI))
    });
};

/**
 * #6212 Calculate connectors for spline series in polar chart.
 * @private
 * @param {boolean} calculateNeighbours
 *        Check if connectors should be calculated for neighbour points as
 *        well allows short recurence
 */
seriesProto.getConnectors = function (
    this: Highcharts.PolarSeries,
    segment: Array<Highcharts.PolarPoint>,
    index: number,
    calculateNeighbours?: boolean,
    connectEnds?: boolean
): Highcharts.PolarConnector {

    let i: number,
        prevPointInd: number,
        nextPointInd: number,
        previousPoint: Highcharts.PolarPoint,
        nextPoint: Highcharts.PolarPoint,
        previousX: number,
        previousY: number,
        nextX: number,
        nextY: number,
        plotX: number,
        plotY: number,
        ret: Highcharts.PolarConnector,
        // 1 means control points midway between points, 2 means 1/3 from
        // the point, 3 is 1/4 etc;
        smoothing = 1.5,
        denom = smoothing + 1,
        leftContX: number,
        leftContY: number,
        rightContX: number,
        rightContY: number,
        dLControlPoint: number, // distance left control point
        dRControlPoint: number,
        leftContAngle: number,
        rightContAngle: number,
        jointAngle: number,
        addedNumber = connectEnds ? 1 : 0;

    // Calculate final index of points depending on the initial index value.
    // Because of calculating neighbours, index may be outisde segment
    // array.
    if (index >= 0 && index <= segment.length - 1) {
        i = index;
    } else if (index < 0) {
        i = segment.length - 1 + index;
    } else {
        i = 0;
    }

    prevPointInd = (i - 1 < 0) ? segment.length - (1 + addedNumber) : i - 1;
    nextPointInd = (i + 1 > segment.length - 1) ? addedNumber : i + 1;
    previousPoint = segment[prevPointInd];
    nextPoint = segment[nextPointInd];
    previousX = previousPoint.plotX;
    previousY = previousPoint.plotY;
    nextX = nextPoint.plotX;
    nextY = nextPoint.plotY;
    plotX = segment[i].plotX; // actual point
    plotY = segment[i].plotY;
    leftContX = (smoothing * plotX + previousX) / denom;
    leftContY = (smoothing * plotY + previousY) / denom;
    rightContX = (smoothing * plotX + nextX) / denom;
    rightContY = (smoothing * plotY + nextY) / denom;
    dLControlPoint = Math.sqrt(
        Math.pow(leftContX - plotX, 2) + Math.pow(leftContY - plotY, 2)
    );
    dRControlPoint = Math.sqrt(
        Math.pow(rightContX - plotX, 2) + Math.pow(rightContY - plotY, 2)
    );
    leftContAngle = Math.atan2(leftContY - plotY, leftContX - plotX);
    rightContAngle = Math.atan2(rightContY - plotY, rightContX - plotX);
    jointAngle = (Math.PI / 2) + ((leftContAngle + rightContAngle) / 2);
    // Ensure the right direction, jointAngle should be in the same quadrant
    // as leftContAngle
    if (Math.abs(leftContAngle - jointAngle) > Math.PI / 2) {
        jointAngle -= Math.PI;
    }
    // Find the corrected control points for a spline straight through the
    // point
    leftContX = plotX + Math.cos(jointAngle) * dLControlPoint;
    leftContY = plotY + Math.sin(jointAngle) * dLControlPoint;
    rightContX = plotX + Math.cos(Math.PI + jointAngle) * dRControlPoint;
    rightContY = plotY + Math.sin(Math.PI + jointAngle) * dRControlPoint;

    // push current point's connectors into returned object

    ret = {
        rightContX: rightContX,
        rightContY: rightContY,
        leftContX: leftContX,
        leftContY: leftContY,
        plotX: plotX,
        plotY: plotY
    };

    // calculate connectors for previous and next point and push them inside
    // returned object
    if (calculateNeighbours) {
        ret.prevPointCont = this.getConnectors(
            segment,
            prevPointInd,
            false,
            connectEnds
        );
    }
    return ret;
};

/**
 * Translate a point's plotX and plotY from the internal angle and radius
 * measures to true plotX, plotY coordinates
 * @private
 */
seriesProto.toXY = function (
    this: Highcharts.PolarSeries,
    point: Highcharts.PolarPoint
): void {
    let chart = this.chart,
        xAxis = this.xAxis,
        yAxis = this.yAxis,
        plotX = point.plotX,
        plotY = point.plotY,
        series = point.series,
        inverted = chart.inverted,
        pointY = point.y,
        radius = inverted ? plotX : yAxis.len - plotY,
        clientX;

    // Corrected y position of inverted series other than column
    if (inverted && series && !series.isRadialBar) {
        point.plotY = plotY =
            typeof pointY === 'number' ? (yAxis.translate(pointY) || 0) : 0;
    }

    // Save rectangular plotX, plotY for later computation
    point.rectPlotX = plotX;
    point.rectPlotY = plotY;

    if (yAxis.center) {
        radius += yAxis.center[3] / 2;
    }

    // Find the polar plotX and plotY. Avoid setting plotX and plotY to NaN when
    // plotY is undefined (#15438)
    if (isNumber(plotY)) {
        const xy = inverted ? yAxis.postTranslate(plotY, radius) :
            xAxis.postTranslate(plotX, radius);

        point.plotX = point.polarPlotX = xy.x - chart.plotLeft;
        point.plotY = point.polarPlotY = xy.y - chart.plotTop;
    }

    // If shared tooltip, record the angle in degrees in order to align X
    // points. Otherwise, use a standard k-d tree to get the nearest point
    // in two dimensions.
    if (this.kdByAngle) {
        clientX = (
            (plotX / Math.PI * 180) +
            (xAxis.pane.options.startAngle as any)) % 360;
        if (clientX < 0) { // #2665
            clientX += 360;
        }
        point.clientX = clientX;
    } else {
        point.clientX = point.plotX;
    }
};

if (seriesTypes.spline) {
    /**
     * Overridden method for calculating a spline from one point to the next
     * @private
     */
    wrap(
        seriesTypes.spline.prototype,
        'getPointSpline',
        function (
            this: Highcharts.PolarSeries,
            proceed: Function,
            segment: Array<Highcharts.PolarPoint>,
            point: Highcharts.PolarPoint,
            i: number
        ): SVGPath {
            let ret,
                connectors;

            if (this.chart.polar) {
                // moveTo or lineTo
                if (!i) {
                    ret = ['M', point.plotX, point.plotY];
                } else { // curve from last point to this
                    connectors = this.getConnectors(
                        segment,
                        i,
                        true,
                        this.connectEnds
                    );

                    const rightContX = connectors.prevPointCont &&
                        connectors.prevPointCont.rightContX;
                    const rightContY = connectors.prevPointCont &&
                        connectors.prevPointCont.rightContY;

                    ret = [
                        'C',
                        isNumber(rightContX) ? rightContX : connectors.plotX,
                        isNumber(rightContY) ? rightContY : connectors.plotY,
                        isNumber(connectors.leftContX) ?
                            connectors.leftContX :
                            connectors.plotX,
                        isNumber(connectors.leftContY) ?
                            connectors.leftContY :
                            connectors.plotY,
                        connectors.plotX,
                        connectors.plotY
                    ];
                }
            } else {
                ret = proceed.call(this, segment, point, i);
            }
            return ret;
        }
    );

    // #6430 Areasplinerange series use unwrapped getPointSpline method, so
    // we need to set this method again.
    if (seriesTypes.areasplinerange) {
        seriesTypes.areasplinerange.prototype
            .getPointSpline = seriesTypes.spline.prototype.getPointSpline;
    }
}

/**
 * Extend translate. The plotX and plotY values are computed as if the polar
 * chart were a cartesian plane, where plotX denotes the angle in radians
 * and (yAxis.len - plotY) is the pixel distance from center.
 * @private
 */
addEvent(Series, 'afterTranslate', function (): void {
    const series = this as Highcharts.PolarSeries;
    const chart = series.chart;

    if (chart.polar && series.xAxis) {

        // Prepare k-d-tree handling. It searches by angle (clientX) in
        // case of shared tooltip, and by two dimensional distance in case
        // of non-shared.
        series.kdByAngle = chart.tooltip && chart.tooltip.shared;
        if (series.kdByAngle) {
            series.searchPoint = series.searchPointByAngle;
        } else {
            series.options.findNearestPointBy = 'xy';
        }

        // Postprocess plot coordinates

        const points = series.points;

        let i = points.length;

        while (i--) {
            // Translate plotX, plotY from angle and radius to true plot
            // coordinates
            if (!series.preventPostTranslate) {
                series.toXY(points[i]);
            }

            // Treat points below Y axis min as null (#10082)
            if (
                !chart.hasParallelCoordinates &&
                !series.yAxis.reversed
            ) {
                if (
                    (points[i].y as any) < series.yAxis.min ||
                    (points[i].x as any) < series.xAxis.min ||
                    (points[i].x as any) > series.xAxis.max
                ) {
                    // Destroy markers
                    points[i].isNull = true;
                    // Destroy column's graphic
                    points[i].plotY = NaN;
                } else {
                    // Restore isNull flag
                    points[i].isNull = points[i].determineIsNull();
                }
            }
        }

        // Perform clip after render
        if (!this.hasClipCircleSetter) {
            this.hasClipCircleSetter = !!series.eventsToUnbind.push(
                addEvent(series, 'afterRender', function (
                    this: Highcharts.PolarSeries
                ): void {
                    let circ: Array<number>;

                    if (chart.polar) {
                        // For clipping purposes there is a need for
                        // coordinates from the absolute center
                        circ = (this.yAxis.pane as any).center;

                        if (!this.clipCircle) {
                            this.clipCircle = chart.renderer.clipCircle(
                                circ[0],
                                circ[1],
                                circ[2] / 2,
                                circ[3] / 2
                            );
                        } else {
                            this.clipCircle.animate({
                                x: circ[0],
                                y: circ[1],
                                r: circ[2] / 2,
                                innerR: circ[3] / 2
                            });
                        }

                        this.group.clip(this.clipCircle);
                        this.setClip = H.noop;
                    }
                })
            );
        }
    }
}, { order: 2 }); // Run after translation of ||-coords

/**
 * Extend getSegmentPath to allow connecting ends across 0 to provide a
 * closed circle in line-like series.
 * @private
 */
wrap(seriesTypes.line.prototype, 'getGraphPath', function (
    this: Highcharts.PolarSeries,
    proceed: Function,
    points: Array<Highcharts.PolarPoint>
): SVGPath {
    let series = this,
        i,
        firstValid,
        popLastPoint;

    // Connect the path
    if (this.chart.polar) {
        points = points || this.points;

        // Append first valid point in order to connect the ends
        for (i = 0; i < points.length; i++) {
            if (!points[i].isNull) {
                firstValid = i;
                break;
            }
        }


        /**
         * Polar charts only. Whether to connect the ends of a line series
         * plot across the extremes.
         *
         * @sample {highcharts} highcharts/plotoptions/line-connectends-false/
         *         Do not connect
         *
         * @type      {boolean}
         * @since     2.3.0
         * @product   highcharts
         * @apioption plotOptions.series.connectEnds
         */
        if (
            this.options.connectEnds !== false &&
            typeof firstValid !== 'undefined'
        ) {
            this.connectEnds = true; // re-used in splines
            points.splice(points.length, 0, points[firstValid]);
            popLastPoint = true;
        }

        // For area charts, pseudo points are added to the graph, now we
        // need to translate these
        points.forEach(function (point: Highcharts.PolarPoint): void {
            if (typeof point.polarPlotY === 'undefined') {
                series.toXY(point);
            }
        });
    }

    // Run uber method
    const ret = proceed.apply(this, [].slice.call(arguments, 1));

    // #6212 points.splice method is adding points to an array. In case of
    // areaspline getGraphPath method is used two times and in both times
    // points are added to an array. That is why points.pop is used, to get
    // unmodified points.
    if (popLastPoint) {
        points.pop();
    }
    return ret;
});


const polarAnimate = function (
    this: Highcharts.PolarSeries,
    proceed: Function,
    init?: boolean
): void {
    let series = this,
        chart = this.chart,
        animation = this.options.animation,
        group = this.group,
        markerGroup = this.markerGroup,
        center = this.xAxis && this.xAxis.center,
        plotLeft = chart.plotLeft,
        plotTop = chart.plotTop,
        attribs: SVGAttributes,
        paneInnerR: number,
        graphic,
        shapeArgs,
        r,
        innerR;

    // Specific animation for polar charts
    if (chart.polar) {
        if (series.isRadialBar) {
            if (!init) {
                // Run the pie animation for radial bars
                series.startAngleRad = pick(series.translatedThreshold,
                    series.xAxis.startAngleRad);
                H.seriesTypes.pie.prototype.animate.call(series, init);
            }
        } else {
            // Enable animation on polar charts only in SVG. In VML, the scaling
            // is different, plus animation would be so slow it would't matter.
            if (chart.renderer.isSVG) {
                animation = animObject(animation);

                // A different animation needed for column like series
                if (series.is('column')) {
                    if (!init) {
                        paneInnerR = center[3] / 2;
                        series.points.forEach(function (
                            point: Highcharts.PolarPoint
                        ): void {
                            graphic = point.graphic;
                            shapeArgs = point.shapeArgs;
                            r = shapeArgs && shapeArgs.r;
                            innerR = shapeArgs && shapeArgs.innerR;

                            if (graphic && shapeArgs) {
                                // start values
                                graphic.attr({
                                    r: paneInnerR,
                                    innerR: paneInnerR
                                });
                                // animate
                                graphic.animate({
                                    r: r,
                                    innerR: innerR
                                }, series.options.animation);
                            }
                        });
                    }
                } else {
                    // Initialize the animation
                    if (init) {
                        // Scale down the group and place it in the center
                        attribs = {
                            translateX: center[0] + plotLeft,
                            translateY: center[1] + plotTop,
                            scaleX: 0.001,
                            scaleY: 0.001
                        };
                        group.attr(attribs);
                        if (markerGroup) {
                            markerGroup.attr(attribs);
                        }
                        // Run the animation
                    } else {
                        attribs = {
                            translateX: plotLeft,
                            translateY: plotTop,
                            scaleX: 1,
                            scaleY: 1
                        };
                        group.animate(attribs, animation);
                        if (markerGroup) {
                            markerGroup.animate(attribs, animation);
                        }
                    }
                }
            }
        }

    // For non-polar charts, revert to the basic animation
    } else {
        proceed.call(this, init);
    }
};

// Define the animate method for regular series
wrap(seriesProto, 'animate', polarAnimate);


if (seriesTypes.column) {
    arearangeProto = seriesTypes.arearange.prototype;
    columnProto = (
        seriesTypes.column.prototype as unknown as Highcharts.PolarSeries
    );

    columnProto.polarArc = function (
        this: (ColumnSeries&Highcharts.PolarSeries),
        low: number,
        high: number,
        start: number,
        end: number
    ): SVGAttributes {
        let center = this.xAxis.center,
            len = this.yAxis.len,
            paneInnerR = center[3] / 2,
            r = len - high + paneInnerR,
            innerR = len - pick(low, len) + paneInnerR;

        // Prevent columns from shooting through the pane's center
        if (this.yAxis.reversed) {
            if (r < 0) {
                r = paneInnerR;
            }

            if (innerR < 0) {
                innerR = paneInnerR;
            }
        }

        // Return a new shapeArgs
        return {
            x: center[0],
            y: center[1],
            r: r,
            innerR: innerR,
            start: start,
            end: end
        };
    };

    /**
     * Define the animate method for columnseries
     * @private
     */
    wrap(columnProto, 'animate', polarAnimate);


    /**
     * Extend the column prototype's translate method
     * @private
     */
    wrap(columnProto, 'translate', function (
        this: (ColumnSeries&Highcharts.PolarSeries),
        proceed: Function
    ): void {

        let series = this,
            options = series.options,
            threshold = options.threshold,
            stacking = options.stacking,
            chart = series.chart,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            reversed = yAxis.reversed,
            center = yAxis.center,
            startAngleRad = xAxis.startAngleRad,
            endAngleRad = xAxis.endAngleRad,
            visibleRange = endAngleRad - startAngleRad,
            thresholdAngleRad,
            points: Array<ColumnPoint>&Array<Highcharts.PolarPoint>,
            point: ColumnPoint,
            i: number,
            yMin: any,
            yMax: any,
            start,
            end,
            tooltipPos,
            pointX,
            pointY,
            stackValues,
            stack,
            barX,
            innerR,
            r;

        series.preventPostTranslate = true;

        // Run uber method
        proceed.call(series);

        // Postprocess plot coordinates
        if (xAxis.isRadial) {
            points = series.points;
            i = points.length;
            yMin = yAxis.translate(yAxis.min as any);
            yMax = yAxis.translate(yAxis.max as any);
            threshold = options.threshold || 0;

            if (chart.inverted) {
                // Finding a correct threshold
                if (isNumber(threshold)) {
                    thresholdAngleRad = yAxis.translate(threshold);

                    // Checks if threshold is outside the visible range
                    if (defined(thresholdAngleRad)) {
                        if (thresholdAngleRad < 0) {
                            thresholdAngleRad = 0;
                        } else if (thresholdAngleRad > visibleRange) {
                            thresholdAngleRad = visibleRange;
                        }

                        // Adding start angle offset
                        series.translatedThreshold =
                            thresholdAngleRad + startAngleRad;
                    }
                }
            }

            while (i--) {
                point = points[i];
                barX = point.barX;
                pointX = point.x as any;
                pointY = point.y as any;
                point.shapeType = 'arc';

                if (chart.inverted) {
                    point.plotY = yAxis.translate(pointY);

                    if (stacking && yAxis.stacking) {
                        stack = yAxis.stacking.stacks[(pointY < 0 ? '-' : '') +
                            series.stackKey];

                        if (series.visible && stack && stack[pointX]) {
                            if (!point.isNull) {
                                stackValues = stack[pointX].points[
                                    (series as any).getStackIndicator(
                                        void 0,
                                        pointX,
                                        series.index
                                    ).key];

                                // Translating to radial values
                                start = yAxis.translate(stackValues[0]);
                                end = yAxis.translate(stackValues[1]);

                                // If starting point is beyond the
                                // range, set it to 0
                                if (defined(start)) {
                                    start = U.clamp(start, 0, visibleRange);
                                }
                            }
                        }
                    } else {
                        // Initial start and end angles for radial bar
                        start = thresholdAngleRad;
                        end = point.plotY;
                    }

                    if (start > end) {
                        // Swapping start and end
                        end = [start, start = end][0];
                    }

                    // Prevent from rendering point outside the
                    // acceptable circular range
                    if (!reversed) {
                        if (start < yMin) {
                            start = yMin;
                        } else if (end > yMax) {
                            end = yMax;
                        } else if (end < yMin || start > yMax) {
                            start = end = 0;
                        }
                    } else {
                        if (end > yMin) {
                            end = yMin;
                        } else if (start < yMax) {
                            start = yMax;
                        } else if (start > yMin || end < yMax) {
                            start = end = visibleRange;
                        }
                    }

                    if ((yAxis.min as any) > (yAxis.max as any)) {
                        start = end = reversed ? visibleRange : 0;
                    }

                    start += startAngleRad;
                    end += startAngleRad;

                    if (center) {
                        point.barX = barX += center[3] / 2;
                    }

                    // In case when radius, inner radius or both are
                    // negative, a point is rendered but partially or as
                    // a center point
                    innerR = Math.max(barX, 0);
                    r = Math.max(barX + point.pointWidth, 0);

                    point.shapeArgs = {
                        x: center && center[0],
                        y: center && center[1],
                        r: r,
                        innerR: innerR,
                        start: start,
                        end: end
                    };

                    // Fade out the points if not inside the polar "plot area"
                    point.opacity = start === end ? 0 : void 0;

                    // A correct value for stacked or not fully visible
                    // point
                    point.plotY = (defined(series.translatedThreshold) &&
                        (start < series.translatedThreshold ? start : end)) -
                            startAngleRad;

                } else {
                    start = barX + startAngleRad;

                    // Changed the way polar columns are drawn in order to make
                    // it more consistent with the drawing of inverted columns
                    // (they are using the same function now). Also, it was
                    // essential to make the animation work correctly (the
                    // scaling of the group) is replaced by animating each
                    // element separately.
                    point.shapeArgs = series.polarArc(
                        (point.yBottom as any),
                        (point.plotY as any),
                        start,
                        start + point.pointWidth
                    );
                }

                // Provided a correct coordinates for the tooltip
                series.toXY(point);

                if (chart.inverted) {
                    tooltipPos = yAxis.postTranslate((point as any).rectPlotY,
                        barX + point.pointWidth / 2);

                    point.tooltipPos = [
                        tooltipPos.x - chart.plotLeft,
                        tooltipPos.y - chart.plotTop
                    ];
                } else {
                    (point.tooltipPos as any) = [point.plotX, point.plotY];
                }

                if (center) {
                    point.ttBelow = (point.plotY as any) > center[1];
                }
            }
        }
    });

    /**
     * Find correct align and vertical align based on an angle in polar chart
     * @private
     */
    columnProto.findAlignments = function (
        this: Highcharts.PolarSeries,
        angle: number,
        options: DataLabelOptions
    ): DataLabelOptions {
        let align: AlignValue,
            verticalAlign: VerticalAlignValue;

        if (options.align === null) {
            if (angle > 20 && angle < 160) {
                align = 'left'; // right hemisphere
            } else if (angle > 200 && angle < 340) {
                align = 'right'; // left hemisphere
            } else {
                align = 'center'; // top or bottom
            }
            options.align = align;
        }

        if (options.verticalAlign === null) {
            if (angle < 45 || angle > 315) {
                verticalAlign = 'bottom'; // top part
            } else if (angle > 135 && angle < 225) {
                verticalAlign = 'top'; // bottom part
            } else {
                verticalAlign = 'middle'; // left or right
            }
            options.verticalAlign = verticalAlign;
        }

        return options;
    };

    if (arearangeProto) {
        arearangeProto.findAlignments = columnProto.findAlignments;
    }

    /**
     * Align column data labels outside the columns. #1199.
     * @private
     */
    wrap(columnProto, 'alignDataLabel', function (
        this: (ColumnSeries|Highcharts.PolarSeries),
        proceed: Function,
        point: (ColumnPoint|Highcharts.PolarPoint),
        dataLabel: SVGLabel,
        options: DataLabelOptions,
        alignTo: BBoxObject,
        isNew?: boolean
    ): void {
        let chart = this.chart,
            inside = pick(options.inside, !!this.options.stacking),
            angle,
            shapeArgs,
            labelPos;

        if (chart.polar) {
            angle = (point as Highcharts.PolarPoint).rectPlotX / Math.PI * 180;
            if (!chart.inverted) {
                // Align nicely outside the perimeter of the columns
                if (this.findAlignments) {
                    options = this.findAlignments(angle, options);
                }
            } else { // Required corrections for data labels of inverted bars
                // The plotX and plotY are correctly set therefore they
                // don't need to be swapped (inverted argument is false)
                this.forceDL = chart.isInsidePlot(
                    (point as Highcharts.PolarPoint).plotX,
                    Math.round((point as Highcharts.PolarPoint).plotY)
                );

                // Checks if labels should be positioned inside
                if (inside && point.shapeArgs) {
                    shapeArgs = point.shapeArgs;
                    // Calculates pixel positions for a data label to be
                    // inside
                    labelPos =
                        (this as Highcharts.PolarSeries).yAxis.postTranslate(
                        // angle
                            (
                                (shapeArgs.start || 0) + (shapeArgs.end || 0)
                            ) / 2 -
                            (this as Highcharts.PolarSeries)
                                .xAxis.startAngleRad,
                            // radius
                            (point as ColumnPoint).barX +
                            (point as ColumnPoint).pointWidth / 2
                        );

                    (alignTo as any) = {
                        x: labelPos.x - chart.plotLeft,
                        y: labelPos.y - chart.plotTop
                    };
                } else if (point.tooltipPos) {
                    (alignTo as any) = {
                        x: point.tooltipPos[0],
                        y: point.tooltipPos[1]
                    };
                }

                options.align = pick(options.align, 'center');
                options.verticalAlign =
                    pick(options.verticalAlign, 'middle');
            }

            seriesProto.alignDataLabel.call(
                this,
                point,
                dataLabel,
                options,
                alignTo,
                isNew
            );

            // Hide label of a point (only inverted) that is outside the
            // visible y range
            if (this.isRadialBar && point.shapeArgs &&
                point.shapeArgs.start === point.shapeArgs.end) {
                dataLabel.hide(true);
            }
        } else {
            proceed.call(this, point, dataLabel, options, alignTo, isNew);
        }

    });
}

/**
 * Extend getCoordinates to prepare for polar axis values
 * @private
 */
wrap(pointerProto, 'getCoordinates', function (
    this: Highcharts.PolarSeries,
    proceed: Pointer['getCoordinates'],
    e: PointerEvent
): Pointer.AxesCoordinatesObject {
    let chart = this.chart,
        ret: Pointer.AxesCoordinatesObject = {
            xAxis: [],
            yAxis: []
        };

    if (chart.polar) {

        chart.axes.forEach(function (axis): void {
            let isXAxis = axis.isXAxis,
                center = axis.center,
                x,
                y;

            // Skip colorAxis
            if (axis.coll === 'colorAxis') {
                return;
            }

            x = e.chartX - (center as any)[0] - chart.plotLeft;
            y = e.chartY - (center as any)[1] - chart.plotTop;

            ret[isXAxis ? 'xAxis' : 'yAxis'].push({
                axis: axis,
                value: axis.translate(
                    isXAxis ?
                        Math.PI - Math.atan2(x, y) : // angle
                        // distance from center
                        Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                    true
                ) as any
            });
        });

    } else {
        ret = proceed.call(this, e);
    }

    return ret;
});

SVGRenderer.prototype.clipCircle = function (
    this: SVGRenderer,
    x: number,
    y: number,
    r: number,
    innerR: number
): SVGElement {
    let wrapper: SVGElement,
        id = uniqueKey(),

        clipPath = this.createElement('clipPath').attr({
            id: id
        }).add(this.defs);

    wrapper = innerR ?
        this.arc(x, y, r, innerR, 0, 2 * Math.PI).add(clipPath) :
        this.circle(x, y, r).add(clipPath);
    wrapper.id = id;
    wrapper.clipPath = clipPath;

    return wrapper;
};

addEvent(Chart, 'getAxes', function (): void {

    if (!this.pane) {
        this.pane = [];
    }
    this.options.pane = splat(this.options.pane);
    this.options.pane.forEach(function (
        paneOptions: Highcharts.PaneOptions
    ): void {
        new Pane( // eslint-disable-line no-new
            paneOptions,
            this
        );
    }, this);
});

addEvent(Chart, 'afterDrawChartBox', function (): void {
    (this.pane as any).forEach(function (pane: Highcharts.Pane): void {
        pane.render();
    });
});

addEvent(Series, 'afterInit', function (): void {
    const chart = this.chart;

    // Add flags that identifies radial inverted series
    if (chart.inverted && chart.polar) {
        this.isRadialSeries = true;
        if (this.is('column')) {
            this.isRadialBar = true;
        }
    }
});

/**
 * Replace selection marker with arc for polar charts
 * @private
 */
addEvent(Pointer, 'afterCreateSelectionMarker', function (event): void {
    const chart = this.chart;

    if (chart.polar && chart.hoverPane) {
        const center = chart.hoverPane.center,
            linearAxis = chart.inverted ? chart.xAxis[0] : chart.yAxis[0];

        let selectionMarker;

        if (linearAxis.options.gridLineInterpolation === 'polygon') {
            const path = (linearAxis as any).getPlotLinePath(
                { value: linearAxis.toValue(center[2] / 2) }
            ).concat(linearAxis.getPlotLinePath({
                value: linearAxis.toValue(center[3] / 2),
                reverse: true
            }));

            selectionMarker = chart.renderer.path(path);
        } else {
            selectionMarker = chart.renderer.arc(
                center[0] + chart.plotLeft,
                center[1] + chart.plotTop,
                center[2] / 2,
                center[3] / 2,
                0,
                Math.PI * 2
            );
        }

        (event as any).selectionMarker = selectionMarker;
    }
});

/**
 * Get attrs for Polar selection marker
 * @private
 */
addEvent(Pointer, 'afterGetSelectionMarkerAttrs', function (event):void {
    const chart = this.chart;

    if (chart.polar && chart.hoverPane && chart.hoverPane.axis) {
        const center = chart.hoverPane.center,
            mouseDownX = (this.mouseDownX || 0),
            mouseDownY = (this.mouseDownY || 0),
            chartY = (event as any).chartY,
            chartX = (event as any).chartX,
            fullCircle = Math.PI * 2,
            startAngleRad = chart.hoverPane.axis.startAngleRad,
            endAngleRad = chart.hoverPane.axis.endAngleRad,
            linearAxis = chart.inverted ? chart.xAxis[0] : chart.yAxis[0];

        let attrs: SVGAttributes = {};

        // Adjust the width of the selection marker
        if (this.zoomHor) {
            const paneRadRange = startAngleRad > 0 ?
                endAngleRad - startAngleRad :
                Math.abs(startAngleRad) + Math.abs(endAngleRad);
            let startAngle = Math.atan2(
                    mouseDownY - chart.plotTop - center[1],
                    mouseDownX - chart.plotLeft - center[0]
                ) - startAngleRad,
                endAngle = Math.atan2(
                    chartY - chart.plotTop - center[1],
                    chartX - chart.plotLeft - center[0]
                ) - startAngleRad;

            if (startAngle <= 0) {
                startAngle += fullCircle;
            }

            if (endAngle <= 0) {
                endAngle += fullCircle;
            }

            if (endAngle < startAngle) {
                // Swapping angles
                endAngle = [startAngle, startAngle = endAngle][0];
            }

            // If pane is not a full circle we need to let users zoom to the min
            // We do this by swapping angles after pointer crosses
            // middle angle (swapAngle) of the missing slice of the pane
            if (paneRadRange < fullCircle) {
                const swapAngle = endAngleRad + (fullCircle - paneRadRange) / 2;

                if (startAngleRad + endAngle > swapAngle) {
                    endAngle = startAngle;
                    startAngle = startAngleRad <= 0 ? startAngleRad : 0;
                }
            }

            const start = attrs.start =
                Math.max(startAngle + startAngleRad, startAngleRad),
                end = attrs.end =
                    Math.min(endAngle + startAngleRad, endAngleRad);

            // Adjust the selection shape for polygon grid lines
            if (
                (linearAxis as any).options.gridLineInterpolation === 'polygon'
            ) {

                const radialAxis = chart.hoverPane.axis,
                    tickInterval = radialAxis.tickInterval,
                    min = start - radialAxis.startAngleRad + radialAxis.pos,
                    max = end - start,
                    pathStart = radialAxis.toValue(min),
                    pathEnd = radialAxis.toValue(min + max),
                    ticks = radialAxis.tickPositions;

                let path = (linearAxis as any).getPlotLinePath({
                        value: linearAxis.max
                    }),
                    lastTick = find(ticks, (tick):boolean => tick >= pathEnd),
                    firstTick = find(
                        [...ticks].reverse(),
                        (tick):boolean => tick <= pathStart
                    );

                if (!defined(lastTick)) {
                    lastTick = ticks[ticks.length - 1];
                }

                if (!defined(firstTick)) {
                    firstTick = ticks[0];
                    lastTick += tickInterval;
                    path[0][0] = 'L';
                    // To do: figure out why -3 or -2
                    path.unshift(path[path.length - 3]);
                }

                path = path.slice(
                    ticks.indexOf(firstTick),
                    ticks.indexOf(lastTick) + 1
                );

                path[0][0] = 'M';

                let x1 = path[0][1],
                    y1 = path[0][2],
                    x2 = path[1][1],
                    y2 = path[1][2];

                let scale = (Math.abs(pathStart) % tickInterval) / tickInterval;

                // For negative numbers
                if (pathStart < 0) {
                    scale = 1 - scale;
                }

                let xValue = x1 - scale * (x1 - x2),
                    yValue = y1 - scale * (y1 - y2);

                x1 = path[path.length - 1][1];
                y1 = path[path.length - 1][2];
                x2 = path[path.length - 2][1];
                y2 = path[path.length - 2][2];

                scale = (tickInterval - (Math.abs(pathEnd) % tickInterval)) /
                    tickInterval;

                // For negative numbers or and scale should never reach 1
                if (pathEnd < 0 || scale === 1) {
                    scale = 1 - scale;
                }

                path[0] = ['M', xValue, yValue];

                xValue = x1 - scale * (x1 - x2);
                yValue = y1 - scale * (y1 - y2);
                path[path.length - 1] = ['L', xValue, yValue];

                path.push([
                    'L', center[0] + chart.plotLeft,
                    chart.plotTop + center[1]
                ]);
                attrs.d = path;
            }
        }

        // Adjust the height of the selection marker
        if (this.zoomVert) {
            const linearAxis = chart.inverted ? chart.xAxis[0] : chart.yAxis[0];

            let innerR = Math.sqrt(
                    Math.pow(mouseDownX - chart.plotLeft - center[0], 2) +
                    Math.pow(mouseDownY - chart.plotTop - center[1], 2)
                ),
                r = Math.sqrt(
                    Math.pow(chartX - chart.plotLeft - center[0], 2) +
                    Math.pow(chartY - chart.plotTop - center[1], 2)
                );

            if (r < innerR) {
                // Swapping angles
                innerR = [r, r = innerR][0];
            }

            if (r > center[2] / 2) {
                r = center[2] / 2;
            }

            if (innerR < center[3] / 2) {
                innerR = center[3] / 2;
            }

            if (!this.zoomHor) {
                attrs.start = startAngleRad;
                attrs.end = endAngleRad;
            }

            attrs.r = r;
            attrs.innerR = innerR;

            if (linearAxis.options.gridLineInterpolation === 'polygon') {
                const end = linearAxis.toValue(
                        linearAxis.len + linearAxis.pos - innerR
                    ),
                    start = linearAxis.toValue(
                        linearAxis.len + linearAxis.pos - r
                    ),
                    path = (linearAxis as any).getPlotLinePath({
                        value: start
                    }).concat(linearAxis.getPlotLinePath({
                        value: end,
                        reverse: true
                    }));

                attrs.d = path;
            }
        }

        (event as any).attrs = attrs;
    }
});


/**
 * Get selection dimensions
 * @private
 */
addEvent(Pointer, 'afterGetSelectionBox', function (event):void {
    const marker = (event as any).marker,
        xAxis = this.chart.xAxis[0],
        yAxis = this.chart.yAxis[0],
        inverted = this.chart.inverted,
        radialAxis = inverted ? yAxis : xAxis,
        linearAxis = inverted ? xAxis : yAxis;

    if (this.chart.polar) {
        let start = (
            marker.attr ? marker.attr('start') : marker.start
        ) - (radialAxis as any).startAngleRad;

        let r = (marker.attr ? marker.attr('r') : marker.r);

        let end = (
            marker.attr ? marker.attr('end') : marker.end
        ) - (radialAxis as any).startAngleRad;

        let innerR = (marker.attr ? marker.attr('innerR') : marker.innerR);

        (event as any).x = start + radialAxis.pos;
        (event as any).width = end - start;
        // innerR goes from pane's center but toValue computes values from top
        (event as any).y = linearAxis.len + linearAxis.pos - innerR;
        (event as any).height = innerR - r;
    }
});


/**
 * Extend chart.get to also search in panes. Used internally in
 * responsiveness and chart.update.
 * @private
 */
wrap(Chart.prototype, 'get', function (
    this: Chart,
    proceed: Function,
    id: string
): boolean {
    return find(this.pane || [], function (pane: Highcharts.Pane): boolean {
        return (pane.options as any).id === id;
    }) || proceed.call(this, id);
});
