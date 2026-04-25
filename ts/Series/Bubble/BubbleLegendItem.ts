/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Paweł Potaczek
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

import type { AlignValue } from '../../Core/Renderer/AlignObject';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type BubbleSeries from './BubbleSeries';
import type { BubbleSizeByValue } from './BubbleSeriesOptions';
import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type Templating from '../../Core/Templating';
import type {
    LegendItemObject,
    LegendItem
} from '../../Core/Legend/LegendItem';
import type Point from '../../Core/Series/Point';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Chart from '../../Core/Chart/Chart.js';
import F from '../../Core/Templating.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import Legend from '../../Core/Legend/Legend.js';
import Series from '../../Core/Series/Series.js';
import {
    arrayMax,
    arrayMin,
    isNumber,
    merge,
    pick,
    stableSort
} from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Legend/LegendBase' {
    interface LegendBase {
        bubbleLegend?: BubbleLegendItem;
    }
}

/** @internal */
declare module '../../Core/Series/PointBase' {
    interface PointBase {
        isBubble?: boolean;
    }
}

/** @internal */
declare module '../../Core/Series/SeriesBase' {
    interface SeriesBase {
        ignoreSeries?: boolean;
        isBubble?: boolean;
    }
}

declare module '../../Core/Legend/LegendOptions' {
    interface LegendOptions {
        /**
         * The bubble legend is an additional element in legend which
         * presents the scale of the bubble series. Individual bubble ranges
         * can be defined by user or calculated from series. In the case of
         * automatically calculated ranges, a 1px margin of error is
         * permitted.
         *
         * @optionparent legend.bubbleLegend
         */
        bubbleLegend?: BubbleLegendItem.Options;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * BubbleLegend class.
 *
 * @internal
 * @class
 * @name Highcharts.BubbleLegend
 * @param {Highcharts.LegendBubbleLegendOptions} options
 * Options of BubbleLegendItem.
 *
 * @param {Highcharts.Legend} legend
 * Legend of item.
 */
class BubbleLegendItem {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: BubbleLegendItem.Options,
        legend: Legend
    ) {
        this.init(options, legend);
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart!: Chart;
    public legend!: Legend;
    public maxLabel!: BBoxObject;
    public movementX!: number;
    public ranges!: Array<BubbleLegendItem.RangesOptions>;
    public selected!: undefined;
    public visible!: boolean;
    public symbols!: Record<string, Array<SVGElement>>;
    public options!: BubbleLegendItem.Options;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create basic bubbleLegend properties similar to item in legend.
     * @internal
     */
    public init(
        options: BubbleLegendItem.Options,
        legend: Legend
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
     * @internal
     *
     * @param {Array<(Highcharts.Point|Highcharts.Series)>} items
     *        All legend items
     */
    public addToLegend(items: Array<(Series|Point)>): void {
        // Insert bubbleLegend into legend items
        items.splice(this.options.legendIndex as any, 0, this as any);
    }

    /**
     * Calculate ranges, sizes and call the next steps of bubbleLegend
     * creation.
     *
     * @internal
     *
     * @param {Highcharts.Legend} legend
     *        Legend instance
     */
    public drawLegendSymbol(legend: Legend): void {
        const itemDistance = pick(legend.options.itemDistance, 20),
            legendItem = this.legendItem || {},
            options = this.options,
            ranges =
                options.ranges as Array<BubbleLegendItem.RangesOptions>,
            connectorDistance = options.connectorDistance;

        let connectorSpace;

        // Do not create bubbleLegend now if ranges or ranges values are not
        // specified or if are empty array.
        if (!ranges || !ranges.length || !isNumber(ranges[0].value)) {
            (legend.options.bubbleLegend as any).autoRanges = true;
            return;
        }

        // Sort ranges to right render order
        stableSort(ranges, function (
            a: BubbleLegendItem.RangesOptions,
            b: BubbleLegendItem.RangesOptions
        ): number {
            return b.value - a.value;
        });

        this.ranges = ranges;

        this.setOptions();
        this.render();

        // Get max label size
        const maxLabel = this.getMaxLabelSize(),
            radius = this.ranges[0].radius,
            size = (radius as any) * 2;

        // Space for connectors and labels.
        connectorSpace =
            (connectorDistance as any) - (radius as any) + maxLabel.width;
        connectorSpace = connectorSpace > 0 ? connectorSpace : 0;

        this.maxLabel = maxLabel;
        this.movementX = (options.labels as any).align === 'left' ?
            connectorSpace : 0;

        legendItem.labelWidth = size + connectorSpace + itemDistance;
        legendItem.labelHeight = size + maxLabel.height / 2;
    }

    /**
     * Set style options for each bubbleLegend range.
     * @internal
     */
    public setOptions(): void {
        const ranges = this.ranges,
            options = this.options,
            series = this.chart.series[options.seriesIndex as any],
            baseline = this.legend.baseline,
            bubbleAttribs: SVGAttributes = {
                zIndex: options.zIndex,
                'stroke-width': options.borderWidth
            },
            connectorAttribs: SVGAttributes = {
                zIndex: options.zIndex,
                'stroke-width': options.connectorWidth
            },
            labelAttribs: SVGAttributes = {
                align: (
                    this.legend.options.rtl ||
                    (options.labels as any).align === 'left'
                ) ? 'right' : 'left',
                zIndex: options.zIndex
            },
            fillOpacity = (series.options.marker as any).fillOpacity,
            styledMode = this.chart.styledMode;

        // Allow to parts of styles be used individually for range
        ranges.forEach(function (
            this: BubbleLegendItem,
            range: BubbleLegendItem.RangesOptions,
            i: number
        ): void {
            if (!styledMode) {
                bubbleAttribs.stroke = pick(
                    range.borderColor,
                    options.borderColor,
                    series.color
                );
                bubbleAttribs.fill = range.color || options.color;
                if (!bubbleAttribs.fill) {
                    bubbleAttribs.fill = series.color;
                    bubbleAttribs['fill-opacity'] = fillOpacity ?? 1;
                }
                connectorAttribs.stroke = pick(
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
                    bubbleAttribs: merge(bubbleAttribs),
                    connectorAttribs: merge(connectorAttribs),
                    labelAttribs: labelAttribs
                });
            }
        }, this);
    }

    /**
     * Calculate radius for each bubble range,
     * used code from BubbleSeries.js 'getRadius' method.
     *
     * @internal
     *
     * @param {number} value
     *        Range value
     *
     * @return {number|null}
     *         Radius for one range
     */
    public getRangeRadius(value: number): (number|null) {
        const options = this.options,
            seriesIndex = this.options.seriesIndex,
            bubbleSeries: BubbleSeries = this.chart.series[
                seriesIndex as any
            ] as any,
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
     * Render the legendItem group.
     * @internal
     */
    public render(): void {
        const legendItem = this.legendItem || {},
            renderer = this.chart.renderer,
            zThreshold = this.options.zThreshold;


        if (!this.symbols) {
            this.symbols = {
                connectors: [],
                bubbleItems: [],
                labels: []
            };
        }
        // Nesting SVG groups to enable handleOverflow
        legendItem.symbol = renderer.g('bubble-legend');
        legendItem.label = renderer.g('bubble-legend-item')
            .css(this.legend.itemStyle || {});

        // To enable default 'hideOverlappingLabels' method
        legendItem.symbol.translateX = 0;
        legendItem.symbol.translateY = 0;

        // To use handleOverflow method
        legendItem.symbol.add(legendItem.label);
        legendItem.label.add(legendItem.group);

        for (const range of this.ranges) {
            if (range.value >= (zThreshold as any)) {
                this.renderRange(range);
            }
        }

        this.hideOverlappingLabels();
    }

    /**
     * Render one range, consisting of bubble symbol, connector and label.
     *
     * @internal
     *
     * @param {Highcharts.LegendBubbleLegendRangesOptions} range
     *        Range options
     */
    public renderRange(range: BubbleLegendItem.RangesOptions): void {
        const mainRange = this.ranges[0],
            legend = this.legend,
            options = this.options,
            labelsOptions = options.labels as any,
            chart = this.chart,
            bubbleSeries: BubbleSeries = chart.series[
                options.seriesIndex as any
            ] as any,
            renderer = chart.renderer,
            symbols = this.symbols,
            labels = symbols.labels,
            elementCenter = range.center,
            absoluteRadius = Math.abs(range.radius as any),
            connectorDistance = options.connectorDistance || 0,
            labelsAlign = (labelsOptions as any).align,
            rtl = legend.options.rtl,
            borderWidth = options.borderWidth,
            connectorWidth = options.connectorWidth,
            posX = mainRange.radius || 0,
            posY = (elementCenter as any) - absoluteRadius -
                (borderWidth as any) / 2 + (connectorWidth as any) / 2,
            crispMovement = (posY % 1 ? 1 : 0.5) -
                ((connectorWidth as any) % 2 ? 0 : 0.5),
            styledMode = renderer.styledMode;
        let connectorLength = rtl || labelsAlign === 'left' ?
            -connectorDistance : connectorDistance;

        // Set options for centered labels
        if (labelsAlign === 'center') {
            connectorLength = 0; // Do not use connector
            options.connectorDistance = 0;
            (range.labelAttribs as any).align = 'center';
        }

        // Render bubble symbol
        symbols.bubbleItems.push(
            renderer
                .circle(
                    posX,
                    (elementCenter as any) + crispMovement,
                    absoluteRadius
                )
                .attr(
                    styledMode ? {} : range.bubbleAttribs
                )
                .addClass(
                    (
                        styledMode ?
                            'highcharts-color-' +
                                bubbleSeries.colorIndex + ' ' :
                            ''
                    ) +
                    'highcharts-bubble-legend-symbol ' +
                    (options.className || '')
                ).add(
                    this.legendItem.symbol
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
                    (styledMode ? {} : range.connectorAttribs)
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
                    this.legendItem.symbol
                )
        );

        // Render label
        const label = renderer
            .text(this.formatLabel(range))
            .attr(
                (styledMode ? {} : range.labelAttribs)
            )
            .css(styledMode ? {} : (labelsOptions as any).style)
            .addClass(
                'highcharts-bubble-legend-labels ' +
                ((options.labels as any).className || '')
            ).add(
                this.legendItem.symbol
            );

        // Now that the label is added we can read the bounding box and
        // vertically align
        const position = {
            x: posX + connectorLength + (options.labels as any).x,
            y: posY + (options.labels as any).y + label.getBBox().height * 0.4
        };

        label.attr(position);

        labels.push(label);
        // To enable default 'hideOverlappingLabels' method
        label.placed = true;
        label.alignAttr = position;
    }

    /**
     * Get the label which takes up the most space.
     * @internal
     */
    public getMaxLabelSize(): BBoxObject {
        const labels = this.symbols.labels;
        let maxLabel: (BBoxObject|undefined),
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
     * @internal
     *
     * @param {Highcharts.LegendBubbleLegendRangesOptions} range
     *        Range options
     *
     * @return {string}
     *         Range label text
     */
    public formatLabel(range: BubbleLegendItem.RangesOptions): string {
        const options = this.options,
            formatter = (options.labels as any).formatter,
            format = (options.labels as any).format;
        const { numberFormatter } = this.chart;

        return format ? F.format(format, range, this.chart) :
            formatter ? formatter.call(range, range) :
                numberFormatter(range.value, 1);
    }

    /**
     * By using default chart 'hideOverlappingLabels' method, hide or show
     * labels and connectors.
     * @internal
     */
    public hideOverlappingLabels(): void {
        const chart = this.chart,
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
     * @internal
     *
     * @return {Array<Highcharts.LegendBubbleLegendRangesOptions>}
     *         Array of range objects
     */
    public getRanges(): Array<BubbleLegendItem.RangesOptions> {
        const bubbleLegend = this.legend.bubbleLegend,
            series = (bubbleLegend as any).chart.series,
            rangesOptions = (bubbleLegend as any).options.ranges;
        let ranges: Array<BubbleLegendItem.RangesOptions>,
            zData,
            minZ = Number.MAX_VALUE,
            maxZ = -Number.MAX_VALUE;

        series.forEach(function (s: BubbleSeries): void {
            // Find the min and max Z, like in bubble series
            if (s.isBubble && !s.ignoreSeries) {
                zData = s.getColumn('z').filter(isNumber);

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
            range: BubbleLegendItem.RangesOptions,
            i: number
        ): void {
            if (rangesOptions && rangesOptions[i]) {
                ranges[i] = merge(rangesOptions[i], range);
            }
        });

        return ranges;
    }

    /**
     * Calculate bubble legend sizes from rendered series.
     *
     * @internal
     *
     * @return {Array<number,number>}
     *         Calculated min and max bubble sizes
     */
    public predictBubbleSizes(): [number, number] {
        const chart = this.chart,
            legendOptions = chart.legend.options,
            floating = legendOptions.floating,
            horizontal = legendOptions.layout === 'horizontal',
            lastLineHeight = horizontal ? chart.legend.lastLineHeight : 0,
            plotSizeX = chart.plotSizeX,
            plotSizeY = chart.plotSizeY,
            bubbleSeries: BubbleSeries = chart.series[
                this.options.seriesIndex as any
            ] as any,
            pxSizes = bubbleSeries.getPxExtremes(),
            minSize = Math.ceil(pxSizes.minPxSize),
            maxPxSize = Math.ceil(pxSizes.maxPxSize),
            plotSize = Math.min(plotSizeY as any, plotSizeX as any);
        let calculatedSize,
            maxSize = bubbleSeries.options.maxSize;

        // Calculate predicted max size of bubble
        if (floating || !(/%$/.test(maxSize as any))) {
            calculatedSize = maxPxSize;

        } else {
            maxSize = parseFloat(maxSize as any);

            calculatedSize = ((plotSize + lastLineHeight) * maxSize / 100) /
                (maxSize / 100 + 1);

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
     * @internal
     */
    public updateRanges(min: number, max: number): void {
        const bubbleLegendOptions = this.legend.options.bubbleLegend;

        (bubbleLegendOptions as any).minSize = min;
        (bubbleLegendOptions as any).maxSize = max;
        (bubbleLegendOptions as any).ranges = this.getRanges();
    }

    /**
     * Because of the possibility of creating another legend line, predicted
     * bubble legend sizes may differ by a few pixels, so it is necessary to
     * correct them.
     * @internal
     */
    public correctSizes(): void {
        const legend = this.legend,
            chart = this.chart,
            bubbleSeries: BubbleSeries = chart.series[
                this.options.seriesIndex as any
            ] as any,
            pxSizes = bubbleSeries.getPxExtremes(),
            bubbleSeriesSize = pxSizes.maxPxSize,
            bubbleLegendSize = this.options.maxSize;

        if (
            Math.abs(Math.ceil(bubbleSeriesSize) - (bubbleLegendSize as any)) >
            1
        ) {
            this.updateRanges(
                this.options.minSize as any,
                pxSizes.maxPxSize
            );
            legend.render();
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface BubbleLegendItem extends LegendItem {
    legendItem: LegendItemObject;
}

/* *
 *
 * Class Namespace
 *
 * */

namespace BubbleLegendItem {
    export interface FormatterContextObject {
        center: number;
        radius: (number|null);
        value: number;
    }
    export interface LabelsOptions {
        /**
         * The alignment of the labels compared to the bubble
         * legend. Can be one of `left`, `center` or `right`.
         *
         * @sample highcharts/bubble-legend/connectorandlabels/
         *         Labels on left
         *
         * @type {Highcharts.AlignValue}
         */
        align?: AlignValue;
        /**
         * Whether to allow data labels to overlap.
         */
        allowOverlap?: boolean;
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
        className?: string;
        /**
         * A format string for the bubble legend labels. Available
         * variables are the same as for `formatter`.
         *
         * @sample highcharts/bubble-legend/format/
         *         Add a unit
         *
         * @type {string}
         */
        format?: string;
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
        formatter?: Templating.FormatterCallback<FormatterContextObject>;
        /**
         * CSS styles for the labels.
         *
         * @type {Highcharts.CSSObject}
         */
        style?: CSSObject;
        /**
         * The x position offset of the label relative to the
         * connector.
         */
        x?: number;
        /**
         * The y position offset of the label relative to the
         * connector.
         */
        y?: number;
    }
    /**
     * Options for `legend.bubbleLegend`. Member doclets mirror
     * `BubbleLegendDefaults` for API parity (`@optionparent` stays on
     * the defaults object).
     */
    export interface Options {
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
        borderColor?: ColorType;
        /**
         * The width of the ranges borders in pixels, can be also
         * defined for an individual range.
         */
        borderWidth?: number;
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
        className?: string;
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
        color?: ColorType;
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
        connectorClassName?: string;
        /**
         * The color of the connector, can be also defined
         * for an individual range.
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        connectorColor?: ColorType;
        /**
         * The length of the connectors in pixels. If labels are
         * centered, the distance is reduced to 0.
         *
         * @sample highcharts/bubble-legend/connectorandlabels/
         *         Increased connector length
         */
        connectorDistance?: number;
        /**
         * The width of the connectors in pixels.
         *
         * @sample highcharts/bubble-legend/connectorandlabels/
         *         Increased connector width
         */
        connectorWidth?: number;
        /**
         * Enable or disable the bubble legend.
         */
        enabled?: boolean;
        /**
         * Options for the bubble legend labels.
         */
        labels?: LabelsOptions;
        /**
         * The position of the bubble legend in the legend.
         * @sample highcharts/bubble-legend/connectorandlabels/
         *         Bubble legend as last item in legend
         */
        legendIndex?: number;
        /**
         * Maximum bubble legend range size. If values for ranges are
         * not specified, the `minSize` and the `maxSize` are calculated
         * from bubble series.
         */
        maxSize?: number;
        /**
         * Minimum bubble legend range size. If values for ranges are
         * not specified, the `minSize` and the `maxSize` are calculated
         * from bubble series.
         */
        minSize?: number;
        /** @internal */
        placed?: boolean;
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
        ranges?: Array<RangesOptions>;
        /** @internal */
        seriesIndex?: number;
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
        sizeBy?: BubbleSizeByValue;
        /**
         * When this is true, the absolute value of z determines the
         * size of the bubble. This means that with the default
         * zThreshold of 0, a bubble of value -1 will have the same size
         * as a bubble of value 1, while a bubble of value 0 will have a
         * smaller size according to minSize.
         */
        sizeByAbsoluteValue?: boolean;
        /**
         * Define the visual z index of the bubble legend.
         */
        zIndex?: number;
        /**
         * Ranges with lower value than zThreshold are skipped.
         */
        zThreshold?: number;
    }
    export interface RangesOptions extends Partial<FormatterContextObject> {
        autoRanges?: boolean;
        /**
         * The color of the border for individual range.
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        borderColor?: ColorType;
        /**
         * The color of the bubble for individual range.
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        color?: ColorType;
        /**
         * The color of the connector for individual range.
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        connectorColor?: ColorType;
        bubbleAttribs?: SVGAttributes;
        connectorAttribs?: SVGAttributes;
        labelAttribs?: SVGAttributes;
        /**
         * Range size value, similar to bubble Z data.
         * @type {number}
         */
        value?: any;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default BubbleLegendItem;

/* *
 *
 *  API Declarations
 *
 * */

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

''; // Detach doclets above
