/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Axis from '../Axis.js';
import Color from '../../Color/Color.js';
var color = Color.parse;
import ColorAxisComposition from './ColorAxisComposition.js';
import ColorAxisDefaults from './ColorAxisDefaults.js';
import H from '../../Globals.js';
var noop = H.noop;
import LegendSymbol from '../../Legend/LegendSymbol.js';
import SeriesRegistry from '../../Series/SeriesRegistry.js';
var Series = SeriesRegistry.series;
import U from '../../Utilities.js';
var extend = U.extend, isNumber = U.isNumber, merge = U.merge, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
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
var ColorAxis = /** @class */ (function (_super) {
    __extends(ColorAxis, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * @private
     */
    function ColorAxis(chart, userOptions) {
        var _this = _super.call(this, chart, userOptions) || this;
        // Prevents unnecessary padding with `hc-more`
        _this.beforePadding = false;
        _this.chart = void 0;
        _this.coll = 'colorAxis';
        _this.dataClasses = void 0;
        _this.legendItem = void 0;
        _this.legendItems = void 0;
        _this.name = ''; // Prevents 'undefined' in legend in IE8
        _this.options = void 0;
        _this.stops = void 0;
        _this.visible = true;
        _this.init(chart, userOptions);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    ColorAxis.compose = function (ChartClass, FxClass, LegendClass, SeriesClass) {
        ColorAxisComposition.compose(ColorAxis, ChartClass, FxClass, LegendClass, SeriesClass);
    };
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
    ColorAxis.prototype.init = function (chart, userOptions) {
        var axis = this;
        var legend = chart.options.legend || {}, horiz = userOptions.layout ?
            userOptions.layout !== 'vertical' :
            legend.layout !== 'vertical', visible = userOptions.visible;
        var options = merge(ColorAxis.defaultColorAxisOptions, userOptions, {
            showEmpty: false,
            title: null,
            visible: legend.enabled && visible !== false
        });
        axis.coll = 'colorAxis';
        axis.side = userOptions.side || horiz ? 2 : 1;
        axis.reversed = userOptions.reversed || !horiz;
        axis.opposite = !horiz;
        _super.prototype.init.call(this, chart, options);
        // #16053: Restore the actual userOptions.visible so the color axis
        // doesnt stay hidden forever when hiding and showing legend
        axis.userOptions.visible = visible;
        // Base init() pushes it to the xAxis array, now pop it again
        // chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();
        // Prepare data classes
        if (userOptions.dataClasses) {
            axis.initDataClasses(userOptions);
        }
        axis.initStops();
        // Override original axis properties
        axis.horiz = horiz;
        axis.zoomEnabled = false;
    };
    /**
     * @private
     */
    ColorAxis.prototype.initDataClasses = function (userOptions) {
        var axis = this, chart = axis.chart, options = axis.options, len = userOptions.dataClasses.length;
        var dataClasses, colorCounter = 0, colorCount = chart.options.chart.colorCount;
        axis.dataClasses = dataClasses = [];
        axis.legendItems = [];
        (userOptions.dataClasses || []).forEach(function (dataClass, i) {
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
            }
            else {
                dataClass.color = color(options.minColor).tweenTo(color(options.maxColor), len < 2 ? 0.5 : i / (len - 1) // #3219
                );
            }
        });
    };
    /**
     * Returns true if the series has points at all.
     *
     * @function Highcharts.ColorAxis#hasData
     *
     * @return {boolean}
     * True, if the series has points, otherwise false.
     */
    ColorAxis.prototype.hasData = function () {
        return !!(this.tickPositions || []).length;
    };
    /**
     * Override so that ticks are not added in data class axes (#6914)
     * @private
     */
    ColorAxis.prototype.setTickPositions = function () {
        if (!this.dataClasses) {
            return _super.prototype.setTickPositions.call(this);
        }
    };
    /**
     * @private
     */
    ColorAxis.prototype.initStops = function () {
        var axis = this;
        axis.stops = axis.options.stops || [
            [0, axis.options.minColor],
            [1, axis.options.maxColor]
        ];
        axis.stops.forEach(function (stop) {
            stop.color = color(stop[1]);
        });
    };
    /**
     * Extend the setOptions method to process extreme colors and color stops.
     * @private
     */
    ColorAxis.prototype.setOptions = function (userOptions) {
        var axis = this;
        _super.prototype.setOptions.call(this, userOptions);
        axis.options.crosshair = axis.options.marker;
    };
    /**
     * @private
     */
    ColorAxis.prototype.setAxisSize = function () {
        var axis = this;
        var symbol = axis.legendSymbol;
        var chart = axis.chart;
        var legendOptions = chart.options.legend || {};
        var x, y, width, height;
        if (symbol) {
            this.left = x = symbol.attr('x');
            this.top = y = symbol.attr('y');
            this.width = width = symbol.attr('width');
            this.height = height = symbol.attr('height');
            this.right = chart.chartWidth - x - width;
            this.bottom = chart.chartHeight - y - height;
            this.len = this.horiz ? width : height;
            this.pos = this.horiz ? x : y;
        }
        else {
            // Fake length for disabled legend to avoid tick issues
            // and such (#5205)
            this.len = (this.horiz ?
                legendOptions.symbolWidth :
                legendOptions.symbolHeight) || ColorAxis.defaultLegendLength;
        }
    };
    /**
     * @private
     */
    ColorAxis.prototype.normalizedValue = function (value) {
        var axis = this;
        if (axis.logarithmic) {
            value = axis.logarithmic.log2lin(value);
        }
        return 1 - ((axis.max - value) /
            ((axis.max - axis.min) || 1));
    };
    /**
     * Translate from a value to a color.
     * @private
     */
    ColorAxis.prototype.toColor = function (value, point) {
        var axis = this;
        var dataClasses = axis.dataClasses;
        var stops = axis.stops;
        var pos, from, to, color, dataClass, i;
        if (dataClasses) {
            i = dataClasses.length;
            while (i--) {
                dataClass = dataClasses[i];
                from = dataClass.from;
                to = dataClass.to;
                if ((typeof from === 'undefined' || value >= from) &&
                    (typeof to === 'undefined' || value <= to)) {
                    color = dataClass.color;
                    if (point) {
                        point.dataClass = i;
                        point.colorIndex = dataClass.colorIndex;
                    }
                    break;
                }
            }
        }
        else {
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
            color = from.color.tweenTo(to.color, pos);
        }
        return color;
    };
    /**
     * Override the getOffset method to add the whole axis groups inside the
     * legend.
     * @private
     */
    ColorAxis.prototype.getOffset = function () {
        var axis = this;
        var group = axis.legendGroup;
        var sideOffset = axis.chart.axisOffset[axis.side];
        if (group) {
            // Hook for the getOffset method to add groups to this parent
            // group
            axis.axisParent = group;
            // Call the base
            _super.prototype.getOffset.call(this);
            var legend_1 = this.chart.legend;
            // Adds `maxLabelLength` needed for label padding corrections done
            // by `render()` and `getMargins()` (#15551).
            legend_1.allItems.forEach(function (item) {
                if (item instanceof ColorAxis) {
                    item.drawLegendSymbol(legend_1, item);
                }
            });
            legend_1.render();
            this.chart.getMargins(true);
            // First time only
            if (!axis.added) {
                axis.added = true;
                axis.labelLeft = 0;
                axis.labelRight = axis.width;
            }
            // Reset it to avoid color axis reserving space
            axis.chart.axisOffset[axis.side] = sideOffset;
        }
    };
    /**
     * Create the color gradient.
     * @private
     */
    ColorAxis.prototype.setLegendColor = function () {
        var axis = this;
        var horiz = axis.horiz;
        var reversed = axis.reversed;
        var one = reversed ? 1 : 0;
        var zero = reversed ? 0 : 1;
        var grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one]; // #3190
        axis.legendColor = {
            linearGradient: {
                x1: grad[0],
                y1: grad[1],
                x2: grad[2],
                y2: grad[3]
            },
            stops: axis.stops
        };
    };
    /**
     * The color axis appears inside the legend and has its own legend symbol.
     * @private
     */
    ColorAxis.prototype.drawLegendSymbol = function (legend, item) {
        var axis = this;
        var padding = legend.padding;
        var legendOptions = legend.options;
        var horiz = axis.horiz;
        var width = pick(legendOptions.symbolWidth, horiz ? ColorAxis.defaultLegendLength : 12);
        var height = pick(legendOptions.symbolHeight, horiz ? 12 : ColorAxis.defaultLegendLength);
        var labelPadding = pick(
        // @todo: This option is not documented, nor implemented when
        // vertical
        legendOptions.labelPadding, horiz ? 16 : 30);
        var itemDistance = pick(legendOptions.itemDistance, 10);
        this.setLegendColor();
        // Create the gradient
        if (!item.legendSymbol) {
            item.legendSymbol = this.chart.renderer.rect(0, legend.baseline - 11, width, height).attr({
                zIndex: 1
            }).add(item.legendGroup);
        }
        // Set how much space this legend item takes up
        axis.legendItemWidth = (width +
            padding +
            (horiz ?
                itemDistance :
                this.options.labels.x + this.maxLabelLength));
        axis.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
    };
    /**
     * Fool the legend.
     * @private
     */
    ColorAxis.prototype.setState = function (state) {
        this.series.forEach(function (series) {
            series.setState(state);
        });
    };
    /**
     * @private
     */
    ColorAxis.prototype.setVisible = function () {
    };
    /**
     * @private
     */
    ColorAxis.prototype.getSeriesExtremes = function () {
        var axis = this;
        var series = axis.series;
        var colorValArray, colorKey, colorValIndex, pointArrayMap, calculatedExtremes, cSeries, i = series.length, yData, j;
        this.dataMin = Infinity;
        this.dataMax = -Infinity;
        while (i--) { // x, y, value, other
            cSeries = series[i];
            colorKey = cSeries.colorKey = pick(cSeries.options.colorKey, cSeries.colorKey, cSeries.pointValKey, cSeries.zoneAxis, 'y');
            pointArrayMap = cSeries.pointArrayMap;
            calculatedExtremes = cSeries[colorKey + 'Min'] &&
                cSeries[colorKey + 'Max'];
            if (cSeries[colorKey + 'Data']) {
                colorValArray = cSeries[colorKey + 'Data'];
            }
            else {
                if (!pointArrayMap) {
                    colorValArray = cSeries.yData;
                }
                else {
                    colorValArray = [];
                    colorValIndex = pointArrayMap.indexOf(colorKey);
                    yData = cSeries.yData;
                    if (colorValIndex >= 0 && yData) {
                        for (j = 0; j < yData.length; j++) {
                            colorValArray.push(pick(yData[j][colorValIndex], yData[j]));
                        }
                    }
                }
            }
            // If color key extremes are already calculated, use them.
            if (calculatedExtremes) {
                cSeries.minColorValue = cSeries[colorKey + 'Min'];
                cSeries.maxColorValue = cSeries[colorKey + 'Max'];
            }
            else {
                var cExtremes = Series.prototype.getExtremes.call(cSeries, colorValArray);
                cSeries.minColorValue = cExtremes.dataMin;
                cSeries.maxColorValue = cExtremes.dataMax;
            }
            if (typeof cSeries.minColorValue !== 'undefined') {
                this.dataMin =
                    Math.min(this.dataMin, cSeries.minColorValue);
                this.dataMax =
                    Math.max(this.dataMax, cSeries.maxColorValue);
            }
            if (!calculatedExtremes) {
                Series.prototype.applyExtremes.call(cSeries);
            }
        }
    };
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
    ColorAxis.prototype.drawCrosshair = function (e, point) {
        var axis = this;
        var plotX = point && point.plotX;
        var plotY = point && point.plotY;
        var axisPos = axis.pos;
        var axisLen = axis.len;
        var crossPos;
        if (point) {
            crossPos = axis.toPixels(point.getNestedProperty(point.series.colorKey));
            if (crossPos < axisPos) {
                crossPos = axisPos - 2;
            }
            else if (crossPos > axisPos + axisLen) {
                crossPos = axisPos + axisLen + 2;
            }
            point.plotX = crossPos;
            point.plotY = axis.len - crossPos;
            _super.prototype.drawCrosshair.call(this, e, point);
            point.plotX = plotX;
            point.plotY = plotY;
            if (axis.cross &&
                !axis.cross.addedToColorAxis &&
                axis.legendGroup) {
                axis.cross
                    .addClass('highcharts-coloraxis-marker')
                    .add(axis.legendGroup);
                axis.cross.addedToColorAxis = true;
                if (!axis.chart.styledMode &&
                    typeof axis.crosshair === 'object') {
                    axis.cross.attr({
                        fill: axis.crosshair.color
                    });
                }
            }
        }
    };
    /**
     * @private
     */
    ColorAxis.prototype.getPlotLinePath = function (options) {
        var axis = this, left = axis.left, pos = options.translatedValue, top = axis.top;
        // crosshairs only
        return isNumber(pos) ? // pos can be 0 (#3969)
            (axis.horiz ? [
                ['M', pos - 4, top - 6],
                ['L', pos + 4, top - 6],
                ['L', pos, top],
                ['Z']
            ] : [
                ['M', left, pos],
                ['L', left - 6, pos + 6],
                ['L', left - 6, pos - 6],
                ['Z']
            ]) :
            _super.prototype.getPlotLinePath.call(this, options);
    };
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
    ColorAxis.prototype.update = function (newOptions, redraw) {
        var axis = this, chart = axis.chart, legend = chart.legend;
        this.series.forEach(function (series) {
            // Needed for Axis.update when choropleth colors change
            series.isDirtyData = true;
        });
        // When updating data classes, destroy old items and make sure new
        // ones are created (#3207)
        if (newOptions.dataClasses && legend.allItems || axis.dataClasses) {
            axis.destroyItems();
        }
        _super.prototype.update.call(this, newOptions, redraw);
        if (axis.legendItem) {
            axis.setLegendColor();
            legend.colorizeItem(this, true);
        }
    };
    /**
     * Destroy color axis legend items.
     * @private
     */
    ColorAxis.prototype.destroyItems = function () {
        var axis = this;
        var chart = axis.chart;
        if (axis.legendItem) {
            chart.legend.destroyItem(axis);
        }
        else if (axis.legendItems) {
            axis.legendItems.forEach(function (item) {
                chart.legend.destroyItem(item);
            });
        }
        chart.isDirtyLegend = true;
    };
    //   Removing the whole axis (#14283)
    ColorAxis.prototype.destroy = function () {
        this.chart.isDirtyLegend = true;
        this.destroyItems();
        _super.prototype.destroy.apply(this, [].slice.call(arguments));
    };
    /**
     * Removes the color axis and the related legend item.
     *
     * @function Highcharts.ColorAxis#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart following the remove.
     */
    ColorAxis.prototype.remove = function (redraw) {
        this.destroyItems();
        _super.prototype.remove.call(this, redraw);
    };
    /**
     * Get the legend item symbols for data classes.
     * @private
     */
    ColorAxis.prototype.getDataClassLegendSymbols = function () {
        var axis = this;
        var chart = axis.chart;
        var legendItems = axis.legendItems;
        var legendOptions = chart.options.legend;
        var valueDecimals = legendOptions.valueDecimals;
        var valueSuffix = legendOptions.valueSuffix || '';
        var name;
        if (!legendItems.length) {
            axis.dataClasses.forEach(function (dataClass, i) {
                var from = dataClass.from, to = dataClass.to, numberFormatter = chart.numberFormatter;
                var vis = true;
                // Assemble the default name. This can be overridden
                // by legend.options.labelFormatter
                name = '';
                if (typeof from === 'undefined') {
                    name = '< ';
                }
                else if (typeof to === 'undefined') {
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
                legendItems.push(extend({
                    chart: chart,
                    name: name,
                    options: {},
                    drawLegendSymbol: LegendSymbol.drawRectangle,
                    visible: true,
                    setState: noop,
                    isDataClass: true,
                    setVisible: function () {
                        vis = axis.visible = !vis;
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
    };
    /* *
     *
     *  Static Properties
     *
     * */
    ColorAxis.defaultColorAxisOptions = ColorAxisDefaults;
    ColorAxis.defaultLegendLength = 200;
    /**
     * @private
     */
    ColorAxis.keepProps = [
        'legendGroup',
        'legendItemHeight',
        'legendItemWidth',
        'legendItem',
        'legendSymbol'
    ];
    return ColorAxis;
}(Axis));
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
''; // detach doclet above
