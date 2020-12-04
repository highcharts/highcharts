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
import A from './Animation/AnimationUtilities.js';
var animate = A.animate;
import H from './Globals.js';
import Point from '../Core/Series/Point.js';
import U from './Utilities.js';
var extend = U.extend, isObject = U.isObject, objectEach = U.objectEach, pick = U.pick;
/* eslint-disable valid-jsdoc */
/**
 * Remove settings that have not changed, to avoid unnecessary rendering or
 * computing (#9197).
 * @private
 */
H.cleanRecursively = function (newer, older) {
    var result = {};
    objectEach(newer, function (val, key) {
        var ob;
        // Dive into objects (except DOM nodes)
        if (isObject(newer[key], true) &&
            !newer.nodeType && // #10044
            older[key]) {
            ob = H.cleanRecursively(newer[key], older[key]);
            if (Object.keys(ob).length) {
                result[key] = ob;
            }
            // Arrays, primitives and DOM nodes are copied directly
        }
        else if (isObject(newer[key]) ||
            newer[key] !== older[key]) {
            result[key] = newer[key];
        }
    });
    return result;
};
// extend the Point prototype for dynamic methods
extend(Point.prototype, /** @lends Highcharts.Point.prototype */ {
    /**
     * Update point with new options (typically x/y data) and optionally redraw
     * the series.
     *
     * @sample highcharts/members/point-update-column/
     *         Update column value
     * @sample highcharts/members/point-update-pie/
     *         Update pie slice
     * @sample maps/members/point-update/
     *         Update map area value in Highmaps
     *
     * @function Highcharts.Point#update
     *
     * @param {Highcharts.PointOptionsType} options
     *        The point options. Point options are handled as described under
     *        the `series.type.data` item for each series type. For example
     *        for a line series, if options is a single number, the point will
     *        be given that number as the marin y value. If it is an array, it
     *        will be interpreted as x and y values respectively. If it is an
     *        object, advanced options are applied.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after the point is updated. If doing
     *        more operations on the chart, it is best practice to set
     *        `redraw` to false and call `chart.redraw()` after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @return {void}
     *
     * @fires Highcharts.Point#event:update
     */
    update: function (options, redraw, animation, runEvent) {
        var point = this, series = point.series, graphic = point.graphic, i, chart = series.chart, seriesOptions = series.options;
        redraw = pick(redraw, true);
        /**
         * @private
         */
        function update() {
            point.applyOptions(options);
            // Update visuals, #4146
            // Handle dummy graphic elements for a11y, #12718
            var hasDummyGraphic = graphic && point.hasDummyGraphic;
            var shouldDestroyGraphic = point.y === null ? !hasDummyGraphic : hasDummyGraphic;
            if (graphic && shouldDestroyGraphic) {
                point.graphic = graphic.destroy();
                delete point.hasDummyGraphic;
            }
            if (isObject(options, true)) {
                // Destroy so we can get new elements
                if (graphic && graphic.element) {
                    // "null" is also a valid symbol
                    if (options &&
                        options.marker &&
                        typeof options.marker.symbol !== 'undefined') {
                        point.graphic = graphic.destroy();
                    }
                }
                if (options && options.dataLabels && point.dataLabel) {
                    point.dataLabel = point.dataLabel.destroy(); // #2468
                }
                if (point.connector) {
                    point.connector = point.connector.destroy(); // #7243
                }
            }
            // record changes in the parallel arrays
            i = point.index;
            series.updateParallelArrays(point, i);
            // Record the options to options.data. If the old or the new config
            // is an object, use point options, otherwise use raw options
            // (#4701, #4916).
            seriesOptions.data[i] = (isObject(seriesOptions.data[i], true) ||
                isObject(options, true)) ?
                point.options :
                pick(options, seriesOptions.data[i]);
            // redraw
            series.isDirty = series.isDirtyData = true;
            if (!series.fixedBox && series.hasCartesianSeries) { // #1906, #2320
                chart.isDirtyBox = true;
            }
            if (seriesOptions.legendType === 'point') { // #1831, #1885
                chart.isDirtyLegend = true;
            }
            if (redraw) {
                chart.redraw(animation);
            }
        }
        // Fire the event with a default handler of doing the update
        if (runEvent === false) { // When called from setData
            update();
        }
        else {
            point.firePointEvent('update', { options: options }, update);
        }
    },
    /**
     * Remove a point and optionally redraw the series and if necessary the axes
     *
     * @sample highcharts/plotoptions/series-point-events-remove/
     *         Remove point and confirm
     * @sample highcharts/members/point-remove/
     *         Remove pie slice
     * @sample maps/members/point-remove/
     *         Remove selected points in Highmaps
     *
     * @function Highcharts.Point#remove
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call. When
     *        doing more operations on the chart, for example running
     *        `point.remove()` in a loop, it is best practice to set `redraw`
     *        to false and call `chart.redraw()` after.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=false]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @return {void}
     */
    remove: function (redraw, animation) {
        this.series.removePoint(this.series.data.indexOf(this), redraw, animation);
    }
});
