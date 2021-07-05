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
import type FontMetricsObject from '../../Core/Renderer/FontMetricsObject';
import type FormatUtilities from '../../Core/FormatUtilities';
import type Point from '../../Core/Series/Point';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Chart from '../../Core/Chart/Chart.js';
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import F from '../../Core/FormatUtilities.js';
import H from '../../Core/Globals.js';
const { noop } = H;
import Legend from '../../Core/Legend.js';
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
const {
    arrayMax,
    arrayMin,
    isNumber,
    merge,
    pick,
    stableSort
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/LegendLike' {
    interface LegendLike {
        bubbleLegend?: BubbleLegendItem;
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

declare module '../../Core/LegendOptions'{
    interface LegendOptions {
        bubbleLegend?: BubbleLegendItem.Options;
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

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * BubbleLegend class.
 *
 * @private
 * @class
 * @name Highcharts.BubbleLegend
 * @param {Highcharts.LegendBubbleLegendOptions} options
 * Options of BubbleLegendItem.
 *
 * @param {Highcharts.Legend} legend
 * Legend of item.
 */
class BubbleLegendItem {
    public constructor(
        options: BubbleLegendItem.Options,
        legend: Legend
    ) {
        this.init(options, legend);
    }

    public chart: Chart = void 0 as any;
    public fontMetrics: FontMetricsObject = void 0 as any;
    public legend: Legend = void 0 as any;
    public legendGroup: SVGElement = void 0 as any;
    public legendItem: SVGElement = void 0 as any;
    public legendItemHeight: number = void 0 as any;
    public legendItemWidth: number = void 0 as any;
    public legendSymbol: SVGElement = void 0 as any;
    public maxLabel: BBoxObject = void 0 as any;
    public movementX: number = void 0 as any;
    public ranges: Array<BubbleLegendItem.RangesOptions> = void 0 as any;
    public selected: undefined = void 0 as any;
    public visible: boolean = void 0 as any;
    public symbols: Record<string, Array<SVGElement>>= void 0 as any;
    public options: BubbleLegendItem.Options = void 0 as any;


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
    public drawLegendSymbol(legend: Legend): void {
        const chart = this.chart,
            options = this.options,
            itemDistance = pick(legend.options.itemDistance, 20),
            ranges =
                options.ranges as Array<BubbleLegendItem.RangesOptions>,
            connectorDistance = options.connectorDistance;
        let connectorSpace;

        // Predict label dimensions
        this.fontMetrics = chart.renderer.fontMetrics(
            (options.labels as any).style.fontSize
        );

        // Do not create bubbleLegend now if ranges or ranges valeus are not
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
            range: BubbleLegendItem.RangesOptions,
            i: number
        ): void {
            if (!styledMode) {
                bubbleAttribs.stroke = pick(
                    range.borderColor,
                    options.borderColor,
                    series.color
                );
                bubbleAttribs.fill = pick(
                    range.color,
                    options.color,
                    fillOpacity !== 1 ?
                        color(series.color).setOpacity(fillOpacity)
                            .get('rgba') :
                        series.color
                );
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
     * @private
     * @function Highcharts.BubbleLegend#getRangeRadius
     * @param {number} value
     *        Range value
     * @return {number|null}
     *         Radius for one range
     */
    public getRangeRadius(value: number): (number|null) {
        const options = this.options,
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
        const renderer = this.chart.renderer,
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
            range: BubbleLegendItem.RangesOptions
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
    public renderRange(range: BubbleLegendItem.RangesOptions): void {
        const mainRange = this.ranges[0],
            legend = this.legend,
            options = this.options,
            labelsOptions = options.labels as any,
            chart = this.chart,
            bubbleSeries: BubbleSeries = chart.series[options.seriesIndex as any] as any,
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
            fontMetrics = this.fontMetrics,
            labelMovement = fontMetrics.f / 2 -
                (fontMetrics.h - fontMetrics.f) / 2,
            crispMovement = (posY % 1 ? 1 : 0.5) -
                ((connectorWidth as any) % 2 ? 0 : 0.5),
            styledMode = renderer.styledMode;
        let connectorLength = rtl || labelsAlign === 'left' ?
            -connectorDistance : connectorDistance;

        // Set options for centered labels
        if (labelsAlign === 'center') {
            connectorLength = 0; // do not use connector
            options.connectorDistance = 0;
            (range.labelAttribs as any).align = 'center';
        }

        const labelY = posY + (options.labels as any).y,
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
                    this.legendSymbol
                )
        );

        // Render label
        const label = renderer
            .text(
                this.formatLabel(range),
                labelX,
                labelY + labelMovement
            )
            .attr(
                (styledMode ? {} : range.labelAttribs)
            )
            .css(styledMode ? {} : (labelsOptions as any).style)
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
     * @private
     * @function Highcharts.BubbleLegend#formatLabel
     * @param {Highcharts.LegendBubbleLegendRangesOptions} range
     *        Range options
     * @return {string}
     *         Range label text
     */
    public formatLabel(range: BubbleLegendItem.RangesOptions): string {
        const options = this.options,
            formatter = (options.labels as any).formatter,
            format = (options.labels as any).format;
        const { numberFormatter } = this.chart;

        return format ? F.format(format, range) :
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
     * @private
     * @function Highcharts.BubbleLegend#getRanges
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
     * @private
     * @function Highcharts.BubbleLegend#predictBubbleSizes
     * @return {Array<number,number>}
     *         Calculated min and max bubble sizes
     */
    public predictBubbleSizes(): [number, number] {
        const chart = this.chart,
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
            plotSize = Math.min(plotSizeY as any, plotSizeX as any);
        let calculatedSize,
            maxSize = bubbleSeries.options.maxSize;

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
        const bubbleLegendOptions = this.legend.options.bubbleLegend;

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
        const legend = this.legend,
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

/* *
 *
 *  Class Prototype
 *
 * */

interface BubbleLegendItem extends Highcharts.LegendItemObject {
    // nothing more to add
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
        align?: AlignValue;
        allowOverlap?: boolean;
        className?: string;
        format?: string;
        formatter?: (
            FormatUtilities.FormatterCallback<FormatterContextObject>
        );
        style?: CSSObject;
        x?: number;
        y?: number;
    }
    export interface Options {
        borderColor?: ColorType;
        borderWidth?: number;
        className?: string;
        color?: ColorType;
        connectorClassName?: string;
        connectorColor?: ColorType;
        connectorDistance?: number;
        connectorWidth?: number;
        enabled?: boolean;
        labels?: LabelsOptions;
        legendIndex?: number;
        maxSize?: number;
        minSize?: number;
        placed?: boolean;
        ranges?: Array<RangesOptions>;
        seriesIndex?: number;
        sizeBy?: BubbleSizeByValue;
        sizeByAbsoluteValue?: boolean;
        zIndex?: number;
        zThreshold?: number;
    }
    export interface RangesOptions
        extends Partial<FormatterContextObject>
    {
        autoRanges?: boolean;
        borderColor?: ColorType;
        color?: ColorType;
        connectorColor?: ColorType;
        bubbleAttribs?: SVGAttributes;
        connectorAttribs?: SVGAttributes;
        labelAttribs?: SVGAttributes;
        value?: any;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default BubbleLegendItem;
