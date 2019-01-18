/**
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';

var seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.mapline
 *
 * @augments Highcharts.Series
 */
seriesType('mapline', 'map'

    /**
     * A mapline series is a special case of the map series where the value
     * colors are applied to the strokes rather than the fills. It can also be
     * used for freeform drawing, like dividers, in the map.
     *
     * @sample maps/demo/mapline-mappoint/
     *         Mapline and map-point chart
     *
     * @extends      plotOptions.map
     * @product      highmaps
     * @optionparent plotOptions.mapline
     */
    , {
        /**
         * The width of the map line.
         */
        lineWidth: 1,

        /**
         * Fill color for the map line shapes
         *
         * @type {Highcharts.ColorString}
         */
        fillColor: 'none'
    }, {

        type: 'mapline',

        colorProp: 'stroke',

        pointAttrToOptions: {
            'stroke': 'color',
            'stroke-width': 'lineWidth'
        },

        /**
     * Get presentational attributes
     *
     * @private
     * @function Highcharts.seriesTypes.mapline#pointAttribs
     *
     * @param {Highcharts.Point} point
     *
     * @param {string} state
     *
     * @return {Highcharts.Dictionary<*>}
     */
        pointAttribs: function (point, state) {
            var attr = seriesTypes.map.prototype.pointAttribs.call(
                this,
                point,
                state
            );

            // The difference from a map series is that the stroke takes the
            // point color
            attr.fill = this.options.fillColor;

            return attr;
        },

        drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol

    });

/**
 * A `mapline` series. If the [type](#series.mapline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.mapline
 * @excluding dataParser, dataURL, marker
 * @product   highmaps
 * @apioption series.mapline
 */

/**
 * An array of data points for the series. For the `mapline` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `value` options. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of arrays with 2 values. In this case, the values correspond
 * to `[hc-key, value]`. Example:
 *
 *  ```js
 *     data: [
 *         ['us-ny', 0],
 *         ['us-mi', 5],
 *         ['us-tx', 3],
 *         ['us-ak', 5]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.map.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         value: 6,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         value: 6,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<number|Array<string,number>|object>}
 * @product   highmaps
 * @apioption series.mapline.data
 */
