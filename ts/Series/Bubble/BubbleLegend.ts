/* *
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Paweł Potaczek
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AlignValue } from '../../Core/Renderer/AlignObject';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type BubbleSeries from './BubbleSeries';
import type { BubbleSizeByValue } from './BubbleSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type Point from '../../Core/Series/Point';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import Chart from '../../Core/Chart/Chart.js';
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
const { noop } = H;
import Legend from '../../Core/Legend.js';
import palette from '../../Core/Color/Palette.js';
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    isNumber,
    merge,
    objectEach,
    pick,
    setOptions,
    stableSort,
    wrap
} = U;

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        getVisibleBubbleSeriesIndex(): number;
    }
}

declare module '../../Core/Series/PointLike' {
    interface PointLike {
        isBubble?: boolean;
    }
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        ignoreSeries?: boolean;
        isBubble?: boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface BubbleLegendFormatterContextObject {
            center: number;
            radius: (number|null);
            value: number;
        }
        interface BubbleLegendLabelsOptions {
            align?: AlignValue;
            allowOverlap?: boolean;
            className?: string;
            format?: string;
            formatter?: (
                FormatterCallbackFunction<BubbleLegendFormatterContextObject>
            );
            style?: CSSObject;
            x?: number;
            y?: number;
        }
        interface BubbleLegendOptions {
            borderColor?: ColorType;
            borderWidth?: number;
            className?: string;
            color?: ColorType;
            connectorClassName?: string;
            connectorColor?: ColorType;
            connectorDistance?: number;
            connectorWidth?: number;
            enabled?: boolean;
            labels?: BubbleLegendLabelsOptions;
            legendIndex?: number;
            maxSize?: number;
            minSize?: number;
            placed?: boolean;
            ranges?: Array<BubbleLegendRangesOptions>;
            seriesIndex?: number;
            sizeBy?: BubbleSizeByValue;
            sizeByAbsoluteValue?: boolean;
            zIndex?: number;
            zThreshold?: number;
        }
        interface BubbleLegendRangesOptions
            extends Partial<BubbleLegendFormatterContextObject>
        {
            autoRanges?: boolean;
            borderColor?: ColorType;
            color?: ColorType;
            connectorColor?: ColorType;
            bubbleStyle?: CSSObject;
            connectorStyle?: CSSObject;
            labelStyle?: CSSObject;
            value?: any;
        }
        interface Legend {
            bubbleLegend?: BubbleLegend;
            getLinesHeights(): Array<Record<string, number>>;
            retranslateItems(lines: Array<Record<string, number>>): void;
        }
        interface LegendItemObject {
            ignoreSeries?: boolean;
        }
        interface LegendOptions {
            bubbleLegend?: BubbleLegendOptions;
        }
        class BubbleLegend implements LegendItemObject {
            public constructor(options: BubbleLegendOptions, legend: Legend);
            public chart: Chart;
            public fontMetrics: FontMetricsObject;
            public legend: Legend;
            public legendGroup: SVGElement;
            public legendItem: SVGElement;
            public legendItemHeight: number;
            public legendItemWidth: number;
            public legendSymbol: SVGElement;
            public maxLabel: BBoxObject;
            public movementX: number;
            public ranges: Array<BubbleLegendRangesOptions>;
            public selected: undefined;
            public setState: Function;
            public symbols: Record<string, Array<SVGElement>>;
            public options: BubbleLegendOptions;
            public visible: boolean;
            public addToLegend(items: Array<(Series|Point)>): void;
            public correctSizes(): void;
            public drawLegendSymbol(legend: Legend): void;
            public formatLabel(range: BubbleLegendRangesOptions): string;
            public getLabelStyles(): CSSObject;
            public getMaxLabelSize(): BBoxObject;
            public getRangeRadius(value: number): (number|null);
            public getRanges(): Array<BubbleLegendRangesOptions>;
            public hideOverlappingLabels(): void;
            public init(options: BubbleLegendOptions, legend: Legend): void;
            public predictBubbleSizes(): [number, number];
            public render(): void;
            public renderRange(range: BubbleLegendRangesOptions): void;
            public setOptions(): void;
            public updateRanges(min: number, max: number): void;
        }
    }
}

/**
 * @interface Highcharts.BubbleLegendFormatterContextObject
 *//**
 * The center y position of the range.
 * @name Highcharts.BubbleLegendFormatterContextObject#center
 * @type {number}
 *//**
 * The radius of the bubble range.
 * @name Highcharts.BubbleLegendFormatterContextObject#radius
 * @type {number}
 *//**
 * The bubble value.
 * @name Highcharts.BubbleLegendFormatterContextObject#value
 * @type {number}
 */

''; // detach doclets above

import './BubbleSeries.js';

setOptions({ // Set default bubble legend options
    legend: {
        /**
         * The bubble legend is an additional element in legend which
         * presents the scale of the bubble series. Individual bubble ranges
         * can be defined by user or calculated from series. In the case of
         * automatically calculated ranges, a 1px margin of error is
         * permitted.
         *
         * @since        7.0.0
         * @product      highcharts highstock highmaps
         * @requires     highcharts-more
         * @optionparent legend.bubbleLegend
         */
        bubbleLegend: {
            /**
             * The color of the ranges borders, can be also defined for an
             * individual range.
             *
             * @sample highcharts/bubble-legend/similartoseries/
             *         Similar look to the bubble series
             * @sample highcharts/bubble-legend/bordercolor/
             *         Individual bubble border color
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            borderColor: void 0,
            /**
             * The width of the ranges borders in pixels, can be also
             * defined for an individual range.
             */
            borderWidth: 2,
            /**
             * An additional class name to apply to the bubble legend'
             * circle graphical elements. This option does not replace
             * default class names of the graphical element.
             *
             * @sample {highcharts} highcharts/css/bubble-legend/
             *         Styling by CSS
             *
             * @type {string}
             */
            className: void 0,
            /**
             * The main color of the bubble legend. Applies to ranges, if
             * individual color is not defined.
             *
             * @sample highcharts/bubble-legend/similartoseries/
             *         Similar look to the bubble series
             * @sample highcharts/bubble-legend/color/
             *         Individual bubble color
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            color: void 0,
            /**
             * An additional class name to apply to the bubble legend's
             * connector graphical elements. This option does not replace
             * default class names of the graphical element.
             *
             * @sample {highcharts} highcharts/css/bubble-legend/
             *         Styling by CSS
             *
             * @type {string}
             */
            connectorClassName: void 0,
            /**
             * The color of the connector, can be also defined
             * for an individual range.
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            connectorColor: void 0,
            /**
             * The length of the connectors in pixels. If labels are
             * centered, the distance is reduced to 0.
             *
             * @sample highcharts/bubble-legend/connectorandlabels/
             *         Increased connector length
             */
            connectorDistance: 60,
            /**
             * The width of the connectors in pixels.
             *
             * @sample highcharts/bubble-legend/connectorandlabels/
             *         Increased connector width
             */
            connectorWidth: 1,
            /**
             * Enable or disable the bubble legend.
             */
            enabled: false,
            /**
             * Options for the bubble legend labels.
             */
            labels: {
                /**
                 * An additional class name to apply to the bubble legend
                 * label graphical elements. This option does not replace
                 * default class names of the graphical element.
                 *
                 * @sample {highcharts} highcharts/css/bubble-legend/
                 *         Styling by CSS
                 *
                 * @type {string}
                 */
                className: void 0,
                /**
                 * Whether to allow data labels to overlap.
                 */
                allowOverlap: false,
                /**
                 * A format string for the bubble legend labels. Available
                 * variables are the same as for `formatter`.
                 *
                 * @sample highcharts/bubble-legend/format/
                 *         Add a unit
                 *
                 * @type {string}
                 */
                format: '',
                /**
                 * Available `this` properties are:
                 *
                 * - `this.value`: The bubble value.
                 *
                 * - `this.radius`: The radius of the bubble range.
                 *
                 * - `this.center`: The center y position of the range.
                 *
                 * @type {Highcharts.FormatterCallbackFunction<Highcharts.BubbleLegendFormatterContextObject>}
                 */
                formatter: void 0,
                /**
                 * The alignment of the labels compared to the bubble
                 * legend. Can be one of `left`, `center` or `right`.
                 *
                 * @sample highcharts/bubble-legend/connectorandlabels/
                 *         Labels on left
                 *
                 * @type {Highcharts.AlignValue}
                 */
                align: 'right',
                /**
                 * CSS styles for the labels.
                 *
                 * @type {Highcharts.CSSObject}
                 */
                style: {
                    /** @ignore-option */
                    fontSize: 10,
                    /** @ignore-option */
                    color: void 0
                },
                /**
                 * The x position offset of the label relative to the
                 * connector.
                 */
                x: 0,
                /**
                 * The y position offset of the label relative to the
                 * connector.
                 */
                y: 0
            },
            /**
             * Miximum bubble legend range size. If values for ranges are
             * not specified, the `minSize` and the `maxSize` are calculated
             * from bubble series.
             */
            maxSize: 60, // Number
            /**
             * Minimum bubble legend range size. If values for ranges are
             * not specified, the `minSize` and the `maxSize` are calculated
             * from bubble series.
             */
            minSize: 10, // Number
            /**
             * The position of the bubble legend in the legend.
             * @sample highcharts/bubble-legend/connectorandlabels/
             *         Bubble legend as last item in legend
             */
            legendIndex: 0, // Number
            /**
             * Options for specific range. One range consists of bubble,
             * label and connector.
             *
             * @sample highcharts/bubble-legend/ranges/
             *         Manually defined ranges
             * @sample highcharts/bubble-legend/autoranges/
             *         Auto calculated ranges
             *
             * @type {Array<*>}
             */
            ranges: {
                /**
                 * Range size value, similar to bubble Z data.
                 * @type {number}
                 */
                value: void 0,
                /**
                 * The color of the border for individual range.
                 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 */
                borderColor: void 0,
                /**
                 * The color of the bubble for individual range.
                 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 */
                color: void 0,
                /**
                 * The color of the connector for individual range.
                 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 */
                connectorColor: void 0
            } as any,
            /**
             * Whether the bubble legend range value should be represented
             * by the area or the width of the bubble. The default, area,
             * corresponds best to the human perception of the size of each
             * bubble.
             *
             * @sample highcharts/bubble-legend/ranges/
             *         Size by width
             *
             * @type {Highcharts.BubbleSizeByValue}
             */
            sizeBy: 'area',
            /**
             * When this is true, the absolute value of z determines the
             * size of the bubble. This means that with the default
             * zThreshold of 0, a bubble of value -1 will have the same size
             * as a bubble of value 1, while a bubble of value 0 will have a
             * smaller size according to minSize.
             */
            sizeByAbsoluteValue: false,
            /**
             * Define the visual z index of the bubble legend.
             */
            zIndex: 1,
            /**
             * Ranges with with lower value than zThreshold, are skipped.
             */
            zThreshold: 0
        }
    }
});

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * BubbleLegend class.
 *
 * @private
 * @class
 * @name Highcharts.BubbleLegend
 * @param {Highcharts.LegendBubbleLegendOptions} options
 *        Bubble legend options
 * @param {Highcharts.Legend} legend
 *        Legend
 */
class BubbleLegend {
    public constructor(
        options: Highcharts.BubbleLegendOptions,
        legend: Highcharts.Legend
    ) {
        this.init(options, legend);
    }

    public chart: Chart = void 0 as any;
    public fontMetrics: Highcharts.FontMetricsObject = void 0 as any;
    public legend: Highcharts.Legend = void 0 as any;
    public legendGroup: SVGElement = void 0 as any;
    public legendItem: SVGElement = void 0 as any;
    public legendItemHeight: number = void 0 as any;
    public legendItemWidth: number = void 0 as any;
    public legendSymbol: SVGElement = void 0 as any;
    public maxLabel: BBoxObject = void 0 as any;
    public movementX: number = void 0 as any;
    public ranges: Array<Highcharts.BubbleLegendRangesOptions> = void 0 as any;
    public visible: boolean = void 0 as any;
    public symbols: Record<string, Array<SVGElement>>= void 0 as any;
    public options: Highcharts.BubbleLegendOptions = void 0 as any;


    /**
     * Create basic bubbleLegend properties similar to item in legend.
     *
     * @private
     * @function Highcharts.BubbleLegend#init
     * @param {Highcharts.LegendBubbleLegendOptions} options
     *        Bubble legend options
     * @param {Highcharts.Legend} legend
     *        Legend
     * @return {void}
     */
    public init(
        options: Highcharts.BubbleLegendOptions,
        legend: Highcharts.Legend
    ): void {
        this.options = options;
        this.visible = true;
        this.chart = legend.chart;
        this.legend = legend;
    }

    public setState = noop;

    /**
     * Depending on the position option, add bubbleLegend to legend items.
     *
     * @private
     * @function Highcharts.BubbleLegend#addToLegend
     * @param {Array<(Highcharts.Point|Highcharts.Series)>}
     *        All legend items
     * @return {void}
     */
    public addToLegend(items: Array<(Series|Point)>): void {
        // Insert bubbleLegend into legend items
        items.splice(this.options.legendIndex as any, 0, this as any);
    }

    /**
     * Calculate ranges, sizes and call the next steps of bubbleLegend
     * creation.
     *
     * @private
     * @function Highcharts.BubbleLegend#drawLegendSymbol
     * @param {Highcharts.Legend} legend
     *        Legend instance
     * @return {void}
     */
    public drawLegendSymbol(legend: Highcharts.Legend): void {
        var chart = this.chart,
            options = this.options,
            size,
            itemDistance = pick(legend.options.itemDistance, 20),
            connectorSpace,
            ranges =
                options.ranges as Array<Highcharts.BubbleLegendRangesOptions>,
            radius,
            maxLabel,
            connectorDistance = options.connectorDistance;

        // Predict label dimensions
        this.fontMetrics = chart.renderer.fontMetrics(
            (options.labels as any).style.fontSize.toString() + 'px'
        );

        // Do not create bubbleLegend now if ranges or ranges valeus are not
        // specified or if are empty array.
        if (!ranges || !ranges.length || !isNumber(ranges[0].value)) {
            (legend.options.bubbleLegend as any).autoRanges = true;
            return;
        }

        // Sort ranges to right render order
        stableSort(ranges, function (
            a: Highcharts.BubbleLegendRangesOptions,
            b: Highcharts.BubbleLegendRangesOptions
        ): number {
            return b.value - a.value;
        });

        this.ranges = ranges;

        this.setOptions();
        this.render();

        // Get max label size
        maxLabel = this.getMaxLabelSize();
        radius = this.ranges[0].radius;
        size = (radius as any) * 2;

        // Space for connectors and labels.
        connectorSpace =
            (connectorDistance as any) - (radius as any) + maxLabel.width;
        connectorSpace = connectorSpace > 0 ? connectorSpace : 0;

        this.maxLabel = maxLabel;
        this.movementX = (options.labels as any).align === 'left' ?
            connectorSpace : 0;

        this.legendItemWidth = size + connectorSpace + itemDistance;
        this.legendItemHeight = size + this.fontMetrics.h / 2;
    }

    /**
     * Set style options for each bubbleLegend range.
     *
     * @private
     * @function Highcharts.BubbleLegend#setOptions
     * @return {void}
     */
    public setOptions(): void {
        var ranges = this.ranges,
            options = this.options,
            series = this.chart.series[options.seriesIndex as any],
            baseline = this.legend.baseline,
            bubbleStyle = {
                'z-index': options.zIndex,
                'stroke-width': options.borderWidth
            },
            connectorStyle = {
                'z-index': options.zIndex,
                'stroke-width': options.connectorWidth
            },
            labelStyle = this.getLabelStyles(),
            fillOpacity = (series.options.marker as any).fillOpacity,
            styledMode = this.chart.styledMode;

        // Allow to parts of styles be used individually for range
        ranges.forEach(function (
            range: Highcharts.BubbleLegendRangesOptions,
            i: number
        ): void {
            if (!styledMode) {
                (bubbleStyle as any).stroke = pick(
                    range.borderColor,
                    options.borderColor,
                    series.color
                );
                (bubbleStyle as any).fill = pick(
                    range.color,
                    options.color,
                    fillOpacity !== 1 ?
                        color(series.color).setOpacity(fillOpacity)
                            .get('rgba') :
                        series.color
                );
                (connectorStyle as any).stroke = pick(
                    range.connectorColor,
                    options.connectorColor,
                    series.color
                );
            }

            // Set options needed for rendering each range
            ranges[i].radius = this.getRangeRadius(range.value);
            ranges[i] = merge(ranges[i], {
                center: (
                    (ranges[0].radius as any) - (ranges[i].radius as any) +
                    (baseline as any)
                )
            });

            if (!styledMode) {
                merge(true, ranges[i], {
                    bubbleStyle: merge(false, bubbleStyle),
                    connectorStyle: merge(false, connectorStyle),
                    labelStyle: labelStyle
                });
            }
        }, this);
    }

    /**
     * Merge options for bubbleLegend labels.
     *
     * @private
     * @function Highcharts.BubbleLegend#getLabelStyles
     * @return {Highcharts.CSSObject}
     */
    public getLabelStyles(): CSSObject {
        var options = this.options,
            additionalLabelsStyle: CSSObject = {},
            labelsOnLeft = (options.labels as any).align === 'left',
            rtl = this.legend.options.rtl;

        // To separate additional style options
        objectEach((options.labels as any).style, function (
            value: string,
            key: string
        ): void {
            if (
                key !== 'color' &&
                key !== 'fontSize' &&
                key !== 'z-index'
            ) {
                (additionalLabelsStyle as any)[key] = value;
            }
        });

        return merge(false, additionalLabelsStyle, {
            'font-size': (options.labels as any).style.fontSize,
            fill: pick(
                (options.labels as any).style.color,
                palette.neutralColor100
            ),
            'z-index': options.zIndex,
            align: rtl || labelsOnLeft ? 'right' : 'left'
        });
    }


    /**
     * Calculate radius for each bubble range,
     * used code from BubbleSeries.js 'getRadius' method.
     *
     * @private
     * @function Highcharts.BubbleLegend#getRangeRadius
     * @param {number} value
     *        Range value
     * @return {number|null}
     *         Radius for one range
     */
    public getRangeRadius(value: number): (number|null) {
        var options = this.options,
            seriesIndex = this.options.seriesIndex,
            bubbleSeries: BubbleSeries = this.chart.series[seriesIndex as any] as any,
            zMax = (options.ranges as any)[0].value,
            zMin = (options.ranges as any)[
                (options.ranges as any).length - 1
            ].value,
            minSize = options.minSize,
            maxSize = options.maxSize;

        return bubbleSeries.getRadius.call(
            this,
            zMin,
            zMax,
            minSize as any,
            maxSize as any,
            value
        );
    }

    /**
     * Render the legendSymbol group.
     *
     * @private
     * @function Highcharts.BubbleLegend#render
     * @return {void}
     */
    public render(): void {
        var renderer = this.chart.renderer,
            zThreshold = this.options.zThreshold;


        if (!this.symbols) {
            this.symbols = {
                connectors: [],
                bubbleItems: [],
                labels: []
            };
        }
        // Nesting SVG groups to enable handleOverflow
        this.legendSymbol = renderer.g('bubble-legend');
        this.legendItem = renderer.g('bubble-legend-item');

        // To enable default 'hideOverlappingLabels' method
        this.legendSymbol.translateX = 0;
        this.legendSymbol.translateY = 0;

        this.ranges.forEach(function (
            range: Highcharts.BubbleLegendRangesOptions
        ): void {
            if (range.value >= (zThreshold as any)) {
                this.renderRange(range);
            }
        }, this);
        // To use handleOverflow method
        this.legendSymbol.add(this.legendItem);
        this.legendItem.add(this.legendGroup);

        this.hideOverlappingLabels();
    }

    /**
     * Render one range, consisting of bubble symbol, connector and label.
     *
     * @private
     * @function Highcharts.BubbleLegend#renderRange
     * @param {Highcharts.LegendBubbleLegendRangesOptions} range
     *        Range options
     * @return {void}
     */
    public renderRange(range: Highcharts.BubbleLegendRangesOptions): void {
        var mainRange = this.ranges[0],
            legend = this.legend,
            options = this.options,
            labelsOptions = options.labels,
            chart = this.chart,
            renderer = chart.renderer,
            symbols = this.symbols,
            labels = symbols.labels,
            label,
            elementCenter = range.center,
            absoluteRadius = Math.abs(range.radius as any),
            connectorDistance = options.connectorDistance || 0,
            labelsAlign = (labelsOptions as any).align,
            rtl = legend.options.rtl,
            fontSize = (labelsOptions as any).style.fontSize,
            connectorLength = rtl || labelsAlign === 'left' ?
                -connectorDistance : connectorDistance,
            borderWidth = options.borderWidth,
            connectorWidth = options.connectorWidth,
            posX = mainRange.radius || 0,
            posY = (elementCenter as any) - absoluteRadius -
                (borderWidth as any) / 2 + (connectorWidth as any) / 2,
            labelY,
            labelX,
            fontMetrics = this.fontMetrics,
            labelMovement = fontSize / 2 - (fontMetrics.h - fontSize) / 2,
            crispMovement = (posY % 1 ? 1 : 0.5) -
                ((connectorWidth as any) % 2 ? 0 : 0.5),
            styledMode = renderer.styledMode;

        // Set options for centered labels
        if (labelsAlign === 'center') {
            connectorLength = 0; // do not use connector
            options.connectorDistance = 0;
            (range.labelStyle as any).align = 'center';
        }

        labelY = posY + (options.labels as any).y;
        labelX = posX + connectorLength + (options.labels as any).x;

        // Render bubble symbol
        symbols.bubbleItems.push(
            renderer
                .circle(
                    posX,
                    (elementCenter as any) + crispMovement,
                    absoluteRadius
                )
                .attr(
                    // @todo: Resolve bad typing of bubbleStyle. CSSObject can't
                    // be passed to .attr.
                    (styledMode ? {} : range.bubbleStyle) as SVGAttributes
                )
                .addClass(
                    (
                        styledMode ?
                            'highcharts-color-' +
                                this.options.seriesIndex + ' ' :
                            ''
                    ) +
                    'highcharts-bubble-legend-symbol ' +
                    (options.className || '')
                ).add(
                    this.legendSymbol
                )
        );

        // Render connector
        symbols.connectors.push(
            renderer
                .path(renderer.crispLine(
                    [
                        ['M', posX, posY],
                        ['L', posX + connectorLength, posY]
                    ],
                    options.connectorWidth as any
                ))
                .attr(
                    // @todo: Resolve bad typing of connectorStyle. CSSObject
                    // can't be passed to .attr.
                    (styledMode ? {} : range.connectorStyle) as SVGAttributes
                )
                .addClass(
                    (
                        styledMode ?
                            'highcharts-color-' +
                                this.options.seriesIndex + ' ' : ''
                    ) +
                    'highcharts-bubble-legend-connectors ' +
                    (options.connectorClassName || '')
                ).add(
                    this.legendSymbol
                )
        );

        // Render label
        label = renderer
            .text(
                this.formatLabel(range),
                labelX,
                labelY + labelMovement
            )
            .attr(
                // @todo: Resolve bad typing of labelStyle. CSSObject can't
                // be passed to .attr.
                (styledMode ? {} : range.labelStyle) as SVGAttributes
            )
            .addClass(
                'highcharts-bubble-legend-labels ' +
                ((options.labels as any).className || '')
            ).add(
                this.legendSymbol
            );

        labels.push(label);
        // To enable default 'hideOverlappingLabels' method
        label.placed = true;
        label.alignAttr = {
            x: labelX,
            y: labelY + labelMovement
        };
    }

    /**
     * Get the label which takes up the most space.
     *
     * @private
     * @function Highcharts.BubbleLegend#getMaxLabelSize
     * @return {Highcharts.BBoxObject}
     */
    public getMaxLabelSize(): BBoxObject {
        var labels = this.symbols.labels,
            maxLabel: (BBoxObject|undefined),
            labelSize: BBoxObject;

        labels.forEach(function (label: SVGElement): void {
            labelSize = label.getBBox(true);

            if (maxLabel) {
                maxLabel = labelSize.width > maxLabel.width ?
                    labelSize : maxLabel;

            } else {
                maxLabel = labelSize;
            }
        });
        return maxLabel || ({} as any);
    }

    /**
     * Get formatted label for range.
     *
     * @private
     * @function Highcharts.BubbleLegend#formatLabel
     * @param {Highcharts.LegendBubbleLegendRangesOptions} range
     *        Range options
     * @return {string}
     *         Range label text
     */
    public formatLabel(range: Highcharts.BubbleLegendRangesOptions): string {
        var options = this.options,
            formatter = (options.labels as any).formatter,
            format = (options.labels as any).format;
        const { numberFormatter } = this.chart;

        return format ? U.format(format, range) :
            formatter ? formatter.call(range) :
                numberFormatter(range.value, 1);
    }

    /**
     * By using default chart 'hideOverlappingLabels' method, hide or show
     * labels and connectors.
     *
     * @private
     * @function Highcharts.BubbleLegend#hideOverlappingLabels
     * @return {void}
     */
    public hideOverlappingLabels(): void {
        var chart = this.chart,
            allowOverlap = (this.options.labels as any).allowOverlap,
            symbols = this.symbols;

        if (!allowOverlap && symbols) {
            chart.hideOverlappingLabels(symbols.labels);

            // Hide or show connectors
            symbols.labels.forEach(function (
                label: SVGElement,
                index: number
            ): void {
                if (!label.newOpacity) {
                    symbols.connectors[index].hide();
                } else if (label.newOpacity !== label.oldOpacity) {
                    symbols.connectors[index].show();
                }
            });
        }
    }

    /**
     * Calculate ranges from created series.
     *
     * @private
     * @function Highcharts.BubbleLegend#getRanges
     * @return {Array<Highcharts.LegendBubbleLegendRangesOptions>}
     *         Array of range objects
     */
    public getRanges(): Array<Highcharts.BubbleLegendRangesOptions> {
        var bubbleLegend = this.legend.bubbleLegend,
            series = (bubbleLegend as any).chart.series,
            ranges: Array<Highcharts.BubbleLegendRangesOptions>,
            rangesOptions = (bubbleLegend as any).options.ranges,
            zData,
            minZ = Number.MAX_VALUE,
            maxZ = -Number.MAX_VALUE;

        series.forEach(function (s: BubbleSeries): void {
            // Find the min and max Z, like in bubble series
            if (s.isBubble && !s.ignoreSeries) {
                zData = s.zData.filter(isNumber);

                if (zData.length) {
                    minZ = pick(s.options.zMin, Math.min(
                        minZ,
                        Math.max(
                            arrayMin(zData),
                            s.options.displayNegative === false ?
                                (s.options.zThreshold as any) :
                                -Number.MAX_VALUE
                        )
                    ));
                    maxZ = pick(
                        s.options.zMax,
                        Math.max(maxZ, arrayMax(zData))
                    );
                }
            }
        });

        // Set values for ranges
        if (minZ === maxZ) {
            // Only one range if min and max values are the same.
            ranges = [{ value: maxZ }];
        } else {
            ranges = [
                { value: minZ },
                { value: (minZ + maxZ) / 2 },
                { value: maxZ, autoRanges: true }
            ];
        }
        // Prevent reverse order of ranges after redraw
        if (rangesOptions.length && rangesOptions[0].radius) {
            ranges.reverse();
        }

        // Merge ranges values with user options
        ranges.forEach(function (
            range: Highcharts.BubbleLegendRangesOptions,
            i: number
        ): void {
            if (rangesOptions && rangesOptions[i]) {
                ranges[i] = merge(false, rangesOptions[i], range);
            }
        });

        return ranges;
    }

    /**
     * Calculate bubble legend sizes from rendered series.
     *
     * @private
     * @function Highcharts.BubbleLegend#predictBubbleSizes
     * @return {Array<number,number>}
     *         Calculated min and max bubble sizes
     */
    public predictBubbleSizes(): [number, number] {
        var chart = this.chart,
            fontMetrics = this.fontMetrics,
            legendOptions = chart.legend.options,
            floating = legendOptions.floating,
            horizontal = legendOptions.layout === 'horizontal',
            lastLineHeight = horizontal ? chart.legend.lastLineHeight : 0,
            plotSizeX = chart.plotSizeX,
            plotSizeY = chart.plotSizeY,
            bubbleSeries: BubbleSeries = chart.series[this.options.seriesIndex as any] as any,
            minSize = Math.ceil(bubbleSeries.minPxSize),
            maxPxSize = Math.ceil(bubbleSeries.maxPxSize),
            maxSize = bubbleSeries.options.maxSize,
            plotSize = Math.min(plotSizeY as any, plotSizeX as any),
            calculatedSize;

        // Calculate prediceted max size of bubble
        if (floating || !(/%$/.test(maxSize as any))) {
            calculatedSize = maxPxSize;

        } else {
            maxSize = parseFloat(maxSize as any);

            calculatedSize = ((plotSize + lastLineHeight -
                fontMetrics.h / 2) * maxSize / 100) / (maxSize / 100 + 1);

            // Get maxPxSize from bubble series if calculated bubble legend
            // size will not affect to bubbles series.
            if (
                (horizontal && (plotSizeY as any) - calculatedSize >=
               (plotSizeX as any)) || (!horizontal && (plotSizeX as any) -
               calculatedSize >= (plotSizeY as any))
            ) {
                calculatedSize = maxPxSize;
            }
        }

        return [minSize, Math.ceil(calculatedSize)];
    }

    /**
     * Correct ranges with calculated sizes.
     *
     * @private
     * @function Highcharts.BubbleLegend#updateRanges
     * @param {number} min
     * @param {number} max
     * @return {void}
     */
    public updateRanges(min: number, max: number): void {
        var bubbleLegendOptions = this.legend.options.bubbleLegend;

        (bubbleLegendOptions as any).minSize = min;
        (bubbleLegendOptions as any).maxSize = max;
        (bubbleLegendOptions as any).ranges = this.getRanges();
    }

    /**
     * Because of the possibility of creating another legend line, predicted
     * bubble legend sizes may differ by a few pixels, so it is necessary to
     * correct them.
     *
     * @private
     * @function Highcharts.BubbleLegend#correctSizes
     * @return {void}
     */
    public correctSizes(): void {
        var legend = this.legend,
            chart = this.chart,
            bubbleSeries: BubbleSeries = chart.series[this.options.seriesIndex as any] as any,
            bubbleSeriesSize = bubbleSeries.maxPxSize,
            bubbleLegendSize = this.options.maxSize;

        if (Math.abs(Math.ceil(bubbleSeriesSize) - (bubbleLegendSize as any)) >
            1
        ) {
            this.updateRanges(
                this.options.minSize as any,
                bubbleSeries.maxPxSize
            );
            legend.render();
        }
    }
}

// Start the bubble legend creation process.
addEvent(Legend, 'afterGetAllItems', function (
    this: Highcharts.Legend,
    e: { allItems: Array<(Series|Point)> }
): void {
    var legend = this,
        bubbleLegend = legend.bubbleLegend,
        legendOptions = legend.options,
        options = legendOptions.bubbleLegend,
        bubbleSeriesIndex = legend.chart.getVisibleBubbleSeriesIndex();

    // Remove unnecessary element
    if (bubbleLegend && bubbleLegend.ranges && bubbleLegend.ranges.length) {
        // Allow change the way of calculating ranges in update
        if ((options as any).ranges.length) {
            (options as any).autoRanges =
                !!(options as any).ranges[0].autoRanges;
        }
        // Update bubbleLegend dimensions in each redraw
        legend.destroyItem(bubbleLegend);
    }
    // Create bubble legend
    if (bubbleSeriesIndex >= 0 &&
            legendOptions.enabled &&
            (options as any).enabled
    ) {
        (options as any).seriesIndex = bubbleSeriesIndex;
        legend.bubbleLegend = new H.BubbleLegend(options as any, legend);
        legend.bubbleLegend.addToLegend(e.allItems);
    }
});

/**
 * Check if there is at least one visible bubble series.
 *
 * @private
 * @function Highcharts.Chart#getVisibleBubbleSeriesIndex
 * @return {number}
 *         First visible bubble series index
 */
Chart.prototype.getVisibleBubbleSeriesIndex = function (): number {
    var series = this.series,
        i = 0;

    while (i < series.length) {
        if (
            series[i] &&
            series[i].isBubble &&
            series[i].visible &&
            (series[i] as any).zData.length
        ) {
            return i;
        }
        i++;
    }
    return -1;
};

/**
 * Calculate height for each row in legend.
 *
 * @private
 * @function Highcharts.Legend#getLinesHeights
 * @return {Array<Highcharts.Dictionary<number>>}
 *         Informations about line height and items amount
 */
Legend.prototype.getLinesHeights = function (
    this: Highcharts.Legend
): Array<Record<string, number>> {
    var items = this.allItems,
        lines = [] as Array<Record<string, number>>,
        lastLine,
        length = items.length,
        i = 0,
        j = 0;

    for (i = 0; i < length; i++) {
        if (items[i].legendItemHeight) {
            // for bubbleLegend
            (items[i] as any).itemHeight = items[i].legendItemHeight;
        }
        if ( // Line break
            items[i] === items[length - 1] ||
            items[i + 1] &&
            (items[i]._legendItemPos as any)[1] !==
            (items[i + 1]._legendItemPos as any)[1]
        ) {
            lines.push({ height: 0 });
            lastLine = lines[lines.length - 1];
            // Find the highest item in line
            for (j; j <= i; j++) {
                if ((items[j] as any).itemHeight > lastLine.height) {
                    lastLine.height = (items[j] as any).itemHeight;
                }
            }
            lastLine.step = i;
        }
    }
    return lines;
};

/**
 * Correct legend items translation in case of different elements heights.
 *
 * @private
 * @function Highcharts.Legend#retranslateItems
 * @param {Array<Highcharts.Dictionary<number>>} lines
 *        Informations about line height and items amount
 * @return {void}
 */
Legend.prototype.retranslateItems = function (
    this: Highcharts.Legend,
    lines: Array<Record<string, number>>
): void {
    var items = this.allItems,
        orgTranslateX,
        orgTranslateY,
        movementX,
        rtl = this.options.rtl,
        actualLine = 0;

    items.forEach(function (
        item: (Highcharts.BubbleLegend|Series|Point),
        index: number
    ): void {
        orgTranslateX = (item.legendGroup as any).translateX;
        orgTranslateY = (item._legendItemPos as any)[1];

        movementX = (item as any).movementX;

        if (movementX || (rtl && (item as any).ranges)) {
            movementX = rtl ?
                orgTranslateX - (item as any).options.maxSize / 2 :
                orgTranslateX + movementX;

            (item.legendGroup as any).attr({ translateX: movementX });
        }
        if (index > lines[actualLine].step) {
            actualLine++;
        }

        (item.legendGroup as any).attr({
            translateY: Math.round(
                orgTranslateY + lines[actualLine].height / 2
            )
        });
        (item._legendItemPos as any)[1] = orgTranslateY +
            lines[actualLine].height / 2;
    });
};

// Toggle bubble legend depending on the visible status of bubble series.
addEvent(Series, 'legendItemClick', function (): void {
    var series = this,
        chart = series.chart,
        visible = series.visible,
        legend = series.chart.legend,
        status;

    if (legend && legend.bubbleLegend) {
        // Temporary correct 'visible' property
        series.visible = !visible;
        // Save future status for getRanges method
        series.ignoreSeries = visible;
        // Check if at lest one bubble series is visible
        status = chart.getVisibleBubbleSeriesIndex() >= 0;

        // Hide bubble legend if all bubble series are disabled
        if (legend.bubbleLegend.visible !== status) {
            // Show or hide bubble legend
            legend.update({
                bubbleLegend: { enabled: status }
            });

            legend.bubbleLegend.visible = status; // Restore default status
        }
        series.visible = visible;
    }
});

// If ranges are not specified, determine ranges from rendered bubble series
// and render legend again.
wrap(Chart.prototype, 'drawChartBox', function (
    this: Chart,
    proceed: Function,
    options: Highcharts.Options,
    callback: Chart.CallbackFunction
): void {
    var chart = this,
        legend = chart.legend,
        bubbleSeries = chart.getVisibleBubbleSeriesIndex() >= 0,
        bubbleLegendOptions: Highcharts.BubbleLegendOptions,
        bubbleSizes;

    if (
        legend && legend.options.enabled && legend.bubbleLegend &&
        (legend.options.bubbleLegend as any).autoRanges && bubbleSeries
    ) {
        bubbleLegendOptions = legend.bubbleLegend.options;
        bubbleSizes = legend.bubbleLegend.predictBubbleSizes();

        legend.bubbleLegend.updateRanges(bubbleSizes[0], bubbleSizes[1]);
        // Disable animation on init
        if (!bubbleLegendOptions.placed) {
            legend.group.placed = false;

            legend.allItems.forEach(function (item): void {
                (item.legendGroup as any).translateY = null;
            });
        }

        // Create legend with bubbleLegend
        legend.render();

        chart.getMargins();

        chart.axes.forEach(function (axis): void {
            if (axis.visible) { // #11448
                axis.render();
            }

            if (!bubbleLegendOptions.placed) {
                axis.setScale();
                axis.updateNames();
                // Disable axis animation on init
                objectEach(axis.ticks, function (tick): void {
                    tick.isNew = true;
                    tick.isNewLabel = true;
                });
            }
        });
        bubbleLegendOptions.placed = true;

        // After recalculate axes, calculate margins again.
        chart.getMargins();

        // Call default 'drawChartBox' method.
        proceed.call(chart, options, callback);

        // Check bubble legend sizes and correct them if necessary.
        legend.bubbleLegend.correctSizes();

        // Correct items positions with different dimensions in legend.
        legend.retranslateItems(legend.getLinesHeights());

    } else {
        proceed.call(chart, options, callback);
        // Allow color change on static bubble legend after click on legend
        if (legend && legend.options.enabled && legend.bubbleLegend) {
            legend.render();
            legend.retranslateItems(legend.getLinesHeights());
        }
    }
});

H.BubbleLegend = BubbleLegend as any;
export default H.BubbleLegend;
