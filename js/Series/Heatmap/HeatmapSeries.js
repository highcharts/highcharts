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
import ColorMapMixin from '../../Mixins/ColorMapSeries.js';
var colorMapSeriesMixin = ColorMapMixin.colorMapSeriesMixin;
import H from '../../Core/Globals.js';
var noop = H.noop;
import HeatmapPoint from './HeatmapPoint.js';
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var Series = SeriesRegistry.series, _a = SeriesRegistry.seriesTypes, ColumnSeries = _a.column, ScatterSeries = _a.scatter;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
var symbols = SVGRenderer.prototype.symbols;
import U from '../../Core/Utilities.js';
var extend = U.extend, fireEvent = U.fireEvent, isNumber = U.isNumber, merge = U.merge, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.heatmap
 *
 * @augments Highcharts.Series
 */
var HeatmapSeries = /** @class */ (function (_super) {
    __extends(HeatmapSeries, _super);
    function HeatmapSeries() {
        /* *
         *
         *  Static Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.colorAxis = void 0;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        _this.valueMax = NaN;
        _this.valueMin = NaN;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    HeatmapSeries.prototype.drawPoints = function () {
        var _this = this;
        // In styled mode, use CSS, otherwise the fill used in the style
        // sheet will take precedence over the fill attribute.
        var seriesMarkerOptions = this.options.marker || {};
        if (seriesMarkerOptions.enabled || this._hasPointMarkers) {
            Series.prototype.drawPoints.call(this);
            this.points.forEach(function (point) {
                point.graphic &&
                    point.graphic[_this.chart.styledMode ? 'css' : 'animate'](_this.colorAttribs(point));
            });
        }
    };
    /**
     * @private
     */
    HeatmapSeries.prototype.getExtremes = function () {
        // Get the extremes from the value data
        var _a = Series.prototype.getExtremes
            .call(this, this.valueData), dataMin = _a.dataMin, dataMax = _a.dataMax;
        if (isNumber(dataMin)) {
            this.valueMin = dataMin;
        }
        if (isNumber(dataMax)) {
            this.valueMax = dataMax;
        }
        // Get the extremes from the y data
        return Series.prototype.getExtremes.call(this);
    };
    /**
     * Override to also allow null points, used when building the k-d-tree for
     * tooltips in boost mode.
     * @private
     */
    HeatmapSeries.prototype.getValidPoints = function (points, insideOnly) {
        return Series.prototype.getValidPoints.call(this, points, insideOnly, true);
    };
    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    HeatmapSeries.prototype.hasData = function () {
        return !!this.processedXData.length; // != 0
    };
    /**
     * Override the init method to add point ranges on both axes.
     * @private
     */
    HeatmapSeries.prototype.init = function () {
        var options;
        Series.prototype.init.apply(this, arguments);
        options = this.options;
        // #3758, prevent resetting in setData
        options.pointRange = pick(options.pointRange, options.colsize || 1);
        // general point range
        this.yAxis.axisPointRange = options.rowsize || 1;
        // Bind new symbol names
        extend(symbols, {
            ellipse: symbols.circle,
            rect: symbols.square
        });
    };
    /**
     * @private
     */
    HeatmapSeries.prototype.markerAttribs = function (point, state) {
        var pointMarkerOptions = point.marker || {}, seriesMarkerOptions = this.options.marker || {}, seriesStateOptions, pointStateOptions, shapeArgs = point.shapeArgs || {}, hasImage = point.hasImage, attribs = {};
        if (hasImage) {
            return {
                x: point.plotX,
                y: point.plotY
            };
        }
        // Setting width and height attributes on image does not affect
        // on its dimensions.
        if (state) {
            seriesStateOptions = seriesMarkerOptions.states[state] || {};
            pointStateOptions = pointMarkerOptions.states &&
                pointMarkerOptions.states[state] || {};
            [['width', 'x'], ['height', 'y']].forEach(function (dimension) {
                // Set new width and height basing on state options.
                attribs[dimension[0]] = (pointStateOptions[dimension[0]] ||
                    seriesStateOptions[dimension[0]] ||
                    shapeArgs[dimension[0]]) + (pointStateOptions[dimension[0] + 'Plus'] ||
                    seriesStateOptions[dimension[0] + 'Plus'] || 0);
                // Align marker by a new size.
                attribs[dimension[1]] = shapeArgs[dimension[1]] +
                    (shapeArgs[dimension[0]] - attribs[dimension[0]]) / 2;
            });
        }
        return state ? attribs : shapeArgs;
    };
    /**
     * @private
     */
    HeatmapSeries.prototype.pointAttribs = function (point, state) {
        var series = this, attr = Series.prototype.pointAttribs.call(series, point, state), seriesOptions = series.options || {}, plotOptions = series.chart.options.plotOptions || {}, seriesPlotOptions = plotOptions.series || {}, heatmapPlotOptions = plotOptions.heatmap || {}, stateOptions, brightness, 
        // Get old properties in order to keep backward compatibility
        borderColor = seriesOptions.borderColor ||
            heatmapPlotOptions.borderColor ||
            seriesPlotOptions.borderColor, borderWidth = seriesOptions.borderWidth ||
            heatmapPlotOptions.borderWidth ||
            seriesPlotOptions.borderWidth ||
            attr['stroke-width'];
        // Apply lineColor, or set it to default series color.
        attr.stroke = ((point && point.marker && point.marker.lineColor) ||
            (seriesOptions.marker && seriesOptions.marker.lineColor) ||
            borderColor ||
            this.color);
        // Apply old borderWidth property if exists.
        attr['stroke-width'] = borderWidth;
        if (state) {
            stateOptions =
                merge(seriesOptions.states[state], seriesOptions.marker &&
                    seriesOptions.marker.states[state], point &&
                    point.options.states &&
                    point.options.states[state] || {});
            brightness = stateOptions.brightness;
            attr.fill =
                stateOptions.color ||
                    H.color(attr.fill).brighten(brightness || 0).get();
            attr.stroke = stateOptions.lineColor;
        }
        return attr;
    };
    /**
     * @private
     */
    HeatmapSeries.prototype.setClip = function (animation) {
        var series = this, chart = series.chart;
        Series.prototype.setClip.apply(series, arguments);
        if (series.options.clip !== false || animation) {
            series.markerGroup
                .clip((animation || series.clipBox) && series.sharedClipKey ?
                chart[series.sharedClipKey] :
                chart.clipRect);
        }
    };
    /**
     * @private
     */
    HeatmapSeries.prototype.translate = function () {
        var series = this, options = series.options, symbol = options.marker && options.marker.symbol || '', shape = symbols[symbol] ? symbol : 'rect', options = series.options, hasRegularShape = ['circle', 'square'].indexOf(shape) !== -1;
        series.generatePoints();
        series.points.forEach(function (point) {
            var pointAttr, sizeDiff, hasImage, cellAttr = point.getCellAttributes(), shapeArgs = {
                x: Math.min(cellAttr.x1, cellAttr.x2),
                y: Math.min(cellAttr.y1, cellAttr.y2),
                width: Math.max(Math.abs(cellAttr.x2 - cellAttr.x1), 0),
                height: Math.max(Math.abs(cellAttr.y2 - cellAttr.y1), 0)
            };
            hasImage = point.hasImage =
                (point.marker && point.marker.symbol || symbol || '')
                    .indexOf('url') === 0;
            // If marker shape is regular (symetric), find shorter
            // cell's side.
            if (hasRegularShape) {
                sizeDiff = Math.abs(shapeArgs.width - shapeArgs.height);
                shapeArgs.x = Math.min(cellAttr.x1, cellAttr.x2) +
                    (shapeArgs.width < shapeArgs.height ? 0 : sizeDiff / 2);
                shapeArgs.y = Math.min(cellAttr.y1, cellAttr.y2) +
                    (shapeArgs.width < shapeArgs.height ? sizeDiff / 2 : 0);
                shapeArgs.width = shapeArgs.height =
                    Math.min(shapeArgs.width, shapeArgs.height);
            }
            pointAttr = {
                plotX: (cellAttr.x1 + cellAttr.x2) / 2,
                plotY: (cellAttr.y1 + cellAttr.y2) / 2,
                clientX: (cellAttr.x1 + cellAttr.x2) / 2,
                shapeType: 'path',
                shapeArgs: merge(true, shapeArgs, {
                    d: symbols[shape](shapeArgs.x, shapeArgs.y, shapeArgs.width, shapeArgs.height)
                })
            };
            if (hasImage) {
                point.marker = {
                    width: shapeArgs.width,
                    height: shapeArgs.height
                };
            }
            extend(point, pointAttr);
        });
        fireEvent(series, 'afterTranslate');
    };
    /**
     * A heatmap is a graphical representation of data where the individual
     * values contained in a matrix are represented as colors.
     *
     * @productdesc {highcharts}
     * Requires `modules/heatmap`.
     *
     * @sample highcharts/demo/heatmap/
     *         Simple heatmap
     * @sample highcharts/demo/heatmap-canvas/
     *         Heavy heatmap
     *
     * @extends      plotOptions.scatter
     * @excluding    animationLimit, connectEnds, connectNulls, cropThreshold,
     *               dashStyle, findNearestPointBy, getExtremesFromAll, jitter,
     *               linecap, lineWidth, pointInterval, pointIntervalUnit,
     *               pointRange, pointStart, shadow, softThreshold, stacking,
     *               step, threshold, cluster
     * @product      highcharts highmaps
     * @optionparent plotOptions.heatmap
     */
    HeatmapSeries.defaultOptions = merge(ScatterSeries.defaultOptions, {
        /**
         * Animation is disabled by default on the heatmap series.
         */
        animation: false,
        /**
         * The border width for each heat map item.
         */
        borderWidth: 0,
        /**
         * Padding between the points in the heatmap.
         *
         * @type      {number}
         * @default   0
         * @since     6.0
         * @apioption plotOptions.heatmap.pointPadding
         */
        /**
         * @default   value
         * @apioption plotOptions.heatmap.colorKey
         */
        /**
         * The main color of the series. In heat maps this color is rarely used,
         * as we mostly use the color to denote the value of each point. Unless
         * options are set in the [colorAxis](#colorAxis), the default value
         * is pulled from the [options.colors](#colors) array.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     4.0
         * @product   highcharts
         * @apioption plotOptions.heatmap.color
         */
        /**
         * The column size - how many X axis units each column in the heatmap
         * should span.
         *
         * @sample {highcharts} maps/demo/heatmap/
         *         One day
         * @sample {highmaps} maps/demo/heatmap/
         *         One day
         *
         * @type      {number}
         * @default   1
         * @since     4.0
         * @product   highcharts highmaps
         * @apioption plotOptions.heatmap.colsize
         */
        /**
         * The row size - how many Y axis units each heatmap row should span.
         *
         * @sample {highcharts} maps/demo/heatmap/
         *         1 by default
         * @sample {highmaps} maps/demo/heatmap/
         *         1 by default
         *
         * @type      {number}
         * @default   1
         * @since     4.0
         * @product   highcharts highmaps
         * @apioption plotOptions.heatmap.rowsize
         */
        /**
         * The color applied to null points. In styled mode, a general CSS class
         * is applied instead.
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        nullColor: palette.neutralColor3,
        dataLabels: {
            formatter: function () {
                return this.point.value;
            },
            inside: true,
            verticalAlign: 'middle',
            crop: false,
            overflow: false,
            padding: 0 // #3837
        },
        /**
         * @excluding radius, enabledThreshold
         * @since     8.1
         */
        marker: {
            /**
             * A predefined shape or symbol for the marker. When undefined, the
             * symbol is pulled from options.symbols. Other possible values are
             * `'circle'`, `'square'`,`'diamond'`, `'triangle'`,
             * `'triangle-down'`, `'rect'`, and `'ellipse'`.
             *
             * Additionally, the URL to a graphic can be given on this form:
             * `'url(graphic.png)'`. Note that for the image to be applied to
             * exported charts, its URL needs to be accessible by the export
             * server.
             *
             * Custom callbacks for symbol path generation can also be added to
             * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
             * used by its method name, as shown in the demo.
             *
             * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
             *         Predefined, graphic and custom markers
             * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
             *         Predefined, graphic and custom markers
             */
            symbol: 'rect',
            /** @ignore-option */
            radius: 0,
            lineColor: void 0,
            states: {
                /**
                 * @excluding radius, radiusPlus
                 */
                hover: {
                    /**
                     * Set the marker's fixed width on hover state.
                     *
                     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
                     *         70px fixed marker's width and height on hover
                     *
                     * @type      {number|undefined}
                     * @default   undefined
                     * @product   highcharts highmaps
                     * @apioption plotOptions.heatmap.marker.states.hover.width
                     */
                    /**
                     * Set the marker's fixed height on hover state.
                     *
                     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
                     *         70px fixed marker's width and height on hover
                     *
                     * @type      {number|undefined}
                     * @default   undefined
                     * @product   highcharts highmaps
                     * @apioption plotOptions.heatmap.marker.states.hover.height
                     */
                    /**
                     * The number of pixels to increase the width of the
                     * selected point.
                     *
                     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
                     *         20px greater width and height on hover
                     *
                     * @type      {number|undefined}
                     * @default   undefined
                     * @product   highcharts highmaps
                     * @apioption plotOptions.heatmap.marker.states.hover.widthPlus
                     */
                    /**
                     * The number of pixels to increase the height of the
                     * selected point.
                     *
                     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
                    *          20px greater width and height on hover
                     *
                     * @type      {number|undefined}
                     * @default   undefined
                     * @product   highcharts highmaps
                     * @apioption plotOptions.heatmap.marker.states.hover.heightPlus
                     */
                    /**
                     * The additional line width for a hovered point.
                     *
                     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-linewidthplus
                     *         5 pixels wider lineWidth on hover
                     * @sample {highmaps} maps/plotoptions/heatmap-marker-states-hover-linewidthplus
                     *         5 pixels wider lineWidth on hover
                     */
                    lineWidthPlus: 0
                },
                /**
                 * @excluding radius
                 */
                select: {
                /**
                 * Set the marker's fixed width on select state.
                 *
                 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
                 *         70px fixed marker's width and height on hover
                 *
                 * @type      {number|undefined}
                 * @default   undefined
                 * @product   highcharts highmaps
                 * @apioption plotOptions.heatmap.marker.states.select.width
                 */
                /**
                 * Set the marker's fixed height on select state.
                 *
                 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
                 *         70px fixed marker's width and height on hover
                 *
                 * @type      {number|undefined}
                 * @default   undefined
                 * @product   highcharts highmaps
                 * @apioption plotOptions.heatmap.marker.states.select.height
                 */
                /**
                 * The number of pixels to increase the width of the
                 * selected point.
                 *
                 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
                 *         20px greater width and height on hover
                 *
                 * @type      {number|undefined}
                 * @default   undefined
                 * @product   highcharts highmaps
                 * @apioption plotOptions.heatmap.marker.states.select.widthPlus
                 */
                /**
                 * The number of pixels to increase the height of the
                 * selected point.
                 *
                 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
                 *         20px greater width and height on hover
                 *
                 * @type      {number|undefined}
                 * @default   undefined
                 * @product   highcharts highmaps
                 * @apioption plotOptions.heatmap.marker.states.select.heightPlus
                 */
                }
            }
        },
        clip: true,
        /** @ignore-option */
        pointRange: null,
        tooltip: {
            pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
        },
        states: {
            hover: {
                /** @ignore-option */
                halo: false,
                /**
                 * How much to brighten the point on interaction. Requires the
                 * main color to be defined in hex or rgb(a) format.
                 *
                 * In styled mode, the hover brightening is by default replaced
                 * with a fill-opacity set in the `.highcharts-point:hover`
                 * rule.
                 */
                brightness: 0.2
            }
        }
    });
    return HeatmapSeries;
}(ScatterSeries));
extend(HeatmapSeries.prototype, {
    /**
     * @private
     */
    alignDataLabel: ColumnSeries.prototype.alignDataLabel,
    axisTypes: colorMapSeriesMixin.axisTypes,
    colorAttribs: colorMapSeriesMixin.colorAttribs,
    colorKey: colorMapSeriesMixin.colorKey,
    directTouch: true,
    /**
     * @private
     */
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    /**
     * @ignore
     * @deprecated
     */
    getBox: noop,
    getExtremesFromAll: true,
    getSymbol: Series.prototype.getSymbol,
    hasPointSpecificOptions: true,
    parallelArrays: colorMapSeriesMixin.parallelArrays,
    pointArrayMap: ['y', 'value'],
    pointClass: HeatmapPoint,
    trackerGroups: colorMapSeriesMixin.trackerGroups
});
SeriesRegistry.registerSeriesType('heatmap', HeatmapSeries);
/* *
 *
 *  Default Export
 *
 * */
export default HeatmapSeries;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Heatmap series only. Padding between the points in the heatmap.
 * @name Highcharts.Point#pointPadding
 * @type {number|undefined}
 */
/**
 * Heatmap series only. The value of the point, resulting in a color
 * controled by options as set in the colorAxis configuration.
 * @name Highcharts.Point#value
 * @type {number|null|undefined}
 */
/* *
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 */ /**
* Heatmap series only. Point padding for a single point.
* @name Highcharts.PointOptionsObject#pointPadding
* @type {number|undefined}
*/ /**
* Heatmap series only. The value of the point, resulting in a color controled
* by options as set in the colorAxis configuration.
* @name Highcharts.PointOptionsObject#value
* @type {number|null|undefined}
*/
''; // detach doclets above
/* *
 *
 *  API Options
 *
 * */
/**
 * A `heatmap` series. If the [type](#series.heatmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @productdesc {highcharts}
 * Requires `modules/heatmap`.
 *
 * @extends   series,plotOptions.heatmap
 * @excluding cropThreshold, dataParser, dataURL, pointRange, stack,
 * @product   highcharts highmaps
 * @apioption series.heatmap
 */
/**
 * An array of data points for the series. For the `heatmap` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,value`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 *
 *  ```js
 *     data: [
 *         [0, 9, 7],
 *         [1, 10, 4],
 *         [2, 6, 3]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.heatmap.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 3,
 *         value: 10,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 7,
 *         value: 10,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<number>|*>}
 * @extends   series.line.data
 * @product   highcharts highmaps
 * @apioption series.heatmap.data
 */
/**
 * The color of the point. In heat maps the point color is rarely set
 * explicitly, as we use the color to denote the `value`. Options for
 * this are set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.color
 */
/**
 * The value of the point, resulting in a color controled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.value
 */
/**
 * The x value of the point. For datetime axes,
 * the X value is the timestamp in milliseconds since 1970.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.x
 */
/**
 * The y value of the point.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.y
 */
/**
 * Point padding for a single point.
 *
 * @sample maps/plotoptions/tilemap-pointpadding
 *         Point padding on tiles
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.pointPadding
 */
/**
 * @excluding radius, enabledThreshold
 * @product   highcharts highmaps
 * @since     8.1
 * @apioption series.heatmap.data.marker
 */
/**
 * @excluding radius, enabledThreshold
 * @product   highcharts highmaps
 * @since     8.1
 * @apioption series.heatmap.marker
 */
/**
 * @excluding radius, radiusPlus
 * @product   highcharts highmaps
 * @apioption series.heatmap.marker.states.hover
 */
/**
 * @excluding radius
 * @product   highcharts highmaps
 * @apioption series.heatmap.marker.states.select
 */
/**
 * @excluding radius, radiusPlus
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.marker.states.hover
 */
/**
 * @excluding radius
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.marker.states.select
 */
/**
* Set the marker's fixed width on hover state.
*
* @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-linewidthplus
*         5 pixels wider lineWidth on hover
*
* @type      {number|undefined}
* @default   0
* @product   highcharts highmaps
* @apioption series.heatmap.marker.states.hover.lineWidthPlus
*/
/**
* Set the marker's fixed width on hover state.
*
* @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
*         70px fixed marker's width and height on hover
*
* @type      {number|undefined}
* @default   undefined
* @product   highcharts highmaps
* @apioption series.heatmap.marker.states.hover.width
*/
/**
 * Set the marker's fixed height on hover state.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
 *         70px fixed marker's width and height on hover
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.marker.states.hover.height
 */
/**
* The number of pixels to increase the width of the
* hovered point.
*
* @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
*         One day
*
* @type      {number|undefined}
* @default   undefined
* @product   highcharts highmaps
* @apioption series.heatmap.marker.states.hover.widthPlus
*/
/**
 * The number of pixels to increase the height of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.marker.states.hover.heightPlus
 */
/**
 * The number of pixels to increase the width of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.marker.states.select.widthPlus
 */
/**
 * The number of pixels to increase the height of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.marker.states.select.heightPlus
 */
/**
* Set the marker's fixed width on hover state.
*
* @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-linewidthplus
*         5 pixels wider lineWidth on hover
*
* @type      {number|undefined}
* @default   0
* @product   highcharts highmaps
* @apioption series.heatmap.data.marker.states.hover.lineWidthPlus
*/
/**
 * Set the marker's fixed width on hover state.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
 *         70px fixed marker's width and height on hover
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.marker.states.hover.width
 */
/**
 * Set the marker's fixed height on hover state.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
 *         70px fixed marker's width and height on hover
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.marker.states.hover.height
 */
/**
 * The number of pixels to increase the width of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highstock
 * @apioption series.heatmap.data.marker.states.hover.widthPlus
 */
/**
 * The number of pixels to increase the height of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highstock
 * @apioption series.heatmap.data.marker.states.hover.heightPlus
 */
/**
* Set the marker's fixed width on select state.
*
* @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
*         70px fixed marker's width and height on hover
*
* @type      {number|undefined}
* @default   undefined
* @product   highcharts highmaps
* @apioption series.heatmap.data.marker.states.select.width
*/
/**
 * Set the marker's fixed height on select state.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
 *         70px fixed marker's width and height on hover
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highmaps
 * @apioption series.heatmap.data.marker.states.select.height
 */
/**
 * The number of pixels to increase the width of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highstock
 * @apioption series.heatmap.data.marker.states.select.widthPlus
 */
/**
 * The number of pixels to increase the height of the
 * hovered point.
 *
 * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
 *         One day
 *
 * @type      {number|undefined}
 * @default   undefined
 * @product   highcharts highstock
 * @apioption series.heatmap.data.marker.states.select.heightPlus
 */
''; // adds doclets above to transpiled file
