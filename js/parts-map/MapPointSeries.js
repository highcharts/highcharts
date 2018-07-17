/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/ScatterSeries.js';
var merge = H.merge,
    Point = H.Point,
    seriesType = H.seriesType;

/**
 * A mappoint series is a special form of scatter series where the points can
 * be laid out in map coordinates on top of a map.
 *
 * @sample maps/demo/mapline-mappoint/ Map-line and map-point series.
 * @extends plotOptions.scatter
 * @product highmaps
 * @optionparent plotOptions.mappoint
 */
seriesType('mappoint', 'scatter', {

    dataLabels: {
        /**
         * @default {point.name}
         * @apioption plotOptions.mappoint.dataLabels.format
         */
        enabled: true,
        formatter: function () { // #2945
            return this.point.name;
        },
        crop: false,
        defer: false,
        overflow: false,
        style: {
            color: '${palette.neutralColor100}'
        }
    }

// Prototype members
}, {
    type: 'mappoint',
    forceDL: true

// Point class
}, {
    applyOptions: function (options, x) {
        var mergedOptions = (
            options.lat !== undefined &&
            options.lon !== undefined ?
                merge(options, this.series.chart.fromLatLonToPoint(options)) :
                options
        );
        return Point.prototype.applyOptions.call(this, mergedOptions, x);
    }
});

/**
 * A `mappoint` series. If the [type](#series.mappoint.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @type {Object}
 * @extends series,plotOptions.mappoint
 * @excluding dataParser,dataURL
 * @product highmaps
 * @apioption series.mappoint
 */

/**
 * An array of data points for the series. For the `mappoint` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. The `x` values will be automatically
 * calculated, either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options. If the axis has
 * categories, these will be used. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `x,y`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 1],
 *         [1, 8],
 *         [2, 7]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.mappoint.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 7,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type {Array<Object|Array|Number>}
 * @extends series.map.data
 * @excluding labelrank,middleX,middleY,path,value
 * @product highmaps
 * @apioption series.mappoint.data
 */

/**
 * The latitude of the point. Must be combined with the `lon` option
 * to work. Overrides `x` and `y` values.
 *
 * @type {Number}
 * @sample {highmaps} maps/demo/mappoint-latlon/ Point position by lat/lon
 * @since 1.1.0
 * @product highmaps
 * @apioption series.mappoint.data.lat
 */

/**
 * The longitude of the point. Must be combined with the `lon` option
 * to work. Overrides `x` and `y` values.
 *
 * @type {Number}
 * @sample {highmaps} maps/demo/mappoint-latlon/ Point position by lat/lon
 * @since 1.1.0
 * @product highmaps
 * @apioption series.mappoint.data.lon
 */

/**
 * The x coordinate of the point in terms of the map path coordinates.
 *
 * @type {Number}
 * @sample {highmaps} maps/demo/mapline-mappoint/ Map point demo
 * @product highmaps
 * @apioption series.mappoint.data.x
 */

/**
 * The x coordinate of the point in terms of the map path coordinates.
 *
 * @type {Number}
 * @sample {highmaps} maps/demo/mapline-mappoint/ Map point demo
 * @product highmaps
 * @apioption series.mappoint.data.y
 */
