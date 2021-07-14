'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../Axis';
import type Chart from '../../Chart/Chart';
import type ColorAxis from './ColorAxis';
import type Fx from '../../Animation/Fx';
import type Legend from '../../Legend/Legend';
import type Point from '../../Series/Point';
import type Series from '../../Series/Series';
import type TreemapSeries from '../../../Series/Treemap/TreemapSeries';

import Color from '../../Color/Color.js';
const { parse: color } = Color;
import ColorSeriesMixins from '../../../Mixins/ColorSeries.js';
const {
    colorPointMixin,
    colorSeriesMixin
} = ColorSeriesMixins;
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
 *  Composition
 *
 * */

namespace ColorAxisComposition {

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Variables
     *
     * */

    let ColorAxisClass: typeof ColorAxis;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose(
        ColorAxisType: typeof ColorAxis,
        ChartClass: typeof Chart,
        FxClass: typeof Fx,
        LegendClass: typeof Legend,
        SeriesClass: typeof Series
    ): void {
        if (!ColorAxisClass) {
            ColorAxisClass = ColorAxisType;
        }
        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            const chartProto = ChartClass.prototype;

            chartProto.collectionsWithUpdate.push('colorAxis');
            chartProto.collectionsWithInit.colorAxis = [chartProto.addColorAxis];

            addEvent(ChartClass, 'afterGetAxes', onChartAfterGetAxes);

            wrapChartCreateAxis(ChartClass);
        }
        if (composedClasses.indexOf(FxClass) === -1) {
            composedClasses.push(FxClass);

            const fxProto = FxClass.prototype;

            fxProto.fillSetter = wrapFxFillSetter;
            fxProto.strokeSetter = wrapFxStrokeSetter;
        }
        if (composedClasses.indexOf(LegendClass) === -1) {
            composedClasses.push(LegendClass);

            addEvent(LegendClass, 'afterGetAllItems', onLegendAfterGetAllItems);
            addEvent(LegendClass, 'afterColorizeItem', onLegendAfterColorizeItem);
            addEvent(LegendClass, 'afterUpdate', onLegendAfterUpdate);
        }
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            extend(
                SeriesClass.prototype,
                colorSeriesMixin
            );
            extend(
                SeriesClass.prototype.pointClass.prototype,
                colorPointMixin
            );

            addEvent(SeriesClass, 'afterTranslate', onSeriesAfterTranslate);
            addEvent(SeriesClass, 'bindAxes', onSeriesBindAxes);
        }
    }

    /**
     * Extend the chart getAxes method to also get the color axis.
     * @private
     */
    function onChartAfterGetAxes(
        this: Chart
    ): void {
        const options = this.options;

        this.colorAxis = [];

        if (options.colorAxis) {
            options.colorAxis = splat(options.colorAxis);
            options.colorAxis.forEach((axisOptions, i): void => {
                axisOptions.index = i;
                new ColorAxisClass(this, axisOptions); // eslint-disable-line no-new
            });
        }
    }

    /**
     * Add the color axis. This also removes the axis' own series to prevent
     * them from showing up individually.
     * @private
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
            options: ColorAxis.Options,
            i;

        colorAxes.forEach(function (colorAxis: ColorAxis): void {
            options = colorAxis.options;

            if (options && options.showInLegend) {
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

    /**
     * @private
     */
    function onLegendAfterColorizeItem(
        this: Legend,
        e: {
            item: ColorAxis;
            visible: boolean;
        }
    ): void {
        if (e.visible && e.item.legendColor) {
            (e.item.legendSymbol as any).attr({
                fill: e.item.legendColor
            });
        }
    }

    /**
     * Updates in the legend need to be reflected in the color axis. (#6888)
     */
    function onLegendAfterUpdate(this: Legend): void {
        const colorAxes = this.chart.colorAxis;

        if (colorAxes) {
            colorAxes.forEach(function (colorAxis): void {
                colorAxis.update({}, arguments[2]);
            });
        }
    }

    /**
     * Calculate and set colors for points.
     * @private
     */
    function onSeriesAfterTranslate(
        this: Series
    ): void {
        if (
            this.chart.colorAxis &&
            this.chart.colorAxis.length ||
            (this as TreemapSeries).colorAttribs
        ) {
            this.translateColors();
        }
    }

    /**
     * Add colorAxis to series axisTypes.
     * @private
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
     * @private
     */
    function wrapChartCreateAxis(
        ChartClass: typeof Chart
    ): void {
        const superCreateAxis = ChartClass.prototype.createAxis;

        ChartClass.prototype.createAxis = function (
            type: string,
            options: Chart.CreateAxisOptionsObject
        ): (Axis|ColorAxis) {
            if (type !== 'colorAxis') {
                return superCreateAxis.apply(this, arguments);
            }

            const axis = new ColorAxisClass(this, merge(options.axis, {
                index: (this as AnyRecord)[type].length,
                isX: false
            }));

            this.isDirtyLegend = true;

            // Clear before 'bindAxes' (#11924)
            this.axes.forEach(function (axis): void {
                axis.series = [];
            });

            this.series.forEach(function (series): void {
                series.bindAxes();
                series.isDirtyData = true;
            });

            if (pick(options.redraw, true)) {
                this.redraw(options.animation);
            }

            return axis;
        };
    }

    /**
     * Handle animation of the color attributes directly.
     * @private
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
     * @private
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
