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
import Chart from '../../Core/Chart/Chart.js';
import Color from '../../Core/Color/Color.js';
var color = Color.parse;
import H from '../../Core/Globals.js';
var noop = H.noop;
import Legend from '../../Core/Legend.js';
import palette from '../../Core/Color/Palette.js';
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, arrayMax = U.arrayMax, arrayMin = U.arrayMin, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach, pick = U.pick, setOptions = U.setOptions, stableSort = U.stableSort, wrap = U.wrap;
/**
 * @interface Highcharts.BubbleLegendFormatterContextObject
 */ /**
* The center y position of the range.
* @name Highcharts.BubbleLegendFormatterContextObject#center
* @type {number}
*/ /**
* The radius of the bubble range.
* @name Highcharts.BubbleLegendFormatterContextObject#radius
* @type {number}
*/ /**
* The bubble value.
* @name Highcharts.BubbleLegendFormatterContextObject#value
* @type {number}
*/
''; // detach doclets above
import './BubbleSeries.js';
setOptions({
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
            maxSize: 60,
            /**
             * Minimum bubble legend range size. If values for ranges are
             * not specified, the `minSize` and the `maxSize` are calculated
             * from bubble series.
             */
            minSize: 10,
            /**
             * The position of the bubble legend in the legend.
             * @sample highcharts/bubble-legend/connectorandlabels/
             *         Bubble legend as last item in legend
             */
            legendIndex: 0,
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
            },
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
var BubbleLegend = /** @class */ (function () {
    function BubbleLegend(options, legend) {
        this.chart = void 0;
        this.fontMetrics = void 0;
        this.legend = void 0;
        this.legendGroup = void 0;
        this.legendItem = void 0;
        this.legendItemHeight = void 0;
        this.legendItemWidth = void 0;
        this.legendSymbol = void 0;
        this.maxLabel = void 0;
        this.movementX = void 0;
        this.ranges = void 0;
        this.visible = void 0;
        this.symbols = void 0;
        this.options = void 0;
        this.setState = noop;
        this.init(options, legend);
    }
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
    BubbleLegend.prototype.init = function (options, legend) {
        this.options = options;
        this.visible = true;
        this.chart = legend.chart;
        this.legend = legend;
    };
    /**
     * Depending on the position option, add bubbleLegend to legend items.
     *
     * @private
     * @function Highcharts.BubbleLegend#addToLegend
     * @param {Array<(Highcharts.Point|Highcharts.Series)>}
     *        All legend items
     * @return {void}
     */
    BubbleLegend.prototype.addToLegend = function (items) {
        // Insert bubbleLegend into legend items
        items.splice(this.options.legendIndex, 0, this);
    };
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
    BubbleLegend.prototype.drawLegendSymbol = function (legend) {
        var chart = this.chart, options = this.options, size, itemDistance = pick(legend.options.itemDistance, 20), connectorSpace, ranges = options.ranges, radius, maxLabel, connectorDistance = options.connectorDistance;
        // Predict label dimensions
        this.fontMetrics = chart.renderer.fontMetrics(options.labels.style.fontSize.toString() + 'px');
        // Do not create bubbleLegend now if ranges or ranges valeus are not
        // specified or if are empty array.
        if (!ranges || !ranges.length || !isNumber(ranges[0].value)) {
            legend.options.bubbleLegend.autoRanges = true;
            return;
        }
        // Sort ranges to right render order
        stableSort(ranges, function (a, b) {
            return b.value - a.value;
        });
        this.ranges = ranges;
        this.setOptions();
        this.render();
        // Get max label size
        maxLabel = this.getMaxLabelSize();
        radius = this.ranges[0].radius;
        size = radius * 2;
        // Space for connectors and labels.
        connectorSpace =
            connectorDistance - radius + maxLabel.width;
        connectorSpace = connectorSpace > 0 ? connectorSpace : 0;
        this.maxLabel = maxLabel;
        this.movementX = options.labels.align === 'left' ?
            connectorSpace : 0;
        this.legendItemWidth = size + connectorSpace + itemDistance;
        this.legendItemHeight = size + this.fontMetrics.h / 2;
    };
    /**
     * Set style options for each bubbleLegend range.
     *
     * @private
     * @function Highcharts.BubbleLegend#setOptions
     * @return {void}
     */
    BubbleLegend.prototype.setOptions = function () {
        var ranges = this.ranges, options = this.options, series = this.chart.series[options.seriesIndex], baseline = this.legend.baseline, bubbleStyle = {
            'z-index': options.zIndex,
            'stroke-width': options.borderWidth
        }, connectorStyle = {
            'z-index': options.zIndex,
            'stroke-width': options.connectorWidth
        }, labelStyle = this.getLabelStyles(), fillOpacity = series.options.marker.fillOpacity, styledMode = this.chart.styledMode;
        // Allow to parts of styles be used individually for range
        ranges.forEach(function (range, i) {
            if (!styledMode) {
                bubbleStyle.stroke = pick(range.borderColor, options.borderColor, series.color);
                bubbleStyle.fill = pick(range.color, options.color, fillOpacity !== 1 ?
                    color(series.color).setOpacity(fillOpacity)
                        .get('rgba') :
                    series.color);
                connectorStyle.stroke = pick(range.connectorColor, options.connectorColor, series.color);
            }
            // Set options needed for rendering each range
            ranges[i].radius = this.getRangeRadius(range.value);
            ranges[i] = merge(ranges[i], {
                center: (ranges[0].radius - ranges[i].radius +
                    baseline)
            });
            if (!styledMode) {
                merge(true, ranges[i], {
                    bubbleStyle: merge(false, bubbleStyle),
                    connectorStyle: merge(false, connectorStyle),
                    labelStyle: labelStyle
                });
            }
        }, this);
    };
    /**
     * Merge options for bubbleLegend labels.
     *
     * @private
     * @function Highcharts.BubbleLegend#getLabelStyles
     * @return {Highcharts.CSSObject}
     */
    BubbleLegend.prototype.getLabelStyles = function () {
        var options = this.options, additionalLabelsStyle = {}, labelsOnLeft = options.labels.align === 'left', rtl = this.legend.options.rtl;
        // To separate additional style options
        objectEach(options.labels.style, function (value, key) {
            if (key !== 'color' &&
                key !== 'fontSize' &&
                key !== 'z-index') {
                additionalLabelsStyle[key] = value;
            }
        });
        return merge(false, additionalLabelsStyle, {
            'font-size': options.labels.style.fontSize,
            fill: pick(options.labels.style.color, palette.neutralColor100),
            'z-index': options.zIndex,
            align: rtl || labelsOnLeft ? 'right' : 'left'
        });
    };
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
    BubbleLegend.prototype.getRangeRadius = function (value) {
        var options = this.options, seriesIndex = this.options.seriesIndex, bubbleSeries = this.chart.series[seriesIndex], zMax = options.ranges[0].value, zMin = options.ranges[options.ranges.length - 1].value, minSize = options.minSize, maxSize = options.maxSize;
        return bubbleSeries.getRadius.call(this, zMin, zMax, minSize, maxSize, value);
    };
    /**
     * Render the legendSymbol group.
     *
     * @private
     * @function Highcharts.BubbleLegend#render
     * @return {void}
     */
    BubbleLegend.prototype.render = function () {
        var renderer = this.chart.renderer, zThreshold = this.options.zThreshold;
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
        this.ranges.forEach(function (range) {
            if (range.value >= zThreshold) {
                this.renderRange(range);
            }
        }, this);
        // To use handleOverflow method
        this.legendSymbol.add(this.legendItem);
        this.legendItem.add(this.legendGroup);
        this.hideOverlappingLabels();
    };
    /**
     * Render one range, consisting of bubble symbol, connector and label.
     *
     * @private
     * @function Highcharts.BubbleLegend#renderRange
     * @param {Highcharts.LegendBubbleLegendRangesOptions} range
     *        Range options
     * @return {void}
     */
    BubbleLegend.prototype.renderRange = function (range) {
        var mainRange = this.ranges[0], legend = this.legend, options = this.options, labelsOptions = options.labels, chart = this.chart, renderer = chart.renderer, symbols = this.symbols, labels = symbols.labels, label, elementCenter = range.center, absoluteRadius = Math.abs(range.radius), connectorDistance = options.connectorDistance || 0, labelsAlign = labelsOptions.align, rtl = legend.options.rtl, fontSize = labelsOptions.style.fontSize, connectorLength = rtl || labelsAlign === 'left' ?
            -connectorDistance : connectorDistance, borderWidth = options.borderWidth, connectorWidth = options.connectorWidth, posX = mainRange.radius || 0, posY = elementCenter - absoluteRadius -
            borderWidth / 2 + connectorWidth / 2, labelY, labelX, fontMetrics = this.fontMetrics, labelMovement = fontSize / 2 - (fontMetrics.h - fontSize) / 2, crispMovement = (posY % 1 ? 1 : 0.5) -
            (connectorWidth % 2 ? 0 : 0.5), styledMode = renderer.styledMode;
        // Set options for centered labels
        if (labelsAlign === 'center') {
            connectorLength = 0; // do not use connector
            options.connectorDistance = 0;
            range.labelStyle.align = 'center';
        }
        labelY = posY + options.labels.y;
        labelX = posX + connectorLength + options.labels.x;
        // Render bubble symbol
        symbols.bubbleItems.push(renderer
            .circle(posX, elementCenter + crispMovement, absoluteRadius)
            .attr(styledMode ? {} : range.bubbleStyle)
            .addClass((styledMode ?
            'highcharts-color-' +
                this.options.seriesIndex + ' ' :
            '') +
            'highcharts-bubble-legend-symbol ' +
            (options.className || '')).add(this.legendSymbol));
        // Render connector
        symbols.connectors.push(renderer
            .path(renderer.crispLine([
            ['M', posX, posY],
            ['L', posX + connectorLength, posY]
        ], options.connectorWidth))
            .attr(styledMode ? {} : range.connectorStyle)
            .addClass((styledMode ?
            'highcharts-color-' +
                this.options.seriesIndex + ' ' : '') +
            'highcharts-bubble-legend-connectors ' +
            (options.connectorClassName || '')).add(this.legendSymbol));
        // Render label
        label = renderer
            .text(this.formatLabel(range), labelX, labelY + labelMovement)
            .attr(styledMode ? {} : range.labelStyle)
            .addClass('highcharts-bubble-legend-labels ' +
            (options.labels.className || '')).add(this.legendSymbol);
        labels.push(label);
        // To enable default 'hideOverlappingLabels' method
        label.placed = true;
        label.alignAttr = {
            x: labelX,
            y: labelY + labelMovement
        };
    };
    /**
     * Get the label which takes up the most space.
     *
     * @private
     * @function Highcharts.BubbleLegend#getMaxLabelSize
     * @return {Highcharts.BBoxObject}
     */
    BubbleLegend.prototype.getMaxLabelSize = function () {
        var labels = this.symbols.labels, maxLabel, labelSize;
        labels.forEach(function (label) {
            labelSize = label.getBBox(true);
            if (maxLabel) {
                maxLabel = labelSize.width > maxLabel.width ?
                    labelSize : maxLabel;
            }
            else {
                maxLabel = labelSize;
            }
        });
        return maxLabel || {};
    };
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
    BubbleLegend.prototype.formatLabel = function (range) {
        var options = this.options, formatter = options.labels.formatter, format = options.labels.format;
        var numberFormatter = this.chart.numberFormatter;
        return format ? U.format(format, range) :
            formatter ? formatter.call(range) :
                numberFormatter(range.value, 1);
    };
    /**
     * By using default chart 'hideOverlappingLabels' method, hide or show
     * labels and connectors.
     *
     * @private
     * @function Highcharts.BubbleLegend#hideOverlappingLabels
     * @return {void}
     */
    BubbleLegend.prototype.hideOverlappingLabels = function () {
        var chart = this.chart, allowOverlap = this.options.labels.allowOverlap, symbols = this.symbols;
        if (!allowOverlap && symbols) {
            chart.hideOverlappingLabels(symbols.labels);
            // Hide or show connectors
            symbols.labels.forEach(function (label, index) {
                if (!label.newOpacity) {
                    symbols.connectors[index].hide();
                }
                else if (label.newOpacity !== label.oldOpacity) {
                    symbols.connectors[index].show();
                }
            });
        }
    };
    /**
     * Calculate ranges from created series.
     *
     * @private
     * @function Highcharts.BubbleLegend#getRanges
     * @return {Array<Highcharts.LegendBubbleLegendRangesOptions>}
     *         Array of range objects
     */
    BubbleLegend.prototype.getRanges = function () {
        var bubbleLegend = this.legend.bubbleLegend, series = bubbleLegend.chart.series, ranges, rangesOptions = bubbleLegend.options.ranges, zData, minZ = Number.MAX_VALUE, maxZ = -Number.MAX_VALUE;
        series.forEach(function (s) {
            // Find the min and max Z, like in bubble series
            if (s.isBubble && !s.ignoreSeries) {
                zData = s.zData.filter(isNumber);
                if (zData.length) {
                    minZ = pick(s.options.zMin, Math.min(minZ, Math.max(arrayMin(zData), s.options.displayNegative === false ?
                        s.options.zThreshold :
                        -Number.MAX_VALUE)));
                    maxZ = pick(s.options.zMax, Math.max(maxZ, arrayMax(zData)));
                }
            }
        });
        // Set values for ranges
        if (minZ === maxZ) {
            // Only one range if min and max values are the same.
            ranges = [{ value: maxZ }];
        }
        else {
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
        ranges.forEach(function (range, i) {
            if (rangesOptions && rangesOptions[i]) {
                ranges[i] = merge(false, rangesOptions[i], range);
            }
        });
        return ranges;
    };
    /**
     * Calculate bubble legend sizes from rendered series.
     *
     * @private
     * @function Highcharts.BubbleLegend#predictBubbleSizes
     * @return {Array<number,number>}
     *         Calculated min and max bubble sizes
     */
    BubbleLegend.prototype.predictBubbleSizes = function () {
        var chart = this.chart, fontMetrics = this.fontMetrics, legendOptions = chart.legend.options, floating = legendOptions.floating, horizontal = legendOptions.layout === 'horizontal', lastLineHeight = horizontal ? chart.legend.lastLineHeight : 0, plotSizeX = chart.plotSizeX, plotSizeY = chart.plotSizeY, bubbleSeries = chart.series[this.options.seriesIndex], minSize = Math.ceil(bubbleSeries.minPxSize), maxPxSize = Math.ceil(bubbleSeries.maxPxSize), maxSize = bubbleSeries.options.maxSize, plotSize = Math.min(plotSizeY, plotSizeX), calculatedSize;
        // Calculate prediceted max size of bubble
        if (floating || !(/%$/.test(maxSize))) {
            calculatedSize = maxPxSize;
        }
        else {
            maxSize = parseFloat(maxSize);
            calculatedSize = ((plotSize + lastLineHeight -
                fontMetrics.h / 2) * maxSize / 100) / (maxSize / 100 + 1);
            // Get maxPxSize from bubble series if calculated bubble legend
            // size will not affect to bubbles series.
            if ((horizontal && plotSizeY - calculatedSize >=
                plotSizeX) || (!horizontal && plotSizeX -
                calculatedSize >= plotSizeY)) {
                calculatedSize = maxPxSize;
            }
        }
        return [minSize, Math.ceil(calculatedSize)];
    };
    /**
     * Correct ranges with calculated sizes.
     *
     * @private
     * @function Highcharts.BubbleLegend#updateRanges
     * @param {number} min
     * @param {number} max
     * @return {void}
     */
    BubbleLegend.prototype.updateRanges = function (min, max) {
        var bubbleLegendOptions = this.legend.options.bubbleLegend;
        bubbleLegendOptions.minSize = min;
        bubbleLegendOptions.maxSize = max;
        bubbleLegendOptions.ranges = this.getRanges();
    };
    /**
     * Because of the possibility of creating another legend line, predicted
     * bubble legend sizes may differ by a few pixels, so it is necessary to
     * correct them.
     *
     * @private
     * @function Highcharts.BubbleLegend#correctSizes
     * @return {void}
     */
    BubbleLegend.prototype.correctSizes = function () {
        var legend = this.legend, chart = this.chart, bubbleSeries = chart.series[this.options.seriesIndex], bubbleSeriesSize = bubbleSeries.maxPxSize, bubbleLegendSize = this.options.maxSize;
        if (Math.abs(Math.ceil(bubbleSeriesSize) - bubbleLegendSize) >
            1) {
            this.updateRanges(this.options.minSize, bubbleSeries.maxPxSize);
            legend.render();
        }
    };
    return BubbleLegend;
}());
// Start the bubble legend creation process.
addEvent(Legend, 'afterGetAllItems', function (e) {
    var legend = this, bubbleLegend = legend.bubbleLegend, legendOptions = legend.options, options = legendOptions.bubbleLegend, bubbleSeriesIndex = legend.chart.getVisibleBubbleSeriesIndex();
    // Remove unnecessary element
    if (bubbleLegend && bubbleLegend.ranges && bubbleLegend.ranges.length) {
        // Allow change the way of calculating ranges in update
        if (options.ranges.length) {
            options.autoRanges =
                !!options.ranges[0].autoRanges;
        }
        // Update bubbleLegend dimensions in each redraw
        legend.destroyItem(bubbleLegend);
    }
    // Create bubble legend
    if (bubbleSeriesIndex >= 0 &&
        legendOptions.enabled &&
        options.enabled) {
        options.seriesIndex = bubbleSeriesIndex;
        legend.bubbleLegend = new H.BubbleLegend(options, legend);
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
Chart.prototype.getVisibleBubbleSeriesIndex = function () {
    var series = this.series, i = 0;
    while (i < series.length) {
        if (series[i] &&
            series[i].isBubble &&
            series[i].visible &&
            series[i].zData.length) {
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
Legend.prototype.getLinesHeights = function () {
    var items = this.allItems, lines = [], lastLine, length = items.length, i = 0, j = 0;
    for (i = 0; i < length; i++) {
        if (items[i].legendItemHeight) {
            // for bubbleLegend
            items[i].itemHeight = items[i].legendItemHeight;
        }
        if ( // Line break
        items[i] === items[length - 1] ||
            items[i + 1] &&
                items[i]._legendItemPos[1] !==
                    items[i + 1]._legendItemPos[1]) {
            lines.push({ height: 0 });
            lastLine = lines[lines.length - 1];
            // Find the highest item in line
            for (j; j <= i; j++) {
                if (items[j].itemHeight > lastLine.height) {
                    lastLine.height = items[j].itemHeight;
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
Legend.prototype.retranslateItems = function (lines) {
    var items = this.allItems, orgTranslateX, orgTranslateY, movementX, rtl = this.options.rtl, actualLine = 0;
    items.forEach(function (item, index) {
        orgTranslateX = item.legendGroup.translateX;
        orgTranslateY = item._legendItemPos[1];
        movementX = item.movementX;
        if (movementX || (rtl && item.ranges)) {
            movementX = rtl ?
                orgTranslateX - item.options.maxSize / 2 :
                orgTranslateX + movementX;
            item.legendGroup.attr({ translateX: movementX });
        }
        if (index > lines[actualLine].step) {
            actualLine++;
        }
        item.legendGroup.attr({
            translateY: Math.round(orgTranslateY + lines[actualLine].height / 2)
        });
        item._legendItemPos[1] = orgTranslateY +
            lines[actualLine].height / 2;
    });
};
// Toggle bubble legend depending on the visible status of bubble series.
addEvent(Series, 'legendItemClick', function () {
    var series = this, chart = series.chart, visible = series.visible, legend = series.chart.legend, status;
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
wrap(Chart.prototype, 'drawChartBox', function (proceed, options, callback) {
    var chart = this, legend = chart.legend, bubbleSeries = chart.getVisibleBubbleSeriesIndex() >= 0, bubbleLegendOptions, bubbleSizes;
    if (legend && legend.options.enabled && legend.bubbleLegend &&
        legend.options.bubbleLegend.autoRanges && bubbleSeries) {
        bubbleLegendOptions = legend.bubbleLegend.options;
        bubbleSizes = legend.bubbleLegend.predictBubbleSizes();
        legend.bubbleLegend.updateRanges(bubbleSizes[0], bubbleSizes[1]);
        // Disable animation on init
        if (!bubbleLegendOptions.placed) {
            legend.group.placed = false;
            legend.allItems.forEach(function (item) {
                item.legendGroup.translateY = null;
            });
        }
        // Create legend with bubbleLegend
        legend.render();
        chart.getMargins();
        chart.axes.forEach(function (axis) {
            if (axis.visible) { // #11448
                axis.render();
            }
            if (!bubbleLegendOptions.placed) {
                axis.setScale();
                axis.updateNames();
                // Disable axis animation on init
                objectEach(axis.ticks, function (tick) {
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
    }
    else {
        proceed.call(chart, options, callback);
        // Allow color change on static bubble legend after click on legend
        if (legend && legend.options.enabled && legend.bubbleLegend) {
            legend.render();
            legend.retranslateItems(legend.getLinesHeights());
        }
    }
});
H.BubbleLegend = BubbleLegend;
export default H.BubbleLegend;
