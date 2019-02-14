/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Chart.js';
import '../parts/Color.js';
import '../parts/Legend.js';

var addEvent = H.addEvent,
    Axis = H.Axis,
    Chart = H.Chart,
    color = H.color,
    ColorAxis,
    extend = H.extend,
    isNumber = H.isNumber,
    Legend = H.Legend,
    LegendSymbolMixin = H.LegendSymbolMixin,
    noop = H.noop,
    merge = H.merge,
    pick = H.pick;

/**
 * The ColorAxis object for inclusion in gradient legends.
 *
 * @private
 * @class
 * @name Highcharts.ColorAxis
 *
 * @augments Highcharts.Axis
 */
ColorAxis = H.ColorAxis = function () {
    this.init.apply(this, arguments);
};

extend(ColorAxis.prototype, Axis.prototype);

extend(ColorAxis.prototype, {

    /**
     * A color axis for choropleth maps and heat maps. Visually, the color
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
     * See [the Axis object](/class-reference/Highcharts.Axis) for
     * programmatic access to the axis.
     *
     * @extends      xAxis
     * @excluding    allowDecimals, alternateGridColor, breaks, categories,
     *               crosshair, dateTimeLabelFormats, lineWidth, linkedTo,
     *               maxZoom, minRange, minTickInterval, offset, opposite,
     *               plotBands, plotLines, showEmpty, title
     * @product      highcharts highmaps
     * @optionparent colorAxis
     */
    defaultColorAxisOptions: {

        /**
         * Whether to allow decimals on the color axis.
         * @type      {boolean}
         * @default   true
         * @product   highcharts highmaps
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
         * @product    highcharts highmaps
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
         * @product   highcharts highmaps
         * @apioption colorAxis.dataClasses
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
         * @product   highcharts highmaps
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
         * @product   highcharts highmaps
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
         * @product   highcharts highmaps
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
         * @product   highcharts highmaps
         * @apioption colorAxis.dataClasses.to
         */

        /** @ignore-option */
        lineWidth: 0,

        /**
         * Padding of the min value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer.
         *
         * @product highcharts highmaps
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
         * @product   highcharts highmaps
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
         * @product   highcharts highmaps
         * @apioption colorAxis.min
         */

        /**
         * Padding of the max value relative to the length of the axis. A
         * padding of 0.05 will make a 100px axis 5px longer.
         *
         * @product highcharts highmaps
         */
        maxPadding: 0,

        /**
         * Color of the grid lines extending from the axis across the
         * gradient.
         *
         * @sample {highmaps} maps/coloraxis/gridlines/
         *         Grid lines demonstrated
         *
         * @type      {Highcharts.ColorString}
         * @default   #e6e6e6
         * @product   highcharts highmaps
         * @apioption colorAxis.gridLineColor
         */

        /**
         * The width of the grid lines extending from the axis across the
         * gradient of a scalar color axis.
         *
         * @sample {highmaps} maps/coloraxis/gridlines/
         *         Grid lines demonstrated
         *
         * @product highcharts highmaps
         */
        gridLineWidth: 1,

        /**
         * The interval of the tick marks in axis units. When `null`, the
         * tick interval is computed to approximately follow the
         * `tickPixelInterval`.
         *
         * @type      {number}
         * @product   highcharts highmaps
         * @apioption colorAxis.tickInterval
         */

        /**
         * If [tickInterval](#colorAxis.tickInterval) is `null` this option
         * sets the approximate pixel interval of the tick marks.
         *
         * @product highcharts highmaps
         */
        tickPixelInterval: 72,

        /**
         * Whether to force the axis to start on a tick. Use this option
         * with the `maxPadding` option to control the axis start.
         *
         * @product highcharts highmaps
         */
        startOnTick: true,

        /**
         * Whether to force the axis to end on a tick. Use this option with
         * the [maxPadding](#colorAxis.maxPadding) option to control the
         * axis end.
         *
         * @product highcharts highmaps
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
         * @product highcharts highmaps
         */
        marker: {

            /**
             * Animation for the marker as it moves between values. Set to
             * `false` to disable animation. Defaults to `{ duration: 50 }`.
             *
             * @type    {boolean|Highcharts.AnimationOptionsObject}
             * @default {"duration": 50}
             * @product highcharts highmaps
             */
            animation: {
                /** @ignore */
                duration: 50
            },

            /** @ignore */
            width: 0.01,

            /**
             * The color of the marker.
             *
             * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @product highcharts highmaps
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
         * @product highcharts highmaps
         */
        labels: {

            /**
             * How to handle overflowing labels on horizontal color axis.
             * Can be undefined or "justify". If "justify", labels will not
             * render outside the legend area. If there is room to move it,
             * it will be aligned to the edge, else it will be removed.
             *
             * @validvalue ["allow", "justify"]
             * @product    highcharts highmaps
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
         * @type    {Highcharts.ColorString}
         * @product highcharts highmaps
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
         * @type    {Highcharts.ColorString}
         * @product highcharts highmaps
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
         * @product   highcharts highmaps
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
         * @type       {string}
         * @default    linear
         * @product    highcharts highmaps
         * @validvalue ["linear", "logarithmic"]
         * @apioption  colorAxis.type
         */

        /**
         * Whether to reverse the axis so that the highest number is closest
         * to the origin. Defaults to `false` in a horizontal legend and
         * `true` in a vertical legend, where the smallest value starts on
         * top.
         *
         * @type      {boolean}
         * @product   highcharts highmaps
         * @apioption colorAxis.reversed
         */

        /**
         * @product   highcharts highmaps
         * @excluding afterBreaks, pointBreak, pointInBreak
         * @apioption colorAxis.events
         */

        /**
         * Fires when the legend item belonging to the colorAxis is clicked.
         * One parameter, `event`, is passed to the function.
         *
         * @type      {Function}
         * @product   highcharts highmaps
         * @apioption colorAxis.events.legendItemClick
         */

        /**
         * Whether to display the colorAxis in the legend.
         *
         * @see [heatmap.showInLegend](#series.heatmap.showInLegend)
         *
         * @since   4.2.7
         * @product highcharts highmaps
         */
        showInLegend: true
    },

    // Properties to preserve after destroy, for Axis.update (#5881, #6025)
    keepProps: [
        'legendGroup',
        'legendItemHeight',
        'legendItemWidth',
        'legendItem',
        'legendSymbol'
    ].concat(Axis.prototype.keepProps),

    /**
     * Initialize the color axis
     *
     * @private
     * @function Highcharts.ColorAxis#init
     *
     * @param {Highcharts.Chart} chart
     *
     * @param {Highcharts.ColorAxisOptions} userOptions
     */
    init: function (chart, userOptions) {
        var horiz = chart.options.legend.layout !== 'vertical',
            options;

        this.coll = 'colorAxis';

        // Build the options
        options = merge(this.defaultColorAxisOptions, {
            side: horiz ? 2 : 1,
            reversed: !horiz
        }, userOptions, {
            opposite: !horiz,
            showEmpty: false,
            title: null,
            visible: chart.options.legend.enabled
        });

        Axis.prototype.init.call(this, chart, options);

        // Base init() pushes it to the xAxis array, now pop it again
        // chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();

        // Prepare data classes
        if (userOptions.dataClasses) {
            this.initDataClasses(userOptions);
        }
        this.initStops();

        // Override original axis properties
        this.horiz = horiz;
        this.zoomEnabled = false;

        // Add default values
        this.defaultLegendLength = 200;
    },

    initDataClasses: function (userOptions) {
        var chart = this.chart,
            dataClasses,
            colorCounter = 0,
            colorCount = chart.options.chart.colorCount,
            options = this.options,
            len = userOptions.dataClasses.length;

        this.dataClasses = dataClasses = [];
        this.legendItems = [];

        userOptions.dataClasses.forEach(function (dataClass, i) {
            var colors;

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
    },

    /**
     * Override so that ticks are not added in data class axes (#6914)
     *
     * @private
     * @function Highcharts.ColorAxis#setTickPositions
     */
    setTickPositions: function () {
        if (!this.dataClasses) {
            return Axis.prototype.setTickPositions.call(this);
        }
    },

    initStops: function () {
        this.stops = this.options.stops || [
            [0, this.options.minColor],
            [1, this.options.maxColor]
        ];
        this.stops.forEach(function (stop) {
            stop.color = color(stop[1]);
        });
    },

    /**
     * Extend the setOptions method to process extreme colors and color
     * stops.
     *
     * @private
     * @function Highcharts.ColorAxis#setOptions
     *
     * @param {Highcharts.ColorAxisOptions} userOptions
     */
    setOptions: function (userOptions) {
        Axis.prototype.setOptions.call(this, userOptions);

        this.options.crosshair = this.options.marker;
    },

    setAxisSize: function () {
        var symbol = this.legendSymbol,
            chart = this.chart,
            legendOptions = chart.options.legend || {},
            x,
            y,
            width,
            height;

        if (symbol) {
            this.left = x = symbol.attr('x');
            this.top = y = symbol.attr('y');
            this.width = width = symbol.attr('width');
            this.height = height = symbol.attr('height');
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
            ) || this.defaultLegendLength;
        }
    },

    normalizedValue: function (value) {
        if (this.isLog) {
            value = this.val2lin(value);
        }
        return 1 - ((this.max - value) / ((this.max - this.min) || 1));
    },

    /**
     * Translate from a value to a color.
     *
     * @private
     * @function Highcharts.ColorAxis#toColor
     *
     * @param {number} value
     *
     * @param {Highcharts.Point} point
     */
    toColor: function (value, point) {
        var pos,
            stops = this.stops,
            from,
            to,
            color,
            dataClasses = this.dataClasses,
            dataClass,
            i;

        if (dataClasses) {
            i = dataClasses.length;
            while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if (
                    (from === undefined || value >= from) &&
                    (to === undefined || value <= to)
                ) {

                    color = dataClass.color;

                    if (point) {
                        point.dataClass = i;
                        point.colorIndex = dataClass.colorIndex;
                    }
                    break;
                }
            }

        } else {

            pos = this.normalizedValue(value);
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

            color = from.color.tweenTo(
                to.color,
                pos
            );
        }
        return color;
    },

    /**
     * Override the getOffset method to add the whole axis groups inside
     * the legend.
     *
     * @private
     * @function Highcharts.ColorAxis#getOffset
     */
    getOffset: function () {
        var group = this.legendGroup,
            sideOffset = this.chart.axisOffset[this.side];

        if (group) {

            // Hook for the getOffset method to add groups to this parent
            // group
            this.axisParent = group;

            // Call the base
            Axis.prototype.getOffset.call(this);

            // First time only
            if (!this.added) {

                this.added = true;

                this.labelLeft = 0;
                this.labelRight = this.width;
            }
            // Reset it to avoid color axis reserving space
            this.chart.axisOffset[this.side] = sideOffset;
        }
    },

    /**
     * Create the color gradient.
     *
     * @private
     * @function Highcharts.ColorAxis#setLegendColor
     */
    setLegendColor: function () {
        var grad,
            horiz = this.horiz,
            reversed = this.reversed,
            one = reversed ? 1 : 0,
            zero = reversed ? 0 : 1;

        grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one]; // #3190
        this.legendColor = {
            linearGradient: {
                x1: grad[0],
                y1: grad[1],
                x2: grad[2],
                y2: grad[3]
            },
            stops: this.stops
        };
    },

    /**
     * The color axis appears inside the legend and has its own legend
     * symbol.
     *
     * @private
     * @function Highcharts.ColorAxis#drawLegendSymbol
     *
     * @param {Highcharts.Legend} legend
     *
     * @param {*} item
     */
    drawLegendSymbol: function (legend, item) {
        var padding = legend.padding,
            legendOptions = legend.options,
            horiz = this.horiz,
            width = pick(
                legendOptions.symbolWidth,
                horiz ? this.defaultLegendLength : 12
            ),
            height = pick(
                legendOptions.symbolHeight,
                horiz ? 12 : this.defaultLegendLength
            ),
            labelPadding = pick(
                legendOptions.labelPadding,
                horiz ? 16 : 30
            ),
            itemDistance = pick(legendOptions.itemDistance, 10);

        this.setLegendColor();

        // Create the gradient
        item.legendSymbol = this.chart.renderer.rect(
            0,
            legend.baseline - 11,
            width,
            height
        ).attr({
            zIndex: 1
        }).add(item.legendGroup);

        // Set how much space this legend item takes up
        this.legendItemWidth = width + padding +
            (horiz ? itemDistance : labelPadding);
        this.legendItemHeight = height + padding +
            (horiz ? labelPadding : 0);
    },

    /**
     * Fool the legend
     *
     * @private
     * @function Highcharts.ColorAxis#setState
     *
     * @param {*} state
     */
    setState: function (state) {
        this.series.forEach(function (series) {
            series.setState(state);
        });
    },

    visible: true,

    setVisible: noop,

    getSeriesExtremes: function () {
        var series = this.series,
            i = series.length;

        this.dataMin = Infinity;
        this.dataMax = -Infinity;
        while (i--) {
            series[i].getExtremes();
            if (series[i].valueMin !== undefined) {
                this.dataMin = Math.min(this.dataMin, series[i].valueMin);
                this.dataMax = Math.max(this.dataMax, series[i].valueMax);
            }
        }
    },

    drawCrosshair: function (e, point) {
        var plotX = point && point.plotX,
            plotY = point && point.plotY,
            crossPos,
            axisPos = this.pos,
            axisLen = this.len;

        if (point) {
            crossPos = this.toPixels(point[point.series.colorKey]);
            if (crossPos < axisPos) {
                crossPos = axisPos - 2;
            } else if (crossPos > axisPos + axisLen) {
                crossPos = axisPos + axisLen + 2;
            }

            point.plotX = crossPos;
            point.plotY = this.len - crossPos;
            Axis.prototype.drawCrosshair.call(this, e, point);
            point.plotX = plotX;
            point.plotY = plotY;

            if (
                this.cross &&
                !this.cross.addedToColorAxis &&
                this.legendGroup
            ) {
                this.cross
                    .addClass('highcharts-coloraxis-marker')
                    .add(this.legendGroup);

                this.cross.addedToColorAxis = true;

                if (!this.chart.styledMode) {
                    this.cross.attr({
                        fill: this.crosshair.color
                    });
                }

            }
        }
    },

    getPlotLinePath: function (a, b, c, d, pos) {
        // crosshairs only
        return isNumber(pos) ? // pos can be 0 (#3969)
            (
                this.horiz ? [
                    'M',
                    pos - 4, this.top - 6,
                    'L',
                    pos + 4, this.top - 6,
                    pos, this.top,
                    'Z'
                ] : [
                    'M',
                    this.left, pos,
                    'L',
                    this.left - 6, pos + 6,
                    this.left - 6, pos - 6,
                    'Z'
                ]
            ) :
            Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
    },

    update: function (newOptions, redraw) {
        var chart = this.chart,
            legend = chart.legend;

        this.series.forEach(function (series) {
            // Needed for Axis.update when choropleth colors change
            series.isDirtyData = true;
        });

        // When updating data classes, destroy old items and make sure new
        // ones are created (#3207)
        if (newOptions.dataClasses && legend.allItems) {
            legend.allItems.forEach(function (item) {
                if (item.isDataClass && item.legendGroup) {
                    item.legendGroup.destroy();
                }
            });
            chart.isDirtyLegend = true;
        }

        // Keep the options structure updated for export. Unlike xAxis and
        // yAxis, the colorAxis is not an array. (#3207)
        chart.options[this.coll] = merge(this.userOptions, newOptions);

        Axis.prototype.update.call(this, newOptions, redraw);
        if (this.legendItem) {
            this.setLegendColor();
            legend.colorizeItem(this, true);
        }
    },

    /**
     * Extend basic axis remove by also removing the legend item.
     *
     * @private
     * @function Highcharts.ColorAxis#remove
     */
    remove: function () {
        if (this.legendItem) {
            this.chart.legend.destroyItem(this);
        }
        Axis.prototype.remove.call(this);
    },

    /**
     * Get the legend item symbols for data classes.
     *
     * @private
     * @function Highcharts.ColorAxis#getDataClassLegendSymbols
     *
     * @return {*}
     */
    getDataClassLegendSymbols: function () {
        var axis = this,
            chart = this.chart,
            legendItems = this.legendItems,
            legendOptions = chart.options.legend,
            valueDecimals = legendOptions.valueDecimals,
            valueSuffix = legendOptions.valueSuffix || '',
            name;

        if (!legendItems.length) {
            this.dataClasses.forEach(function (dataClass, i) {
                var vis = true,
                    from = dataClass.from,
                    to = dataClass.to;

                // Assemble the default name. This can be overridden
                // by legend.options.labelFormatter
                name = '';
                if (from === undefined) {
                    name = '< ';
                } else if (to === undefined) {
                    name = '> ';
                }
                if (from !== undefined) {
                    name += H.numberFormat(from, valueDecimals) +
                        valueSuffix;
                }
                if (from !== undefined && to !== undefined) {
                    name += ' - ';
                }
                if (to !== undefined) {
                    name += H.numberFormat(to, valueDecimals) + valueSuffix;
                }
                // Add a mock object to the legend items
                legendItems.push(extend({
                    chart: chart,
                    name: name,
                    options: {},
                    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
                    visible: true,
                    setState: noop,
                    isDataClass: true,
                    setVisible: function () {
                        vis = this.visible = !vis;
                        axis.series.forEach(function (series) {
                            series.points.forEach(function (point) {
                                if (point.dataClass === i) {
                                    point.setVisible(vis);
                                }
                            });
                        });
                        chart.legend.colorizeItem(this, vis);
                    }
                }, dataClass));
            });
        }
        return legendItems;
    },
    name: '' // Prevents 'undefined' in legend in IE8
});

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
['fill', 'stroke'].forEach(function (prop) {
    H.Fx.prototype[prop + 'Setter'] = function () {
        this.elem.attr(
            prop,
            color(this.start).tweenTo(
                color(this.end),
                this.pos
            ),
            null,
            true
        );
    };
});

// Extend the chart getAxes method to also get the color axis
addEvent(Chart, 'afterGetAxes', function () {

    var options = this.options,
        colorAxisOptions = options.colorAxis;

    this.colorAxis = [];
    if (colorAxisOptions) {
        new ColorAxis(this, colorAxisOptions); // eslint-disable-line no-new
    }
});


// Add the color axis. This also removes the axis' own series to prevent
// them from showing up individually.
addEvent(Legend, 'afterGetAllItems', function (e) {
    var colorAxisItems = [],
        colorAxis = this.chart.colorAxis[0],
        i;

    if (colorAxis && colorAxis.options) {
        if (colorAxis.options.showInLegend) {
            // Data classes
            if (colorAxis.options.dataClasses) {
                colorAxisItems = colorAxis.getDataClassLegendSymbols();
            // Gradient legend
            } else {
                // Add this axis on top
                colorAxisItems.push(colorAxis);
            }

            // Don't add the color axis' series
            colorAxis.series.forEach(function (series) {
                H.erase(e.allItems, series);
            });
        }
    }

    i = colorAxisItems.length;
    while (i--) {
        e.allItems.unshift(colorAxisItems[i]);
    }
});

addEvent(Legend, 'afterColorizeItem', function (e) {
    if (e.visible && e.item.legendColor) {
        e.item.legendSymbol.attr({
            fill: e.item.legendColor
        });
    }
});

// Updates in the legend need to be reflected in the color axis (6888)
addEvent(Legend, 'afterUpdate', function () {
    if (this.chart.colorAxis[0]) {
        this.chart.colorAxis[0].update({}, arguments[2]);
    }
});
