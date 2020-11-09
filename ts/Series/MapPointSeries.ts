/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type ScatterPoint from './Scatter/ScatterPoint';
import type ScatterPointOptions from './Scatter/ScatterPointOptions';
import type ScatterSeriesOptions from './Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../Core/Series/SeriesOptions';
import BaseSeries from '../Core/Series/Series.js';
const {
    seriesTypes: {
        line: LineSeries,
        scatter: ScatterSeries
    }
} = BaseSeries;
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface MapPointPointOptions extends ScatterPointOptions {
            lat?: number;
            lon?: number;
            x?: number;
            y?: (number|null);
        }
        interface MapPointSeriesOptions extends ScatterSeriesOptions {
            states?: SeriesStatesOptions<MapPointSeries>;
        }
    }
}

import '../Core/Options.js';
import '../Series/Scatter/ScatterSeries.js';

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.mappoint
 *
 * @augments Highcharts.Series
 */
class MapPointSeries extends ScatterSeries {

    /**
     * A mappoint series is a special form of scatter series where the points
     * can be laid out in map coordinates on top of a map.
     *
     * @sample maps/demo/mapline-mappoint/
     *         Map-line and map-point series.
     *
     * @extends      plotOptions.scatter
     * @product      highmaps
     * @optionparent plotOptions.mappoint
     */
    public static defaultOptions: Highcharts.MapPointSeriesOptions = merge(ScatterSeries.defaultOptions, {
        dataLabels: {
            crop: false,
            defer: false,
            enabled: true,
            formatter: function (
                this: Point.PointLabelObject
            ): (string|undefined) { // #2945
                return this.point.name;
            },
            overflow: false as any,
            style: {
                /** @internal */
                color: '${palette.neutralColor100}'
            }
        }
    } as Highcharts.MapPointSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<MapPointPoint> = void 0 as any;

    public options: Highcharts.MapPointSeriesOptions = void 0 as any;

    public points: Array<MapPointPoint> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public drawDataLabels(): void {
        super.drawDataLabels();
        if (this.dataLabelsGroup) {
            this.dataLabelsGroup.clip(this.chart.clipRect);
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

extend(MapPointSeries.prototype, {
    type: 'mappoint',
    forceDL: true
});

/* *
 *
 *  Class
 *
 * */

class MapPointPoint extends ScatterSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public options: Highcharts.MapPointPointOptions = void 0 as any;

    public series: MapPointSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public applyOptions(
        options: (Highcharts.MapLatLonObject&Highcharts.MapPointPointOptions),
        x?: number
    ): MapPointPoint {
        var mergedOptions = (
            typeof options.lat !== 'undefined' &&
            typeof options.lon !== 'undefined' ?
                merge(
                    options, this.series.chart.fromLatLonToPoint(options)
                ) :
                options
        );

        return (
            Point.prototype
                .applyOptions.call(this, mergedOptions, x) as any
        );
    }

    /* eslint-enable valid-jsdoc */

}
MapPointSeries.prototype.pointClass = MapPointPoint;

/* *
 *
 *  Registry
 *
 * */

declare module '../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        mappoint: typeof MapPointSeries;
    }
}
BaseSeries.registerSeriesType('mappoint', MapPointSeries);

/* *
 *
 *  Default Export
 *
 * */

export default MapPointSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `mappoint` series. If the [type](#series.mappoint.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.mappoint
 * @excluding dataParser, dataURL
 * @product   highmaps
 * @apioption series.mappoint
 */

/**
 * An array of data points for the series. For the `mappoint` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *        data: [
 *            [0, 1],
 *            [1, 8],
 *            [2, 7]
 *        ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.mappoint.turboThreshold),
 *    this option is not available.
 *    ```js
 *        data: [{
 *            x: 1,
 *            y: 7,
 *            name: "Point2",
 *            color: "#00FF00"
 *        }, {
 *            x: 1,
 *            y: 4,
 *            name: "Point1",
 *            color: "#FF00FF"
 *        }]
 *    ```
 *
 * @type      {Array<number|Array<number,(number|null)>|null|*>}
 * @extends   series.map.data
 * @excluding labelrank, middleX, middleY, path, value
 * @product   highmaps
 * @apioption series.mappoint.data
 */

/**
 * The latitude of the point. Must be combined with the `lon` option
 * to work. Overrides `x` and `y` values.
 *
 * @sample {highmaps} maps/demo/mappoint-latlon/
 *         Point position by lat/lon
 *
 * @type      {number}
 * @since     1.1.0
 * @product   highmaps
 * @apioption series.mappoint.data.lat
 */

/**
 * The longitude of the point. Must be combined with the `lon` option
 * to work. Overrides `x` and `y` values.
 *
 * @sample {highmaps} maps/demo/mappoint-latlon/
 *         Point position by lat/lon
 *
 * @type      {number}
 * @since     1.1.0
 * @product   highmaps
 * @apioption series.mappoint.data.lon
 */

/**
 * The x coordinate of the point in terms of the map path coordinates.
 *
 * @sample {highmaps} maps/demo/mapline-mappoint/
 *         Map point demo
 *
 * @type      {number}
 * @product   highmaps
 * @apioption series.mappoint.data.x
 */

/**
 * The x coordinate of the point in terms of the map path coordinates.
 *
 * @sample {highmaps} maps/demo/mapline-mappoint/
 *         Map point demo
 *
 * @type      {number|null}
 * @product   highmaps
 * @apioption series.mappoint.data.y
 */

''; // adds doclets above to transpiled file
