/* *
 *
 *  (c) 2010-2022 Torstein Honsi, Magdalena Gut
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

import '../Column/ColumnSeries.js';
import '../../Extensions/PatternFill.js';

import type PictorialSeriesOptions from './PictorialSeriesOptions';
import type ColorType from '../../Core/Color/ColorType.js';
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';

import PictorialPoint from './PictorialPoint.js';
import U from '../../Core/Utilities.js';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import StackItem from '../../Extensions/Stacking.js';
import A from '../../Core/Animation/AnimationUtilities.js';
import PictorialUtilities from './PictorialUtilities.js';
import { PictorialPathOptions } from './PictorialSeriesOptions';
import Chart from '../../Core/Chart/Chart.js';


const {
    seriesTypes: {
        column: ColumnSeries
    }
} = SeriesRegistry;

const {
    animObject
} = A;

const {
    addEvent,
    defined,
    merge,
    pick,
    objectEach
} = U;

const {
    rescalePatternFill,
    invertShadowGroup,
    getStackMetrics
} = PictorialUtilities;

const fillUrlMatcher = /url\(([^)]+)\)/;

export interface StackShadowOptions {
    borderWidth?: number;
    enabled?: boolean;
    color?: ColorType;
    borderColor?: ColorType
}

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        stackShadow?: StackShadowOptions;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * The pictorial series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.pictorial
 *
 * @augments Highcharts.Series
 */
class PictorialSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A pictorial graph is a variation of a column graph. The biggest
     * difference is related to the shape of the data point, taken
     * from the path parameter.
     *
     * @sample {highcharts} highcharts/demo/pictorial-graph/
     *         Pictorial graph
     *
     * @extends      plotOptions.column
     * @since        next
     * @product      highcharts
     * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
     *               dataSorting, boostBlending
     * @requires     modules/pictorial
     * @optionparent plotOptions.pictorial
     */

    public static defaultOptions: PictorialSeriesOptions = merge(ColumnSeries.defaultOptions, {
        borderWidth: 0
    } as PictorialSeriesOptions);

    /* *
     *
     * Properties
     *
     * */

    public paths: Array<PictorialPathOptions> = void 0 as any;

    public data: Array<PictorialPoint> = void 0 as any;

    public options: PictorialSeriesOptions = void 0 as any;

    public points: Array<PictorialPoint> = void 0 as any;

    /* *
     *
     * Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Animate in the series. Called internally twice. First with the `init`
     * parameter set to true, which sets up the initial state of the
     * animation. Then when ready, it is called with the `init` parameter
     * undefined, in order to perform the actual animation.
     *
     * @function Highcharts.Series#animate
     *
     * @param {boolean} [init]
     * Initialize the animation.
     */
    public animate(init?: boolean): void {
        const { chart, group } = this,
            inverted = chart.inverted,
            animation = animObject(this.options.animation),
            // The key for temporary animation clips
            animationClipKey = [
                this.getSharedClipKey(),
                animation.duration,
                animation.easing,
                animation.defer
            ].join(',');

        let animationClipRect = chart.sharedClips[animationClipKey];

        // Initialize the animation. Set up the clipping rectangle.
        if (init && group) {
            const clipBox = this.getClipBox();
            // Create temporary animation clips
            if (!animationClipRect) {
                clipBox.y = clipBox.height;
                clipBox.height = 0;

                animationClipRect = chart.renderer.clipRect(clipBox);
                chart.sharedClips[animationClipKey] = animationClipRect;
            }

            group.clip(animationClipRect);

        // Run the animation
        } else if (
            animationClipRect &&
            // Only first series in this pane
            !animationClipRect.hasClass('highcharts-animating')
        ) {
            const finalBox = this.getClipBox();

            animationClipRect
                .addClass('highcharts-animating')
                .animate(finalBox, animation);
        }
    }

    public animateDrilldown(): void {}
    public animateDrillupFrom(): void {}

    public pointAttribs(
        point?: PictorialPoint
    ): SVGAttributes {
        const pointAttribs = super.pointAttribs.apply(this, arguments),
            seriesOptions = this.options,
            series = this,
            paths = seriesOptions.paths;

        if (point && point.shapeArgs && paths) {
            const shape = paths[point.index % paths.length];
            const { y, height } = getStackMetrics(series.yAxis, shape);

            const pathDef = shape.definition;

            // New pattern, replace
            if (pathDef !== point.pathDef) {
                point.pathDef = pathDef;

                pointAttribs.fill = {
                    pattern: {
                        path: {
                            d: pathDef,
                            fill: pointAttribs.fill,
                            strokeWidth: pointAttribs['stroke-width'],
                            stroke: pointAttribs.stroke
                        },
                        x: point.shapeArgs.x,
                        y: y,
                        width: point.shapeArgs.width || 0,
                        height: height,
                        patternContentUnits: 'objectBoundingBox',
                        backgroundColor: 'none',
                        color: '#ff0000'
                    }
                };
            } else if (point.pathDef && point.graphic) {
                delete pointAttribs.fill;
            }
        }

        delete pointAttribs.stroke;
        delete pointAttribs.strokeWidth;
        return pointAttribs;
    }

    /**
     * Make sure that path.max is also considered when calculating dataMax.
     */

    public getExtremes(): DataExtremesObject {
        const extremes = super.getExtremes.apply(this, arguments),
            series = this,
            paths = series.options.paths;

        if (paths) {
            paths.forEach(function (path: PictorialPathOptions): void {
                if (
                    defined(path.max) &&
                    defined(extremes.dataMax) &&
                    path.max > extremes.dataMax
                ) {
                    extremes.dataMax = path.max;
                }
            });
        }

        return extremes;
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Events
 *
 * */

addEvent(PictorialSeries, 'afterRender', function (): void {
    const series = this,
        paths = series.options.paths;

    series.points.forEach(function (point: PictorialPoint): void {
        if (point.graphic && point.shapeArgs && paths) {
            const shape = paths[point.index % paths.length];
            const fill = point.graphic.attr('fill') as string;
            const match = fill && fill.match(fillUrlMatcher);
            const { y, height } = getStackMetrics(series.yAxis, shape);

            if (match && series.chart.renderer.patternElements) {
                const currentPattern =
                series.chart.renderer.patternElements[match[1].slice(1)];

                if (currentPattern) {
                    currentPattern.animate({
                        x: point.shapeArgs.x,
                        y: y,
                        width: point.shapeArgs.width || 0,
                        height: height
                    });
                }
            }

            rescalePatternFill(
                point.graphic,
                getStackMetrics(series.yAxis, shape).height,
                point.shapeArgs.width || 0,
                point.shapeArgs.height || Infinity,
                series.options.borderWidth || 0
            );
        }
    });
});

function renderStackShadow(
    stack: StackItem
): void {

    // Get first pictorial series
    const stackKeys = Object
        .keys(stack.points)
        .filter((p): boolean => p.split(',').length > 1);
    let allSeries = stack.axis.chart.series;
    let seriesIndexes = stackKeys.map((key): number =>
        parseFloat(key.split(',')[0]));
    let seriesIndex = -1;

    seriesIndexes.forEach((index): void => {
        if (allSeries[index] && allSeries[index].visible) {
            seriesIndex = index;
        }
    });

    const series = stack.axis.chart.series[seriesIndex] as PictorialSeries;

    if (
        series &&
        series.is('pictorial') &&
        stack.axis.hasData() &&
        series.xAxis.hasData()
    ) {
        const xAxis = series.xAxis;
        const options = stack.axis.options;
        const chart = stack.axis.chart;
        const stackShadow = stack.shadow;
        const xCenter = xAxis.toPixels(stack.x, true);
        const x = chart.inverted ? xAxis.len - xCenter : xCenter;
        const paths = series.options.paths || [];
        const index = stack.x % paths.length;
        const shape = paths[index];
        const width = series.getColumnMetrics &&
            series.getColumnMetrics().width;
        const { height, y } = getStackMetrics(series.yAxis, shape);
        const shadowOptions = options.stackShadow;
        const strokeWidth = pick(
            shadowOptions && shadowOptions.borderWidth,
            series.options.borderWidth,
            1
        );

        if (
            !stackShadow &&
            shadowOptions &&
            shadowOptions.enabled &&
            shape
        ) {
            if (!stack.shadowGroup) {
                stack.shadowGroup = chart.renderer.g('shadowGroup')
                    .attr({
                        translateX: chart.inverted ?
                            stack.axis.pos : xAxis.pos,
                        translateY: chart.inverted ?
                            xAxis.pos : stack.axis.pos
                    })
                    .add();
            }

            stack.shadow = chart.renderer.rect(x, y, width, height)
                .attr({
                    fill: {
                        pattern: {
                            path: {
                                d: shape.definition,
                                fill: shadowOptions.color ||
                                    '#dedede',
                                strokeWidth: strokeWidth,
                                stroke: shadowOptions.borderColor ||
                                'transparent'
                            },
                            x: x,
                            y: y,
                            width: width,
                            height: height,
                            patternContentUnits: 'objectBoundingBox',
                            backgroundColor: 'none',
                            color: '#dedede'
                        }
                    }
                })
                .add(stack.shadowGroup);

            invertShadowGroup(
                stack.shadowGroup,
                xAxis,
                stack.axis
            );

            rescalePatternFill(
                stack.shadow,
                height,
                width,
                height,
                strokeWidth
            );

            stack.setOffset(
                series.pointXOffset || 0,
                series.barW || 0
            );

        } else if (stackShadow && stack.shadowGroup) {
            stackShadow.animate({
                x,
                y,
                width,
                height
            });

            const fill = stackShadow.attr('fill') as string;
            const match = fill && fill.match(fillUrlMatcher);

            if (match && chart.renderer.patternElements) {
                chart.renderer.patternElements[match[1].slice(1)]
                    .animate({
                        x,
                        y,
                        width,
                        height
                    });
            }
            stack.shadowGroup.animate({
                translateX: chart.inverted ?
                    stack.axis.pos : xAxis.pos,
                translateY: chart.inverted ?
                    xAxis.pos : stack.axis.pos
            });

            invertShadowGroup(
                stack.shadowGroup,
                xAxis,
                stack.axis
            );

            rescalePatternFill(
                stackShadow,
                height,
                width,
                height,
                strokeWidth
            );

            stack.setOffset(
                series.pointXOffset || 0,
                series.barW || 0
            );

        }
    } else if (stack.shadow && stack.shadowGroup) {
        stack.shadow.destroy();
        stack.shadow = void 0;

        stack.shadowGroup.destroy();
        stack.shadowGroup = void 0;
    }
}

addEvent(Chart, 'render', function (): void {
    const chart = this;

    chart.axes.forEach(function (axis): void {
        if (!axis.stacking) {
            return;
        }

        const stacks = axis.stacking.stacks;
        // Render each stack total
        objectEach(stacks, function (
            type: Record<string, Highcharts.StackItem>
        ): void {
            objectEach(type, function (stack: Highcharts.StackItem): void {
                renderStackShadow(stack);
            });
        });
    });

});

addEvent(StackItem, 'afterSetOffset', function (e): void {

    if (this.shadow) {
        this.shadow.attr({
            translateX: (e as any).xOffset
        });
        this.shadow.animate({
            width: (e as any).xWidth
        });
    }
});

/* *
 *
 *  Class Prototype
 *
 * */

interface PictorialSeries {
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof PictorialPoint;
}

PictorialSeries.prototype.pointClass = PictorialPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        pictorial: typeof PictorialSeries;
    }
}
SeriesRegistry.registerSeriesType('pictorial', PictorialSeries);

/* *
 *
 *  Default Export
 *
 * */

export default PictorialSeries;

/* *
 *
 * API Options
 *
 * */

/**
 * A `pictorial` series. If the [type](#series.pictorial.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.pictorial
 * @since     next
 * @product   highcharts
 * @excluding dataParser, dataURL, marker, dataSorting, boostThreshold,
 *            boostBlending, edgeColor
 * @requires  modules/pictorial
 * @apioption series.pictorial
 */

/**
 * An array of data points for the series. For the `pictorial` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 2 values. In this case, the values correspond
 *    to `x,y`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 40],
 *        [1, 50],
 *        [2, 60]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.pictorial.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 0,
 *        y: 40,
 *        name: "Point1",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 60,
 *        name: "Point2",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.column.data
 * @since     next
 * @product   highcharts
 * @apioption series.pictorial.data
 */

''; // adds doclets above to transpiled file
