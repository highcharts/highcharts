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

import type AnimationOptions from '../../Animation/AnimationOptions';
import type Chart from '../../Chart/Chart';
import type {
    ColorAxisDataClassOptions,
    ColorAxisOptions
} from './ColorAxisOptions';
import type ColorType from '../../Color/ColorType';
import type { DeepPartial } from '../../../Shared/Types';
import type Fx from '../../Animation/Fx';
import type GradientColor from '../../Color/GradientColor';
import type Legend from '../../Legend/Legend';
import type { LegendItemObject } from '../../Legend/LegendItem';
import type Point from '../../Series/Point';
import type PointerEvent from '../../PointerEvent';
import type { StatesOptionsKey } from '../../Series/StatesOptions';
import type SVGPath from '../../Renderer/SVG/SVGPath';

import Axis from '../Axis.js';
import ColorAxisBase from './ColorAxisBase.js';
import ColorAxisComposition from './ColorAxisComposition.js';
import ColorAxisDefaults from './ColorAxisDefaults.js';
import D from '../../Defaults.js';
const { defaultOptions } = D;
import LegendSymbol from '../../Legend/LegendSymbol.js';
import SeriesRegistry from '../../Series/SeriesRegistry.js';
import SeriesClass from '../../Series/Series';
const { series: Series } = SeriesRegistry;
import U from '../../Utilities.js';
const {
    defined,
    extend,
    fireEvent,
    isArray,
    isNumber,
    merge,
    pick,
    relativeLength
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Axis/AxisBase' {
    interface AxisBase {
        labelLeft?: number;
        labelRight?: number;
    }
}

declare module '../../Chart/ChartBase' {
    interface ChartBase {
        colorAxis?: Array<ColorAxis>;
    }
}

declare module '../../../Core/Options'{
    interface Options {
        colorAxis?: (
            DeepPartial<ColorAxisOptions>|
            Array<DeepPartial<ColorAxisOptions>>
        );
    }
}

declare module '../../Series/PointBase' {
    interface PointBase {
        dataClass?: number;
    }
}

declare module '../../Series/SeriesBase' {
    interface SeriesBase {
        axisTypes?: Array<string>;
        colorAxis?: ColorAxis;
        colorKey?: string;
        minColorValue?: number;
        maxColorValue?: number;
    }
}

declare module '../../Series/SeriesOptions' {
    interface SeriesOptions {
        colorKey?: string;
    }
}

defaultOptions.colorAxis = merge(defaultOptions.xAxis, ColorAxisDefaults);

/* *
 *
 *  Class
 *
 * */

/**
 * The ColorAxis object for inclusion in gradient legends.
 *
 * @class
 * @name Highcharts.ColorAxis
 * @augments Highcharts.Axis
 *
 * @param {Highcharts.Chart} chart
 * The related chart of the color axis.
 *
 * @param {Highcharts.ColorAxisOptions} userOptions
 * The color axis options for initialization.
 */
class ColorAxis extends Axis implements ColorAxisBase {

    /* *
     *
     *  Static Properties
     *
     * */


    /** @internal */
    public static defaultLegendLength: number = 200;

    /** @internal */
    public static keepProps: Array<string> = [
        'legendItem'
    ];

    /* *
     *
     *  Static Functions
     *
     * */


    /** @internal */
    public static compose(
        ChartClass: typeof Chart,
        FxClass: typeof Fx,
        LegendClass: typeof Legend,
        SeriesClass: typeof Series
    ): void {
        ColorAxisComposition.compose(
            ColorAxis,
            ChartClass,
            FxClass,
            LegendClass,
            SeriesClass
        );
    }

    /* *
     *
     *  Constructors
     *
     * */

    /** @internal */
    public constructor(
        chart: Chart,
        userOptions: Partial<ColorAxisOptions>
    ) {
        super(chart, userOptions);
        this.init(chart, userOptions);
    }

    /* *
     *
     *  Properties
     *
     * */


    /** @internal */
    public added?: boolean;

    /** @internal */
    public chart!: Chart;

    /** @internal */
    public coll = 'colorAxis' as const;

    /** @internal */
    public dataClasses!: Array<ColorAxisDataClassOptions>;

    /** @internal */
    public legendColor?: GradientColor;

    /** @internal */
    public legendItem?: LegendItemObject;

    /** @internal */
    public name?: string;

    /** @internal */
    public options!: ColorAxisOptions;

    /** @internal */
    public stops!: GradientColor['stops'];

    /** @internal */
    public visible: boolean = true;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initializes the color axis.
     *
     * @function Highcharts.ColorAxis#init
     *
     * @param {Highcharts.Chart} chart
     * The related chart of the color axis.
     *
     * @param {Highcharts.ColorAxisOptions} userOptions
     * The color axis options for initialization.
     */
    public init(
        chart: Chart,
        userOptions: Partial<ColorAxisOptions>
    ): void {
        const axis = this;
        const legend = chart.options.legend || {},
            horiz = userOptions.layout ?
                userOptions.layout !== 'vertical' :
                legend.layout !== 'vertical';

        axis.side = userOptions.side || horiz ? 2 : 1;
        axis.reversed = userOptions.reversed;
        axis.opposite = !horiz;

        super.init(chart, userOptions, 'colorAxis');

        // `super.init` saves the extended user options, now replace it with the
        // originals
        this.userOptions = userOptions;
        if (isArray(chart.userOptions.colorAxis)) {
            chart.userOptions.colorAxis[this.index] = userOptions;
        }

        // Prepare data classes
        if (userOptions.dataClasses) {
            axis.initDataClasses(userOptions);
        }
        axis.initStops();

        // Override original axis properties
        axis.horiz = horiz;
        axis.zoomEnabled = false;
    }

    /**
     * Returns true if the series has points at all.
     *
     * @function Highcharts.ColorAxis#hasData
     *
     * @return {boolean}
     * True, if the series has points, otherwise false.
     */
    public hasData(): boolean {
        return !!(this.tickPositions || []).length;
    }

    /**
     * Override so that ticks are not added in data class axes (#6914)
     * @internal
     */
    public setTickPositions(): void {
        if (!this.dataClasses) {
            return super.setTickPositions();
        }
    }

    /**
     * Extend the setOptions method to process extreme colors and color stops.
     * @internal
     */
    public setOptions(userOptions: DeepPartial<ColorAxisOptions>): void {

        const options = merge(
            defaultOptions.colorAxis as ColorAxisOptions,
            userOptions,
            // Forced options
            {
                showEmpty: false,
                title: null,
                visible: this.chart.options.legend.enabled &&
                    userOptions.visible !== false
            }
        );

        super.setOptions(options);

        this.options.crosshair = this.options.marker;
    }

    /** @internal */
    public setAxisSize(): void {
        const axis = this,
            chart = axis.chart,
            symbol = axis.legendItem?.symbol;

        let {
            width,
            height
        } = axis.getSize();

        if (symbol) {
            this.left = +symbol.attr('x');
            this.top = +symbol.attr('y');
            this.width = width = +symbol.attr('width');
            this.height = height = +symbol.attr('height');
            this.right = chart.chartWidth - this.left - width;
            this.bottom = chart.chartHeight - this.top - height;
            this.pos = this.horiz ? this.left : this.top;
        }

        // Fake length for disabled legend to avoid tick issues
        // and such (#5205)
        this.len = (this.horiz ? width : height) ||
            ColorAxis.defaultLegendLength;
    }

    /**
     * Override the getOffset method to add the whole axis groups inside the
     * legend.
     * @internal
     */
    public getOffset(): void {
        const axis = this;
        const group = axis.legendItem?.group;
        const sideOffset = axis.chart.axisOffset[axis.side];

        if (group) {

            // Hook for the getOffset method to add groups to this parent
            // group
            axis.axisParent = group;

            // Call the base
            super.getOffset();

            const legend = this.chart.legend;

            // Adds `maxLabelLength` needed for label padding corrections done
            // by `render()` and `getMargins()` (#15551).
            legend.allItems.forEach(function (item): void {
                if (item instanceof ColorAxis) {
                    item.drawLegendSymbol(legend, item);
                }
            });

            legend.render();
            this.chart.getMargins(true);

            // If not drilling down/up
            if (!this.chart.series.some((series): boolean | undefined =>
                series.isDrilling
            )) {
                axis.isDirty = true; // Flag to fire drawChartBox
            }

            // First time only
            if (!axis.added) {
                axis.added = true;
            }

            axis.labelLeft = 0;
            axis.labelRight = axis.width;
            // Reset it to avoid color axis reserving space
            axis.chart.axisOffset[axis.side] = sideOffset;
        }
    }

    /**
     * Create the color gradient.
     * @internal
     */
    public setLegendColor(): void {
        const axis = this;
        const horiz = axis.horiz;
        const reversed = axis.reversed;
        const one = reversed ? 1 : 0;
        const zero = reversed ? 0 : 1;

        const grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one]; // #3190
        axis.legendColor = {
            linearGradient: {
                x1: grad[0],
                y1: grad[1],
                x2: grad[2],
                y2: grad[3]
            },
            stops: axis.stops
        };
    }

    /**
     * The color axis appears inside the legend and has its own legend symbol.
     * @internal
     */
    public drawLegendSymbol(
        legend: Legend,
        item: ColorAxis
    ): void {
        const axis = this,
            legendItem = item.legendItem || {},
            padding = legend.padding,
            legendOptions = legend.options,
            labelOptions = axis.options.labels,
            itemDistance = pick(legendOptions.itemDistance, 10),
            horiz = axis.horiz,
            {
                width,
                height
            } = axis.getSize(),
            labelPadding = pick(
                // @todo: This option is not documented, nor implemented when
                // vertical
                (legendOptions as any).labelPadding,
                horiz ? 16 : 30
            );

        this.setLegendColor();

        // Create the gradient
        if (!legendItem.symbol) {
            legendItem.symbol = this.chart.renderer.symbol('roundedRect')
                .attr({
                    r: legendOptions.symbolRadius ?? 3,
                    zIndex: 1
                }).add(legendItem.group);
        }

        legendItem.symbol.attr({
            x: 0,
            y: (legend.baseline || 0) - 11,
            width: width,
            height: height
        });

        // Set how much space this legend item takes up
        legendItem.labelWidth = (
            width +
            padding +
            (
                horiz ?
                    itemDistance :
                    pick(labelOptions.x, labelOptions.distance) +
                        (this.maxLabelLength || 0)
            )
        );
        legendItem.labelHeight = height + padding + (horiz ? labelPadding : 0);
    }

    /**
     * Fool the legend.
     * @internal
     */
    public setState(state?: StatesOptionsKey): void {
        this.series.forEach(function (series): void {
            series.setState(state);
        });
    }

    /** @internal */
    public setVisible(): void {
    }

    /** @internal */
    public getSeriesExtremes(): void {
        const axis = this;
        const series = axis.series;

        let colorValArray,
            colorKey,
            calculatedExtremes,
            cSeries,
            i = series.length;

        this.dataMin = Infinity;
        this.dataMax = -Infinity;

        while (i--) { // X, y, value, other
            cSeries = series[i];
            colorKey = cSeries.colorKey = pick(
                cSeries.options.colorKey,
                cSeries.colorKey,
                cSeries.pointValKey,
                cSeries.zoneAxis,
                'y'
            );

            calculatedExtremes = (cSeries as any)[colorKey + 'Min'] &&
                (cSeries as any)[colorKey + 'Max'];

            // Find the first column that has values
            for (const key of [colorKey, 'value', 'y']) {
                colorValArray = cSeries.getColumn(key);
                if (colorValArray.length) {
                    break;
                }
            }


            // If color key extremes are already calculated, use them.
            if (calculatedExtremes) {
                cSeries.minColorValue = (cSeries as any)[colorKey + 'Min'];
                cSeries.maxColorValue = (cSeries as any)[colorKey + 'Max'];

            } else {
                const cExtremes = Series.prototype.getExtremes.call(
                    cSeries,
                    colorValArray
                );

                cSeries.minColorValue = cExtremes.dataMin;
                cSeries.maxColorValue = cExtremes.dataMax;
            }

            if (
                defined(cSeries.minColorValue) &&
                defined(cSeries.maxColorValue)
            ) {
                this.dataMin =
                    Math.min(this.dataMin, cSeries.minColorValue);
                this.dataMax =
                    Math.max(this.dataMax, cSeries.maxColorValue);
            }

            if (!calculatedExtremes) {
                Series.prototype.applyExtremes.call(cSeries);
            }
        }
    }

    /**
     * Internal function to draw a crosshair.
     *
     * @function Highcharts.ColorAxis#drawCrosshair
     *
     * @param {Highcharts.PointerEventObject} [e]
     *        The event arguments from the modified pointer event, extended with
     *        `chartX` and `chartY`
     *
     * @param {Highcharts.Point} [point]
     *        The Point object if the crosshair snaps to points.
     *
     * @emits Highcharts.ColorAxis#event:afterDrawCrosshair
     * @emits Highcharts.ColorAxis#event:drawCrosshair
     */
    public drawCrosshair(
        e?: PointerEvent,
        point?: ColorAxisComposition.PointComposition
    ): void {
        const axis = this,
            legendItem = axis.legendItem || {},
            plotX = point?.plotX,
            plotY = point?.plotY,
            axisPos = axis.pos,
            axisLen = axis.len;

        let crossPos;

        if (point) {
            crossPos = axis.toPixels(point.getNestedProperty(
                point.series.colorKey
            ) as number);
            if (crossPos < axisPos) {
                crossPos = axisPos - 2;
            } else if (crossPos > axisPos + axisLen) {
                crossPos = axisPos + axisLen + 2;
            }

            point.plotX = crossPos;
            point.plotY = axis.len - crossPos;

            super.drawCrosshair(e, point);

            point.plotX = plotX;
            point.plotY = plotY;

            if (
                axis.cross &&
                !axis.cross.addedToColorAxis &&
                legendItem.group
            ) {
                axis.cross
                    .addClass('highcharts-coloraxis-marker')
                    .add(legendItem.group);

                axis.cross.addedToColorAxis = true;

                if (
                    !axis.chart.styledMode &&
                    typeof axis.crosshair === 'object'
                ) {
                    axis.cross.attr({
                        fill: axis.crosshair.color
                    });
                }

            }
        }
    }

    /** @internal */
    public getPlotLinePath(
        options: Axis.PlotLinePathOptions
    ): (SVGPath|undefined) {
        const axis = this,
            left = axis.left,
            pos = options.translatedValue,
            top = axis.top;

        // Crosshairs only
        return isNumber(pos) ? // `pos` can be 0 (#3969)
            (
                axis.horiz ? [
                    ['M', pos - 4, top - 6],
                    ['L', pos + 4, top - 6],
                    ['L', pos, top],
                    ['Z']
                ] : [
                    ['M', left, pos],
                    ['L', left - 6, pos + 6],
                    ['L', left - 6, pos - 6],
                    ['Z']
                ]
            ) :
            super.getPlotLinePath(options);
    }

    /**
     * Updates a color axis instance with a new set of options. The options are
     * merged with the existing options, so only new or altered options need to
     * be specified.
     *
     * @function Highcharts.ColorAxis#update
     *
     * @param {Highcharts.ColorAxisOptions} newOptions
     * The new options that will be merged in with existing options on the color
     * axis.
     *
     * @param {boolean} [redraw]
     * Whether to redraw the chart after the color axis is altered. If doing
     * more operations on the chart, it is a good idea to set redraw to `false`
     * and call {@link Highcharts.Chart#redraw} after.
     */
    public update(
        newOptions: DeepPartial<ColorAxisOptions>,
        redraw?: boolean
    ): void {
        const axis = this,
            chart = axis.chart,
            legend = chart.legend;

        this.series.forEach((series): void => {
            // Needed for Axis.update when choropleth colors change
            series.isDirtyData = true;
        });

        // When updating data classes, destroy old items and make sure new
        // ones are created (#3207)
        if (newOptions.dataClasses && legend.allItems || axis.dataClasses) {
            axis.destroyItems();
        }

        super.update(newOptions, redraw);

        if (axis.legendItem?.label) {
            axis.setLegendColor();
            legend.colorizeItem(this as any, true);
        }
    }

    /**
     * Destroy color axis legend items.
     * @internal
     */
    public destroyItems(): void {
        const axis = this,
            chart = axis.chart,
            legendItem = axis.legendItem || {};

        if (legendItem.label) {
            chart.legend.destroyItem(axis);

        } else if (legendItem.labels) {
            for (const item of legendItem.labels) {
                chart.legend.destroyItem(item as any);
            }
        }

        chart.isDirtyLegend = true;
    }

    /**
     * Removing the whole axis (#14283)
     * @internal
     */
    public destroy(): void {
        this.chart.isDirtyLegend = true;

        this.destroyItems();
        super.destroy(...[].slice.call(arguments));
    }

    /**
     * Removes the color axis and the related legend item.
     *
     * @function Highcharts.ColorAxis#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart following the remove.
     */
    public remove(redraw?: boolean): void {
        this.destroyItems();
        super.remove(redraw);
    }

    /**
     * Get the legend item symbols for data classes.
     * @internal
     */
    public getDataClassLegendSymbols(): Array<ColorAxis.LegendItemObject> {
        const axis = this,
            chart = axis.chart,
            legendItems = (
                axis.legendItem &&
                axis.legendItem.labels as Array<ColorAxis.LegendItemObject> ||
                []
            ),
            legendOptions = chart.options.legend,
            valueDecimals = pick(legendOptions.valueDecimals, -1),
            valueSuffix = pick(legendOptions.valueSuffix, '');

        const getPointsInDataClass = (i: number): Array<Point> =>
            axis.series.reduce((points, s): Point[] => {
                points.push(...s.points.filter((point): boolean =>
                    point.dataClass === i
                ));
                return points;
            }, [] as Point[]);

        let name;

        if (!legendItems.length) {
            axis.dataClasses.forEach((dataClass, i): void => {
                const from = dataClass.from,
                    to = dataClass.to,
                    { numberFormatter } = chart;

                let vis = true;

                // Assemble the default name. This can be overridden
                // by legend.options.labelFormatter
                name = '';
                if (typeof from === 'undefined') {
                    name = '< ';
                } else if (typeof to === 'undefined') {
                    name = '> ';
                }
                if (typeof from !== 'undefined') {
                    name += numberFormatter(from, valueDecimals) + valueSuffix;
                }
                if (typeof from !== 'undefined' && typeof to !== 'undefined') {
                    name += ' - ';
                }
                if (typeof to !== 'undefined') {
                    name += numberFormatter(to, valueDecimals) + valueSuffix;
                }
                // Add a mock object to the legend items
                legendItems.push(extend<ColorAxis.LegendItemObject>(
                    {
                        chart,
                        name,
                        options: {},
                        drawLegendSymbol: LegendSymbol.rectangle,
                        visible: true,
                        isDataClass: true,

                        // Override setState to set either normal or inactive
                        // state to all points in this data class
                        setState: (state?: (StatesOptionsKey|'')): void => {
                            for (const point of getPointsInDataClass(i)) {
                                point.setState(state);
                            }
                        },

                        // Override setState to show or hide all points in this
                        // data class
                        setVisible: function (
                            this: ColorAxis.LegendItemObject
                        ): void {
                            this.visible = vis = axis.visible = !vis;
                            const affectedSeries: SeriesClass[] = [];
                            for (const point of getPointsInDataClass(i)) {
                                point.setVisible(vis);
                                point.hiddenInDataClass = !vis; // #20441
                                if (
                                    affectedSeries.indexOf(point.series) === -1
                                ) {
                                    affectedSeries.push(point.series);
                                }
                            }
                            chart.legend.colorizeItem(this as any, vis);
                            affectedSeries.forEach((series): void => {
                                fireEvent(series, 'afterDataClassLegendClick');
                            });
                        }
                    },
                    dataClass
                ));
            });
        }
        return legendItems;
    }

    /**
     * Get size of color axis symbol.
     * @internal
     */
    public getSize(): ({
        width: number,
        height: number
    }) {
        const axis = this,
            {
                chart,
                horiz
            } = axis,
            {
                height: colorAxisHeight,
                width: colorAxisWidth
            } = axis.options,
            {
                legend: legendOptions
            } = chart.options,
            width = pick(
                defined(colorAxisWidth) ?
                    relativeLength(colorAxisWidth, chart.chartWidth) : void 0,
                legendOptions?.symbolWidth,
                horiz ? ColorAxis.defaultLegendLength : 12
            ),
            height = pick(
                defined(colorAxisHeight) ?
                    relativeLength(colorAxisHeight, chart.chartHeight) : void 0,
                legendOptions?.symbolHeight,
                horiz ? 12 : ColorAxis.defaultLegendLength
            );

        return {
            width,
            height
        };
    }
}

/* *
 *
 *  Class Properties
 *
 * */

interface ColorAxis extends ColorAxisBase {
    coll: 'colorAxis';
    options: ColorAxisOptions;
}

extend(ColorAxis.prototype, ColorAxisBase);

/* *
 *
 *  Class Namespace
 *
 * */

namespace ColorAxis {

    /* *
     *
     *  Declarations
     *
     * */

    export interface LegendItemObject extends ColorAxisDataClassOptions {
        [key: string]: any;
        chart: Chart;
        name: string;
        options: object;
        drawLegendSymbol: typeof LegendSymbol['rectangle'];
        visible: boolean;
        setState: Point['setState'];
        isDataClass: true;
        setVisible: Function;
    }

    export interface MarkerOptions {
        animation?: (boolean|Partial<AnimationOptions>);
        color?: ColorType;
        width?: number;
    }

}

/* *
 *
 *  Registry
 *
 * */

// Properties to preserve after destroy, for Axis.update (#5881, #6025).
Array.prototype.push.apply(Axis.keepProps, ColorAxis.keepProps);

/* *
 *
 *  Default Export
 *
 * */

export default ColorAxis;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Color axis types
 *
 * @typedef {"linear"|"logarithmic"} Highcharts.ColorAxisTypeValue
 */

''; // Detach doclet above
