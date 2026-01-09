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

import type BoxPlotPoint from './BoxPlotPoint';
import type BoxPlotSeriesOptions from './BoxPlotSeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import BoxPlotSeriesDefaults from './BoxPlotSeriesDefaults.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const {
    crisp,
    extend,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The boxplot series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes#boxplot
 *
 * @augments Highcharts.Series
 */
class BoxPlotSeries extends ColumnSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: BoxPlotSeriesOptions = merge(
        ColumnSeries.defaultOptions,
        BoxPlotSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data!: Array<BoxPlotPoint>;

    public options!: BoxPlotSeriesOptions;

    public points!: Array<BoxPlotPoint>;

    /* *
     *
     *  Functions
     *
     * */

    // Get presentational attributes
    public pointAttribs(): SVGAttributes {
        // No attributes should be set on point.graphic which is the group
        return {};
    }


    // Get an SVGPath object for both whiskers
    public getWhiskerPair(
        halfWidth: number,
        stemX: number,
        upperWhiskerLength: number | string,
        lowerWhiskerLength: number | string,
        point: BoxPlotPoint
    ): SVGPath {
        const strokeWidth = point.whiskers.strokeWidth(),
            getWhisker = (
                xLen: number | string,
                yPos: number
            ): SVGPath.Segment[] => {
                const halfLen = relativeLength(xLen, 2 * halfWidth) / 2,
                    crispedYPos = crisp(
                        yPos,
                        strokeWidth
                    );

                return [
                    [
                        'M',
                        crisp(stemX - halfLen),
                        crispedYPos
                    ],
                    [
                        'L',
                        crisp(stemX + halfLen),
                        crispedYPos
                    ]
                ];
            };

        return [
            ...getWhisker(
                upperWhiskerLength,
                point.highPlot
            ),
            ...getWhisker(
                lowerWhiskerLength,
                point.lowPlot
            )
        ];
    }

    // Translate data points from raw values x and y to plotX and plotY
    public translate(): void {
        const series = this,
            yAxis = series.yAxis,
            pointArrayMap = series.pointArrayMap;

        super.translate.apply(series);

        // Do the translation on each point dimension
        series.points.forEach(function (point: BoxPlotPoint): void {
            pointArrayMap.forEach(function (key: string): void {
                if ((point as any)[key] !== null) {
                    (point as any)[key + 'Plot'] = yAxis.translate(
                        (point as any)[key],
                        0 as any,
                        1 as any,
                        0 as any,
                        1 as any
                    );
                }
            });
            point.plotHigh = point.highPlot; // For data label validation
        });
    }

    /**
     * Draw the data points
     * @private
     */
    public drawPoints(): void {
        const series = this,
            points = series.points,
            options = series.options,
            chart = series.chart,
            renderer = chart.renderer,
            // Error bar inherits this series type but doesn't do quartiles
            doQuartiles = series.doQuartiles !== false,
            whiskerLength = series.options.whiskerLength;

        let q1Plot,
            q3Plot,
            highPlot,
            lowPlot,
            medianPlot,
            medianPath: (SVGPath|undefined),
            boxPath: (SVGPath|undefined),
            graphic: (SVGElement|undefined),
            width,
            x,
            right;

        for (const point of points) {
            graphic = point.graphic;

            const verb = graphic ? 'animate' : 'attr',
                shapeArgs = point.shapeArgs,
                boxAttr: SVGAttributes = {},
                stemAttr: SVGAttributes = {},
                whiskersAttr: SVGAttributes = {},
                medianAttr: SVGAttributes = {},
                color = point.color || series.color,
                pointWhiskerLength = (
                    point.options.whiskerLength ||
                    whiskerLength
                );

            if (typeof point.plotY !== 'undefined') {

                // Vector coordinates
                width = shapeArgs.width;
                x = shapeArgs.x;
                right = x + width;
                q1Plot = doQuartiles ? point.q1Plot : point.lowPlot;
                q3Plot = doQuartiles ? point.q3Plot : point.lowPlot;
                highPlot = point.highPlot;
                lowPlot = point.lowPlot;

                if (!graphic) {
                    point.graphic = graphic = renderer.g('point')
                        .add(series.group);

                    point.stem = renderer.path()
                        .addClass('highcharts-boxplot-stem')
                        .add(graphic);

                    if (whiskerLength) {
                        point.whiskers = renderer.path()
                            .addClass('highcharts-boxplot-whisker')
                            .add(graphic);
                    }
                    if (doQuartiles) {
                        point.box = renderer.path(boxPath)
                            .addClass('highcharts-boxplot-box')
                            .add(graphic);
                    }
                    point.medianShape = renderer.path(medianPath)
                        .addClass('highcharts-boxplot-median')
                        .add(graphic);
                }

                if (!chart.styledMode) {

                    // Stem attributes
                    stemAttr.stroke =
                        point.stemColor || options.stemColor || color;
                    stemAttr['stroke-width'] = pick(
                        point.stemWidth,
                        options.stemWidth,
                        options.lineWidth
                    );
                    stemAttr.dashstyle = (
                        point.stemDashStyle ||
                        options.stemDashStyle ||
                        options.dashStyle
                    );
                    point.stem.attr(stemAttr);

                    // Whiskers attributes
                    if (pointWhiskerLength) {
                        whiskersAttr.stroke = (
                            point.whiskerColor ||
                            options.whiskerColor ||
                            color
                        );
                        whiskersAttr['stroke-width'] = pick(
                            point.whiskerWidth,
                            options.whiskerWidth,
                            options.lineWidth
                        );
                        whiskersAttr.dashstyle = (
                            point.whiskerDashStyle ||
                            options.whiskerDashStyle ||
                            options.dashStyle
                        );
                        point.whiskers.attr(whiskersAttr);
                    }

                    if (doQuartiles) {
                        boxAttr.fill = (
                            point.fillColor ||
                            options.fillColor ||
                            color
                        );
                        boxAttr.stroke = options.lineColor || color;
                        boxAttr['stroke-width'] = options.lineWidth || 0;
                        boxAttr.dashstyle = (
                            point.boxDashStyle ||
                            options.boxDashStyle ||
                            options.dashStyle
                        );
                        point.box.attr(boxAttr);
                    }

                    // Median attributes
                    medianAttr.stroke = (
                        point.medianColor ||
                        options.medianColor ||
                        color
                    );
                    medianAttr['stroke-width'] = pick(
                        point.medianWidth,
                        options.medianWidth,
                        options.lineWidth
                    );
                    medianAttr.dashstyle = (
                        point.medianDashStyle ||
                        options.medianDashStyle ||
                        options.dashStyle
                    );
                    point.medianShape.attr(medianAttr);
                }

                let d: SVGPath;

                // The stem
                const stemX = crisp(
                    (point.plotX || 0) + (series.pointXOffset || 0) +
                        ((series.barW || 0) / 2),
                    point.stem.strokeWidth()
                );
                d = [
                    // Stem up
                    ['M', stemX, q3Plot],
                    ['L', stemX, highPlot],

                    // Stem down
                    ['M', stemX, q1Plot],
                    ['L', stemX, lowPlot]
                ];
                point.stem[verb]({ d });

                // The box
                if (doQuartiles) {
                    const boxStrokeWidth = point.box.strokeWidth();
                    q1Plot = crisp(q1Plot, boxStrokeWidth);
                    q3Plot = crisp(q3Plot, boxStrokeWidth);
                    x = crisp(x, boxStrokeWidth);
                    right = crisp(right, boxStrokeWidth);
                    d = [
                        ['M', x, q3Plot],
                        ['L', x, q1Plot],
                        ['L', right, q1Plot],
                        ['L', right, q3Plot],
                        ['L', x, q3Plot],
                        ['Z']
                    ];
                    point.box[verb]({ d });
                }

                // The whiskers
                if (pointWhiskerLength) {
                    const halfWidth = width / 2,
                        whiskers = this.getWhiskerPair(
                            halfWidth,
                            stemX,
                            (
                                point.upperWhiskerLength ??
                                options.upperWhiskerLength ??
                                pointWhiskerLength
                            ),
                            (
                                point.lowerWhiskerLength ??
                                options.lowerWhiskerLength ??
                                pointWhiskerLength
                            ),
                            point
                        );

                    point.whiskers[verb]({ d: whiskers });
                }

                // The median
                medianPlot = crisp(
                    point.medianPlot,
                    point.medianShape.strokeWidth()
                );

                d = [
                    ['M', x, medianPlot],
                    ['L', right, medianPlot]
                ];
                point.medianShape[verb]({ d });
            }
        }

    }

    // Return a plain array for speedy calculation
    public toYData(point: BoxPlotPoint): Array<number> {
        return [point.low, point.q1, point.median, point.q3, point.high];
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface BoxPlotSeries extends ColumnSeries {
    doQuartiles?: boolean;
    pointArrayMap: Array<string>;
    pointClass: typeof BoxPlotPoint;
    pointValKey: string;
}

extend(BoxPlotSeries.prototype, {
    // Array point configs are mapped to this
    pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'],
    // Defines the top of the tracker
    pointValKey: 'high',
    // Disable data labels for box plot
    drawDataLabels: noop,
    setStackedPoints: noop // #3890
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        boxplot: typeof BoxPlotSeries;
    }
}

SeriesRegistry.registerSeriesType('boxplot', BoxPlotSeries);

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotSeries;
