/* *
 * Highcharts variwide module
 *
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/AreaSeries.js';

var addEvent = H.addEvent,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    pick = H.pick;

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.variwide
 *
 * @augments Highcharts.Series
 */
seriesType('variwide', 'column'

/**
 * A variwide chart (related to marimekko chart) is a column chart with a
 * variable width expressing a third dimension.
 *
 * @sample {highcharts} highcharts/demo/variwide/
 *         Variwide chart
 * @sample {highcharts} highcharts/series-variwide/inverted/
 *         Inverted variwide chart
 * @sample {highcharts} highcharts/series-variwide/datetime/
 *         Variwide columns on a datetime axis
 *
 * @extends      plotOptions.column
 * @since        6.0.0
 * @product      highcharts
 * @excluding    boostThreshold, crisp, depth, edgeColor, edgeWidth,
 *               groupZPadding
 * @optionparent plotOptions.variwide
 */
, {
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
    processData: function (force) {
        this.totalZ = 0;
        this.relZ = [];
        seriesTypes.column.prototype.processData.call(this, force);

        (this.xAxis.reversed ?
                this.zData.slice().reverse() :
                this.zData).forEach(
            function (z, i) {
                this.relZ[i] = this.totalZ;
                this.totalZ += z;
            },
            this
        );

        if (this.xAxis.categories) {
            this.xAxis.variwide = true;
            this.xAxis.zData = this.zData; // Used for label rank
        }
    },

    /**
     * Translate an x value inside a given category index into the distorted
     * axis translation.
     *
     * @private
     * @function Highcharts.Series#postTranslate
     *
     * @param {number} index
     *        The category index
     *
     * @param {number} x
     *        The X pixel position in undistorted axis pixels
     *
     * @return {number}
     *         Distorted X position
     */
    postTranslate: function (index, x, point) {

        var axis = this.xAxis,
            relZ = this.relZ,
            i = axis.reversed ? relZ.length - index : index,
            goRight = axis.reversed ? -1 : 1,
            len = axis.len,
            totalZ = this.totalZ,
            linearSlotLeft = i / relZ.length * len,
            linearSlotRight = (i + goRight) / relZ.length * len,
            slotLeft = (pick(relZ[i], totalZ) / totalZ) * len,
            slotRight = (pick(relZ[i + goRight], totalZ) / totalZ) * len,
            xInsideLinearSlot = x - linearSlotLeft,
            ret;

        // Set crosshairWidth for every point (#8173)
        if (point) {
            point.crosshairWidth = slotRight - slotLeft;
        }

        ret = slotLeft +
            xInsideLinearSlot * (slotRight - slotLeft) /
            (linearSlotRight - linearSlotLeft);

        return ret;
    },

    // Extend translation by distoring X position based on Z.
    translate: function () {

        // Temporarily disable crisping when computing original shapeArgs
        var crispOption = this.options.crisp,
            xAxis = this.xAxis;
        this.options.crisp = false;

        seriesTypes.column.prototype.translate.call(this);

        // Reset option
        this.options.crisp = crispOption;

        var inverted = this.chart.inverted,
            crisp = this.borderWidth % 2 / 2;

        // Distort the points to reflect z dimension
        this.points.forEach(function (point, i) {
            var left, right;

            if (xAxis.variwide) {
                left = this.postTranslate(
                    i,
                    point.shapeArgs.x,
                    point
                );

                right = this.postTranslate(
                    i,
                    point.shapeArgs.x + point.shapeArgs.width
                );

            // For linear or datetime axes, the variwide column should start
            // with X and extend Z units, without modifying the axis.
            } else {
                left = point.plotX;
                right = xAxis.translate(
                    point.x + point.z,
                    0,
                    0,
                    0,
                    1
                );
            }

            if (this.options.crisp) {
                left = Math.round(left) - crisp;
                right = Math.round(right) - crisp;
            }

            point.shapeArgs.x = left;
            point.shapeArgs.width = right - left;

            // Crosshair position (#8083)
            point.plotX = (left + right) / 2;

            // Adjust the tooltip position
            if (!inverted) {
                point.tooltipPos[0] =
                    point.shapeArgs.x + point.shapeArgs.width / 2;
            } else {
                point.tooltipPos[1] =
                    xAxis.len - point.shapeArgs.x - point.shapeArgs.width / 2;
            }
        }, this);
    }

// Point functions
}, {
    isValid: function () {
        return H.isNumber(this.y, true) && H.isNumber(this.z, true);
    }
});

H.Tick.prototype.postTranslate = function (xy, xOrY, index) {
    var axis = this.axis,
        pos = xy[xOrY] - axis.pos;

    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    pos = axis.series[0].postTranslate(index, pos);

    if (!axis.horiz) {
        pos = axis.len - pos;
    }
    xy[xOrY] = axis.pos + pos;
};

// Same width as the category (#8083)
addEvent(H.Axis, 'afterDrawCrosshair', function (e) {
    if (this.variwide && this.cross) {
        this.cross.attr('stroke-width', e.point && e.point.crosshairWidth);
    }
});

// On a vertical axis, apply anti-collision logic to the labels.
addEvent(H.Axis, 'afterRender', function () {
    var axis = this;
    if (!this.horiz && this.variwide) {
        this.chart.labelCollectors.push(function () {
            return axis.tickPositions.map(function (pos, i) {
                var label = axis.ticks[pos].label;
                label.labelrank = axis.zData[i];
                return label;
            });
        });
    }
});

addEvent(H.Tick, 'afterGetPosition', function (e) {
    var axis = this.axis,
        xOrY = axis.horiz ? 'x' : 'y';

    if (axis.variwide) {
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
 * A `variwide` series. If the [type](#series.variwide.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.variwide
 * @product   highcharts
 * @apioption series.variwide
 */

/**
 * An array of data points for the series. For the `variwide` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values
 *    correspond to `x,y,z`. If the first value is a string, it is applied as
 *    the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 2.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *
 *    ```js
 *       data: [
 *           [0, 1, 2],
 *           [1, 5, 5],
 *           [2, 0, 2]
 *       ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.variwide.turboThreshold), this option is not
 *    available.
 *
 *    ```js
 *       data: [{
 *           x: 1,
 *           y: 1,
 *           z: 1,
 *           name: "Point2",
 *           color: "#00FF00"
 *       }, {
 *           x: 1,
 *           y: 5,
 *           z: 4,
 *           name: "Point1",
 *           color: "#FF00FF"
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
 * @type      {Array<Array<number>|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts
 * @apioption series.variwide.data
 */

/**
 * The relative width for each column. On a category axis, the widths are
 * distributed so they sum up to the X axis length. On linear and datetime axes,
 * the columns will be laid out from the X value and Z units along the axis.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.variwide.data.z
 */
