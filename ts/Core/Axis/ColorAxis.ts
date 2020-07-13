/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AxisLike } from './Types';
import type SVGPath from '../Renderer/SVG/SVGPath';
import Axis from './Axis.js';
import Chart from '../Chart/Chart.js';
import Color from '../Color.js';
const {
    parse: color
} = Color;
import H from '../Globals.js';
const {
    noop
} = H;
import Legend from '../Legend.js';
import LegendSymbolMixin from '../../mixins/legend-symbol.js';
import Point from '../Series/Point.js';
import U from '../Utilities.js';
const {
    addEvent,
    erase,
    extend,
    Fx,
    isNumber,
    merge,
    pick,
    splat
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class ColorAxis extends Axis { // eslint-disable-line no-undef
            public constructor(chart: Chart, userOptions: ColorAxis.Options);
            public added?: boolean;
            public chart: Chart;
            public coll: 'colorAxis';
            public checkbox: undefined;
            public dataClasses: Array<ColorAxis.DataClassesOptions>;
            public legendColor?: GradientColorObject;
            public legendGroup?: SVGElement
            public legendItem: ColorAxis.LegendItemObject;
            public legendItemHeight?: number;
            public legendItems: Array<ColorAxis.LegendItemObject>;
            public legendItemWidth?: number;
            public legendSymbol?: SVGElement;
            public options: ColorAxis.Options;
            public prototype: ColorAxis;
            public setVisible: Function;
            public stops: GradientColorObject['stops'];
            public visible: true;
            public drawCrosshair(e: PointerEventObject, point: Point): void;
            public drawLegendSymbol(legend: Legend, item: ColorAxis): void;
            public getDataClassLegendSymbols(): (
                Array<ColorAxis.LegendItemObject>
            );
            public getOffset(): void;
            public getPlotLinePath(
                options: AxisPlotLinePathOptionsObject
            ): (SVGPath|null);
            public getSeriesExtremes(): void;
            public hasData(): boolean;
            public init(chart: Chart, userOptions: ColorAxis.Options): void;
            public initDataClasses(userOptions: ColorAxis.Options): void;
            public initStops(): void;
            public normalizedValue(value: number): number;
            public remove(redraw?: boolean): void;
            public destroyItems(): void;
            public setAxisSize(): void;
            public setLegendColor(): void;
            public setOptions(userOptions: DeepPartial<ColorAxis.Options>): void;
            public setState(state?: string): void;
            public setTickPositions(): void;
            public toColor(
                value: number,
                point: Point
            ): (ColorString|GradientColorObject|PatternObject|undefined);
        }
        interface Axis {
            labelLeft?: number;
            labelRight?: number;
        }
        interface ChartLike {
            colorAxis?: Array<ColorAxis>;
        }
        interface Series {
            axisTypes: Array<string>;
            colorAxis?: ColorAxis;
            colorKey: string;
            minColorValue?: number;
            maxColorValue?: number;
        }
        interface SeriesOptions {
            colorKey?: string;
        }
        interface Options {
            colorAxis?: (ColorAxis.Options|Array<ColorAxis.Options>);
        }
        interface PointLike {
            dataClass?: number;
        }
    }
}

/**
 * Color axis types
 *
 * @typedef {"linear"|"logarithmic"} Highcharts.ColorAxisTypeValue
 */

''; // detach doclet above

import '../../mixins/color-series.js';

var Series = H.Series,
    colorPointMixin = H.colorPointMixin,
    colorSeriesMixin = H.colorSeriesMixin;

extend(Series.prototype, colorSeriesMixin);
extend(Point.prototype, colorPointMixin);

Chart.prototype.collectionsWithUpdate.push('colorAxis');
Chart.prototype.collectionsWithInit.colorAxis = [Chart.prototype.addColorAxis];

/* eslint-disable no-invalid-this, valid-jsdoc */
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
class ColorAxis extends Axis implements AxisLike {

    /* *
     *
     *  Static Functions
     *
     * */

    public static defaultLegendLength: number = 200;

    /**
     * A color axis for series. Visually, the color
     * axis will appear as a gradient or as separate items inside the
     * legend, depending on whether the axis is scalar or based on data
     * classes.
     *
     * For supported color formats, see the
     * [docs article about colors](https://www.highcharts.com/docs/chart-design-and-style/colors).
     *
     * A scalar color axis is represented by a gradient. The colors either
     * range between the [minColor](#colorAxis.minColor) and the
     * [maxColor](#colorAxis.maxColor), or for more fine grained control the
     * colors can be defined in [stops](#colorAxis.stops). Often times, the
     * color axis needs to be adjusted to get the right color spread for the
     * data. In addition to stops, consider using a logarithmic
     * [axis type](#colorAxis.type), or setting [min](#colorAxis.min) and
     * [max](#colorAxis.max) to avoid the colors being determined by
     * outliers.
     *
     * When [dataClasses](#colorAxis.dataClasses) are used, the ranges are
     * subdivided into separate classes like categories based on their
     * values. This can be used for ranges between two values, but also for
     * a true category. However, when your data is categorized, it may be as
     * convenient to add each category to a separate series.
     *
     * Color axis does not work with: `sankey`, `sunburst`, `dependencywheel`,
     * `networkgraph`, `wordcloud`, `venn`, `gauge` and `solidgauge` series
     * types.
     *
     * Since v7.2.0 `colorAxis` can also be an array of options objects.
     *
     * See [the Axis object](/class-reference/Highcharts.Axis) for
     * programmatic access to the axis.
     *
     * @sample       {highcharts} highcharts/coloraxis/custom-color-key
     *               Column chart with color axis
     * @sample       {highcharts} highcharts/coloraxis/horizontal-layout
     *               Horizontal layout
     * @sample       {highmaps} maps/coloraxis/dataclasscolor
     *               With data classes
     * @sample       {highmaps} maps/coloraxis/mincolor-maxcolor
     *               Min color and max color
     *
     * @extends      xAxis
     * @excluding    alignTicks, allowDecimals, alternateGridColor, breaks,
     *               categories, crosshair, dateTimeLabelFormats, height, left,
     *               lineWidth, linkedTo, maxZoom, minRange, minTickInterval,
     *               offset, opposite, pane, plotBands, plotLines,
     *               reversedStacks, showEmpty, title, top, width, zoomEnabled
     * @product      highcharts highstock highmaps
     * @type         {*|Array<*>}
     * @optionparent colorAxis
     * @ignore
     */
    public static defaultOptions: ColorAxis.Options = {

        /**
         * Whether to allow decimals on the color axis.
         * @type      {boolean}
         * @default   true
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.allowDecimals
         */

        /**
         * Determines how to set each data class' color if no individual
         * color is set. The default value, `tween`, computes intermediate
         * colors between `minColor` and `maxColor`. The other possible
         * value, `category`, pulls colors from the global or chart specific
         * [colors](#colors) array.
         *
         * @sample {highmaps} maps/coloraxis/dataclasscolor/
         *         Category colors
         *
         * @type       {string}
         * @default    tween
         * @product    highcharts highstock highmaps
         * @validvalue ["tween", "category"]
         * @apioption  colorAxis.dataClassColor
         */

        /**
         * An array of data classes or ranges for the choropleth map. If
         * none given, the color axis is scalar and values are distributed
         * as a gradient between the minimum and maximum colors.
         *
         * @sample {highmaps} maps/demo/data-class-ranges/
         *         Multiple ranges
         *
         * @sample {highmaps} maps/demo/data-class-two-ranges/
         *         Two ranges
         *
         * @type      {Array<*>}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.dataClasses
         */

        /**
         * The layout of the color axis. Can be `'horizontal'` or `'vertical'`.
         * If none given, the color axis has the same layout as the legend.
         *
         * @sample highcharts/coloraxis/horizontal-layout/
         *         Horizontal color axis layout with vertical legend
         *
         * @type      {string|undefined}
         * @since     7.2.0
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.layout
         */

        /**
         * The color of each data class. If not set, the color is pulled
         * from the global or chart-specific [colors](#colors) array. In
         * styled mode, this option is ignored. Instead, use colors defined
         * in CSS.
         *
         * @sample {highmaps} maps/demo/data-class-two-ranges/
         *         Explicit colors
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.dataClasses.color
         */

        /**
         * The start of the value range that the data class represents,
         * relating to the point value.
         *
         * The range of each `dataClass` is closed in both ends, but can be
         * overridden by the next `dataClass`.
         *
         * @type      {number}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.dataClasses.from
         */

        /**
         * The name of the data class as it appears in the legend.
         * If no name is given, it is automatically created based on the
         * `from` and `to` values. For full programmatic control,
         * [legend.labelFormatter](#legend.labelFormatter) can be used.
         * In the formatter, `this.from` and `this.to` can be accessed.
         *
         * @sample {highmaps} maps/coloraxis/dataclasses-name/
         *         Named data classes
         *
         * @sample {highmaps} maps/coloraxis/dataclasses-labelformatter/
         *         Formatted data classes
         *
         * @type      {string}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.dataClasses.name
         */

        /**
         * The end of the value range that the data class represents,
         * relating to the point value.
         *
         * The range of each `dataClass` is closed in both ends, but can be
         * overridden by the next `dataClass`.
         *
         * @type      {number}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.dataClasses.to
         */

        /** @ignore-option */
        lineWidth: 0,

        /**
         * Padding of the min value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer.
         *
         * @product highcharts highstock highmaps
         */
        minPadding: 0,

        /**
         * The maximum value of the axis in terms of map point values. If
         * `null`, the max value is automatically calculated. If the
         * `endOnTick` option is true, the max value might be rounded up.
         *
         * @sample {highmaps} maps/coloraxis/gridlines/
         *         Explicit min and max to reduce the effect of outliers
         *
         * @type      {number}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.max
         */

        /**
         * The minimum value of the axis in terms of map point values. If
         * `null`, the min value is automatically calculated. If the
         * `startOnTick` option is true, the min value might be rounded
         * down.
         *
         * @sample {highmaps} maps/coloraxis/gridlines/
         *         Explicit min and max to reduce the effect of outliers
         *
         * @type      {number}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.min
         */

        /**
         * Padding of the max value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer.
         *
         * @product highcharts highstock highmaps
         */
        maxPadding: 0,

        /**
         * Color of the grid lines extending from the axis across the
         * gradient.
         *
         * @sample {highmaps} maps/coloraxis/gridlines/
         *         Grid lines demonstrated
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   #e6e6e6
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.gridLineColor
         */

        /**
         * The width of the grid lines extending from the axis across the
         * gradient of a scalar color axis.
         *
         * @sample {highmaps} maps/coloraxis/gridlines/
         *         Grid lines demonstrated
         *
         * @product highcharts highstock highmaps
         */
        gridLineWidth: 1,

        /**
         * The interval of the tick marks in axis units. When `null`, the
         * tick interval is computed to approximately follow the
         * `tickPixelInterval`.
         *
         * @type      {number}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.tickInterval
         */

        /**
         * If [tickInterval](#colorAxis.tickInterval) is `null` this option
         * sets the approximate pixel interval of the tick marks.
         *
         * @product highcharts highstock highmaps
         */
        tickPixelInterval: 72,

        /**
         * Whether to force the axis to start on a tick. Use this option
         * with the `maxPadding` option to control the axis start.
         *
         * @product highcharts highstock highmaps
         */
        startOnTick: true,

        /**
         * Whether to force the axis to end on a tick. Use this option with
         * the [maxPadding](#colorAxis.maxPadding) option to control the
         * axis end.
         *
         * @product highcharts highstock highmaps
         */
        endOnTick: true,

        /** @ignore */
        offset: 0,

        /**
         * The triangular marker on a scalar color axis that points to the
         * value of the hovered area. To disable the marker, set
         * `marker: null`.
         *
         * @sample {highmaps} maps/coloraxis/marker/
         *         Black marker
         *
         * @declare Highcharts.PointMarkerOptionsObject
         * @product highcharts highstock highmaps
         */
        marker: {

            /**
             * Animation for the marker as it moves between values. Set to
             * `false` to disable animation. Defaults to `{ duration: 50 }`.
             *
             * @type    {boolean|Partial<Highcharts.AnimationOptionsObject>}
             * @product highcharts highstock highmaps
             */
            animation: {
                /** @internal */
                duration: 50
            },

            /** @internal */
            width: 0.01,

            /**
             * The color of the marker.
             *
             * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @product highcharts highstock highmaps
             */
            color: '${palette.neutralColor40}'
        },

        /**
         * The axis labels show the number for each tick.
         *
         * For more live examples on label options, see [xAxis.labels in the
         * Highcharts API.](/highcharts#xAxis.labels)
         *
         * @extends xAxis.labels
         * @product highcharts highstock highmaps
         */
        labels: {

            /**
             * How to handle overflowing labels on horizontal color axis. If set
             * to `"allow"`, it will not be aligned at all. By default it
             * `"justify"` labels inside the chart area. If there is room to
             * move it, it will be aligned to the edge, else it will be removed.
             *
             * @validvalue ["allow", "justify"]
             * @product    highcharts highstock highmaps
             */
            overflow: 'justify',

            rotation: 0

        },

        /**
         * The color to represent the minimum of the color axis. Unless
         * [dataClasses](#colorAxis.dataClasses) or
         * [stops](#colorAxis.stops) are set, the gradient starts at this
         * value.
         *
         * If dataClasses are set, the color is based on minColor and
         * maxColor unless a color is set for each data class, or the
         * [dataClassColor](#colorAxis.dataClassColor) is set.
         *
         * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/
         *         Min and max colors on scalar (gradient) axis
         * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/
         *         On data classes
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product highcharts highstock highmaps
         */
        minColor: '${palette.highlightColor10}',

        /**
         * The color to represent the maximum of the color axis. Unless
         * [dataClasses](#colorAxis.dataClasses) or
         * [stops](#colorAxis.stops) are set, the gradient ends at this
         * value.
         *
         * If dataClasses are set, the color is based on minColor and
         * maxColor unless a color is set for each data class, or the
         * [dataClassColor](#colorAxis.dataClassColor) is set.
         *
         * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/
         *         Min and max colors on scalar (gradient) axis
         * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/
         *         On data classes
         *
         * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @product highcharts highstock highmaps
         */
        maxColor: '${palette.highlightColor100}',

        /**
         * Color stops for the gradient of a scalar color axis. Use this in
         * cases where a linear gradient between a `minColor` and `maxColor`
         * is not sufficient. The stops is an array of tuples, where the
         * first item is a float between 0 and 1 assigning the relative
         * position in the gradient, and the second item is the color.
         *
         * @sample {highmaps} maps/demo/heatmap/
         *         Heatmap with three color stops
         *
         * @type      {Array<Array<number,Highcharts.ColorString>>}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.stops
         */

        /**
         * The pixel length of the main tick marks on the color axis.
         */
        tickLength: 5,

        /**
         * The type of interpolation to use for the color axis. Can be
         * `linear` or `logarithmic`.
         *
         * @sample highcharts/coloraxis/logarithmic-with-emulate-negative-values/
         *         Logarithmic color axis with extension to emulate negative
         *         values
         *
         * @type      {Highcharts.ColorAxisTypeValue}
         * @default   linear
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.type
         */

        /**
         * Whether to reverse the axis so that the highest number is closest
         * to the origin. Defaults to `false` in a horizontal legend and
         * `true` in a vertical legend, where the smallest value starts on
         * top.
         *
         * @type      {boolean}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.reversed
         */

        /**
         * @product   highcharts highstock highmaps
         * @excluding afterBreaks, pointBreak, pointInBreak
         * @apioption colorAxis.events
         */

        /**
         * Fires when the legend item belonging to the colorAxis is clicked.
         * One parameter, `event`, is passed to the function.
         *
         * @type      {Function}
         * @product   highcharts highstock highmaps
         * @apioption colorAxis.events.legendItemClick
         */

        /**
         * Whether to display the colorAxis in the legend.
         *
         * @sample highcharts/coloraxis/hidden-coloraxis-with-3d-chart/
         *         Hidden color axis with 3d chart
         *
         * @see [heatmap.showInLegend](#series.heatmap.showInLegend)
         *
         * @since   4.2.7
         * @product highcharts highstock highmaps
         */
        showInLegend: true
    }

    /**
     * @private
     */
    public static keepProps: Array<string> = [
        'legendGroup',
        'legendItemHeight',
        'legendItemWidth',
        'legendItem',
        'legendSymbol'
    ];

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Build options to keep layout params on init and update.
     * @private
     */
    public static buildOptions(
        chart: Chart,
        options: ColorAxis.Options,
        userOptions: ColorAxis.Options
    ): ColorAxis.Options {
        var legend = chart.options.legend || {},
            horiz = userOptions.layout ?
                userOptions.layout !== 'vertical' :
                legend.layout !== 'vertical';

        return merge<ColorAxis.Options>(
            options,
            {
                side: horiz ? 2 : 1,
                reversed: !horiz
            },
            userOptions,
            {
                opposite: !horiz,
                showEmpty: false,
                title: null as any,
                visible: (legend as any).enabled &&
                    (userOptions ? userOptions.visible !== false : true)
            }
        );
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * @private
     */
    public constructor(chart: Chart, userOptions: ColorAxis.Options) {
        super(chart, userOptions);
        this.init(chart, userOptions);
    }

    /* *
     *
     *  Properties
     *
     * */

    public added?: boolean;
    public beforePadding = false as any; // Prevents unnecessary padding with `hc-more`
    public chart: Chart = void 0 as any;
    public coll: 'colorAxis' = 'colorAxis';
    public dataClasses: Array<ColorAxis.DataClassesOptions> = void 0 as any;
    public legendColor?: Highcharts.GradientColorObject;
    public legendGroup?: Highcharts.SVGElement;
    public legendItemHeight?: number;
    public legendItem: ColorAxis.LegendItemObject = void 0 as any;
    public legendItems: Array<ColorAxis.LegendItemObject> = void 0 as any;
    public legendItemWidth?: number;
    public legendSymbol?: Highcharts.SVGElement;
    public name: string = ''; // Prevents 'undefined' in legend in IE8
    public options: ColorAxis.Options = void 0 as any;
    public stops: Highcharts.GradientColorObject['stops'] = void 0 as any;
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
        userOptions: ColorAxis.Options
    ): void {
        const axis = this as unknown as Highcharts.ColorAxis;
        const options = ColorAxis.buildOptions( // Build the options
            chart,
            ColorAxis.defaultOptions,
            userOptions
        );

        axis.coll = 'colorAxis';

        super.init(chart, options);

        // Base init() pushes it to the xAxis array, now pop it again
        // chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();

        // Prepare data classes
        if (userOptions.dataClasses) {
            axis.initDataClasses(userOptions);
        }
        axis.initStops();

        // Override original axis properties
        axis.horiz = !options.opposite;
        axis.zoomEnabled = false;
    }

    /**
     * @private
     */
    public initDataClasses(userOptions: ColorAxis.Options): void {
        const axis = this;
        var chart = axis.chart,
            dataClasses,
            colorCounter = 0,
            colorCount = (chart.options.chart as any).colorCount,
            options = axis.options,
            len = (userOptions.dataClasses as any).length;

        axis.dataClasses = dataClasses = [] as Array<ColorAxis.DataClassesOptions>;
        axis.legendItems = [] as Array<ColorAxis.LegendItemObject>;

        (userOptions.dataClasses as any).forEach(function (
            dataClass: ColorAxis.DataClassesOptions,
            i: number
        ): void {
            var colors: any;

            dataClass = merge(dataClass);
            dataClasses.push(dataClass);

            if (!chart.styledMode && dataClass.color) {
                return;
            }

            if (options.dataClassColor === 'category') {
                if (!chart.styledMode) {
                    colors = chart.options.colors;
                    colorCount = colors.length;
                    dataClass.color = colors[colorCounter];
                }

                dataClass.colorIndex = colorCounter;

                // increase and loop back to zero
                colorCounter++;
                if (colorCounter === colorCount) {
                    colorCounter = 0;
                }
            } else {
                dataClass.color = color(options.minColor).tweenTo(
                    color(options.maxColor),
                    len < 2 ? 0.5 : i / (len - 1) // #3219
                );
            }
        });
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
     * @private
     */
    public setTickPositions(): void {
        if (!this.dataClasses) {
            return super.setTickPositions();
        }
    }

    /**
     * @private
     */
    public initStops(): void {
        const axis = this;

        axis.stops = axis.options.stops || [
            [0, axis.options.minColor as any],
            [1, axis.options.maxColor as any]
        ];
        axis.stops.forEach(function (
            stop: Highcharts.GradientColorStopObject
        ): void {
            stop.color = color(stop[1]);
        });
    }

    /**
     * Extend the setOptions method to process extreme colors and color stops.
     * @private
     */
    public setOptions(userOptions: DeepPartial<ColorAxis.Options>): void {
        const axis = this;

        super.setOptions(userOptions);

        axis.options.crosshair = axis.options.marker;
    }

    /**
     * @private
     */
    public setAxisSize(): void {
        const axis = this;
        const symbol = axis.legendSymbol;
        const chart = axis.chart;
        const legendOptions = chart.options.legend || {};

        let x,
            y,
            width,
            height;

        if (symbol) {
            this.left = x = symbol.attr('x') as any;
            this.top = y = symbol.attr('y') as any;
            this.width = width = symbol.attr('width') as any;
            this.height = height = symbol.attr('height') as any;
            this.right = chart.chartWidth - x - width;
            this.bottom = chart.chartHeight - y - height;

            this.len = this.horiz ? width : height;
            this.pos = this.horiz ? x : y;
        } else {
            // Fake length for disabled legend to avoid tick issues
            // and such (#5205)
            this.len = (
                this.horiz ?
                    legendOptions.symbolWidth :
                    legendOptions.symbolHeight
            ) || ColorAxis.defaultLegendLength;
        }
    }

    /**
     * @private
     */
    public normalizedValue(value: number): number {
        const axis = this;

        if (axis.logarithmic) {
            value = axis.logarithmic.log2lin(value);
        }

        return 1 - (
            ((axis.max as any) - value) /
            (((axis.max as any) - (axis.min as any)) || 1)
        );
    }

    /**
     * Translate from a value to a color.
     * @private
     */
    public toColor(
        value: number,
        point: Point
    ): (Highcharts.ColorType|undefined) {
        const axis = this;
        const dataClasses = axis.dataClasses;
        const stops = axis.stops;

        let pos,
            from,
            to,
            color: (Highcharts.ColorString|undefined),
            dataClass,
            i;

        if (dataClasses) {
            i = dataClasses.length;
            while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if ((typeof from === 'undefined' || value >= from) &&
                    (typeof to === 'undefined' || value <= to)
                ) {

                    color = dataClass.color as any;

                    if (point) {
                        point.dataClass = i;
                        point.colorIndex = dataClass.colorIndex as any;
                    }
                    break;
                }
            }

        } else {

            pos = axis.normalizedValue(value);
            i = stops.length;
            while (i--) {
                if (pos > stops[i][0]) {
                    break;
                }
            }
            from = stops[i] || stops[i + 1];
            to = stops[i + 1] || from;

            // The position within the gradient
            pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);

            color = (from.color as any).tweenTo(
                to.color,
                pos
            );
        }

        return color;
    }

    /**
     * Override the getOffset method to add the whole axis groups inside the
     * legend.
     * @private
     */
    public getOffset(): void {
        const axis = this;
        const group = axis.legendGroup;
        const sideOffset = axis.chart.axisOffset[axis.side];

        if (group) {

            // Hook for the getOffset method to add groups to this parent
            // group
            axis.axisParent = group;

            // Call the base
            super.getOffset();

            // First time only
            if (!axis.added) {

                axis.added = true;

                axis.labelLeft = 0;
                axis.labelRight = axis.width;
            }
            // Reset it to avoid color axis reserving space
            axis.chart.axisOffset[axis.side] = sideOffset;
        }
    }

    /**
     * Create the color gradient.
     * @private
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
     * @private
     */
    public drawLegendSymbol(
        legend: Legend,
        item: ColorAxis
    ): void {
        const axis = this;
        const padding = legend.padding;
        const legendOptions = legend.options;
        const horiz = axis.horiz;
        const width = pick(
            legendOptions.symbolWidth,
            horiz ? ColorAxis.defaultLegendLength : 12
        );
        const height = pick(
            legendOptions.symbolHeight,
            horiz ? 12 : ColorAxis.defaultLegendLength
        );
        const labelPadding = pick(
            (legendOptions as any).labelPadding,
            horiz ? 16 : 30
        );
        const itemDistance = pick(legendOptions.itemDistance, 10);

        this.setLegendColor();

        // Create the gradient
        item.legendSymbol = this.chart.renderer.rect(
            0,
            (legend.baseline as any) - 11,
            width,
            height
        ).attr({
            zIndex: 1
        }).add(item.legendGroup);

        // Set how much space this legend item takes up
        axis.legendItemWidth = width + padding + (horiz ? itemDistance : labelPadding);
        axis.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
    }

    /**
     * Fool the legend.
     * @private
     */
    public setState(state?: string): void {
        this.series.forEach(function (
            series: Highcharts.Series
        ): void {
            series.setState(state);
        });
    }

    /**
     * @private
     */
    public setVisible(): void {
    }

    /**
     * @private
     */
    public getSeriesExtremes(): void {
        const axis = this;
        const series = axis.series;

        let colorValArray,
            colorKey,
            colorValIndex: any,
            pointArrayMap,
            calculatedExtremes,
            cSeries,
            i = series.length,
            yData,
            j;

        this.dataMin = Infinity;
        this.dataMax = -Infinity;

        while (i--) { // x, y, value, other
            cSeries = series[i];
            colorKey = cSeries.colorKey = pick(
                cSeries.options.colorKey,
                cSeries.colorKey,
                cSeries.pointValKey,
                cSeries.zoneAxis,
                'y'
            );

            pointArrayMap = cSeries.pointArrayMap;
            calculatedExtremes = (cSeries as any)[colorKey + 'Min'] &&
                (cSeries as any)[colorKey + 'Max'];

            if ((cSeries as any)[colorKey + 'Data']) {
                colorValArray = (cSeries as any)[colorKey + 'Data'];

            } else {
                if (!pointArrayMap) {
                    colorValArray = cSeries.yData;

                } else {
                    colorValArray = [];
                    colorValIndex = pointArrayMap.indexOf(colorKey);
                    yData = cSeries.yData;

                    if (colorValIndex >= 0 && yData) {
                        for (j = 0; j < yData.length; j++) {
                            colorValArray.push(
                                pick(
                                    (yData[j] as any)[colorValIndex],
                                    yData[j]
                                )
                            );
                        }
                    }
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

            if (typeof cSeries.minColorValue !== 'undefined') {
                this.dataMin =
                    Math.min(this.dataMin, cSeries.minColorValue as any);
                this.dataMax =
                    Math.max(this.dataMax, cSeries.maxColorValue as any);
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
     * @fires Highcharts.ColorAxis#event:afterDrawCrosshair
     * @fires Highcharts.ColorAxis#event:drawCrosshair
     */
    public drawCrosshair(
        e?: Highcharts.PointerEventObject,
        point?: Highcharts.ColorPoint
    ): void {
        const axis = this;
        const plotX = point && point.plotX;
        const plotY = point && point.plotY;
        const axisPos = axis.pos;
        const axisLen = axis.len;

        let crossPos;

        if (point) {
            crossPos = axis.toPixels(point.getNestedProperty(point.series.colorKey) as number);
            if (crossPos < (axisPos as any)) {
                crossPos = (axisPos as any) - 2;
            } else if (crossPos > (axisPos as any) + axisLen) {
                crossPos = (axisPos as any) + axisLen + 2;
            }

            point.plotX = crossPos;
            point.plotY = axis.len - crossPos;

            super.drawCrosshair(e, point);

            point.plotX = plotX;
            point.plotY = plotY;

            if (
                axis.cross &&
                !axis.cross.addedToColorAxis &&
                axis.legendGroup
            ) {
                axis.cross
                    .addClass('highcharts-coloraxis-marker')
                    .add(axis.legendGroup);

                axis.cross.addedToColorAxis = true;

                if (
                    !axis.chart.styledMode &&
                    axis.crosshair
                ) {
                    axis.cross.attr({
                        fill: axis.crosshair.color
                    });
                }

            }
        }
    }

    /**
     * @private
     */
    public getPlotLinePath(options: Highcharts.AxisPlotLinePathOptionsObject): (SVGPath|null) {
        const axis = this,
            left = axis.left,
            pos = options.translatedValue,
            top = axis.top;

        // crosshairs only
        return isNumber(pos) ? // pos can be 0 (#3969)
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
        newOptions: ColorAxis.Options,
        redraw?: boolean
    ): void {
        const axis = this,
            chart = axis.chart,
            legend = chart.legend,
            updatedOptions = ColorAxis.buildOptions(chart, {}, newOptions);

        this.series.forEach(function (series: Highcharts.Series): void {
            // Needed for Axis.update when choropleth colors change
            series.isDirtyData = true;
        });

        // When updating data classes, destroy old items and make sure new
        // ones are created (#3207)
        if (newOptions.dataClasses && legend.allItems || axis.dataClasses) {
            axis.destroyItems();
        }

        // Keep the options structure updated for export. Unlike xAxis and
        // yAxis, the colorAxis is not an array. (#3207)
        (chart.options as any)[axis.coll] =
            merge(axis.userOptions, updatedOptions);

        super.update(updatedOptions, redraw);

        if (axis.legendItem) {
            axis.setLegendColor();
            legend.colorizeItem(this as any, true);
        }
    }

    /**
     * Destroy color axis legend items.
     * @private
     */
    public destroyItems(): void {
        const axis = this;
        const chart = axis.chart;

        if (axis.legendItem) {
            chart.legend.destroyItem(axis);

        } else if (axis.legendItems) {
            axis.legendItems.forEach(function (item): void {
                chart.legend.destroyItem(item as any);
            });
        }

        chart.isDirtyLegend = true;
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
     * @private
     */
    public getDataClassLegendSymbols(): Array<ColorAxis.LegendItemObject> {
        const axis = this;
        const chart = axis.chart;
        const legendItems = axis.legendItems;
        const legendOptions = chart.options.legend;
        const valueDecimals = (legendOptions as any).valueDecimals;
        const valueSuffix = (legendOptions as any).valueSuffix || '';

        let name;

        if (!legendItems.length) {
            axis.dataClasses.forEach(function (
                dataClass: ColorAxis.DataClassesOptions,
                i: number
            ): void {
                var vis = true,
                    from = dataClass.from,
                    to = dataClass.to;
                const { numberFormatter } = chart;

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
                legendItems.push(extend(
                    {
                        chart: chart,
                        name: name,
                        options: {},
                        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
                        visible: true,
                        setState: noop,
                        isDataClass: true,
                        setVisible: function (this: ColorAxis.LegendItemObject): void {
                            vis = axis.visible = !vis;
                            axis.series.forEach(function (
                                series: Highcharts.Series
                            ): void {
                                series.points.forEach(function (
                                    point: Point
                                ): void {
                                    if (point.dataClass === i) {
                                        (point as any).setVisible(vis);
                                    }
                                });
                            });
                            chart.legend.colorizeItem(this as any, vis);
                        }
                    },
                    dataClass
                ));
            });
        }
        return legendItems;
    }

}

// Properties to preserve after destroy, for Axis.update (#5881, #6025).
Array.prototype.push.apply(Axis.keepProps, ColorAxis.keepProps);
H.ColorAxis = ColorAxis as any;

/**
 * Handle animation of the color attributes directly
 *
 * @private
 * @function Highcharts.Fx#fillSetter
 *//**
 * Handle animation of the color attributes directly
 *
 * @private
 * @function Highcharts.Fx#strokeSetter
 */
['fill', 'stroke'].forEach(function (prop: string): void {
    (Fx.prototype as any)[prop + 'Setter'] = function (): void {
        this.elem.attr(
            prop,
            color(this.start).tweenTo(
                color(this.end),
                this.pos
            ),
            null as any,
            true
        );
    };
});


// Extend the chart getAxes method to also get the color axis
addEvent(Chart, 'afterGetAxes', function (): void {
    var chart = this,
        options = chart.options;

    this.colorAxis = [] as Array<Highcharts.ColorAxis>;

    if (options.colorAxis) {
        options.colorAxis = splat(options.colorAxis);
        options.colorAxis.forEach(function (
            axisOptions: ColorAxis.Options,
            i: number
        ): void {
            axisOptions.index = i;
            new ColorAxis(chart, axisOptions); // eslint-disable-line no-new
        });
    }
});


// Add colorAxis to series axisTypes
addEvent(Series, 'bindAxes', function (): void {
    var axisTypes = this.axisTypes;

    if (!axisTypes) {
        this.axisTypes = ['colorAxis'];

    } else if (axisTypes.indexOf('colorAxis') === -1) {
        axisTypes.push('colorAxis');
    }
});


// Add the color axis. This also removes the axis' own series to prevent
// them from showing up individually.
addEvent(Legend, 'afterGetAllItems', function (
    this: Highcharts.Legend,
    e: {
        allItems: Array<(Highcharts.ColorAxis|ColorAxis.LegendItemObject)>;
    }
): void {
    var colorAxisItems = [] as Array<(Highcharts.ColorAxis|ColorAxis.LegendItemObject)>,
        colorAxes = this.chart.colorAxis || [],
        options: ColorAxis.Options,
        i;

    colorAxes.forEach(function (colorAxis: Highcharts.ColorAxis): void {
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
            // If dataClasses are defined or showInLegend option is not set to
            // true, do not add color axis' series to legend.
            colorAxis.series.forEach(function (
                series: Highcharts.Series
            ): void {
                if (!series.options.showInLegend || options.dataClasses) {
                    if (series.options.legendType === 'point') {
                        series.points.forEach(function (
                            point: Point
                        ): void {
                            erase(e.allItems, point);
                        });

                    } else {
                        erase(e.allItems, series);
                    }
                }
            });
        }
    });

    i = colorAxisItems.length;
    while (i--) {
        e.allItems.unshift(colorAxisItems[i]);
    }
});

addEvent(Legend, 'afterColorizeItem', function (
    this: Highcharts.Legend,
    e: {
        item: Highcharts.ColorAxis;
        visible: boolean;
    }
): void {
    if (e.visible && e.item.legendColor) {
        (e.item.legendSymbol as any).attr({
            fill: e.item.legendColor
        });
    }
});

// Updates in the legend need to be reflected in the color axis (6888)
addEvent(Legend, 'afterUpdate', function (this: Highcharts.Legend): void {
    var colorAxes = this.chart.colorAxis;

    if (colorAxes) {
        colorAxes.forEach(function (colorAxis: Highcharts.ColorAxis): void {
            colorAxis.update({}, arguments[2]);
        });
    }
});

// Calculate and set colors for points
addEvent(Series as any, 'afterTranslate', function (): void {
    if (
        this.chart.colorAxis &&
        this.chart.colorAxis.length ||
        this.colorAttribs
    ) {
        this.translateColors();
    }
});

namespace ColorAxis {

    export interface DataClassesOptions {
        color?: Highcharts.ColorType;
        colorIndex?: number;
        from?: number;
        name?: string;
        to?: number;
    }

    export interface LegendItemObject extends DataClassesOptions
    {
        chart: Chart;
        name: string;
        options: object;
        drawLegendSymbol: LegendSymbolMixin['drawRectangle'];
        visible: boolean;
        setState: Function;
        isDataClass: true;
        setVisible: () => void;
    }

    export interface MarkerOptions {
        animation?: (boolean|Partial<Highcharts.AnimationOptionsObject>);
        color?: Highcharts.ColorType;
        width?: number;
    }

    export interface Options extends Highcharts.XAxisOptions {
        dataClassColor?: string;
        dataClasses?: Array<DataClassesOptions>;
        layout?: string;
        legend?: Highcharts.LegendOptions;
        marker?: MarkerOptions;
        maxColor?: Highcharts.ColorType;
        minColor?: Highcharts.ColorType;
        showInLegend?: boolean;
        stops?: Highcharts.GradientColorObject['stops'];
    }

}

export default ColorAxis;
