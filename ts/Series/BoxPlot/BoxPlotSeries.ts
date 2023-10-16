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
    extend,
    merge,
    pick
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

    public data: Array<BoxPlotPoint> = void 0 as any;

    public options: BoxPlotSeriesOptions = void 0 as any;

    public points: Array<BoxPlotPoint> = void 0 as any;

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

    // Translate data points from raw values x and y to plotX and plotY
    public translate(): void {
        const series = this,
            yAxis = series.yAxis,
            pointArrayMap = series.pointArrayMap;

        super.translate.apply(series);

        // do the translation on each point dimension
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
            // error bar inherits this series type but doesn't do quartiles
            doQuartiles = series.doQuartiles !== false,
            whiskerLength = series.options.whiskerLength;

        let q1Plot,
            q3Plot,
            highPlot,
            lowPlot,
            medianPlot,
            medianPath: (SVGPath|undefined),
            crispCorr,
            crispX = 0,
            boxPath: (SVGPath|undefined),
            graphic: (SVGElement|undefined),
            width,
            left,
            right,
            halfWidth,
            pointWiskerLength;

        for (const point of points) {
            graphic = point.graphic;

            const verb = graphic ? 'animate' : 'attr',
                shapeArgs = point.shapeArgs,
                boxAttr: SVGAttributes = {},
                stemAttr: SVGAttributes = {},
                whiskersAttr: SVGAttributes = {},
                medianAttr: SVGAttributes = {},
                color = point.color || series.color;

            if (typeof point.plotY !== 'undefined') {

                // crisp vector coordinates
                width = Math.round(shapeArgs.width);
                left = Math.floor(shapeArgs.x);
                right = left + width;
                halfWidth = Math.round(width / 2);
                q1Plot = Math.floor(doQuartiles ? point.q1Plot : point.lowPlot);
                q3Plot = Math.floor(doQuartiles ? point.q3Plot : point.lowPlot);
                highPlot = Math.floor(point.highPlot);
                lowPlot = Math.floor(point.lowPlot);

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
                    if (whiskerLength) {
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
                crispCorr = (point.stem.strokeWidth() % 2) / 2;
                crispX = left + halfWidth + crispCorr;
                d = [
                    // stem up
                    ['M', crispX, q3Plot],
                    ['L', crispX, highPlot],

                    // stem down
                    ['M', crispX, q1Plot],
                    ['L', crispX, lowPlot]
                ];
                point.stem[verb]({ d });

                // The box
                if (doQuartiles) {
                    crispCorr = (point.box.strokeWidth() % 2) / 2;
                    q1Plot = Math.floor(q1Plot) + crispCorr;
                    q3Plot = Math.floor(q3Plot) + crispCorr;
                    left += crispCorr;
                    right += crispCorr;
                    d = [
                        ['M', left, q3Plot],
                        ['L', left, q1Plot],
                        ['L', right, q1Plot],
                        ['L', right, q3Plot],
                        ['L', left, q3Plot],
                        ['Z']
                    ];
                    point.box[verb]({ d });
                }

                // The whiskers
                if (whiskerLength) {
                    crispCorr = (point.whiskers.strokeWidth() % 2) / 2;
                    highPlot = highPlot + crispCorr;
                    lowPlot = lowPlot + crispCorr;
                    pointWiskerLength = (/%$/).test(whiskerLength as any) ?
                        halfWidth * parseFloat(whiskerLength as any) / 100 :
                        (whiskerLength as any) / 2;
                    d = [
                        // High whisker
                        ['M', crispX - pointWiskerLength, highPlot],
                        ['L', crispX + pointWiskerLength, highPlot],

                        // Low whisker
                        ['M', crispX - pointWiskerLength, lowPlot],
                        ['L', crispX + pointWiskerLength, lowPlot]
                    ];
                    point.whiskers[verb]({ d });
                }

                // The median
                medianPlot = Math.round(point.medianPlot);
                crispCorr = (point.medianShape.strokeWidth() % 2) / 2;
                medianPlot = medianPlot + crispCorr;

                d = [
                    ['M', left, medianPlot],
                    ['L', right, medianPlot]
                ];
                point.medianShape[verb]({ d });
            }
        }

    }

    // return a plain array for speedy calculation
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
    // array point configs are mapped to this
    pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'],
    // defines the top of the tracker
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
