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

import type Axis from '../Axis';
import type Chart from '../../Chart/Chart';
import type ColorAxis from './ColorAxis';
import type ColorAxisOptions from './ColorAxisOptions';
import type ColorType from '../../Color/ColorType';
import type Fx from '../../Animation/Fx';
import type Legend from '../../Legend/Legend';
import type Point from '../../Series/Point';
import type Series from '../../Series/Series';
import type SeriesOptions from '../../Series/SeriesOptions';
import type TreemapSeries from '../../../Series/Treemap/TreemapSeries';

import Color from '../../Color/Color.js';
const { parse: color } = Color;
import U from '../../Utilities.js';
const {
    addEvent,
    extend,
    merge,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Series/PointBase' {
    interface PointBase {
        /** @requires ColorSeriesMixin */
        setVisible(vis?: boolean): void;
    }
}

declare module '../../Series/SeriesBase' {
    interface SeriesBase {
        /** @requires ColorSeriesMixin */
        translateColors(): void;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace ColorAxisComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export interface PointComposition extends Point {
        series: SeriesComposition;
        value?: (number|null);
        setVisible(vis?: boolean): void;
    }

    export interface SeriesComposition extends Series {
        colorAxis: ColorAxis;
        data: Array<PointComposition>;
        points: Array<PointComposition>;
        options: SeriesCompositionOptions;
        optionalAxis?: string;
        translateColors(): void;
    }

    export interface SeriesCompositionOptions extends SeriesOptions {
        nullColor?: ColorType;
    }

    /* *
     *
     *  Variables
     *
     * */

    let ColorAxisConstructor: typeof ColorAxis;

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    export function compose(
        ColorAxisClass: typeof ColorAxis,
        ChartClass: typeof Chart,
        FxClass: typeof Fx,
        LegendClass: typeof Legend,
        SeriesClass: typeof Series
    ): void {
        const chartProto = ChartClass.prototype,
            fxProto = FxClass.prototype,
            seriesProto = SeriesClass.prototype;

        if (!chartProto.collectionsWithUpdate.includes('colorAxis')) {
            ColorAxisConstructor = ColorAxisClass;

            chartProto.collectionsWithUpdate.push('colorAxis');
            chartProto.collectionsWithInit.colorAxis = [
                chartProto.addColorAxis
            ];

            addEvent(ChartClass, 'afterCreateAxes', onChartAfterCreateAxes);

            wrapChartCreateAxis(ChartClass);

            fxProto.fillSetter = wrapFxFillSetter;
            fxProto.strokeSetter = wrapFxStrokeSetter;

            addEvent(LegendClass, 'afterGetAllItems', onLegendAfterGetAllItems);
            addEvent(
                LegendClass,
                'afterColorizeItem',
                onLegendAfterColorizeItem
            );
            addEvent(LegendClass, 'afterUpdate', onLegendAfterUpdate);

            extend(
                seriesProto,
                {
                    optionalAxis: 'colorAxis',
                    translateColors: seriesTranslateColors
                }
            );
            extend(
                seriesProto.pointClass.prototype,
                {
                    setVisible: pointSetVisible
                }
            );

            addEvent(
                SeriesClass,
                'afterTranslate',
                onSeriesAfterTranslate,
                { order: 1 }
            );
            addEvent(SeriesClass, 'bindAxes', onSeriesBindAxes);
        }

    }

    /**
     * Extend the chart createAxes method to also make the color axis.
     * @internal
     */
    function onChartAfterCreateAxes(
        this: Chart
    ): void {
        const { userOptions } = this;

        this.colorAxis = [];

        // If a `colorAxis` config is present in the user options (not in a
        // theme), instanciate it.
        if (userOptions.colorAxis) {
            userOptions.colorAxis = splat(userOptions.colorAxis);
            userOptions.colorAxis.map((axisOptions): ColorAxis => (
                new ColorAxisConstructor(
                    this,
                    axisOptions as Partial<ColorAxisOptions>
                )
            ));
        }
    }

    /**
     * Add the color axis. This also removes the axis' own series to prevent
     * them from showing up individually.
     * @internal
     */
    function onLegendAfterGetAllItems(
        this: Legend,
        e: {
            allItems: Array<(Series|Point|ColorAxis|ColorAxis.LegendItemObject)>;
        }
    ): void {
        const colorAxes = this.chart.colorAxis || [],
            destroyItem = (item: (Series|Point)): void => {
                const i = e.allItems.indexOf(item);
                if (i !== -1) {
                    // #15436
                    this.destroyItem(e.allItems[i]);
                    e.allItems.splice(i, 1);
                }
            };

        let colorAxisItems = [] as Array<(ColorAxis|ColorAxis.LegendItemObject)>,
            options: ColorAxisOptions,
            i;

        colorAxes.forEach(function (colorAxis: ColorAxis): void {
            options = colorAxis.options;

            if (options?.showInLegend) {
                // Data classes
                if (options.dataClasses && options.visible) {
                    colorAxisItems = colorAxisItems.concat(
                        colorAxis.getDataClassLegendSymbols()
                    );
                    // Gradient legend
                } else if (options.visible) {
                    // Add this axis on top
                    colorAxisItems.push(colorAxis);
                }
                // If dataClasses are defined or showInLegend option is not set
                // to true, do not add color axis' series to legend.
                colorAxis.series.forEach(function (series): void {
                    if (!series.options.showInLegend || options.dataClasses) {
                        if (series.options.legendType === 'point') {
                            series.points.forEach(function (
                                point: Point
                            ): void {
                                destroyItem(point);
                            });

                        } else {
                            destroyItem(series);
                        }
                    }
                });
            }
        });

        i = colorAxisItems.length;
        while (i--) {
            e.allItems.unshift(colorAxisItems[i]);
        }
    }

    /** @internal */
    function onLegendAfterColorizeItem(
        this: Legend,
        e: {
            item: ColorAxis;
            visible: boolean;
        }
    ): void {
        if (e.visible && e.item.legendColor) {
            (e.item.legendItem as any).symbol.attr({
                fill: e.item.legendColor
            });
        }
    }

    /**
     * Updates in the legend need to be reflected in the color axis. (#6888)
     * @internal
     */
    function onLegendAfterUpdate(
        this: Legend,
        e: { redraw: boolean|undefined }
    ): void {
        this.chart.colorAxis?.forEach((colorAxis): void => {
            colorAxis.update({}, e.redraw);
        });
    }

    /**
     * Calculate and set colors for points.
     * @internal
     */
    function onSeriesAfterTranslate(
        this: Series
    ): void {
        if (
            this.chart.colorAxis?.length ||
            (this as TreemapSeries).colorAttribs
        ) {
            this.translateColors();
        }
    }

    /**
     * Add colorAxis to series axisTypes.
     * @internal
     */
    function onSeriesBindAxes(
        this: Series
    ): void {
        const axisTypes = this.axisTypes;

        if (!axisTypes) {
            this.axisTypes = ['colorAxis'];

        } else if (axisTypes.indexOf('colorAxis') === -1) {
            axisTypes.push('colorAxis');
        }
    }

    /**
     * Set the visibility of a single point
     * @internal
     * @function Highcharts.colorPointMixin.setVisible
     * @param {boolean} visible
     */
    export function pointSetVisible(
        this: PointComposition,
        vis?: boolean
    ): void {
        const point = this,
            method = vis ? 'show' : 'hide';

        point.visible = point.options.visible = Boolean(vis);

        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key: string): void {
            if ((point as any)[key]) {
                (point as any)[key][method]();
            }
        });
        this.series.buildKDTree(); // Rebuild kdtree #13195
    }

    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     * @internal
     * @function Highcharts.colorSeriesMixin.translateColors
     */
    function seriesTranslateColors(this: SeriesComposition): void {
        const series = this,
            points = this.getPointsCollection() as PointComposition[], // #17945
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;

        points.forEach((point): void => {
            const value = point.getNestedProperty(colorKey) as number,
                color = point.options.color || (
                    point.isNull || point.value === null ?
                        nullColor :
                        (colorAxis && typeof value !== 'undefined') ?
                            colorAxis.toColor(value, point) :
                            point.color || series.color
                );

            if (color && point.color !== color) {
                point.color = color;

                if (
                    series.options.legendType === 'point' &&
                    point.legendItem &&
                    point.legendItem.label
                ) {
                    series.chart.legend.colorizeItem(point, point.visible);
                }
            }
        });
    }

    /** @internal */
    function wrapChartCreateAxis(
        ChartClass: typeof Chart
    ): void {
        const superCreateAxis = ChartClass.prototype.createAxis;

        ChartClass.prototype.createAxis = function (
            type: string,
            options: Chart.CreateAxisOptionsObject
        ): (Axis|ColorAxis) {
            const chart = this;

            if (type !== 'colorAxis') {
                return superCreateAxis.apply(chart, arguments);
            }

            const axis = new ColorAxisConstructor(
                chart,
                merge(
                    options.axis as Partial<ColorAxisOptions>,
                    {
                        index: (chart as AnyRecord)[type].length,
                        isX: false
                    }
                )
            );

            chart.isDirtyLegend = true;

            // Clear before 'bindAxes' (#11924)
            chart.axes.forEach((axis): void => {
                axis.series = [];
            });

            chart.series.forEach((series): void => {
                series.bindAxes();
                series.isDirtyData = true;
            });

            if (pick(options.redraw, true)) {
                chart.redraw(options.animation);
            }

            return axis;
        };
    }

    /**
     * Handle animation of the color attributes directly.
     * @internal
     */
    function wrapFxFillSetter(
        this: Fx
    ): void {
        this.elem.attr(
            'fill',
            color(this.start as any).tweenTo(
                color(this.end as any),
                this.pos
            ),
            void 0,
            true
        );
    }

    /**
     * Handle animation of the color attributes directly.
     * @internal
     */
    function wrapFxStrokeSetter(
        this: Fx
    ): void {
        this.elem.attr(
            'stroke',
            color(this.start as any).tweenTo(
                color(this.end as any),
                this.pos
            ),
            void 0,
            true
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColorAxisComposition;
