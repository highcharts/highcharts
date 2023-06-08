/* *
 *
 *  (c) 2010-2023 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
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

import type GeoHeatmapSeriesOptions from './GeoHeatmapSeriesOptions.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import GeoHeatmapPoint from './GeoHeatmapPoint.js';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import H from '../../Core/Globals.js';
const {
    doc
} = H;

const {
    seriesTypes: {
        map: MapSeries
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';

const {
    extend,
    merge,
    pick,
    defined
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * The Geo Heatmap series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.geoheatmap
 *
 * @augments Highcharts.Series
 */

class GeoHeatmapSeries extends MapSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A `geoheatmap` series is a variety of heatmap series, composed into
     * the map projection, where the units are expressed in the latitude
     * and longitude, and individual values contained in a matrix are
     * represented as colors.
     *
     * @sample maps/demo/geoheatmap-europe/
     *         GeoHeatmap Chart on the Orthographic Projection
     * @sample maps/demo/geoheatmap-equalearth/
     *         GeoHeatmap Chart on the Equal Earth Projection
     *
     * @extends      plotOptions.map
     * @since 11.0.0
     * @product      highmaps
     * @excluding    allAreas, dragDrop, findNearestPointBy, geometry, joinBy, negativeColor, onPoint,
     * @requires     modules/geoheatmap
     * @optionparent plotOptions.geoheatmap
     */

    public static defaultOptions: GeoHeatmapSeriesOptions =
        merge(MapSeries.defaultOptions, {

            nullColor: 'transparent',

            tooltip: {
                pointFormat: 'Lat: {point.lat}, Lon: {point.lon}, Value: {point.value}<br/>'
            },

            /**
             * The border width of each geoheatmap tile.
             *
             * In styled mode, the border stroke width is given in the
             * `.highcharts-point` class.
             *
             * @sample maps/demo/geoheatmap-orthographic/
             *         borderWidth set to 1 to create a grid
             *
             * @type      {number|null}
             * @default   0
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.borderWidth
             */
            borderWidth: 0,

            /**
             * The column size - how many longitude units each column in the
             * geoheatmap should span.
             *
             * @sample maps/demo/geoheatmap-europe/
             *         1 by default, set to 5
             *
             * @type      {number}
             * @default   1
             * @since 11.0.0
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.colsize
             */
            colsize: 1,

            /**
             * The main color of the series. In heat maps this color is rarely
             * used, as we mostly use the color to denote the value of each
             * point. Unless options are set in the [colorAxis](#colorAxis), the
             * default value is pulled from the [options.colors](#colors) array.
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since 11.0.0
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.color
             */

            /**
             * The rowsize size - how many latitude units each row in the
             * geoheatmap should span.
             *
             * @sample maps/demo/geoheatmap-europe/
             *         1 by default, set to 5
             *
             * @type      {number}
             * @default   1
             * @since 11.0.0
             * @product   highmaps
             * @apioption plotOptions.geoheatmap.rowsize
             */
            rowsize: 1

        } as GeoHeatmapSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public options: GeoHeatmapSeriesOptions = void 0 as any;

    public data: Array<GeoHeatmapPoint> = void 0 as any;

    public points: Array<GeoHeatmapPoint> = void 0 as any;

    public canvas?: HTMLCanvasElement = void 0 as any;

    public context?: CanvasRenderingContext2D = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * For updated colsize and rowsize options
     * @private
     */
    public update(): void {
        const series = this;

        series.options = merge(series.options, arguments[0]);
        super.update.apply(series, arguments);
    }

    /**
     * Overriding drawPoints original method to apply new features.
     * @private
     */
    public drawPoints(): void {
        const
            series = this,
            chart = series.chart,
            mapView = chart.mapView,
            seriesOptions = series.options,
            interpolation = seriesOptions.interpolation;

        if (interpolation && mapView) {
            const
                {
                    image,
                    chart
                } = series,
                [colsize, rowsize] = [
                    pick(seriesOptions.colsize, 1),
                    pick(seriesOptions.rowsize, 1)
                ],
                visiblePoints = series.points.filter(
                    (point): boolean => point.visible),
                lonData = visiblePoints.map(
                    (point): number => pick(point.options.lon, 0)
                ),
                latData = visiblePoints.map(
                    (point): number => pick(point.options.lat, 0)
                ),
                // Calculate dimensions based on lon/lat without creating actual
                // points on the chart
                minLonData = Math.min(...lonData),
                maxLonData = Math.max(...lonData),
                minLatData = Math.min(...latData),
                maxLatData = Math.max(...latData),
                lonRange = maxLonData - minLonData,
                latRange = maxLatData - minLatData,
                leftMiddle = mapView.lonLatToPixels({
                    lon: minLonData,
                    lat: (minLatData + maxLatData) / 2
                }),
                rightMiddle = mapView.lonLatToPixels({
                    lon: maxLonData,
                    lat: (minLatData + maxLatData) / 2
                }),
                topMiddle = mapView.lonLatToPixels({
                    lon: (minLonData + maxLatData) / 2,
                    lat: maxLatData
                }),
                bottomMiddle = mapView.lonLatToPixels({
                    lon: (minLonData + maxLatData) / 2,
                    lat: minLatData
                });

            if (
                leftMiddle &&
                topMiddle &&
                rightMiddle &&
                bottomMiddle
            ) {
                const dimensions = {
                    x: leftMiddle.x,
                    y: topMiddle.y,
                    width: rightMiddle.x - leftMiddle.x,
                    height: bottomMiddle.y - topMiddle.y
                };

                if (
                    !image ||
                    // Orthographic should be always updated with new image
                    mapView.projection.options.name === 'Orthographic'
                ) {
                    if (image) {
                        image.destroy();
                    }
                    const
                        colorAxis = (
                            chart.colorAxis &&
                            chart.colorAxis[0]
                        ),
                        ctx = series.getContext(),
                        canvas = series.canvas;

                    if (canvas && ctx && colorAxis) {
                        const canvasWidth = canvas.width = ~~(
                                lonRange / colsize
                            ),
                            canvasHeight = canvas.height = ~~(
                                latRange / rowsize
                            ),
                            colorFromPoint = (p: any): number[] => {
                                const rgba = ((
                                    colorAxis.toColor(
                                        p.value ||
                                        0,
                                        pick(p)
                                    ) as string)
                                    .split(')')[0]
                                    .split('(')[1]
                                    .split(',')
                                    .map((s): number => pick(
                                        parseFloat(s),
                                        parseInt(s, 10)
                                    ))
                                );
                                rgba[3] = pick(rgba[3], 1.0) * 255;
                                return rgba;
                            };

                        // Pixels extreme values needed for normalizion, should
                        // be refactored TO DO
                        const minX = Math.min(...(series.points.map(
                            (point): number => (point.projectedPath as any).map(
                                (el: any): number => el[1])) as any)
                            .flat().filter((el: any): boolean =>
                                defined(el)));

                        const maxX = Math.max(...(series.points.map(
                            (point): number => (point.projectedPath as any).map(
                                (el: any): number => el[1])) as any)
                            .flat().filter((el: any): boolean =>
                                defined(el)));

                        const minY = Math.min(...(series.points.map(
                            (point): number => (point.projectedPath as any).map(
                                (el: any): number => el[2])) as any)
                            .flat().filter((el: any): boolean =>
                                defined(el)));

                        const maxY = Math.max(...(series.points.map(
                            (point): number => (point.projectedPath as any).map(
                                (el: any): number => el[2])) as any)
                            .flat().filter((el: any): boolean =>
                                defined(el)));

                        const distanceX = maxX - minX,
                            distanceY = maxY - minY;

                        for (let i = 0; i < series.points.length; i++) {
                            const point = series.points[i];
                            if (!point.isNull) {
                                const path = JSON.parse(
                                    JSON.stringify(point.projectedPath));
                                // Normalize SVGPath to values 0-1 * canvas
                                // Similiar to PixelData
                                if (path) {
                                    path.forEach((el: any): void => {
                                        if (el[0] !== 'Z') {
                                            el[1] += Math.abs(minX);
                                            el[2] = maxY - el[2];

                                            el[1] /= distanceX;
                                            el[2] /= distanceY;

                                            el[1] *= canvasWidth;
                                            el[2] *= canvasHeight;
                                        }
                                    });

                                    const p = new Path2D(path.flat().join(' '));
                                    const color = colorFromPoint(point);
                                    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
                                    ctx.fill(p);
                                }
                            }
                        }

                        series.image = chart.renderer.image(
                            canvas.toDataURL()
                        )
                            .attr(dimensions)
                            .add(series.group);
                    }
                } else if (
                    image.width !== dimensions.width ||
                    image.height !== dimensions.height
                ) {
                    image.attr(dimensions);
                }
            }
        } else {
            super.drawPoints.apply(series, arguments);
        }
    }

    /**
     * Method responsible for creating a canvas for interpolation image.
     * @private
     */
    public getContext(): CanvasRenderingContext2D | undefined {
        const series = this,
            { canvas, context } = series;
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            series.canvas = doc.createElement('canvas');

            series.context = series.canvas.getContext('2d') || void 0;
            return series.context;
        }

        return context;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface GeoHeatmapSeries {
    pointClass: typeof GeoHeatmapPoint;
    pointArrayMap: Array<string>;
    image?: SVGElement
}
extend(GeoHeatmapSeries.prototype, {
    type: 'geoheatmap',
    pointClass: GeoHeatmapPoint,
    pointArrayMap: ['lon', 'lat', 'value']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        geoheatmap: typeof GeoHeatmapSeries;
    }
}
SeriesRegistry.registerSeriesType('geoheatmap', GeoHeatmapSeries);

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `geoheatmap` series. If the [type](#series.map.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.geoheatmap
 * @excluding allAreas, dataParser, dataURL, dragDrop, findNearestPointBy,
 *            joinBy, marker, mapData, negativeColor, onPoint, shadow
 * @product   highmaps
 * @apioption series.geoheatmap
 */

/**
 * An array of data points for the series. For the `geoheatmap` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `lon,lat,value`. The `value` refers to the color on the `colorAxis`.
 *
 *  ```js
 *     data: [
 *         [51.50, -0.12, 7],
 *         [54.59, -5.93, 4],
 *         [55.8, -4.25, 3]
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
 *         lat: 51.50,
 *         lon: -0.12,
 *         value: 7,
 *         name: "London"
 *     }, {
 *         lat: 54.59,
 *         lon: -5.93,
 *         value: 4,
 *         name: "Belfast"
 *     }]
 *  ```
 *
 * @sample maps/demo/geoheatmap-europe/
 *         GeoHeatmap Chart on the Orthographic Projection
 * @sample maps/demo/geoheatmap-equalearth/
 *         GeoHeatmap Chart on the Equal Earth Projection
 *
 * @type      {Array<Array<number>|*>}
 * @extends   series.map.data
 * @product   highmaps
 * @apioption series.geoheatmap.data
 */

/**
 * Individual color for the point. By default the color is either used
 * to denote the value, or pulled from the global `colors` array.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highmaps
 * @apioption series.geoheatmap.data.color
 */

/**
 * The value of the point, resulting in a color controled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.geoheatmap.data.value
 */

''; // adds doclets above to the transpiled file
