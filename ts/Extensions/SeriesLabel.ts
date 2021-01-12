/* *
 *
 *  (c) 2009-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AnimationOptions from '../Core/Animation/AnimationOptions';
import type BBoxObject from '../Core/Renderer/BBoxObject';
import type CSSObject from '../Core/Renderer/CSSObject';
import type Point from '../Core/Series/Point';
import type PositionObject from '../Core/Renderer/PositionObject';
import type SplineSeries from '../Series/Spline/SplineSeries';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import A from '../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import Chart from '../Core/Chart/Chart.js';
import Series from '../Core/Series/Series.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    extend,
    fireEvent,
    format,
    isNumber,
    pick,
    setOptions,
    syncTimeout
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        boxesToAvoid?: Array<Highcharts.LabelIntersectBoxObject>;
        labelSeries?: Array<Series>;
        labelSeriesMaxSum?: number;
        seriesLabelTimer?: number;
        drawSeriesLabels(): void;
    }
}

declare module '../Core/Series/PointLike' {
    interface PointLike {
        chartCenterY?: number;
        chartX?: number;
        chartY?: number;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        interpolatedPoints?: Array<Point>;
        labelBySeries?: SVGElement;
        sum?: number;
        checkClearPoint(
            x: number,
            y: number,
            bBox: BBoxObject,
            checkDistance?: boolean
        ): (boolean|Highcharts.LabelClearPointObject);
        drawSeriesLabels(): void;
        getPointsOnGraph(): (Array<Point>|undefined);
        labelFontSize(minFontSize: number, maxFontSize: number): string;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        label?: Highcharts.SeriesLabelOptionsObject;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface LabelClearPointObject extends PositionObject {
            connectorPoint?: Point;
            weight: number;
        }
        interface LabelIntersectBoxObject {
            bottom: number;
            left: number;
            right: number;
            top: number;
        }
        interface SeriesLabelOptionsObject {
            boxesToAvoid?: Array<LabelIntersectBoxObject>;
            connectorAllowed?: boolean;
            connectorNeighbourDistance?: number;
            enabled?: boolean;
            format?: string;
            formatter?: FormatterCallbackFunction<Series>;
            maxFontSize?: (number|null);
            minFontSize?: (number|null);
            onArea?: (boolean|null);
            style?: CSSObject;
        }
    }
}

/**
 * Containing the position of a box that should be avoided by labels.
 *
 * @interface Highcharts.LabelIntersectBoxObject
 *//**
 * @name Highcharts.LabelIntersectBoxObject#bottom
 * @type {number}
 *//**
 * @name Highcharts.LabelIntersectBoxObject#left
 * @type {number}
 *//**
 * @name Highcharts.LabelIntersectBoxObject#right
 * @type {number}
 *//**
 * @name Highcharts.LabelIntersectBoxObject#top
 * @type {number}
 */

/*
 * Highcharts module to place labels next to a series in a natural position.
 *
 * TODO:
 * - add column support (box collision detection, boxesToAvoid logic)
 * - avoid data labels, when data labels above, show series label below.
 * - add more options (connector, format, formatter)
 *
 * https://jsfiddle.net/highcharts/L2u9rpwr/
 * https://jsfiddle.net/highcharts/y5A37/
 * https://jsfiddle.net/highcharts/264Nm/
 * https://jsfiddle.net/highcharts/y5A37/
 */

''; // detach doclets above

const labelDistance = 3;

setOptions({

    /**
     * @optionparent plotOptions
     *
     * @private
     */
    plotOptions: {

        series: {
            /**
             * Series labels are placed as close to the series as possible in a
             * natural way, seeking to avoid other series. The goal of this
             * feature is to make the chart more easily readable, like if a
             * human designer placed the labels in the optimal position.
             *
             * The series labels currently work with series types having a
             * `graph` or an `area`.
             *
             * @sample highcharts/series-label/line-chart
             *         Line chart
             * @sample highcharts/demo/streamgraph
             *         Stream graph
             * @sample highcharts/series-label/stock-chart
             *         Stock chart
             *
             * @declare  Highcharts.SeriesLabelOptionsObject
             * @since    6.0.0
             * @product  highcharts highstock gantt
             * @requires modules/series-label
             */
            label: {

                /**
                 * Enable the series label per series.
                 */
                enabled: true,

                /**
                 * Allow labels to be placed distant to the graph if necessary,
                 * and draw a connector line to the graph. Setting this option
                 * to true may decrease the performance significantly, since the
                 * algorithm with systematically search for open spaces in the
                 * whole plot area. Visually, it may also result in a more
                 * cluttered chart, though more of the series will be labeled.
                 */
                connectorAllowed: false,

                /**
                 * If the label is closer than this to a neighbour graph, draw a
                 * connector.
                 */
                connectorNeighbourDistance: 24,

                /**
                 * A format string for the label, with support for a subset of
                 * HTML. Variables are enclosed by curly brackets. Available
                 * variables are `name`, `options.xxx`, `color` and other
                 * members from the `series` object. Use this option also to set
                 * a static text for the label.
                 *
                 * @type string
                 * @since 8.1.0
                 */
                format: void 0,

                /**
                 * Callback function to format each of the series' labels. The
                 * `this` keyword refers to the series object. By default the
                 * `formatter` is undefined and the `series.name` is rendered.
                 *
                 * @type {Highcharts.FormatterCallbackFunction<Series>}
                 * @since 8.1.0
                 */
                formatter: void 0,

                /**
                 * For area-like series, allow the font size to vary so that
                 * small areas get a smaller font size. The default applies this
                 * effect to area-like series but not line-like series.
                 *
                 * @type {number|null}
                 */
                minFontSize: null,

                /**
                 * For area-like series, allow the font size to vary so that
                 * small areas get a smaller font size. The default applies this
                 * effect to area-like series but not line-like series.
                 *
                 * @type {number|null}
                 */
                maxFontSize: null,

                /**
                 * Draw the label on the area of an area series. By default it
                 * is drawn on the area. Set it to `false` to draw it next to
                 * the graph instead.
                 *
                 * @type {boolean|null}
                 */
                onArea: null,

                /**
                 * Styles for the series label. The color defaults to the series
                 * color, or a contrast color if `onArea`.
                 *
                 * @type {Highcharts.CSSObject}
                 */
                style: {
                    /** @internal */
                    fontWeight: 'bold'
                },

                /**
                 * An array of boxes to avoid when laying out the labels. Each
                 * item has a `left`, `right`, `top` and `bottom` property.
                 *
                 * @type {Array<Highcharts.LabelIntersectBoxObject>}
                 */
                boxesToAvoid: []

            }

        }

    }

});

/* eslint-disable valid-jsdoc */

/**
 * Counter-clockwise, part of the fast line intersection logic.
 *
 * @private
 * @function ccw
 */
function ccw(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
): boolean {
    var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));

    return cw > 0 ? true : !(cw < 0);
}

/**
 * Detect if two lines intersect.
 *
 * @private
 * @function intersectLine
 */
function intersectLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
): boolean {
    return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
        ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
}

/**
 * Detect if a box intersects with a line.
 *
 * @private
 * @function boxIntersectLine
 */
function boxIntersectLine(
    x: number,
    y: number,
    w: number,
    h: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): boolean {
    return (
        intersectLine(x, y, x + w, y, x1, y1, x2, y2) || // top of label
        intersectLine(x + w, y, x + w, y + h, x1, y1, x2, y2) || // right
        intersectLine(x, y + h, x + w, y + h, x1, y1, x2, y2) || // bottom
        intersectLine(x, y, x, y + h, x1, y1, x2, y2) // left of label
    );
}

/**
 * General symbol definition for labels with connector.
 *
 * @private
 * @function Highcharts.SVGRenderer#symbols.connector
 */
SVGRenderer.prototype.symbols.connector = function (
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Highcharts.SymbolOptionsObject
): SVGPath {
    var anchorX = options && options.anchorX,
        anchorY = options && options.anchorY,
        path: (SVGPath|undefined),
        yOffset: number,
        lateral = w / 2;

    if (isNumber(anchorX) && isNumber(anchorY)) {

        path = [['M', anchorX, anchorY]];

        // Prefer 45 deg connectors
        yOffset = y - anchorY;
        if (yOffset < 0) {
            yOffset = -h - yOffset;
        }
        if (yOffset < w) {
            lateral = anchorX < x + (w / 2) ? yOffset : w - yOffset;
        }

        // Anchor below label
        if (anchorY > y + h) {
            path.push(['L', x + lateral, y + h]);

        // Anchor above label
        } else if (anchorY < y) {
            path.push(['L', x + lateral, y]);

        // Anchor left of label
        } else if (anchorX < x) {
            path.push(['L', x, y + h / 2]);

        // Anchor right of label
        } else if (anchorX > x + w) {
            path.push(['L', x + w, y + h / 2]);
        }
    }
    return path || [];
};

/**
 * Points to avoid. In addition to actual data points, the label should avoid
 * interpolated positions.
 *
 * @private
 * @function Highcharts.Series#getPointsOnGraph
 */
Series.prototype.getPointsOnGraph = function (): (Array<Point>|undefined) {

    if (!this.xAxis && !this.yAxis) {
        return;
    }

    var distance = 16,
        points = this.points,
        point: Point,
        last: Point,
        interpolated: Array<Point> = [],
        i: (number|undefined),
        deltaX: (number|undefined),
        deltaY: (number|undefined),
        delta: (number|undefined),
        len: (number|undefined),
        n: (number|undefined),
        j: (number|undefined),
        d: (SVGPath|undefined),
        graph: SVGElement = this.graph || (this.area as any),
        node: SVGPathElement = graph.element as any,
        inverted = this.chart.inverted,
        xAxis = this.xAxis,
        yAxis = this.yAxis,
        paneLeft: number = inverted ? yAxis.pos : (xAxis.pos as any),
        paneTop: number = inverted ? xAxis.pos : (yAxis.pos as any),
        onArea = pick((this.options.label as any).onArea, !!this.area),
        translatedThreshold = yAxis.getThreshold(this.options.threshold as any),
        grid: Record<string, number> = {};

    /**
     * Push the point to the interpolated points, but only if that position in
     * the grid has not been occupied. As a performance optimization, we divide
     * the plot area into a grid and only add one point per series (#9815).
     * @private
     */
    function pushDiscrete(point: Point): void {
        var cellSize = 8,
            key = Math.round((point.plotX as any) / cellSize) + ',' +
            Math.round((point.plotY as any) / cellSize);

        if (!grid[key]) {
            grid[key] = 1;
            interpolated.push(point);
        }
    }

    // For splines, get the point at length (possible caveat: peaks are not
    // correctly detected)
    if (
        (this as SplineSeries).getPointSpline &&
        node.getPointAtLength &&
        !onArea &&
        // Not performing well on complex series, node.getPointAtLength is too
        // heavy (#9815)
        points.length < (this.chart.plotSizeX as any) / distance
    ) {
        // If it is animating towards a path definition, use that briefly, and
        // reset
        if (graph.toD) {
            d = graph.attr('d') as any;
            graph.attr({ d: graph.toD });
        }
        len = node.getTotalLength();
        for (i = 0; i < len; i += distance) {
            point = node.getPointAtLength(i) as any;
            pushDiscrete({
                chartX: paneLeft + (point.x as any),
                chartY: paneTop + (point.y as any),
                plotX: point.x as any,
                plotY: point.y as any
            } as any);
        }
        if (d) {
            graph.attr({ d: d });
        }
        // Last point
        point = points[points.length - 1];
        point.chartX = paneLeft + (point.plotX as any);
        point.chartY = paneTop + (point.plotY as any);
        pushDiscrete(point);

    // Interpolate
    } else {
        len = points.length;
        for (i = 0; i < len; i += 1) {

            point = points[i];
            last = points[i - 1];

            // Absolute coordinates so we can compare different panes
            point.chartX = paneLeft + (point.plotX as any);
            point.chartY = paneTop + (point.plotY as any);
            if (onArea) {
                // Vertically centered inside area
                point.chartCenterY = paneTop + (
                    (point.plotY as any) +
                    pick(point.yBottom, translatedThreshold)
                ) / 2;
            }

            // Add interpolated points
            if (i > 0) {
                deltaX = Math.abs((point.chartX as any) - (last.chartX as any));
                deltaY = Math.abs((point.chartY as any) - (last.chartY as any));
                delta = Math.max(deltaX, deltaY);
                if (delta > distance) {

                    n = Math.ceil(delta / distance);

                    for (j = 1; j < n; j += 1) {
                        pushDiscrete({
                            chartX: (last.chartX as any) +
                                ((point.chartX as any) - (last.chartX as any)) *
                                (j / n),
                            chartY: (last.chartY as any) +
                                ((point.chartY as any) - (last.chartY as any)) *
                                (j / n),
                            chartCenterY: (last.chartCenterY as any) +
                                ((point.chartCenterY as any) -
                                (last.chartCenterY as any)) * (j / n),
                            plotX: (last.plotX as any) +
                                ((point.plotX as any) - (last.plotX as any)) *
                                (j / n),
                            plotY: (last.plotY as any) +
                                ((point.plotY as any) - (last.plotY as any)) *
                                (j / n)
                        } as any);
                    }
                }
            }

            // Add the real point in order to find positive and negative peaks
            if (isNumber(point.plotY)) {
                pushDiscrete(point);
            }
        }
    }

    // Get the bounding box so we can do a quick check first if the bounding
    // boxes overlap.
    /*
    interpolated.bBox = node.getBBox();
    interpolated.bBox.x += paneLeft;
    interpolated.bBox.y += paneTop;
    */
    return interpolated;
};

/**
 * Overridable function to return series-specific font sizes for the labels. By
 * default it returns bigger font sizes for series with the greater sum of y
 * values.
 *
 * @private
 * @function Highcharts.Series#labelFontSize
 */
Series.prototype.labelFontSize = function (
    minFontSize: number,
    maxFontSize: number
): string {
    return minFontSize + (
        ((this.sum as any) / (this.chart.labelSeriesMaxSum as any)) *
        (maxFontSize - minFontSize)
    ) + 'px';
};

/**
 * Check whether a proposed label position is clear of other elements.
 *
 * @private
 * @function Highcharts.Series#checkClearPoint
 */
Series.prototype.checkClearPoint = function (
    x: number,
    y: number,
    bBox: BBoxObject,
    checkDistance?: boolean
): (boolean|Highcharts.LabelClearPointObject) {
    var distToOthersSquared = Number.MAX_VALUE, // distance to other graphs
        distToPointSquared = Number.MAX_VALUE,
        dist,
        connectorPoint,
        onArea = pick((this.options.label as any).onArea, !!this.area),
        findDistanceToOthers = (
            onArea || (this.options.label as any).connectorAllowed
        ),
        chart = this.chart,
        series: (Series|undefined),
        points: (Array<Point>|undefined),
        leastDistance = 16,
        withinRange: (boolean|undefined),
        xDist: (number|undefined),
        yDist: (number|undefined),
        i: (number|undefined),
        j: (number|undefined);

    /**
     * @private
     */
    function intersectRect(
        r1: Highcharts.LabelIntersectBoxObject,
        r2: Highcharts.LabelIntersectBoxObject
    ): boolean {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }

    /**
     * Get the weight in order to determine the ideal position. Larger distance
     * to other series gives more weight. Smaller distance to the actual point
     * (connector points only) gives more weight.
     * @private
     */
    function getWeight(
        distToOthersSquared: number,
        distToPointSquared: number
    ): number {
        return distToOthersSquared - distToPointSquared;
    }

    // First check for collision with existing labels
    for (i = 0; i < (chart.boxesToAvoid as any).length; i += 1) {
        if (intersectRect((chart.boxesToAvoid as any)[i], {
            left: x,
            right: x + bBox.width,
            top: y,
            bottom: y + bBox.height
        })) {
            return false;
        }
    }

    // For each position, check if the lines around the label intersect with any
    // of the graphs.
    for (i = 0; i < chart.series.length; i += 1) {
        series = chart.series[i];
        points = series.interpolatedPoints;
        if (series.visible && points) {
            for (j = 1; j < points.length; j += 1) {

                if (
                    // To avoid processing, only check intersection if the X
                    // values are close to the box.
                    (points[j].chartX as any) >= x - leastDistance &&
                    (points[j - 1].chartX as any) <= x + bBox.width +
                    leastDistance
                    /* @todo condition above is not the same as below
                    (
                        (points[j].chartX as any) >=
                        (x - leastDistance)
                    ) && (
                        (points[j - 1].chartX as any) <=
                        (x + bBox.width + leastDistance)
                    ) */
                ) {
                    // If any of the box sides intersect with the line, return.
                    if (boxIntersectLine(
                        x,
                        y,
                        bBox.width,
                        bBox.height,
                        points[j - 1].chartX as any,
                        points[j - 1].chartY as any,
                        points[j].chartX as any,
                        points[j].chartY as any
                    )) {
                        return false;
                    }

                    // But if it is too far away (a padded box doesn't
                    // intersect), also return.
                    if (this === series && !withinRange && checkDistance) {
                        withinRange = boxIntersectLine(
                            x - leastDistance,
                            y - leastDistance,
                            bBox.width + 2 * leastDistance,
                            bBox.height + 2 * leastDistance,
                            points[j - 1].chartX as any,
                            points[j - 1].chartY as any,
                            points[j].chartX as any,
                            points[j].chartY as any
                        );
                    }
                }

                // Find the squared distance from the center of the label. On
                // area series, avoid its own graph.
                if (
                    (findDistanceToOthers || withinRange) &&
                    (this !== series || onArea)
                ) {
                    xDist = x + bBox.width / 2 - (points[j].chartX as any);
                    yDist = y + bBox.height / 2 - (points[j].chartY as any);
                    distToOthersSquared = Math.min(
                        distToOthersSquared,
                        xDist * xDist + yDist * yDist
                    );
                }
            }

            // Do we need a connector?
            if (
                !onArea &&
                findDistanceToOthers &&
                this === series &&
                (
                    (checkDistance && !withinRange) ||
                    distToOthersSquared < Math.pow(
                        (this.options.label as any).connectorNeighbourDistance,
                        2
                    )
                )
            ) {
                for (j = 1; j < points.length; j += 1) {
                    dist = Math.min(
                        (
                            Math.pow(
                                x + bBox.width / 2 - (points[j].chartX as any),
                                2
                            ) +
                            Math.pow(
                                y + bBox.height / 2 - (points[j].chartY as any),
                                2
                            )
                        ),
                        (
                            Math.pow(x - (points[j].chartX as any), 2) +
                            Math.pow(y - (points[j].chartY as any), 2)
                        ),
                        (
                            Math.pow(
                                x + bBox.width - (points[j].chartX as any),
                                2
                            ) +
                            Math.pow(y - (points[j].chartY as any), 2)
                        ),
                        (
                            Math.pow(
                                x + bBox.width - (points[j].chartX as any),
                                2
                            ) +
                            Math.pow(
                                y + bBox.height - (points[j].chartY as any),
                                2
                            )
                        ),
                        (
                            Math.pow(x - (points[j].chartX as any), 2) +
                            Math.pow(
                                y + bBox.height - (points[j].chartY as any),
                                2
                            )
                        )
                    );
                    if (dist < distToPointSquared) {
                        distToPointSquared = dist;
                        connectorPoint = points[j];
                    }
                }
                withinRange = true;
            }
        }
    }

    return !checkDistance || withinRange ? {
        x: x,
        y: y,
        weight: getWeight(
            distToOthersSquared,
            connectorPoint ? distToPointSquared : 0
        ),
        connectorPoint: connectorPoint
    } : false;

};

/**
 * The main initialize method that runs on chart level after initialization and
 * redraw. It runs in  a timeout to prevent locking, and loops over all series,
 * taking all series and labels into account when placing the labels.
 *
 * @private
 * @function Highcharts.Chart#drawSeriesLabels
 */
Chart.prototype.drawSeriesLabels = function (): void {

    // console.time('drawSeriesLabels');

    var chart = this,
        labelSeries: Array<Series> = this.labelSeries as any;

    chart.boxesToAvoid = [];

    // Build the interpolated points
    labelSeries.forEach(function (series): void {
        series.interpolatedPoints = series.getPointsOnGraph();

        ((series.options.label as any).boxesToAvoid || []).forEach(function (
            box: Highcharts.LabelIntersectBoxObject
        ): void {
            (chart.boxesToAvoid as any).push(box);
        });
    });

    chart.series.forEach(function (series): void {

        const labelOptions = series.options.label;

        if (!labelOptions || (!series.xAxis && !series.yAxis)) {
            return;
        }

        var bBox: (BBoxObject|undefined),
            x: (number|undefined),
            y: (number|undefined),
            results: Array<Highcharts.LabelClearPointObject> = [],
            clearPoint,
            i: (number|undefined),
            best,
            inverted = chart.inverted,
            paneLeft: number = (
                inverted ? series.yAxis.pos : (series.xAxis.pos as any)
            ),
            paneTop: number = (
                inverted ? series.xAxis.pos : (series.yAxis.pos as any)
            ),
            paneWidth = chart.inverted ? series.yAxis.len : series.xAxis.len,
            paneHeight = chart.inverted ? series.xAxis.len : series.yAxis.len,
            points: Array<Point> = series.interpolatedPoints as any,
            onArea = pick(labelOptions.onArea, !!series.area),
            label: SVGElement = series.labelBySeries as any,
            isNew = !label,
            minFontSize = labelOptions.minFontSize,
            maxFontSize = labelOptions.maxFontSize,
            dataExtremes,
            areaMin: (number|undefined),
            areaMax: (number|undefined),
            colorClass = 'highcharts-color-' + pick(series.colorIndex, 'none');

        // Stay within the area data bounds (#10038)
        if (onArea && !inverted) {
            dataExtremes = [
                series.xAxis.toPixels((series.xData as any)[0]),
                series.xAxis.toPixels(
                    (series.xData as any)[(series.xData as any).length - 1]
                )
            ];
            areaMin = Math.min.apply(Math, dataExtremes);
            areaMax = Math.max.apply(Math, dataExtremes);
        }

        /**
         * @private
         */
        function insidePane(
            x: number,
            y: number,
            bBox: BBoxObject
        ): boolean {
            var leftBound = Math.max(paneLeft as any, pick(areaMin, -Infinity)),
                rightBound = Math.min(
                    (paneLeft as any) + paneWidth,
                    pick(areaMax, Infinity)
                );
            return (
                x > leftBound &&
                x <= rightBound - bBox.width &&
                y >= (paneTop as any) &&
                y <= (paneTop as any) + paneHeight - bBox.height
            );
        }

        /**
         * @private
         */
        function destroyLabel(): void {
            if (label) {
                series.labelBySeries = label.destroy();
            }
        }

        if (series.visible && !series.isSeriesBoosting && points) {
            if (!label) {

                let labelText = series.name;
                if (typeof labelOptions.format === 'string') {
                    labelText = format(labelOptions.format, series, chart);
                } else if (labelOptions.formatter) {
                    labelText = labelOptions.formatter.call(series);
                }

                series.labelBySeries = label = chart.renderer
                    .label(labelText, 0, -9999, 'connector')
                    .addClass(
                        'highcharts-series-label ' +
                        'highcharts-series-label-' + series.index + ' ' +
                        (series.options.className || '') + ' ' +
                        colorClass
                    );

                if (!chart.renderer.styledMode) {
                    label.css(extend<CSSObject>({
                        color: onArea ?
                            chart.renderer.getContrast(series.color as any) :
                            (series.color as any)
                    }, labelOptions.style || {}));

                    label.attr({
                        opacity: chart.renderer.forExport ? 1 : 0,
                        stroke: series.color,
                        'stroke-width': 1
                    });
                }

                // Adapt label sizes to the sum of the data
                if (minFontSize && maxFontSize) {
                    label.css({
                        fontSize: series.labelFontSize(minFontSize, maxFontSize)
                    });
                }

                label
                    .attr({
                        padding: 0,
                        zIndex: 3
                    })
                    .add();
            }

            bBox = label.getBBox();
            bBox.width = Math.round(bBox.width);

            // Ideal positions are centered above or below a point on right side
            // of chart
            for (i = points.length - 1; i > 0; i -= 1) {

                if (onArea) {

                    // Centered
                    x = (points[i].chartX as any) - bBox.width / 2;
                    y = (points[i].chartCenterY as any) - bBox.height / 2;
                    if (insidePane(x, y, bBox)) {
                        best = series.checkClearPoint(
                            x,
                            y,
                            bBox
                        );
                    }
                    if (best) {
                        results.push(best as any);
                    }


                } else {

                    // Right - up
                    x = (points[i].chartX as any) + labelDistance;
                    y = (points[i].chartY as any) - bBox.height - labelDistance;
                    if (insidePane(x as any, y as any, bBox)) {
                        best = series.checkClearPoint(
                            x as any,
                            y as any,
                            bBox,
                            true
                        );
                    }
                    if (best) {
                        results.push(best as any);
                    }

                    // Right - down
                    x = (points[i].chartX as any) + labelDistance;
                    y = (points[i].chartY as any) + labelDistance;
                    if (insidePane(x as any, y as any, bBox)) {
                        best = series.checkClearPoint(
                            x as any,
                            y as any,
                            bBox,
                            true
                        );
                    }
                    if (best) {
                        results.push(best as any);
                    }

                    // Left - down
                    x = (points[i].chartX as any) - bBox.width - labelDistance;
                    y = (points[i].chartY as any) + labelDistance;
                    if (insidePane(x as any, y as any, bBox)) {
                        best = series.checkClearPoint(
                            x as any,
                            y as any,
                            bBox,
                            true
                        );
                    }
                    if (best) {
                        results.push(best as any);
                    }

                    // Left - up
                    x = (points[i].chartX as any) - bBox.width - labelDistance;
                    y = (points[i].chartY as any) - bBox.height - labelDistance;
                    if (insidePane(x as any, y as any, bBox)) {
                        best = series.checkClearPoint(
                            x as any,
                            y as any,
                            bBox,
                            true
                        );
                    }
                    if (best) {
                        results.push(best as any);
                    }
                }
            }

            // Brute force, try all positions on the chart in a 16x16 grid
            if (labelOptions.connectorAllowed && !results.length && !onArea) {
                for (
                    x = paneLeft + paneWidth - bBox.width;
                    x >= paneLeft;
                    x -= 16
                ) {
                    for (
                        y = paneTop;
                        y < paneTop + paneHeight - bBox.height;
                        y += 16
                    ) {
                        clearPoint = series.checkClearPoint(x, y, bBox, true);
                        if (clearPoint) {
                            results.push(clearPoint as any);
                        }
                    }
                }
            }

            if (results.length) {

                results.sort(function (
                    a: Highcharts.LabelClearPointObject,
                    b: Highcharts.LabelClearPointObject
                ): number {
                    return b.weight - a.weight;
                });

                best = results[0];

                (chart.boxesToAvoid as any).push({
                    left: best.x,
                    right: best.x + bBox.width,
                    top: best.y,
                    bottom: best.y + bBox.height
                });

                // Move it if needed
                var dist = Math.sqrt(
                    Math.pow(Math.abs(best.x - (label.x || 0)), 2) +
                    Math.pow(Math.abs(best.y - (label.y || 0)), 2)
                );

                if (dist && series.labelBySeries) {

                    // Move fast and fade in - pure animation movement is
                    // distractive...
                    var attr: SVGAttributes = {
                            opacity: chart.renderer.forExport ? 1 : 0,
                            x: best.x,
                            y: best.y
                        },
                        anim: SVGAttributes = {
                            opacity: 1
                        };

                    // ... unless we're just moving a short distance
                    if (dist <= 10) {
                        anim = {
                            x: attr.x,
                            y: attr.y
                        };
                        attr = {};
                    }

                    // Default initial animation to a fraction of the series
                    // animation (#9396)
                    let animationOptions: Partial<AnimationOptions>|undefined;
                    if (isNew) {
                        animationOptions = animObject(series.options.animation);
                        // @todo: Safely remove any cast after merging #13005
                        (animationOptions.duration as any) *= 0.2;
                    }

                    series.labelBySeries
                        .attr(extend(attr, {
                            anchorX: best.connectorPoint &&
                                (best.connectorPoint.plotX as any) + paneLeft,
                            anchorY: best.connectorPoint &&
                                (best.connectorPoint.plotY as any) + paneTop
                        } as SVGAttributes))
                        .animate(anim, animationOptions);

                    // Record closest point to stick to for sync redraw
                    series.options.kdNow = true;
                    series.buildKDTree();
                    var closest = series.searchPoint({
                        chartX: best.x,
                        chartY: best.y
                    } as any, true);

                    if (closest) {
                        label.closest = [
                            closest,
                            best.x - (closest.plotX || 0),
                            best.y - (closest.plotY || 0)
                        ];
                    }

                }

            } else {
                destroyLabel();
            }
        } else {
            destroyLabel();
        }
    });

    fireEvent(chart, 'afterDrawSeriesLabels');
    // console.timeEnd('drawSeriesLabels');
};

/* eslint-disable no-invalid-this */

/**
 * Prepare drawing series labels.
 *
 * @private
 * @function drawLabels
 */
function drawLabels(this: Chart, e: Event): void {

    if (this.renderer) {
        var chart = this,
            delay = animObject(chart.renderer.globalAnimation).duration;

        chart.labelSeries = [];
        chart.labelSeriesMaxSum = 0;

        U.clearTimeout(chart.seriesLabelTimer as any);

        // Which series should have labels
        chart.series.forEach(function (series): void {
            var options: Highcharts.SeriesLabelOptionsObject =
                    series.options.label as any,
                label: SVGElement = series.labelBySeries as any,
                closest = label && label.closest;

            if (
                options.enabled &&
                series.visible &&
                (series.graph || series.area) &&
                !series.isSeriesBoosting
            ) {
                (chart.labelSeries as any).push(series);

                if (options.minFontSize && options.maxFontSize) {
                    series.sum = (series.yData as any).reduce(function (
                        pv: number,
                        cv: number
                    ): number {
                        return (pv || 0) + (cv || 0);
                    }, 0);
                    chart.labelSeriesMaxSum = Math.max(
                        chart.labelSeriesMaxSum as any,
                        series.sum as any
                    );
                }

                // The labels are processing heavy, wait until the animation is
                // done
                if (e.type === 'load') {
                    delay = Math.max(
                        delay as any,
                        animObject(series.options.animation).duration
                    );
                }

                // Keep the position updated to the axis while redrawing
                if (closest) {
                    if (typeof closest[0].plotX !== 'undefined') {
                        label.animate({
                            x: closest[0].plotX + closest[1],
                            y: closest[0].plotY + closest[2]
                        });
                    } else {
                        label.attr({ opacity: 0 });
                    }
                }
            }
        });

        chart.seriesLabelTimer = syncTimeout(function (): void {
            if (chart.series && chart.labelSeries) { // #7931, chart destroyed
                chart.drawSeriesLabels();
            }
        }, chart.renderer.forExport || !delay ? 0 : delay);
    }

}

// Leave both events, we handle animation differently (#9815)
addEvent(Chart, 'load', drawLabels);
addEvent(Chart, 'redraw', drawLabels);
