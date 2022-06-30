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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type FormatUtilities from '../../Core/FormatUtilities';
import type Point from '../../Core/Series/Point';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type {
    LabelIntersectBoxObject,
    SeriesLabelOptions
} from './SeriesLabelOptions';
import type SplineSeries from '../../Series/Spline/SplineSeries';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import Chart from '../../Core/Chart/Chart.js';
import F from '../../Core/FormatUtilities.js';
const { format } = F;
import D from '../../Core/DefaultOptions.js';
const { setOptions } = D;
import Series from '../../Core/Series/Series.js';
import SeriesLabelDefaults from './SeriesLabelDefaults.js';
import SLU from './SeriesLabelUtilities.js';
const {
    boxIntersectLine,
    intersectRect
} = SLU;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
const { prototype: { symbols } } = SVGRenderer;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    fireEvent,
    isNumber,
    pick,
    syncTimeout
} = U;

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        boxesToAvoid?: Array<LabelIntersectBoxObject>;
        labelSeries?: Array<Series>;
        labelSeriesMaxSum?: number;
        seriesLabelTimer?: number;
        drawSeriesLabels(): void;
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        chartCenterY?: number;
        chartX?: number;
        chartY?: number;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        interpolatedPoints?: Array<Point>;
        labelBySeries?: SVGElement;
        sum?: number;
        checkClearPoint(
            x: number,
            y: number,
            bBox: BBoxObject,
            checkDistance?: boolean
        ): (boolean|LabelClearPointObject);
        drawSeriesLabels(): void;
        getPointsOnGraph(): (Array<Point>|undefined);
        labelFontSize(minFontSize: number, maxFontSize: number): string;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        label?: SeriesLabelOptions;
    }
}

interface LabelClearPointObject extends PositionObject {
    connectorPoint?: Point;
    weight: number;
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

setOptions({ plotOptions: { series: { label: SeriesLabelDefaults } } });

/* eslint-disable valid-jsdoc */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Extensions/SeriesLabel */
        connector: SymbolFunction;
    }
}
/**
 * General symbol definition for labels with connector.
 */
symbols.connector = function (x, y, w, h, options): SVGPath {
    const anchorX = options && options.anchorX,
        anchorY = options && options.anchorY;

    let path: (SVGPath|undefined),
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

    const distance = 16,
        points = this.points,
        interpolated: Array<Point> = [],
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

    let point: Point,
        last: Point,
        i: (number|undefined),
        deltaX: (number|undefined),
        deltaY: (number|undefined),
        delta: (number|undefined),
        len: (number|undefined),
        n: (number|undefined),
        j: (number|undefined),
        d: (SVGPath|undefined);

    /**
     * Push the point to the interpolated points, but only if that position in
     * the grid has not been occupied. As a performance optimization, we divide
     * the plot area into a grid and only add one point per series (#9815).
     * @private
     */
    function pushDiscrete(point: Point): void {
        const cellSize = 8,
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
        (node.getPointAtLength) &&
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
): (boolean|LabelClearPointObject) {
    const chart = this.chart,
        onArea = pick((this.options.label as any).onArea, !!this.area),
        findDistanceToOthers = (
            onArea || (this.options.label as any).connectorAllowed
        ),
        leastDistance = 16;

    let distToOthersSquared = Number.MAX_VALUE, // distance to other graphs
        distToPointSquared = Number.MAX_VALUE,
        dist,
        connectorPoint,
        series: (Series|undefined),
        points: (Array<Point>|undefined),
        withinRange: (boolean|undefined),
        xDist: (number|undefined),
        yDist: (number|undefined),
        i: (number|undefined),
        j: (number|undefined);

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

    const chart = this,
        labelSeries: Array<Series> = this.labelSeries as any;

    chart.boxesToAvoid = [];

    // Build the interpolated points
    labelSeries.forEach(function (series): void {
        series.interpolatedPoints = series.getPointsOnGraph();

        ((series.options.label as any).boxesToAvoid || []).forEach(function (
            box: LabelIntersectBoxObject
        ): void {
            (chart.boxesToAvoid as any).push(box);
        });
    });

    chart.series.forEach(function (series): void {

        const labelOptions = series.options.label;

        if (!labelOptions || (!series.xAxis && !series.yAxis)) {
            return;
        }

        const colorClass = (
                'highcharts-color-' + pick(series.colorIndex, 'none')
            ),
            isNew = !series.labelBySeries,
            minFontSize = labelOptions.minFontSize,
            maxFontSize = labelOptions.maxFontSize,
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
            results: Array<LabelClearPointObject> = [];

        let bBox: (BBoxObject|undefined),
            x: (number|undefined),
            y: (number|undefined),
            clearPoint,
            i: (number|undefined),
            best,
            label: SVGElement = series.labelBySeries as any,
            dataExtremes,
            areaMin: (number|undefined),
            areaMax: (number|undefined);

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
            const leftBound = Math.max(
                    paneLeft as any,
                    pick(areaMin, -Infinity)
                ),
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
                    .label(labelText, 0, 0, 'connector')
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

                results.sort((a, b): number => b.weight - a.weight);

                best = results[0];

                (chart.boxesToAvoid as any).push({
                    left: best.x,
                    right: best.x + bBox.width,
                    top: best.y,
                    bottom: best.y + bBox.height
                });

                // Move it if needed
                const dist = Math.sqrt(
                    Math.pow(Math.abs(best.x - (label.x || 0)), 2) +
                    Math.pow(Math.abs(best.y - (label.y || 0)), 2)
                );

                if (dist && series.labelBySeries) {

                    // Move fast and fade in - pure animation movement is
                    // distractive...
                    let attr: SVGAttributes = {
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
                    const closest = series.searchPoint({
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
        const chart = this;

        let delay = animObject(chart.renderer.globalAnimation).duration;

        chart.labelSeries = [];
        chart.labelSeriesMaxSum = 0;

        U.clearTimeout(chart.seriesLabelTimer as any);

        // Which series should have labels
        chart.series.forEach(function (series): void {
            const options: SeriesLabelOptions = series.options.label as any,
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
