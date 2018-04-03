/**
 * Highcharts variwide module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * To do:
 * - When X axis is not categorized, the scale should reflect how the z values
 *   increase, like a horizontal stack. But then the actual X values aren't
 *   reflected the the axis.. Should we introduce a Z axis too?
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/AreaSeries.js';

var addEvent = H.addEvent,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    each = H.each,
    pick = H.pick;

/**
 * A variwide chart (related to marimekko chart) is a column chart with a
 * variable width expressing a third dimension.
 *
 * @extends {plotOptions.column}
 * @excluding boostThreshold,crisp,depth,edgeColor,edgeWidth,groupZPadding
 * @product highcharts
 * @sample {highcharts} highcharts/demo/variwide/
 *         Variwide chart
 * @since 6.0.0
 * @optionparent plotOptions.variwide
 */
seriesType('variwide', 'column', {
    /**
     * In a variwide chart, the point padding is 0 in order to express the
     * horizontal stacking of items.
     */
    pointPadding: 0,
    /**
     * In a variwide chart, the group padding is 0 in order to express the
     * horizontal stacking of items.
     */
    groupPadding: 0
}, {
    pointArrayMap: ['y', 'z'],
    parallelArrays: ['x', 'y', 'z'],
    processData: function () {
        var series = this;
        this.totalZ = 0;
        this.relZ = [];
        seriesTypes.column.prototype.processData.call(this);

        each(this.zData, function (z, i) {
            series.relZ[i] = series.totalZ;
            series.totalZ += z;
        });

        if (this.xAxis.categories) {
            this.xAxis.variwide = true;
        }
    },

    /**
     * Translate an x value inside a given category index into the distorted
     * axis translation.
     * @param  {Number} index The category index
     * @param  {Number} x The X pixel position in undistorted axis pixels
     * @return {Number}   Distorted X position
     */
    postTranslate: function (index, x) {

        var axis = this.xAxis,
            relZ = this.relZ,
            i = index,
            len = axis.len,
            totalZ = this.totalZ,
            linearSlotLeft = i / relZ.length * len,
            linearSlotRight = (i + 1) / relZ.length * len,
            slotLeft = (pick(relZ[i], totalZ) / totalZ) * len,
            slotRight = (pick(relZ[i + 1], totalZ) / totalZ) * len,
            xInsideLinearSlot = x - linearSlotLeft,
            ret;

        ret = slotLeft +
            xInsideLinearSlot * (slotRight - slotLeft) /
            (linearSlotRight - linearSlotLeft);

        return ret;
    },

    /**
     * Extend translation by distoring X position based on Z.
     */
    translate: function () {

        // Temporarily disable crisping when computing original shapeArgs
        var crispOption = this.options.crisp;
        this.options.crisp = false;

        seriesTypes.column.prototype.translate.call(this);

        // Reset option
        this.options.crisp = crispOption;

        var inverted = this.chart.inverted,
            crisp = this.borderWidth % 2 / 2;

        // Distort the points to reflect z dimension
        each(this.points, function (point, i) {
            var left = this.postTranslate(
                    i,
                    point.shapeArgs.x
                ),
                right = this.postTranslate(
                    i,
                    point.shapeArgs.x + point.shapeArgs.width
                );

            if (this.options.crisp) {
                left = Math.round(left) - crisp;
                right = Math.round(right) - crisp;
            }

            point.shapeArgs.x = left;
            point.shapeArgs.width = right - left;

            // Crosshair position (#8083)
            point.plotX = (left + right) / 2;
            point.crosshairWidth = right - left;

            point.tooltipPos[inverted ? 1 : 0] = this.postTranslate(
                i,
                point.tooltipPos[inverted ? 1 : 0]
            );
        }, this);
    }

// Point functions
}, {
    isValid: function () {
        return H.isNumber(this.y, true) && H.isNumber(this.z, true);
    }
});

H.Tick.prototype.postTranslate = function (xy, xOrY, index) {
    xy[xOrY] = this.axis.pos +
        this.axis.series[0].postTranslate(index, xy[xOrY] - this.axis.pos);
};

// Same width as the point itself (#8083)
addEvent(H.Axis, 'afterDrawCrosshair', function (e) {
    if (this.variwide) {
        this.cross.attr('stroke-width', e.point && e.point.shapeArgs.width);
    }
});

addEvent(H.Tick, 'afterGetPosition', function (e) {
    var axis = this.axis,
        xOrY = axis.horiz ? 'x' : 'y';

    if (axis.categories && axis.variwide) {
        this[xOrY + 'Orig'] = e.pos[xOrY];
        this.postTranslate(e.pos, xOrY, this.pos);
    }
});

H.wrap(H.Tick.prototype, 'getLabelPosition', function (
    proceed,
    x,
    y,
    label,
    horiz,
    labelOptions,
    tickmarkOffset,
    index
) {
    var args = Array.prototype.slice.call(arguments, 1),
        xy,
        xOrY = horiz ? 'x' : 'y';

    // Replace the x with the original x
    if (this.axis.variwide && typeof this[xOrY + 'Orig'] === 'number') {
        args[horiz ? 0 : 1] = this[xOrY + 'Orig'];
    }

    xy = proceed.apply(this, args);

    // Post-translate
    if (this.axis.variwide && this.axis.categories) {
        this.postTranslate(xy, xOrY, index);
    }
    return xy;
});



/**
 * A `variwide` series. If the [type](#series.variwide.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @extends series,plotOptions.variwide
 * @product highcharts
 * @apioption series.variwide
 */

/**
 * An array of data points for the series. For the `variwide` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,z`. If the first value is a string, it is applied
 * as the name of the point, and the `x` value is inferred. The `x`
 * value can also be omitted, in which case the inner arrays should
 * be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart` and
 * `pointInterval` given in the series options.
 *
 *  ```js
 *     data: [
 *         [0, 1, 2],
 *         [1, 5, 5],
 *         [2, 0, 2]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.variwide.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 1,
 *         z: 1,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 5,
 *         z: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type {Array<Object|Array>}
 * @extends series.line.data
 * @excluding marker
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
 * @product highcharts
 * @apioption series.variwide.data
 */

/**
 * The relative width for each column. The widths are distributed so they sum
 * up to the X axis length.
 *
 * @type {Number}
 * @product highcharts
 * @apioption series.variwide.data.z
 */
