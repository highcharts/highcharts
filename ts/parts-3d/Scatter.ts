/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  Scatter 3D series.
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
        interface Scatter3dPointOptions extends ScatterPointOptions {
            z?: number;
        }
        interface Scatter3dSeriesOptions extends ScatterSeriesOptions {
        }
        interface SeriesTypesDictionary {
            scatter3d: typeof Scatter3dSeries;
        }
        class Scatter3dPoint extends ScatterPoint {
            public options: Scatter3dPointOptions;
            public series: Scatter3dSeries;
        }
        class Scatter3dSeries extends ScatterSeries {
            public data: Array<Scatter3dPoint>;
            public options: Scatter3dSeriesOptions;
            public pointClass: typeof Scatter3dPoint;
            public points: Array<Scatter3dPoint>;
        }
    }
}

import '../parts/Utilities.js';

var Point = H.Point,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.scatter3d
 *
 * @augments Highcharts.Series
 */
seriesType(
    'scatter3d',
    'scatter',
    /**
     * A 3D scatter plot uses x, y and z coordinates to display values for three
     * variables for a set of data.
     *
     * @sample {highcharts} highcharts/3d/scatter/
     *         Simple 3D scatter
     * @sample {highcharts} highcharts/demo/3d-scatter-draggable
     *         Draggable 3d scatter
     *
     * @extends      plotOptions.scatter
     * @excluding    dragDrop
     * @product      highcharts
     * @optionparent plotOptions.scatter3d
     */
    {
        tooltip: {
            pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>'
        }

    // Series class
    }, {
        pointAttribs: function (
            this: Highcharts.Scatter3dSeries,
            point: Highcharts.Scatter3dPoint
        ): Highcharts.SVGAttributes {
            var attribs = seriesTypes.scatter.prototype.pointAttribs
                .apply(this, arguments as any);

            if (this.chart.is3d() && point) {
                attribs.zIndex =
                    H.pointCameraDistance(point as any, this.chart);
            }

            return attribs;
        },
        axisTypes: ['xAxis', 'yAxis', 'zAxis'],
        pointArrayMap: ['x', 'y', 'z'],
        parallelArrays: ['x', 'y', 'z'],

        // Require direct touch rather than using the k-d-tree, because the
        // k-d-tree currently doesn't take the xyz coordinate system into
        // account (#4552)
        directTouch: true

    // Point class
    }, {
        applyOptions: function (
            this: Highcharts.Scatter3dPoint
        ): Highcharts.Scatter3dPoint {
            Point.prototype.applyOptions.apply(this, arguments as any);
            if (this.z === undefined) {
                this.z = 0;
            }

            return this;
        }

    }
);


/**
 * A `scatter3d` series. If the [type](#series.scatter3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * scatter3d](#plotOptions.scatter3d).
 *
 * @extends   series,plotOptions.scatter3d
 * @product   highcharts
 * @apioption series.scatter3d
 */

/**
 * An array of data points for the series. For the `scatter3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 values. In this case, the values correspond
 * to `x,y,z`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 0, 1],
 *         [1, 8, 7],
 *         [2, 9, 2]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series'
 * [turboThreshold](#series.scatter3d.turboThreshold), this option is not
 * available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 2,
 *         z: 24,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 4,
 *         z: 12,
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
 * @extends   series.scatter.data
 * @product   highcharts
 * @apioption series.scatter3d.data
 */

/**
 * The z value for each data point.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.scatter3d.data.z
 */

''; // adds doclets above to transpiled file
