/* *
 *
 *  Wind barb series module
 *
 *  (c) 2010-2020 Torstein Honsi
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
        class WindbarbPoint extends ColumnPoint implements OnSeriesPoint {
            public beaufort: string;
            public beaufortLevel: number;
            public direction: number;
            public options: WindbarbPointOptions;
            public series: WindbarbSeries;
            public value: number;
            public isValid(): boolean;
        }
        class WindbarbSeries extends ColumnSeries implements OnSeriesSeries {
            public beaufortFloor: Array<number>;
            public beaufortName: Array<string>;
            public data: Array<WindbarbPoint>;
            public getPlotBox: OnSeriesMixin['getPlotBox'];
            public onSeries: OnSeriesSeries['onSeries'];
            public options: WindbarbSeriesOptions;
            public parallelArrays: Array<string>;
            public pointArrayMap: Array<string>;
            public pointClass: typeof WindbarbPoint;
            public points: Array<WindbarbPoint>;
            public trackerGroups: Array<string>;
            public animate(init?: boolean): void;
            public drawPoints(): void;
            public init(chart: Chart, options: WindbarbSeriesOptions): void;
            public markerAttribs(
                point: WindbarbPoint,
                state?: string
            ): SVGAttributes;
            public pointAttribs(
                point: WindbarbPoint,
                state?: string
            ): SVGAttributes;
            public translate(): void;
            public windArrow(point: WindbarbPoint): (SVGElement|SVGPathArray);
        }
        interface DataGroupingApproximationsDictionary {
            windbarb?(
                values: Array<number>,
                directions: Array<number>
            ): Array<number>;
        }
        interface SeriesTypesDictionary {
            windbarb: typeof WindbarbSeries;
        }
        interface WindbarbPointOptions extends ColumnPointOptions {
            direction?: number;
            value?: number;
        }
        interface WindbarbSeriesOptions extends ColumnSeriesOptions {
            onSeries?: (string|null);
            states?: SeriesStatesOptionsObject<WindbarbSeries>;
            vectorLength?: number;
            xOffset?: number;
            yOffset?: number;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    animObject,
    isNumber,
    pick
} = U;

import onSeriesMixin from '../mixins/on-series.js';

var noop = H.noop,
    seriesType = H.seriesType;

// eslint-disable-next-line valid-jsdoc
/**
 * Once off, register the windbarb approximation for data grouping. This can be
 * called anywhere (not necessarily in the translate function), but must happen
 * after the data grouping module is loaded and before the wind barb series uses
 * it.
 * @private
 */
function registerApproximation(): void {
    if (H.approximations && !H.approximations.windbarb) {
        H.approximations.windbarb = function (
            values: Array<number>,
            directions: Array<number>
        ): Array<number> {
            var vectorX = 0,
                vectorY = 0,
                i,
                len = values.length;

            for (i = 0; i < len; i++) {
                vectorX += values[i] * Math.cos(
                    directions[i] * H.deg2rad
                );
                vectorY += values[i] * Math.sin(
                    directions[i] * H.deg2rad
                );
            }

            return [
                // Wind speed
                values.reduce(function (sum: number, value: number): number {
                    return sum + value;
                }, 0) / values.length,
                // Wind direction
                Math.atan2(vectorY, vectorX) / H.deg2rad
            ];
        };
    }
}

registerApproximation();

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.windbarb
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.WindbarbSeries>('windbarb', 'column'

    /**
     * Wind barbs are a convenient way to represent wind speed and direction in
     * one graphical form. Wind direction is given by the stem direction, and
     * wind speed by the number and shape of barbs.
     *
     * @sample {highcharts|highstock} highcharts/demo/windbarb-series/
     *         Wind barb series
     *
     * @extends      plotOptions.column
     * @excluding    boostThreshold, marker, connectEnds, connectNulls,
     *               cropThreshold, dashStyle, dragDrop, gapSize, gapUnit,
     *               linecap, shadow, stacking, step
     * @since        6.0.0
     * @product      highcharts highstock
     * @requires     modules/windbarb
     * @optionparent plotOptions.windbarb
     */
    , {
        /**
         * Data grouping options for the wind barbs. In Highcharts, this
         * requires the `modules/datagrouping.js` module to be loaded. In
         * Highstock, data grouping is included.
         *
         * @sample  highcharts/plotoptions/windbarb-datagrouping
         *          Wind barb with data grouping
         *
         * @since   7.1.0
         * @product highcharts highstock
         */
        dataGrouping: {
            /**
             * Whether to enable data grouping.
             *
             * @product highcharts highstock
             */
            enabled: true,
            /**
             * Approximation function for the data grouping. The default
             * returns an average of wind speed and a vector average direction
             * weighted by wind speed.
             *
             * @product highcharts highstock
             *
             * @type {string|Function}
             */
            approximation: 'windbarb',
            /**
             * The approximate data group width.
             *
             * @product highcharts highstock
             */
            groupPixelWidth: 30
        },
        /**
         * The line width of the wind barb symbols.
         */
        lineWidth: 2,
        /**
         * The id of another series in the chart that the wind barbs are
         * projected on. When `null`, the wind symbols are drawn on the X axis,
         * but offset up or down by the `yOffset` setting.
         *
         * @sample {highcharts|highstock} highcharts/plotoptions/windbarb-onseries
         *         Projected on area series
         *
         * @type {string|null}
         */
        onSeries: null,
        states: {
            hover: {
                lineWidthPlus: 0
            }
        },
        tooltip: {
            /**
             * The default point format for the wind barb tooltip. Note the
             * `point.beaufort` property that refers to the Beaufort wind scale.
             * The names can be internationalized by modifying
             * `Highcharts.seriesTypes.windbarb.prototype.beaufortNames`.
             */
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.value}</b> ({point.beaufort})<br/>'
        },
        /**
         * Pixel length of the stems.
         */
        vectorLength: 20,
        /**
         * @default   value
         */
        colorKey: 'value',
        /**
         * Vertical offset from the cartesian position, in pixels. The default
         * value makes sure the symbols don't overlap the X axis when `onSeries`
         * is `null`, and that they don't overlap the linked series when
         * `onSeries` is given.
         */
        yOffset: -20,
        /**
         * Horizontal offset from the cartesian position, in pixels. When the
         * chart is inverted, this option allows translation like
         * [yOffset](#plotOptions.windbarb.yOffset) in non inverted charts.
         *
         * @since 6.1.0
         */
        xOffset: 0
    }, {
        pointArrayMap: ['value', 'direction'],
        parallelArrays: ['x', 'value', 'direction'],
        beaufortName: ['Calm', 'Light air', 'Light breeze',
            'Gentle breeze', 'Moderate breeze', 'Fresh breeze',
            'Strong breeze', 'Near gale', 'Gale', 'Strong gale', 'Storm',
            'Violent storm', 'Hurricane'],
        beaufortFloor: [0, 0.3, 1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8,
            24.5, 28.5, 32.7], // @todo dictionary with names?
        trackerGroups: ['markerGroup'],

        init: function (
            this: Highcharts.WindbarbSeries,
            chart: Highcharts.Chart,
            options: Highcharts.WindbarbSeriesOptions
        ): void {
            registerApproximation();
            H.Series.prototype.init.call(this, chart, options);
        },

        // Get presentational attributes.
        pointAttribs: function (
            this: Highcharts.WindbarbSeries,
            point: Highcharts.WindbarbPoint,
            state?: string
        ): Highcharts.SVGAttributes {
            var options = this.options,
                stroke = point.color || this.color,
                strokeWidth = this.options.lineWidth;

            if (state) {
                stroke = (options.states as any)[state].color || stroke;
                strokeWidth =
                ((options.states as any)[state].lineWidth || strokeWidth) +
                ((options.states as any)[state].lineWidthPlus || 0);
            }

            return {
                'stroke': stroke,
                'stroke-width': strokeWidth
            };
        },
        markerAttribs: function (): undefined {
            return;
        } as any,
        getPlotBox: onSeriesMixin.getPlotBox,
        // Create a single wind arrow. It is later rotated around the zero
        // centerpoint.
        windArrow: function (
            this: Highcharts.WindbarbSeries,
            point: Highcharts.WindbarbPoint
        ): (Highcharts.SVGElement|Highcharts.SVGPathArray) {
            var knots = point.value * 1.943844,
                level = point.beaufortLevel,
                path: Highcharts.SVGPathArray,
                barbs,
                u = (this.options.vectorLength as any) / 20,
                pos = -10;

            if (point.isNull) {
                return [];
            }

            if (level === 0) {
                return this.chart.renderer.symbols.circle(
                    -10 * u,
                    -10 * u,
                    20 * u,
                    20 * u
                );
            }

            // The stem and the arrow head
            path = [
                'M', 0, 7 * u, // base of arrow
                'L', -1.5 * u, 7 * u,
                0, 10 * u,
                1.5 * u, 7 * u,
                0, 7 * u,
                0, -10 * u// top
            ];

            // For each full 50 knots, add a pennant
            barbs = (knots - knots % 50) / 50; // pennants
            if (barbs > 0) {
                while (barbs--) {
                    path.push(
                        pos === -10 ? 'L' : 'M',
                        0,
                        pos * u,
                        'L',
                        5 * u,
                        pos * u + 2,
                        'L',
                        0,
                        pos * u + 4

                    );

                    // Substract from the rest and move position for next
                    knots -= 50;
                    pos += 7;
                }
            }

            // For each full 10 knots, add a full barb
            barbs = (knots - knots % 10) / 10;
            if (barbs > 0) {
                while (barbs--) {
                    path.push(
                        pos === -10 ? 'L' : 'M',
                        0,
                        pos * u,
                        'L',
                        7 * u,
                        pos * u
                    );
                    knots -= 10;
                    pos += 3;
                }
            }

            // For each full 5 knots, add a half barb
            barbs = (knots - knots % 5) / 5; // half barbs
            if (barbs > 0) {
                while (barbs--) {
                    path.push(
                        pos === -10 ? 'L' : 'M',
                        0,
                        pos * u,
                        'L',
                        4 * u,
                        pos * u
                    );
                    knots -= 5;
                    pos += 3;
                }
            }
            return path;
        },

        translate: function (this: Highcharts.WindbarbSeries): void {
            var beaufortFloor = this.beaufortFloor,
                beaufortName = this.beaufortName;

            onSeriesMixin.translate.call(this);

            this.points.forEach(function (
                point: Highcharts.WindbarbPoint
            ): void {
                var level = 0;

                // Find the beaufort level (zero based)
                for (; level < beaufortFloor.length; level++) {
                    if (beaufortFloor[level] > point.value) {
                        break;
                    }
                }
                point.beaufortLevel = level - 1;
                point.beaufort = beaufortName[level - 1];

            });

        },

        drawPoints: function (this: Highcharts.WindbarbSeries): void {
            var chart = this.chart,
                yAxis = this.yAxis,
                inverted = chart.inverted,
                shapeOffset = (this.options.vectorLength as any) / 2;

            this.points.forEach(function (
                point: Highcharts.WindbarbPoint
            ): void {
                var plotX = point.plotX,
                    plotY = point.plotY;

                // Check if it's inside the plot area, but only for the X
                // dimension.
                if (
                    this.options.clip === false ||
                    chart.isInsidePlot(plotX as any, 0, false)
                ) {
                    // Create the graphic the first time
                    if (!point.graphic) {
                        point.graphic = this.chart.renderer
                            .path()
                            .add(this.markerGroup)
                            .addClass(
                                'highcharts-point ' +
                                'highcharts-color-' +
                                pick(point.colorIndex, point.series.colorIndex)
                            );
                    }

                    // Position the graphic
                    point.graphic
                        .attr({
                            d: this.windArrow(point) as any,
                            translateX: (plotX as any) + this.options.xOffset,
                            translateY: (plotY as any) + this.options.yOffset,
                            rotation: point.direction
                        });

                    if (!this.chart.styledMode) {
                        point.graphic
                            .attr(this.pointAttribs(point));
                    }

                } else if (point.graphic) {
                    point.graphic = point.graphic.destroy();
                }

                // Set the tooltip anchor position
                point.tooltipPos = [
                    (plotX as any) + this.options.xOffset +
                        (inverted && !this.onSeries ? shapeOffset : 0),
                    (plotY as any) + this.options.yOffset -
                        (inverted ?
                            0 :
                            shapeOffset + (yAxis.pos as any) - chart.plotTop
                        )
                ]; // #6327
            }, this);
        },

        // Fade in the arrows on initializing series.
        animate: function (
            this: Highcharts.WindbarbSeries,
            init?: boolean
        ): void {
            if (init) {
                (this.markerGroup as any).attr({
                    opacity: 0.01
                });
            } else {
                (this.markerGroup as any).animate({
                    opacity: 1
                }, animObject(this.options.animation));

                this.animate = null as any;
            }
        },

        // Don't invert the marker group (#4960)
        invertGroups: noop as any,

        // No data extremes for the Y axis
        getExtremes: noop as any
    }, {
        isValid: function (this: Highcharts.WindbarbPoint): boolean {
            return isNumber(this.value) && this.value >= 0;
        }
    }
);

/**
 * A `windbarb` series. If the [type](#series.windbarb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.windbarb
 * @excluding dataParser, dataURL
 * @product   highcharts highstock
 * @requires  modules/windbarb
 * @apioption series.windbarb
 */

/**
 * An array of data points for the series. For the `windbarb` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 3 values. In this case, the values correspond to
 *    `x,value,direction`. If the first value is a string, it is applied as the
 *    name of the point, and the `x` value is inferred.
 *    ```js
 *       data: [
 *           [Date.UTC(2017, 0, 1, 0), 3.3, 90],
 *           [Date.UTC(2017, 0, 1, 1), 12.1, 180],
 *           [Date.UTC(2017, 0, 1, 2), 11.1, 270]
 *       ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.area.turboThreshold), this option is not
 *    available.
 *    ```js
 *       data: [{
 *           x: Date.UTC(2017, 0, 1, 0),
 *           value: 12.1,
 *           direction: 90
 *       }, {
 *           x: Date.UTC(2017, 0, 1, 1),
 *           value: 11.1,
 *           direction: 270
 *       }]
 *    ```
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
 * @type      {Array<Array<(number|string),number,number>|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.windbarb.data
 */

/**
 * The wind speed in meters per second.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.windbarb.data.value
 */

/**
 * The wind direction in degrees, where 0 is north (pointing towards south).
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.windbarb.data.direction
 */

''; // adds doclets above to transpiled file
