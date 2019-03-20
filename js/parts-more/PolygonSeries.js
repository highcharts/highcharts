/* *
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
import '../parts/Legend.js';
import '../parts/ScatterSeries.js';

var LegendSymbolMixin = H.LegendSymbolMixin,
    noop = H.noop,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

/**
 * A polygon series can be used to draw any freeform shape in the cartesian
 * coordinate system. A fill is applied with the `color` option, and
 * stroke is applied through `lineWidth` and `lineColor` options. Requires
 * the `highcharts-more.js` file.
 *
 * @sample {highcharts} highcharts/demo/polygon/
 *         Polygon
 * @sample {highstock} highcharts/demo/polygon/
 *         Polygon
 *
 * @extends      plotOptions.scatter
 * @since        4.1.0
 * @excluding    jitter, softThreshold, threshold
 * @product      highcharts highstock
 * @optionparent plotOptions.polygon
 */
seriesType('polygon', 'scatter', {
    marker: {
        enabled: false,
        states: {
            hover: {
                enabled: false
            }
        }
    },
    stickyTracking: false,
    tooltip: {
        followPointer: true,
        pointFormat: ''
    },
    trackByArea: true

// Prototype members
}, {
    type: 'polygon',
    getGraphPath: function () {

        var graphPath = Series.prototype.getGraphPath.call(this),
            i = graphPath.length + 1;

        // Close all segments
        while (i--) {
            if ((i === graphPath.length || graphPath[i] === 'M') && i > 0) {
                graphPath.splice(i, 0, 'z');
            }
        }
        this.areaPath = graphPath;
        return graphPath;
    },
    drawGraph: function () {
        // Hack into the fill logic in area.drawGraph
        this.options.fillColor = this.color;
        seriesTypes.area.prototype.drawGraph.call(this);
    },
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    drawTracker: Series.prototype.drawTracker,
    setStackedPoints: noop // No stacking points on polygons (#5310)
});


/**
 * A `polygon` series. If the [type](#series.polygon.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.polygon
 * @excluding dataParser, dataURL, stack
 * @product   highcharts highstock
 * @apioption series.polygon
 */

/**
 * An array of data points for the series. For the `polygon` series
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
 *    data: [
 *        [0, 10],
 *        [1, 3],
 *        [2, 1]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.polygon.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 1,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 8,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
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
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.polygon.data
 */
