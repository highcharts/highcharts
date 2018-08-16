/**
 * Vector plot series module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

var each = H.each,
    seriesType = H.seriesType;

/**
 * A vector plot is a type of cartesian chart where each point has an X and Y
 * position, a length and a direction. Vectors are drawn as arrows.
 *
 * @extends plotOptions.scatter
 * @excluding boostThreshold,marker,connectEnds,connectNulls,cropThreshold,
 *            dashStyle,gapSize,gapUnit,dataGrouping,linecap,shadow,stacking,
 *            step
 * @product highcharts highstock
 * @sample {highcharts|highstock} highcharts/demo/vector-plot/
 *         Vector pot
 * @since 6.0.0
 * @optionparent plotOptions.vector
 */
seriesType('vector', 'scatter', {

    /**
     * The line width for each vector arrow.
     */
    lineWidth: 2,

    /**
     * @ignore
     */
    marker: null,
    /**
     * What part of the vector it should be rotated around. Can be one of
     * `start`, `center` and `end`. When `start`, the vectors will start from
     * the given [x, y] position, and when `end` the vectors will end in the
     * [x, y] position.
     *
     * @sample  highcharts/plotoptions/vector-rotationorigin-start/
     *          Rotate from start
     * @validvalue ["start", "center", "end"]
     */
    rotationOrigin: 'center',
    states: {
        hover: {
            /**
             * Additonal line width for the vector errors when they are hovered.
             */
            lineWidthPlus: 1
        }
    },
    tooltip: {
        pointFormat: '<b>[{point.x}, {point.y}]</b><br/>Length: <b>{point.length}</b><br/>Direction: <b>{point.direction}\u00B0</b><br/>'
    },
    /**
     * Maximum length of the arrows in the vector plot. The individual arrow
     * length is computed between 0 and this value.
     */
    vectorLength: 20

}, {
    pointArrayMap: ['y', 'length', 'direction'],
    parallelArrays: ['x', 'y', 'length', 'direction'],

    /**
     * Get presentational attributes.
     */
    pointAttribs: function (point, state) {
        var options = this.options,
            stroke = point.color || this.color,
            strokeWidth = this.options.lineWidth;

        if (state) {
            stroke = options.states[state].color || stroke;
            strokeWidth =
                (options.states[state].lineWidth || strokeWidth) +
                (options.states[state].lineWidthPlus || 0);
        }

        return {
            'stroke': stroke,
            'stroke-width': strokeWidth
        };
    },
    markerAttribs: H.noop,
    getSymbol: H.noop,

    /**
     * Create a single arrow. It is later rotated around the zero
     * centerpoint.
     */
    arrow: function (point) {
        var path,
            fraction = point.length / this.lengthMax,
            u = fraction * this.options.vectorLength / 20,
            o = {
                start: 10 * u,
                center: 0,
                end: -10 * u
            }[this.options.rotationOrigin] || 0;

        // The stem and the arrow head. Draw the arrow first with rotation 0,
        // which is the arrow pointing down (vector from north to south).
        path = [
            'M', 0, 7 * u + o, // base of arrow
            'L', -1.5 * u, 7 * u + o,
            0, 10 * u + o,
            1.5 * u, 7 * u + o,
            0, 7 * u + o,
            0, -10 * u + o// top
        ];

        return path;
    },

    translate: function () {
        H.Series.prototype.translate.call(this);

        this.lengthMax = H.arrayMax(this.lengthData);
    },


    drawPoints: function () {

        var chart = this.chart;

        each(this.points, function (point) {
            var plotX = point.plotX,
                plotY = point.plotY;

            if (chart.isInsidePlot(plotX, plotY, chart.inverted)) {

                if (!point.graphic) {
                    point.graphic = this.chart.renderer
                        .path()
                        .add(this.markerGroup);
                }
                point.graphic
                    .attr({
                        d: this.arrow(point),
                        translateX: plotX,
                        translateY: plotY,
                        rotation: point.direction
                    })
                    .attr(this.pointAttribs(point));

            } else if (point.graphic) {
                point.graphic = point.graphic.destroy();
            }

        }, this);
    },

    drawGraph: H.noop,

    /*
    drawLegendSymbol: function (legend, item) {
        var options = legend.options,
            symbolHeight = legend.symbolHeight,
            square = options.squareSymbol,
            symbolWidth = square ? symbolHeight : legend.symbolWidth,
            path = this.arrow.call({
                lengthMax: 1,
                options: {
                    vectorLength: symbolWidth
                }
            }, {
                length: 1
            });

        item.legendLine = this.chart.renderer.path(path)
        .addClass('highcharts-point')
        .attr({
            zIndex: 3,
            translateY: symbolWidth / 2,
            rotation: 270,
            'stroke-width': 1,
            'stroke': 'black'
        }).add(item.legendGroup);

    },
    */

    /**
     * Fade in the arrows on initiating series.
     */
    animate: function (init) {
        if (init) {
            this.markerGroup.attr({
                opacity: 0.01
            });
        } else {
            this.markerGroup.animate({
                opacity: 1
            }, H.animObject(this.options.animation));

            this.animate = null;
        }
    }
});


/**
 * A `vector` series. If the [type](#series.vector.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @extends series,plotOptions.vector
 * @excluding dataParser,dataURL
 * @product highcharts highstock
 * @apioption series.vector
 */

/**
 * An array of data points for the series. For the `vector` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of arrays with 4 values. In this case, the values correspond
 * to `x,y,length,direction`. If the first value is a string, it is applied as
 * the name of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 0, 10, 90],
 *         [0, 1, 5, 180],
 *         [1, 1, 2, 270]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.area.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 0,
 *         y: 0,
 *         name: "Point2",
 *         length: 10,
 *         direction: 90
 *     }, {
 *         x: 1,
 *         y: 1,
 *         name: "Point1",
 *         direction: 270
 *     }]
 *  ```
 *
 * @type {Array<Object|Array|Number>}
 * @extends series.line.data
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
 * @product highcharts highstock
 * @apioption series.vector.data
 */

/**
 * The length of the vector. The rendered length will relate to the
 * `vectorLength` setting.
 *
 * @type {Number}
 * @product highcharts highstock
 * @apioption series.vector.data.length
 */

/**
 * The vector direction in degrees, where 0 is north (pointing towards south).
 *
 * @type {Number}
 * @product highcharts highstock
 * @apioption series.vector.data.direction
 */
