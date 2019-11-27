/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class HeatmapPoint extends ScatterPoint implements ColorMapPointMixin {
            public dataLabelOnNull: ColorMapPointMixin['dataLabelOnNull'];
            public isValid: ColorMapPointMixin['isValid'];
            public options: HeatmapPointOptions;
            public pointPadding?: number;
            public series: HeatmapSeries;
            public value: (number|null);
            public x: number;
            public y: number;
            public getCellAttributes(): HeatmapPointCellAttributes;
        }
        class HeatmapSeries
            extends ScatterSeries
            implements ColorMapSeriesMixin {
            public alignDataLabel: ColumnSeries['alignDataLabel'];
            public colorAttribs: ColorMapSeriesMixin['colorAttribs'];
            public colorAxis: ColorAxis;
            public data: Array<HeatmapPoint>;
            public drawLegendSymbol: LegendSymbolMixin['drawRectangle'];
            public options: HeatmapSeriesOptions;
            public pointArrayMap: Array<string>;
            public pointClass: typeof HeatmapPoint;
            public points: Array<HeatmapPoint>;
            public trackerGroups: Array<string>;
            public valueData?: Array<number>;
            public valueMax: number;
            public valueMin: number;
            public drawPoints(): void;
            public getExtremes(): void;
            public getValidPoints(
                points?: Array<HeatmapPoint>,
                insideOnly?: boolean
            ): Array<Point>;
            public hasData(): boolean;
            public init(): void;
            public markerAttribs(
                this: Highcharts.HeatmapSeries,
                point: Highcharts.HeatmapPoint
            ): SVGAttributes;
            public pointAttribs(
                point: Highcharts.HeatmapPoint,
                state?: string
            ): SVGAttributes;
            public setClip(): void;
            public setOptions(
                itemOptions: SeriesOptionsType
            ): this['options'];
            public translate(): void;
        }
        interface HeatmapPointCellAttributes extends Dictionary<number> {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        }
        interface HeatmapPointOptions extends ScatterPointOptions {
            pointPadding?: HeatmapPoint['pointPadding'];
            value?: HeatmapPoint['value'];
        }
        interface HeatmapSeriesOptions
            extends ScatterSeriesOptions
        {
            colsize?: number;
            nullColor?: (ColorString|GradientColorObject|PatternObject);
            pointPadding?: HeatmapPoint['pointPadding'];
            rowsize?: number;
            states?: SeriesStatesOptionsObject<HeatmapSeries>;
        }
        interface SeriesStatesHoverOptions
        {
            brightness?: number;
        }
        interface Series {
            valueMax?: number;
            valueMin?: number;
        }
        interface SeriesTypesDictionary {
            heatmap: typeof HeatmapSeries;
        }
    }
}

/* *
 * @interface Highcharts.PointOptionsObject in parts/Point.ts
 *//**
 * Heatmap series only. Point padding for a single point.
 * @name Highcharts.PointOptionsObject#pointPadding
 * @type {number|undefined}
 *//**
 * Heatmap series only. The value of the point, resulting in a color controled
 * by options as set in the colorAxis configuration.
 * @name Highcharts.PointOptionsObject#value
 * @type {number|null|undefined}
 */

import U from '../parts/Utilities.js';
const {
    clamp,
    extend,
    pick
} = U;

import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/Legend.js';
import './ColorMapSeriesMixin.js';

var colorMapPointMixin = H.colorMapPointMixin,
    colorMapSeriesMixin = H.colorMapSeriesMixin,
    LegendSymbolMixin = H.LegendSymbolMixin,
    merge = H.merge,
    noop = H.noop,
    fireEvent = H.fireEvent,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    symbols = H.SVGRenderer.prototype.symbols,
    UNDEFINED: undefined;

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.heatmap
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.HeatmapSeries>(
    'heatmap',
    'scatter',

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
     * @excluding    animationLimit, connectEnds, connectNulls, dashStyle,
     *               findNearestPointBy, getExtremesFromAll, jitter, linecap,
     *               lineWidth, marker, pointInterval, pointIntervalUnit,
     *               pointRange, pointStart, shadow, softThreshold, stacking,
     *               step, threshold, cluster
     * @product      highcharts highmaps
     * @optionparent plotOptions.heatmap
     */
    {

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
        nullColor: '${palette.neutralColor3}',

        dataLabels: {
            formatter: function (): (number|null) { // #2945
                return (this.point as Highcharts.HeatmapPoint).value;
            },
            inside: true,
            verticalAlign: 'middle',
            crop: false,
            overflow: false as any,
            padding: 0 // #3837
        },

        marker: {
            symbol: 'rect',
            /** @ignore-option */
            radius: 0,
            lineColor: UNDEFINED
        },

        clip: true,

        /** @ignore-option */
        pointRange: null, // dynamically set to colsize by default

        tooltip: {
            pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
        },

        states: {

            hover: {

                /** @ignore-option */
                halo: false, // #3406, halo is disabled on heatmaps by default

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

    }, merge(colorMapSeriesMixin, {

        pointArrayMap: ['y', 'value'],
        hasPointSpecificOptions: true,
        getExtremesFromAll: true,
        directTouch: true,

        /* eslint-disable valid-jsdoc */

        /**
         * Override the init method to add point ranges on both axes.
         *
         * @private
         * @function Highcharts.seriesTypes.heatmap#init
         * @return {void}
         */
        init: function (this: Highcharts.HeatmapSeries): void {
            var options;

            seriesTypes.scatter.prototype.init.apply(this, arguments as any);

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
        },
        getSymbol: seriesTypes.scatter.prototype.getSymbol,

        /**
         * @private
         * @function Highcharts.seriesTypes.heatmap#setClip
         * @return {void}
         */
        setClip: function (
            this: Highcharts.HeatmapSeries
        ): void {
            Series.prototype.setClip.apply(this, arguments);
            if (this.options.clip !== false && this.markerGroup) {
                this.markerGroup
                    .clip(this.chart.clipRect);
            }
        },

        /**
         * @private
         * @function Highcharts.seriesTypes.heatmap#translate
         * @return {void}
         */
        translate: function (this: Highcharts.HeatmapSeries): void {
            var series = this,
                options = series.options,
                symbol = options.marker && options.marker.symbol || '',
                shape = symbols[symbol] ? symbol : 'rect',
                options = series.options,
                hasRegularShape = ['circle', 'square'].indexOf(shape) !== -1;

            series.generatePoints();
            series.points.forEach(function (
                point: Highcharts.HeatmapPoint
            ): void {
                var pointAttr,
                    dif,
                    hasImage =
                        (point.marker && point.marker.symbol || shape || '')
                            .match(/url/),
                    cellAttr = point.getCellAttributes(),
                    shapeArgs = {
                        x: Math.min(cellAttr.x1, cellAttr.x2),
                        y: Math.min(cellAttr.y1, cellAttr.y2),
                        width: Math.max(Math.abs(cellAttr.x2 - cellAttr.x1), 0),
                        height: Math.max(Math.abs(cellAttr.y2 - cellAttr.y1), 0)
                    };

                // If marker shape is regular (symetric), find shorter
                // cell's side.
                if (hasRegularShape) {
                    dif = Math.abs(shapeArgs.width - shapeArgs.height);
                    shapeArgs.x = Math.min(cellAttr.x1, cellAttr.x2) +
                        (shapeArgs.width < shapeArgs.height ? 0 : dif / 2);
                    shapeArgs.y = Math.min(cellAttr.y1, cellAttr.y2) +
                        (shapeArgs.width < shapeArgs.height ? dif / 2 : 0);
                    shapeArgs.width = shapeArgs.height =
                        Math.min(shapeArgs.width, shapeArgs.height);
                }

                pointAttr = {
                    plotX: (cellAttr.x1 + cellAttr.x2) / 2,
                    plotY: (cellAttr.y1 + cellAttr.y2) / 2,
                    clientX: (cellAttr.x1 + cellAttr.x2) / 2,
                    shapeType: 'path',
                    shapeArgs: merge(true, shapeArgs, {
                        d: symbols[shape](
                            shapeArgs.x,
                            shapeArgs.y,
                            shapeArgs.width,
                            shapeArgs.height
                        )
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
        },
        /**
         * @private
         * @function Highcharts.seriesTypes.heatmap#pointAttribs
         * @param {Highcharts.HeatmapPoint} point
         * @param {string} state
         * @return {Highcharts.SVGAttributes}
         */
        pointAttribs: function (
            this: Highcharts.HeatmapSeries,
            point: Highcharts.HeatmapPoint,
            state?: string
        ): Highcharts.SVGAttributes {
            var attr = seriesTypes.scatter.prototype.pointAttribs
                    .call(this, point, state),
                seriesOptions = this.options || {},
                stateOptions,
                brightness;

            // Apply lineColor, or set it to default series color.
            attr.stroke = (point.marker && point.marker.lineColor ||
                seriesOptions.marker && seriesOptions.marker.lineColor ||
                this.color);

            if (state) {
                stateOptions = merge((seriesOptions.states as any)[state],
                    (
                        seriesOptions.marker &&
                        seriesOptions.marker.states as any
                    )[state],
                    point.options.states &&
                    (point.options.states as any)[state] || {});
                brightness = stateOptions.brightness;

                attr.fill =
                    stateOptions.color || (brightness !== UNDEFINED &&
                        H.color(attr.fill)
                            .brighten(brightness)
                            .get()) || attr.fill;

                attr.stroke = stateOptions.lineColor;
            }

            return attr;
        },
        /**
         * @private
         * @function Highcharts.seriesTypes.heatmap#markerAttribs
         * @param {Highcharts.HeatmapPoint} point
         * @return {Highcharts.SVGAttributes}
         */
        markerAttribs: function (
            this: Highcharts.HeatmapSeries,
            point: Highcharts.HeatmapPoint
        ): Highcharts.SVGAttributes {
            var symbol = (
                    point.marker &&
                    point.marker.symbol || (this.options.marker || {}).symbol
                ),
                shapeArgs = point.shapeArgs || {};

            point.hasImage = (symbol && symbol.indexOf('url') === 0) || false;

            if (point.hasImage) {
                return {
                    x: point.plotX,
                    y: point.plotY
                };
            }

            return {
                x: shapeArgs.x,
                y: shapeArgs.y,
                width: shapeArgs.width,
                height: shapeArgs.height
            };
        },

        /**
         * @private
         * @function Highcharts.seriesTypes.heatmap#drawPoints
         * @return {void}
         */
        drawPoints: function (this: Highcharts.HeatmapSeries): void {

            // In styled mode, use CSS, otherwise the fill used in the style
            // sheet will take precedence over the fill attribute.
            var func = this.chart.styledMode ? 'css' : 'animate',
                seriesMarkerOptions = this.options.marker || {};

            if (seriesMarkerOptions.enabled || this._hasPointMarkers) {
                seriesTypes.scatter.prototype.drawPoints.call(this);
                this.points.forEach(function (
                    point: Highcharts.HeatmapPoint
                ): void {
                    if (!point.isNull) {
                        point.graphic &&
                        point.graphic[func](this.colorAttribs(point));
                    }
                }, this);
            }
        },

        // Define hasData function for non-cartesian series.
        // Returns true if the series has points at all.
        hasData: function (this: Highcharts.HeatmapSeries): boolean {
            return !!this.processedXData.length; // != 0
        },

        // Override to also allow null points, used when building the k-d-tree
        // for tooltips in boost mode.
        getValidPoints: function (
            this: Highcharts.HeatmapSeries,
            points?: Array<Highcharts.HeatmapPoint>,
            insideOnly?: boolean
        ): Array<Highcharts.Point> {
            return Series.prototype.getValidPoints.call(
                this,
                points,
                insideOnly,
                true
            );
        },

        /**
         * @ignore
         * @deprecated
         * @function Highcharts.seriesTypes.heatmap#getBox
         */
        getBox: noop as any,

        /**
         * @private
         * @borrows Highcharts.LegendSymbolMixin.drawRectangle as Highcharts.seriesTypes.heatmap#drawLegendSymbol
         */
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,

        /**
         * @private
         * @borrows Highcharts.seriesTypes.column#alignDataLabel as Highcharts.seriesTypes.heatmap#alignDataLabel
         */
        alignDataLabel: seriesTypes.column.prototype.alignDataLabel,

        /**
         * @private
         * @function Highcharts.seriesTypes.heatmap#getExtremes
         * @return {void}
         */
        getExtremes: function (this: Highcharts.HeatmapSeries): void {
        // Get the extremes from the value data
            Series.prototype.getExtremes.call(this, this.valueData);
            this.valueMin = this.dataMin;
            this.valueMax = this.dataMax;

            // Get the extremes from the y data
            Series.prototype.getExtremes.call(this);
        },

        /**
         * @private
         * @borrows Highcharts.seriesTypes.line.setOptions as Highcharts.seriesTypes.heatmap#setOptions
         */
        setOptions: function (
            this: Highcharts.HeatmapSeries,
            itemOptions: Highcharts.SeriesOptionsType
        ): Highcharts.HeatmapSeriesOptions {
            var newOptions,
                propsMap = {
                    borderWidth: 'lineWidth',
                    borderColor: 'lineColor'
                };

            // Keep backward compatibility for borderWidth
            for (const prop in propsMap) {
                if (H.defined((itemOptions as any)[prop])) {
                    const markerOptions: Highcharts.Dictionary<number> = {};

                    markerOptions[(propsMap as any)[prop]] =
                        (itemOptions as any)[prop];

                    newOptions = merge(newOptions, itemOptions, {
                        marker: merge(itemOptions.marker, markerOptions)
                    });
                }
            }

            return Series.prototype.setOptions
                .apply(this, [newOptions || itemOptions]);
        }

        /* eslint-enable valid-jsdoc */

    }), merge(colorMapPointMixin, {

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

        /* eslint-disable valid-jsdoc */

        /**
         * @private
         * @function Highcharts.Point#haloPath
         * @param {number} size
         * @return {Highcharts.SVGPathArray}
         */
        haloPath: function (
            this: Highcharts.HeatmapPoint,
            size: number
        ): Highcharts.SVGPathArray {
            if (!size) {
                return [];
            }
            var rect = this.shapeArgs;

            return [
                'M',
                (rect as any).x - size,
                (rect as any).y - size,
                'L',
                (rect as any).x - size,
                (rect as any).y + (rect as any).height + size,
                (rect as any).x + (rect as any).width + size,
                (rect as any).y + (rect as any).height + size,
                (rect as any).x + (rect as any).width + size,
                (rect as any).y - size,
                'Z'
            ];
        },
        getCellAttributes: function (
            this: Highcharts.HeatmapPoint
        ): Highcharts.HeatmapPointCellAttributes {
            var point = this,
                series = point.series,
                seriesOptions = series.options,
                xPad = (seriesOptions.colsize || 1) / 2,
                yPad = (seriesOptions.rowsize || 1) / 2,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                seriesMarkerOptions = series.options.marker,
                pointPlacement = series.pointPlacementToXValue(), // #7860
                pointPadding = pick(
                    point.pointPadding, seriesOptions.pointPadding, 0
                ),
                cellAttr: Highcharts.HeatmapPointCellAttributes = {
                    x1: clamp(Math.round(xAxis.len -
                        (xAxis.translate(
                            point.x - xPad,
                            false,
                            true,
                            false,
                            true,
                            -pointPlacement
                        ) || 0)
                    ), -xAxis.len, 2 * xAxis.len),

                    x2: clamp(Math.round(xAxis.len -
                        (xAxis.translate(
                            point.x + xPad,
                            false,
                            true,
                            false,
                            true,
                            -pointPlacement
                        ) || 0)
                    ), -xAxis.len, 2 * xAxis.len),

                    y1: clamp(Math.round(
                        (yAxis.translate(
                            point.y - yPad,
                            false,
                            true,
                            false,
                            true
                        ) || 0)
                    ), -yAxis.len, 2 * yAxis.len),

                    y2: clamp(Math.round(
                        (yAxis.translate(
                            point.y + yPad,
                            false,
                            true,
                            false,
                            true
                        ) || 0)
                    ), -yAxis.len, 2 * yAxis.len)
                };

            // Handle marker's fixed width, and height values including border
            // and pointPadding while calculating cell attributes.
            ['width', 'height'].forEach(function (prop: string): void {
                const direction = prop === 'width' ? 'x' : 'y',
                    coords = [`${direction}1`, `${direction}2`];

                const side = Math.abs(
                        cellAttr[coords[0]] - cellAttr[coords[1]]
                    ),
                    borderWidth = seriesMarkerOptions &&
                        seriesMarkerOptions.lineWidth || 0,
                    plotPos = Math.abs(
                        cellAttr[coords[0]] + cellAttr[coords[1]]
                    ) / 2;


                if (
                    (seriesMarkerOptions as any)[prop] &&
                    (seriesMarkerOptions as any)[prop] < side
                ) {
                    cellAttr[coords[0]] = plotPos - (
                        (seriesMarkerOptions as any)[prop] / 2) -
                        (borderWidth / 2);

                    cellAttr[coords[1]] = plotPos + (
                        (seriesMarkerOptions as any)[prop] / 2) +
                        (borderWidth / 2);
                }

                // Handle pointPadding
                if (pointPadding) {
                    if (direction === 'y') {
                        coords.reverse();
                    }
                    cellAttr[coords[0]] += pointPadding;
                    cellAttr[coords[1]] -= pointPadding;
                }
            });

            return cellAttr;
        }

        /* eslint-enable valid-jsdoc */

    })
);

/**
 * A `heatmap` series. If the [type](#series.heatmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @productdesc {highcharts}
 * Requires `modules/heatmap`.
 *
 * @extends   series,plotOptions.heatmap
 * @excluding dataParser, dataURL, marker, pointRange, stack
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
 * @excluding marker
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

''; // adds doclets above to transpiled file
