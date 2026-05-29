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

import type BoxPlotPoint from './BoxPlotPoint';
import type BoxPlotSeriesOptions from './BoxPlotSeriesOptions';
import type {
    BoxPlotDataLabelOptions,
    BoxPlotPointValKey
} from './BoxPlotSeriesOptions';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import BoxPlotSeriesDefaults from './BoxPlotSeriesDefaults.js';
import ColumnSeries from '../Column/ColumnSeries.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import {
    crisp,
    extend,
    merge,
    pick,
    relativeLength,
    splat
} from '../../Shared/Utilities.js';

/* *
 *
 *  Class
 *
 * */

/**
 * The boxplot series type.
 *
 * @internal
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

    /**
     * Resolve the data label's `pointValKey` option, falling back to the
     * series `pointValKey` when it is missing or not one of the box plot
     * values (`pointArrayMap`). Shared by rendering and alignment.
     * @internal
     */
    public resolvePointValKey(
        rawKey?: BoxPlotPointValKey
    ): BoxPlotPointValKey {
        return rawKey && this.pointArrayMap.indexOf(rawKey) > -1 ?
            rawKey :
            this.pointValKey;
    }

    /**
     * Render the data labels. Each label config is drawn in its own pass with
     * `point.y`/`point.plotY` set to the statistic selected by its
     * `pointValKey`, so the formatter, the `{point.y}` token and
     * `dataLabels.filter` all operate on that value. Positioning is delegated
     * to `alignDataLabel`. The rendered labels are cached per config index on
     * the point, so they are reused on redraw instead of duplicated.
     * @internal
     */
    public drawDataLabels(): void {
        const series = this,
            points = series.points,
            originalOptions = series.options.dataLabels;

        if (!series.hasDataLabels?.()) {
            return;
        }

        const labelConfigs = splat(
                originalOptions || {}
            ) as Array<BoxPlotDataLabelOptions>,
            // Box plot data label defaults (incl. the value formatter), merged
            // into every config since the per-config rendering below replaces
            // series.options.dataLabels and would otherwise drop them
            dlDefaults = splat(
                BoxPlotSeries.defaultOptions.dataLabels || {}
            )[0],
            pointCount = points.length,
            // Type plot options carry the same dataLabels array; null it while
            // rendering so each pass produces a single label, not the whole set
            typePlotOptions = series.chart.options
                .plotOptions?.[series.type],
            savedTypePlotDL = typePlotOptions?.dataLabels,
            originalY = points.map((point): BoxPlotPoint['y'] => point.y),
            originalPlotY = points.map(
                (point): BoxPlotPoint['plotY'] => point.plotY
            );

        if (typePlotOptions) {
            typePlotOptions.dataLabels = void 0;
        }

        labelConfigs.forEach((labelOptions, index): void => {
            const pointValKey = series.resolvePointValKey(
                labelOptions.pointValKey
            );

            series.options.dataLabels = merge(dlDefaults, labelOptions);

            for (let i = 0; i < pointCount; ++i) {
                const point = points[i],
                    cache = point.boxPlotDataLabels ||= [],
                    label = cache[index];

                // Expose the selected statistic for formatting and filtering
                point.y = point[pointValKey];
                point.plotY = point[`${pointValKey}Plot`];
                // Reuse the label drawn for this config in the previous redraw
                point.dataLabel = label;
                point.dataLabels = label ? [label] : [];
            }

            ColumnSeries.prototype.drawDataLabels.call(series, points);

            for (let i = 0; i < pointCount; ++i) {
                const point = points[i],
                    cache = point.boxPlotDataLabels || [];

                cache[index] = point.dataLabel;
                point.boxPlotDataLabels = cache;
            }
        });

        series.options.dataLabels = originalOptions;
        if (typePlotOptions) {
            typePlotOptions.dataLabels = savedTypePlotDL;
        }

        for (let i = 0; i < pointCount; ++i) {
            const point = points[i],
                cache = point.boxPlotDataLabels || [];

            // Destroy labels left over from configs that no longer exist
            for (let j = labelConfigs.length; j < cache.length; ++j) {
                cache[j]?.destroy();
            }
            cache.length = labelConfigs.length;

            const finalLabels = cache.filter(
                (label): label is SVGElement => !!label
            );

            point.y = originalY[i];
            point.plotY = originalPlotY[i];
            point.dataLabels = finalLabels;
            point.dataLabel = finalLabels[0];
        }
    }

    /**
     * Align each data label to the box plot value given by its `pointValKey`
     * option, then defer to the column alignment logic (which also handles
     * inverted charts). The data label box is temporarily set to the selected
     * value and restored afterwards, so the next label and subsequent redraws
     * are unaffected.
     * @internal
     */
    public alignDataLabel(
        point: BoxPlotPoint,
        dataLabel: SVGElement,
        options: BoxPlotDataLabelOptions,
        alignTo?: BBoxObject,
        isNew?: boolean
    ): void {
        const series = this,
            pointValKey = series.resolvePointValKey(options.pointValKey),
            plotY = point[`${pointValKey}Plot`],
            shapeArgs = point.shapeArgs,
            originalDlBox = point.dlBox,
            originalBelow = point.below;

        // Position the alignment box at the selected value (#23904)
        if (shapeArgs && typeof plotY === 'number') {
            point.dlBox = {
                x: shapeArgs.x,
                y: plotY,
                width: shapeArgs.width,
                height: 0
            };
        }
        // Place the `low` label below the value, the rest above
        point.below = pointValKey === 'low';

        ColumnSeries.prototype.alignDataLabel.call(
            series,
            point,
            dataLabel,
            options,
            alignTo,
            isNew
        );

        point.dlBox = originalDlBox;
        point.below = originalBelow;
    }

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
            pointArrayMap.forEach(function (key: BoxPlotPointValKey): void {
                const value = point[key];
                if (value !== null) {
                    point[`${key}Plot`] = yAxis.translate(
                        value,
                        false,
                        true,
                        false,
                        true
                    );
                }
            });
            point.plotHigh = point.highPlot; // For data label validation
        });
    }

    /**
     * Draw the data points
     * @internal
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

/** @internal */
interface BoxPlotSeries extends ColumnSeries {
    doQuartiles?: boolean;
    pointArrayMap: Array<BoxPlotPointValKey>;
    pointClass: typeof BoxPlotPoint;
    pointValKey: BoxPlotPointValKey;
}

extend(BoxPlotSeries.prototype, {
    // Array point configs are mapped to this
    pointArrayMap: ['low', 'q1', 'median', 'q3', 'high'],
    // Defines the top of the tracker
    pointValKey: 'high',
    setStackedPoints: noop // #3890
});

/* *
 *
 *  Registry
 *
 * */

/** @internal */
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

/**
 * @internal
 */
export default BoxPlotSeries;
